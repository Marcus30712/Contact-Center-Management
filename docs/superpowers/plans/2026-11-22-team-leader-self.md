# 팀장 자신의 시간·코칭 품질·동료에서 팀장으로 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a coach-observation step and a third checkpoint to the 1:1 coaching SOP, a new SOP "동료에서 팀장으로", a "내 한 주 돌아보기" checklist on the Codex team-leader daily page, a glossary sentence, and guide situation s18.

**Architecture:** Content changes inside the existing SOP, Codex, glossary and guide data; the checklist is a small render addition with its own data file outside the Codex data. Tests compare screens with the approved copy docs, as for earlier SOPs.

**Tech Stack:** Vanilla ES modules; `cd agent-lifecycle && npm test`; `python3 agent-lifecycle/scripts/browser_check.py`; `python3 tools/sw_list.py`.

**Spec:** `docs/superpowers/specs/2026-11-22-team-leader-self-design.md` · copy: `…-copy.md` (ko, approved 2026-11-22), `…-copy.en.md`

## Global Constraints

- Korean exactly as the approved copy doc; English exactly as `.en.md`. No new wording without approval.
- Lesson limits: ≤ 12 steps and 1–3 checkpoint questions per track (`lessonSchema.js`); coaching ends with 12 steps and 3 questions.
- Every lesson names its case person; the new SOP's is 하은 / Haeun (`personaName`).
- Figures: unsourced durations carry "예시"/"Example"; "90일" in titles is the procedure's frame.
- No specific country's law, no "진상", captions ≤ 3 sentences, US English, English never longer in sentences than its Korean.
- The checklist is not Codex content: its own data file, a visible source note, ticks never written to storage.
- Older approved docs stay as they are, except the guide design table which the guide test reads (one dated row added).
- After runtime changes: `python3 tools/sw_list.py`.

## Review Focus

1. The coaching lesson at exactly 12 steps and 3 questions passes course validation in both languages (Task 1: `the SOP course passes the course rules in both languages`).
2. New diagram side nodes ("코치 관찰", "90일 돌아보기") stay inside the picture and overlap nothing (Task 1: existing `every box sits inside the picture and none overlap`).
3. Checklist ticks survive switching roles on the Codex daily page but are never stored and clear on reload (Task 3: `ticks are kept on the page and never stored`).
4. Guide s18's "then" link opens the team-leader daily view with the checklist visible (Task 4 browser check `(g7)`).
5. New English sentences never outnumber their Korean and pass the US-spelling checks (Task 1: existing `the English never runs to more sentences…`, `the English reads as US English…`).

---

### Task 1: SOP lessons (coaching additions, new transition SOP, connections)

**Files:**
- Modify: `sop-library/lessons/02-coaching.js`, `04-calibration.js`, `07-launch.js`, `index.js`
- Create: `sop-library/lessons/10-transition.js`
- Modify: `docs/superpowers/specs/2026-11-22-team-leader-self-copy.md` (append "구현용 문안" in the parser format — `## 레슨 N. 제목`, `- 부제:`, `- 누가:`, `1. **[단계]** 문장`, `**확인 문제 n.**`, `- a. … ✅`, `- 해설:`, `**다음으로:**` — restating the full approved coaching lesson with the new step and question, and the new lesson; plus `| 문제.보기 | 한국어 | English |` feedback rows). Transcription only, no wording change.
- Test: `agent-lifecycle/tests/sop.test.js`

**Interfaces:**
- Produces: lesson `{ id: 'transition', order: 6, group: 'leader', personaName: tx('하은','Haeun'), procedure: ['listen','agree','act'], … }`; `SOP_LESSONS` order `[escalation, scrubbing, coaching, pip, calibration, transition, onboarding, incident, nurture, launch]`; coaching diagram node `observe` ("코치 관찰"), transition side node `review` ("90일 돌아보기"); connections calibration→transition→onboarding, launch→home ("열 가지").

