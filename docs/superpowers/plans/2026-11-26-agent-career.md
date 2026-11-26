# 상담사 커리어 라이프사이클 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the 5-lesson ring course "상담사 커리어 라이프사이클 / Agent Career Lifecycle" as the agent role's second Learn card, and normalize the Korean role names in the Codex career matrix.

**Architecture:** A copy of the 직무전문가 서포트 라이프사이클 ring course (`sme-lifecycle/`), as `agent-career/`. Lesson files are generated from the approved copy docs by a scratch generator cloned from `/tmp/gen/gen_sl.py`. Every agent wiring point that got an `agent` entry for 상담사 첫걸음 gets an `agent-career` entry next to it.

**Tech Stack:** Static vanilla ES modules, node:test + jsdom, Playwright browser check, `tools/sw_list.py`.

**Spec:** `docs/superpowers/specs/2026-11-26-agent-career-design.md`. Copy: `2026-11-26-agent-career-copy-ko.md` (approved) and `2026-11-26-agent-career-copy.en.md`.

## Global Constraints
- Folder `agent-career/`, course key `agent-career`, progress key `agent-career:v1`.
- Lesson ids: sme, qa, trainer, tl, ready. Question ids `<lesson>-q1`, `<lesson>-q2`. Practice and review keys are course-scoped (`agent-career:sme-q1`), so they never meet the same ids in other courses.
- personaName is 지민 / Jimin for all five lessons. The ring centre is 지민 / Jimin. The note under the ring: "어느 길이든 지금의 상담사 자리에서 시작합니다" / "Every path starts from where you are now, as an agent".
- Lesson-screen labels are the same as 상담사 첫걸음 (checkpoint label 상담사 체크포인트 / Agent checkpoint).
- Lesson rules are the same as the other courses:
  - 6–12 steps, ≤3 sentences per step, English never more sentences than Korean
  - a figure needs "예시"/"Example"
  - the stage-highlight sentence "첫/둘째/셋째/넷째 단계는"
  - 2 checkpoint questions, with feedback on every wrong option
- Korean text names roles in Korean (korean-role-names test). English text has no Hangul.
- Only the agent role sees the course. Agent Learn order: 상담사 첫걸음 · 상담사 커리어 라이프사이클 · 상담사 SOP 라이브러리(준비 중) · 미소의 엑셀 연습.
- The stage word is 실전 배치 / Go Live.

## Review Focus
1. Another role (SME/TL/AM/OM) holding `agent-career:v1` progress must not see the course in Learn or 내 학습. It still counts as "started", as with other cross-role progress. Test in Task 2.
2. Odd addresses: `agent-career/#tl-99`, `#nope` and `#golive-3` (a lesson id from another agent course) open the ring or lesson 1 with no error, in both languages. Test in Task 1.
3. A Today's Practice question from this course links to `../agent-career/#<id>-0`, not to the SME, QA or TL courses whose lesson ids look alike. Test in Task 2.
4. Backup, restore and reset include `agent-career:v1`, and old backups without it still restore. Test in Task 2.
5. The ring at 320px fits five names, including the longest Korean "직무전문가" and English "Team leader", with no overflow or overlap. Test in Task 1 (box test) and the browser check.

---

### Task 1: The course itself (`agent-career/`)

**Files:**
- Create: `agent-career/ui.js`, `agent-career/lessons/01-sme.js` … `05-ready.js`, `agent-career/lessons/index.js`, `agent-career/app.js`, `agent-career/index.html`, `/tmp/gen/gen_ac.py`
- Test: `agent-lifecycle/tests/agent-career.test.js` (new, modeled on `sme-lifecycle.test.js`)

**Interfaces:**
- Produces:
  - `AC_PROGRESS_KEY = 'agent-career:v1'`
  - `AC_FIGURE = AGENT_FIGURE`
  - `AC_UI`: courseTitle, courseTagline, listNote, homeCard, personaName, loop, and the lesson-screen labels taken from `AGENT_UI`
  - `AC_LESSONS` (5 lessons, connection of `ready` is `{ to: 'home' }`)

