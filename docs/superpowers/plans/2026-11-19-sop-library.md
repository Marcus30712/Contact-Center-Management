# SOP 라이브러리 (1차) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second step-through course at `sop-library/` teaching four team-leader SOPs (escalation, 1:1 coaching, PIP, calibration) in Korean and English.

**Architecture:** The lifecycle course's engine and renderers gain a few optional settings (storage key, lesson count, non-looping course, per-lesson persona name, per-node box width) whose defaults keep the lifecycle course byte-for-byte the same in behaviour. `sop-library/` holds only its own lesson data, UI strings, a list-style home screen and a small app file.

**Tech Stack:** Static files, vanilla JS ES modules, inline SVG, `node --test` + jsdom, Playwright browser check with system Chrome.

**Spec:** `docs/superpowers/specs/2026-11-19-sop-library-design.md` · approved Korean copy: `docs/superpowers/specs/2026-11-19-sop-library-copy-ko.md`

## Global Constraints

- No build step, no new dependencies, relative paths only.
- Tests in `agent-lifecycle/tests/`; `npm test` inside `agent-lifecycle/` (baseline 191 passing); `python3 agent-lifecycle/scripts/browser_check.py` → `ALL CHECKS PASSED`.
- The lifecycle course must not change: every existing test and every existing browser check for it passes unmodified (only the hub card count 4 → 5 changes).
- Korean lesson copy is the confirmed copy file, verbatim, without the 🟦 marks and the `**[…]**` step tags. English follows it sentence by sentence; US spelling.
- Step names and order per lesson (node labels, Korean):
  - `escalation`: 불만 접수 → 1차 해결 시도 → 에스컬레이션 안내 → 즉시 알림 → 기록 및 인계 (+ branch 종결)
  - `coaching`: 데이터 준비 → 분위기 조성 → 원인 분석 → 해결책 수립 → 마무리 및 격려 (+ 목표 → 현실 → 대안 → 실행 의지)
  - `pip`: 데이터 기반 면담 → 공동 목표 설정 → 지원 약속 및 주간 점검 → 결과 평가 (+ branches PIP 종료, 추가 계획)
  - `calibration`: 사전 준비 → 독립 평가 → 교정 세션 → 합의 및 결정 → 후속 조치 및 공유 (+ 추가 교육·공지)
- Content rules: no "진상"; captions ≤ 3 sentences; a figure with `%`, 분, 명, 초, 점 (en: min, people, sec, point/points) in a caption needs "예시"/"Example"; week/day durations exempt; no country-specific law; no COPC text.
- Persona: 지민/Jimin in lessons 1, 2, 4; 도윤/Doyun in lesson 3. Learner is "당신"/"you".
- No track toggle; lessons carry no `track` items. Progress key `sop-library:v1`; language key shared (`agent-lifecycle-course:lang`), default Korean.
- Last lesson's connection leads to the list (`connection.to: 'home'`), not to lesson 1.
- No commit, push or merge without the user's approval. Branch `sop-library`; commit steps happen once at the end after approval.

## Review Focus

1. Lifecycle regression: defaults of every new option reproduce today's behaviour (eyebrow "n / 6", looping course of six, 지민 badge, 54-wide boxes, progress key). → Task 1 "defaults unchanged" tests; existing suite untouched.
2. Progress isolation: finishing an SOP lesson must not mark a lifecycle lesson done (both have a lesson id `coaching`). → Task 1 progress test, Task 5 check (s3).
3. Last lesson: the "next" card must go to the list, with a label that says so, in both languages. → Task 1 render test, Task 5 check (s4).
4. Diagram fit: wide step boxes plus branch/GROW boxes stay inside the 360×240 viewBox and do not overlap; long English labels are squeezed, not clipped. → Task 2 geometry test.
5. Unknown or stale address (`#coaching-99`, a lifecycle id such as `#hiring-0`) opens a sensible screen instead of a blank page. → Task 3 test, Task 5 check (s5).

---

### Task 1: Engine options

**Files:**
- Modify: `agent-lifecycle/js/engine/progress.js`, `agent-lifecycle/js/engine/lessonSchema.js`, `agent-lifecycle/js/render/diagram.js`, `agent-lifecycle/js/render/lesson.js`
- Test: `agent-lifecycle/tests/progress.test.js`, `lessonSchema.test.js`, `render.test.js` (append; do not edit existing tests)

**Interfaces — Produces:**
- `loadProgress(storage, key = PROGRESS_KEY)`, `markComplete(storage, lessonId, key = PROGRESS_KEY)`
- `validateLesson(lesson, { requireEnglish, requireTracks, figure })` — `figure` is a RegExp replacing the default figure pattern; a lesson may carry `personaName: {ko, en}` which replaces 지민/Jimin in the persona rule.
- `validateCourse(lessons, { …lesson options, lessonCount = 6, loop = true })` — with `loop: false` the last lesson's `connection.to` must be `'home'`.
- Diagram: a node may carry `hw` (half-width, default 54), used for the box, edge ends, label squeeze and badge position. `renderDiagram(svg, diagram, step, lang, { personaName = UI.personaName } = {})`.
- `renderLesson(root, lesson, stepIndex, lang, { onNavigate, onComplete, restore, track, lessonCount = 6, text = {} })` — `text` overrides entries of `UI` (`home`, `checkpoint`, `connection`, `nextLesson`, `toList`); when `lesson.connection.to === 'home'` the card links to `#home` with label `text.toList`; passes `lesson.personaName` to the diagram.

