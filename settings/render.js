// Settings page: language, display, progress backup, offline status, the
// install note and a footer with the version and policy links.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t, LANG_KEY } from '../agent-lifecycle/js/engine/i18n.js';
import { SETTINGS_UI as UI, APP_VERSION } from './data.js';
import { THEMES, loadTheme, saveTheme, applyTheme, makeBackup, readBackup, restoreBackup } from './engine.js';
import { HOME_UI } from '../home/data.js';
import { PRIVACY_TEXT } from '../privacy/text.js';
import { REFERENCES_TEXT } from '../references/text.js';

export function newSettingsView() {
  return { status: '', statusLang: null, pending: null, pick: async () => {} };
}

// opts: onLang(lang) to switch language, download(name, text) to save a file,
// today 'YYYY-MM-DD', offline true when the offline worker is ready, build the
// offline store's version (null when unknown).
export function renderSettings(root, lang, storage, view, opts) {
  const tr = (text) => t(text, lang).text;
  const redraw = (focus) => {
    renderSettings(root, lang, storage, view, opts);
    if (focus) root.querySelector(focus)?.focus();
  };
  const say = (text, inLang = lang) => {
    view.status = t(text, inLang).text;
    view.statusLang = inLang;
  };
  // A file was chosen: keep it for the question, or say it can't be read.
  view.pick = async (text) => {
    const data = readBackup(text);
    if (data) { view.pending = data; view.status = ''; }
    else { view.pending = null; say(UI.importBad); }
  };

  // One read-out line outside the redrawn area, so a new text is announced.
  if (view.statusLang && view.statusLang !== lang) view.status = '';
  let status = document.querySelector('[data-status]');
  if (!status) {
    status = h('p', { class: 'visually-hidden', role: 'status', 'data-status': true });
    document.body.append(status);
  }
  if (status.textContent !== view.status) status.textContent = view.status;

  // A radio group: one Tab stop (the chosen one); arrows, Home and End move and pick.
  const radios = (attr, items, current, label, onPick) => h('div', {
    class: 'st-seg', role: 'radiogroup', 'aria-label': label,
    onkeydown: (event) => {
      const at = items.findIndex(([value]) => value === event.target.getAttribute(attr));
      if (at === -1) return;
      const last = items.length - 1;
      const to = { ArrowRight: at === last ? 0 : at + 1, ArrowDown: at === last ? 0 : at + 1, ArrowLeft: at === 0 ? last : at - 1, ArrowUp: at === 0 ? last : at - 1, Home: 0, End: last }[event.key];
      if (to === undefined) return;
      event.preventDefault();
      onPick(items[to][0]);
    },
  }, items.map(([value, text]) => h('button', {
    type: 'button', role: 'radio', [attr]: value, 'aria-checked': String(value === current), tabindex: value === current ? '0' : '-1', text,
    onclick: () => onPick(value),
  })));
  const section = (heading, children) => h('section', { class: 'ref-section st-section' }, [h('h2', { text: tr(heading) }), ...children]);
  const theme = loadTheme(storage);

  const confirm = view.pending ? h('div', { class: 'st-confirm', 'data-confirm': true, role: 'group', 'aria-labelledby': 'st-ask', tabindex: '-1' }, [
    h('p', { id: 'st-ask' }, [h('strong', { text: tr(UI.importAsk) })]),
    h('p', { text: tr(UI.importAskNote) }),
    h('div', { class: 'st-actions' }, [
      h('button', { type: 'button', class: 'btn', 'data-cancel': true, text: tr(UI.cancel), onclick: () => { view.pending = null; redraw('[data-export]'); } }),
      h('button', { type: 'button', class: 'btn primary', 'data-replace': true, text: tr(UI.replace), onclick: replace }),
    ]),
  ]) : null;

  const fileInput = h('input', { type: 'file', accept: '.json,application/json', id: 'st-file', class: 'visually-hidden', 'data-import-file': true });
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files?.[0];
    if (!f) return;
    await view.pick(await f.text());
    // Land on the question, not on the button that can't be undone.
    redraw(view.pending ? '[data-confirm]' : '[data-export]');
  });

  root.replaceChildren(
    h('header', { class: 'glossary-head' }, [h('h1', { text: tr(UI.title) })]),
    section(UI.langHeading, [radios('data-set-lang', [['ko', '한국어'], ['en', 'English']], lang, tr(UI.langHeading), (l) => { if (l !== lang) opts.onLang(l); })]),
    section(UI.themeHeading, [
      h('p', { class: 'muted', text: tr(UI.themeNote) }),
      radios('data-theme-pick', THEMES.map((v) => [v, tr({ system: UI.themeSystem, light: UI.themeLight, dark: UI.themeDark }[v])]), theme, tr(UI.themeHeading), (v) => {
        saveTheme(storage, v);
        applyTheme(document, v);
        redraw(`[data-theme-pick="${v}"]`);
      }),
    ]),
    section(UI.backupHeading, [
      h('p', { class: 'muted', text: tr(UI.backupNote) }),
      h('div', { class: 'st-actions' }, [
        h('button', { type: 'button', class: 'btn', 'data-export': true, text: tr(UI.export), onclick: exportFile }),
        // The real file input comes first so its keyboard focus can ring the label.
        fileInput,
        h('label', { class: 'btn', for: 'st-file', 'data-import': true, text: tr(UI.import) }),
      ]),
      confirm,
      h('p', { class: 'st-offline', 'data-offline': true, text: tr(opts.offline ? UI.offlineReady : UI.offlineWait) }),
    ]),
    section(UI.installHeading, [h('p', { 'data-install': true, text: tr(HOME_UI.install) })]),
    h('p', { class: 'st-footer', 'data-footer': true }, [
      `Queuecraft v${APP_VERSION}${opts.build ? ` (${opts.build.slice(0, 8)})` : ''} · `,
      h('a', { href: '../privacy/', 'data-privacy': true, text: tr(PRIVACY_TEXT.link) }),
      ' · ',
      h('a', { href: '../references/', 'data-references': true, text: tr(REFERENCES_TEXT.title) }),
    ]),
  );

  function exportFile() {
    const text = JSON.stringify(makeBackup(storage, opts.today), null, 2);
    opts.download(`queuecraft-backup-${opts.today}.json`, text);
    say(UI.exported);
    redraw('[data-export]');
  }

  function replace() {
    const data = view.pending;
    view.pending = null;
    if (!restoreBackup(storage, data)) { say(UI.importBad); redraw('[data-export]'); return; }
    applyTheme(document, loadTheme(storage));
    const fileLang = data[LANG_KEY] === 'en' || data[LANG_KEY] === 'ko' ? data[LANG_KEY] : lang;
    say(UI.imported, fileLang);
    if (fileLang !== lang) opts.onLang(fileLang);
    else redraw('[data-export]');
  }
}
