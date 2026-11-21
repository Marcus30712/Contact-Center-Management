// The guide's "look here first" link carries the situation (?guide=s1), so the
// lesson it opens can lead on to that situation's "then go here" at its end.
import { GROUPS } from './data.js';

const SITUATIONS = GROUPS.flatMap((g) => g.situations);

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
