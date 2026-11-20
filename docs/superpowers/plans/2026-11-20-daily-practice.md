# 오늘의 연습 (2단계) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended here) or superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A `practice/` page where a new team lead answers up to 3 review questions a day from finished lessons, flips term cards, keeps a weekday streak and earns 9 badges, with Miso reacting; plus a home card.

**Architecture:** Pure logic in `practice/engine.js` (no DOM, storage passed in, `today` passed in as `YYYY-MM-DD`) so every rule is unit-tested; copy in `practice/data.js`; DOM in `practice/render.js`; wiring in `practice/app.js`. Questions and terms come from the existing lesson and glossary modules; nothing in them changes.

**Tech Stack:** vanilla ES modules, node --test + jsdom, Playwright browser check; no build.

**Spec:** `docs/superpowers/specs/2026-11-20-daily-practice-design.md` (confirmed 2026-11-20).

## Global Constraints
- Copy = spec §6 tables exactly (Korean and English); English has no Hangul; every string `{ko, en}`.
- Read-only on `agent-lifecycle-course:v1`, `sop-library:v1`, `agent-lifecycle-course:track`; own state only in `kb-practice:v1`; every storage call in try/catch.
- Dates are the phone's local date `YYYY-MM-DD`; weekday = Mon–Fri.
- Question keys `lifecycle:<checkpoint id>` / `sop:<checkpoint id>`.
- Miso: think, joy, worry, cheer, proud, wink from `assets/miso/`; each with alt text.
- After any runtime file change run `python3 tools/sw_list.py`; suite `cd agent-lifecycle && npm test` (baseline 273) and `python3 agent-lifecycle/scripts/browser_check.py` stay green.

## Review Focus
1. Day rollover: a page left open past midnight, then answered — the answer must land on the day it was picked for, and the next open picks a new set (test in Task 1: `recordAnswer` ignores ids not in `state.today.ids`; `ensureToday` with a new date replaces `today`).
2. Corrupt or foreign-shaped `kb-practice:v1` (array, missing fields, unknown ids from removed questions) must load as usable state, never throw (Task 1 `loadState` test).
3. Streak around weekends and year/month ends (Fri→Mon, Dec 31→Jan 2) computed from local dates, not UTC (Task 1 streak tests use date strings only).
4. A track switch after picking: today's set stays, but a later day must not pick the other track's questions (Task 1 `pool` test).
5. Fewer than 3 open questions: 1–2 shown, "만점" not awarded (Task 1 badges test).

---

### Task 1: Practice engine

**Files:** Create `practice/engine.js`; Test `agent-lifecycle/tests/practice-engine.test.js`

**Interfaces — Produces:**
- `PRACTICE_KEY = 'kb-practice:v1'`
- `loadState(storage) -> State` / `saveState(storage, state) -> void` — State `{ days: string[], today: {date, ids, answers} | null, questions: {[key]: {last, missed}}, cards: {[termId]: {known, last}}, badges: {[id]: date} }`.
- `pool(storage) -> Question[]` — `{ key, course: 'lifecycle'|'sop', lessonId, lessonOrder, prompt, options, answer, explanation }` for finished lessons, current track.
- `ensureToday(state, pool, today) -> State` — picks once per date (priority: missed → never seen → oldest `last`; ties by a date-seeded shuffle), max 3.
- `recordAnswer(state, key, optionId, correct, today) -> { state, newBadges: string[] }` — ignores keys not in `today.ids` or already answered; adds `today` to `days` when all answered.
- `isWeekday(date) -> boolean`, `streak(days, today) -> { count, pending: boolean, weekend: boolean }`.
- `openTerms(storage) -> Term[]`, `todayCards(state, terms, today) -> Term[]` (max 5: again → unseen → oldest known), `markCard(state, termId, known, today) -> { state, newBadges }`.
- `checkBadges(state, ctx) -> string[]` (newly earned ids; ctx `{ today, lastDayPerfect, comeback, openTermCount, lifecycleDone, sopDone }`); `BADGE_IDS = ['first','streak3','week','month','perfect','comeback','terms','lifecycle','sop']`.

- [ ] **Step 1: Write failing tests** — names and key assertions:
  - `pool: only finished lessons, current track, keys prefixed by course` — with lifecycle `['hiring']`, track `tech`: keys all start `lifecycle:hiring-`, none has `track: 'general'`; with sop `['coaching']` both `lifecycle:` and `sop:coaching-q*` present, no key collides.
  - `ensureToday picks once a day: missed first, then unseen, then oldest` — state with one missed key returns it first; same date twice → same ids; new date → new `today`.
  - `ensureToday with 2 open questions picks 2`.
  - `recordAnswer counts the day only when every question is answered, ignores foreign keys`.
  - `streak counts weekdays only` — days Mon–Fri of one week, today next Mon not done → `{count:5, pending:true}`; Sat today → `weekend:true`, count from Fri; a missing Wed → count stops; weekend practice days ignored; `2026-12-31`(Thu)→`2027-01-01`(Fri) contiguous.
  - `badges: each of the nine` — first; streak3/week/month at 3/5/20; perfect only with 3 questions all right; comeback on a missed→right; terms at ≥10 open all known; lifecycle/sop on full completion; never awarded twice.
  - `cards: open by lesson, 17 unlinked open after any lesson, deck order again→unseen→oldest known, max 5`.
  - `loadState survives junk` — `'[]'`, `'{"days":5}'`, throwing storage → empty valid State.
