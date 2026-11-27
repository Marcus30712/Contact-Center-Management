# 상담사 상황별 길잡이 — 설계와 문안 (짧은 문서)

작성일: 2026-11-27 · 상태: 승인됨 (2026-11-27) · 바탕: `2026-11-25-sme-guide-design.md` (직무전문가 길잡이)

## 1. 의도와 이유

막 상담사가 된 사람이 현장에서 막혔을 때 "지금 무엇을 봐야 하지?"를 두 번 눌러 찾게 한다. 새 설명을 쓰지 않고, 이미 있는 강의로 안내한다.
- 상담사 첫걸음
- 상담사 커리어 라이프사이클
- 상담사 SOP 라이브러리
- Codex

상담사 홈의 "준비 중" 길잡이 카드를 실제 길잡이로 바꾼다.

## 2. 목표 · 비목표 · 반목표

- **목표**
  - 상황 16개를 5묶음으로 한 화면에서 훑고, 두 번 눌러 갈 곳에 닿는다.
  - 한국어/영어, 320px–PC, 키보드·화면 낭독기를 지원한다.
  - 화면과 동작은 팀장·직무전문가 길잡이와 같다.
- **비목표**
  - 검색, 질문으로 좁히기, 새 설명 글, 진행 기록.
  - 부매니저·매니저 길잡이.
- **반목표**
  - 상황마다 해결책을 새로 써서 강의 내용과 겹치거나 어긋나는 것.
  - 숨긴 QA·트레이너 진급길이 링크로 다시 보이는 것.
  - 팀장·직무전문가 길잡이의 주소나 동작이 바뀌는 것.

## 3. 접근 방식

직무전문가 길잡이와 같은 방식(전용 페이지)이다. 한 페이지가 직급에 따라 내용을 바꾸면 공유한 링크가 어긋나므로 그 방식은 쓰지 않는다.

## 4. 결정된 사항

**사용자 결정**: 상황 16개와 묶음(5장), 전용 페이지 방식.

**제작자 결정**
- **폴더와 화면**
  - 새 폴더는 `agent-guide/`다.
  - 화면은 `guide/render.js`를 그대로 쓰고, 데이터만 `agent-guide/data.js`에 둔다.
  - 화면의 나머지 문구는 팀장 길잡이와 같다.
- **상황 번호와 주소**
  - 상황 번호는 `a1`–`a16`이다. 팀장의 `s`, 직무전문가의 `m`과 겹치지 않는다.
  - 주소는 `agent-guide/#a3`처럼 연다.
  - 먼저 볼 곳 링크에는 `?guide=a3`를 붙인다.
- **레슨 끝 카드**
  - 상담사 강의 3개(`agent/`, `agent-career/`, `agent-sop/`)에서 길잡이로 연 레슨의 끝에 "이어서 볼 곳" 카드가 나온다.
  - `guide/link.js`가 상담사 상황도 알아보게 한다.
- **링크 이름**
  - 링크 이름은 도착하는 곳의 제목이다.
  - 레슨 링크 이름은 "강의 이름 + 레슨 번호 + 레슨 제목"이다. SOP는 "강의 이름 + 절차 제목"이다.
  - 테스트가 링크 이름이 실제 제목과 같은지 확인한다.
- **홈과 아래 메뉴**
  - 상담사 홈의 길잡이 카드가 `agent-guide/`를 연다. 카드 설명은 팀장 카드와 같은 문구다.
  - 상담사의 아래 메뉴 길잡이 아이콘도 `agent-guide/`를 연다.
  - 부매니저·매니저는 지금처럼 `guide/`를 연다.
  - 세 길잡이 페이지 모두 아래 메뉴에서 길잡이로 표시된다.
- **진급 링크**: 커리어 레슨으로만 보낸다. 커리어 매트릭스 원페이저에는 QA·트레이너가 나오므로 넣지 않는다.
- **함께 고칠 곳**: 오프라인 목록, 첫 화면 noscript, README, LOG.

## 5. 한국어 문안 (승인 필요)

### 화면 문구

| 위치 | 한국어 |
|---|---|
| 제목 | 상담사 상황별 길잡이 |
| 안내 | 지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다. |
| 홈 카드 제목 | 어디서부터 볼까요? · 상담사 상황별 길잡이 (승인된 홈 문구 규칙 그대로) |
| 홈 카드 설명 | 지금 겪는 상황을 고르면 먼저 볼 곳을 알려 드립니다. (팀장 카드와 같은 문구) |
| 칩 | 전체 / 첫 출근·교육 / 고객 응대 / 시스템·지식 / 평가·피드백 / 근태·성장 |

### 상황과 연결

