# 인력 산정 실험실: 채널 비교 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "채널 비교" tab to the Staffing Lab that compares phone, chat and email staffing side by side with center-wide Shrinkage, weekly/monthly hours and expected overtime.

**Architecture:** A pure calculation module (`channels.js`) reuses `erlang.js`; its copy lives in `text.js` as a new `CHANNEL_TEXT` export checked against the approved copy docs; a render module (`channels-render.js`) builds the tab once and rewrites numbers on update; `calculator.js` switches tabs by URL hash and keeps one shared Shrinkage value for both tabs.

**Tech Stack:** Vanilla ES modules, node:test + jsdom (`cd agent-lifecycle && npm test`), Playwright browser check (`python3 agent-lifecycle/scripts/browser_check.py`).

**Spec:** `docs/superpowers/specs/2026-11-21-staffing-channels-design.md` · copy: `docs/superpowers/specs/2026-11-21-staffing-channels-copy.md` (ko, approved) and `.en.md`

## Global Constraints

- The 30-minute practice tab's behavior and wording do not change (only the two tab names are added above it).
- Every shown figure is marked "예시"/"example" by its heading or line; no country's law is named; no "진상"; any hint ≤ 3 sentences.
- Korean copy is exactly the approved copy doc; English exactly the `.en.md` doc.
- Constants: interval 30 min, service-level target 0.8 (`TARGET_SERVICE_LEVEL`), email occupancy 0.85, month = week × 52 ÷ 12.
- Rounding: weekly hours `Math.round`; overtime and monthly from the rounded weekly (`monthly = Math.round(weekly × 52/12)`); per-agent overtime one decimal; staff needed = `Math.ceil(unrounded weekly ÷ weeklyHours)`; totals are sums of the shown per-channel values.
- Total "difference" shows short and spare separately (`totalBoth` / `totalShort` / `totalSpare` / `gapExact`), never a net figure.
- Planned and unplanned Shrinkage are one shared value across both tabs.
- 320px–1280px, ko/en, light/dark, keyboard and screen reader usable; after runtime changes run `python3 tools/sw_list.py`.

## Review Focus

1. Turning off the last channel that is on — it must stay on (Task 3: `the last channel on cannot be turned off`).
2. Turning off the channel being edited — editing moves to the first channel still on (Task 3: `turning off the edited channel moves editing to one still on`).
3. Current staff 0 — per-agent overtime shows `noStaff`, difference is "{needed}명 부족", no NaN/Infinity (Task 1: `zero current staff`; Task 3 render check).
4. Slider extremes — every channel at every min/max gives finite numbers; chat with concurrency 1 equals the phone calculation with the same inputs (Task 1).
5. Totals equal the sum of the visible columns after one channel is turned off, and the English table fits 320px without page overflow (Task 3, Task 5).

---

### Task 1: Channel calculation module

**Files:**
- Create: `staffing-calculator/channels.js`
- Test: `agent-lifecycle/tests/staffing-channels.test.js`

