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

// `text` holds the course's own strings (another course passes its own; keys it
// lacks fall back to the lifecycle course's). Only the lifecycle course has tracks.
export function renderHome(root, lessons, progress, lang, text = UI) {
  const T = { ...UI, ...text };
  const hasTracks = text === UI;
  const tr = (value) => t(value, lang).text;
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
      s('text', { x: CX, y: CY + 20, 'text-anchor': 'middle', text: tr(T.personaName) }),
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
      h('h1', { text: tr(T.courseTitle) }),
      h('p', { class: 'tagline', text: tr(T.courseTagline) }),
      hasTracks ? h('p', { class: 'track-hint', 'data-track-hint': true, text: tr(T.trackHint) }) : null,
      // Another course's note on its example figures, in the track hint's place.
      !hasTracks && text.listNote ? h('p', { class: 'track-hint', 'data-list-note': true, text: tr(text.listNote) }) : null,
      h('p', { class: 'translation-note', 'data-translation-note': true, hidden: !fallback, text: fallback ? tr(T.translationComing) : '' }),
    ]),
    h('div', { class: 'home-body' }, [
      T.ladder ? ladderFigure(lessons, T.ladder, tr, done) : h('figure', { class: 'ring-wrap' }, [
        ring,
        h('figcaption', { class: 'loop-note', text: `↺ ${tr(T.loop)}` }),
      ]),
      h('ol', { class: 'stage-list', 'data-stage-list': true }, lessons.map((l) => h('li', {}, [
        h('a', { href: lessonHref(l.id, 0), 'data-stage': l.id, class: done.has(l.id) ? 'stage-card is-done' : 'stage-card' }, [
          h('span', { class: 'stage-card-num', text: String(l.order) }),
          h('span', { class: 'stage-card-text' }, [
            h('strong', { text: tr(l.title) }),
            h('span', { text: tr(l.subtitle) }),
          ]),
          h('span', { class: 'stage-card-done', text: done.has(l.id) ? `✓ ${tr(T.done)}` : '' }),
        ]),
      ]))),
    ]),
  );
}

// A course can show a ladder instead of the ring (상담사 커리어 라이프사이클, 2026-11-26):
// roles stacked bottom to top, each climb with its own prep step beside it, and the
// learner's current place (not a lesson) at the bottom. Rungs are listed top to bottom.
function ladderFigure(lessons, ladder, tr, done) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const step = (id, kind) => {
    const l = byId.get(id);
    // Like the ring, the lesson cards below are the keyboard and screen-reader path.
    return h('a', { href: lessonHref(id, 0), 'data-rung': id, tabindex: '-1', class: `ladder-step ${kind}${done.has(id) ? ' is-done' : ''}` }, [
      h('span', { class: 'ladder-num', text: `${l.order} ` }),
      h('span', { class: 'ladder-name', text: tr(l.short ?? l.title) }),
      h('span', { class: 'ladder-done', 'aria-hidden': 'true', text: done.has(id) ? '✓' : '' }),
    ]);
  };
  const rungs = [...ladder.roles].reverse().flatMap((role) => [
    step(role, 'is-role'),
    h('div', { class: 'ladder-climb' }, [
      h('span', { class: 'ladder-arrow', 'aria-hidden': 'true', text: '▲' }),
      step(ladder.prep[role], 'is-prep'),
    ]),
  ]);
  return h('figure', { class: 'ladder-wrap', 'data-ladder': true }, [
    h('p', { class: 'ladder-team', text: tr(ladder.team) }),
    ...rungs,
    h('div', { class: 'ladder-step is-here', 'data-rung': 'agent', text: tr(ladder.here) }),
  ]);
}
