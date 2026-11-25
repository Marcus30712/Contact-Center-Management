# 직급 선택과 SME 강의 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a learner pick one of five roles (stored on the device) so home and the Codex open on that role, and add the seven-lesson SME course "SME 첫걸음".

**Architecture:** A tiny shared module (`shared/role.js`) owns the role value; home, settings and Codex read it. Home asks once through a bottom sheet modelled on the install sheet. The SME course is a new folder `sme/` that reuses the lifecycle lesson engine exactly as `sop-library/` does, with its own progress key wired into practice, backup and reset.

**Tech Stack:** Vanilla ES modules; tests `cd agent-lifecycle && npm test` (node:test + jsdom); `python3 agent-lifecycle/scripts/browser_check.py`; `python3 tools/sw_list.py`.

**Spec:** `docs/superpowers/specs/2026-11-25-role-select-sme-course-design.md` · copy: `docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md` (ko, approved 2026-11-25), `…-sme-course-copy.en.md` (written in Task 8, needs owner approval)

## Global Constraints

- Korean exactly as the approved copy doc. No new Korean wording without owner approval; the two caption fixes in Task 6 Step 1 are the only edits and are reported to the owner.
- Role ids: `agent` · `sme` · `tl` · `am` · `om` (same ids as `codex/data/daily.js` roles and `career.js` operation levels). Default `tl`.
- Storage keys: `queuecraft:role`, `queuecraft:role-asked`, `sme-course:v1`.
- Role keys are in the backup, never in reset.
- Nothing is hidden or locked by role; role only changes order and default views.
- Lesson limits (`lessonSchema.js`): 6–12 steps, 1–3 questions, captions ≤ 3 sentences, figures (분/명/초/%) carry "예시"/"Example", no "진상", each lesson's text names its persona.
- English: US English, never more sentences than its Korean.
- Every page keeps working with storage blocked (acts as `tl`, no sheet).
- After runtime file changes: `python3 tools/sw_list.py`. Commit and push only after owner approval (owner preference).

## Review Focus

1. Storage blocked or throwing → role reads `tl`, sheet never opens, home/settings/Codex render (Task 1 `role survives blocked storage`, Task 3 `no sheet when storage is blocked`).
2. A stored role that is not one of the five (old data, hand-edited, `"\"sme\""`) → treated as `tl`, and the sheet is not shown again (Task 1 `unknown role values read as team lead`).
3. Restoring a backup made before this change (no role keys) keeps the current role instead of clearing it and re-asking (Task 2 `restoring an older backup keeps the role`).
4. "학습 초기화" erases SME progress but keeps role and the asked flag (Task 2 `reset keeps the role and erases SME progress`).
5. Start screen, role sheet and first-run tour never stack: start screen closes → sheet → tour; a home address with a hash or `?tour` shows no sheet (Task 3 `the sheet waits for the start screen and comes before the tour`).

---

### Task 1: Role store

**Files:**
- Create: `shared/role.js`, `shared/role-data.js`
- Test: `agent-lifecycle/tests/role.test.js`

**Interfaces:**
- Produces (`shared/role.js`): `ROLE_KEY = 'queuecraft:role'`, `ROLE_ASKED_KEY = 'queuecraft:role-asked'`, `ROLES = ['agent','sme','tl','am','om']`, `DEFAULT_ROLE = 'tl'`, `COURSE_ROLES = ['sme','tl']` (roles that have a course), `loadRole(storage) -> string`, `saveRole(storage, role) -> void` (ignores unknown ids; also sets asked), `shouldAskRole(storage) -> boolean`, `markRoleAsked(storage) -> void`.
- Produces (`shared/role-data.js`): `ROLE_UI` (sheet title, sheet note, later button, settings heading, settings note, preparing note with `{role}`, preparing links 1–2) and `ROLE_NAMES` (`{ agent, sme, tl, am, om }` → `{ko,en}`), Korean from copy doc §2. English filled in Task 8; until then `en` repeats the role's English name only for `ROLE_NAMES` and is omitted elsewhere.