| 번호 | 묶음 (제목) | 상황 | 먼저 볼 곳 | 이어서 볼 곳 |
|---|---|---|---|---|
| a1 | 첫 출근과 교육 | 오늘 첫 출근이다 | 상담사 첫걸음 레슨 1 · 첫 출근 | Codex 원페이저 ④ 상담사의 하루 |
| a2 | | 교육 내용이 너무 많아 무엇부터 잡을지 모르겠다 | 상담사 첫걸음 레슨 2 · 교육을 버티는 법 | 상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법 |
| a3 | | OJT·네스팅 중 막혔는데 누구에게 물을지 모르겠다 | 상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법 | 상담사 SOP · 에스컬레이션 요청하기 |
| a4 | 고객 응대 | 실전 배치 뒤 혼자 받는 첫 콜이 겁난다 | 상담사 첫걸음 레슨 4 · 실전 배치와 첫 콜 | 상담사 첫걸음 레슨 5 · 어려운 고객 |
| a5 | | 고객이 화가 나서 언성을 높인다 | 상담사 첫걸음 레슨 5 · 어려운 고객 | 상담사 SOP · 욕설·폭언 고객 응대와 통화 종료 |
| a6 | | 고객이 욕설을 계속한다 | 상담사 SOP · 욕설·폭언 고객 응대와 통화 종료 | 상담사 첫걸음 레슨 5 · 어려운 고객 |
| a7 | | 내 권한으로 해결할 수 없는 요청이다 | 상담사 SOP · 에스컬레이션 요청하기 | 상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법 |
| a8 | 시스템과 지식 | 시스템이 계속 오류를 낸다 | 상담사 SOP · 시스템 장애 때 대응 | 상담사 SOP · 에스컬레이션 요청하기 |
| a9 | | 지식 베이스 내용이 허들에서 들은 것과 다르다 | 상담사 SOP · 지식 베이스 오류 알리기 | 상담사 SOP · 고객사 업데이트 허들 듣고 적용하기 |
| a10 | | 쉬는 날 고객사 업데이트 허들이 있었다 | 상담사 SOP · 고객사 업데이트 허들 듣고 적용하기 | 상담사 SOP · 지식 베이스 오류 알리기 |
| a11 | 평가와 피드백 | 이번 주 평가 점수가 낮게 나왔다 | 상담사 첫걸음 레슨 6 · 매주 평가 리뷰 | 상담사 SOP · 스크러빙 피드백 받고 고치기 |
| a12 | | 직무전문가에게 스크러빙 피드백을 받았다 | 상담사 SOP · 스크러빙 피드백 받고 고치기 | 상담사 첫걸음 레슨 6 · 매주 평가 리뷰 |
| a13 | | 감점이 부당하다고 생각한다 | 상담사 SOP · 평가 결과 이의 제기 | 상담사 첫걸음 레슨 6 · 매주 평가 리뷰 |
| a14 | 근태와 성장 | 아파서 내일 출근하기 어렵다 | 상담사 SOP · 결근·병가 알리기 | 상담사 첫걸음 레슨 7 · 근태와 스케줄 |
| a15 | | 직무전문가가 되고 싶다 | 상담사 커리어 라이프사이클 레슨 1 · 직무전문가 준비 | 상담사 커리어 라이프사이클 레슨 2 · 직무전문가 |
| a16 | | 언젠가 팀장이 되고 싶다 | 상담사 커리어 라이프사이클 레슨 3 · 팀장 준비 | 상담사 커리어 라이프사이클 레슨 4 · 팀장 |

주소 형식:
- 상담사 첫걸음: `../agent/#<id>-0`
- 상담사 커리어 라이프사이클: `../agent-career/#<id>-0`
- 상담사 SOP: `../agent-sop/#<id>-0`
- Codex: `../codex/#daily-agent`

## 6. 성공 확인

- 상담사 홈의 길잡이 카드와 상담사의 아래 메뉴 길잡이가 `agent-guide/`를 연다. 팀장·직무전문가·부매니저·매니저는 지금 그대로다.
- 상황은 16개, 칩은 6개(전체 포함)다.
- 칩으로 좁히고, 카드를 펼치면 링크 두 개가 나온다.
- 언어를 바꿔도 고른 묶음과 펼친 카드가 남는다.
- 먼저 볼 곳으로 연 상담사 레슨의 끝에 "이어서 볼 곳" 카드가 나오고, 다른 레슨으로 가면 사라진다.
- 모든 링크가 실제로 있는 곳으로 간다. 링크 이름은 실제 제목과 같다.
- 전체 테스트와 브라우저 점검이 통과한다.

## 7. 영어 문안 (함께 승인 필요)

US English. 링크 이름은 도착하는 레슨·원페이저의 영어 제목을 그대로 씁니다. Jimin은 she지만 상황 문장은 2인칭(you)입니다. 직무전문가 길잡이와 같습니다.

