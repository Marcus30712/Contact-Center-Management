# Start Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When the app is opened at home, a start screen covers it once per visit: Miso, logo, tagline, a greeting chosen by time of day and weekday, an offline line, Start, and the language toggle.

**Architecture:** Pure logic (`pickGreeting`, `shouldShowStart`) and approved copy in `home/start-data.js`/`home/start.js`; a renderer mounts a modal overlay on the home page; `home/app.js` shows it before the tour and starts the tour after it closes.

**Tech Stack:** Vanilla ES modules; `cd agent-lifecycle && npm test`; `python3 agent-lifecycle/scripts/browser_check.py`; `python3 tools/sw_list.py`.

**Spec:** `docs/superpowers/specs/2026-11-22-start-screen-design.md` · English: `…-start-screen-copy.en.md`

## Global Constraints

- Korean exactly as spec §5, English exactly as the `.en.md` doc (tests compare word for word).
- Time slots by local clock, start hour inclusive: 0–5 small hours, 5–11 morning, 11–14 lunch, 14–18 afternoon, 18–22 evening, 22–24 night. Weekday groups first: Monday 5–11, Friday 14–22, Saturday/Sunday 5–22.
- Show only when: path is home with no hash, `document.referrer` is not same-origin, no `?tour=1`, and the session flag is not set. Blocked session storage → show (closing is one tap).
- Nothing new in localStorage. Session key `queuecraft:started` in sessionStorage only.
- Offline line: same rule as Settings — ready (controller or `ready` resolved with a `cckb-` cache) → ready text; registration exists but not ready → getting-ready text; no support / no registration / error → line hidden.
- Dialog: `role="dialog"`, `aria-modal="true"`, labelled; focus on Start when open; Enter/Esc/Start close; background inert while open; reduced motion → no animation.
- 320–1280px, ko/en, light/dark, no overflow; content rules (no "진상", ≤ 3 sentences, no law).

## Review Focus

1. Boundary hours and weekdays pick the right group (Task 1 `pickGreeting boundaries`).
2. Coming back to home from another page or via `#learn`/`#browse` never shows the screen (Task 1 `shouldShowStart`; Task 3 browser `(st)`).
3. First visit: start screen closes, then the tour starts, never both at once (Task 2 test, Task 3 browser).
4. Keyboard and screen readers: focus starts on Start, background unreachable, Esc closes, focus moves to the home heading (Task 2).
5. A greeting never runs over its box at 320px in English, and the overlay never scrolls the page sideways (Task 3 browser).

---

### Task 1: Greeting data and pure logic

**Files:** Create `home/start-data.js`, `home/start.js` · Test `agent-lifecycle/tests/start.test.js`

**Interfaces — Produces:**
- `START_UI = { logo, tagline, start, offlineWait, offlineReady, dialog, misoAlt }` (each `{ko,en}`)
- `GREETINGS = { smallHours, morning, lunch, afternoon, evening, night, monday, friday, weekend }` → `{ face, lines: [{ko,en}, …] }`
- `greetingGroup(date: Date): string`
- `pickGreeting(date: Date, rand: () => number): { group, face, line: {ko,en} }`
- `shouldShowStart({ href: string, referrer: string, session: Storage|null }): boolean`
- `markStarted(session)`; `START_KEY = 'queuecraft:started'`

- [ ] **Step 1: Failing tests** — copy equals the spec §5 tables and the `.en.md` tables (parse rows; blank group cell = previous group); `pickGreeting boundaries` (Sunday 2026-11-22 = weekend; e.g. Mon 10:59 → monday, Mon 11:00 → lunch, Fri 13:59 → lunch, Fri 14:00 → friday, Fri 22:00 → night, Sat 04:59 → smallHours, Sat 05:00 → weekend, Sat 21:59 → weekend, Sat 22:00 → night, Tue 0:00 → smallHours, Tue 23:59 → night); `rand` picks within the group (0 → first line, 0.999 → last); faces exist in `assets/miso/`; `shouldShowStart`: true for `https://x/kb/` with empty referrer; false for `#learn`, `#browse`, `?tour=1`, same-origin referrer, session flag set; true with `session = null`; content rules (no 진상, ≤ 3 sentences, en has no Korean, en sentences ≤ ko).
- [ ] **Step 2: Run — Expected: FAIL** (modules missing).
- [ ] **Step 3: Implement** both modules.
- [ ] **Step 4: Run — Expected: PASS**, full suite green.

### Task 2: The start screen on the home page

**Files:** Create `home/start-render.js`, `home/start.css` (linked from `index.html`) · Modify `home/app.js` · Test `agent-lifecycle/tests/start.test.js`

**Interfaces — Produces:** `renderStart(doc, lang, { greeting, offline: 'ready'|'wait'|null, onClose, onLang }): { close(), setOffline(state), setLang(lang) }`; overlay `[data-start]` with `[data-start-greeting]`, `[data-start-offline]`, `button[data-start-go]`, language toggle inside.

- [ ] **Step 1: Failing tests** (jsdom) — overlay shows face image `assets/miso/<face>.webp`, logo, tagline, greeting text, Start; `role=dialog` + `aria-modal` + label; Start focused; Enter and Esc and Start call `onClose` once and remove the overlay; `#app` and the app bar are `inert` while open and not after; offline `null` hides the line, `'wait'`/`'ready'` show the texts; `setLang('en')` swaps every text and leaves no Korean; `home/app.js` wiring (import-level): tour starts only after `onClose` (mock `startTour` via the exported `bootHome({ startTour })` seam or equivalent).
- [ ] **Step 2: Run — Expected: FAIL.**
- [ ] **Step 3: Implement** renderer, CSS (full-screen, centered column like 리아와 파이썬, Queuecraft colors, reduced-motion), and `home/app.js` (show → markStarted on close → focus `h1` → tour if due; offline state from `navigator.serviceWorker.getRegistration()`/`ready` + caches as in Settings).
- [ ] **Step 4: Run — Expected: PASS**, full suite green.

### Task 3: Browser check, offline list, LOG

**Files:** `agent-lifecycle/scripts/browser_check.py`, `sw.js` (via `tools/sw_list.py`), `LOG.md` (entry 49 "검토 중"), README if it lists home features.

- [ ] **Step 1: Browser checks `(st)`:** fresh context (no session) opening `./` shows the overlay with a greeting from the right group for a pinned clock (`page.clock`/init script overriding `Date`); Enter closes it; first visit then shows the tour; reload in the same tab → no overlay; open `./#learn` fresh → no overlay; open a lesson then click Home → no overlay; 320/390/1280 ko/en and dark, no overflow; screenshots `start-390.png`, `start-320-en.png`, `start-390-dark.png`. Existing checks that open home must close the overlay first (helper `close_start(page)`).
- [ ] **Step 2: Run** `timeout 590 python3 agent-lifecycle/scripts/browser_check.py > /tmp/bc.txt 2>&1; tail -1 /tmp/bc.txt` — Expected: `ALL CHECKS PASSED`.
- [ ] **Step 3:** `python3 tools/sw_list.py`; LOG 49; full `npm test` green.