- [ ] **Step 1: Write failing tests** in `role.test.js`:
  - `role defaults to team lead`: `loadRole(fakeStorage())` → `'tl'`; `loadRole(null)` → `'tl'`.
  - `saving a role stores it and marks the question asked`: after `saveRole(s,'sme')`, `loadRole(s)==='sme'`, `shouldAskRole(s)===false`.
  - `unknown role values read as team lead`: stored `'manager'`, `'"sme"'`, `''` → `'tl'`; `saveRole(s,'boss')` leaves storage unchanged.
  - `ask once`: empty storage → `shouldAskRole` true; after `markRoleAsked` → false, `loadRole` still `'tl'`.
  - `role survives blocked storage`: storage whose `getItem`/`setItem` throw → `loadRole` `'tl'`, `saveRole` does not throw, `shouldAskRole` false.
  - `role wording is the approved copy`: every `ROLE_UI` ko and every `ROLE_NAMES` ko equals the matching row of copy doc §2 (parse the `| 위치 | 한국어 |` table; role names from the `선택지` row split on ` · `).
- [ ] **Step 2:** `cd agent-lifecycle && node --test tests/role.test.js` → FAIL (module not found).
- [ ] **Step 3: Implement** `shared/role.js` and `shared/role-data.js` with the interfaces above; every storage call in try/catch.
- [ ] **Step 4:** same command → PASS.
- [ ] **Step 5: Commit** `feat: 직급 저장 모듈`.

### Task 2: Settings — "내 직급", backup and reset

**Files:**
- Modify: `settings/engine.js` (BACKUP_KEYS, restore), `settings/render.js` (new section after 언어), `settings/app.js`
- Test: `agent-lifecycle/tests/settings.test.js`

**Interfaces:**
- Consumes: Task 1 `ROLE_KEY`, `ROLE_ASKED_KEY`, `ROLES`, `loadRole`, `saveRole`, `ROLE_UI`, `ROLE_NAMES`.
- Produces: `BACKUP_KEYS` gains `ROLE_KEY`, `ROLE_ASKED_KEY` (and `SME_PROGRESS_KEY` in Task 6). `RESET_KEYS` unchanged here. `renderSettings` opts gains `onRole(role)`.

- [ ] **Step 1: Update/add failing tests:**
  - Rename and extend `a backup holds exactly the seven Queuecraft keys that are set` → nine keys (adds the two role keys).
  - `restoring an older backup keeps the role`: storage has role `sme`; restore a file holding only lifecycle progress → role still `sme`, asked flag still set. (Other keys keep the existing "cleared when the file lacks them" rule.)
  - `reset keeps the role`: after erase, `loadRole` is still `sme`.
  - `the role section sits after language and saves the pick`: section heading = `ROLE_UI.settingsHeading.ko`, note = settings note, five radios in `ROLES` order labelled `ROLE_NAMES`, current role checked; picking `am` calls `onRole('am')`; radios follow the existing one-Tab-stop arrow-key rule.
  - Update `the page shows its sections in order with the confirmed words` for the new section order.
- [ ] **Step 2:** `node --test tests/settings.test.js` → new tests FAIL.
- [ ] **Step 3: Implement.** Restore: role keys are set when present in the file and left alone when absent. Settings app: `onRole` → `saveRole`, redraw, focus stays on the picked radio.
- [ ] **Step 4:** `npm test` → all PASS.
- [ ] **Step 5: Commit** `feat: 설정에 내 직급 추가, 백업 포함`.

### Task 3: Role sheet on home

**Files:**
- Create: `shared/role-sheet.js`, `shared/role-sheet.css` (or add to `home/home.css`; follow `settings/install-sheet.js` styling)
- Modify: `home/app.js`, `index.html` (stylesheet link if a new file)
- Test: `agent-lifecycle/tests/role-sheet.test.js`

