# Agent Review Quiz Implementation Plan

> For agentic workers: executed inline (superpowers:executing-plans), TDD per task.

**Goal:** Add the agent review quiz (6 scenario questions). It opens for anyone who has finished all of Agent First Steps (8) and the Agent SOP Library (8). Passing it gives the badge "상담사 과정 완주" (`review-agent`).

**Architecture:** The review page is already built per role.
- The agent becomes a third quiz role: `QUIZ_ROLES`, `REVIEW_COURSES`, `QUIZZES.agent`.
- `practice/` gains one badge.
- The home quiz card and the result screen already work for any role in `QUIZ_ROLES`.

**Tech Stack:** Vanilla ES modules, node:test + jsdom, Playwright browser check.

**Spec:** `docs/superpowers/specs/2026-11-27-agent-review-quiz-copy-ko.md` and `.en.md`, both approved 2026-11-27. The design follows `2026-11-25-role-review-quiz-design.md`.

## Global Constraints
- **Quiz:** 6 questions, 3 options each, pass mark 5. Stored in the same key, `queuecraft:review:v1`, under `agent`.
- **Copy:** Korean and English match the copy docs word for word.
- **Unchanged:** the TL and SME quizzes, and their records.
- **Badge order:** `review-agent` goes after `review-sme`, so there are 13 badges.

## Review Focus
1. An agent who has finished First Steps but not the SOP lessons sees the quiz locked. The lock shows the number of lessons left and links to the first SOP lesson. (Task 1 unlock test)
2. An old saved record without `agent` still loads. A record like `agent: 99/6` is ignored. (Task 1 loadReview test)
3. On the review page, an agent sees the agent quiz first. TL and SME still see their own quiz first. (Task 1 order test)
4. A non-agent who finishes both agent courses can still open the agent quiz, because roles never block a quiz. (Task 1)
5. The answer-length and reason-balance guards cover the new questions. (They already read every entry in `QUIZZES`.)

### Task 1: The quiz
- **Files**
  - Modify `review/data.js`: add `REVIEW_UI.nameAgent` and `scopeAgent`, and `QUIZZES.agent`.
  - Modify `review/engine.js`: `QUIZ_ROLES = ['tl', 'sme', 'agent']`.
  - Modify `shared/role.js`: `REVIEW_COURSES.agent = ['agent', 'agent-sop']`.
  - Create the test `agent-lifecycle/tests/agent-review.test.js`.
- **Test** (written first)
  - The Korean and English text matches the copy docs.
  - The quiz opens only after all 16 lessons; until then the lock shows how many are left and links to the next lesson.
  - Records and best scores load and save correctly.
  - The agent quiz comes first for agents.
  - Every related-lesson link exists, and its name is the real lesson title.
- **Run:** `node --test tests/agent-review.test.js`. It fails first (RED), then passes after the data is added (GREEN).

### Task 2: Badge and wiring
- `practice/data.js` and `practice/engine.js`: badge `review-agent`, with `ctx.reviewAgent`.
- README: "배지 12개" becomes "배지 13개" in Korean, and the matching line in English.
- Tests: practice badge list and count; the home quiz card for an agent.
- Browser check: an agent finishes both courses, the home card appears, the quiz runs, and the badge shows on pass.
- **Run:** `npm test` (full suite) and `python3 agent-lifecycle/scripts/browser_check.py`. Expect ALL CHECKS PASSED.

### Task 3: Final review and report
- A fresh opus reviewer checks the whole branch. Important findings get fixed first, test first.
- LOG 74 is written as "커밋 전 보고".
- Report in Korean, then wait for "푸시".
