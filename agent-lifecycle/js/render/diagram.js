import { s } from './dom.js';
import { t } from '../engine/i18n.js';
import { UI } from '../i18n/ui.js';

// Node box half-sizes in viewBox units (viewBox is 0 0 360 240).
const HW = 54;
const HH = 17;

// Point where the line from `from` toward `to` leaves `from`'s box.
function boxEdge(from, to, pad = 0) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = Math.min(
    dx === 0 ? Infinity : (HW + pad) / Math.abs(dx),
    dy === 0 ? Infinity : (HH + pad) / Math.abs(dy),
  );
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

function build(svg, diagram) {
  svg.setAttribute('viewBox', '0 0 360 240');
  svg.setAttribute('role', 'img');
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const markerId = `arrow-${Math.random().toString(36).slice(2, 8)}`;
  svg.append(s('defs', {}, [
    s('marker', { id: markerId, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, [
      s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'arrowhead' }),
    ]),
  ]));
  for (const e of diagram.edges) {
    const a = boxEdge(byId.get(e.from), byId.get(e.to), 2);
    const b = boxEdge(byId.get(e.to), byId.get(e.from), 4);
    svg.append(s('line', {
      class: 'edge', 'data-edge': e.id,
      x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'marker-end': `url(#${markerId})`,
    }));
  }
  for (const n of diagram.nodes) {
    svg.append(s('g', { class: 'node', 'data-node': n.id, transform: `translate(${n.x} ${n.y})` }, [
      s('rect', { x: -HW, y: -HH, width: HW * 2, height: HH * 2, rx: 9 }),
      s('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central' }),
    ]));
  }
  svg.append(s('g', { class: 'persona', 'data-persona': true }, [
    s('rect', { x: -19, y: -9, width: 38, height: 18, rx: 9 }),
    s('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central' }),
  ]));
}

// Draws the lesson diagram for one step. The first call creates the shapes;
// later calls only switch classes and move the persona badge, so CSS
// transitions animate the change.
export function renderDiagram(svg, diagram, step, lang) {
  if (!svg.querySelector('[data-node]')) build(svg, diagram);

  const show = new Set(step.show);
  const active = new Set(step.highlight);
  for (const el of svg.querySelectorAll('[data-node], [data-edge]')) {
    const id = el.getAttribute('data-node') ?? el.getAttribute('data-edge');
    el.classList.toggle('is-hidden', !show.has(id));
    el.classList.toggle('is-active', active.has(id));
  }
  for (const n of diagram.nodes) {
    const label = t(n.label, lang).text;
    const text = svg.querySelector(`[data-node="${n.id}"] text`);
    text.textContent = label;
    // Long labels (mostly English) are squeezed to fit inside the box.
    const long = [...label].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e80 ? 11 : 6.2), 0) > HW * 2 - 10;
    if (long) {
      text.setAttribute('textLength', HW * 2 - 12);
      text.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    } else {
      text.removeAttribute('textLength');
      text.removeAttribute('lengthAdjust');
    }
  }

  const persona = svg.querySelector('[data-persona]');
  const at = diagram.nodes.find((n) => n.id === step.persona);
  persona.classList.toggle('is-hidden', !at);
  persona.querySelector('text').textContent = t(UI.personaName, lang).text;
  if (at) persona.setAttribute('style', `transform: translate(${at.x - HW + 16}px, ${at.y - HH}px)`);
}
