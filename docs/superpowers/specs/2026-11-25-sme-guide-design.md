# SME 상황별 길잡이 — 설계와 한국어 문안 (짧은 문서)

작성일: 2026-11-25 · 상태: 승인됨 (2026-11-25) · 바탕: `2026-11-19-situation-guide-design.md` (TL 길잡이)

## 1. 의도와 이유

막 SME가 된 사람이 현장에서 막혔을 때 "지금 무엇을 봐야 하지?"를 두 번 눌러 찾게 한다. 새 설명을 쓰지 않고, 이미 있는 SME 첫걸음·서포트 라이프사이클·SME SOP 라이브러리·Codex·팀장 SOP로 안내한다. SME 홈의 "준비 중" 길잡이 카드를 실제 길잡이로 바꾼다.

## 2. 목표 · 비목표 · 반목표

- **목표**: 상황 16개를 5묶음으로 한 화면에서 훑고, 두 번 눌러 갈 곳에 닿는다. 한국어/영어, 320px–PC, 키보드·화면 낭독기. TL 길잡이와 같은 화면과 동작.
- **비목표**: 검색, 질문으로 좁히기, 새 설명 글, 진행 기록, 상담사·AM·OM 길잡이(다음에 같은 방식으로).
- **반목표**: 상황마다 해결책을 새로 써서 강의 내용과 겹치거나 어긋나는 것. TL 길잡이의 주소나 동작이 바뀌는 것.

## 3. 접근 방식

- A. `guide/` 한 페이지가 직급에 따라 내용을 바꾸기 — 새 페이지가 없지만 같은 주소가 사람마다 다른 내용을 보여 주고, 공유한 링크가 어긋난다.
- **B. SME 전용 페이지 `sme-guide/` — 사용자 선택.** TL 길잡이의 화면 코드를 그대로 쓰고 데이터만 따로 둔다. 주소마다 내용이 하나라 공유해도 같고, 강의 폴더를 나눈 방식과 같으며, 다른 직급 길잡이도 같은 방식으로 늘릴 수 있다.

## 4. 결정된 사항

**사용자 결정**: 상황 16개와 묶음(아래 5장), 방식 B.

**제작자 결정**
- 새 폴더 `sme-guide/`. 화면은 `guide/render.js`를 쓰되, 제목·안내·묶음 데이터를 넘겨받게 한다. TL 길잡이 화면은 그대로다.
- 상황 번호는 `m1`–`m16`(TL의 `s1`–`s18`과 겹치지 않게). 주소 `sme-guide/#m3`처럼 열고, 먼저 볼 곳 링크에는 TL과 같이 `?guide=m3`를 붙인다.
- 길잡이에서 연 레슨의 끝에 "이어서 볼 곳" 카드가 나오는 기능을 SME 강의 세 개(`sme/`, `sme-lifecycle/`, `sme-sop/`)에도 붙인다. TL 강의와 팀장 SOP는 지금처럼 TL 상황과 SME 상황을 모두 알아본다(SME 상황 일부가 팀장 SOP로 안내하므로).
- 링크 이름은 도착하는 곳의 제목이다. 레슨 링크 이름은 강의 이름 + 레슨 번호 + 레슨 제목이고, 테스트가 실제 레슨 제목과 같은지 확인한다.
- SME 홈의 길잡이 카드가 `sme-guide/`로 연결된다. 아래 메뉴의 길잡이 아이콘은 SME에게는 `sme-guide/`, 그 밖의 직급에게는 지금처럼 `guide/`를 연다. 두 페이지 모두 아래 메뉴에서 길잡이로 표시된다.
- 튜토리얼의 길잡이 문구("길잡이에서 지금 상황을 고르면…")는 직급과 상관없는 말이라 그대로 둔다.
- 영어는 한국어 승인 뒤 번역하고 함께 승인받는다. US spelling.

## 5. 한국어 문안 (승인 필요)

### 화면 문구

| 위치 | 한국어 |
|---|---|
| 제목 | SME 상황별 길잡이 |
| 안내 | 지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다. |
| 홈 카드 제목 | 어디서부터 볼까요? · SME 상황별 길잡이 (① 단계에서 승인된 문구) |
| 홈 카드 설명 | 지금 겪는 상황을 고르면 먼저 볼 곳을 알려 드립니다. (TL 카드와 같은 문구) |
| 칩 | 전체 / SME 첫 주 / 신입·교육생 / 기존·선임 / 요청이 몰릴 때 / 팀장·품질 |
| 그 밖의 문구 | 먼저 볼 곳 · 이어서 볼 곳 · 묶음 고르기 · {group}: 상황 {n}개 · 레슨 끝 카드 문구 — TL 길잡이와 같음 |

### 상황과 연결

