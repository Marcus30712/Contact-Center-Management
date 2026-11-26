// Settings: the display theme and the progress backup. No DOM drawing here
// except setting <html data-theme>; storage is passed in.
import { LANG_KEY } from '../agent-lifecycle/js/engine/i18n.js';
import { TRACK_KEY } from '../agent-lifecycle/js/engine/track.js';
import { PROGRESS_KEY } from '../agent-lifecycle/js/engine/progress.js';
import { PROGRESS_KEY as EXCEL_KEY } from '../excel/engine.js';
import { PRACTICE_KEY } from '../practice/engine.js';
import { SOP_PROGRESS_KEY } from '../sop-library/ui.js';
import { ROLE_KEY, ROLE_ASKED_KEY } from '../shared/role.js';
import { SME_PROGRESS_KEY } from '../sme/ui.js';
import { SL_PROGRESS_KEY } from '../sme-lifecycle/ui.js';
import { SS_PROGRESS_KEY } from '../sme-sop/ui.js';
import { TL_PROGRESS_KEY } from '../tl/ui.js';
import { TS_PROGRESS_KEY } from '../tl-support/ui.js';
import { AGENT_PROGRESS_KEY } from '../agent/ui.js';
import { AC_PROGRESS_KEY } from '../agent-career/ui.js';
import { REVIEW_KEY } from '../review/engine.js';

// shared/theme-boot.js reads the same key before each page draws.
export const THEME_KEY = 'queuecraft:theme';
export const THEMES = ['system', 'light', 'dark'];

export function loadTheme(storage) {
  try {
    const saved = storage.getItem(THEME_KEY);
    if (THEMES.includes(saved)) return saved;
  } catch { /* fall back to the default */ }
  return 'system';
}

export function saveTheme(storage, theme) {
  try {
    storage.setItem(THEME_KEY, THEMES.includes(theme) ? theme : 'system');
  } catch { /* choice just won't persist */ }
}

// "system" leaves the attribute off, so the stylesheet follows the phone.
export function applyTheme(doc, theme) {
  if (theme === 'light' || theme === 'dark') doc.documentElement.setAttribute('data-theme', theme);
  else doc.documentElement.removeAttribute('data-theme');
}

// Everything a learner would lose when changing phones. Order is the file's order.
export const BACKUP_KEYS = [LANG_KEY, TRACK_KEY, THEME_KEY, ROLE_KEY, ROLE_ASKED_KEY, PROGRESS_KEY, SOP_PROGRESS_KEY, EXCEL_KEY, PRACTICE_KEY, SME_PROGRESS_KEY, REVIEW_KEY, SL_PROGRESS_KEY, SS_PROGRESS_KEY, TL_PROGRESS_KEY, TS_PROGRESS_KEY, AGENT_PROGRESS_KEY, AC_PROGRESS_KEY];
// A file must carry some progress: replacing everything with an empty file
// (exported on a fresh or blocked browser) would wipe a learner's records.
const PROGRESS_KEYS = [PROGRESS_KEY, SOP_PROGRESS_KEY, EXCEL_KEY, PRACTICE_KEY, SME_PROGRESS_KEY, REVIEW_KEY, SL_PROGRESS_KEY, SS_PROGRESS_KEY, TL_PROGRESS_KEY, TS_PROGRESS_KEY, AGENT_PROGRESS_KEY, AC_PROGRESS_KEY];

// "Reset learning" clears these and nothing else: language, job track,
// display mode and the tutorial flag stay.
export const RESET_KEYS = PROGRESS_KEYS;

// Erases the learning records. True when there was something to erase.
export function resetLearning(storage) {
  let had = false;
  for (const key of RESET_KEYS) {
    try {
      if (storage?.getItem(key) == null) continue;
      had = true;
      storage.removeItem(key);
    } catch { /* blocked storage: nothing stored to erase */ }
  }
  return had;
}

export function makeBackup(storage, today) {
  const data = {};
  for (const key of BACKUP_KEYS) {
    try {
      const v = storage.getItem(key);
      if (typeof v === 'string') data[key] = v;
    } catch { /* blocked storage: nothing to save */ }
  }
  return { app: 'queuecraft', format: 1, exported: today, data };
}

// The data of a CX Replay backup file, or null for anything else.
export function readBackup(text) {
  let file;
  try { file = JSON.parse(text); } catch { return null; }
  if (!file || typeof file !== 'object' || Array.isArray(file)) return null;
  if (file.app !== 'queuecraft' || file.format !== 1) return null;
  const { data } = file;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  for (const [key, value] of Object.entries(data)) {
    if (!BACKUP_KEYS.includes(key) || typeof value !== 'string') return null;
  }
  if (!PROGRESS_KEYS.some((key) => key in data)) return null;
  return data;
}

// The role is kept when a file lacks it: files made before roles existed
// (2026-11-25) should not make the app ask again.
const KEEP_WHEN_MISSING = [ROLE_KEY, ROLE_ASKED_KEY];

// Put the file's values in place; our keys the file lacks are cleared.
// Returns false if the browser refused to store something.
export function restoreBackup(storage, data) {
  for (const key of BACKUP_KEYS) {
    try {
      if (key in data) storage.setItem(key, data[key]);
      else if (!KEEP_WHEN_MISSING.includes(key)) storage.removeItem?.(key);
    } catch {
      if (key in data) return false;
    }
  }
  return true;
}
