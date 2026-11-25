// The role the learner is preparing for (2026-11-25). Stored on this device
// only; missing, unknown or blocked storage means team lead, as before.
// Spec: docs/superpowers/specs/2026-11-25-role-select-sme-course-design.md §4.1.
export const ROLE_KEY = 'queuecraft:role';
export const ROLE_ASKED_KEY = 'queuecraft:role-asked';
export const ROLES = ['agent', 'sme', 'tl', 'am', 'om'];
export const DEFAULT_ROLE = 'tl';
// Roles that already have a course of their own, and the courses each role
// learns (home's course ids). Excel is for every role and belongs to none.
export const COURSE_ROLES = ['sme', 'tl'];
export const ROLE_COURSES = { tl: ['lifecycle', 'sop'], sme: ['sme'] };

export function coursesFor(role) {
  return ROLE_COURSES[role] ?? [];
}

// The role a course is written for (undefined for shared ones such as Excel).
export function roleOf(courseId) {
  return Object.keys(ROLE_COURSES).find((r) => ROLE_COURSES[r].includes(courseId));
}

function read(storage, key) {
  try {
    return storage ? storage.getItem(key) : null;
  } catch {
    return null;
  }
}

function write(storage, key, value) {
  try {
    storage?.setItem(key, value);
  } catch { /* the choice just won't persist */ }
}

export function loadRole(storage) {
  const saved = read(storage, ROLE_KEY);
  return ROLES.includes(saved) ? saved : DEFAULT_ROLE;
}

export function saveRole(storage, role) {
  if (!ROLES.includes(role)) return;
  write(storage, ROLE_KEY, role);
  markRoleAsked(storage);
}

export function markRoleAsked(storage) {
  write(storage, ROLE_ASKED_KEY, '1');
}

// Ask only when storage works and nothing has been saved or declined yet.
export function shouldAskRole(storage) {
  if (!storage) return false;
  try {
    return storage.getItem(ROLE_KEY) == null && storage.getItem(ROLE_ASKED_KEY) == null;
  } catch {
    return false;
  }
}
