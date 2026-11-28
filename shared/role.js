// The role the learner is preparing for (2026-11-25). Stored on this device
// only; missing, unknown or blocked storage means team lead, as before.
// Spec: docs/superpowers/specs/2026-11-25-role-select-sme-course-design.md §4.1.
export const ROLE_KEY = 'queuecraft:role';
export const ROLE_ASKED_KEY = 'queuecraft:role-asked';
// Fired on window when a role is saved, so parts of the page that depend on
// the role (the bottom menu's Guide) can follow at once (2026-11-25).
export const ROLE_EVENT = 'queuecraft:role';
export const ROLES = ['agent', 'sme', 'tl', 'am', 'om'];
export const DEFAULT_ROLE = 'tl';
// Roles that already have a course of their own, and the courses each role
// learns (home's course ids). Excel is for every role and belongs to none.
export const COURSE_ROLES = ['agent', 'sme', 'tl', 'am'];
export const ROLE_COURSES = { agent: ['agent', 'agent-career', 'agent-sop'], tl: ['tl', 'lifecycle', 'tl-support', 'sop'], sme: ['sme', 'sme-lifecycle', 'sme-sop'], am: ['am'] };
// The courses that open a role's review quiz. The SME quiz was written for
// SME First Steps and stays tied to it (design 2026-11-25-sme-learn-set §4.4).
export const REVIEW_COURSES = { tl: ['lifecycle', 'sop'], sme: ['sme'], agent: ['agent', 'agent-sop'] };

export function coursesFor(role) {
  return ROLE_COURSES[role] ?? [];
}

export function reviewCoursesFor(role) {
  return REVIEW_COURSES[role] ?? [];
}

// SMEs (2026-11-25) and agents (2026-11-26) learn the 11 basic Excel lessons
// only; team leads and managers also see the advanced five.
export function showsAdvancedExcel(role) {
  return role !== 'sme' && role !== 'agent';
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
  try {
    globalThis.window?.dispatchEvent(new globalThis.window.CustomEvent(ROLE_EVENT, { detail: role }));
  } catch { /* no page to tell */ }
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
