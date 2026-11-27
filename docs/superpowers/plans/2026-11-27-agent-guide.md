# Agent Situation Guide Implementation Plan

**Goal:** Add `agent-guide/` (16 situations, 5 groups) for the agent role, opened from the agent home card and the agent's bottom-menu Guide.
**Architecture:** Copy of `sme-guide/` (data + app + index.html) on the shared `guide/render.js`; `guide/link.js` also knows `a…` situations so agent lessons opened from the guide end with the "then" card.
**Spec:** `docs/superpowers/specs/2026-11-27-agent-guide-design.md` (approved 2026-11-27, ko + en).

## Global Constraints
- Situation ids `a1`–`a16`; group ids `start, customers, system, score, growth`.
- Link names = destination titles (lesson: course + 레슨 n + title; SOP: 상담사 SOP · title); no Codex career matrix.
- TL, SME, AM, OM guides and homes unchanged.

## Review Focus
1. `?guide=a…` on a lesson that is not the situation's first link shows no card (test: guideFor).
2. AM/OM still get `guide/` from the bottom menu (appbar test).
3. Every href resolves to a real lesson or `codex/#daily-agent` (link test).
4. English page has no Korean after opening every card (test).
5. Offline list holds the new page (sw test count 24).

### Task 1: The page — Files: `agent-guide/{data,app}.js`, `agent-guide/index.html`, test `agent-lifecycle/tests/agent-guide.test.js` (modeled on sme-guide.test.js). RED → build → GREEN.
### Task 2: Wiring — `guide/link.js`, `shared/appbar.js` (GUIDE_PAGES, GUIDE_FOR.agent), `home/role-home.js` (agent guide card), tests (home, appbar, role-switch, sw), `sw.js`, `index.html` noscript, READMEs, browser check. RED → wire → `npm test` + browser check.
### Task 3: Final review (opus), LOG 73, report before commit.
