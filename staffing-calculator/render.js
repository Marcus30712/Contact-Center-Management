// Draws the Staffing Lab. The page is built once; update() only rewrites the
// numbers and the picture, so a slider keeps focus while it is being dragged.
import { h, s } from '../agent-lifecycle/js/render/dom.js';
import { t } from '../agent-lifecycle/js/engine/i18n.js';
import { INPUTS, compute } from './model.js';
import { STAFFING_TEXT as T, GLOSSARY_LINKS, fill } from './text.js';

const COLUMNS = 10; // people per row in the picture
const CELL = 24;
const PERSON_KINDS = ['busy', 'idle', 'planned', 'unplanned'];
const LEGEND = { busy: T.legendBusy, idle: T.legendIdle, planned: T.legendPlanned, unplanned: T.legendUnplanned };
const DASH = '—';

// One person mark. Kinds differ by shape and fill, not only by colour:
// at a desk = circle (filled when handling a contact), away = square
// (filled when planned, dashed outline when unplanned).
function personMark(kind, cx, cy) {
  const attrs = { class: `person person-${kind}`, 'data-person': kind };
  if (kind === 'busy' || kind === 'idle') return s('circle', { ...attrs, cx, cy, r: 8 });
  return s('rect', { ...attrs, x: cx - 7, y: cy - 7, width: 14, height: 14, rx: 3 });
}

