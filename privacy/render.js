// Privacy policy page: what Queuecraft keeps (only on the device) and where.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { PRIVACY_TEXT as T, GITHUB_PRIVACY_URL, ISSUES_URL } from './text.js';

export function renderPrivacy(root, lang) {
  const tr = (key) => t(T[key], lang).text;
  const section = (n, extra = []) => h('section', { class: 'ref-section', 'data-section': String(n) }, [
    h('h2', { text: tr(`s${n}.heading`) }),
    h('p', { text: tr(`s${n}.body`) }),
    ...extra,
  ]);
  const out = (attr, href, key) => h('p', {}, [h('a', { [attr]: true, href, rel: 'noopener', text: tr(key) })]);
  root.replaceChildren(
    h('header', { class: 'glossary-head' }, [
      h('a', { class: 'home-link', 'data-back': true, href: '../', text: '← Queuecraft' }),
      h('h1', { text: tr('title') }),
      h('p', { class: 'tagline', text: tr('intro') }),
      h('p', { class: 'pv-meta', text: tr('meta') }),
    ]),
    section(1),
    section(2, [
      h('ul', { 'data-stored': true }, [1, 2, 3, 4].map((i) => h('li', { text: tr(`s2.item${i}`) }))),
      h('p', { 'data-backup-note': true, text: tr('s2.backup') }),
    ]),
    section(3),
    section(4, [out('data-github-privacy', GITHUB_PRIVACY_URL, 's4.link')]),
    section(5),
    section(6),
    section(7),
    section(8, [out('data-issues', ISSUES_URL, 's8.link')]),
  );
}
