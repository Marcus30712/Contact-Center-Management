// Draws Miso's example table as a small spreadsheet: column letters, row
// numbers, optional tappable cells, highlights, and the "after" views.
import { h } from '../agent-lifecycle/js/render/dom.js';

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const DATA_ROWS = [2, 3, 4, 5, 6, 7, 8, 9];

// opts: { rows, highlight, used, pick(addr), selected: [addr], label }
export function renderSheet(sheet, opts = {}) {
  const rows = opts.rows ?? DATA_ROWS;
  const marked = new Set(opts.highlight ?? []);
  const used = new Set(opts.used ?? []);
  const selected = new Set(opts.selected ?? []);
  const cell = (addr, value, header = false) => {
    const cls = [header ? 'is-head' : '', marked.has(addr) ? 'is-marked' : '', used.has(addr) ? 'is-used' : '', selected.has(addr) ? 'is-selected' : '']
      .filter(Boolean).join(' ');
    const attrs = { 'data-cell': addr, class: cls || null, text: String(value) };
    if (opts.pick) {
      attrs.tabindex = '0';
      attrs.role = 'button';
      attrs['aria-pressed'] = String(selected.has(addr));
      attrs.onclick = () => opts.pick(addr);
      attrs.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opts.pick(addr); } };
    }
    return h('td', attrs);
  };
  const head = h('tr', {}, [h('th', { class: 'ex-corner', 'aria-hidden': 'true' }), ...COLS.map((c) => h('th', { scope: 'col', text: c }))]);
  const line = (r) => h('tr', {}, [h('th', { scope: 'row', text: String(r) }), ...COLS.map((c) => cell(`${c}${r}`, sheet.cells[`${c}${r}`] ?? '', r === 1))]);
  return h('figure', { class: 'ex-sheet' }, [
    h('figcaption', { text: sheet.title }),
    h('div', { class: 'ex-sheet-scroll' }, [
      h('table', {}, [h('thead', {}, [head]), h('tbody', {}, [line(1), ...rows.map(line)])]),
    ]),
  ]);
}

export function renderPivot(pivot) {
  return h('figure', { class: 'ex-sheet ex-pivot' }, [
    h('div', { class: 'ex-sheet-scroll' }, [
      h('table', {}, [
        h('thead', {}, [h('tr', {}, pivot.head.map((t) => h('th', { scope: 'col', text: t })))]),
        h('tbody', {}, [
          ...pivot.rows.map(([k, v]) => h('tr', {}, [h('th', { scope: 'row', text: String(k) }), h('td', { text: String(v) })])),
          h('tr', { class: 'is-total' }, [h('th', { scope: 'row', text: pivot.total[0] }), h('td', { text: String(pivot.total[1]) })]),
        ]),
      ]),
    ]),
  ]);
}
