// Draws the channel comparison tab. The page is built once; update() rewrites
// the values, the table and what is shown, so a slider keeps focus while it moves.
import { h } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { CHANNELS, COMMON_INPUTS, CHANNEL_INPUTS, computeChannels } from './channels.js';
import { STAFFING_TEXT as T, CHANNEL_TEXT as C, GLOSSARY_LINKS, CHANNEL_GLOSSARY, fill } from './text.js';

const ROWS = ['seats', 'needed', 'current', 'diff', 'weekly', 'monthly', 'otWeekly', 'otMonthly', 'otPerPerson'];
const HOURS_ROWS = new Set(['weekly', 'monthly', 'otWeekly', 'otMonthly', 'otPerPerson']);
const DASH = '–';

// The channel the sliders edit: the chosen one, or the first channel still on.
const editing = (state) => (state.on[state.edit] ? state.edit : CHANNELS.find((k) => state.on[k]));

export function renderChannels(root, state, lang, { onCommon, onChannel, onToggle, onEdit, statusDelay = 600 }) {
  const tr = (text) => t(text, lang).text;
  const locale = lang === 'ko' ? 'ko-KR' : 'en-US';
  const unitText = (unit) => tr(T.unit[unit] ?? C.unit[unit]);
  const withUnit = (value, unit) => `${value}${unitText(unit)}`;
  const glossaryLink = (id, name) => h('a', {
    class: 'glossary-link', 'data-glossary': id, href: `../glossary/#${id}`,
    'aria-label': `${tr(T.glossaryLink)}: ${name}`, text: tr(T.glossaryLink),
  });

  // Wording shared with the 30-minute practice is read from its text.
  const labelOf = (id) => C.label[id] ?? T.label[id];
  const hintOf = (kind, id) => {
    if (id === 'aht' && kind !== 'phone') return C.hint[kind === 'chat' ? 'ahtChat' : 'ahtEmail'];
    if (id === 'target' && kind === 'chat') return C.hint.targetChat;
    return C.hint[id] ?? T.hint[id];
  };

  const sliders = []; // { el, out, read(state), unit }
  // `hook` names the data attributes: data-<hook>-input / data-<hook>-value = `key`.
  const field = (input, domId, hook, key, kind, read, report) => {
    const name = tr(labelOf(input.id));
    const out = h('span', { class: 'field-value', [`data-${hook}-value`]: key, 'aria-hidden': 'true' });
    const el = h('input', {
      type: 'range', id: domId, [`data-${hook}-input`]: key,
      min: input.min, max: input.max, step: input.step, 'aria-describedby': `${domId}-hint`,
      oninput: (event) => report(Number(event.target.value)),
    });
    sliders.push({ el, out, read, unit: input.unit });
    const link = GLOSSARY_LINKS[input.id];
    return h('div', { class: 'field' }, [
      h('div', { class: 'field-head' }, [h('label', { for: domId, text: name }), out]),
      el,
      h('p', { class: 'field-hint', id: `${domId}-hint` }, [tr(hintOf(kind, input.id)), link ? ' ' : null, link ? glossaryLink(link, name) : null]),
    ]);
  };

  // --- center-wide values ---
  const common = COMMON_INPUTS.map((input) => field(input, `common-${input.id}`, 'common', input.id, null,
    (st) => st.common[input.id], (v) => onCommon(input.id, v)));

  // --- channels to compare ---
  const toggles = {};
  const pick = h('div', { class: 'ch-pick' }, CHANNELS.map((kind) => {
    toggles[kind] = h('input', {
      type: 'checkbox', id: `ch-on-${kind}`, 'data-ch-toggle': kind,
      onchange: (event) => onToggle(kind, event.target.checked),
    });
    return h('label', { class: 'ch-toggle', for: `ch-on-${kind}` }, [toggles[kind], h('span', { text: tr(C.channel[kind]) })]);
  }));

  // --- channel to edit, and its sliders ---
  const chips = {};
  const groups = {};
  const chipRow = h('div', { class: 'ch-edit', role: 'group', 'aria-label': tr(C.editHeading) }, CHANNELS.map((kind) => {
    chips[kind] = h('button', { type: 'button', class: 'ch-chip', 'data-ch-edit': kind, text: tr(C.channel[kind]), onclick: () => onEdit(kind) });
    return chips[kind];
  }));
  for (const kind of CHANNELS) {
    groups[kind] = h('div', { class: 'ch-fields', 'data-ch-fields': kind },
      CHANNEL_INPUTS[kind].map((input) => field(input, `ch-${kind}-${input.id}`, 'ch', `${kind}.${input.id}`, kind,
        (st) => st[kind][input.id], (v) => onChannel(kind, input.id, v))));
  }

  // --- results ---
  const tableWrap = h('div', { class: 'ch-table-wrap' });
  const rowHints = h('dl', { class: 'ch-row-hints' }, Object.keys(C.rowHint).flatMap((row) => {
    const name = tr(C.row[row]);
    const id = CHANNEL_GLOSSARY[row];
    return [
      h('dt', { text: name }),
      h('dd', { 'data-row-hint': row }, [tr(C.rowHint[row]), id ? ' ' : null, id ? glossaryLink(id, name) : null]),
    ];
  }));
  const status = h('p', { class: 'visually-hidden', 'data-ch-status': true, role: 'status' });
  let statusTimer = null;
  let announce = false;
  const scheduleStatus = (text) => {
    if (!announce) return;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = text; }, statusDelay);
  };

  const gapText = (gap) => (gap === 0 ? tr(T.gapExact) : fill(tr(gap < 0 ? T.gapShort : T.gapSpare), { n: Math.abs(gap) }));
  const totalGap = ({ short, spare }) => {
    if (short && spare) return fill(tr(C.totalBoth), { short, spare });
    if (short) return fill(tr(C.totalShort), { n: short });
    if (spare) return fill(tr(C.totalSpare), { n: spare });
    return tr(T.gapExact);
  };
  // Number rows name their unit once, in the row heading, so all columns fit a phone.
  const plain = (value) => value.toLocaleString(locale);
  const rowName = (row) => (row === 'diff' ? tr(C.row[row])
    : `${tr(C.row[row])} (${unitText(HOURS_ROWS.has(row) ? 'hours' : 'people').trim()})`);
  const cellText = (row, r) => {
    if (row === 'diff') return gapText(r.gap);
    if (row === 'otPerPerson') return r.otPerPerson === null ? tr(C.noStaff) : plain(r.otPerPerson);
    return plain(r[row]);
  };
  const totalText = (row, total) => {
    if (row === 'diff') return totalGap(total);
    if (row === 'otPerPerson') return DASH;
    return plain(total[row]);
  };

  function drawTable(result) {
    const cols = [...Object.keys(result.rows), 'total'];
    const name = (col) => tr(col === 'total' ? C.total : C.channel[col]);
    const table = h('table', { class: 'ch-table', 'data-ch-table': true, 'aria-labelledby': 'ch-results-heading' }, [
      h('thead', {}, [h('tr', {}, [h('td', {}), ...cols.map((col) => h('th', { scope: 'col', 'data-col': col, text: name(col) }))])]),
      h('tbody', {}, ROWS.map((row) => h('tr', { 'data-row': row }, [
        h('th', { scope: 'row', text: rowName(row) }),
        ...cols.map((col) => {
          const text = col === 'total' ? totalText(row, result.total) : cellText(row, result.rows[col]);
          const gap = row === 'diff' ? (col === 'total' ? (result.total.short ? 'short' : 'ok') : result.rows[col].gap < 0 ? 'short' : 'ok') : null;
          return h('td', { 'data-cell': `${row}.${col}`, 'data-gap-state': gap, class: col === 'total' ? 'is-total' : null, text });
        }),
      ]))),
    ]);
    tableWrap.replaceChildren(table);
  }

  function update(st) {
    const edit = editing(st);
    const onCount = CHANNELS.filter((k) => st.on[k]).length;
    for (const sl of sliders) {
      const v = sl.read(st);
      sl.out.textContent = withUnit(v, sl.unit);
      sl.el.setAttribute('aria-valuetext', withUnit(v, sl.unit));
      if (Number(sl.el.value) !== v) sl.el.value = v;
    }
    for (const kind of CHANNELS) {
      toggles[kind].checked = st.on[kind];
      toggles[kind].disabled = st.on[kind] && onCount === 1;
      chips[kind].hidden = !st.on[kind];
      chips[kind].setAttribute('aria-pressed', String(kind === edit));
      groups[kind].hidden = kind !== edit;
    }
    const result = computeChannels(st);
    drawTable(result);
    scheduleStatus(fill(tr(C.summary), {
      n: onCount,
      needed: result.total.needed.toLocaleString(locale),
      weekly: result.total.weekly.toLocaleString(locale),
      ot: result.total.otWeekly.toLocaleString(locale),
    }));
  }

  const section = (cls, heading, children, id) => h('section', { class: cls }, [h('h2', { id, text: tr(heading) }), ...children]);
  root.replaceChildren(
    h('header', { class: 'glossary-head' }, [
      h('a', { class: 'home-link', 'data-back': true, href: '../', text: `← ${tr(T.back)}` }),
      h('h1', { text: tr(T.title) }),
      h('p', { class: 'tagline', text: tr(C.channelsIntro) }),
      h('p', { class: 'example-note', 'data-example-note': true, text: tr(T.exampleNote) }),
    ]),
    h('div', { class: 'lab ch-lab' }, [
      h('div', { class: 'lab-inputs' }, [
        section('ch-section', C.commonHeading, common),
        section('ch-section', C.pickHeading, [h('p', { class: 'field-hint', text: tr(C.pickNote) }), pick]),
        section('ch-section', C.editHeading, [chipRow, ...CHANNELS.map((k) => groups[k])]),
      ]),
      section('lab-results', C.resultsHeading, [
        tableWrap,
        h('p', { class: 'ch-note', 'data-ch-note': true, text: tr(C.otNote) }),
        rowHints,
        status,
      ], 'ch-results-heading'),
    ]),
    section('ref-section', T.tryHeading, [
      h('ol', { class: 'try-list' }, [C.tryC1, C.tryC2, C.tryC3].map((x) => h('li', { text: tr(x) }))),
    ]),
    section('ref-section', T.limitsHeading, [
      h('p', { 'data-ch-limits': true }, [`${tr(C.channelsLimits)} `, glossaryLink(GLOSSARY_LINKS.limits, 'WFM')]),
      h('p', { text: tr(T.countryNote) }),
    ]),
  );
  update(state);
  announce = true;
  return { update };
}
