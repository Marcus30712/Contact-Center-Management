// Which lessons the learner has finished. Storage may be missing or broken;
// the course must keep working either way. Each course passes its own key;
// the default belongs to the lifecycle course.
export const PROGRESS_KEY = 'agent-lifecycle-course:v1';

export function loadProgress(storage, key = PROGRESS_KEY) {
  try {
    const data = JSON.parse(storage.getItem(key));
    if (Array.isArray(data?.completed) && data.completed.every((x) => typeof x === 'string')) {
      return { completed: [...data.completed] };
    }
  } catch { /* fall through to empty progress */ }
  return { completed: [] };
}

export function markComplete(storage, lessonId, key = PROGRESS_KEY) {
  const progress = loadProgress(storage, key);
  if (!progress.completed.includes(lessonId)) progress.completed.push(lessonId);
  try {
    storage.setItem(key, JSON.stringify(progress));
  } catch { /* progress just won't persist */ }
  return progress;
}
