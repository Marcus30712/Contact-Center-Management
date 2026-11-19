# Codex 원페이저 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `codex/`, a topic with four one-pagers (optimization principles, five teams, career matrix, daily role guide) that show a summary first and expand on click, in Korean and English.

**Architecture:** Content lives in four data files generated once from the confirmed Korean copy plus English, and a test re-parses the copy file to keep them identical. Shared parts (tabs, expandable card, chip, before/after links) are one small module; each one-pager has its own renderer. Routing is hash-based (`#home`, `#principles`, `#teams`, `#career`, `#daily`), reusing the site's language toggle and styles.

**Tech Stack:** Static files, vanilla JS ES modules, CSS; `node --test` + jsdom; Playwright browser check.

**Spec:** `docs/superpowers/specs/2026-11-19-codex-one-pagers-design.md` · confirmed copy: `docs/superpowers/specs/2026-11-19-codex-one-pagers-copy-ko.md`

## Global Constraints

- No build step, no new dependencies, relative paths only. Tests in `agent-lifecycle/tests/` (baseline 220 passing).
- Korean is the confirmed copy file verbatim (🟦 marks removed). English follows sentence by sentence, US spelling; names Codex already writes in English (job titles, KPI names) stay as written.
- Pip Decks: ideas only — no text, illustrations, layout or names from the decks.
- Shrinkage = the confirmed definition; no country-specific law; no "진상"; explanatory strings ≤ 3 sentences.
- Figures: schedule times, time shares and promotion conditions are covered by the per-page "예시" notes; any other string with a digit + `%`/분/명/초/점 needs "예시"/"Example".
- Language key shared (`agent-lifecycle-course:lang`), default Korean. Markers "당신의 팀" (Operation team) and "지금 당신" (Team Lead) are data settings.
- One team open at a time on ②; ① has expand-all / collapse-all; ④ defaults to the Team Lead tab, ③ to the Operation team.
- Commit/push/merge only after the user's approval; branch `codex-one-pagers`.

## Review Focus

1. Daily schedule integrity: every role's blocks run 09:00–18:00 without gaps or overlaps; bar widths match durations; "그 밖의 업무" blocks have no list entry and do not break the linked highlight. → Task 1 data test, Task 3 render test.
2. Keyboard and screen reader: tabs move with arrow keys and report `aria-pressed`; expandable cards are buttons with `aria-expanded` + `aria-controls`; schedule blocks read "09:00–09:30, 팀 허들 주관". → Task 2 parts tests, Task 3 tests.
3. 320px in English: long English job titles and KPI names wrap rather than overflow; the day bar stays readable (labels move into the list below on narrow screens). → Task 4 check.
4. Unknown hash (`#nope`, `#teams-3`) opens the list; switching language keeps the current one-pager and open card. → Task 3 test, Task 4 check.
5. Glossary and cross-topic links resolve (glossary ids exist; lesson/SOP/lab URLs exist). → Task 1 test, Task 4 check.

---

### Task 1: Data files

**Files:** Create `codex/data/principles.js`, `teams.js`, `career.js`, `daily.js`, `links.js`, `codex/ui.js`; Test `agent-lifecycle/tests/codex.test.js`.

**Produces:**
- `PRINCIPLES = { intro, note, items: [{ id, title, problem, fix, example }] }` (4)
- `TEAMS = { intro, yours: 'operation', items: [{ id, name, mission, roles: [string], kpis: [{ name, def, why, glossary? }], flow: [text] }] }` (5, order TA, T&D, Operation, WFM, HR)
- `CAREER = { definition, uses: [{ label, text }], note, you: { team: 'operation', level: 'tl' }, teams: [{ id, name, levels: [{ id, name, role, skills: { work: [text], soft?: [text] }, next? }] }] }` (5 teams; levels 5/3/3/3/3; top level has no `next`)
- `DAILY = { intro, notes: [text, text], defaultRole: 'tl', roles: [{ id, name, tasks: [{ n, tag, name, freq, share, outputs }], schedule: [{ from, to, task: n | 'lunch' | 'other', text }] }] }` (5 roles × 4 tasks)
- `LINKS = { principles: [{ dir: 'before'|'after', href, title, why }], teams, career, daily }`
- `CODEX_UI` (`title, tagline, source, home, expandAll, collapseAll, yourTeam, youAreHere, glossaryLink, before, after, mission, roles, kpis, flow, coreRole, skillsWork, skillsSoft, nextStep, frequency, share, outputs, lunch, other, problem, fix, example`) and `PAGES = [{ id, title, blurb }]` (4).
- Every user-facing string is `{ ko, en }`; glossary ids: CSAT `csat`, QS `quality-score`, AHT `aht`, SLA `sla`, Forecast Accuracy `forecast-accuracy`, Schedule Adherence `schedule-adherence`, Shrinkage `shrinkage`, Occupancy `occupancy`, Attrition `attrition`.