| 번호 | 묶음 (제목) | 상황 | 먼저 볼 곳 | 이어서 볼 곳 |
|---|---|---|---|---|
| m1 | SME가 된 첫 주 | SME가 된 첫날이다 | SME 첫걸음 레슨 1 · SME가 된 첫날 | Codex 원페이저 ④ SME의 하루 |
| m2 | | 동료였던 선임이 승인 없이 처리하려 한다 | SME 첫걸음 레슨 4 · 동료였던 선임 서포트 | SME SOP · 에스컬레이션 승인 |
| m3 | 신입과 교육 중인 상담사 | 다음 주 OJT 교육생이 플로어에 나온다 | 서포트 라이프사이클 레슨 1 · 교육 중인 상담사 지원 | SOP · 신규 입사자 온보딩 |
| m4 | | 네스팅 중인 신입이 같은 유형에서 계속 막힌다 | 서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원 | SME 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트 |
| m5 | | 신입이 하루 종일 질문을 하지 않는다 | SME 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트 | 서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원 |
| m6 | 기존 상담사와 선임 | 상담사가 권한 밖 보상 승인을 요청한다 | SME SOP · 에스컬레이션 승인 | SME 첫걸음 레슨 3 · 기존 상담사 서포트 |
| m7 | | 정식 상담사의 품질이 갑자기 떨어졌다 | 서포트 라이프사이클 레슨 3 · 정식 상담사 지원 | SME SOP · 상담 트렌드 요약 보고 |
| m8 | | 선임이 SME나 팀장이 되고 싶어 한다 | 서포트 라이프사이클 레슨 4 · 선임 상담사 지원 | Codex 원페이저 ③ 커리어 매트릭스 |
| m9 | 요청이 한꺼번에 몰릴 때 | 플로어와 메신저 요청이 한꺼번에 몰린다 | SME 첫걸음 레슨 6 · 요청이 동시에 몰릴 때 | SME SOP · 에스컬레이션 승인 |
| m10 | | 같은 질문이 여러 상담사에게서 계속 온다 | SME SOP · 지식 베이스 업데이트 요청 | SME 첫걸음 레슨 7 · 팀에 지식 돌려주기 |
| m11 | 팀장 지원과 품질 | 팀장이 자리를 비워 출석을 대신 봐야 한다 | SME SOP · 출석 관리 대행 | SME 첫걸음 레슨 5 · 팀장 서포트 |
| m12 | | 팀장에게 주간 코칭 요약을 보내야 한다 | SME SOP · 상담 트렌드 요약 보고 | SME SOP · 스크러빙 |
| m13 | | 팀장이 팀원별 현황을 물어본다 | 서포트 라이프사이클 레슨 5 · 팀장 지원 | SME SOP · 상담 트렌드 요약 보고 |
| m14 | | 고객사가 정책 변경을 보내왔다 | SME SOP · 고객사 업데이트 허들 | SME SOP · 지식 베이스 업데이트 요청 |
| m15 | | 캘리브레이션에 참석하게 됐다 | SME SOP · 캘리브레이션 참여와 기준 전달 | SOP · 캘리브레이션 |
| m16 | | 같은 고객 불만이 계속 쌓인다 | SME SOP · VOC 리포팅 | SME SOP · 스크러빙 |

주소: SME 첫걸음 `../sme/#<id>-0`, 서포트 라이프사이클 `../sme-lifecycle/#<id>-0`, SME SOP `../sme-sop/#<id>-0`, 팀장 SOP `../sop-library/#<id>-0`, Codex `../codex/#daily-sme`·`../codex/#career`.

## 6. 성공 확인

- SME 홈의 길잡이 카드와 SME의 아래 메뉴 길잡이가 `sme-guide/`를 열고, TL과 다른 직급은 지금처럼 `guide/`를 연다.
- 상황 16개, 칩 6개(전체 포함). 칩으로 좁히고, 카드를 펼치면 링크 두 개. 언어를 바꿔도 고른 묶음과 펼친 카드가 남는다.
- 먼저 볼 곳으로 연 SME 레슨의 끝에 "이어서 볼 곳" 카드가 나오고, 다른 레슨으로 가면 사라진다.
- 모든 링크가 실제로 있는 곳으로 가고, 레슨 링크 이름이 실제 레슨 제목과 같다.
- TL 길잡이의 주소, 화면, 테스트는 그대로다. 전체 테스트와 브라우저 점검이 통과한다.

## 7. 영어 문안 (승인됨 2026-11-25, 검토자 제안 반영)

US English. 링크 이름은 도착하는 레슨·원페이저의 영어 제목을 그대로 씁니다.

