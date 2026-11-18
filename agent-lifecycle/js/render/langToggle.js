import { h } from './dom.js';
import { UI } from '../i18n/ui.js';

export function renderLangToggle(root, lang, onChange) {
  const button = (code, label) => h('button', {
    type: 'button',
    class: 'lang-btn',
    'data-lang': code,
    'aria-pressed': String(lang === code),
    lang: code,
    text: label,
    onclick: () => { if (code !== lang) onChange(code); },
  });
  root.replaceChildren(
    h('div', { class: 'lang-toggle', role: 'group', 'aria-label': 'Language / 언어' }, [
      button('ko', UI.langKo.ko),
      button('en', UI.langEn.en),
    ]),
  );
}