- [ ] **Step 1: Failing tests**
  - progress: with key `'sop-library:v1'`, `markComplete` then `loadProgress` with that key returns the lesson; `loadProgress` with the default key stays empty, and the reverse.
  - schema: `figure: /\d\s*점/` flags a caption "10점 낮습니다" without 예시 and accepts it with 예시; a lesson with `personaName {ko:'도윤'}` passes when captions mention 도윤 and not 지민, fails when neither appears; `validateCourse(four, {lessonCount: 4, loop: false})` passes when the last connection is `'home'`, fails when it points to the first lesson, and fails with the default options ("6").
  - diagram: a node with `hw: 76` gets `rect` x −76 / width 152; an edge leaving it starts 78 from its centre horizontally; `personaName {ko:'도윤'}` shows "도윤" in the badge; without options the badge says 지민 and rect width is 108.
  - lesson: `lessonCount: 4` renders "1 / 4"; default renders "… / 6"; `connection.to: 'home'` with `text.toList {ko:'목록으로'}` gives `a[data-next-lesson]` href `#home` and text "목록으로 →"; `text.home` override shows in the home link.
- [ ] **Step 2:** `npm test` → new tests FAIL, existing 191 pass.
- [ ] **Step 3: Implement** the options with the defaults above.
- [ ] **Step 4:** `npm test` → all pass.

### Task 2: Lesson data and course strings

**Files:**
- Create: `sop-library/lessons/01-escalation.js`, `02-coaching.js`, `03-pip.js`, `04-calibration.js`, `sop-library/lessons/index.js`, `sop-library/ui.js`
- Test: `agent-lifecycle/tests/sop.test.js`

**Interfaces:**
- Consumes: `tx`, `node`, `edge`, `step`, `option` from `agent-lifecycle/js/lessons/build.js`; Task 1 validators.
- Produces:
  - `SOP_LESSONS`: array of four lessons `{ id, order, title, short, subtitle, roles, personaName?, procedure, diagram, steps, checkpoint, connection }`. `procedure` is the ordered list of main-step node ids; `roles` is `{ko, en}`. Main-step nodes use `hw: 76`.
  - `SOP_UI`: `{ courseTitle, courseTagline, listNote, home, checkpoint, connection, nextLesson, toList, done, rolesLabel }` as `{ko, en}`; `SOP_PROGRESS_KEY = 'sop-library:v1'`; `SOP_FIGURE` (the figure pattern incl. 점 / points).
  - Text: `courseTitle` "SOP 라이브러리" / "SOP Library"; `courseTagline` "팀장이 직접 하는 일을 순서대로."; `listNote` = the confirmed "강의 목록 화면 안내" sentence; `home` "목록" / "All SOPs"; `toList` "목록으로" / "Back to the list"; `connection` "다음으로" / "Up next"; `checkpoint` "팀장 체크포인트" / "Team leader checkpoint".

- [ ] **Step 1: Failing tests**
  - `validateCourse(SOP_LESSONS, { requireEnglish: true, lessonCount: 4, loop: false, figure: SOP_FIGURE })` returns `[]`.
  - ids in order are `escalation, coaching, pip, calibration`; no step or question has `track`; step counts are 10, 11, 11, 11; two questions each.
  - procedure labels (Korean) equal the lists in Global Constraints, and procedure edges chain them in order; extra nodes are exactly the listed branch/GROW nodes.
  - **approved copy:** parse the confirmed copy file (`## 레슨 n.` sections; numbered lines → captions after removing `**[…]**` and `🟦 `; `- 부제:`, `- 누가:`; `**확인 문제 n.**` prompt, `- a.` options with `✅` marking the answer, `- 해설:`; `**다음으로:**`) and assert every Korean title, subtitle, roles, caption, prompt, option, answer id, explanation and connection text equals the lesson data.
  - each step highlights the procedure node(s) named in its `**[…]**` tag (`전체` = no single-node requirement); the first step of every lesson shows all procedure nodes.
  - geometry: every node box (`x ± hw`, `y ± 17`) lies inside 0–360 × 0–240 and no two boxes overlap.
  - persona: lesson 3 has `personaName` 도윤/Doyun and never says 지민; the others have none.
  - English: no Hangul in any `en` string; "PIP" expanded once as "Performance Improvement Plan"; GROW words are Goal, Reality, Options, Will.
- [ ] **Step 2:** `npm test` → FAIL (module not found).
- [ ] **Step 3: Write** the four lessons and `ui.js`. Layout: main steps in one column (x 84, hw 76), evenly spaced top to bottom; branch and GROW boxes to the right (GROW as a 2×2 block beside 원인 분석, hw 44). Each step shows the nodes reached so far plus their edges, as the lifecycle lessons do.
- [ ] **Step 4:** `npm test` → pass.