- [ ] **Test step:** write `agent-career.test.js` with the same checks `sme-lifecycle.test.js` runs, pointed at the new course:
  - validateCourse with English required; ids in order `['sme','qa','trainer','tl','ready']`
  - Korean and English are the copy docs word for word, including the §1 course words
  - right answers carry no feedback, every wrong answer has one; stage sentences light their node
  - personaName is 지민 in all five lessons; boxes inside the picture with no overlap
  - the ring shows five stages with 지민 in the middle and the loop note; the TL ring is unchanged
  - a lesson counts "n / 5", says 상담사 체크포인트, and `ready` leads to the list
  - stale addresses (`#tl-99`, `#nope`, `#golive-3`) open the ring; every `#<id>-0` opens that lesson
  - English screens have no Hangul; the ring screen shows the figures note
- [ ] **Verify RED:** `cd agent-lifecycle && node --test tests/agent-career.test.js` → fails, because `agent-career/ui.js` cannot be found.
- [ ] **Code step:** copy `sme-lifecycle/` to `agent-career/`, swapping names and keys (ui strings from copy §1). Clone `gen_sl.py` to `gen_ac.py` (copy paths, output dir, personaName 지민/Jimin) and run `python3 /tmp/gen/gen_ac.py .`.
- [ ] **Verify GREEN:** the same command passes.

### Task 2: Wire the agent role, and the Codex names

**Files:**
- Modify: `shared/courses.js` (COURSE_INFO `'agent-career'` right after `agent`), `shared/role.js` (`ROLE_COURSES.agent = ['agent','agent-career']`), `home/role-home.js` (agent learn: the new card second), `home/data.js` (LEARN entry with the §1 home card)
- Also modify: `practice/engine.js` (pool, openTerms), `settings/engine.js` (BACKUP_KEYS, PROGRESS_KEYS, RESET_KEYS), `shared/appbar.js` (LEARN_PAGES `'agent-career/'`), `privacy/text.js` + the s2.item2 row in the agent course design doc, `sw.js` (regenerated), `index.html` noscript, README.md/.en.md, LICENSE-CONTENT (`agent-career/lessons/`)
- Modify: `agent/lessons/08-growth.js` and both agent copy docs: the last connection becomes "상담사 첫걸음을 마쳤습니다. 다음은 상담사 커리어 라이프사이클에서 앞으로 지향할 수 있는 자리를 미리 알아보세요." / "You have finished Agent First Steps. Next, look ahead at the roles you can aim for in Agent Career Lifecycle."
- Modify: `codex/data/career.js` and `docs/superpowers/specs/2026-11-19-codex-one-pagers-copy-ko.md`: "Agent" → "상담사 (Agent)", "Team Lead (팀장)" → "팀장 (TL)", "Assistant Manager (부매니저)" → "부매니저 (AM)", "Operation Manager (매니저)" → "매니저 (OM)". English names stay.
- Test: `role.test.js`, `home.test.js`, `settings.test.js`, `privacy.test.js`, `sw.test.js`, `codex.test.js`, `tl-courses.test.js`

**Interfaces:**
- Consumes: Task 1's `AC_PROGRESS_KEY`, `AC_LESSONS`, `AC_UI.homeCard`.

- [ ] **Test step:** add or extend these tests.
  - The agent home's Learn order is `./agent/`, `./agent-career/`, the SOP soon card, then Excel.
  - SME/TL with `agent-career:v1` progress don't see it, but it counts as started.
  - A practice question from this course links to `../agent-career/#sme-0`.
  - Settings keys gain `agent-career:v1` (17 keys, reset 12); an old backup without it still restores.
  - The privacy row lists "상담사 커리어 라이프사이클" / "Agent Career Lifecycle".
  - sw has 22 pages.
  - Agent First Steps' last connection names 상담사 커리어 라이프사이클.
  - The Codex career matrix's Korean operation-team names are 상담사 (Agent), 직무전문가 (SME), 팀장 (TL), 부매니저 (AM), 매니저 (OM).
- [ ] **Verify RED:** `npm test` → the new assertions fail.
- [ ] **Code step:** wire every file above.
- [ ] **Verify GREEN:** `npm test` → all pass. Then `python3 tools/sw_list.py`, then `npm test` again.
- [ ] **Browser:** add checks to `browser_check.py`:
  - the agent Learn's second card opens `agent-career/`
  - `agent-career/#tl-3` shows a step
  - English has no Hangul
  - the ring at 320px has no overflow

  Run → ALL CHECKS PASSED.

### Task 3: Final review and report
- [ ] An opus reviewer reads the whole branch with the Review Focus above, and also judges the copy as a contact-center OM would.
- [ ] Re-grade the findings. Fix Critical/Important findings RED→GREEN. Ledger the minors.
- [ ] Add LOG entry 67 and report to the user before committing.