| 한국어 | English |
|---|---|
| 상담사 상황별 길잡이 | Agent Situation Guide |
| 지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다. | What's happening right now? Tap a situation to see where to look first and where to go next. |
| 첫 출근·교육 | First days and training |
| 고객 응대 | Customers |
| 시스템·지식 | Systems and knowledge |
| 평가·피드백 | Scores and feedback |
| 근태·성장 | Attendance and growth |
| 첫 출근과 교육 | Your first days and training |
| 고객 응대 | Handling customers |
| 시스템과 지식 | Systems and knowledge |
| 평가와 피드백 | Scores and feedback |
| 근태와 성장 | Attendance and growth |
| 오늘 첫 출근이다 | It's your first day at work |
| 교육 내용이 너무 많아 무엇부터 잡을지 모르겠다 | Training throws too much at you at once, and you don't know where to start |
| OJT·네스팅 중 막혔는데 누구에게 물을지 모르겠다 | You're stuck during OJT or nesting and don't know whom to ask |
| 실전 배치 뒤 혼자 받는 첫 콜이 겁난다 | You've gone live and your first solo call scares you |
| 고객이 화가 나서 언성을 높인다 | A customer is angry and raising their voice |
| 고객이 욕설을 계속한다 | A customer keeps swearing at you |
| 내 권한으로 해결할 수 없는 요청이다 | A customer asks for something you aren't authorized to do |
| 시스템이 계속 오류를 낸다 | The system keeps throwing errors |
| 지식 베이스 내용이 허들에서 들은 것과 다르다 | The knowledge base says something different from what you heard in the huddle |
| 쉬는 날 고객사 업데이트 허들이 있었다 | There was a client update huddle on your day off |
| 이번 주 평가 점수가 낮게 나왔다 | Your quality score was low this week |
| 직무전문가에게 스크러빙 피드백을 받았다 | An SME gave you scrubbing feedback |
| 감점이 부당하다고 생각한다 | You think you lost points unfairly |
| 아파서 내일 출근하기 어렵다 | You're sick and may not make it in tomorrow |
| 직무전문가가 되고 싶다 | You want to become an SME |
| 언젠가 팀장이 되고 싶다 | You want to become a team leader someday |
| 상담사 첫걸음 레슨 1 · 첫 출근 | Agent First Steps lesson 1 · Your First Day at Work |
| 상담사 첫걸음 레슨 2 · 교육을 버티는 법 | Agent First Steps lesson 2 · Getting Through Training |
| 상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법 | Agent First Steps lesson 3 · OJT and Nesting: How to Ask |
| 상담사 첫걸음 레슨 4 · 실전 배치와 첫 콜 | Agent First Steps lesson 4 · Go Live and the First Call |
| 상담사 첫걸음 레슨 5 · 어려운 고객 | Agent First Steps lesson 5 · Difficult Customers |
| 상담사 첫걸음 레슨 6 · 매주 평가 리뷰 | Agent First Steps lesson 6 · The Weekly Score Review |
| 상담사 첫걸음 레슨 7 · 근태와 스케줄 | Agent First Steps lesson 7 · Attendance and Schedules |
| 상담사 커리어 라이프사이클 레슨 1 · 직무전문가 준비 | Agent Career Lifecycle lesson 1 · Getting Ready to Be an SME |
| 상담사 커리어 라이프사이클 레슨 2 · 직무전문가 | Agent Career Lifecycle lesson 2 · SME |
| 상담사 커리어 라이프사이클 레슨 3 · 팀장 준비 | Agent Career Lifecycle lesson 3 · Getting Ready to Be a Team Leader |
| 상담사 커리어 라이프사이클 레슨 4 · 팀장 | Agent Career Lifecycle lesson 4 · Team Leader |
| 상담사 SOP · 에스컬레이션 요청하기 | Agent SOP · Requesting an Escalation |
| 상담사 SOP · 욕설·폭언 고객 응대와 통화 종료 | Agent SOP · Handling Abusive Callers and Ending the Call |
| 상담사 SOP · 결근·병가 알리기 | Agent SOP · Reporting an Absence or Sick Day |
| 상담사 SOP · 고객사 업데이트 허들 듣고 적용하기 | Agent SOP · Applying a Client Update from the Huddle |
| 상담사 SOP · 지식 베이스 오류 알리기 | Agent SOP · Reporting a Knowledge Base Error |
| 상담사 SOP · 스크러빙 피드백 받고 고치기 | Agent SOP · Taking Scrubbing Feedback and Fixing It |
| 상담사 SOP · 평가 결과 이의 제기 | Agent SOP · Disputing a Quality Score |
| 상담사 SOP · 시스템 장애 때 대응 | Agent SOP · Responding to a System Outage |
| Codex 원페이저 ④ 상담사의 하루 | Codex one-pager ④ An agent's day |
