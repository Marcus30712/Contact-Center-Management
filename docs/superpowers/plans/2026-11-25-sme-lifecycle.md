# 서포트 라이프사이클 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the SME course "서포트 라이프사이클" (5 lessons on a ring home) and connect it to SME Learn, my learning, today's practice, backup and reset, without changing what unlocks the SME review quiz.

**Architecture:** A new course folder `sme-lifecycle/` built like `sme/` (lesson files on the shared lesson engine and player), but whose first screen is the lifecycle course's ring, reused by giving `renderHome` its strings as a parameter. The course joins `COURSE_INFO` and `ROLE_COURSES.sme`; a separate `REVIEW_COURSES` table keeps the SME quiz tied to SME 첫걸음 only.

**Tech Stack:** Static vanilla ES modules; `cd agent-lifecycle && npm test` (node:test + jsdom); `python3 agent-lifecycle/scripts/browser_check.py` (Playwright); `python3 tools/sw_list.py` after runtime file changes.

**Spec:** `docs/superpowers/specs/2026-11-25-sme-learn-set-design.md` §4.2, §4.4 · Korean copy (approved): `docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md`

## Global Constraints

- Korean text equals the approved copy word for word; tests read it from the copy doc.
- Step captions: 3 sentences or fewer; a figure in a caption carries "예시" (`SME_FIGURE`).
- Lesson ids have no hyphen (the router splits at the first hyphen): `trainee`, `graduate`, `regular`, `senior`, `leadsupport`.
- Course id `sme-lifecycle`, folder `sme-lifecycle/`, progress key `sme-lifecycle:v1`.
- Viewpoint "당신 = SME"; persona 서준 in lessons 1, 2, 3, 5 and 준호 in lesson 4.
- SME review quiz still unlocks with SME 첫걸음 only (design §4.4).
- English copy needs the user's approval before push; commit/push/merge each need approval.
- Regenerate `sw.js` with `python3 tools/sw_list.py` after any runtime file change.

## Review Focus

1. An SME who finished SME 첫걸음 but no Support Lifecycle lesson sees the quiz card and can open the SME quiz → Task 3 test `the SME quiz still opens with SME First Steps alone`.
2. A practice question from this course links to `../sme-lifecycle/#<id>-0`, not the team-lead lifecycle course → Task 3 test `support lifecycle questions link to their own course`.
3. Old addresses (`#home`, `#nesting-2`, `#lead-0`, `#trainee-99`) open the list or the lesson's last step without errors → Task 2 test `stale addresses open the list`.
4. A backup made before this course (no `sme-lifecycle:v1`) restores; reset erases this course's progress and keeps the role → Task 3 test `backup and reset include support lifecycle progress`.
5. A team lead never sees this course in Learn or my learning, but progress in it still counts as "started" → Task 3 test `team leads do not see support lifecycle but its progress counts`.

---

### Task 1: Lessons (Korean)

**Files:**
- Modify: `docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md` (홈 카드 row: drop the trailing note "(① 단계에서 승인된 문구 그대로)" so the cell is the wording only; ledger as a ruling)
- Create: `sme-lifecycle/ui.js`, `sme-lifecycle/lessons/01-trainee.js` … `05-leadsupport.js`, `sme-lifecycle/lessons/index.js`
- Test: `agent-lifecycle/tests/sme-lifecycle.test.js`

**Interfaces:**
- Produces: `SL_LESSONS` (array of 5 lessons, ids above, orders 1–5) from `sme-lifecycle/lessons/index.js`; `SL_PROGRESS_KEY = 'sme-lifecycle:v1'`, `SL_FIGURE = SME_FIGURE`, `SL_UI` from `sme-lifecycle/ui.js` with `courseTitle, courseTagline, listNote, homeCard, personaName, loop, done` plus the lesson-screen keys copied from `SME_UI` (`home, checkpoint, connection, nextLesson, toList`).
- Lessons follow the SME lesson shape: `personaName`, `procedure` (4 node ids, one column, `wide` nodes at y 36/92/148/204), `diagram`, `steps` built with `step(tx(ko), flow, highlight, null)`, `checkpoint` (2 questions, ids `<lessonId>-q1/q2`), `connection` (`to` = next id; lesson 5 `to: 'home'`). English is left out here (`tx(ko)`), filled in Task 4.