- [ ] **Step 1: Failing tests** — in `sop.test.js`: add the new copy doc to `COPY_FILES` (last, so its coaching section replaces the old one by title); `ten lessons in order…` (`SOP_LESSONS.map(l=>l.id)` equals the order above, `COPY.length === 10`); `PROCEDURES.transition = ['듣기','기준 합의','실행과 점검']`; `EXTRAS.coaching` adds `'코치 관찰'`, `EXTRAS.transition = ['90일 돌아보기']`; persona test: Doyun in PIP, Seoa in onboarding, Haeun in transition, Jimin elsewhere; feedback rows read the new doc too and count 42; new test `the connections changed for transition are the approved wording` (calibration and transition and launch `.connection.text` equal the doc's 연결 문구 table, `to` values as above); update the scrubbing/nurture connection tests' "다섯 가지"/"아홉 가지" expectations only where the approved new wording replaces them.
- [ ] **Step 2: Run — Expected: FAIL** (`transition` missing, coaching 11 steps).
- [ ] **Step 3: Implement** lesson files and connections from the copy docs (Korean from `.md`, English from `.en.md`).
- [ ] **Step 4: Run — Expected: PASS**, full suite green (counts elsewhere that break are fixed in Task 2; if any, note them and fix there).
- [ ] **Step 5: Commit** `feat(sop): coach observation, colleague-to-team-leader SOP`

### Task 2: Home card, practice pool, glossary sentence

**Files:**
- Modify: `home/data.js` (SOP card text, ko/en), `glossary/terms.js` (`one-on-one-coaching` definition, ko/en)
- Test: `agent-lifecycle/tests/home.test.js`, `practice-engine.test.js`, `glossary.test.js`

- [ ] **Step 1: Failing tests** — `the SOP Library card lists the ten procedures (approved 2026-11-22)` (text equals the copy docs' 홈 카드 rows); practice pool count `6×3 + 9×2 + 1 + 2 = 39` with message updated; glossary `one-on-one-coaching` definition equals the copy docs' "바뀐 뒤/After" rows and stays ≤ 3 sentences.
- [ ] **Step 2: Run — Expected: FAIL.**
- [ ] **Step 3: Implement** the text changes.
- [ ] **Step 4: Run — Expected: PASS**, full suite green.
- [ ] **Step 5: Commit** `feat: home card, practice pool and glossary for the new SOP content`

### Task 3: "내 한 주 돌아보기" on the Codex team-leader daily page

**Files:**
- Create: `codex/data/week-check.js` (`export const WEEK_CHECK = { title, note, source, items: [5 × {ko,en}] }`)
- Modify: `codex/render/daily.js`, `codex/codex.css`
- Test: `agent-lifecycle/tests/codex.test.js`

**Interfaces:**
- Produces: section `[data-week-check]` shown only when the team-leader role is selected; 5 `input[type=checkbox][data-week-item=n]` with labels; `[data-week-source]` source note.

- [ ] **Step 1: Failing tests** — `the week check matches the approved copy` (ko/en equal the docs' ② tables); `only the team-leader view shows the week check`; `ticks are kept on the page and never stored` (tick item 2, switch role to agent and back → still ticked; storage spy sees no write containing "week"); `the English week check has no Korean`; the existing Codex-copy test still passes untouched.
- [ ] **Step 2: Run — Expected: FAIL.**
- [ ] **Step 3: Implement** data file, render (ticks kept in a module-level Set for the page's life), CSS.
- [ ] **Step 4: Run — Expected: PASS**, full suite green.
- [ ] **Step 5: Commit** `feat(codex): week check on the team-leader daily page`

### Task 4: Guide situation s18

**Files:**
- Modify: `guide/data.js` (s18 in group `org`), `docs/superpowers/specs/2026-11-19-situation-guide-design.md` (one row for s18, dated 2026-11-22)
- Test: `agent-lifecycle/tests/guide.test.js`, `agent-lifecycle/scripts/browser_check.py`

- [ ] **Step 1: Failing tests** — row counts 17 → 18; s18 text/first/then equal the copy docs (first `../sop-library/#transition-0`, then `../codex/#daily-tl`); existing "every link opens a real lesson or page" test covers the new links. Browser `(g7)`: open guide, s18 first link → transition lesson; then link → codex daily with `[data-week-check]` visible.
- [ ] **Step 2: Run — Expected: FAIL.**
- [ ] **Step 3: Implement** data and doc row.
- [ ] **Step 4: Run — Expected: PASS**, full suite green.
- [ ] **Step 5: Commit** `feat(guide): s18 colleague to team leader`

### Task 5: Browser check, offline list, LOG

**Files:** `agent-lifecycle/scripts/browser_check.py`, `sw.js` (via `tools/sw_list.py`), `LOG.md` (entry 48 "검토 중"), README only if it counts SOPs.

- [ ] **Step 1:** Browser checks: transition lesson and coaching lesson end-to-end at 390px ko/en with no overflow; week check at 320px ko/en; `(g7)` from Task 4.
- [ ] **Step 2: Run** `timeout 590 python3 agent-lifecycle/scripts/browser_check.py > /tmp/bc.txt 2>&1; tail -1 /tmp/bc.txt` — Expected: `ALL CHECKS PASSED`.
- [ ] **Step 3:** `python3 tools/sw_list.py`; LOG 48; full `npm test` green.
- [ ] **Step 4: Commit** `chore: browser checks, offline list and LOG for team-leader content`
