// ③ Career matrix: pick a team, then a level on its ladder (top level first).
import { h } from '../../agent-lifecycle/js/render/dom.js';
import { t } from '../../agent-lifecycle/js/engine/i18n.js';
import { CODEX_UI as UI } from '../ui.js';
import { CAREER } from '../data/career.js';
import { tabs, chip, announce } from './parts.js';

const defaultLevel = (team) => (team.id === CAREER.you.team ? CAREER.you.level : team.levels[0].id);

export function careerBody(lang, state, redraw) {
  const tr = (text) => t(text, lang).text;
  const team = CAREER.teams.find((x) => x.id === state.careerTeam) ?? CAREER.teams.find((x) => x.id === CAREER.you.team);
  const level = team.levels.find((l) => l.id === state.careerLevel) ?? team.levels.find((l) => l.id === defaultLevel(team));
  const isYou = (l) => team.id === CAREER.you.team && l.id === CAREER.you.level;

  const detail = h('div', { class: 'cx-detail', 'data-level-detail': true }, [
    h('h3', {}, [tr(level.name), isYou(level) ? ' ' : null, isYou(level) ? chip(tr(UI.youAreHere), 'you') : null]),
    h('dl', { class: 'cx-facts' }, [
      h('dt', { text: tr(UI.coreRole) }), h('dd', { text: tr(level.role) }),
      h('dt', { text: tr(UI.skillsWork) }), h('dd', { text: tr(level.skills.work) }),
      level.skills.soft ? h('dt', { text: tr(UI.skillsSoft) }) : null,
      level.skills.soft ? h('dd', { text: tr(level.skills.soft) }) : null,
    ]),
    level.next
      ? h('div', { class: 'cx-next', 'data-next': true }, [chip(tr(UI.nextStep), 'next'), h('p', { text: tr(level.next) })])
      : h('p', { class: 'cx-note', text: tr(UI.topLevel) }),
  ]);

  return [
    h('div', { class: 'cx-intro' }, [
      h('p', { text: tr(CAREER.definition) }),
      h('ul', { class: 'cx-uses' }, CAREER.uses.map((u) => h('li', {}, [chip(tr(u.label), 'use'), ` ${tr(u.text)}`]))),
    ]),
    tabs(CAREER.teams.map((x) => ({ id: x.id, label: tr(x.name) })), team.id, (id) => {
      state.careerTeam = id;
      state.careerLevel = null;
      redraw(`[data-tab="${id}"]`);
    }, tr(UI.teamTabs)),
    h('div', { class: 'cx-ladder-wrap' }, [
      h('div', {}, [
        h('p', { class: 'cx-hint', text: tr(UI.ladderHint) }),
        h('ol', { class: 'cx-ladder', reversed: true }, [...team.levels].reverse().map((l) => h('li', {}, [
          h('button', {
            type: 'button', class: 'cx-rung', 'data-level': l.id, 'aria-pressed': String(l.id === level.id),
            onclick: () => {
              state.careerTeam = team.id;
              state.careerLevel = l.id;
              redraw(`[data-level="${l.id}"]`);
              announce(`${tr(l.name)} · ${tr(l.role)}`);
            },
          }, [h('span', { text: tr(l.name) }), isYou(l) ? chip(tr(UI.youAreHere), 'you') : null]),
        ]))),
      ]),
      detail,
    ]),
    h('p', { class: 'cx-note', text: tr(CAREER.note) }),
  ];
}