- [ ] **Step 1: Write the failing tests** in `sme-lifecycle.test.js`, reusing the copy parser from `sme.test.js` (same table keys):
  - `the support lifecycle passes the course rules`: `validateCourse(SL_LESSONS, { lessonCount: 5, loop: false, figure: SL_FIGURE })` → `[]`; `SL_PROGRESS_KEY === 'sme-lifecycle:v1'`.
  - `five lessons in the approved order`: ids `['trainee','graduate','regular','senior','leadsupport']`, orders 1–5, none contains `-`.
  - `the Korean is the approved copy, word for word`: title, short, subtitle, node labels in procedure order, step captions, questions/options/feedback/explanations, connection — each equal to the parsed copy.
  - `right answers carry no feedback and every wrong answer has one`.
  - `each step that names a stage lights up that stage` (ordinal rule as in `sme.test.js`; step 1 highlights the whole procedure).
  - `Seojun everywhere but lesson 4, Junho in lesson 4`: `personaName.ko` is `서준` for 1,2,3,5 and `준호` for 4; lesson 4 text also mentions 서준.
  - `every box sits inside the picture and none overlap` (same bounds as `sme.test.js`).
  - `the course words are the approved copy`: `SL_UI.courseTitle/courseTagline/listNote/homeCard/personaName/loop` `.ko` equal the copy rows 강의 제목, 강의 소개, 숫자 안내, 홈 카드, 원 가운데 이름, 순환 안내 (원 아래); `SL_UI.homeCard.ko === HOME_COPY.supportLifecycle.text.ko`.
- [ ] **Step 2: Run** `cd agent-lifecycle && npm test` → Expected: FAIL (module `../../sme-lifecycle/lessons/index.js` not found).
- [ ] **Step 3: Implement** the copy-doc tidy, `ui.js`, five lesson files and `index.js`.
- [ ] **Step 4: Run** `cd agent-lifecycle && npm test` → Expected: all pass.
- [ ] **Step 5: Commit** `feat: 서포트 라이프사이클 레슨 (한국어)`.

### Task 2: Course page with the ring

**Files:**
- Modify: `agent-lifecycle/js/render/home.js`
- Create: `sme-lifecycle/index.html` (from `sme/index.html`: title/brand "서포트 라이프사이클", only `agent-lifecycle/css/styles.css` + `sop-library/sop.css`), `sme-lifecycle/app.js` (from `sme/app.js`)
- Test: `agent-lifecycle/tests/sme-lifecycle.test.js`, existing `render.test.js` stays green

**Interfaces:**
- Consumes: Task 1's `SL_LESSONS`, `SL_UI`, `SL_PROGRESS_KEY`.
- Produces: `renderHome(root, lessons, progress, lang, text = UI)` — strings come from `text`, falling back to `UI` for keys `text` lacks; the track-hint paragraph appears only when `text === UI`. The lifecycle course calls it unchanged.

- [ ] **Step 1: Write the failing tests:**
  - `the ring shows five stages with Seojun in the middle`: `renderHome(root, SL_LESSONS, {completed:['trainee']}, 'ko', SL_UI)` → `h1` = 서포트 라이프사이클, 5 `.stage-card`, ring stage names = the copy's 원 안 짧은 이름 split by ` · `, center text 서준, loop note `↺ 새 교육 기수가 오면 다시 1단계부터`, no `[data-track-hint]`, the first card has `is-done`.
  - `the team-lead ring is unchanged`: `renderHome(root, LESSONS, {completed:[]}, 'ko')` still has `[data-track-hint]` and center 지민.
  - `a lesson counts out of five, says SME checkpoint, and the last one leads to the list` (as the SME test, with `lessonCount: 5`, `text: SL_UI`).
  - `stale addresses open the list`: `parseRoute` with ids of `SL_LESSONS` → `#home`, `#nesting-2`, `#lead-0`, `''` give `view: 'home'`; `#trainee-99` gives the lesson clamped by the player without throwing.
  - `every lesson address opens that lesson` (as the SME test).
- [ ] **Step 2: Run** `npm test` → Expected: FAIL (renderHome ignores the 5th argument).
- [ ] **Step 3: Implement** the `renderHome` parameter, `index.html`, `app.js` (home view calls `renderHome(app, SL_LESSONS, {completed}, lang, SL_UI)`), then `python3 tools/sw_list.py`; update `sw.test.js` page count 15 → 16.
- [ ] **Step 4: Run** `npm test` → Expected: all pass.
- [ ] **Step 5: Commit** `feat: 서포트 라이프사이클 강의 페이지`.

### Task 3: Connect the course

**Files:**
- Modify: `shared/courses.js`, `shared/role.js`, `review/engine.js`, `home/role-home.js`, `home/render.js`, `practice/engine.js`, `practice/render.js`, `settings/engine.js`, `shared/appbar.js`, `privacy/text.js`, `docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md` (new §2 privacy row, status "승인 대기" until the user approves with the English)
- Test: `home.test.js`, `review.test.js`, `settings.test.js`, `privacy.test.js`, `appbar.test.js`, `sme-lifecycle.test.js`, `sw.test.js`