**Interfaces:**
- Consumes: `trafficIntensity`, `requiredPositions` from `staffing-calculator/erlang.js`; `INPUTS`, `TARGET_SERVICE_LEVEL`, `INTERVAL_MINUTES` from `model.js` (planned/unplanned ranges and initial values come from `INPUTS`).
- Produces:
  - `CHANNELS = ['phone', 'chat', 'email']`
  - `EMAIL_OCCUPANCY = 0.85`, `WEEKS_PER_MONTH = 52 / 12`
  - `COMMON_INPUTS`: `[planned, unplanned]` (copied from `INPUTS`) + `{ id: 'weeklyHours', min: 20, max: 60, step: 1, initial: 40, unit: 'hours' }`
  - `CHANNEL_INPUTS: { phone: Input[], chat: Input[], email: Input[] }` where `Input = { id, min, max, step, initial, unit }`, in screen order:
    - phone: dailyVolume 100–5000/50 init 1600 `count`; aht 1–15/0.5 init 5 `min`; target 10–120/5 init 20 `sec`; hoursOpen 1–24/1 init 10 `hours`; daysOpen 1–7/1 init 6 `days`; current 0–200/1 init 36 `people`
    - chat: dailyVolume 50–3000/50 init 800; aht 2–30/1 init 12; concurrency 1–4/1 init 2 `chats`; target 10–300/10 init 60; hoursOpen init 10; daysOpen init 6; current init 22
    - email: dailyVolume 10–2000/10 init 300; aht 1–30/1 init 8; hoursOpen init 8; daysOpen init 5; current init 10
  - `initialChannels(): { common: { planned, unplanned, weeklyHours }, on: { phone: true, chat: true, email: true }, edit: 'phone', phone: {...}, chat: {...}, email: {...} }`
  - `computeChannel(kind, values, common): { seats, needed, current, gap, weekly, monthly, otWeekly, otMonthly, otPerPerson }` — `otPerPerson` is `null` when `current === 0`
  - `computeChannels(state): { rows: { [kind]: ChannelResult } (only channels on, in CHANNELS order), total: { seats, needed, current, short, spare, weekly, monthly, otWeekly, otMonthly } }` — `short` = sum of `-gap` over channels with `gap < 0`, `spare` = sum of `gap` over `gap > 0`

- [ ] **Step 1: Write the failing tests**

```js
test('the example values give the documented channel results', () => {
  const r = computeChannels(initialChannels());
  const pick = (k) => { const x = r.rows[k]; return [x.seats, x.needed, x.gap, x.weekly, x.monthly, x.otWeekly, x.otMonthly, x.otPerPerson]; };
  assert.deepEqual(pick('phone'), [18, 39, -3, 1543, 6686, 103, 446, 2.9]);
  assert.deepEqual(pick('chat'), [11, 24, -2, 943, 4086, 63, 273, 2.9]);
  assert.deepEqual(pick('email'), [6, 9, 1, 336, 1456, 0, 0, 0]);
  assert.deepEqual(r.total, { seats: 35, needed: 72, current: 68, short: 5, spare: 1, weekly: 2822, monthly: 12228, otWeekly: 166, otMonthly: 719 });
});
test('only channels that are on are compared and totalled', () => { /* on.email=false → rows keys ['phone','chat'], total.needed 63, total.spare 0 */ });
test('zero current staff', () => { /* phone current 0 → otPerPerson null, gap === -needed, otWeekly === weekly */ });
test('chat with one concurrent chat is the phone calculation', () => { /* same dailyVolume/aht/target/hours/days/current → equal results */ });
test('every slider extreme gives finite numbers', () => { /* each channel × each input at min and max, others initial → every field Number.isFinite or otPerPerson === null */ });
test('no Shrinkage means weekly hours equal desk hours', () => { /* planned 0, unplanned 0 → phone weekly === 18*10*6 = 1080 */ });
test('the phone column uses the same Erlang C as the 30-minute practice', () => { /* seats === requiredPositions(trafficIntensity(1600/20, 5, 30), 5, 20/60, { serviceLevel: TARGET_SERVICE_LEVEL }).raw */ });
```

- [ ] **Step 2: Run — Expected: FAIL** (`Cannot find module .../channels.js`). Run: `cd agent-lifecycle && npm test 2>&1 | grep -E "^not ok|^# (pass|fail)"`
- [ ] **Step 3: Implement `staffing-calculator/channels.js`** per the spec §4 formulas: phone/chat `v = dailyVolume ÷ (hoursOpen × 2)`, chat handle time `aht ÷ concurrency`, `seats = requiredPositions(...).raw`, `deskHoursPerDay = seats × hoursOpen`; email `deskHoursPerDay = dailyVolume × aht ÷ 60 ÷ EMAIL_OCCUPANCY`, `seats = Math.ceil(deskHoursPerDay ÷ hoursOpen)`; then Global Constraints rounding.
- [ ] **Step 4: Run — Expected: PASS**, full suite green.
- [ ] **Step 5: Commit** `feat(staffing): channel comparison calculation`

