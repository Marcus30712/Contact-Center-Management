# 내 직급 강의만 보여 주기와 직급별 복습 퀴즈 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Home "내 학습" shows only the learner's role courses plus Excel, and each role with a course gets a six-question review quiz at `review/` that awards a badge when passed.

**Architecture:** A role→courses map decides both what "내 학습" shows and when a quiz unlocks. Quiz questions live in `review/data.js` in the lesson checkpoint shape, graded with the existing `gradeAnswer`. Results are stored under `queuecraft:review:v1`; the practice badge check reads them, and the quiz page awards the badge on first pass.

**Tech Stack:** Vanilla ES modules; `cd agent-lifecycle && npm test`; `python3 agent-lifecycle/scripts/browser_check.py`; `python3 tools/sw_list.py`.

**Spec:** `docs/superpowers/specs/2026-11-25-role-review-quiz-design.md` · copy: `docs/superpowers/specs/2026-11-25-review-quiz-copy-ko.md` (ko, approved 2026-11-25), `…-review-quiz-copy.en.md` (Task 6, needs owner approval)

## Global Constraints

- Korean exactly as the approved copy doc. English from the `.en.md` (Task 6).
- Quiz roles: `tl` (courses `lifecycle` + `sop`), `sme` (course `sme`). Six questions each; pass = 5 or more right.
- Storage key `queuecraft:review:v1`, value `{ [role]: { best: number, total: number, passed: boolean } }`. In backup and in reset.
- Badges `review-tl` ("팀장 과정 완주"), `review-sme` ("SME 과정 완주") appended to `BADGE_IDS` (10 → 12).
- Nothing is locked by role: any learner may open any unlocked quiz; only "내 학습" is filtered by role.
- Only finished runs are stored; the best score is never lowered.
- Storage blocked: quiz playable, nothing stored, no error.
- After runtime changes `python3 tools/sw_list.py`. Commits on branch `role-select-sme-course` (PR #87); push only with owner approval.

## Review Focus

1. A learner with no role saved is a team lead: their "내 학습" loses only the SME row and "다 마쳤어요" returns once lifecycle, SOP and Excel are done (Task 1 `team lead home hides SME progress and can be all done`).
2. A worse retake must not lower a stored best or un-pass a passed quiz (Task 2 `a worse retake keeps the best and the pass`).
3. Stored review data that is malformed (not JSON, wrong shape, unknown role) reads as empty without throwing (Task 2 `broken review data reads as empty`).
4. Reloading or leaving mid-quiz stores nothing and a new visit starts at question 1 (Task 3 `leaving mid-quiz stores nothing`).
5. Opening `review/` with an unknown hash or for a locked quiz shows the list, not a broken quiz (Task 3 `a locked or unknown quiz address shows the list`).

---

### Task 1: "내 학습" shows the role's courses only

**Files:**
- Modify: `home/render.js` (`myLearning`), `shared/role.js`
- Test: `agent-lifecycle/tests/home.test.js`, `agent-lifecycle/tests/role.test.js`

**Interfaces:**
- Produces (`shared/role.js`): `ROLE_COURSES = { tl: ['lifecycle', 'sop'], sme: ['sme'] }`; `coursesFor(role) -> string[]` (`[]` for roles without a course).
- Produces (`home/render.js`): `myLearning(storage, role = 'tl')` returns only rows whose course id is in `coursesFor(role)` or which carry no role (Excel); order unchanged (role's courses first). `allDone`/`started` computed over those rows. The `[data-start]` note logic is unchanged.

- [ ] **Step 1: Failing tests**
  - role.test `courses per role`: `coursesFor('tl')` → `['lifecycle','sop']`, `coursesFor('sme')` → `['sme']`, `coursesFor('am')` → `[]`.
  - home.test `team lead home hides SME progress and can be all done`: storage with lifecycle 6, SOP 10, Excel 11 done; `myLearning(s).map(r=>r.id)` → `['lifecycle','sop','excel']`, `.allDone === true`; rendered home (no role arg) has `[data-all-done]` and no `[data-course="sme"]`.
  - home.test `an SME sees only SME and Excel progress`: `myLearning(s,'sme').map(r=>r.id)` → `['sme','excel']`.
  - home.test `roles without a course see Excel only`: `myLearning(s,'am').map(r=>r.id)` → `['excel']`.
  - Update existing tests that expected four rows (`my learning: nothing started…`, `the home screen greets…` rows 4→3, `a first visit…` review links, `an SME learner sees the SME course first…`) to the filtered rows.
- [ ] **Step 2:** `node --test tests/home.test.js tests/role.test.js` → new tests FAIL.
- [ ] **Step 3: Implement.** `COURSES` entries already carry `role`; filter with `coursesFor`.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: Commit** `feat: 내 학습은 내 직급 강의만`.

### Task 2: Quiz data, results store and badges

**Files:**
- Create: `review/data.js`, `review/engine.js`
- Modify: `practice/engine.js` (`BADGE_IDS`, `checkBadges`, `courseFacts`), `practice/data.js` (`BADGES`), `settings/engine.js` (backup/reset keys), `privacy/text.js` (`s2.item3`)
- Test: `agent-lifecycle/tests/review.test.js`, `practice-engine.test.js`, `practice-copy.test.js`, `practice-render.test.js`, `settings.test.js`, `privacy.test.js`

**Interfaces:**
- Produces (`review/data.js`): `REVIEW_UI` (copy §1 keys: `title, intro, nameTl, scopeTl, nameSme, scopeSme, locked, lockedLink, start, count, correct, wrong, related, next, finish, score, passed, failed, missedTitle, retry, best, passMark, homeStart, homeDone`), `QUIZZES = { tl: { name, scope, questions }, sme: {…} }`; each question `{ id, prompt, options: [{id, text, feedback?}], answer, explanation, lessons: [{ title, href }] }` — ids `tl-q1…tl-q6`, `sme-q1…sme-q6`; hrefs exactly as in the copy's 관련 레슨 rows.
- Produces (`review/engine.js`): `REVIEW_KEY = 'queuecraft:review:v1'`, `PASS_MARK = 5`, `loadReview(storage) -> object`, `recordRun(storage, role, correct, total) -> { best, total, passed, firstPass: boolean }`, `unlocked(storage, role) -> { open: boolean, left: number, next: { href } | null }` (uses `coursesFor` and each course's progress key and lesson list).
- Produces (`practice/engine.js`): `BADGE_IDS` ends `'review-tl', 'review-sme'`; `checkBadges` adds them from `ctx.reviewTl`, `ctx.reviewSme`; `courseFacts` returns `reviewTl`, `reviewSme` from `loadReview(storage)[role]?.passed`.

- [ ] **Step 1: Failing tests** (review.test unless noted)
  - `the Korean is the approved copy, word for word`: parse copy doc `## 퀴즈 N.` / `### 문제 N` tables; compare prompt, options (text, feedback), answer, explanation, lessons (`제목 (href)` pairs split on ` · `) for both quizzes; `REVIEW_UI` ko equals §1 rows; badge names/rules equal §2.
  - `six questions each, answers spread over a, b and c`.
  - `a run of 5 passes and 4 does not`: `recordRun(s,'sme',5,6)` → `{best:5,total:6,passed:true,firstPass:true}`; `recordRun(s,'tl',4,6).passed === false`.
  - `a worse retake keeps the best and the pass`: after 6/6 then 3/6 → best 6, passed true, firstPass false.
  - `broken review data reads as empty`: stored `'x'`, `'[]'`, `'{"boss":{"best":9}}'`, `'{"tl":{"best":"9"}}'` → `loadReview` gives `{}` (unknown roles and bad fields dropped).
  - `blocked storage plays but stores nothing`: `recordRun(throwingStorage,'tl',6,6)` returns `passed:true`, does not throw.
  - `a quiz unlocks when the role's courses are finished`: tl open only with all 6 lifecycle + 10 SOP done (`left` counts remaining; `next.href` is the first unfinished lesson address); sme with all 7.
  - practice-engine: `BADGE_IDS` has twelve ids ending with the two review ids; `checkBadges(empty(), {today, reviewTl:true})` → `['review-tl']`.
  - practice-copy: badge list matches; practice-render shelf count 10 → 12.
  - settings: backup key list gains `queuecraft:review:v1` (eleven keys); reset clears it.
  - privacy: `s2.item3` equals copy §3 row (read like the earlier §4 override).
- [ ] **Step 2:** `npm test` → new tests FAIL.
- [ ] **Step 3: Implement.** Generate `review/data.js` from the copy doc once (throwaway script, not committed), as done for the SME lessons.
- [ ] **Step 4:** `npm test` → PASS; `python3 tools/sw_list.py`.
- [ ] **Step 5: Commit** `feat: 복습 퀴즈 문제, 기록, 배지`.

### Task 3: The `review/` page

**Files:**
- Create: `review/index.html` (copy of `practice/index.html` shape), `review/app.js`, `review/render.js`, `review/review.css`
- Modify: `shared/appbar.js` (`review/` belongs to Learn)
- Test: `agent-lifecycle/tests/review.test.js`, `sw.test.js` (page count 13 → 14)

**Interfaces:**
- Consumes: Task 2 `QUIZZES`, `REVIEW_UI`, `recordRun`, `unlocked`, `loadReview`; `gradeAnswer` from `agent-lifecycle/js/engine/quiz.js`; practice `loadState/saveState/BADGES` to add the badge on first pass.
- Produces: `newReviewView() -> { role: null, index: 0, answers: {} }`; `renderReview(root, lang, storage, view, role)` — list when `view.role` is null, else the quiz or its result. Address `#tl` / `#sme` opens that quiz if unlocked.

- [ ] **Step 1: Failing tests** (jsdom)
  - `the list shows my role's quiz first, with lock, best and pass`: role `sme`, nothing done → cards order sme, tl; both locked with `잠김 안내` (n = 7 / 16) and a link to the first lesson; after SME done and a stored 5/6 pass → sme card shows `✓ 통과` and `최고 기록 5/6` and a start button.
  - `answering shows feedback, explanation and related lessons`: wrong answer → `[data-feedback]` text, explanation, two `a[data-related]` with the question's hrefs; right answer → no related links; options disabled.
  - `finishing scores the run, offers a retry and awards the badge once`: answer 5 right → result shows score line, `통과` text, retry button; practice state gains `review-sme`; second pass does not add it again.
  - `a failed run lists the lessons to review`: 4 right → `미통과` text with `{need}`=5, `[data-missed] a` links for the two missed questions' lessons (deduplicated).
  - `leaving mid-quiz stores nothing`: answer 3 questions, re-render with a fresh view → list shown, `loadReview` empty.
  - `a locked or unknown quiz address shows the list`: `#tl` when locked, `#boss` → list.
  - sw.test page count 14.
- [ ] **Step 2:** `node --test tests/review.test.js` → FAIL.
- [ ] **Step 3: Implement.** Reuse practice's question markup classes (`pr-card`, `option`, `explanation`) and Miso faces `think/joy/worry/cheer/proud`.
- [ ] **Step 4:** `npm test` → PASS; `python3 tools/sw_list.py`.
- [ ] **Step 5: Commit** `feat: 복습 퀴즈 페이지`.

### Task 4: Home quiz card

**Files:**
- Modify: `home/render.js`
- Test: `agent-lifecycle/tests/home.test.js`

**Interfaces:**
- Consumes: Task 2 `unlocked`, `loadReview`, `REVIEW_UI`.

- [ ] **Step 1: Failing tests**
  - `the quiz card appears once the role's courses are done`: role `sme`, SME 7 done → `a[data-review-quiz]` href `./review/#sme`, text = 홈 카드 (통과 전); not present with 6 done; after a stored pass 6/6 → 홈 카드 (통과 뒤) with `{x}/{n}` = 6/6.
  - `roles without a course get no quiz card`.
- [ ] **Step 2:** FAIL. **Step 3:** implement under the course rows. **Step 4:** `npm test` PASS. **Step 5:** commit `feat: 홈에 복습 퀴즈 카드`.

### Task 5: Browser check

**Files:** Modify `agent-lifecycle/scripts/browser_check.py`

- [ ] **Step 1:** Add `review/` and `review/#sme` to the layout loop; add `(q1)` a seeded SME learner with all SME lessons done sees the home quiz card and can finish a 6/6 run with no console errors, and `(q2)` the badge appears on `practice/`.
- [ ] **Step 2:** `python3 agent-lifecycle/scripts/browser_check.py` → `ALL CHECKS PASSED`.
- [ ] **Step 3:** Commit `test: 복습 퀴즈 브라우저 점검`.

### Task 6: English, docs, final check

**Files:**
- Create: `docs/superpowers/specs/2026-11-25-review-quiz-copy.en.md` (same layout as ko)
- Modify: `en` fields in `review/data.js`, `practice/data.js`; `README.md`, `README.en.md` (review row, "배지 12개" / "12 badges"), `LOG.md` (entry 52), `sw.js`
- Test: `review.test.js`, `readme.test.js`

- [ ] **Step 1:** Write the English copy doc; send it to the owner for approval.
- [ ] **Step 2: Failing tests:** English equals the `.en.md`; English review page and list have no Korean; English never has more sentences than its Korean per prompt/explanation.
- [ ] **Step 3: Implement**; `npm test` PASS; browser check PASS.
- [ ] **Step 4:** Ask the owner to approve commit and push.