| 한국어 | English |
|---|---|
| SME 상황별 길잡이 | SME Situation Guide |
| 지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다. | What's happening right now? Tap a situation to see where to look first and where to go next. |
| SME 첫 주 | First week |
| 신입·교육생 | New hires |
| 기존·선임 | Existing and senior agents |
| 요청이 몰릴 때 | Request rush |
| 팀장·품질 | Team leader and quality |
| SME가 된 첫 주 | Your first week as an SME |
| 신입과 교육 중인 상담사 | New hires and agents in training |
| 기존 상담사와 선임 | Existing and senior agents |
| 요청이 한꺼번에 몰릴 때 | When requests pile up at once |
| 팀장 지원과 품질 | Team leader support and quality |
| SME가 된 첫날이다 | It's your first day as an SME |
| 동료였던 선임이 승인 없이 처리하려 한다 | A senior agent who was your peer wants to go ahead without approval |
| 다음 주 OJT 교육생이 플로어에 나온다 | Trainees start OJT on the floor next week |
| 네스팅 중인 신입이 같은 유형에서 계속 막힌다 | A new hire in nesting keeps getting stuck on the same contact type |
| 신입이 하루 종일 질문을 하지 않는다 | A new hire hasn't asked a single question all day |
| 상담사가 권한 밖 보상 승인을 요청한다 | An agent asks you to approve compensation they aren't authorized to give |
| 정식 상담사의 품질이 갑자기 떨어졌다 | A regular agent's quality has suddenly dropped |
| 선임이 SME나 팀장이 되고 싶어 한다 | A senior agent wants to become an SME or team leader |
| 플로어와 메신저 요청이 한꺼번에 몰린다 | Floor and messenger requests pile up at once |
| 같은 질문이 여러 상담사에게서 계속 온다 | Several agents keep asking the same question |
| 팀장이 자리를 비워 출석을 대신 봐야 한다 | The team leader is away and you have to cover attendance |
| 팀장에게 주간 코칭 요약을 보내야 한다 | You need to send the team leader the weekly coaching summary |
| 팀장이 팀원별 현황을 물어본다 | The team leader asks where each team member stands |
| 고객사가 정책 변경을 보내왔다 | The client has sent a policy change |
| 캘리브레이션에 참석하게 됐다 | You're joining a calibration session |
| 같은 고객 불만이 계속 쌓인다 | Complaints about the same issue keep piling up |
| SME 첫걸음 레슨 1 · SME가 된 첫날 | SME First Steps lesson 1 · Your First Day as an SME |
| SME 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트 | SME First Steps lesson 2 · Supporting Agents in Training or Just Trained |
| SME 첫걸음 레슨 3 · 기존 상담사 서포트 | SME First Steps lesson 3 · Supporting Existing Agents |
| SME 첫걸음 레슨 4 · 동료였던 선임 서포트 | SME First Steps lesson 4 · Supporting Senior Agents Who Were Your Peers |
| SME 첫걸음 레슨 5 · 팀장 서포트 | SME First Steps lesson 5 · Supporting the Team Leader |
| SME 첫걸음 레슨 6 · 요청이 동시에 몰릴 때 | SME First Steps lesson 6 · When Requests Pile Up at Once |
| SME 첫걸음 레슨 7 · 팀에 지식 돌려주기 | SME First Steps lesson 7 · Giving Knowledge Back to the Team |
| 서포트 라이프사이클 레슨 1 · 교육 중인 상담사 지원 | Support Lifecycle lesson 1 · Supporting Agents in Training |
| 서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원 | Support Lifecycle lesson 2 · Supporting Agents Just Out of Training |
| 서포트 라이프사이클 레슨 3 · 정식 상담사 지원 | Support Lifecycle lesson 3 · Supporting Regular Agents |
| 서포트 라이프사이클 레슨 4 · 선임 상담사 지원 | Support Lifecycle lesson 4 · Supporting Senior Agents |
| 서포트 라이프사이클 레슨 5 · 팀장 지원 | Support Lifecycle lesson 5 · Supporting the Team Leader |
| SME SOP · 에스컬레이션 승인 | SME SOP · Escalation Approval |
| SME SOP · 스크러빙 | SME SOP · Scrubbing |
| SME SOP · 상담 트렌드 요약 보고 | SME SOP · Contact Trend Summary Report |
| SME SOP · 출석 관리 대행 | SME SOP · Covering Attendance |
| SME SOP · 고객사 업데이트 허들 | SME SOP · Client Update Huddle |
| SME SOP · 캘리브레이션 참여와 기준 전달 | SME SOP · Joining Calibration and Passing On Standards |
| SME SOP · VOC 리포팅 | SME SOP · VOC Reporting |
| SME SOP · 지식 베이스 업데이트 요청 | SME SOP · Knowledge Base Update Requests |
| SOP · 신규 입사자 온보딩 | SOP · New Hire Onboarding |
| SOP · 캘리브레이션 | SOP · Calibration |
| Codex 원페이저 ④ SME의 하루 | Codex one-pager ④ An SME's day |
| Codex 원페이저 ③ 커리어 매트릭스 | Codex one-pager ③ Career Matrix |