### Task 2: Channel copy (ko + en)

**Files:**
- Modify: `staffing-calculator/text.js` (add `export const CHANNEL_TEXT`, `export const CHANNEL_GLOSSARY`)
- Modify: `agent-lifecycle/tests/staffing.test.js:156` (content-rule exemption `/^try\d$/` → `/^tryC?\d$/`)
- Test: `agent-lifecycle/tests/staffing-channels.test.js`

**Interfaces:**
- Produces `CHANNEL_TEXT` with `{ko,en}` leaves: `tabsLabel, tabPractice, tabChannels, channelsIntro, commonHeading, pickHeading, pickNote, editHeading, channel.{phone,chat,email}, label.{weeklyHours,dailyVolume,concurrency,hoursOpen,daysOpen,current}, hint.{weeklyHours,dailyVolume,concurrency,hoursOpen,daysOpen,current,ahtChat,ahtEmail,targetChat}, unit.{hours,days,chats}, resultsHeading, total, row.{seats,needed,current,diff,weekly,monthly,otWeekly,otMonthly,otPerPerson}, rowHint.{seats,needed,weekly,monthly,otWeekly}, totalBoth, totalShort, totalSpare, noStaff, otNote, summary, tryC1, tryC2, tryC3, channelsLimits`.
- Reused wording comes from `STAFFING_TEXT` (`exampleNote, label.planned/unplanned/aht/target, hint.planned/unplanned/aht/target, gapShort/gapExact/gapSpare, tryHeading, limitsHeading, countryNote, unit.*`), never copied.
- `CHANNEL_GLOSSARY = { needed: 'fte', weekly: 'shrinkage', seats: 'occupancy' }`.

- [ ] **Step 1: Failing tests** — `the channel Korean wording is the approved copy doc` and `the channel English wording is the .en copy doc`: parse every markdown table row `| key | … |` of each doc, skip rows whose text starts with `(다시 씀)`/`(reused)`, map doc keys to paths (`aht (채팅)`→`hint.ahtChat`, `aht (이메일)`→`hint.ahtEmail`, `target (채팅)`→`hint.targetChat`, `currentRow`→`row.current`, three-column rows give `label.*`/`row.*` and `hint.*`/`rowHint.*`), and `assert.equal` each. Plus `channel wording follows the content rules` (reuse the rules: no 진상, ≤ 3 sentences, en has no Korean, unlabelled figures fail except `tryC\d`).
- [ ] **Step 2: Run — Expected: FAIL** (`CHANNEL_TEXT` undefined).
- [ ] **Step 3: Add `CHANNEL_TEXT` and `CHANNEL_GLOSSARY`** to `text.js`, copying the two docs exactly.
- [ ] **Step 4: Run — Expected: PASS**, full suite green.
- [ ] **Step 5: Commit** `feat(staffing): channel comparison wording`

### Task 3: Channel tab rendering

**Files:**
- Create: `staffing-calculator/channels-render.js`
- Modify: `staffing-calculator/calculator.css` (toggles, edit chips, table wrap)
- Test: `agent-lifecycle/tests/staffing-channels.test.js`

**Interfaces:**
- Consumes: Task 1 `CHANNELS, COMMON_INPUTS, CHANNEL_INPUTS, computeChannels`; Task 2 `CHANNEL_TEXT, CHANNEL_GLOSSARY`; `STAFFING_TEXT, GLOSSARY_LINKS, fill`.
- Produces: `renderChannels(root, state, lang, { onCommon(id, value), onChannel(kind, id, value), onToggle(kind, on), onEdit(kind), statusDelay = 600 }): { update(state) }`. Built once; `update` rewrites values, table and visibility only (focus stays on the moved slider). DOM hooks: `[data-ch-toggle=kind]` checkbox (disabled when it is the only one on), `[data-ch-edit=kind]` button `aria-pressed`, `[data-ch-fields=kind]` slider group (`hidden` unless edited), `input[data-ch-input="kind.id"]`, `input[data-common-input=id]`, `table[data-ch-table]` with `th[scope=col][data-col=kind|total]` and `tr[data-row=key]`, `[data-ch-status]` role=status.
- Numbers: `toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US')`; units from `STAFFING_TEXT.unit`/`CHANNEL_TEXT.unit`; per-agent one decimal or `noStaff`; total per-agent cell `–`.