### Task 3: SOP course screens

**Files:**
- Create: `sop-library/home.js`, `sop-library/app.js`, `sop-library/index.html`, `sop-library/sop.css`
- Test: `agent-lifecycle/tests/sop.test.js` (render section)

**Interfaces:**
- Consumes: Task 1 `renderLesson` options, `loadProgress`/`markComplete` with key; Task 2 exports; `parseRoute`, `lessonHref`, `renderLangToggle`, `loadLang`, `saveLang`.
- Produces: `renderSopHome(root, lessons, progress, lang)` — `h1`, tagline, `[data-list-note]`, and `ol[data-sop-list]` of `a[data-sop="<id>"]` (href `#<id>-0`) each showing order number, title, subtitle, `[data-roles]`, and `[data-done]` text when completed.
- `index.html` mirrors the lifecycle page shell without the track toggle: topbar with `a[data-kb-link]` to `../`, `a#brand` to `#home`, `#lang`; stylesheets `../agent-lifecycle/css/styles.css` and `./sop.css`.
- `app.js` mirrors `agent-lifecycle/js/app.js` without tracks: routes by `parseRoute(location.hash, ids)`, passes `{ lessonCount: 4, text: SOP_UI, track: 'general' }`, stores progress under `SOP_PROGRESS_KEY`, sets `document.title` to the course title.

- [ ] **Step 1: Failing tests**
  - home (ko): h1 "SOP 라이브러리", four links in order with hrefs `#escalation-0` …, each with title, subtitle and roles; list note text equals `SOP_UI.listNote.ko`; `progress {completed:['pip']}` marks only pip done.
  - home (en): no Hangul; h1 "SOP Library".
  - lesson through `renderLesson` with the SOP options: escalation shows "1 / 4", home link text "← 목록"; calibration's connection card links to `#home` with "목록으로 →"; pip's diagram badge reads 도윤 on a step with a persona.
  - `parseRoute('#hiring-0', ids)` and `parseRoute('#nope', ids)` give home; `parseRoute('#coaching-99', ids)` gives the coaching lesson (the player clamps the step — assert the rendered counter is "11 / 11").
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** `npm test` → pass.

### Task 4: Links from the rest of the site

**Files:**
- Modify: `glossary/terms.js`, `glossary/schema.js`, `glossary/render.js`, `index.html`, `README.md`
- Test: `agent-lifecycle/tests/glossary.test.js` (append)

**Interfaces:**
- Produces: terms `escalation`, `one-on-one-coaching`, `grow`, `pip`, `calibration` carry `sop: '<sop lesson id>'` (`escalation`, `coaching`, `coaching`, `pip`, `calibration`). `validateTerms(terms, lessonIds, sopIds = [])` rejects an unknown `sop`. The card shows `a[data-sop-link]` to `../sop-library/#<id>-0` labelled "SOP 라이브러리에서 보기" / "See it in the SOP Library" (`GLOSSARY_UI.sop`).

- [ ] **Step 1: Failing tests:** the five terms have the `sop` values above and no other term has one; unknown `sop` is rejected; rendered cards for those terms contain the link with the right href and label in both languages; existing `seen` links unchanged.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3: Implement**; add the hub card (confirmed Korean wording; English: "SOP Library — learn the procedures a team leader runs, step by step: escalation, 1:1 coaching, PIP, calibration.") after the lifecycle card; add the README row.
- [ ] **Step 4:** `npm test` → pass.

### Task 5: Browser check, log, review

**Files:**
- Modify: `agent-lifecycle/scripts/browser_check.py`, `LOG.md`

- [ ] **Step 1: Add checks**
  - hub shows five cards; the SOP card opens `sop-library/` (h1 "SOP 라이브러리"); back link returns to the hub.
  - (s1) each of the four lessons can be stepped to the end with the Next button and the arrow key, the checkpoint opens, answering both questions reveals the connection card; step counts 10/11/11/11.
  - (s2) no horizontal scroll at 320/390/1280 in Korean and English on the list and on a lesson; diagram labels stay inside their boxes (text bbox within rect bbox) for all four lessons in both languages.
  - (s3) finishing SOP `coaching` shows it done on the SOP list and leaves lifecycle `coaching` not done; and the reverse.
  - (s4) calibration's connection card returns to the list.
  - (s5) `#hiring-0` and `#nope` open the list; `#coaching-99` opens the coaching lesson.
  - (s6) language follows the shared choice; storage blocked still works; glossary PIP card link opens the PIP lesson.
  - Screenshots (list 390/1280, each lesson's last step at 390, one English, one dark) into the ignored `scripts/out/`; look at them.
- [ ] **Step 2:** `python3 agent-lifecycle/scripts/browser_check.py` → `ALL CHECKS PASSED`; `npm test` → 0 fail.
- [ ] **Step 3:** LOG.md entry 11 "SOP 라이브러리 (1차) 추가", status "검토 중".
- [ ] **Step 4:** Whole-branch review by a fresh reviewer; fix Critical/Important test-first.
- [ ] **Step 5:** Ask the user for commit + push + PR approval and, separately, merge approval.