- [ ] **Step 1: Failing tests** in `codex.test.js`:
  - counts as above; ids unique; one team/level match the `yours`/`you` settings; `defaultRole` exists.
  - **copy parity:** parse the copy file (sections `## ①…④`, `###`/`####` headings, `- 키: 값` lines, `KPI: a | b | c`, `업무: n [tag] name | freq | share | outputs`, `일정: from–to | n/점심/그 밖 | text`, `## 앞/뒤 링크` lines, the `화면 문구` table) and assert every Korean string equals the data.
  - schedule: each role starts 09:00, ends 18:00, each block's `from` = previous `to`; exactly one lunch; `task` numbers exist; shares parse to integers summing to 100.
  - content rules (both languages): banned word, ≤ 3 sentences, figure rule with the stated exemptions (`schedule.*`, `share`, `next`, `freq`); no "노동법"; Shrinkage def equals the glossary's Korean definition; English has no Hangul and no "licence/organisation/behaviour".
  - links: glossary ids exist in `TERMS`; every `LINKS.*.href` is one of `#principles|#teams|#career|#daily`, `../sop-library/#home`, `../sop-library/#coaching-0`, `../staffing-calculator/`, `../agent-lifecycle/#career-0`.
- [ ] **Step 2:** `npm test` → FAIL (modules missing).
- [ ] **Step 3:** Write the data (Korean generated from the copy file by a throwaway script, English written alongside).
- [ ] **Step 4:** `npm test` → pass.

### Task 2: Shared parts

**Files:** Create `codex/render/parts.js`; Test `codex.test.js`.

**Produces (all take `tr` = `(text) => string`):**
- `tabs(items: [{id, label}], current, onSelect) → HTMLElement` — `div[role=group]` of buttons with `data-tab`, `aria-pressed`; ArrowLeft/Right/Home/End move focus and select.
- `expandCard({ id, chip?, number?, title, summary?, body: HTMLElement[], open, onToggle }) → HTMLElement` — `button[aria-expanded][aria-controls]` header, region `[data-body]` hidden when closed.
- `chip(text, kind) → HTMLElement` — text label plus `data-kind` for colour.
- `flow(steps: string[]) → HTMLElement` — `ol.flow` with numbered circles; arrows are CSS, not text.
- `relatedLinks(links, tr, ui) → HTMLElement` — two groups "앞에 보면 좋은 것 / 다음에 보면 좋은 것", each link with title and one-line reason; a group is omitted when empty.

- [ ] **Step 1: Failing tests:** tab arrow keys move selection and call `onSelect`; `expandCard` toggles `aria-expanded` and `hidden`; `flow` renders n `li`; `relatedLinks` omits an empty group and renders hrefs.
- [ ] **Step 2–4:** run → FAIL, implement, run → pass.

### Task 3: One-pager screens and app

**Files:** Create `codex/render/principles.js`, `teams.js`, `career.js`, `daily.js`, `codex/render/home.js`, `codex/app.js`, `codex/index.html`, `codex/codex.css`; Test `codex.test.js`.

**Produces:** `renderPrinciples(root, lang, state)`, `renderTeams(...)`, `renderCareer(...)`, `renderDaily(...)`, `renderCodexHome(root, lang)`; each page renders: page tabs (4) + "목록" link, title, intro/notes, body, `relatedLinks`. `state` keeps open card / selected tab so a language switch restores it.

- [ ] **Step 1: Failing tests:**
  - home: four cards in order with blurbs, hrefs `#principles` …; source line names Marcus Shim.
  - ①: 4 closed cards; clicking one opens problem/fix/example; expand-all opens all, collapse-all closes all.
  - ②: 5 team cards, Operation card carries "당신의 팀"; opening TA then WFM leaves only WFM open; WFM detail has 4 KPIs with glossary links where set and a 5-step flow.
  - ③: default team Operation with 5 levels bottom-up and "지금 당신" on Team Lead; selecting OM shows no "다음 단계로"; switching to HR shows 3 levels and "노동 관련 법·제도 이해".
  - ④: default tab 팀장; bar has 8 blocks whose widths sum to 100% and lunch styled apart; clicking the 10:30–12:30 block highlights task 1 in the list and shows its frequency/share/outputs; AM's 17:30 block is "그 밖의 업무" and highlights nothing in the list; the two notes are present.
  - English render of each page has no Hangul.
  - `parseCodexRoute('#nope')` → home; `#teams-3` → home.
- [ ] **Step 2–4:** run → FAIL, implement, run → pass.

### Task 4: Hub, docs, browser check

**Files:** Modify `index.html` (card after SOP Library), `README.md`, `LOG.md` (entry 14, plus 2nd SOP copy now 확정), `agent-lifecycle/scripts/browser_check.py`.

- [ ] **Step 1:** Browser checks: hub shows 6 cards and the Codex card opens `codex/`; each one-pager opens by tab and by address; ① expand-all; ② one-open rule; ③ team tabs by keyboard; ④ block click highlights list; no sideways scroll at 320/390/1280 in Korean and English for all four pages; language follows the shared setting and keeps the open card; blocked storage still works; each related link and glossary link lands on an existing page; screenshots of each page (390, 1280, one English 320, one dark) — look at them.
- [ ] **Step 2:** `npm test` → 0 fail; `browser_check.py` → `ALL CHECKS PASSED`.
- [ ] **Step 3:** Whole-branch review by a fresh reviewer; fix Critical/Important test-first.
- [ ] **Step 4:** Ask the user for commit/push/PR approval and, separately, merge approval.
