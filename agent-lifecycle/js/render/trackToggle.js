import { h } from './dom.js';
import { t } from '../engine/i18n.js';
import { UI } from '../i18n/ui.js';

export function renderTrackToggle(root, track, lang, onChange) {
  const button = (code, label) => h('button', {
    type: 'button',
    class: 'lang-btn',
    'data-track': code,
    'aria-pressed': String(track === code),
    text: t(label, lang).text,
    onclick: () => { if (code !== track) onChange(code); },
  });
  root.replaceChildren(
    h('div', { class: 'lang-toggle', role: 'group', 'aria-label': t(UI.trackLabel, lang).text }, [
      button('general', UI.trackGeneral),
      button('tech', UI.trackTech),
    ]),
  );
}
