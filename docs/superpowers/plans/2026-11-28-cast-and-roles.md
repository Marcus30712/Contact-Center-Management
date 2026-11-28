# 등장인물 줄 · 본문 직급 표시 · 영어 TL — Implementation Plan

**Goal:** Lessons show a cast row ("이름 (직급)") and render people in body text as role pills; English body says "TL", labels say "Team Leader".
**Architecture:** A pure module `shared/cast.js` holds the people table and turns a text into segments (plain text / role pill) per lesson; `agent-lifecycle/js/render/lesson.js` uses it for the cast row, captions, checkpoint texts and the connection line. Lesson files and copy docs keep names. The English TL wording is a copy change in lessons and docs.
**Tech Stack:** vanilla ES modules, node:test + jsdom, Playwright browser check.
**Spec:** `docs/superpowers/specs/2026-11-28-cast-and-roles-design.md`

## Global Constraints
- People table and colors exactly as the spec table; Miso and "당신" excluded; order = role order (Agent, Senior agent, SME, QA, Trainer, TL, AM, Manager), then first appearance.
- Body texts = step captions, checkpoint prompt/options/feedback/explanation, connection text. Titles/subtitles untouched by pills.
- Names inside straight or curly double quotes stay as names.
- A role shared by 2+ people in one lesson shows "name role" (ko `태오 팀장`, en `TL Taeo`).
- English: no lowercase "team leader" anywhere on the site; sentences use "TL"/"TLs"; labels (titles, subtitles, cards, headings, glossary term) use "Team Leader".
- Existing doc ↔ code word-for-word tests keep passing; all answer-cue guards keep passing.

## Review Focus
1. Korean particles after a replaced name: 은/는, 이/가, 을/를, 과/와, 으로/로, 이나/나, 이랑/랑, 아/야 — wrong particle reads badly (unit tests per pair).
2. False matches inside words (결정은, 지민원?) and names glued to role words ("수진 팀장", "하린 직무전문가", "Harin the SME", "Team Leader Sujin", "Sujin, the TL,") — must become one pill, no doubled role.
3. English article and capitalization: sentence-initial "The", possessive "Harin's" → "the SME's", existing "the"/"your"/"new"/"experienced" before the name.
4. Checkpoint option text with a pill must not change which option is longest for the answer-length guards (guards run on source text; pills are display only — assert unchanged).
5. Narrow screens (320px) and English: pills wrap with their particle, no Korean on English screens.

### Task 1: `shared/cast.js` — people and text segments
- Files: create `shared/cast.js`; test `agent-lifecycle/tests/cast.test.js`.
- Produces: `CAST` (people: id, name {ko,en}, role {ko,en}, roleKey, color); `castOf(lesson) → person[]`; `segments(text, lang, cast) → Array<string | { role: string, roleKey: string }>`.
- Steps: tests for each Review Focus 1–3 case and quotes → run, FAIL (module missing) → implement → PASS.

### Task 2: Review file of every transformed sentence (gate)
- Script `tools/cast_review.mjs` writes `docs/superpowers/reviews/2026-11-28-cast-transform-review.md`: per course/lesson, cast row and each changed sentence (before → after, ko and en).
- Send to the user; apply their fixes (rule change or per-sentence exception list in `shared/cast.js`) before Task 3.

### Task 3: Lesson screen
- Files: `agent-lifecycle/js/render/lesson.js`, its CSS; tests in the lesson render tests; `browser_check.py`.
- Cast row under the subtitle in both views (`[data-cast]`, label 등장인물 / People), pills `[data-role-pill]` with a nowrap wrapper including the following particle.
- Steps: render tests (cast row content, pill text, particle, quotes untouched, English) → FAIL → implement → PASS; browser check at 320px.

### Task 4: English TL / Team Leader copy
- Lessons, review quizzes, guides, Codex, home/UI strings and their copy docs: sentences "team leader(s)" → "TL(s)"; labels → "Team Leader(s)".
- Guard test: no `/\bteam leader/` (lowercase) in any English string the site ships; labels list uses "Team Leader".
- Steps: guard test FAIL → change → `npm test` PASS (doc ↔ code, answer cues).

### Task 5: Finish
- `tools/sw_list.py`, LOG 88, full `npm test`, browser check, opus whole-branch review, report before commit.
