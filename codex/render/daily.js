// ④ Daily guide by role: a 09:00–18:00 bar and the four core tasks. Picking a
// block or a task highlights the other and shows the details.
import { h } from '../../agent-lifecycle/js/render/dom.js';
import { t } from '../../agent-lifecycle/js/engine/i18n.js';
import { CODEX_UI as UI } from '../ui.js';
import { DAILY } from '../data/daily.js';
import { WEEK_CHECK } from '../data/week-check.js';
import { tabs, chip, announce } from './parts.js';

const minutes = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const TAG_KIND = ['core', 'growth', 'prep', 'wrap', 'analysis', 'collab', 'report', 'support', 'strategy'];
const tagKind = (tag) => TAG_KIND[['핵심', '성장', '준비', '마무리', '분석', '협업', '보고', '지원', '전략'].indexOf(tag.ko)] ?? 'core';

export function dailyBody(lang, state, redraw) {
  const tr = (text) => t(text, lang).text;
  const role = DAILY.roles.find((r) => r.id === state.dailyRole) ?? DAILY.roles.find((r) => r.id === state.you) ?? DAILY.roles.find((r) => r.id === DAILY.defaultRole);
  const pick = state.dailyPick;
  const pickedTask = pick == null ? null : 'block' in pick ? role.schedule[pick.block]?.task : pick.task;
  // What a screen reader hears after a choice: the task in one line.
  const summary = (next) => {
    const task = 'block' in next ? role.schedule[next.block].task : next.task;
    if (typeof task === 'number') {
      const x = role.tasks.find((k) => k.n === task);
      return `${x.n}. ${tr(x.name)} · ${tr(UI.frequency)}: ${tr(x.freq)} · ${tr(UI.share)}: ${tr(x.share)}`;
    }
    const b = role.schedule[next.block];
    return task === 'lunch' ? `${tr(UI.lunch)} · ${b.from}–${b.to}` : `${tr(UI.other)} · ${b.from}–${b.to} ${tr(b.text)}`;
  };
  const choose = (next, focus) => {
    state.dailyRole = role.id;
    state.dailyPick = next;
    redraw(focus);
    announce(summary(next));
  };

  const bar = h('ol', { class: 'cx-day', 'data-day': true }, role.schedule.map((b, i) => {
    const label = b.task === 'lunch' ? tr(UI.lunch) : tr(b.text);
    const selected = pickedTask != null && (typeof b.task === 'number' ? b.task === pickedTask : pick && 'block' in pick && pick.block === i);
    const cls = ['cx-block', `is-${typeof b.task === 'number' ? `task-${b.task}` : b.task}`, selected ? 'is-selected' : ''].join(' ').trim();
    const btn = h('button', {
      type: 'button', class: cls, 'data-block': i, 'data-task': String(b.task),
      'aria-label': `${b.from}–${b.to}, ${label}`, 'aria-pressed': String(Boolean(selected)),
      onclick: () => choose({ block: i }, `[data-block="${i}"]`),
    }, [h('span', { 'aria-hidden': 'true', text: typeof b.task === 'number' ? String(b.task) : '' })]);
    return h('li', { style: `flex-grow: ${minutes(b.to) - minutes(b.from)}` }, [btn]);
  }));

  // The same day as plain lines; on phones this is easier to read and tap than the bar.
  const slots = h('ol', { class: 'cx-slots' }, role.schedule.map((b, i) => {
    const selected = pick != null && 'block' in pick ? pick.block === i : typeof b.task === 'number' && b.task === pickedTask;
    return h('li', {}, [h('button', {
      type: 'button', class: 'cx-slot', 'data-slot': i, 'aria-pressed': String(Boolean(selected)),
      onclick: () => choose({ block: i }, `[data-slot="${i}"]`),
    }, [h('span', { class: 'cx-slot-time', text: `${b.from}–${b.to}` }), ` ${b.task === 'lunch' ? tr(UI.lunch) : tr(b.text)}`])]);
  }));

  const list = h('ol', { class: 'cx-tasks' }, role.tasks.map((task) => h('li', {}, [
    h('button', {
      type: 'button', class: 'cx-task', 'data-task-item': task.n, 'aria-pressed': String(task.n === pickedTask),
      onclick: () => choose({ task: task.n }, `[data-task-item="${task.n}"]`),
    }, [
      h('span', { class: 'cx-num', 'aria-hidden': 'true', text: String(task.n) }),
      h('span', { class: 'cx-card-text' }, [
        h('span', { class: 'cx-card-tags' }, [chip(tr(task.tag), tagKind(task.tag))]),
        h('strong', { text: tr(task.name) }),
        // One fixed-width track for every task, filled to the share, so the
        // same share draws the same length whatever the task title.
        h('span', { class: 'cx-share' }, [
          h('span', { class: 'cx-share-track', 'aria-hidden': 'true' }, [
            h('span', { class: 'cx-share-fill', style: `width: ${task.share.ko.match(/\d+/)[0]}%` }),
          ]),
          h('span', { class: 'cx-share-label', text: tr(task.share) }),
        ]),
      ]),
    ]),
  ])));

  let detailBody;
  if (typeof pickedTask === 'number') {
    const task = role.tasks.find((x) => x.n === pickedTask);
    const times = role.schedule.filter((b) => b.task === pickedTask);
    detailBody = [
      h('h3', {}, [chip(tr(task.tag), tagKind(task.tag)), ` ${task.n}. ${tr(task.name)}`]),
      h('dl', { class: 'cx-facts' }, [
        h('dt', { text: tr(UI.frequency) }), h('dd', { text: tr(task.freq) }),
        h('dt', { text: tr(UI.share) }), h('dd', { text: tr(task.share) }),
        h('dt', { text: tr(UI.outputs) }), h('dd', { text: tr(task.outputs) }),
        h('dt', { text: tr(UI.dayHeading) }),
        h('dd', {}, [h('ul', {}, times.map((b) => h('li', { text: `${b.from}–${b.to} ${tr(b.text)}` })))]),
      ]),
    ];
  } else if (pickedTask === 'other' || pickedTask === 'lunch') {
    const b = role.schedule[pick.block];
    detailBody = pickedTask === 'other'
      ? [h('h3', { text: tr(UI.other) }), h('p', { text: `${b.from}–${b.to} ${tr(b.text)}` }), h('p', { class: 'cx-note', text: tr(UI.otherHint) })]
      : [h('h3', { text: tr(UI.lunch) }), h('p', { text: `${b.from}–${b.to}` })];
  } else {
    detailBody = [h('p', { class: 'cx-hint', text: tr(UI.dayHint) })];
  }

  return [
    h('div', { class: 'cx-intro' }, [h('p', { text: tr(DAILY.intro) })]),
    tabs(DAILY.roles.map((r) => ({ id: r.id, label: tr(r.name) })), role.id, (id) => {
      state.dailyRole = id;
      state.dailyPick = null;
      redraw(`[data-tab="${id}"]`);
    }, tr(UI.roleTabs)),
    h('h2', { class: 'cx-sub', text: tr(UI.dayHeading) }),
    bar,
    h('div', { class: 'cx-axis', 'aria-hidden': 'true' }, ['09:00', '12:00', '15:00', '18:00'].map((x) => h('span', { text: x }))),
    slots,
    h('div', { class: 'cx-day-grid' }, [
      h('div', { class: 'cx-detail', 'data-task-detail': true }, detailBody),
      h('div', { class: 'cx-day-tasks' }, [h('h2', { class: 'cx-sub', text: tr(UI.tasksHeading) }), list]),
    ]),
    h('div', { class: 'cx-notes', 'data-notes': true }, DAILY.notes.map((n) => h('p', { class: 'cx-note', text: tr(n) }))),
    role.id === 'tl' ? weekCheck(tr, state) : null,
  ];
}

// The team leader's own week, ticked on the page only: kept in the page state
// while the page is open, never written to storage.
function weekCheck(tr, state) {
  const ticks = state.weekChecks ?? (state.weekChecks = new Set());
  return h('section', { class: 'cx-week', 'data-week-check': true, 'aria-labelledby': 'cx-week-title' }, [
    h('h2', { class: 'cx-sub', id: 'cx-week-title', text: tr(WEEK_CHECK.title) }),
    h('p', { class: 'cx-note', text: tr(WEEK_CHECK.note) }),
    h('ul', { class: 'cx-week-list' }, WEEK_CHECK.items.map((item, i) => {
      const n = i + 1;
      const box = h('input', {
        type: 'checkbox', id: `cx-week-${n}`, 'data-week-item': n,
        onchange: (event) => { if (event.target.checked) ticks.add(n); else ticks.delete(n); },
      });
      box.checked = ticks.has(n);
      return h('li', {}, [h('label', { for: `cx-week-${n}` }, [box, h('span', { text: tr(item) })])]);
    })),
    h('p', { class: 'cx-week-source', 'data-week-source': true, text: tr(WEEK_CHECK.source) }),
  ]);
}
