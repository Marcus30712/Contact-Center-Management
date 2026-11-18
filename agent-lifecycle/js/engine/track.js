// Support tracks. A step or checkpoint question may carry `track`; without
// it the item is common and shows on every track.
export const TRACKS = ['general', 'tech'];
export const TRACK_KEY = 'agent-lifecycle-course:track';

export function loadTrack(storage) {
  try {
    const saved = storage.getItem(TRACK_KEY);
    if (TRACKS.includes(saved)) return saved;
  } catch { /* fall back to the default */ }
  return 'general';
}

export function saveTrack(storage, track) {
  try {
    storage.setItem(TRACK_KEY, track);
  } catch { /* choice just won't persist */ }
}

const onTrack = (track) => (item) => !item.track || item.track === track;

export function visibleSteps(lesson, track) {
  return lesson.steps.filter(onTrack(track));
}

export function visibleQuestions(lesson, track) {
  return lesson.checkpoint.filter(onTrack(track));
}

// Where to land when the learner switches track mid-lesson: the same step if
// it is common, otherwise the nearest common step before it (or the start).
// Indexes count the steps visible on each track.
export function switchIndex(lesson, fromTrack, fromIndex, toTrack) {
  const from = visibleSteps(lesson, fromTrack);
  const to = visibleSteps(lesson, toTrack);
  let i = Math.min(from.length - 1, Math.max(0, Math.trunc(fromIndex) || 0));
  if (fromTrack === toTrack) return i;
  while (i >= 0 && from[i].track) i -= 1;
  return i < 0 ? 0 : Math.max(0, to.indexOf(from[i]));
}
