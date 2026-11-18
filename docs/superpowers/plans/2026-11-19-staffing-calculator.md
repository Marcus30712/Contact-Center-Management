# 인력 산정 실험실 (Staffing Lab) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-screen slider lab at `staffing-calculator/` where a new team leader moves volume, AHT, headcount and Shrinkage and sees service level, wait, occupancy and required staff change.

**Architecture:** A pure Erlang C module (`erlang.js`) ported from pyworkforce and checked against its numbers; a pure view-model (`model.js`) that turns six inputs into what the screen shows; a text file in both languages; a renderer that redraws results on every slider move. Language choice, language buttons and colour tokens are imported from `agent-lifecycle/`, as the glossary does.

**Tech Stack:** Static files, vanilla JS ES modules, inline SVG, `node --test` + jsdom, Playwright browser check with system Chrome.

**Spec:** `docs/superpowers/specs/2026-11-18-staffing-calculator-design.md`

## Global Constraints

- No build step, no new dependencies. Relative paths only (site is served under `/Contact-Center-Management/`).
- Tests live in `agent-lifecycle/tests/`; run with `npm test` inside `agent-lifecycle/` (baseline 154 passing). Browser check: `python3 agent-lifecycle/scripts/browser_check.py` → `ALL CHECKS PASSED`.
- Every visible string is `{ko, en}`; both required. Korean wording is the approved wording in spec §6, copied verbatim. Language key is the shared `agent-lifecycle-course:lang`; default Korean.
- Korean UI writes "Shrinkage" (not "슈링키지"). AHT = 평균 처리 시간.
- Content rules: no "진상"; ≤ 3 sentences per string; a digit followed by a unit (`%`, 초, 분, 명, sec, min, people) in explanatory text needs "예시"/"example" in the same string. Exempt: the three "이렇게 해 보세요" lines and strings with `{n}` placeholders filled from calculation.
- Glossary definitions contain no figures (existing validator).
- Interval fixed at 30 minutes. Target service level fixed at 0.8, shown as "예시 목표".
- No country-specific law. English uses US spelling ("license").
- pyworkforce credit: MIT, © Rodrigo Arenas, v0.5.4.
- No commit, push or merge without the user's approval. Work on branch `staffing-calculator`; commits are made once at the end after approval (commit steps below are deferred to that point).

## Review Focus

1. Overload: seated staff ≤ traffic intensity (including 0 seated) must show the "넘침" message, never `NaN`, `Infinity`, a negative number or a thrown error. → Task 1 `overload` tests, Task 2 `overloaded` tests, Task 5 check (z2).
2. Floating-point drift at slider steps (0.5-minute AHT, e.g. volume 100 × AHT 3 gives intensity 10 exactly; seated 10 must be overload). → Task 2 test "seated equal to intensity is overload".
3. Shrinkage at its maximum (40% + 30%) and headcount 1: seated floors to 0. → Task 2 test.
4. 320px width in English: six sliders with long labels must not cause sideways scroll. → Task 5 check (z4).
5. Keyboard and screen reader: sliders are native `<input type="range">` with a visible label tied by `for`, results sit in an `aria-live="polite"` region, the picture has a text summary. → Task 4 render tests.

---

### Task 1: Erlang C module

**Files:**
- Create: `staffing-calculator/erlang.js`
- Test: `agent-lifecycle/tests/erlang.test.js`

**Interfaces:**
- Produces (all times in minutes):
  - `trafficIntensity(transactions, aht, interval = 30): number`
  - `waitingProbability(positions, intensity): number` — throws `RangeError` when `positions <= intensity`
  - `serviceLevel(positions, intensity, aht, target): number`
  - `occupancy(positions, intensity): number`
  - `averageWait(positions, intensity, aht): number` — minutes; `Pw · aht / (positions − intensity)`
  - `requiredPositions(intensity, aht, target, { serviceLevel = 0.8, shrinkage = 0 } = {}): { raw, positions }`

