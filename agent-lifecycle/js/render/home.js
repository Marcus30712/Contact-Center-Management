import { h, s } from './dom.js';
import { t, hasFallback } from '../engine/i18n.js';
import { lessonHref } from '../engine/router.js';
import { UI } from '../i18n/ui.js';

const CX = 180;
const CY = 168;
const R = 118;   // ring radius
const NODE = 31; // stage circle radius
const rad = (deg) => (deg * Math.PI) / 180;
const onRing = (deg) => ({ x: CX + R * Math.cos(rad(deg)), y: CY + R * Math.sin(rad(deg)) });

function arc(fromDeg, toDeg) {
  const gap = 20; // degrees kept clear around each stage circle
  const a = onRing(fromDeg + gap);
  const b = onRing(toDeg - gap);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${R} ${R} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function renderHome(root, lessons, progress, lang) {
  const tr = (text) => t(text, lang).text;
  const done = new Set(progress.completed);
  const step = 360 / lessons.length;
  document.documentElement.lang = lang;

  const ring = s('svg', { class: 'ring', viewBox: '0 0 360 336', 'aria-hidden': 'true' }, [
    s('defs', {}, [
      s('marker', { id: 'ring-arrow', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, [
        s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'arrowhead' }),
      ]),
      s('marker', { id: 'ring-arrow-loop', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, [
        s('path', { d: 'M0 0 L10 5 L0 10 z', class: 'arrowhead loop' }),
      ]),
    ]),
    ...lessons.map((l, i) => {
      const isLoop = i === lessons.length - 1;
      return s('path', {
        class: isLoop ? 'ring-edge loop' : 'ring-edge',
        'data-edge': isLoop ? 'loop' : `${l.id}-next`,
        d: arc(-90 + i * step, -90 + (i + 1) * step),
        'marker-end': `url(#${isLoop ? 'ring-arrow-loop' : 'ring-arrow'})`,
      });
    }),
    s('g', { class: 'ring-center' }, [
      s('circle', { cx: CX, cy: CY - 12, r: 13 }),
      s('text', { x: CX, y: CY + 20, 'text-anchor': 'middle', text: tr(UI.personaName) }),
    ]),
    ...lessons.map((l, i) => {
      const p = onRing(-90 + i * step);
      return s('a', {
        href: lessonHref(l.id, 0),
        'data-stage': l.id,
        class: done.has(l.id) ? 'stage is-done' : 'stage',
        tabindex: '-1', // the stage cards below are the keyboard and screen-reader path
      }, [
        s('circle', { cx: p.x, cy: p.y, r: NODE }),
        s('text', { class: 'stage-num', x: p.x, y: p.y - 6, 'text-anchor': 'middle', text: String(l.order) }),
        s('text', {
          class: 'stage-name', x: p.x, y: p.y + 11, 'text-anchor': 'middle', text: tr(l.short ?? l.title),
          // Squeeze long (English) names so they stay inside the circle.
          ...(tr(l.short ?? l.title).length > 8 ? { textLength: NODE * 2 - 12, lengthAdjust: 'spacingAndGlyphs' } : {}),
        }),
      ]);
    }),
  ]);

  const fallback = hasFallback(lessons, lang);
  root.replaceChildren(
    h('header', { class: 'home-head' }, [
      h('h1', { text: tr(UI.courseTitle) }),
      h('p', { class: 'tagline', text: tr(UI.courseTagline) }),
      h('p', { class: 'translation-note', 'data-translation-note': true, hidden: !fallback, text: fallback ? tr(UI.translationComing) : '' }),
    ]),
    h('div', { class: 'home-body' }, [
      h('figure', { class: 'ring-wrap' }, [
        ring,
        h('figcaption', { class: 'loop-note', text: `↺ ${tr(UI.loop)}` }),
      ]),
      h('ol', { class: 'stage-list', 'data-stage-list': true }, lessons.map((l) => h('li', {}, [
        h('a', { href: lessonHref(l.id, 0), 'data-stage': l.id, class: done.has(l.id) ? 'stage-card is-done' : 'stage-card' }, [
          h('span', { class: 'stage-card-num', text: String(l.order) }),
          h('span', { class: 'stage-card-text' }, [
            h('strong', { text: tr(l.title) }),
            h('span', { text: tr(l.subtitle) }),
          ]),
          h('span', { class: 'stage-card-done', text: done.has(l.id) ? `✓ ${tr(UI.done)}` : '' }),
        ]),
      ]))),
    ]),
  );
}
