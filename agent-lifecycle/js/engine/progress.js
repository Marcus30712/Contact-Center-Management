// Which lessons the learner has finished. Storage may be missing or broken;
// the course must keep working either way.
export const PROGRESS_KEY = 'agent-lifecycle-course:v1';

export function loadProgress(storage) {
  try {
    const data = JSON.parse(storage.getItem(PROGRESS_KEY));
    if (Array.isArray(data?.completed) && data.completed.every((x) => typeof x === 'string')) {
      return { completed: [...data.completed] };
    }
  } catch { /* fall through to empty progress */ }
  return { completed: [] };
}

export function markComplete(storage, lessonId) {
  const progress = loadProgress(storage);
  if (!progress.completed.includes(lessonId)) progress.completed.push(lessonId);
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch { /* progress just won't persist */ }
  return progress;
}
