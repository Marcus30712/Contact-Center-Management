// Hash routes use plain names (letters, digits, hyphens) so they survive
// both a static host and the Claude artifact frame:
//   "#home" or empty  -> overview
//   "#<lessonId>-<step>" -> a lesson step (step is 0-based)
export const HOME_HREF = '#home';

export function parseRoute(hash, lessonIds) {
  const name = String(hash || '').replace(/^#/, '');
  const cut = name.indexOf('-');
  const id = cut === -1 ? name : name.slice(0, cut);
  if (!lessonIds.includes(id)) return { view: 'home' };
  const raw = cut === -1 ? '' : name.slice(cut + 1);
  const step = /^\d+$/.test(raw) ? Number(raw) : 0;
  return { view: 'lesson', id, step };
}

export function lessonHref(id, step = 0) {
  return `#${id}-${step}`;
}