**Interfaces:**
- Consumes: Task 1.
- Produces (`shared/role-sheet.js`): `openRoleSheet(doc, lang, { onPick(role), onLater() }) -> { closed: Promise<void> }` (a second call while open returns the open one); `askRoleHere({ storage, href }) -> boolean`; `runFirstOpen({ startClosed: Promise, askRole: boolean, openSheet: () => { closed: Promise }, startTour: () => void }) -> Promise<void>`.

- [ ] **Step 1: Write failing tests:**
  - `the sheet shows the approved words and five roles`: title, note, five buttons in `ROLES` order with `ROLE_NAMES[lang]`, later button; it is a modal dialog (`role="dialog"`, `aria-modal`, labelled by the title) and the first role button takes focus.
  - `picking saves and closes`: click `sme` → `onPick('sme')` once, sheet removed, `closed` resolves.
  - `later marks asked and closes`: click later → `onLater` once; Escape does the same.
  - `no sheet when storage is blocked`: `askRoleHere({ storage, href }) -> boolean` (in `shared/role-sheet.js`) is false for blocked storage, for an `href` with a hash, and for `?tour`; true for a bare home address with empty storage.
  - `the sheet waits for the start screen and comes before the tour`: `runFirstOpen({ startClosed, askRole, openSheet, startTour })` (in `shared/role-sheet.js`), tested with fakes: `startClosed` resolves → `openSheet` → its `closed` → `startTour`; when `askRole` is false, the tour follows the start screen directly.
- [ ] **Step 2:** `node --test tests/role-sheet.test.js` → FAIL.
- [ ] **Step 3: Implement** the sheet and `runFirstOpen`; wire `home/app.js`: `onPick` → `saveRole` + `draw()`; `onLater` → `markRoleAsked`.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: 홈에서 직급을 한 번 묻는 시트`.

### Task 4: Home order, preparing note, role-neutral wording

**Files:**
- Modify: `home/data.js` (LEARN entries get `role`; `misoRole`), `home/render.js` (`myLearning`, `renderHome`), `home/start-data.js` (tagline, afternoon/monday/friday lines), `home/app.js` (pass role)
- Test: `agent-lifecycle/tests/home.test.js`, `agent-lifecycle/tests/start.test.js`

**Interfaces:**
- Consumes: Task 1 `loadRole`, `COURSE_ROLES`, `ROLE_UI`, `ROLE_NAMES`.
- Produces: `orderByRole(items, role) -> items` (stable: items whose `role === role` first) exported from `home/render.js`; `myLearning(storage, role = 'tl')`; `renderHome(root, lang, storage, today, role = 'tl')`. LEARN entries: lifecycle `role:'tl'`, sop `role:'tl'`, excel no role, SME card added in Task 7.

- [ ] **Step 1: Write/update failing tests:**
  - `orderByRole keeps order within groups`: for `[{id:'a',role:'tl'},{id:'b'},{id:'c',role:'sme'}]`, role `'sme'` → `c,a,b`; role `'tl'` → `a,b,c`; role `'am'` → `a,b,c`.
  - `a role without a course shows the preparing note`: role `am` → `[data-role-preparing]` text = preparing note with `{role}` = `부매니저 (Assistant Manager)`, links to `./codex/#career` and `./codex/#daily-am`; role `sme` or `tl` → no note.
  - `wording changed for every role is the approved copy`: `HOME_UI.misoRole.ko`, `START_UI.tagline.ko`, and the afternoon/monday/friday lines equal the "바뀐 뒤" column of copy doc §1; the morning line is unchanged. Update `home wording is the approved wording` and the start-screen wording test so these rows read from the new copy doc instead of the older docs.
