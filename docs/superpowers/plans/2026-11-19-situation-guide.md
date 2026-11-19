# 팀장 상황별 길잡이 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `guide/`, one screen listing 17 team-lead situations in five groups; each opens to "먼저 볼 곳 / 이어서 볼 곳" links into existing topics.

**Architecture:** One data file (situations, groups, links) whose Korean is checked against the table in the design doc; a renderer reusing `codex/render/parts.js` (tabs, expandCard, chip); Codex routes gain `#<page>-<item>` deep links.

**Tech Stack:** Static files, vanilla JS ES modules; `node --test` + jsdom; Playwright browser check.

**Spec:** `docs/superpowers/specs/2026-11-19-situation-guide-design.md`

## Global Constraints

- Korean = the design doc §5 verbatim; English sentence by sentence, US spelling; link titles in English follow each target's own English title.
- Language key shared, default Korean; no new explanatory text beyond §5.
- Tests in `agent-lifecycle/tests/` (baseline 243). Commit/push/merge only after approval.

## Review Focus

1. Every link lands on a real place: lesson/SOP ids exist, codex item ids exist, glossary id exists. → Task 1 test, Task 3 browser check over all 34 links.
2. Codex deep links: `#teams-ta` opens with TA open; `#teams-3` and `#teams-nope` still open the list; existing `#teams` unchanged. → Task 2 tests.
3. Group chips: one at a time, arrow keys work, hidden groups are not reachable by Tab. → Task 1 render tests.
4. 320px English: long situation sentences wrap. → Task 3 check.
5. Language switch keeps the chosen group and open card. → Task 1 test.

---

### Task 1: Data and screen

**Files:** Create `guide/data.js`, `guide/render.js`, `guide/app.js`, `guide/index.html`, `guide/guide.css`; Test `agent-lifecycle/tests/guide.test.js`.

**Produces:** `GUIDE_UI` (`title, intro, all, first, then, hubCard`) and `GROUPS = [{ id, chip, heading, situations: [{ id: 's1'…, text, first: {title, href}, then: {title, href} }] }]` (ids `member, newcomer, customer, staffing, org`; 5/3/3/3/3); `renderGuide(root, lang, state)` with `state = { group: 'all', open: Set }`.

- [ ] **Step 1: Failing tests:** parity with the §5 table (number, group heading, situation, both link titles and addresses — addresses resolved to `../<path>`); chip labels and intro; every href's target exists (lesson ids from `LESSONS`, SOP ids from `SOP_LESSONS`, codex pages/items from codex data, glossary id from `TERMS`); render shows 6 chips and 17 cards; picking "고객·문의" leaves 3 cards and hides the other groups (`hidden`); opening card 9 shows two links with the §5 titles; language switch keeps group and open card; English has no Hangul.
- [ ] **Step 2–4:** run → FAIL, implement, run → pass.

### Task 2: Codex deep links

**Files:** Modify `codex/render/page.js`, `codex/app.js`; Test `agent-lifecycle/tests/codex.test.js` (append).

**Produces:** `parseCodexRoute(hash)` → `{ view, item? }`; `#teams-<teamId>` sets `state.team`, `#principles-<p1..p4>` adds to `state.principles`, `#daily-<roleId>` sets `state.dailyRole`; anything else after `-` → home.

- [ ] **Step 1: Failing tests:** `#teams-ta` → `{view:'teams', item:'ta'}`; `#teams-3`, `#teams-nope`, `#career-tl` → home; rendering with an item opens it.
- [ ] **Step 2–4:** run → FAIL, implement, run → pass (existing codex tests unchanged).

### Task 3: Hub, docs, browser check, review

**Files:** Modify `index.html` (card first), `README.md`, `LOG.md` (entry 15), `agent-lifecycle/scripts/browser_check.py`.

- [ ] **Step 1:** Checks: hub shows 7 cards with the guide first; each of the 34 links opens a page with an `h1` (and the codex deep links open the named item); chips by keyboard; 320/390/1280 in both languages without sideways scroll; screenshots (390, 1280, 320 English).
- [ ] **Step 2:** `npm test` → 0 fail; `browser_check.py` → `ALL CHECKS PASSED`.
- [ ] **Step 3:** Fresh-reviewer pass on the branch; fix Critical/Important test-first.
- [ ] **Step 4:** Ask for commit/push/PR approval and merge approval.
