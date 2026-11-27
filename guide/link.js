// The guide's "look here first" link carries the situation (?guide=s1), so the
// lesson it opens can lead on to that situation's "then go here" at its end.
import { GROUPS } from './data.js';
import { SME_GROUPS } from '../sme-guide/data.js';
import { AGENT_GROUPS } from '../agent-guide/data.js';

// Every guide's situations; their ids differ (s… for TL, m… for SME, a… for agents).
const SITUATIONS = [...GROUPS, ...SME_GROUPS, ...AGENT_GROUPS].flatMap((g) => g.situations);

// '../sop-library/#coaching-0' -> '../sop-library/?guide=s1#coaching-0'
export function withGuide(href, id) {
  const at = href.indexOf('#');
  return at < 0 ? `${href}?guide=${id}` : `${href.slice(0, at)}?guide=${id}${href.slice(at)}`;
}

// The situation behind ?guide=…, but only on the lesson it pointed to:
// once the reader moves on to another lesson, the usual order applies again.
export function guideFor(search, course, lessonId) {
  const id = new URLSearchParams(search || '').get('guide');
  const s = id && SITUATIONS.find((x) => x.id === id);
  if (!s) return null;
  return s.first.href === `../${course}/#${lessonId}-0` ? s : null;
}

// The situation for this lesson, if the guide sent the reader here. Anywhere
// else the address forgets ?guide (without a new history entry), so coming
// back to the lesson later does not bring the guide's card back.
export function settleGuide(loc, hist, course, lessonId) {
  const s = lessonId ? guideFor(loc.search, course, lessonId) : null;
  if (!s && new URLSearchParams(loc.search || '').has('guide')) {
    try { hist.replaceState(null, '', `${loc.pathname}${loc.hash}`); } catch { /* blocked: keep the address */ }
  }
  return s;
}
