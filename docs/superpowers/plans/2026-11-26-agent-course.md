# 상담사 첫걸음 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the 8-lesson "상담사 첫걸음 / Agent First Steps" course and make it the agent role's first Learn card.

**Architecture:** A copy of the 팀장 첫걸음 list course (`tl/`), as `agent/`. Lesson files are generated from the approved copy docs by the scratch generator, and every role wiring point gets an `agent` entry.

**Tech Stack:** Static vanilla ES modules, node:test + jsdom, Playwright browser check, `tools/sw_list.py`.

**Spec:** `docs/superpowers/specs/2026-11-26-agent-course-design.md`. Copy: `2026-11-26-agent-course-copy-ko.md` and `.en.md`.

## Global Constraints
- Folder `agent/`, course key `agent`, progress key `agent-course:v1`, lesson ids: start, training, nesting, golive, customers, review, attendance, growth.
- personaName is the default (지민 / Jimin) for all 8 lessons.
- Lesson rules are the same as 팀장 첫걸음:
  - 6–12 steps, ≤3 sentences per step, English never more sentences than Korean
  - a figure needs "예시"/"Example"
  - the stage-highlight sentence "첫/둘째/셋째/넷째 단계는"
  - 2 checkpoint questions, with feedback on every wrong option
- Korean text names roles in Korean (korean-role-names test). English text has no Hangul.
- Only the agent role sees the course. The 상담사 SOP library and the Guide stay "coming soon". The agent review quiz is not added.

## Review Focus
1. Another role (SME/TL/AM/OM) with `agent-course:v1` progress must not show the course in Learn or 내 학습. It still counts as "started", like other cross-role progress (see the ledger Ruling). Test in Task 2.
2. Odd addresses: `agent/#start-99`, `#nope` and `#coaching-3` open the list or lesson 1 with no error, in both languages. Test in Task 1.
3. A Today's Practice question from an agent lesson links to `../agent/#<id>-0`, not the lifecycle course that shares nothing. Test in Task 2.
4. Backup, restore and reset include `agent-course:v1`, and old backups without it still restore. Test in Task 2.
5. The agent's first-visit note points to `./agent/#start-0`. Other roles' notes are unchanged. Test in Task 2.

---

### Task 1: The course itself (`agent/`)

**Files:**
- Create: `agent/ui.js`, `agent/lessons/01-start.js` … `08-growth.js`, `agent/lessons/index.js`, `agent/home.js`, `agent/app.js`, `agent/index.html`
- Modify: `/tmp/gen/gen_course.py` (add an `agent` entry), `agent-lifecycle/tests/tl-courses.test.js` (add the agent course to its course loop)

**Interfaces:**
- Produces:
  - `AGENT_PROGRESS_KEY = 'agent-course:v1'`
  - `AGENT_UI` (title, intro, homeCard, figuresNote, startNote, buttons; checkpoint label 상담사 체크포인트 / Agent checkpoint)
  - `AGENT_LESSONS` (8 lessons)
  - `renderAgentHome(root, lessons, progress, lang)`

- [ ] **Test step:** add `{ id: 'agent', lessons: AGENT_LESSONS, ui: AGENT_UI, ko: '2026-11-26-agent-course-copy-ko.md', en: '…en.md', dir: 'agent/' }` to the course loop in tl-courses.test.js. This runs the same checks for the new course:
  - validateCourse, order, word-for-word copy, feedback, highlights, personas, sentence counts
  - list home, addresses, practice link
- [ ] **Verify RED:** `cd agent-lifecycle && node --test tests/tl-courses.test.js` → fails, because `agent/ui.js` cannot be found.
- [ ] **Code step:** copy `tl/` to `agent/`, swapping names and keys. Generate the lessons with `python3 /tmp/gen/gen_course.py . agent`.
- [ ] **Verify GREEN:** the same command passes.

### Task 2: Wire the agent role

**Files:**
- Modify: `shared/courses.js` (COURSE_INFO.agent), `shared/role.js` (`COURSE_ROLES` + 'agent', `ROLE_COURSES.agent = ['agent']`), `home/role-home.js` (agent learn: real card replaces `soon('first-steps')`), `home/data.js` (LEARN entry), `home/render.js` (COURSES order, agent start note)
- Also modify: `practice/engine.js` (pool, openTerms), `settings/engine.js` (BACKUP_KEYS, PROGRESS_KEYS, RESET_KEYS), `shared/appbar.js` (LEARN_PAGES 'agent/'), `privacy/text.js` + the s2.item2 doc row, `sw.js` (regenerated), `index.html` noscript, README.md/.en.md, LICENSE-CONTENT (`agent/lessons/`)
- Test: `role.test.js`, `home.test.js`, `settings.test.js`, `privacy.test.js`, `sw.test.js`

**Interfaces:**
- Consumes: Task 1's `AGENT_PROGRESS_KEY`, `AGENT_LESSONS`, `AGENT_UI.startNote`.

- [ ] **Test step:** add or extend these tests.
  - The agent home's Learn shows `./agent/`, then the SOP soon card, then Excel.
  - The agent start note links to `./agent/#start-0`.
  - SME/TL with agent progress don't see it.
  - Settings keys gain `agent-course:v1` (16 keys, reset 11).
  - The privacy row lists "상담사 첫걸음" / "Agent First Steps".
  - sw has 21 pages.
- [ ] **Verify RED:** `npm test` → the new assertions fail.
- [ ] **Code step:** wire every file above.
- [ ] **Verify GREEN:** `npm test` → all pass. Then `python3 tools/sw_list.py`, then `npm test` again.
- [ ] **Browser:** add agent checks to `browser_check.py`:
  - the agent Learn card opens `agent/`
  - `agent/#golive-3` shows a step
  - English has no Hangul
  - 320px has no overflow

  Run → ALL CHECKS PASSED.

### Task 3: Final review and report
- [ ] An opus reviewer reads the whole branch with the Review Focus above, and also judges the copy as a contact-center OM would.
- [ ] Re-grade the findings. Fix Critical/Important findings RED→GREEN. Ledger the minors.
- [ ] Add LOG entry 65 and report to the user before committing.
