// "Add to Home Screen" sheet: Miso, two tabs (iPhone Safari / Android Chrome),
// three pictured steps each, what to do after, and when progress can be lost.
// Modelled on Learning-Python's install sheet.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { INSTALL_UI as UI } from './install-data.js';

export function installPlatform(ua) {
  return /Android/i.test(String(ua || '')) ? 'android' : 'ios';
}

const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const frame = (inner) => `<svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="10" fill="#fff" stroke="#22304A" stroke-width="2.5"/>${inner}</svg>`;
const ICONS = {
  share: () => frame('<path d="M24 12v17M18 18l6-6 6 6" fill="none" stroke="#2F7BE0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 23h-2v13h18V23h-2" fill="none" stroke="#2F7BE0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
  add: () => frame('<rect x="14" y="14" width="20" height="20" rx="5" fill="none" stroke="#22304A" stroke-width="2.5"/><path d="M24 19v10M19 24h10" stroke="#22304A" stroke-width="2.5" stroke-linecap="round"/>'),
  done: (word) => frame(`<text x="24" y="29" text-anchor="middle" font-size="12" font-weight="800" fill="#1F6FD1" font-family="-apple-system, sans-serif">${esc(word)}</text>`),
  menu: () => frame('<circle cx="24" cy="15" r="3" fill="#22304A"/><circle cx="24" cy="24" r="3" fill="#22304A"/><circle cx="24" cy="33" r="3" fill="#22304A"/>'),
  install: (word) => frame(`<text x="24" y="29" text-anchor="middle" font-size="12" font-weight="800" fill="#1E8E5A" font-family="sans-serif">${esc(word)}</text>`),
};

// Opens the sheet; returns { close }. opts.platform picks the first tab;
// opts.focusBack() finds the button again if the page was redrawn meanwhile.
// A second call while open returns the open one.
export function openInstallSheet(doc, lang, opts = {}) {
  const tr = (entry) => entry[lang] ?? entry.ko;
  const open = doc.querySelector('[data-install-sheet]');
  if (open) return { close: () => open.querySelector('[data-install-ok]')?.click() };
  const first = opts.platform === 'android' ? 'android' : 'ios';
  const back = doc.activeElement;

  const pic = (svg) => {
    const span = h('span', { class: 'ins-pic' });
    span.innerHTML = svg;
    return span;
  };
  const steps = (list) => h('ol', { class: 'ins-steps' }, list.map(([svg, text], i) => h('li', {}, [
    h('span', { class: 'ins-no', 'aria-hidden': 'true', text: String(i + 1) }),
    pic(svg),
    h('span', { 'data-step-text': true, text: tr(text) }),
  ])));
  const panel = (p, list, after, why) => h('section', {
    class: 'ins-panel', id: `ins-${p}`, 'data-p': p, role: 'tabpanel', 'aria-labelledby': `ins-tab-${p}`, hidden: p !== first,
  }, [
    steps(list),
    h('p', { class: 'ins-after', text: tr(after) }),
    h('p', { class: 'ins-why', text: tr(why) }),
  ]);
  const tab = (p, label) => h('button', {
    type: 'button', role: 'tab', class: 'ins-tab', id: `ins-tab-${p}`, 'data-p': p,
    'aria-selected': String(p === first), 'aria-controls': `ins-${p}`, tabindex: p === first ? '0' : '-1', text: tr(label),
  });

  const ok = h('button', { type: 'button', class: 'btn primary ins-ok', 'data-install-ok': true, text: tr(UI.ok) });
  const tabs = h('div', { class: 'ins-tabs', role: 'tablist', 'aria-label': tr(UI.sheetTabs) }, [tab('ios', UI.tabIos), tab('android', UI.tabAndroid)]);
  const dialog = h('div', { class: 'ins-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ins-title' }, [
    h('div', { class: 'ins-miso' }, [
      h('img', { src: new URL('../assets/miso/wink.webp', import.meta.url).href, alt: '', width: 72, height: 104 }),
      h('p', { class: 'ins-bubble', text: tr(UI.sheetBubble) }),
    ]),
    h('h2', { id: 'ins-title', text: tr(UI.sheetTitle) }),
    tabs,
    panel('ios', [[ICONS.share(), UI.ios1], [ICONS.add(), UI.ios2], [ICONS.done(tr(UI.iconAdd)), UI.ios3]], UI.iosAfter, UI.iosWhy),
    panel('android', [[ICONS.menu(), UI.android1], [ICONS.add(), UI.android2], [ICONS.install(tr(UI.iconInstall)), UI.android3]], UI.androidAfter, UI.androidWhy),
    ok,
  ]);
  const wrap = h('div', { class: 'ins-back', 'data-install-sheet': true }, [dialog]);

  const pick = (p, focus) => {
    for (const b of tabs.querySelectorAll('[role="tab"]')) {
      const on = b.dataset.p === p;
      b.setAttribute('aria-selected', String(on));
      b.setAttribute('tabindex', on ? '0' : '-1');
      if (on && focus) b.focus({ preventScroll: true });
    }
    for (const s of dialog.querySelectorAll('[role="tabpanel"]')) s.hidden = s.dataset.p !== p;
  };
  // Everything behind the sheet is out of reach while it is open (keyboard and
  // screen readers too); what was already inert stays so afterwards.
  const quieted = [];
  const close = () => {
    for (const el of quieted) el.removeAttribute('inert');
    wrap.remove();
    doc.removeEventListener('keydown', onKey);
    // The settings page can redraw while the sheet is open (offline store ready).
    if (back && typeof back.focus === 'function' && doc.contains(back)) back.focus({ preventScroll: true });
    else opts.focusBack?.();
  };
  // Tab goes round the sheet's own stops: the chosen tab, then Got it.
  function onKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const stops = [tabs.querySelector('[role="tab"][tabindex="0"]'), ok];
    const at = stops.indexOf(doc.activeElement);
    event.preventDefault();
    const to = at === -1 ? 0 : (at + (event.shiftKey ? stops.length - 1 : 1)) % stops.length;
    stops[to].focus({ preventScroll: true });
  }
  tabs.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const now = event.target.closest('[role="tab"]')?.dataset.p;
    const to = event.key === 'Home' ? 'ios' : event.key === 'End' ? 'android' : now === 'ios' ? 'android' : 'ios';
    pick(to, true);
  });
  tabs.addEventListener('click', (event) => {
    const b = event.target.closest('[role="tab"]');
    if (b) pick(b.dataset.p, false);
  });
  wrap.addEventListener('click', (event) => { if (event.target === wrap) close(); });
  ok.addEventListener('click', close);
  doc.addEventListener('keydown', onKey);
  for (const el of doc.body.children) {
    if (!el.hasAttribute('inert')) { el.setAttribute('inert', ''); quieted.push(el); }
  }
  doc.body.append(wrap);
  ok.focus({ preventScroll: true });
  return { close };
}