- [ ] **Step 1: Failing tests:** `the channel tab shows the example results` (cells for phone/chat/email/total match Task 1 numbers, diff cells "3명 부족"/"2명 부족"/"1명 여유"/"부족 5명 · 여유 1명"); `the last channel on cannot be turned off` (turn off chat and email via `onToggle` → phone toggle `disabled`); `turning off the edited channel moves editing to one still on` (edit chat, toggle chat off → caller's `onEdit` receives `'phone'` or the render shows phone fields — test the rendered state after `update`); `totals follow the visible columns`; `zero staff shows noStaff`; `the English channel tab has no Korean`; `sliders speak their value with a unit`; `one status sentence after sliders settle` (filled `summary`).
- [ ] **Step 2: Run — Expected: FAIL** (module missing).
- [ ] **Step 3: Implement `renderChannels`** and CSS (`.ch-table-wrap { overflow-x: auto }`, page must not overflow).
- [ ] **Step 4: Run — Expected: PASS**, full suite green.
- [ ] **Step 5: Commit** `feat(staffing): channel comparison tab`

### Task 4: Tabs and shared state

**Files:**
- Modify: `staffing-calculator/calculator.js`, `staffing-calculator/render.js` (only to accept being mounted inside a tab panel; wording unchanged)
- Test: `agent-lifecycle/tests/staffing-channels.test.js`

**Interfaces:**
- Consumes: Task 3 `renderChannels`; existing `renderCalculator`, `initialValues`.
- Produces: tab bar `nav[aria-label=tabsLabel]` with links `a[data-tab=practice][href="#"]`, `a[data-tab=channels][href="#channels"]`, `aria-current="page"` on the active one; `hashchange` redraws; `document.title` = `${tabName} · ${title}` on the channels tab. One state object: practice `values` and `channels`; `channels.common.planned/unplanned` are always `values.planned/unplanned`.

- [ ] **Step 1: Failing tests** (import `calculator.js` into jsdom with a fake `location.hash`, or extract `mountLab(doc, storage)` from it): `#channels opens the channel tab`; `the practice tab is the default and its wording is unchanged`; `moving Shrinkage in one tab moves it in the other`; `switching tabs keeps every value`.
- [ ] **Step 2: Run — Expected: FAIL.**
- [ ] **Step 3: Implement** tab bar and wiring.
- [ ] **Step 4: Run — Expected: PASS**, full suite green.
- [ ] **Step 5: Commit** `feat(staffing): practice and channel tabs`

### Task 5: Browser check, offline list, README, LOG

**Files:**
- Modify: `agent-lifecycle/scripts/browser_check.py`, `sw.js` (via `python3 tools/sw_list.py`), `README.md` (staffing row mentions channel comparison), `LOG.md` (entry 46, "검토 중")

- [ ] **Step 1: Add browser checks** `(ch)`: `#channels` opens with the documented total row; no page overflow at 320/390/1280 in ko and en; Tab/Enter reach both tabs; turning email off updates totals; last toggle disabled; no console errors; screenshots `staffing-channels-390.png`, `staffing-channels-320-en.png`.
- [ ] **Step 2: Run** `timeout 590 python3 agent-lifecycle/scripts/browser_check.py > /tmp/bc.txt 2>&1; tail -1 /tmp/bc.txt` — Expected: `ALL CHECKS PASSED` (if a check fails, fix the code under TDD, not the check).
- [ ] **Step 3: `python3 tools/sw_list.py`**, README row, LOG 46; full `npm test` green.
- [ ] **Step 4: Commit** `chore(staffing): browser checks, offline list, README, LOG`