- [ ] **Step 2:** `node --test tests/home.test.js tests/start.test.js` → FAIL.
- [ ] **Step 3: Implement.** `renderHome` orders LEARN and the "내 학습" rows with `orderByRole`; the note sits under "내 학습".
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: 홈을 고른 직급 순서로`.

### Task 5: Codex opens on the role

**Files:**
- Modify: `codex/render/page.js` (`newState`), `codex/render/career.js`, `codex/render/daily.js`, `codex/app.js`
- Test: `agent-lifecycle/tests/codex.test.js`

**Interfaces:**
- Consumes: Task 1 `loadRole`.
- Produces: `newState(role = 'tl')` adds `you: role`. Career uses `{ team: 'operation', level: state.you }` where it used `CAREER.you`; daily uses `state.you` where it used `DAILY.defaultRole`. Data files unchanged.

- [ ] **Step 1: Write failing tests:**
  - `the career ladder starts on the saved role`: `newState('sme')` → open level is SME with the "you are here" chip; `newState()` keeps today's team-lead behavior (existing test still passes).
  - `the daily page starts on the saved role`: `newState('om')` → OM tab pressed; week check absent. `newState('tl')` → week check present (existing test).
  - An address item still wins: `#daily-agent` with role `om` opens Agent.
- [ ] **Step 2:** `node --test tests/codex.test.js` → FAIL.
- [ ] **Step 3: Implement**; `codex/app.js` builds `newState(loadRole(storage))`.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: Codex가 고른 직급으로 열림`.

### Task 6: SME lessons (Korean)

**Files:**
- Modify: `docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md` (two caption fixes only)
- Create: `sme/ui.js`, `sme/lessons/01-first-day.js` … `07-knowledge.js`, `sme/lessons/index.js`
- Test: `agent-lifecycle/tests/sme.test.js`

**Interfaces:**
- Consumes: `agent-lifecycle/js/lessons/build.js` (`tx`, `node`, `edge`, `step`, `option`), `validateCourse`.
- Produces: `SME_LESSONS` (ids in order: `first-day`, `newcomer`, `escalation`, `peer`, `lead`, `priority`, `knowledge`); `sme/ui.js`: `SME_PROGRESS_KEY = 'sme-course:v1'`, `SME_FIGURE` (same as `SOP_FIGURE`), `SME_UI` (courseTitle, courseTagline from copy §3, listNote = §3 숫자 안내, home, checkpoint `SME 체크포인트`… use the SOP_UI shape with SME wording from copy §3; buttons not in the copy reuse SOP_UI wording with "SOP"→"레슨").

- [x] **Step 1: Copy fixes** — done and approved by the owner (2026-11-25): the two "(예시)" labels, and 도윤 → 준호 (Junho) so the name does not clash with Doyun in the PIP SOP.
- [ ] **Step 2: Write failing tests** in `sme.test.js`, with a parser for the copy doc format (`## 레슨 N. 제목`; table rows `| 제목 | … |`, `| 짧은 이름 |`, `| 부제 |`, `| 노드 | a · b · c · d |`; numbered lines `N. caption` under "스텝:"; checkpoint rows `| 1번 질문 |`, `| 보기 x (오답/정답) |`, `| x 피드백 |`, `| 해설 |` in order; `| 다음 레슨 연결 |` / `| 마지막 연결 |`):
  - `the SME course passes the course rules`: `validateCourse(SME_LESSONS, { lessonCount: 7, loop: false, figure: SME_FIGURE })` → `[]`.
  - `the Korean is the approved copy, word for word`: for each lesson, title/short/subtitle/node labels (in order)/captions/prompts/options/answers/wrong-option feedback/explanations/connection equal the parsed copy; right answers have no feedback.
  - `each lesson names its person`: personaName — 2 `서준`, 4 `준호`, others default `지민` (lesson 5 text mentions 지민).
  - `every box sits inside the picture and none overlap` (copy the SOP test's geometry check).
  - `the last lesson leads back to the list`.
- [ ] **Step 3:** `node --test tests/sme.test.js` → FAIL.
- [ ] **Step 4: Implement** the seven lesson files: one column of four nodes like `sop-library/lessons/10-transition.js`; each step highlights the node its copy describes (step 1 shows all, the setup step shows none).
- [ ] **Step 5:** `npm test` → PASS.
- [ ] **Step 6: Commit** `feat: SME 첫걸음 레슨 7개 (한국어)`.

### Task 7: SME course page, home card, practice, backup/reset

**Files:**
- Create: `sme/index.html`, `sme/app.js`, `sme/home.js` (copy `sop-library/` structure; one numbered list, no groups or "누가")
- Modify: `home/data.js` (LEARN card `./sme/`, role `sme`, text from copy §3 홈 카드), `home/render.js` (`COURSES` adds `{ id:'sme', name: SME_UI.courseTitle, lessons: SME_LESSONS, key: SME_PROGRESS_KEY, path: './sme/' }`), `practice/engine.js` (pool + openTerms include SME), `settings/engine.js` (`SME_PROGRESS_KEY` in BACKUP_KEYS and PROGRESS_KEYS/RESET_KEYS)
- Test: `agent-lifecycle/tests/sme.test.js`, `home.test.js`, `practice-engine.test.js`, `settings.test.js`

**Interfaces:**
- Consumes: Task 6 `SME_LESSONS`, `SME_UI`, `SME_PROGRESS_KEY`; Task 4 `orderByRole`.

- [ ] **Step 1: Write failing tests:**
  - `the list shows the seven lessons in order with done marks` (jsdom, like the SOP list test).
  - `a lesson counts out of seven and the last one leads to the list`.
  - `stale addresses open the list`.
  - Home: with role `sme`, LEARN order is SME → 라이프사이클 → SOP → 엑셀 and "내 학습" lists SME first; the card text is copy §3 홈 카드.
  - Practice: a finished SME lesson's two questions are in `pool(storage)`; finishing only an SME lesson opens term cards.
  - Settings: backup holds `sme-course:v1` when set (key count now ten); reset erases it and keeps the role (`reset keeps the role and erases SME progress`).
- [ ] **Step 2:** `npm test` → new tests FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** `npm test` → PASS; `python3 agent-lifecycle/scripts/browser_check.py` → no errors (add the SME list and lesson 1 to its page list).
- [ ] **Step 5: Commit** `feat: SME 강의 페이지와 홈·연습·백업 연결`.

### Task 8: English

**Files:**
- Create: `docs/superpowers/specs/2026-11-25-sme-course-copy.en.md` (same layout as the ko doc)
- Modify: all `en` fields in `sme/`, `shared/role-data.js`, `home/data.js`, `home/start-data.js`
- Test: `sme.test.js`, `role.test.js`, `home.test.js`

- [ ] **Step 1: Write the English copy doc** and send it to the owner for approval before Step 3's commit.
- [ ] **Step 2: Failing tests:** course rules with `requireEnglish: true`; English equals the `.en.md` doc; existing helpers for "never more sentences than its Korean" and US spelling run over SME; English home, SME list, role sheet and settings have no Korean (role names in the sheet show English only in English).
- [ ] **Step 3: Implement**, `npm test` → PASS, commit `feat: SME 강의와 직급 선택 영어`.

### Task 9: Docs, offline list, final check

**Files:**
- Modify: `README.md`, `README.en.md` (table row for `sme/`, intro no longer "신입 팀장을 위한" only), `LOG.md` (dated entry, status 진행 중), `sw.js` (regenerated)
- Test: `readme.test.js`, `sw.test.js`

- [ ] **Step 1:** `python3 tools/sw_list.py`; update README rows and LOG entry.
- [ ] **Step 2:** `cd agent-lifecycle && npm test` → every test passes; report the count and any failure by name.
- [ ] **Step 3:** `python3 agent-lifecycle/scripts/browser_check.py` → clean.
- [ ] **Step 4:** Ask the owner to approve commit, push and PR.