export function renderCalculator(root, values, lang, { onInput, statusDelay = 600 }) {
  const tr = (text) => t(text, lang).text;
  const withUnit = (value, unit) => `${value}${tr(T.unit[unit])}`;
  const glossaryLink = (key, name) => h('a', {
    class: 'glossary-link',
    'data-glossary': GLOSSARY_LINKS[key],
    href: `../glossary/#${GLOSSARY_LINKS[key]}`,
    'aria-label': `${tr(T.glossaryLink)}: ${name}`,
    text: tr(T.glossaryLink),
  });

  // --- sliders ---
  const outputs = {};
  const sliders = {};
  const fields = INPUTS.map((input) => {
    const id = `in-${input.id}`;
    const name = tr(T.label[input.id]);
    outputs[input.id] = h('span', { class: 'field-value', 'data-value': input.id, 'aria-hidden': 'true' });
    sliders[input.id] = h('input', {
      type: 'range', id, 'data-input': input.id, min: input.min, max: input.max, step: input.step,
      value: values[input.id], 'aria-describedby': `${id}-hint`,
      oninput: (event) => onInput(input.id, Number(event.target.value)),
    });
    return h('div', { class: 'field' }, [
      h('div', { class: 'field-head' }, [h('label', { for: id, text: name }), outputs[input.id]]),
      sliders[input.id],
      h('p', { class: 'field-hint', id: `${id}-hint` }, [
        tr(T.hint[input.id]),
        GLOSSARY_LINKS[input.id] ? ' ' : null,
        GLOSSARY_LINKS[input.id] ? glossaryLink(input.id, name) : null,
      ]),
    ]);
  });

  // --- results ---
  const numbers = {};
  const card = (key, extra = []) => {
    const name = tr(T[key]);
    numbers[key] = h('p', { class: 'result-number', 'data-number': true });
    return h('div', { class: 'result-card', 'data-result': key }, [
      h('h3', { text: name }),
      numbers[key],
      ...extra,
      h('p', { class: 'result-hint' }, [
        T[`${key}Hint`] ? `${tr(T[`${key}Hint`])} ` : null,
        glossaryLink(key, name),
      ]),
    ]);
  };
  const seatedLine = h('p', { class: 'result-line', 'data-seated-line': true });
  const requiredLine = h('p', { class: 'result-line', 'data-required-line': true });
  const gap = h('p', { class: 'gap', 'data-gap': true });
  const overload = h('p', { class: 'overload', 'data-overload': true, text: tr(T.overload) });
  const cards = h('div', { class: 'result-cards' }, [
    card('seated', [seatedLine]),
    card('serviceLevel'),
    card('wait'),
    card('occupancy'),
    card('required', [gap, requiredLine]),
  ]);
  const results = h('div', { class: 'results', 'data-results': true }, [cards]);

  // Screen readers hear one sentence once the sliders settle, instead of
  // every number on every step.
  const status = h('p', { class: 'visually-hidden', 'data-status': true, role: 'status' });
  let statusTimer = null;
  let announce = false; // nothing is announced for the first draw
  function scheduleStatus(text) {
    if (!announce) return;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.textContent = text; }, statusDelay);
  }

  // --- compact summary: stays in view on phones while a slider is moved.
  // It repeats the cards below, so screen readers skip it.
  const summaryValues = {};
  const summaryItem = (key, label) => {
    summaryValues[key] = h('strong', {});
    return h('div', { class: 'summary-item', 'data-summary-item': key }, [h('span', { text: tr(label) }), summaryValues[key]]);
  };
  const summary = h('div', { class: 'summary', 'data-summary': true, 'aria-hidden': 'true' }, [
    summaryItem('serviceLevel', T.serviceLevel),
    summaryItem('wait', T.wait),
    summaryItem('occupancy', T.occupancyShort),
    summaryItem('gap', T.required),
  ]);

  // --- picture ---
  const picture = s('svg', { class: 'picture', 'data-picture': true, role: 'img' });
  const legend = h('ul', { class: 'legend', 'data-legend': true }, PERSON_KINDS.map((kind) => h('li', {}, [
    s('svg', { class: 'legend-mark', viewBox: '0 0 20 20', 'aria-hidden': 'true' }, [personMark(kind, 10, 10)]),
    h('span', { text: tr(LEGEND[kind]) }),
  ])));
  for (const mark of legend.querySelectorAll('[data-person]')) mark.removeAttribute('data-person');

  function drawPicture(v, r) {
    const people = [
      ...Array(r.busy).fill('busy'),
      ...Array(r.seated - r.busy).fill('idle'),
      ...Array(r.away.planned).fill('planned'),
      ...Array(r.away.unplanned).fill('unplanned'),
    ];
    const rows = Math.ceil(people.length / COLUMNS);
    picture.setAttribute('viewBox', `0 0 ${COLUMNS * CELL} ${rows * CELL}`);
    picture.setAttribute('aria-label', fill(tr(T.pictureSummary), { rostered: v.rostered, seated: r.seated, busy: r.busy }));
    picture.replaceChildren(...people.map((kind, i) =>
      personMark(kind, (i % COLUMNS) * CELL + CELL / 2, Math.floor(i / COLUMNS) * CELL + CELL / 2)));
  }

  function update(v) {
    const r = compute(v);
    for (const input of INPUTS) {
      outputs[input.id].textContent = withUnit(v[input.id], input.unit);
      sliders[input.id].setAttribute('aria-valuetext', withUnit(v[input.id], input.unit));
      if (Number(sliders[input.id].value) !== v[input.id]) sliders[input.id].value = v[input.id];
    }
    const percent = (x) => `${Math.round(x * 100)}%`;
    numbers.seated.textContent = withUnit(r.seated, 'people');
    numbers.serviceLevel.textContent = r.overloaded ? DASH : `${r.serviceLevelPercent}%`;
    numbers.wait.textContent = r.overloaded ? DASH : withUnit(r.waitSeconds, 'sec');
    numbers.occupancy.textContent = r.overloaded ? DASH : percent(r.occupancy);
    numbers.required.textContent = withUnit(r.required.rostered, 'people');
    seatedLine.textContent = fill(tr(T.seatedLine), { rostered: v.rostered, seated: r.seated });
    requiredLine.textContent = fill(tr(T.requiredLine), r.required);

    const state = r.gap < 0 ? 'short' : r.gap > 0 ? 'spare' : 'exact';
    gap.setAttribute('data-gap-state', state);
    gap.textContent = state === 'exact' ? tr(T.gapExact)
      : fill(tr(state === 'short' ? T.gapShort : T.gapSpare), { n: Math.abs(r.gap) });

    for (const key of ['serviceLevel', 'wait', 'occupancy']) summaryValues[key].textContent = numbers[key].textContent;
    summaryValues.gap.textContent = gap.textContent;
    summaryValues.gap.setAttribute('data-gap-state', state);
    summary.setAttribute('data-overloaded', String(r.overloaded));

    if (r.overloaded && !overload.isConnected) results.prepend(overload);
    if (!r.overloaded) overload.remove();
    results.classList.toggle('is-overloaded', r.overloaded);
    drawPicture(v, r);

    const need = `${tr(T.required)} ${gap.textContent}`;
    scheduleStatus(r.overloaded ? `${tr(T.overload)} ${need}` : [
      `${tr(T.serviceLevel)} ${numbers.serviceLevel.textContent}`,
      `${tr(T.wait)} ${numbers.wait.textContent}`,
      `${tr(T.occupancyShort)} ${numbers.occupancy.textContent}`,
      need,
    ].join(', '));
  }

  const section = (cls, heading, children) => h('section', { class: cls }, [h('h2', { text: tr(heading) }), ...children]);
  root.replaceChildren(
    h('header', { class: 'glossary-head' }, [
      h('a', { class: 'home-link', 'data-back': true, href: '../', text: `← ${tr(T.back)}` }),
      h('h1', { text: tr(T.title) }),
      h('p', { class: 'tagline', text: tr(T.intro) }),
      h('p', { class: 'example-note', 'data-example-note': true, text: tr(T.exampleNote) }),
    ]),
    summary,
    h('div', { class: 'lab' }, [
      section('lab-inputs', T.inputsHeading, fields),
      section('lab-results', T.resultsHeading, [
        h('div', { class: 'picture-wrap' }, [picture, legend]),
        results,
        status,
      ]),
    ]),
    section('ref-section', T.tryHeading, [
      h('ol', { class: 'try-list' }, [T.try1, T.try2, T.try3].map((x) => h('li', { text: tr(x) }))),
    ]),
    section('ref-section', T.limitsHeading, [
      h('p', { text: tr(T.limits) }),
      h('p', { text: tr(T.countryNote) }),
      h('p', {}, [`${tr(T.credit)} `, h('a', { 'data-credit': true, href: '../references/', text: tr(T.creditLink) })]),
    ]),
  );
  update(values);
  announce = true;
  return { update };
}