- [ ] **Step 1: Write failing tests** with the pyworkforce values from spec §5.3, compared to 6 decimals (`Math.abs(a - b) < 5e-7`):
  - intensity: `trafficIntensity(100, 3) === 10`, `(120, 5) === 20`, `(60, 6) === 12`.
  - `(N, A, aht, target)` → SL / Pw / occupancy: `(11, 10, 3, 20/60)` → 0.389614 / 0.682118 / 0.909091; `(12, …)` → 0.640158 / 0.449388 / 0.833333; `(14, …)` → 0.888350 / 0.174132 / 0.714286; `(24, 20, 5, 20/60)` → 0.771698 / 0.298072 / 0.833333; `(16, 12, 6, 30/60)` → 0.853416 / 0.204574 / 0.750000.
  - required: `(10, 3, 20/60, {shrinkage: 0.3})` → `{raw: 14, positions: 20}`; `(20, 5, 20/60, {shrinkage: 0.25})` → `{25, 34}`; `(12, 6, 30/60, {shrinkage: 0.2})` → `{16, 20}`; `(1.5, 1.5, 2)` → `{3, 3}`.
  - overload: `waitingProbability(10, 10)` and `(0, 5)` throw `RangeError`.
  - `averageWait(14, 10, 3)` equals `0.174132 * 3 / 4` within 1e-5; service level is never below 0 (`serviceLevel(11, 10.999, 3, 0)` ≥ 0).
- [ ] **Step 2: Run** `npm test` → FAIL (module not found).
- [ ] **Step 3: Implement.** Erlang B by the iterative inverse (`inv = 1; for k in 1..N: inv = 1 + inv * k / A`), `Pw = N·B / (N − A·(1 − B))`, `SL = max(0, 1 − Pw·exp(−(N − A)·target/aht))`. `requiredPositions` starts at Python-style `round(A + 1)` (ties to even), increments until SL ≥ target, then `positions = ceil(raw / (1 − shrinkage))`. File header credits pyworkforce (MIT, © 2021 Rodrigo Arenas) and names `pyworkforce/queuing/erlang.py`.
- [ ] **Step 4: Run** `npm test` → all pass.

### Task 2: View-model

**Files:**
- Create: `staffing-calculator/model.js`
- Test: `agent-lifecycle/tests/staffing.test.js`

**Interfaces:**
- Consumes: Task 1 functions.
- Produces:
  - `INPUTS`: array of `{ id, min, max, step, initial, unit }` in screen order with ids `volume` (10–300, 5, 100, 'count'), `aht` (1–15, 0.5, 3, 'min'), `rostered` (1–80, 1, 20, 'people'), `planned` (0–40, 1, 20, 'percent'), `unplanned` (0–30, 1, 10, 'percent'), `target` (10–120, 5, 20, 'sec').
  - `TARGET_SERVICE_LEVEL = 0.8`, `INTERVAL_MINUTES = 30`.
  - `initialValues(): { volume, aht, rostered, planned, unplanned, target }`
  - `compute(values): { seated, away: { planned, unplanned }, overloaded, serviceLevel, waitSeconds, occupancy, busy, required: { seated, rostered }, gap }` — `serviceLevel`/`occupancy` are 0–1 or `null` when overloaded; `waitSeconds` rounded integer or `null`; `busy` = `round(seated × occupancy)` (0 when overloaded → `seated`, everyone busy); `gap = rostered − required.rostered` (negative = short).

- [ ] **Step 1: Write failing tests:**
  - initial values → `seated 14`, `overloaded false`, `Math.round(serviceLevel*100) === 89`, `Math.round(occupancy*100) === 71`, `required {seated: 14, rostered: 20}`, `gap 0`, `waitSeconds 8`, `away {planned: 4, unplanned: 2}`, `busy 10`.
  - seated = `floor(rostered × (1 − (planned + unplanned)/100))`, computed without drift: rostered 10, planned 20, unplanned 10 → 7; rostered 20, 0, 0 → 20.
  - away split: `away.planned + away.unplanned === rostered − seated` for every rostered 1–80 at 20/10 and at 40/30.
  - seated equal to intensity is overload: volume 100, aht 3, rostered 10, shrinkage 0/0 → `overloaded true`, `serviceLevel null`, `waitSeconds null`, `occupancy null`, `busy 10`, `required.seated 14`.
  - maximum shrinkage with one person: rostered 1, planned 40, unplanned 30 → `seated 0`, `overloaded true`, no throw.
  - gap sign: rostered 18 at initial → `gap -2`; rostered 23 → `gap 3`.
  - sweep: for every slider at min and max with others at initial, every numeric field of the result is finite or `null` (no `NaN`/`Infinity`).
  - `INPUTS` ids/ranges equal the table above; every `initial` lies on its step grid.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** `away.planned = round((rostered − seated) × planned / (planned + unplanned))` (0 when both are 0), `away.unplanned` is the remainder. Overload is decided by `seated <= intensity + 1e-9`.
- [ ] **Step 4: Run** → pass.

### Task 3: Wording and the pages that point here

