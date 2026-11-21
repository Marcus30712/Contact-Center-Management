# 미소의 엑셀 연습: 심화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기본 11개 뒤에 '심화: 함수 섞어 쓰기' 레슨 5개(12~16)를 더한다.

**Architecture:** 심화 레슨은 `EXCEL_LESSONS`에 섞지 않고 `EXCEL_ADVANCED`(각 레슨에 `requires: ['4','6']`)로 따로 둔다. 그래서 홈·오늘의 연습·기본 목록의 "11개" 계산은 그대로다. 진도는 같은 키(`excel-practice:v1`)의 completed/scores에 '12'~'16'을 더한다. 계산기에 AND·OR·IFERROR를 더한다.

**Spec:** `docs/superpowers/specs/2026-11-21-excel-advanced-design.md`, 문안 `…-excel-advanced-copy.md`(+ 영어 `.en.md`)

## Global Constraints
- 한국어는 승인 문안과 글자 하나까지 같다(테스트로 대조). 영어에 한글·금지어 없음.
- 빈칸 오답 칩은 정답과 다른 값을 낸다. 조립: 답 카드 하나를 빼거나 헷갈림 카드를 넣으면 오답.
- 카드 한도: 기본 레슨 10장, 심화 22장(사용자 결정 B).
- 기본 11개 레슨·점수·기록·홈 '다 마침'은 바뀌지 않는다.

## Review Focus
1. 기본 11개를 다 마친 저장 기록 → 홈 '다 마침' 유지, 엑셀 목록은 심화가 열려 보임. → T3 test
2. 320 폭에서 22장 카드 → 겹침·넘침 없음. → T4 browser check + 스크린샷
3. 잠긴 심화 레슨 주소로 바로 들어오기(#lesson-12) → 목록으로. → T3 test
4. 오래된 저장 기록에 '12' 같은 없는 id → 걸러짐(지금 규칙). → T2 test
5. IFERROR 안의 0으로 나누기·찾기 실패 모두 잡힘, 바깥 오류는 그대로. → T1 test

### Task 1: 계산기 AND · OR · IFERROR
- [ ] 실패 테스트(excel-formula.test.js): `AND(1>0, 2>3)`=false, `OR(1>0, 2>3)`=true, 인자 0개 오류, `IFERROR(XLOOKUP("S99", A2:A9, D2:D9), "없음")`="없음", `IFERROR(1/0, 0)`=0, `IFERROR(5, 0)`=5.
- [ ] 구현(`excel/formula.js`), 테스트 통과.

### Task 2: 문안·데이터
- [ ] 영어 문안 `2026-11-21-excel-advanced-copy.en.md` 작성(기본 영어 파일과 같은 형식).
- [ ] 실패 테스트: excel-copy.test.js가 두 심화 파일을 같은 parse로 읽어 `EXCEL_ADVANCED`·UI 4키와 대조, 레슨별 문제 구성(객관식 2·빈칸 2·조립 2), requires 표, 오답 피드백(문안의 "오답:" 줄) = `EXCEL_FEEDBACK['12-1']` 등. excel-engine.test.js: 모든 조립 정답이 결과 값과 같음, 빈칸 오답 칩은 다른 값, 카드 한도(심화 22), 답 카드 빼기·헷갈림 넣기 오답.
- [ ] `excel/data.js`에 `EXCEL_ADVANCED`, `EXCEL_UI`에 4키, `excel/feedback.js`에 피드백.

### Task 3: 진도와 열림
- [ ] 실패 테스트: `isOpen(progress, '12')`는 4·6 마침에서만, loadProgress가 '12'~'16'을 남김, finishLesson 동작 같음, 홈 `myLearning` 엑셀 줄 total 11 그대로·기본 11 마친 사람 allDone true.
- [ ] `excel/engine.js` 구현.

### Task 4: 화면
- [ ] 실패 테스트(excel-render.test.js): 목록에 심화 구역(제목·안내·5개, 잠긴 것은 "4·6번 레슨을 마치면 열려요"), 심화 레슨 머리에 `advancedHeading`, 마친 뒤 다음 열린 심화 레슨 또는 목록, 다 마치면 `advancedDone`, 잠긴 심화 주소는 목록.
- [ ] `excel/render.js`, `excel.css` 구현.
- [ ] browser check: 심화 12를 열어 6문제를 풀고(조립 22장 문제 포함) 320·390 스크린샷, 카드가 화면 밖으로 안 나감.

### Task 5: 마무리
- [ ] `python3 tools/sw_list.py`, `npm test` 0 fail, browser check 통과, LOG 41.