- [ ] **Step 2:** `cd agent-lifecycle && node --test tests/practice-engine.test.js` → FAIL (module missing).
- [ ] **Step 3:** Implement `practice/engine.js` (date math on `YYYY-MM-DD` via `Date.UTC` parts so time zones can't shift a day; seeded shuffle from the date string).
- [ ] **Step 4:** same command → PASS; `npm test` all green.

### Task 2: Copy

**Files:** Create `practice/data.js`; Test `agent-lifecycle/tests/practice-copy.test.js`
**Produces:** `PRACTICE_UI` (keys of spec §6 first table, `{ko,en}`), `BADGES` (`[{id, name:{ko,en}, rule:{ko,en}}]` in spec order).

- [ ] **Step 1:** Test parses the two §6 markdown tables and asserts `PRACTICE_UI` and `BADGES` equal them; `BADGES.map(b=>b.id)` equals `BADGE_IDS`; no Hangul in English; no "진상".
- [ ] **Step 2:** run → FAIL. **Step 3:** write data. **Step 4:** run → PASS.

### Task 3: Practice page

**Files:** Create `practice/index.html`, `practice/render.js`, `practice/app.js`, `practice/practice.css`; Modify `shared/appbar.js` (`practice/` → learn); Test `agent-lifecycle/tests/practice-render.test.js`, `appbar.test.js`
**Consumes:** Task 1 and 2 exports. **Produces:** `renderPractice(root, lang, storage, today) -> void`.

- [ ] **Step 1: Failing tests:**
  - `locked when nothing finished` — `img[data-miso="think"]`, text `locked`, link `../agent-lifecycle/#hiring-0`, no `[data-question]`.
  - `answering shows right/wrong with Miso` — click right option → `img[data-miso="joy"]`, `[data-status]` contains `correct`; wrong → `worry`, explanation, `a[data-review]` to `../agent-lifecycle/#<lesson>-0` (or `../sop-library/…`); options disabled after answering.
  - `finishing the day shows cheer, streak, and a new badge with proud` — after 3 answers: `img[data-miso="cheer"]`, `[data-streak]` "🔥 1일째", `[data-badge-new]` "새 배지: 첫걸음", `img[data-miso="proud"]`.
  - `reopening the same day restores answers`.
  - `weekend line shows on Saturday with wink`.
  - `cards flip and mark` — `[data-card]` button flips to name+definition; "알아요" removes it from today's deck.
  - `badge shelf shows 9, unearned dimmed with rule`.
  - `English has no Hangul`.
  - appbar: `practice/` → `learn`.
- [ ] **Step 2:** run → FAIL. **Step 3:** implement (layout per spec §5.10; reuse `.option` button styles; one `[data-status]` `role="status"` line). `app.js`: language toggle, today = local date, redraw on `pageshow`. **Step 4:** PASS, `npm test` green.

### Task 4: Home card, offline, docs

**Files:** Modify `home/render.js`, `home/data.js` only if needed (copy comes from `PRACTICE_UI`), `home/home.css`, `README.md`, `LOG.md` (entry 17, 검토 중), regenerate `sw.js`; Modify `agent-lifecycle/scripts/browser_check.py`; Test `home.test.js`.
**Consumes:** `streak`, `loadState`, `pool`, `PRACTICE_UI`.

- [ ] **Step 1: Failing tests** — home: `a[data-practice]` to `./practice/` between `[data-greeting]` box and guide card; locked text `homeLocked` when nothing finished; with today partly answered shows `오늘 1/3`; done shows `homeDone`; streak text present.
- [ ] **Step 2:** FAIL. **Step 3:** implement. **Step 4:** PASS. 
- [ ] **Step 5:** browser check additions: practice at 320/390, dark, offline open, finish a lesson then answer 3 → cheer + 첫걸음; content above menu. Screenshots `practice-390.png`, `practice-390-dark.png`. Run → ALL CHECKS PASSED.

### Task 5: Review and approval
- [ ] Fresh whole-branch reviewer (Review Focus above); fix Critical/Important test-first; ledger rulings/minors.
- [ ] Report in Korean; ask commit/push/PR approval, then merge approval separately.
