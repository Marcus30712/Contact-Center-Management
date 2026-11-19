// ② Five core teams: one card per team, one open at a time.
import { h } from '../../agent-lifecycle/js/render/dom.js';
import { t } from '../../agent-lifecycle/js/engine/i18n.js';
import { CODEX_UI as UI } from '../ui.js';
import { TEAMS } from '../data/teams.js';
import { expandCard, chip, flow } from './parts.js';

export function teamsBody(lang, state, redraw) {
  const tr = (text) => t(text, lang).text;
  const kpi = (k) => h('div', { class: 'cx-kpi', 'data-kpi': k.name }, [
    h('dt', {}, [k.name, k.glossary ? ' ' : null, k.glossary ? h('a', {
      class: 'glossary-link', 'data-glossary': k.glossary, href: `../glossary/#${k.glossary}`,
      'aria-label': `${tr(UI.glossaryLink)}: ${k.name}`, text: tr(UI.glossaryLink),
    }) : null]),
    h('dd', {}, [tr(k.def), h('span', { class: 'cx-why', text: tr(k.why) })]),
  ]);
  return [
    h('p', { class: 'cx-intro', text: tr(TEAMS.intro) }),
    h('div', { class: 'cx-cards' }, TEAMS.items.map((team, i) => expandCard({
      id: team.id, number: i + 1, title: tr(team.name), summary: tr(team.mission), open: state.team === team.id,
      marker: team.id === TEAMS.yours ? chip(tr(UI.yourTeam), 'you') : null,
      onToggle: (open) => {
        state.team = open ? team.id : null;
        redraw(`[data-card="${team.id}"] button`);
      },
      body: [
        h('h3', { text: tr(UI.roles) }),
        h('ul', { class: 'cx-chips' }, team.roles.map((r) => h('li', { text: r }))),
        h('h3', { text: tr(UI.kpis) }),
        h('dl', { class: 'cx-kpis' }, team.kpis.map(kpi)),
        h('h3', { text: tr(UI.flow) }),
        flow(team.flow.map(tr)),
      ],
    }))),
  ];
}