**Files:**
- Create: `staffing-calculator/text.js`
- Modify: `glossary/terms.js` (two terms), `references/text.js` (pyworkforce line + link label), `references/references.js` (link to the lab), `index.html` (card), `README.md` (row; term count 44 → 46)
- Test: `agent-lifecycle/tests/staffing.test.js` (text section), `agent-lifecycle/tests/glossary.test.js`, `agent-lifecycle/tests/references.test.js`

**Interfaces:**
- Produces: `STAFFING_TEXT` — an object of `{ko, en}` entries with keys: `title`, `back`, `intro`, `exampleNote`, `inputsHeading`, `resultsHeading`, `label.<inputId>`, `hint.<inputId>`, `unit.<count|min|people|percent|sec>` (suffix shown after the value), `seated`, `seatedHint`, `seatedLine` (`{rostered}`, `{seated}`), `serviceLevel`, `serviceLevelHint`, `wait`, `waitHint`, `occupancy`, `occupancyHint`, `required`, `requiredLine` (`{seated}`, `{rostered}`), `gapShort` (`{n}`), `gapExact`, `gapSpare` (`{n}`), `overload`, `legendBusy`, `legendIdle`, `legendPlanned`, `legendUnplanned`, `pictureSummary` (`{rostered}`, `{seated}`, `{busy}`), `tryHeading`, `try1`, `try2`, `try3`, `limitsHeading`, `limits`, `countryNote`, `credit`, `creditLink`, `glossaryLink`. Nested groups (`label`, `hint`, `unit`) are plain objects of `{ko, en}`.
  - `GLOSSARY_LINKS`: `{ seated: 'shrinkage', serviceLevel: 'service-level', wait: 'asa', occupancy: 'occupancy', required: 'fte' }` and for inputs `{ aht: 'aht', planned: 'planned-shrinkage', unplanned: 'unplanned-shrinkage' }`.
  - `fill(template, values): string` replaces `{name}` placeholders.
- New glossary terms (category `metric`, `seen: []`): `service-level` "Service Level" [서비스 레벨 / Service Level], `asa` "ASA" [평균 응답 속도 / Average Speed of Answer], Korean definitions verbatim from spec §6.

- [ ] **Step 1: Write failing tests:**
  - every leaf of `STAFFING_TEXT` has non-empty `ko` and `en`; all keys listed above exist.
  - approved Korean strings equal spec §6 verbatim for `intro`, `exampleNote`, `seatedHint`, `serviceLevelHint`, `waitHint`, `occupancyHint`, `overload`, `limits`, `countryNote`, `try1`–`try3`; `requiredLine.ko` is `'서비스 레벨 80%(예시 목표)를 맞추려면 자리에 {seated}명, Shrinkage를 반영해 편성은 {rostered}명이 필요합니다.'`; `gapShort.ko` `'{n}명 부족'`, `gapExact.ko` `'딱 맞음'`, `gapSpare.ko` `'{n}명 여유'`.
  - content rules per Global Constraints (banned word, ≤ 3 sentences, figure needs 예시/example with the stated exemptions); no "슈링키지"; English has no "licence".
  - `credit` names pyworkforce and MIT in both languages; every `GLOSSARY_LINKS` value is an id in `TERMS`.
  - glossary: `TERMS.length === 46`; the two new definitions equal spec §6; existing "terms are valid" test still passes.
  - references: `pyworkforce.ko` equals the spec §6 sentence; the existing licence/link assertions still hold; `labLink` exists in both languages.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Write** `text.js`, the two terms, the reference sentence and a `labLink` ("인력 산정 실험실 열기" / "Open the Staffing Lab") rendered as a link to `../staffing-calculator/` under the pyworkforce paragraph, the hub card (wording from spec §6, English: "Staffing Lab — move volume, handle time, headcount and Shrinkage to see how required staff is worked out."), and the README row. English follows the Korean meaning sentence by sentence.
- [ ] **Step 4: Run** → pass (update the browser-check glossary count in Task 5).

### Task 4: Screen

**Files:**
- Create: `staffing-calculator/render.js`, `staffing-calculator/calculator.js`, `staffing-calculator/index.html`, `staffing-calculator/calculator.css`
- Test: `agent-lifecycle/tests/staffing.test.js` (render section, jsdom via `tests/dom.js`)