**Interfaces:**
- Consumes: Task 1's exports.
- Produces: `COURSE_INFO['sme-lifecycle'] = { key: SL_PROGRESS_KEY, lessons: SL_LESSONS, dir: 'sme-lifecycle/' }`; `ROLE_COURSES.sme = ['sme', 'sme-lifecycle']`; `REVIEW_COURSES = { tl: ['lifecycle','sop'], sme: ['sme'] }` and `reviewCoursesFor(role)` in `shared/role.js`; `unlocked()` reads `reviewCoursesFor`.

- [ ] **Step 1: Write the failing tests:**
  - `the SME quiz still opens with SME First Steps alone` (review.test): all 7 SME 첫걸음 lessons done, no support lifecycle → `unlocked(s,'sme').open === true`; home shows `a[data-review-quiz]`.
  - `SME Learn links to support lifecycle` (home.test): SME `#learn a.card` hrefs `['./sme/','./sme-lifecycle/','./excel/']`, `[data-soon]` only `sme-sop`; `myLearning(s,'sme')` ids `['sme','sme-lifecycle','excel']`, next href `./sme-lifecycle/#trainee-0`.
  - `team leads do not see support lifecycle but its progress counts`: TL Learn/my learning have no `sme-lifecycle`; with only `sme-lifecycle:v1` progress, `myLearning(s,'tl').started === true`.
  - `support lifecycle questions link to their own course` (sme-lifecycle.test): finishing `trainee` puts `sme-lifecycle:trainee-q1` in `pool`, and the rendered practice link is `../sme-lifecycle/#trainee-0`.
  - `backup and reset include support lifecycle progress` (settings.test): `BACKUP_KEYS` and reset include `sme-lifecycle:v1`; a backup without it restores; reset erases it and keeps the role.
  - privacy: `changed` also reads the new §2 row; appbar: `current('https://x.test/kb/sme-lifecycle/') === 'learn'`.
- [ ] **Step 2: Run** `npm test` → Expected: FAIL on the new tests.
- [ ] **Step 3: Implement** each file. Privacy `s2.item2` proposal: ko "레슨 진도 (라이프사이클, SOP, SME 첫걸음, 서포트 라이프사이클, 엑셀)", en "Lesson progress (Lifecycle, SOP, SME First Steps, Support Lifecycle, Excel)". Run `python3 tools/sw_list.py`.
- [ ] **Step 4: Run** `npm test` → Expected: all pass.
- [ ] **Step 5: Commit** `feat: 서포트 라이프사이클을 SME 배우기와 연습에 연결`.

### Task 4: English

**Files:**
- Create: `docs/superpowers/specs/2026-11-25-sme-lifecycle-copy.en.md` (same layout as `2026-11-25-sme-course-copy.en.md`)
- Modify: the five lesson files, `sme-lifecycle/ui.js`
- Test: `sme-lifecycle.test.js`

- [ ] **Step 1: Write the failing tests** (mirroring `sme.test.js`): `the course passes the rules with English required`; `the English is the English copy, word for word`; `the English never runs to more sentences than the Korean it translates`; `course and lesson-screen words match the English copy`; `the English list and lessons have no Korean left` (ring home and every step in `en`).
- [ ] **Step 2: Run** `npm test` → Expected: FAIL (English missing).
- [ ] **Step 3: Write** the English copy doc, then the `en` text in lessons and `SL_UI` (persona "Seojun"/"Junho"; figures carry "Example").
- [ ] **Step 4: Run** `npm test` → Expected: all pass.
- [ ] **Step 5: Commit** `feat: 서포트 라이프사이클 영어`.

### Task 5: Browser check and docs

**Files:**
- Modify: `agent-lifecycle/scripts/browser_check.py`, `README.md`, `README.en.md`, `LOG.md`

- [ ] **Step 1: Add browser checks:** (s1) SME home Learn card opens `sme-lifecycle/` and the ring shows 5 stages; (s2) lesson 1 can be stepped to the checkpoint, answered, and finished, and home my learning then shows 1/5; (s3) the page fits a 390px-wide phone with no horizontal scroll. Update any check that expected the 서포트 라이프사이클 soon card.
- [ ] **Step 2: Run** `python3 agent-lifecycle/scripts/browser_check.py` → Expected before the doc edits: the new checks pass (the feature exists); if any fails, debug before continuing.
- [ ] **Step 3: Docs:** README rows for `sme-lifecycle/` (ko/en), `sme-lifecycle/lessons/` in the content-license row; LOG entry 55 "서포트 라이프사이클 — 상태: Pull Request 검토 중 (브랜치 `sme-lifecycle`)".
- [ ] **Step 4: Run** `npm test` and the browser check → Expected: all pass, ALL CHECKS PASSED.
- [ ] **Step 5: Commit** `docs: 서포트 라이프사이클 README·LOG, 브라우저 점검`.
