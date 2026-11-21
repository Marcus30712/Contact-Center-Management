# SOP 라이브러리: 스크러빙 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SOP 라이브러리에 "스크러빙" 레슨을 팀장 절차 2번째로 넣고, 연결 문안·홈 카드·용어집을 맞춘다.

**Architecture:** 새 레슨 파일 `sop-library/lessons/08-scrubbing.js`(파일 번호는 추가 순서, 보여 주는 순서는 `index.js` 배열)를 기존 레슨과 같은 `tx/node/edge/step/option` 틀로 쓴다. 문안은 설계 문서의 `## 레슨 2. 스크러빙` 절과 표를 테스트가 대조한다.

**Tech Stack:** vanilla ES modules, `node --test` + jsdom, Playwright `browser_check.py`.

**Spec:** `docs/superpowers/specs/2026-11-21-sop-scrubbing-design.md`

## Global Constraints

- 한국어는 설계 문서와 글자 하나까지 같다. 캡션은 3문장 이하. 수치는 "예시".
- 영어는 한국어를 따른다: 한글 없음, 오답 피드백 영어에 곧은 작은따옴표(') 금지(’ 사용), 기존 영어 용어(team leader, SME, QA, OM, DSAT, CSAT, SLA)와 같게.
- 사람: 지민(PIP 레슨만 도윤). 고객사·회사·도구 이름 없음.
- 순서: escalation, scrubbing, coaching, pip, calibration, onboarding, incident, launch. 진도 키·레슨 id는 그대로.
- 확인: `cd agent-lifecycle && npm test` 0 fail, `python3 tools/sw_list.py`, browser check `ALL CHECKS PASSED`.

## Review Focus

1. **이미 일곱 레슨을 다 마친 사람:** 홈 "내 학습"이 다 마침이 아니라 다음 레슨으로 스크러빙을 보여야 한다. → Task 2 home test.
2. **흐름도 겹침·영역 밖:** 세 갈래 상자가 그림 안에 있고 겹치지 않는다. → 기존 `every box sits inside the picture` 테스트가 새 레슨까지 덮음, Task 3 스크린샷.
3. **오늘의 연습:** 새 확인 문제 두 개가 연습 문제 풀에 들어가고 오답 피드백이 나온다. → Task 2 practice test.
4. **영어 화면:** 레슨 전체가 영어로 나온다. → 기존 `the course strings are in both languages`.
5. **에스컬레이션을 마친 사람:** 다음 레슨 링크가 스크러빙으로 간다. → Task 2 home test (`next.id`).

---

### Task 1: 레슨과 문안 대조

**Files:** Create `sop-library/lessons/08-scrubbing.js`; Modify `sop-library/lessons/index.js`, `01-escalation.js`, `04-calibration.js`, `07-launch.js` (다음으로 문안), `docs/superpowers/specs/2026-11-21-sop-scrubbing-design.md`(오답 피드백 표에 English 열 추가, 바뀌는 문안 표의 영어), `agent-lifecycle/tests/sop.test.js`

**Interfaces:** Produces lesson `{ id: 'scrubbing', group: 'leader', procedure: ['pick','classify','rca','discuss','report'], ... }`, checkpoint ids `scrubbing-q1`, `scrubbing-q2`.

- [ ] **Step 1: 실패하는 테스트 (sop.test.js)**
  - `COPY_FILES`에 새 설계 문서를 더하고, 문안 대조를 순서가 아니라 **제목으로 짝지어** 비교하도록 바꾼다(문안 파일 순서와 레슨 순서가 달라짐).
  - 레슨 수 8, id 순서(위 Global Constraints), 단계 수 `[10, 11, 11, 11, 11, 11, 11, 10]`, group `['leader'×5, 'cross'×3]`, `validateCourse(... lessonCount: 8 ...)`.
  - `PROCEDURES.scrubbing = ['대상 고르기', 'L1·L2 분류', '원인 분석(RCA)', '내부 토의', '보고 및 건의']`, `EXTRAS.scrubbing = ['개선점 보고', '인사이트 공유', '해결 또는 건의']`.
  - 오답 피드백 테스트가 두 문서(기존 + 새 설계)의 표를 읽어 행 32개.
  - 연결: escalation→scrubbing→coaching, 문안은 설계 문서의 "바뀌는 기존 문안" 표와 같다(캘리브레이션·론칭은 앞부분 바뀐 문장 포함 여부).
  - 목록 화면 테스트(`the list shows the seven SOPs…`)를 여덟으로.
- [ ] **Step 2:** `npm test` → 위 테스트 FAIL
- [ ] **Step 3:** 레슨 파일 작성(세 갈래 상자는 `report` 오른쪽/아래에 배치, 기존 레슨의 좌표 방식), index 순서, 세 레슨의 다음으로 문안, 영어 작성.
- [ ] **Step 4:** `npm test`(sop.test.js) PASS

### Task 2: 홈 카드, 진도·연습, 용어집

**Files:** Modify `home/data.js`, `glossary/terms.js`, `agent-lifecycle/tests/home.test.js`, `practice-engine.test.js`(필요한 곳), `glossary.test.js`; docs: 설계 문서 용어집 표에 English

**Interfaces:** Consumes Task 1 lesson ids.

- [ ] **Step 1: 실패하는 테스트**
  - home.test.js: SOP 카드 total 8; `completed: ['escalation']`이면 next = `scrubbing`, href `./sop-library/#scrubbing-0`; 예전 일곱 개를 다 마친 저장이면 done 7, next = scrubbing(다 마침 아님); 카드 문안 = 설계 문서 홈 카드 문안.
  - practice-engine.test.js: `ALL_SOP`에 scrubbing 추가, 새 확인 문제 두 개가 풀에 들어감.
  - glossary.test.js: 용어 49개, 새 id `scrubbing`, `rca`, `backlog`의 한국어 이름·뜻이 설계 문서 표와 같음.
- [ ] **Step 2:** `npm test` → FAIL
- [ ] **Step 3:** home 카드 문안, 용어 3개(카테고리: scrubbing·rca = process, backlog = metric; seen 없음), 영어.
- [ ] **Step 4:** `npm test` 0 fail

### Task 3: 브라우저 확인, 오프라인, 기록

**Files:** Modify `sw.js`(생성), `LOG.md`, 필요하면 `browser_check.py`

- [ ] **Step 1:** `python3 tools/sw_list.py`; browser check에서 SOP 목록이 8개, `#scrubbing-0`이 열리고 끝 화면(확인 문제)까지 가는지(기존 SOP 확인 구역에 레슨 id 목록이 있으면 추가). 390 폭 스크러빙 흐름도 스크린샷을 눈으로 확인.
- [ ] **Step 2:** `npm test` 0 fail, browser check `ALL CHECKS PASSED`.
- [ ] **Step 3:** LOG `### 38. SOP 라이브러리: 스크러빙 추가 — 상태: 검토 중`.
