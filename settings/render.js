// Settings page: language, display, progress backup, offline status, the
// install note and a footer with the version and policy links.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t, LANG_KEY } from '../agent-lifecycle/js/engine/i18n.js';
import { SETTINGS_UI as UI, APP_VERSION } from './data.js';
import { THEMES, loadTheme, saveTheme, applyTheme, makeBackup, readBackup, restoreBackup, RESET_KEYS, resetLearning } from './engine.js';
import { INSTALL_UI } from './install-data.js';
import { openInstallSheet, installPlatform } from './install-sheet.js';
import { PRIVACY_TEXT } from '../privacy/text.js';
import { REFERENCES_TEXT } from '../references/text.js';

export function newSettingsView() {
  return { status: '', statusLang: null, pending: null, resetAsk: false, pick: async () => {} };
}

// opts: onLang(lang) to switch language, download(name, text) to save a file,
// today 'YYYY-MM-DD', offline true when the offline worker is ready, build the
// offline store's version (null when unknown).
import { ROLES, loadRole, saveRole } from '../shared/role.js';
import { ROLE_UI, ROLE_NAMES } from '../shared/role-data.js';

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
  const section = (heading, children, attrs = {}) => h('section', { class: 'ref-section st-section', ...attrs }, [h('h2', { text: tr(heading) }), ...children]);
  const theme = loadTheme(storage);

  const confirm = view.pending ? h('div', { class: 'st-confirm', 'data-confirm': true, role: 'group', 'aria-labelledby': 'st-ask', tabindex: '-1' }, [
    h('p', { id: 'st-ask' }, [h('strong', { text: tr(UI.importAsk) })]),
    h('p', { text: tr(UI.importAskNote) }),
    h('div', { class: 'st-actions' }, [
      h('button', { type: 'button', class: 'btn', 'data-cancel': true, text: tr(UI.cancel), onclick: () => { view.pending = null; redraw('[data-export]'); } }),
      h('button', { type: 'button', class: 'btn primary', 'data-replace': true, text: tr(UI.replace), onclick: replace }),
    ]),
  ]) : null;

  // "Reset learning" asks first; the focus lands on Cancel so Enter erases nothing.
  const resetAsk = view.resetAsk ? h('div', { class: 'st-confirm st-confirm-danger', 'data-reset-confirm': true, role: 'group', 'aria-labelledby': 'st-reset-ask' }, [
    h('p', { id: 'st-reset-ask' }, [h('strong', { text: tr(UI.resetAsk) })]),
    h('p', { text: tr(UI.resetAskNote) }),
    h('div', { class: 'st-actions' }, [
      h('button', { type: 'button', class: 'btn', 'data-reset-cancel': true, text: tr(UI.cancel), onclick: () => { view.resetAsk = false; redraw('[data-reset]'); } }),
      h('button', { type: 'button', class: 'btn st-danger-fill', 'data-reset-go': true, text: tr(UI.resetConfirm), onclick: eraseLearning }),
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
    section(ROLE_UI.settingsHeading, [
      h('p', { class: 'muted', text: tr(ROLE_UI.settingsNote) }),
      radios('data-set-role', ROLES.map((r) => [r, tr(ROLE_NAMES[r])]), loadRole(storage), tr(ROLE_UI.settingsHeading), (r) => {
        saveRole(storage, r);
        // The page goes to the new role's home (2026-11-26); without that, stay here.
        if (opts.onRole) opts.onRole(r);
        else redraw(`[data-set-role="${r}"]`);
      }),
    ], { 'data-role-section': true }),
    section(INSTALL_UI.tutorialHeading, [
      h('div', { class: 'st-row' }, [
        h('p', { class: 'st-row-label' }, [
          h('strong', { id: 'st-tut-label', text: tr(INSTALL_UI.tutorialRow) }),
          h('small', { class: 'muted', text: tr(INSTALL_UI.tutorialNote) }),
        ]),
        h('a', { class: 'btn', id: 'st-tut-view', href: '../?tour=1', 'data-tour-replay': true, 'aria-labelledby': 'st-tut-label st-tut-view', text: tr(INSTALL_UI.tutorialButton) }),
      ]),
    ], { 'data-tutorial': true }),
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
      h('div', { class: 'st-actions' }, [
        h('button', { type: 'button', class: 'btn st-danger', 'data-reset': true, text: tr(UI.reset), onclick: askReset }),
      ]),
      resetAsk,
      h('p', { class: 'st-offline', 'data-offline': true, text: tr(opts.offline ? UI.offlineReady : UI.offlineWait) }),
    ]),
    section(UI.installHeading, [
      h('p', { class: 'muted', 'data-install': true, text: tr(INSTALL_UI.installNote) }),
      h('button', { type: 'button', class: 'btn st-wide', 'data-install-open': true, text: tr(INSTALL_UI.installButton), onclick: () => openInstallSheet(document, lang, { platform: installPlatform(navigator.userAgent), focusBack: () => root.querySelector('[data-install-open]')?.focus({ preventScroll: true }) }) }),
    ]),
    h('p', { class: 'st-footer', 'data-footer': true }, [
      `Queuecraft v${APP_VERSION}${opts.build ? ` (${opts.build.slice(0, 8)})` : ''} · `,
      h('a', { href: '../privacy/', 'data-privacy': true, text: tr(PRIVACY_TEXT.link) }),
      ' · ',
      h('a', { href: '../references/', 'data-references': true, text: tr(REFERENCES_TEXT.title) }),
    ]),
  );

  function askReset() {
    view.pending = null;
    if (!RESET_KEYS.some((key) => { try { return storage?.getItem(key) != null; } catch { return false; } })) {
      say(UI.resetNone);
      redraw('[data-reset]');
      return;
    }
    view.resetAsk = true;
    view.status = '';
    redraw('[data-reset-cancel]');
  }

  function eraseLearning() {
    view.resetAsk = false;
    say(resetLearning(storage) ? UI.resetDone : UI.resetNone);
    redraw('[data-reset]');
  }

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
