// First-run tour: lights the bottom menu one item at a time with a short line
// from Miso. Shown once on the home page; Settings can ask for it again.
import { TOUR_KEY, TOUR_STEPS, TOUR_UI } from './tour-data.js';
import { APPBAR_UI } from './appbar.js';

export function tourSeen(storage) {
  try {
    return storage?.getItem(TOUR_KEY) === 'done';
  } catch {
    return false;
  }
}

export function markTourSeen(storage) {
  try {
    storage?.setItem(TOUR_KEY, 'done');
  } catch { /* storage blocked: the tour shows again next visit */ }
}

// Asked for again from Settings (…?tour=1), or not seen yet. Storage that
// can't be read can't remember "seen" either, so the tour would come back on
// every visit: then it only shows on request.
export function shouldStartTour(storage, href) {
  if (new URL(href).searchParams.get('tour') === '1') return true;
  try {
    if (!storage) return false;
    storage.getItem(TOUR_KEY);
  } catch {
    return false;
  }
  return !tourSeen(storage);
}

// Centre the bubble over the item, but keep it inside the screen.
export function bubbleLeft(itemCenter, bubbleWidth, viewportWidth, margin = 12) {
  const most = viewportWidth - margin - bubbleWidth;
  return Math.max(margin, Math.min(itemCenter - bubbleWidth / 2, most));
}

// Resolves with the bottom menu once it is on the page (the home page's own
// script runs before the menu's).
export function whenAppBar(doc) {
  const now = doc.querySelector('nav.appbar');
  if (now) return Promise.resolve(now);
  return new Promise((resolve) => {
    const watch = new doc.defaultView.MutationObserver(() => {
      const nav = doc.querySelector('nav.appbar');
      if (nav) { watch.disconnect(); resolve(nav); }
    });
    watch.observe(doc.body, { childList: true, subtree: true });
  });
}

// Opens the tour over the bottom menu. opts.onClose() runs once when it closes.
export function startTour(doc, lang, storage, opts = {}) {
  const open = doc.querySelector('[data-tour]');
  if (open) return { close: () => open.remove() };
  const win = doc.defaultView;
  const say = (entry) => entry[lang] ?? entry.ko;
  const back = doc.activeElement;
  if (!doc.querySelector('link[data-tour-css]')) {
    const css = doc.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('./tour.css', import.meta.url).href;
    css.dataset.tourCss = '';
    doc.head.append(css);
  }

  const el = (tag, attrs = {}, text) => {
    const node = doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const overlay = el('div', { class: 'tour', 'data-tour': '' });
  const dialog = el('div', { class: 'tour-bubble', role: 'dialog', 'aria-modal': 'true' });
  const face = el('img', { class: 'tour-face', src: new URL('../assets/miso/smile.webp', import.meta.url).href, alt: '', width: '48', height: '48' });
  const text = el('p', { class: 'tour-text', id: 'tour-text', 'data-tour-text': '', 'aria-live': 'polite' });
  dialog.setAttribute('aria-describedby', 'tour-text');
  const count = el('span', { class: 'tour-count', 'data-tour-count': '' });
  const skip = el('button', { type: 'button', class: 'btn', 'data-tour-skip': '' }, say(TOUR_UI.skip));
  const next = el('button', { type: 'button', class: 'btn primary', 'data-tour-next': '' });
  const tail = el('span', { class: 'tour-tail', 'aria-hidden': 'true' });
  const row = el('div', { class: 'tour-actions' });
  row.append(count, skip, next);
  dialog.append(face, text, row, tail);
  overlay.append(dialog);
  doc.body.append(overlay);

  let at = 0;
  let closed = false;
  const nav = () => doc.querySelector('nav.appbar');
  const item = () => nav()?.querySelector(`a[data-item="${TOUR_STEPS[at].id}"]`);

  function place() {
    const a = item();
    const bar = nav();
    if (!a || !bar) return;
    const r = a.getBoundingClientRect();
    const center = r.left + r.width / 2;
    const width = dialog.offsetWidth || 280;
    const left = bubbleLeft(center, width, win.innerWidth || width + 24);
    dialog.style.left = `${left}px`;
    dialog.style.bottom = `${(win.innerHeight || 0) - bar.getBoundingClientRect().top + 12}px`;
    tail.style.left = `${Math.max(16, Math.min(center - left, width - 16))}px`;
  }

  function show() {
    const step = TOUR_STEPS[at];
    const bar = nav();
    bar?.classList.add('tour-on');
    // The menu is only shown, never used, while the tour is open.
    bar?.setAttribute('inert', '');
    for (const a of bar?.querySelectorAll('a[data-item]') ?? []) a.classList.toggle('tour-lit', a.dataset.item === step.id);
    dialog.setAttribute('aria-label', say(APPBAR_UI[step.id]));
    text.textContent = say(step.text);
    count.textContent = `${at + 1}/${TOUR_STEPS.length}`;
    next.textContent = say(at === TOUR_STEPS.length - 1 ? TOUR_UI.start : TOUR_UI.next);
    place();
  }

  function close() {
    if (closed) return;
    closed = true;
    markTourSeen(storage);
    win.removeEventListener('resize', place);
    doc.removeEventListener('keydown', onKey, true);
    overlay.remove();
    const bar = nav();
    bar?.classList.remove('tour-on');
    bar?.removeAttribute('inert');
    for (const a of bar?.querySelectorAll('a.tour-lit') ?? []) a.classList.remove('tour-lit');
    if (back && typeof back.focus === 'function' && doc.contains(back)) back.focus();
    opts.onClose?.();
  }

  skip.addEventListener('click', close);
  next.addEventListener('click', () => {
    if (at === TOUR_STEPS.length - 1) { close(); return; }
    at += 1;
    show();
    next.focus({ preventScroll: true });
  });
  // Listen on the whole page, so Esc and Tab still work if a tap on the dimmed
  // page has moved focus out of the bubble.
  function onKey(event) {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    // Two buttons: Tab and Shift+Tab move between them and never leave the bubble.
    event.preventDefault();
    const target = doc.activeElement === skip ? next : doc.activeElement === next ? skip : next;
    target.focus({ preventScroll: true });
  }
  doc.addEventListener('keydown', onKey, true);
  // A tap on the dimmed page keeps focus in the bubble.
  overlay.addEventListener('mousedown', (event) => { if (event.target === overlay) event.preventDefault(); });
  win.addEventListener('resize', place);
  // On a first visit the menu's and the tour's styles may still be loading;
  // the menu only sits at the bottom once they arrive, so place again then.
  for (const link of doc.querySelectorAll('link[data-tour-css], link[data-appbar-css]')) link.addEventListener('load', place);
  win.requestAnimationFrame?.(place);

  show();
  next.focus({ preventScroll: true });
  return { close };
}
