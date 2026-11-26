# 콘텐츠 검수 반영 (1단계) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved content-review fixes to every 상담사, 직무전문가 and 팀장 course, except the answer-length rewrites (2단계).

**Architecture:** Copy edits only, plus the tests that pin the copy. Courses with approved copy docs change the doc and the lesson file together, so the word-for-word tests stay green. 상담사 라이프사이클 and 팀장 SOP have no copy doc; their lesson files are the source. The work splits into four tasks that own disjoint files, so they can run in parallel.

**Tech Stack:** Static vanilla ES modules, node:test + jsdom, Playwright browser check, `tools/sw_list.py`.

**Spec:** `docs/superpowers/reviews/2026-11-26-content-review.md` (the review, with each finding's proposed copy), plus the decisions below (user, 2026-11-26).

## Decisions (user, 2026-11-26) — binding
1. **신입의 순서 (사이트 전체): 교육 → OJT → 네스팅 → 수료 → 실전 배치.** 수료는 네스팅이 끝날 때입니다. 실전 배치는 수료 뒤 정식 팀에 합류해 혼자 받는 때입니다. 상담사 라이프사이클 레슨 3 제목은 "OJT 및 네스팅 / OJT and Nesting"이 됩니다. 이 순서와 다른 문장(수료 뒤 네스팅, 수료 전에 OJT만, 교육 직후 실전 배치/실전 투입 등)은 모두 고칩니다. 리뷰 파일의 결정 1 관련 제안 문안은 "수료 → 네스팅"을 전제로 쓴 것이 있으니, 이 순서에 맞게 다시 씁니다.
2. **지민:** 영어 대명사는 모두 she/her. 팀장 SOP "기존 상담사 육성"(nurture)은 "QA로 옮기기 전" 시점임을 밝힙니다. 상담사 라이프사이클 기술지원 트랙의 두 질문(coaching-tech, coaching-tech-2)은 주인공을 "팀원 한 명"으로 바꿉니다.
3. **정답 길이:** 이번에는 하지 않습니다(2단계, 강의별 승인). 리뷰에서 정답 길이만을 위한 제안은 건너뜁니다. 다른 이유가 있는 보기 수정(뜻이 틀림, 단계 수가 다름 등)은 이번에 합니다.
4. **용어:** 캘리브레이션 · 트레이너 · 팀장(EN team leader) · 매니저 · 플로어 서포트 · 보류(통화) · 녹취 · 평균 처리 시간(AHT).
5. **누가 정하나:** 수료는 트레이너와 팀장이 함께. 버디·멘토 지정은 팀장. PIP는 성과 문제에만; 근태·행동은 근태 규정과 인사 절차.
6. **상담사 커리어 라이프사이클 소개:** "네 자리는 꼭 차례대로 거치는 사다리가 아니라 각자 다른 길입니다. 팀장은 대개 직무전문가를 거쳐 갑니다."를 넣고, "1년쯤"에 "(예시)"를 붙입니다.
7. **나머지 항목:** 리뷰 파일의 높음·중간·낮음 항목을 모두 반영합니다(정답 길이 전용 제안 제외). 사용자가 직접 쓴 표현(예: 사용자 요청으로 넣은 문구)을 바꾸는 항목은 바꾸되 변경 목록에 표시합니다.

## Global Constraints
- 스텝 6~12개, 스텝당 3문장 이내, 영어 문장 수 ≤ 한국어, 출처 없는 숫자에 "예시"/"Example", 단계 문장 "첫/둘째/셋째/넷째 단계는 …"과 노드 강조, 체크포인트 2문항, 오답마다 피드백, 정답에는 피드백 없음.
- 한국어 문장 속 직급은 한국어(korean-role-names 테스트). 영어에는 한글 없음.
- 문안 문서가 있는 강의는 문서와 레슨 파일을 글자 그대로 같게 유지합니다. 레슨 id, 질문 id, 보기 id, 정답 id는 바꾸지 않습니다(진도·오답 기록이 이 id에 걸려 있음).
- 레슨 수, 스텝의 노드 강조 구조는 필요한 경우가 아니면 바꾸지 않습니다.
- 각 Task는 자기 파일만 고칩니다. 다른 Task의 파일이 고쳐져야 하면 고치지 말고 보고서에 적습니다.

## Review Focus
1. 순서 문장: 모든 강의에서 "수료"가 네스팅 뒤, "실전 배치"가 수료 뒤에 옵니다. `grep -n "수료\|실전 배치\|실전 투입\|graduat\|Go Live"`로 Task마다 확인.
2. id 보존: 질문·보기·정답 id가 그대로라 기존 진도와 오답 기록이 유지됩니다.
3. 영어의 지민이 he/him/his로 남은 곳이 없습니다(`grep -nw "he\|him\|his"` 후 지민 문맥 확인).
4. 용어 표가 지켜집니다: 교정 회의, 교육 강사, 팀 리더, team lead(r 없는), 운영 관리자, 플로어 워킹, 콜 레코딩이 남지 않습니다.
5. 고친 문장도 사이트 규칙(3문장, 예시, 영어 문장 수)을 지킵니다 — 각 강의의 기존 규칙 테스트가 확인합니다.

---

### Task A: 상담사 (상담사 첫걸음, 상담사 커리어 라이프사이클, 상담사 홈 문구)
**Files:** `agent/**`, `agent-career/**`, `docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md`/`.en.md`, `2026-11-26-agent-career-copy-ko.md`/`.en.md`, `home/role-home.js`(상담사·공통 준비 중 문구만), `practice/data.js`(배지 문구만). Tests: `tl-courses.test.js`(agent 부분), `agent-career.test.js`, `home.test.js`, `practice-*.test.js`.
- [ ] 리뷰 "상세 — 상담사"의 모든 항목과 결정 1·4·6을 반영합니다. 실전 배치 앞에 수료가 오도록(상담사 첫걸음 레슨 1 스텝 5·6, 레슨 3 연결 등) 문장을 고칩니다.
- [ ] 검증: `cd agent-lifecycle && node --test tests/tl-courses.test.js tests/agent-career.test.js tests/home.test.js tests/practice-copy.test.js tests/practice-render.test.js tests/korean-role-names.test.js` → 모두 통과.

### Task B: 직무전문가 (첫걸음, 서포트 라이프사이클, SOP, 길잡이)
**Files:** `sme/**`, `sme-lifecycle/**`, `sme-sop/**`, `sme-guide/**`, 각 문안 문서(`2026-11-25-sme-course-*`, `sme-lifecycle-*`, `sme-sop-*`). Tests: `sme.test.js`, `sme-lifecycle.test.js`, `sme-sop.test.js`, `sme-guide.test.js`.
- [ ] 리뷰 "상세 — 직무전문가"의 모든 항목(복습 퀴즈 항목 제외 — Task C 담당)과 결정 1·2·4·5를 반영합니다. 서포트 라이프사이클 레슨 1·2는 "OJT → 네스팅 → 수료" 순서로 다시 씁니다(수료 판단은 네스팅 끝, 트레이너와 팀장).
- [ ] 첫걸음 마지막 연결 문구를 직무전문가 서포트 라이프사이클·직무전문가 SOP로 바꿉니다.
- [ ] 검증: `node --test tests/sme.test.js tests/sme-lifecycle.test.js tests/sme-sop.test.js tests/sme-guide.test.js tests/korean-role-names.test.js` → 모두 통과.

### Task C: 팀장 1부 (팀장 첫걸음, 팀장 서포트, 팀장 길잡이, 복습 퀴즈 전체)
**Files:** `tl/**`, `tl-support/**`, `guide/**`, `review/data.js`, 문안 문서(`2026-11-25-tl-course-*`, `tl-support-*`, `review-quiz-*`). Tests: `tl-courses.test.js`(tl·tl-support 부분), `guide.test.js`, `review.test.js`.
- [ ] 리뷰 "상세 — 팀장 1부"의 모든 항목, "상세 — 직무전문가"의 복습 퀴즈 항목(sme-q1, sme-q2, sme-q5, 관련 레슨 제목, 대명사), 결정 1·2·4·5를 반영합니다.
- [ ] 길잡이의 상담사 라이프사이클 레슨 3 제목을 "라이프사이클 레슨 3 · OJT 및 네스팅 / Lifecycle lesson 3 · OJT and Nesting"으로 바꿉니다.
- [ ] 검증: `node --test tests/tl-courses.test.js tests/guide.test.js tests/review.test.js tests/korean-role-names.test.js` → 모두 통과.

### Task D: 팀장 2부 (상담사 라이프사이클, 팀장 SOP 라이브러리, 용어집)
**Files:** `agent-lifecycle/js/lessons/**`, `sop-library/lessons/**`, `glossary/terms.js`, 참고 문안 `2026-11-19-sop-library-copy-ko.md`·`-2-copy-ko.md`(테스트가 대조하면 함께). Tests: `lessons.test.js`, `sop.test.js`, `glossary.test.js`, `track.test.js`.
- [ ] 리뷰 "상세 — 팀장 2부"의 모든 항목과 결정 1·2·4·5를 반영합니다. 레슨 3 제목은 "OJT 및 네스팅 / OJT and Nesting", 노드와 스텝 순서는 OJT → 네스팅 → 수료. `lessons.test.js`의 제목 테스트를 새 제목으로 바꿉니다.
- [ ] 검증: `node --test tests/lessons.test.js tests/sop.test.js tests/glossary.test.js tests/track.test.js tests/korean-role-names.test.js` → 모두 통과.

### Task E: 통합과 마무리 (컨트롤러)
- [ ] 네 Task의 보고서에서 "다른 Task 파일" 항목을 모아 반영합니다.
- [ ] `python3 tools/sw_list.py` → `npm test` 전체 통과 → 브라우저 점검 ALL CHECKS PASSED.
- [ ] Review Focus 1·3·4 grep을 레포 전체에 돌립니다.
- [ ] 새 리뷰어(opus)가 전체 변경을 읽고 판정합니다. 높음·중간 지적은 고치고 다시 테스트합니다.
- [ ] 변경 목록(바꾼 문장 전·후)을 `docs/superpowers/reviews/2026-11-26-content-fixes-changes.md`로 남기고, LOG 68을 쓰고, 커밋 전에 보고합니다.
