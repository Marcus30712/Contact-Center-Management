// Start screen logic: which greeting fits the moment, and whether to show the
// screen at all. No DOM here. Rules: docs/superpowers/specs/2026-11-22-start-screen-design.md §4.
import { GREETINGS } from './start-data.js';

// Local clock, start hour inclusive. Weekday groups come before the time slot.
export function greetingGroup(date) {
  const hour = date.getHours();
  const day = date.getDay(); // 0 Sunday … 6 Saturday
  if (day === 1 && hour >= 5 && hour < 11) return 'monday';
  if (day === 5 && hour >= 14 && hour < 22) return 'friday';
  if ((day === 0 || day === 6) && hour >= 5 && hour < 22) return 'weekend';
  if (hour < 5) return 'smallHours';
  if (hour < 11) return 'morning';
  if (hour < 14) return 'lunch';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}

export function pickGreeting(date, rand = Math.random) {
  const group = greetingGroup(date);
  const { face, lines } = GREETINGS[group];
  const i = Math.min(lines.length - 1, Math.floor(rand() * lines.length));
  return { group, face, line: lines[i] };
}

// Only when the app is opened at home: the bare home address, freshly opened
// (not a reload or back/forward), not reached from another page of this site,
// and not "replay the tutorial". Nothing is stored.
export function shouldShowStart({ href, referrer, navType }) {
  const url = new URL(href);
  if (url.hash || url.searchParams.has('tour')) return false;
  if (navType === 'reload' || navType === 'back_forward') return false;
  if (referrer) {
    try {
      if (new URL(referrer).origin === url.origin) return false;
    } catch { /* not a URL: treat as outside */ }
  }
  return true;
}

// Offline readiness, judged as Settings does: ready once a worker controls the
// page or becomes ready; hidden (null) when there is no worker or registration.
// Calls set(state) as the state becomes known. "Getting ready" is shown before
// waiting for ready, so a worker that is already ready can never be painted
// over by "getting ready".
export async function watchOffline(sw, set) {
  try {
    if (!sw) return set(null);
    if (sw.controller) return set('ready');
    const registration = await sw.getRegistration();
    if (!registration) return set(null);
    set('wait');
    sw.ready.then(() => set('ready')).catch(() => {});
  } catch {
    set(null);
  }
}

// The old home address of Browse (bookmarks, before 2026-11-25) now opens the Browse page.
export function browseRedirect(href) {
  const url = new URL(href);
  if (url.hash !== '#browse') return null;
  return new URL('browse/', new URL('./', url)).href;
}
