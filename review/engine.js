// Review quiz results and when each quiz opens (2026-11-25).
// Spec: docs/superpowers/specs/2026-11-25-role-review-quiz-design.md §4.2–4.4.
import { loadProgress } from '../agent-lifecycle/js/engine/progress.js';
import { LESSONS } from '../agent-lifecycle/js/lessons/index.js';
import { SOP_LESSONS } from '../sop-library/lessons/index.js';
import { SME_LESSONS } from '../sme/lessons/index.js';
import { SOP_PROGRESS_KEY } from '../sop-library/ui.js';
import { SME_PROGRESS_KEY } from '../sme/ui.js';
import { coursesFor } from '../shared/role.js';

export const REVIEW_KEY = 'queuecraft:review:v1';
export const PASS_MARK = 5; // of six questions
export const QUIZ_ROLES = ['tl', 'sme'];

// Each course: where its progress is kept, its lessons and its address from review/.
const COURSES = {
  lifecycle: { key: 'agent-lifecycle-course:v1', lessons: LESSONS, path: '../agent-lifecycle/' },
  sop: { key: SOP_PROGRESS_KEY, lessons: SOP_LESSONS, path: '../sop-library/' },
  sme: { key: SME_PROGRESS_KEY, lessons: SME_LESSONS, path: '../sme/' },
};

const isRecord = (r) => r && Number.isInteger(r.best) && Number.isInteger(r.total) && typeof r.passed === 'boolean';

// Results by role; anything unreadable or unknown is left out.
export function loadReview(storage) {
  try {
    const data = JSON.parse(storage.getItem(REVIEW_KEY));
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    return Object.fromEntries(QUIZ_ROLES.filter((r) => isRecord(data[r]))
      .map((r) => [r, { best: data[r].best, total: data[r].total, passed: data[r].passed }]));
  } catch {
    return {};
  }
}

// Stores a finished run. The best score and a pass are never taken back.
export function recordRun(storage, role, correct, total) {
  const all = loadReview(storage);
  const before = all[role];
  const passed = Boolean(before?.passed) || correct >= PASS_MARK;
  const record = { best: Math.max(before?.best ?? 0, correct), total, passed };
  try {
    storage.setItem(REVIEW_KEY, JSON.stringify({ ...all, [role]: record }));
  } catch { /* the run just won't be remembered */ }
  return { ...record, firstPass: passed && !before?.passed };
}

// Open once every lesson of the role's courses is finished; otherwise how many
// are left and the first unfinished one, in course order.
export function unlocked(storage, role) {
  const courses = coursesFor(role);
  if (!courses.length) return { open: false, left: 0, next: null };
  const pending = courses.flatMap((id) => {
    const c = COURSES[id];
    const done = new Set(storage ? loadProgress(storage, c.key).completed : []);
    return [...c.lessons].sort((a, b) => a.order - b.order).filter((l) => !done.has(l.id)).map((l) => `${c.path}#${l.id}-0`);
  });
  return { open: pending.length === 0, left: pending.length, next: pending.length ? { href: pending[0] } : null };
}