**Interfaces:**
- Consumes: `INPUTS`, `compute`, `initialValues` (Task 2); `STAFFING_TEXT`, `GLOSSARY_LINKS`, `fill` (Task 3); `h`, `s` from `agent-lifecycle/js/render/dom.js`; `t`, `loadLang`, `saveLang`; `renderLangToggle`.
- Produces: `renderCalculator(root, values, lang, { onInput(id, value) }): { update(values) }` — builds the page once; `update` rewrites only values, results and the picture, so a slider keeps focus while dragging.
- DOM contract (used by tests and the browser check): sliders `input[type=range][data-input="<id>"]` each with `label[for]` and an `output[data-value="<id>"]`; results region `[data-results][aria-live="polite"]` holding `[data-result="seated|serviceLevel|wait|occupancy|required"]`; `[data-gap]` with `data-gap-state="short|exact|spare"`; `[data-overload]` present only when overloaded; picture `svg[data-picture][role="img"]` with `aria-label` = filled `pictureSummary`, one `[data-person="busy|idle|planned|unplanned"]` per rostered person; `[data-example-note]`; `a[data-back]` to `../`; `a[data-glossary="<termId>"]` to `../glossary/#<termId>`; `a[data-credit]` to `../references/`.

- [ ] **Step 1: Write failing render tests:**
  - initial Korean render: six sliders with the `INPUTS` min/max/step/value; each has a label and its output shows value + unit (`100건`, `3분`, `20명`, `20%`, `10%`, `20초`).
  - results show `14`, `89%`, `8초`, `71%`; required card text is the filled `requiredLine`; gap state `exact`.
  - picture has 20 people: 10 busy, 4 idle, 4 planned, 2 unplanned; `aria-label` is the filled summary.
  - `update({...initial, rostered: 10, planned: 0, unplanned: 0})` → `[data-overload]` exists with the approved text; serviceLevel/wait/occupancy cards show no digits; required card still shows numbers; gap state `short`.
  - `update` keeps the same slider elements (identity check) and firing `input` on a slider calls `onInput(id, Number)`.
  - English render: title "Staffing Lab", no Hangul in `root.textContent`.
  - every `a[data-glossary]` points to `../glossary/#<id>` for an id in `TERMS`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** `index.html` copies the glossary page shell (topbar with `a.brand` to `../`, `#lang`, `<main id="app">`, noscript line, stylesheets `../agent-lifecycle/css/styles.css`, `../glossary/glossary.css`, `./calculator.css`). `calculator.js` holds `values` and `lang`, redraws fully on language change and calls `update` on input; sets `document.title` and `document.documentElement.lang`. Layout: one column on phones; inputs and results side by side from 760px. Person marks differ by shape or pattern as well as colour (filled, outlined, striped, dotted), with a legend. Numbers use tabular figures.
- [ ] **Step 4: Run** → pass.

### Task 5: Browser check, log, whole-suite verification

**Files:**
- Modify: `agent-lifecycle/scripts/browser_check.py`, `LOG.md`

- [ ] **Step 1: Add checks** (run first to see them fail only if the page is broken; these are verification, not production code):
  - (z1) `staffing-calculator/` opens from the hub card; h1 "인력 산정 실험실"; initial results `89%`, `71%`.
  - (z2) set `rostered` slider to 10 and both Shrinkage sliders to 0 by keyboard/`fill` → `[data-overload]` visible; set back → gone and `89%` returns.
  - (z3) moving the `aht` slider from 3 to 3.5 changes the service-level text and the slider still has focus.
  - (z4) no horizontal scroll at 320 / 390 / 1280 px in Korean and English (add `staffing-calculator/` to the existing (u) path list).
  - (z5) follows the course language; with storage blocked opens in Korean and switches to English (add to the (v)/(w) lists).
  - (z6) glossary link from the occupancy card lands on `glossary/#occupancy` with that card focused; glossary term count check updated to 46.
  - Screenshots `staffing-390.png`, `staffing-1280.png`, `staffing-390-en.png`, dark `staffing-390-dark.png` to the ignored `scripts/out/`; look at them.
- [ ] **Step 2: Run** `python3 agent-lifecycle/scripts/browser_check.py` → `ALL CHECKS PASSED`; `npm test` → all pass, 0 fail.
- [ ] **Step 3: LOG.md** entry 10 "인력 산정 실험실 추가" (what it is, example values, pyworkforce credit and cross-check, what it does not cover, two glossary terms), status "검토 중" until merged.
- [ ] **Step 4:** Whole-branch review by a fresh reviewer; fix Critical/Important with a failing test first.
- [ ] **Step 5:** Ask the user for commit + push + PR approval, and separately for merge approval.
