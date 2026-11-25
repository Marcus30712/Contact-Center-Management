// The role picker at the top left of the site's own pages (2026-11-26). It
// takes the place of the "Queuecraft" word, which repeated the home title.
// Design: docs/superpowers/specs/2026-11-26-role-switch-design.md
import { ROLES, saveRole } from './role.js';
import { ROLE_NAMES, ROLE_UI } from './role-data.js';

// A plain <select>: phones show their own picker, keyboards and screen
// readers already know it.
export function renderRoleSwitch(doc, lang, role, onPick) {
  const say = (entry) => entry[lang] ?? entry.ko;
  const select = doc.createElement('select');
  select.className = 'role-switch';
  select.setAttribute('aria-label', say(ROLE_UI.settingsHeading));
  for (const r of ROLES) {
    const option = doc.createElement('option');
    option.value = r;
    option.textContent = say(ROLE_NAMES[r]);
    select.append(option);
  }
  select.value = role;
  select.addEventListener('change', () => onPick(select.value));
  return select;
}

// Save the role (when storage allows) and open that role's home at the top.
export function pickRole(storage, role, homeUrl, go) {
  try {
    saveRole(storage, role);
  } catch { /* the choice just won't persist */ }
  go(homeUrl);
}
