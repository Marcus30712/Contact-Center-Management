# 콘텐츠 검수 반영 1단계 — 변경 목록 (2026-11-26)

계획: `docs/superpowers/plans/2026-11-26-content-fixes.md` · 검수: `2026-11-26-content-review.md`
사용자 결정(2026-11-26): 신입 순서 교육 → OJT → 네스팅 → 수료 → 실전 배치, 지민 정리, 용어 통일, 누가 정하나, 커리어 강의 소개, 나머지 승인. 정답 길이 맞추기는 2단계.

## 통합 단계에서 고친 것 (컨트롤러)
| 위치 | 전 | 후 |
|---|---|---|
| practice/data.js 팀장 배지 EN (+ review-quiz-copy.en.md) | Team lead course complete / Pass the team lead review quiz | TL course complete / Pass the TL review quiz |
| codex/data/career.js 직무전문가 다음 단계 EN | served as team lead backup | served as team leader backup |
| codex/data/links.js EN | a team lead's day | a team leader's day |
| codex/data/daily.js 팀장 업무 EN | weekly team lead meetings | weekly team leader meetings |
| codex/data/daily.js 직무전문가 업무·일정 (+ Codex 문안) | QA팀과 (주간) 품질 교정 미팅 | QA팀과 (주간) 캘리브레이션 |
| tests/sme.test.js | 도윤은 PIP SOP 인물 | 우진은 PIP SOP 인물 (PIP SOP 인물 이름 변경에 맞춤) |
| browser_check.py (s6), (g2) | 도윤, ../sop-library/#onboarding-0 | 우진, ../agent-lifecycle/#nesting-0 |

그대로 둔 것: 직급 선택 화면과 Codex의 직급 이름 "Team Lead / TL"(직급 이름 표기는 2026-11-26에 사용자가 정한 형식).

---

## 상담사 (Task A)

### Task A (상담사) 변경 목록

상태: **DONE**

검증: `cd agent-lifecycle && node --test tests/tl-courses.test.js tests/agent-career.test.js tests/home.test.js tests/practice-copy.test.js tests/practice-render.test.js tests/korean-role-names.test.js`
→ tests 139 · pass 139 · fail 0

바꾼 파일: agent/lessons/01~08, agent-career/lessons/01~05, agent-career/ui.js, 문안 문서 4개(agent-course-copy-ko/.en, agent-career-copy-ko/.en), practice/data.js, home/role-home.js, agent-lifecycle/tests/agent-career.test.js, 그리고 테스트가 대조하는 문서 2개(2026-11-20-daily-practice-design.md §6 표·§4 한 줄, 2026-11-25-role-home-copy.md 한 행). 모든 id(레슨·질문·보기·정답)는 그대로입니다. 문안 문서와 레슨 파일은 글자 그대로 같습니다.

#### 상담사 첫걸음 (agent)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| start 스텝 2 | 낮음 · 콜센터 → 고객센터 ※사용자 표현 변경 | 지민은 오늘 처음 콜센터에 출근했습니다. … / (EN 그대로) | 지민은 오늘 처음 고객센터에 출근했습니다. … / (EN 그대로) |
| start 스텝 5 | 높음 · 결정 1·5 (수료 위치, 수료는 트레이너+팀장) | …신입끼리 모인 자리에서 조금 더 도움을 받으며 일합니다. / …with closer support. | …일합니다. 네스팅이 끝날 때 트레이너와 팀장이 함께 수료를 정합니다. / …with closer support. At the end of nesting, the trainer and team leader decide together that you graduate. |
| start 스텝 6 | 높음 · 결정 1 | 넷째 단계는 실전 배치입니다. 정식 팀에 합류해 혼자 문의를 받기 시작합니다. … / The fourth stage is Go Live. You join the regular team … | 넷째 단계는 실전 배치입니다. 수료하면 정식 팀에 합류해 혼자 문의를 받기 시작합니다. … / The fourth stage is Go Live. Once you graduate, you join the regular team … |
| start 스텝 8 | 낮음 · 메모 동작 | 자리 배치나 메신저 프로필 옆에 메모해 둡니다. / note them down next to the seating plan or chat profiles. | 자리 배치도나 메신저 프로필을 보며 이름과 역할을 메모해 둡니다. / use the seating plan or chat profiles to note down names and roles. |
| start-q2 보기 a + 피드백 | 중간 · 단계 수가 다름 | 실전 배치 → 교육 → 온보딩 / 배우기 전에 혼자 고객을 받으면 … (EN: Go Live → training → onboarding / Facing customers alone before learning …) | 온보딩 → OJT와 네스팅 → 교육 → 실전 배치 / 제품과 시스템을 배우기 전에 실제 문의를 받으면 고객도 상담사도 힘들어집니다. (EN: Onboarding → OJT and nesting → training → Go Live / Handling real contacts before learning the products and systems is hard on the customer and the agent.) |
| start-q2 보기 c | 중간 · 단계 수가 다름 | 교육 → 실전 배치 → OJT와 네스팅 / Training → Go Live → OJT and nesting | 온보딩 → 교육 → 실전 배치 → OJT와 네스팅 / Onboarding → training → Go Live → OJT and nesting (피드백 그대로) |
| training 스텝 5 | 낮음 · 매 콜 → 모든 문의 | 매 콜 쓰니 / on every call | 모든 문의에서 쓰니 / on every contact |
| nesting-q1 보기 b | 중간 · 대기 → 보류 (결정 4) | …양해를 구하고 통화를 대기로 돌린 뒤, … / (EN 그대로) | …양해를 구하고 통화를 보류한 뒤, … / (EN 그대로) |
| nesting 연결 | 결정 1 | 네스팅을 마치면 정식 팀에 합류합니다. / After nesting, you join the regular team. | 네스팅을 마치고 수료하면 정식 팀에 합류합니다. / Once you finish nesting and graduate, you join the regular team. |
| golive 스텝 2 | 중간 · 첫 콜처럼 읽힘 + 결정 1 | 지민은 오늘부터 정식 팀입니다. 첫 콜 신호가 울리자 … / From today Jimin is on the regular team. When the first call rings, … | 지민은 수료하고 오늘부터 정식 팀에서 일합니다. 네스팅 때처럼 곁에서 봐 주는 사람 없이 혼자 받는 첫 콜이 울리자, 손이 떨리고 … / Jimin has graduated, and from today she's on the regular team. When her first call without nesting support rings, … |
| golive 스텝 7 | 낮음 · 용어 (결정 4) | 평균 처리 시간이 / average handling time | 평균 처리 시간(AHT)이 / average handle time (AHT) |
| golive-q1 보기 b | 중간 · 대기 → 보류 | …통화를 정해진 방법으로 대기로 돌린 뒤, … / (EN 그대로) | …정해진 방법으로 통화를 보류한 뒤, … / (EN 그대로) |
| customers 스텝 8 | 낮음 · 티켓 로그 → 상담 기록 | 티켓 로그에 / in the ticket log | 상담 기록에 / in the contact notes |
| customers-q2 보기 b | 낮음(티켓 로그) | …종료한 뒤 티켓 로그에 기록한다. / …then record it in the ticket log. | …종료한 뒤 상담 기록에 남긴다. / …then record it in the contact notes. |
| customers-q2 c 피드백 | 중간 · 승인이 늘 필요한 것처럼 읽힘 | 경고와 승인, 기록 없이 끊으면 … / Ending without the warning, approval and record … | 경고와 기록 없이 끊으면 고객 불만이 상담사의 책임으로 남을 수 있습니다. 승인이 필요한 센터라면 승인도 받습니다. / Ending without a warning and a record can leave the complaint on the agent. If your center needs approval, get that too. |
| customers-q2 해설 | 같은 항목 (내 판단) | …승인과 기록까지 남깁니다. / …and leave the approval and record. | …필요하면 승인을 받아 기록까지 남깁니다. / …get approval where it's needed, and leave a record. |
| review 스텝 5 | 낮음 · 누가 고르나 | 이번 주에 바꿀 것은 가장 중요한 하나만 고릅니다. / pick just the most important one … | 이번 주에 바꿀 것은 팀장과 함께 가장 중요한 하나만 고릅니다. / pick with your team leader just the most important one … |
| review 스텝 7 | 낮음 · 구체적 질문 예 | "어떻게 하면 되나요?"라고 / ask concretely: "How should I do it?" | "이 항목은 어떻게 말하면 되나요?"처럼 / ask concretely, for example: "How should I say this part?" |
| review-q1 보기 b | 중간 · 녹취를 못 여는 센터 | 평가받은 녹취를 다시 듣고, … / Listen to the scored recording again and … | 평가받은 상담을 다시 보고, 궁금한 점을 적어 간다. / Go back over the scored contact and write down her questions. |
| attendance 스텝 2 | 낮음 · 콜센터 → 고객센터 ※사용자 표현 변경 | 콜센터는 시간대마다 … | 고객센터는 시간대마다 … (EN 그대로) |
| attendance-q1 보기 a | 중간 · ko/en 뜻 차이 | 근무 시간이 지나 몸이 나아지면 연락한다. | 근무가 시작된 뒤 몸이 나아지면 연락한다. (EN 그대로) |
| growth 스텝 1 | 낮음 · 어색 | …퍼포먼스 리뷰를 써서, 업무에 … | …퍼포먼스 리뷰로 업무에 … (EN 그대로) |
| growth 스텝 3·6 | 낮음 · 기간에 예시 ※사용자 경험 숫자에 표시 추가 | 첫 단계는 석 달입니다. / 넷째 단계는 반년입니다. (EN: three months. / half a year.) | 석 달(예시) / 반년(예시) (EN: three months (Example). / half a year (Example).) |
| growth 스텝 4 | 낮음 · 누가 고르나 | 수진 팀장은 매주 한 가지씩 함께 연습할 것을 정해 줍니다. / Each week, Sujin picks one thing … | 수진 팀장과 매주 한 가지씩 함께 연습할 것을 정합니다. / Each week, you and Sujin pick one thing … |
| growth 스텝 8 | 낮음 | 선임이나 직무전문가를 준비할 때도 | 선임이나 직무전문가 자리를 준비할 때도 (EN 그대로) |
| 문안 문서 등장인물 표 | 콜센터 → 고객센터 (화면에 안 나옴) | 오늘 처음 콜센터에 출근한 | 오늘 처음 고객센터에 출근한 |

#### 상담사 커리어 라이프사이클 (agent-career)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| 강의 소개 (ui.js) | 중간 · 결정 6 ※사용자가 넣은 문구 변경 | 실전 배치 뒤 1년쯤 지난 지민과 … 네 자리는 순서대로 거치는 길이 아니라 서로 다른 길입니다. … / With Jimin, about a year after Go Live, … The four roles are separate paths, not steps to climb in order. … | 실전 배치 뒤 1년쯤(예시) 지난 지민과 … 네 자리는 꼭 차례대로 거치는 사다리가 아니라 각자 다른 길입니다. 팀장은 대개 직무전문가를 거쳐 갑니다. 마지막은 … / With Jimin, about a year after Go Live (Example), … The four roles are not a ladder you must climb in order; each is its own path. Team leaders usually get there through the SME role. The last lesson … |
| trainer → tl 연결 | 중간 | 여기까지는 한 분야를 깊이 맡는 길이었습니다. / So far these were paths that go deep in one area. | 여기까지는 돕고, 재고, 가르치는 길이었습니다. / So far these were the paths of helping, measuring and teaching. |
| qa 스텝 4, qa-q2 질문·a 피드백·해설 | 중간 · 교정 회의 → 캘리브레이션 (결정 4) | 교정 회의(Calibration) / 교정 회의는 / 교정 회의가 | 캘리브레이션 / 캘리브레이션은 / 캘리브레이션이 (EN 그대로) |
| qa 스텝 7 | 낮음 · 문장 꼬임 | 내 녹취를 들을 수 있다면, 또는 평가 리뷰 때 함께 들으며 평가표로 … / If you can play back your recording, or when you listen to it together in a score review, score it yourself … | 내 녹취를 들을 수 있다면 직접, 아니면 평가 리뷰 때 함께 들으며 평가표로 … / Play back your recording if you can, or listen together in a score review, and score it yourself with the sheet, then compare with Dohyun's score. |
| qa 스텝 1 (EN) | 낮음 | knowing what a QA does | knowing what QA does |
| qa 스텝 6 (EN) | 낮음 | the more you see like a QA. | the more you see contacts the way QA does. |
| sme 스텝 5 (EN) | 낮음 · 분석적 사고 누락 | Coaching peers and working through problems step by step matter too. | Coaching peers and analytical thinking, working through problems step by step, matter too. |
| sme-q1 질문 (EN) | 중간 · EN 2문장 | Jimin wants to become an SME. What fits best as something she can do now? | What's the best thing Jimin, who wants to become an SME, can do now? |
| tl-q2 질문 (EN) | 중간 · EN 2문장 | Jimin is an agent who dreams of becoming a team leader. What can she do now? | What can Jimin, an agent who dreams of becoming a team leader, do now? |
| trainer-q2 해설 (EN) | 낮음 | The trainer fixes through training the problems QA finds on the floor. | The trainer uses training to fix the problems QA finds on the floor. |
| ready 스텝 3 | 낮음 · 반복 + 위 직급 → 다음 자리 | 첫 단계는 출석률입니다. 무엇보다 출석률이 중요합니다. 위 직급은 … 자리가 자주 비면 … / The first stage is attendance. Above all, attendance matters. Roles above agent work … when a seat is often empty, … needs it. | 첫 단계는 출석률이고, 무엇보다 중요합니다. 다음 자리는 … 자주 빠지면 … / The first stage is attendance, and it matters above all. Next roles work with many agents and other departments, so when you're often absent, the flow breaks when the team or project needs you. |
| ready 스텝 6 | 낮음 | 기록은 시간이 지나면 기준 밖으로 나갑니다. | 오래된 기록은 시간이 지나면 보는 기간 밖으로 빠집니다. (EN 그대로) |
| ready-q1 질문 | 낮음 · 위 직급 | 위 직급 지원자를 볼 때 … / …for a role above agent, … | 다음 자리 지원자를 볼 때 … / When looking at applicants for a next role, … |
| ready-q1 해설 | 낮음 | 위 직급은 여러 사람과 함께 일합니다. … / Roles above agent work with many people. A record of being there comes first as trust. | 다음 자리는 여러 사람과 함께 일합니다. … / Next roles work with many people. A record of showing up is the first thing that builds trust. |
| ready-q2 b 피드백 | 낮음 · 순위처럼 읽힘 | 점수는 셋째 기준입니다. / Scores are the third criterion. | 점수는 품질·시험 점수 항목에서 봅니다. / Scores belong to the quality and test scores criterion. |

#### 홈 · 오늘의 문제

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| practice/data.js 배지 lifecycle (+ daily-practice-design §6 표) | 중간 · 상담사 커리어 라이프사이클로 오해 | 라이프사이클 완주 · 라이프사이클 6개 레슨을 모두 마침 / Lifecycle finished · Finish all 6 Lifecycle lessons | 상담사 라이프사이클 완주 · 팀장 강의 「상담사 라이프사이클」 6개 레슨을 모두 마침 / Agent Lifecycle finished · Finish all 6 lessons of The Agent Lifecycle (team leader course) |
| practice/data.js weekend (+ 같은 문서 §6 표, §4 화면 설명 한 줄) | 낮음 · 주말 교대 근무 | 주말은 쉬는 날이에요. 풀어도 좋지만 연속 일수에는 넣지 않아요. / Weekends are days off. You can still practice, but it won't add to your streak. | 주말은 연속 일수에 넣지 않아요. 풀어도 좋아요. / Weekends don't count toward your streak, but you can still practice. |
| home/role-home.js soonText EN (+ role-home-copy.md 행) | 낮음 | Coming soon. Meanwhile, see the {role} role and day in the Codex. | Coming soon. Meanwhile, the Codex shows the {role} role and a day in it. |

테스트 변경: `agent-career.test.js`의 "the intro says the four roles are separate paths" 테스트 기대값을 새 소개 문구로 바꿨습니다(두 문장 + "1년쯤(예시)" 확인 추가). 약하게 만들지 않았습니다.

#### 반영하지 않은 항목
- nesting-q1 보기 a·c 새 문안, 보기 b·영어의 줄임: 정답 길이 맞추기 전용이라 2단계로 넘깁니다. 보기 b는 "대기로 돌린 → 보류한"만 바꿨습니다.
- customers-q2 보기 b를 "정해진 문구로 경고하고, 계속되면 절차대로 통화를 종료한 뒤 기록한다."로 줄이는 제안: 줄이는 부분은 정답 길이 전용입니다. 이번에는 "티켓 로그 → 상담 기록"만 바꿨습니다.
- "판단하지 않은 것"(버디 추가, 지민 경력 정리, 상담사용 배지 추가, 강의 이름 변경)은 리뷰어도 범위 밖으로 둔 것이라 손대지 않았습니다.

#### 다른 Task에 넘길 것
- **Task C / E:** practice/data.js 배지 `review-tl`의 영어 이름 "Team lead course complete"는 결정 4(team leader)에 어긋납니다. 이 배지 문구는 review.test.js가 Task C의 복습 퀴즈 문안 문서와 대조하므로 제가 고치지 않았습니다. "Team leader course complete"로 바꾸려면 Task C 문안 문서와 practice/data.js를 함께 고쳐야 합니다.
- **Task E (참고):** shared/role-data.js의 "Team Lead"도 같은 용어 문제입니다(리뷰가 상담사 범위 밖으로 넘김).
- **Task E (참고):** `docs/superpowers/specs/2026-11-26-agent-course-design.md`(설계 문서, 테스트 대조 없음) 7행의 순서 "온보딩 → 교육 → OJT → 네스팅 → 실전 배치"에는 수료가 없습니다. 기록용 문서라 고치지 않았습니다.

#### 내가 내린 판단
- **결정 1(수료 위치):** 리뷰의 스텝 6 제안("네스팅을 마치고 정식 팀에 합류")은 수료를 빼고 쓴 것이었습니다. 스텝 5 끝에 "네스팅이 끝날 때 트레이너와 팀장이 함께 수료를 정합니다."(결정 5)를 넣고, 스텝 6은 "수료하면 정식 팀에 합류"로 썼습니다. 레슨 3 연결과 레슨 4 스텝 2에도 수료를 넣어 순서가 교육 → OJT → 네스팅 → 수료 → 실전 배치로 읽힙니다. 레슨 1의 노드 4개는 그대로 둡니다(수료는 단계가 아니라 네스팅의 끝).
- **start-q2 정답:** 노드와 같은 4단계(온보딩 → 교육 → OJT와 네스팅 → 실전 배치)로 두고, 보기 a·c를 리뷰대로 4단계로 맞췄습니다. 정답 id b는 그대로입니다.
- **customers-q2 해설:** 리뷰는 피드백만 고쳤지만 해설 "승인과 기록까지 남깁니다"도 승인이 늘 필요한 것처럼 읽혀 "필요하면 승인을 받아"로 함께 고쳤습니다.
- **qa 스텝 7:** 리뷰 문안("내 녹취를 직접 듣거나")은 기존 테스트가 지키는 "들을 수 있다면"(상담사가 녹취를 못 여는 센터 배려)을 없앱니다. 그래서 "내 녹취를 들을 수 있다면 직접, 아니면 평가 리뷰 때 함께 들으며"로 꼬임만 풀었습니다.
- **ready 스텝 3:** 리뷰 문안을 그대로 쓰면 "다음 자리는 … 자리가 자주 비면"처럼 "자리"가 겹칩니다. 그래서 "자주 빠지면"으로 썼습니다. 한국어가 2문장이 되어 영어도 2문장으로 줄였습니다.
- **강의 소개 영어:** 결정 6 문구를 영어로 옮겼습니다. ui.js의 작은따옴표 문자열과 부딪치지 않게 "aren't" 대신 "are not"을 썼습니다. 한국어 4문장, 영어 4문장입니다.
- **golive 스텝 2:** 리뷰 문안 앞에 "수료하고"를 넣어 결정 1을 반영했습니다.
- **사용자 표현을 바꾼 곳(결정 7 표시):** 콜센터 → 고객센터(start 스텝 2, attendance 스텝 2), growth의 석 달·반년에 "(예시)", 커리어 강의 소개 문구(결정 6).
- **테스트가 대조하는 문서 두 개도 고쳤습니다:** 2026-11-20-daily-practice-design.md, 2026-11-25-role-home-copy.md. 이 문서들은 Task A 파일 목록에 없지만 practice/data.js·role-home.js 문구를 글자 그대로 대조합니다. 고친 행은 Task A 문구 행뿐입니다.

---

## 직무전문가 (Task B)

### Task B (직무전문가) 변경 목록

상태: **DONE**

검증: `cd agent-lifecycle && node --test tests/sme.test.js tests/sme-lifecycle.test.js tests/sme-sop.test.js tests/sme-guide.test.js tests/korean-role-names.test.js` → **tests 76 / pass 76 / fail 0**

작업 방식: 문안 문서(ko·en)를 고치고 `/tmp/gen/make_sme.py`, `gen_sl.py`, `gen_ss.py`로 lessons/*.js를 다시 만들었습니다. 생성 뒤 `git diff`로 의도한 줄만 바뀐 것을 확인했습니다(gen_sl.py가 3번째 줄 주석의 "SME "를 빼는 것은 sed로 되돌렸습니다). `sme-lifecycle/ui.js`, `sme-guide/data.js`는 직접 고쳤습니다. `gen_guide.py`는 옛 이름("SME 첫걸음")을 쓰는 낡은 스크립트라 쓰지 않았습니다. id(레슨·질문·보기·정답)는 하나도 바꾸지 않았습니다.

고친 파일
- `docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md` / `.en.md` → `sme/lessons/*.js`
- `docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md` / `.en.md` → `sme-lifecycle/lessons/*.js`, `sme-lifecycle/ui.js`
- `docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md` / `.en.md` → `sme-sop/lessons/*.js`
- `docs/superpowers/specs/2026-11-25-sme-guide-design.md` (§5, §7), `sme-guide/data.js`
- `agent-lifecycle/tests/sme-guide.test.js` (m3 링크 기대값, 상담사 라이프사이클을 링크 대상 강의에 추가)

#### 변경 표

##### 직무전문가 첫걸음 (sme)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| 문안 등장인물표 서준 | 높음 1 (결정 1) | 지난주 교육을 마치고 팀에 합류한 신입 상담사 | 지난주 OJT를 마치고 네스팅을 시작한 신입 상담사 |
| firstday 스텝 5 | 중간 (스크러빙·용어) | …여기에 VOC 정리와 QA와의 품질 교정 미팅이 더해집니다. / VOC write-ups and quality calibration meetings with QA come on top. | …여기에 매일 하는 스크러빙과 VOC 정리, QA와의 캘리브레이션이 더해집니다. / Daily scrubbing, VOC write-ups and calibration with QA come on top. |
| firstday 스텝 9 | 낮음 (코칭 자료), 낮음 (the lead) | …출석 관리, 코칭 자료, 허들을… / …attendance, coaching material and huddles when the lead is busy. | …출석 관리, 트렌드 요약, 허들을… / …attendance, trend summaries and huddles when the team leader is busy. |
| firstday 노드 4 (EN) | 낮음 (the lead) | Share with the lead | Share with the TL |
| firstday-q2 보기 b (EN) | 중간 (지민 대명사, 결정 2) | …alongside him and help… | …alongside her and help… |
| firstday → newcomer 연결 | 결정 1 | …막 교육을 마친 신입입니다. / …a new hire just out of training. | …막 OJT를 마치고 네스팅을 시작한 신입입니다. / …a new hire who has just finished OJT and started nesting. |
| newcomer 스텝 2 | 높음 1 (결정 1) | 서준은 지난주 교육을 마치고 오늘 처음 팀에 합류했습니다. 지식은 있지만 실제 고객 앞에 서는 것은 처음입니다. / Seojun finished training last week and joins the team today. He has the knowledge, but he has never been in front of a real customer. | 서준은 지난주 이론 교육과 OJT를 마치고, 이번 주부터 네스팅 그룹에서 실제 문의를 받습니다. 지식은 있지만 트레이너 곁을 떠나 고객을 맡는 것은 처음입니다. / Seojun finished classroom training and OJT last week, and from this week he takes real contacts in the nesting group. He has the knowledge, but he has never handled customers without the trainer beside him. |
| newcomer 스텝 8 첫 문장 | 결정 1 | 교육 중인 상담사(OJT)와 막 교육을 마친 상담사는 붙어 있는 거리가 다릅니다. / You stay at a different distance from an agent in OJT and one just out of training. | OJT와 네스팅은 붙어 있는 거리가 다릅니다. / You stay at a different distance in OJT and in nesting. |
| newcomer 스텝 10 (EN) | 낮음 (EN 뜻) | …you gather the examples they decide on. | …you gather the examples to base it on. |
| newcomer 노드 4 (EN) | 낮음 (the lead) | Share with the lead | Share with the TL |
| escalation 스텝 2 (EN) | 중간 (지민 대명사) | He knows the work, but today's contact is beyond his authority. He messages you… | She knows the work, but today's contact is beyond her authority. She messages you… |
| escalation 스텝 8 (EN) | 중간 (지민 대명사) | …he can handle it himself. | …she can handle it herself. |
| escalation-q2 보기 c 피드백 (EN) | 낮음 (EN 단정) | When five people ask the same thing, the article is hard to find or unclear. | When five people ask the same thing, it is a sign the article is hard to find or unclear. |
| peer 노드 4 (EN) | 낮음 (the lead) | Talk to the lead | Talk to the TL |
| peer-q1 보기 c 피드백 | 중간 (본보기) | …팀은 직무전문가가 동기에게 본보기를 보였다고 받아들입니다. | …팀은 직무전문가가 동기를 본보기로 삼아 망신을 줬다고 받아들입니다. (EN 그대로) |
| lead 짧은 이름 (EN) | 낮음 (the lead) | Lead support | TL support |
| lead 노드 4 (EN) | 낮음 (the lead) | Report to the lead | Report to the TL |
| lead 스텝 1 (EN) | 낮음 (the lead) | …so the lead can spend time on coaching… | …so the team leader can spend time on coaching… |
| lead 스텝 2 | 낮음 (12명/15명) | 수진 팀장은 15명(예시) 팀을… / a team of 15 people (Example) | 수진 팀장은 12명(예시) 팀을… / a team of 12 people (Example) |
| lead 스텝 5 | 낮음 (요약 시점) | …상담사별로 반복되는 모습을 모아, 팀장이 코칭에 바로 쓸 수 있게 짧게 정리합니다. / …collect what keeps showing up for each agent and sum it up briefly… | …모아, 정해진 날(예시: 매주 금요일) 팀장이 코칭에 바로 쓸 수 있게 짧게 정리합니다. / …collect what keeps showing up for each agent, and on the agreed day (Example: every Friday) sum it up briefly… |
| lead 스텝 6 | 낮음 (3건 예시), 낮음 (the lead) | "지민: 이번 주 환불 문의 3건에서…" / "…in 3 refund contacts this week," … the lead can coach from… | "지민: 이번 주 환불 문의 3건(예시)에서…" / "…in 3 refund contacts (Example) this week," … the team leader can coach from… |
| lead 스텝 10 (EN) | 낮음 (the lead) | …so the lead sees at a glance what happened while away. | …so the team leader sees at a glance what happened while she was away. |
| priority 노드 4 (EN) | 낮음 (the lead) | Call the lead | Call the TL |
| priority 스텝 5 (EN) | 낮음 (EN 어색) | If two are equally urgent, take the one with an upset customer and the new hire's first. | If two are equally urgent, take the upset customer's case or the new hire's first. |
| priority 스텝 8 (EN) | 낮음 (the lead) | The lead can help support… | The team leader can help support… |
| knowledge 스텝 2 첫 문장 | 중간 (주된 일) | 스크러빙은 직무전문가의 주된 일입니다. (EN은 이미 "one of") | 스크러빙은 직무전문가의 주된 일 가운데 하나입니다. |
| knowledge 스텝 3 셋째 문장 | 중간 (어느 SOP) | 절차는 SOP 스크러빙에 있습니다. / The procedure is in the Scrubbing SOP. | 절차는 직무전문가 SOP의 스크러빙에 있습니다. / The procedure is in Scrubbing in the SME SOP Library. |
| knowledge 스텝 6 | 낮음 (평가 표현) | …각자 평가하고 점수 차이를 맞춥니다. 직무전문가는 상담사가 현장에서 실제로 겪는 상황을 알려 주는 역할을 합니다. / …The SME brings what agents really face on the floor. | …각자 채점하고 점수 차이를 맞춥니다. 직무전문가는 상담사를 평가하러 가는 것이 아니라, 상담사가 현장에서 실제로 겪는 상황을 알려 주러 갑니다. / …The SME is there not to evaluate agents but to bring what they really face on the floor. |
| knowledge 스텝 7 첫 문장 | 중간 (기준 전달, "함께 볼 곳") | 캘리브레이션에서 기준이 바뀌면 상담사들에게 먼저 전하는 사람도 직무전문가입니다. / …the SME is also the one who tells the agents first. | 캘리브레이션에서 기준이 바뀌면 팀장과 맞춰 상담사들에게 먼저 전하는 것도 직무전문가의 일입니다. / …the SME also agrees with the team leader and tells the agents first. |
| knowledge-q1 보기 a 피드백 (EN) | 중간 (지민 대명사) | Naming him embarrasses Jimin… | Naming her embarrasses Jimin… |
| knowledge 마지막 연결 | 중간 (→ home), 계획 Task B 2번 | 직무전문가 첫걸음을 마쳤습니다. 더 깊이 보고 싶다면 팀장 SOP 라이브러리의 스크러빙, 캘리브레이션, 기존 상담사 육성을 이어서 보세요. / …continue with Scrubbing, Calibration and Developing Existing Agents in the TL SOP Library. | 직무전문가 첫걸음을 마쳤습니다. 다음으로 직무전문가 서포트 라이프사이클에서 신입이 선임으로 자라는 단계마다의 지원 절차를 보세요. 스크러빙과 캘리브레이션 절차는 직무전문가 SOP 라이브러리에 있습니다. / You have finished SME First Steps. Next, SME Support Lifecycle walks through the support at each stage as a new hire grows into a senior. The scrubbing and calibration procedures are in the SME SOP Library. |

##### 직무전문가 서포트 라이프사이클 (sme-lifecycle)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| 강의 소개 (ui.js·문안) | 낮음 (tagline) | 상담사 한 사람이 교육 중에서 선임으로 자라는 동안, 단계마다… / …as one agent grows from training to senior… | 교육 중인 상담사가 정식 상담사, 선임으로 자라는 단계마다 직무전문가가 따르는 지원 절차를 배웁니다. 마지막은 팀장 지원입니다. / Learn the support procedure an SME follows at each stage as agents grow from training to regular and senior. The last stage is supporting the team leader. |
| 원 안 짧은 이름 (EN), leadsupport 짧은 이름 | 낮음 (the lead) | … · Lead support | … · TL support |
| trainee 스텝 1 둘째 문장 | 낮음 (준호) | 이 강의는 서준 한 사람이 자라는 순서를 따라 단계마다 직무전문가의 절차를 봅니다. / This course follows one agent, Seojun, as he grows, and looks at… | 이 강의는 서준이 자라는 순서를 따라 단계마다 직무전문가의 절차를 보고, 선임 단계에서는 준호를 만납니다. / This course follows Seojun as he grows, looks at the SME's procedure at each stage, and meets Junho at the senior stage. |
| trainee 스텝 2 | 높음 1 (결정 1) | (두 문장, 수료 언급 없음) | 끝에 "수료는 OJT와 네스팅을 모두 마친 뒤입니다." / "He graduates only after both OJT and nesting." 추가 |
| trainee 스텝 3 | 높음 2 (결정 5) | 교육 과정과 수료 판단은 트레이너가 맡습니다. / The trainer owns the curriculum and decides who graduates. | 교육 과정은 트레이너가 맡고, 수료 여부는 트레이너와 팀장이 정합니다. / The trainer owns the curriculum, and the trainer and the team leader decide who graduates. |
| trainee 스텝 5·6 (EN) | 낮음 (multi-headset) | Connect a multi-headset… / …listens in on the multi-headset instead. | Connect a second headset with a splitter… / …listens in on the second headset instead. (한국어 "멀티 헤드셋"은 그대로) |
| trainee 스텝 10 | 높음 1 (결정 1) | 수료 일주일 전(예시)에… / A week before graduation (Example)… | OJT가 끝나기 일주일 전(예시)에… / A week before OJT ends (Example)… |
| trainee 스텝 11 | 높음 1·2 (결정 1·5) | 수료 여부를 정하는 것은 트레이너와 팀장입니다. 직무전문가는 기록을 근거로 의견을 전합니다. / Whether he graduates is up to… | 수료는 네스팅이 끝날 때 트레이너와 팀장이 정합니다. 직무전문가의 기록은 그때 의견을 전하는 근거가 됩니다. / The trainer and the team leader decide on graduation when nesting ends. The SME's record is the basis for the opinion you give then. |
| trainee → graduate 연결 | 높음 1 (결정 1) | 서준이 교육을 수료했습니다. 이제 트레이너의 손을 떠나 직무전문가 곁에서 실제 문의를 받는 네스팅입니다. / Seojun has graduated from training… | 서준이 OJT를 마쳤습니다. 다음은 수료 전 마지막 단계, 직무전문가 곁에서 실제 문의를 받는 네스팅입니다. / Seojun has finished OJT. Next is nesting, the last stage before graduation, where he takes real contacts beside the SME. |
| graduate 제목 | 결정 1 (내 판단) | 교육을 마친 상담사 지원 / Supporting Agents Just Out of Training | 네스팅 중인 상담사 지원 / Supporting Agents in Nesting |
| graduate 노드 4 | 결정 1 | 졸업 점검 (EN Graduation review) | 수료 점검 (EN 그대로) |
| graduate 스텝 1 | 결정 1 | …그리고 정식 팀으로 넘기는 기준… / …the rule for moving to a regular team. | …그리고 수료해 정식 팀으로 넘기는 기준… / …the rule for graduating to a regular team. |
| graduate 스텝 2 | 높음 1 (결정 1) | 서준이 교육을 수료했습니다. 앞으로 2주(예시) 동안… / Seojun has graduated. For the next two weeks… | 서준이 OJT를 마쳤습니다. 수료 전 마지막 단계로, 앞으로 2주(예시) 동안 네스팅 그룹에서 실제 문의를 받습니다. / Seojun has finished OJT. As the last stage before graduation, he takes real contacts in the nesting group for the next two weeks (Example). |
| graduate 스텝 9 | 결정 1·5 | 넷째 단계는 졸업 점검입니다. …수진 팀장과 함께 보고, 정식 팀으로 넘길지 네스팅을 늘릴지 정합니다. 결정은 팀장이 합니다. | 넷째 단계는 수료 점검입니다. 네스팅이 끝나기 전에 기록을 트레이너, 수진 팀장과 함께 보고 의견을 전합니다. 수료해 정식 팀으로 보낼지 네스팅을 늘릴지는 트레이너와 팀장이 정합니다. / …go through the record with the trainer and Sujin and give your view. The trainer and the team leader decide whether he graduates to a regular team or stays longer in nesting. |
| graduate-q2 해설 | 결정 5 | 넘길지 늘릴지는 팀장이 정합니다. / The team leader decides whether to move him or extend nesting. | 수료할지 네스팅을 늘릴지는 트레이너와 팀장이 정합니다. / The trainer and the team leader decide whether he graduates or nesting is extended. |
| graduate → regular 연결 | 결정 1 | 서준이 정식 팀에 합류했습니다. / Seojun has joined a regular team. | 서준이 수료하고 정식 팀에 합류했습니다. / Seojun has graduated and joined a regular team. |
| senior 스텝 9 | 낮음 (승진) | 승진은 팀장과 매니저가 정하고… / Promotions are decided by… | 승진은 팀장과 매니저가 검토해 추천하고… / Promotions are reviewed and recommended by… |
| leadsupport 스텝 2 | 결정 5 (내 판단) | 누구를 네스팅에서 정식 팀으로 넘길지, 누구에게 버디를 맡길지 같은 결정입니다. / …who moves from nesting to a regular team and who becomes a buddy. | 누구를 다시 가까이 지원할지, 누구에게 버디를 맡길지 같은 결정입니다. / …who needs close support again and who becomes a buddy. |

##### 직무전문가 SOP 라이브러리 (sme-sop)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| approval 노드 4 (EN) | 낮음 (the lead) | Hand to the lead | Hand to the TL |
| scrubbing-q1 보기 a 피드백 | 중간 (짧은 티켓) | 짧게 끝난 티켓은 대개 문제가 없습니다. … / Tickets that ended quickly usually have no problem. … | 처리 시간으로는 고객이 만족했는지 알 수 없습니다. … / Handling time doesn't tell you whether the customer was satisfied. … |
| scrubbing-q2 질문 | 낮음 (정보 누락) | 환불이 늦어 DSAT가 난 티켓의 원인이 고객사 결제 시스템 장애였습니다. … | 환불이 늦어 DSAT가 난 티켓을 보니 상담사 안내는 맞았고, 원인은 고객사 결제 시스템 장애였습니다. … / A DSAT from a late refund: the agent's explanation was correct, and the cause was an outage in the client's payment system. … |
| trend-q2 보기 c 피드백 | 낮음 (공식 조치) | 주의나 경고는 팀장의 몫입니다. / Cautions and warnings… | 공식 주의나 경고는 팀장의 몫입니다. / Formal cautions and warnings… |
| attendance 스텝 1 (EN) | 낮음 (the lead) | …on the lead's behalf… | …on the team leader's behalf… |
| attendance 스텝 4 | 중간 (개인정보) | …사유가 타당한지는 판단하지 않습니다. / Don't judge whether the reason is valid. | …사유가 타당한지는 판단하지 않고, 건강 같은 개인 사정은 캐묻거나 자세히 적지 않습니다. / Don't judge whether the reason is valid, and don't probe into or write down details of health or other personal matters. |
| attendance 스텝 6 | 낮음 (RTA만) | …RTA에게 바로 알려… / …tell the RTA right away… | …RTA와 수진 팀장에게 바로 알려… / …tell the RTA and Sujin right away… |
| huddle 스텝 3 셋째 문장 | 중간 (고객사 경로) | 모호한 부분은 허들 전에 고객사 담당이나 수진 팀장에게 묻습니다. / Ask the client contact or Sujin about anything unclear before the huddle. | 모호한 부분은 허들 전에 수진 팀장이나, 정해진 경로로 고객사 담당에게 묻습니다. / Before the huddle, ask Sujin, or the client contact through the agreed channel, about anything unclear. |
| calibration 스텝 6 | 중간 (기준 전달 역할) | …상담사들이 알도록 허들과 팀 채팅방에서 먼저 전합니다. / …tell agents first at the huddle and in the team chat, before they are scored on it. | …상담사들이 알도록 팀장과 맞춰 허들과 팀 채팅방에서 먼저 전합니다. QA의 공식 공유가 나오면 그 내용도 다시 알립니다. / …agree with the team leader and tell agents first … before they are scored on it. When QA's official summary comes out, share that too. |
| voc 부제 | 낮음 | 상담사가 바꿀 수 없는 고객의 목소리를, … | 상담사 선에서 풀 수 없는 고객의 목소리를, … (EN 그대로) |
| voc-q2 보기 c 피드백 | 중간 (고객사 경로) | 고객사와의 소통은 팀장과 정해진 경로를 거칩니다. 혼자 연락하면… / Communication with the client goes through… Reaching out alone… | 고객사에 문제를 올리는 것은 팀장과 정해진 경로를 거칩니다. 혼자 항의하면… / Raising issues with the client goes through… Complaining on your own… |
| kbrequest-q1 보기 c | 중간 (계정 공유) | 권한이 없어도 동료 계정으로 문서를 직접 고친다. / Fix the article yourself with a colleague's account, even without permission. | 편집 권한이 있으니 검토 없이 바로 고친다. / You have edit access, so fix it yourself right away without review. (피드백 그대로) |

##### 직무전문가 길잡이 (sme-guide)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| m3 "이어서" (data.js, 설계 문서 §5·§7) | 낮음 (OJT 링크) | 팀장 SOP · 신규 입사자 온보딩 / TL SOP · New Hire Onboarding, `../sop-library/#onboarding-0` | 상담사 라이프사이클 레슨 3 · OJT 및 네스팅 / Agent Lifecycle lesson 3 · OJT and Nesting, `../agent-lifecycle/#nesting-0` |
| m4 먼저, m5 이어서 (data.js, 설계 문서 §5·§7) | 위 레슨 2 제목 변경에 따름 | 직무전문가 서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원 / …Supporting Agents Just Out of Training | 직무전문가 서포트 라이프사이클 레슨 2 · 네스팅 중인 상담사 지원 / …Supporting Agents in Nesting |
| tests/sme-guide.test.js | m3 링크 변경에 따름 | m3 then 기대값 `../sop-library/#onboarding-0` (2곳), 링크 대상 강의 목록에 상담사 라이프사이클 없음 | 기대값 `../agent-lifecycle/#nesting-0`. COURSES에 `agent-lifecycle/` 추가(이름 "상담사 라이프사이클 레슨 N · 제목" / "Agent Lifecycle lesson N · title"). 링크 이름이 실제 레슨 제목과 같은지 확인하는 기존 테스트가 이 링크에도 적용됨 |

#### 반영하지 않은 항목

- 중간 "체크포인트 전반 — 정답이 가장 긴 보기"에 붙은 문안(trend-q2 b, huddle-q2 b, senior-q1 b, attendance-q1 a, kbrequest-q1 a, trainee-q2 a): 정답 길이만을 위한 제안이라 결정 3에 따라 2단계로 넘깁니다.
- 높음 "review · sme-q5", 중간 "review · sme-q1", "review · sme-q2", 낮음 "review 관련 레슨 제목", 중간 대명사 행의 "review sme-q5" 부분: 복습 퀴즈(review/data.js)는 Task C 담당입니다.
- 높음 "sop · nurture 스텝 7"(버디·멘토 지정): 팀장 SOP 파일이라 Task D 담당입니다(아래 넘길 것). 직무전문가 쪽(sme-lifecycle regular 스텝 9, senior 스텝 5)은 이미 "팀장이 정한다"로 맞아 있어 고치지 않았습니다.
- huddle-q1 보기 b("고객사 담당이나 팀장에게 확인하고…"): 리뷰가 "함께 볼 곳"으로만 적고 고칠 문안을 내지 않았고, 정답 보기를 늘리게 되므로 그대로 두었습니다. 스텝 3을 고쳐서 경로는 맞췄습니다.
- graduate-q2 정답 b("…수진 팀장에게 보여 주고…"): 결정 5에 맞추려고 트레이너를 넣으면 정답이 더 길어집니다. 팀장과 상의하는 것이 틀린 행동은 아니라서 그대로 두고 해설만 "트레이너와 팀장"으로 고쳤습니다.
- 한국어 "멀티 헤드셋": 리뷰대로 사용자가 알려 준 현장 용어라 그대로 두고 영어만 고쳤습니다.

#### 다른 Task에 넘길 것

- **Task C**: 복습 퀴즈 sme-q1·q2·q5, 관련 레슨 제목, 지민 대명사. 직무전문가 서포트 라이프사이클 레슨 2 제목이 "네스팅 중인 상담사 지원 / Supporting Agents in Nesting"으로 바뀌었습니다(지금 review/data.js에는 이 레슨을 가리키는 곳이 없음). 첫걸음 레슨 5의 영어 짧은 이름은 이제 "TL support"입니다. tl-support trainers 스텝 3·6(OJT가 수료 전에 있음)도 결정 1에 맞춰야 합니다.
- **Task D**: 팀장 SOP nurture 스텝 7은 결정 5에 따라 "당신(팀장)이 직무전문가·T&D와 상의해 멘토 역할을 맡긴다"로 고쳐야 합니다(리뷰 직무전문가 높음 3의 문안). 상담사 라이프사이클 레슨 3 제목은 이미 "OJT 및 네스팅"으로 바뀌어 있어 직무전문가 길잡이 m3 링크 이름 테스트가 통과합니다. 이 제목이 다시 바뀌면 sme-guide/data.js와 설계 문서 §5·§7도 함께 바꿔야 합니다.
- **Task E (컨트롤러)**:
  - `codex/data/daily.js`(261, 320행)와 `2026-11-19-codex-one-pagers-copy-ko.md`에 "품질 교정 미팅"이 남아 있습니다(결정 4). 어느 Task의 파일도 아니고 Codex는 검수 범위 밖이었습니다.
  - 문안 문서 `2026-11-25-sme-course-copy.en.md` §2 직급 선택지 "Team Lead"(shared/role-data.js와 같은 값)는 role-select 범위라 건드리지 않았습니다.
  - `/tmp/gen/gen_sl.py`는 lessons 3번째 줄 주석을 "// 서포트 라이프사이클, lesson N"으로 씁니다. 다시 돌린다면 "SME " 접두어를 되돌리세요(`/tmp/fixes/B/regen.sh` 참고). `/tmp/gen/gen_guide.py`는 낡아서 쓰면 안 됩니다.

#### 내가 내린 판단

- **결정 1에 맞춰 리뷰 문안을 다시 씀**: 리뷰는 "OJT까지 마쳐야 수료 → 수료 뒤 네스팅"을 전제로 썼습니다. 그래서 서포트 라이프사이클 레슨 1·2와 첫걸음 레슨 2를 "이론 교육 → OJT → 네스팅 → 수료 → 정식 팀"으로 다시 썼습니다. trainee 스텝 2에는 "수료는 OJT와 네스팅을 모두 마친 뒤입니다"를 넣었고, newcomer 스텝 2의 서준은 "오늘 팀 합류"가 아니라 "이번 주부터 네스팅"입니다.
- **서포트 라이프사이클 레슨 2 제목 변경**(리뷰에 없음): 수료가 네스팅 뒤로 오면 "교육을 마친 상담사 지원"은 틀린 말이 됩니다. 그래서 "네스팅 중인 상담사 지원 / Supporting Agents in Nesting"으로 바꾸고, 노드도 "졸업 점검"에서 "수료 점검"으로 바꿨습니다. 레슨 id `graduate`는 그대로입니다. 첫걸음 레슨 2 제목("교육 중·막 교육을 마친 상담사 서포트")은 길잡이와 복습 퀴즈가 쓰고 있어서 그대로 두고, 본문(스텝 2·8)만 고쳤습니다.
- **수료 점검(graduate 스텝 9·해설)과 leadsupport 스텝 2**(리뷰에 없음): 결정 5(수료는 트레이너와 팀장이 함께 정함)에 맞췄습니다. leadsupport 스텝 2의 "팀장이 누구를 네스팅에서 정식 팀으로 넘길지 정한다"는 팀장 혼자 정하는 것처럼 읽혀서 "누구를 다시 가까이 지원할지"로 바꿨습니다.
- **knowledge 스텝 7**(리뷰에서는 "함께 볼 곳"): SOP calibration 스텝 6과 같은 뜻이 되도록 "팀장과 맞춰"를 넣었습니다.
- **"the lead" 바꾸는 방식**: 스텝 문장은 "the team leader"로 바꿨습니다. 노드와 짧은 이름은 칸이 좁아서 "the TL"과 "TL support"로 썼습니다(리뷰 제안대로).
- **lead 스텝 10 (EN)**: "while away"는 주어가 없어서 "while she was away"로 썼습니다(수진 팀장).
- **첫걸음 마지막 연결**: 리뷰 문안 "다음은 … 보세요"는 문장이 맞지 않아서 "다음으로 … 보세요"로 고쳐 썼습니다.
- **attendance 스텝 4**: 리뷰 문안 그대로 넣었습니다. "사유를 그대로 받는다"와 "자세히 적지 않는다"를 한 스텝에 함께 두어, 사유는 받되 건강 정보는 자세히 적지 않는다는 뜻이 되게 했습니다.

---

## 팀장 1부 (Task C)

### Task C 변경 목록 — 팀장 1부 (팀장 첫걸음 · 팀장 서포트 라이프사이클 · 팀장 길잡이 · 복습 퀴즈 전체)

상태: **DONE**

검증: `cd agent-lifecycle && node --test tests/tl-courses.test.js tests/guide.test.js tests/review.test.js tests/korean-role-names.test.js`
결과: **96개 통과 / 0개 실패**

고친 파일
- 문안: `docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md`·`.en.md`, `2026-11-25-tl-support-copy-ko.md`·`.en.md`, `2026-11-25-review-quiz-copy-ko.md`·`.en.md`, `2026-11-19-situation-guide-design.md`(길잡이 표), `2026-11-22-team-leader-self-copy.md`·`.en.md`(s18 "이어서 볼 곳" 행만. guide.test가 이 행과 대조함)
- 코드: `tl/lessons/01,03,04,05,06,07`, `tl-support/lessons/01,02,04`, `tl-support/ui.js`, `review/data.js`, `guide/data.js`, `guide/index.html`
- 테스트: `agent-lifecycle/tests/guide.test.js` — 링크 검사에 `tl-support/` 주소 확인을 추가하고, "팀장 서포트 라이프사이클 레슨 N · 제목" 링크의 제목이 실제 레슨 제목(한·영)과 같은지 확인하도록 늘림(약하게 만든 곳 없음)
- id(레슨·질문·보기·정답)는 하나도 바꾸지 않았습니다. 정답 위치도 그대로입니다.

#### 변경 표

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| tl · start 스텝 9 (EN) | 낮음 · 어순 | (같음) / They are curious too about what the new team leader will do. | (같음) / They are also curious about what the new team leader will do. |
| tl · start-q2 보기 a | 중간 · 노드만 보고 정답이 보임 | 팀 계획 → 팀원 파악 → 개인 성과 / Team plan → know the people → individual results | 개인 성과 → 팀원 파악 → 팀의 기여 → 첫 계획 / Individual results → know the people → team contribution → first plan |
| tl · start-q2 a 피드백 | 중간 · 같은 항목 | 팀원과 성과를 모른 채 세운 계획은 현실과 어긋나기 쉽습니다. / A plan made without knowing the people and their results easily misses reality. | 숫자를 먼저 보면 그 숫자 뒤의 사람과 사정을 놓칩니다. / Looking at numbers first misses the people and circumstances behind them. |
| tl · start-q2 보기 c | 중간 · 같은 항목 | 개인 성과 → 첫 계획 → 팀원 파악 / Individual results → first plan → know the people | 팀의 기여 → 팀원 파악 → 개인 성과 → 첫 계획 / Team contribution → know the people → individual results → first plan |
| tl · start-q2 c 피드백 | 중간 · 같은 항목 | 숫자만 보고 계획하면 그 숫자 뒤의 사람과 사정을 놓칩니다. / Planning from numbers alone misses the people and circumstances behind them. | 팀 전체부터 보면 한 사람 한 사람이 가려지고, 기여의 원인도 보이지 않습니다. / Starting with the whole team hides each person, and you can't see what drives the contribution. |
| tl · results 스텝 2 | 낮음 · 평균 처리 시간(AHT) 용어 | 티켓 처리 건수, 처리 시간(AHT), / ticket volume, handling time (AHT), | 티켓 처리 건수, 평균 처리 시간(AHT), / ticket volume, average handle time (AHT), |
| tl · results-q1 보기 b | 낮음 · 조사 어색 (EN 그대로) | 실제 응대를 들어 볼 질문으로 메모한다. / (같음) | 실제 응대를 들으며 확인할 질문을 메모한다. / (같음) |
| tl · listen 제목(+문안 md 제목 줄) | 낮음 · 콜 레코딩→녹취 ※사용자가 쓴 말을 바꿈 | 콜 레코딩과 티켓 직접 보기 / (같음) | 녹취와 티켓 직접 보기 / (같음) |
| tl · listen 스텝 1 | 낮음 · 같은 항목 ※사용자가 쓴 말 | 이 레슨의 목적은 콜 레코딩과 티켓을 직접 보며, / (같음) | 이 레슨의 목적은 녹취와 티켓을 직접 보며, / (같음) |
| tl · listen 부제 | 낮음 · 문장 구조 | 숫자 뒤에 있는 실제로 일하는 방식을 확인합니다. / See the real way people work behind the numbers. | 숫자 뒤에서 실제로 어떻게 일하는지 확인합니다. / See how people really work behind the numbers. |
| tl · listen-q2 해설 | 중간 · 바른 안내부터 공유 | 여러 사람이 같은 실수를 하면 사람보다 원인을 먼저 확인합니다. / When several people make the same mistake, check the cause before the people. | 여러 사람이 같은 실수를 하면 사람보다 원인을 먼저 확인합니다. 다만 잘못된 안내가 지금도 고객에게 나가고 있다면, 바른 안내부터 팀에 바로 공유합니다. / When several people make the same mistake, check the cause before the people. But if the wrong explanation is still reaching customers, share the correct one with the team right away. |
| tl · contribution-q2 보기 c | 낮음 · 예시 표기 | 지난 6개월의 모든 지표 원본 / Raw data for every metric over the last 6 months | 지난 6개월(예시)의 모든 지표 원본 / Raw data for every metric over the last 6 months (Example) |
| tl · oneonone 스텝 7 셋째 문장 | 낮음 · 중의적 표현 | 예를 들어 준호에게는 마무리 확인 습관이 잡힐 때까지 신입 버디를 잠시 쉬게 하고, 그 습관을 함께 봅니다. / For example, give Junho a break from the new-hire buddy role until his habit of checking before closing is in place, and work on it with him. | 예를 들어 준호는 마무리 확인 습관이 잡힐 때까지 신입 버디 역할을 잠시 쉬고, 그 습관을 함께 봅니다. / For example, Junho steps back from the new-hire buddy role until his habit of checking before closing is in place, and you work on it with him. |
| tl · oneonone-q1 보기 a | 낮음 · 예시 표기 | 지난 6개월 성과를 보니 / Looking at your last 6 months, there's | 지난 6개월(예시) 성과를 보니 / Looking at your last 6 months (Example), there's |
| tl · direction 제목 (EN, 문안 md 제목 줄 포함) | 낮음 · AM/OM 풀어 쓰기 | (같음) / Getting Direction from Your AM or OM | (같음) / Getting Direction from Your Assistant Manager or Operation Manager |
| tl · direction 스텝 9 | 낮음 · 예시 표기 | 한 달 뒤 결과를 들고 / A month later, meet Minseok again | 한 달(예시) 뒤 결과를 들고 / A month later (Example), meet Minseok again |
| tl · direction-q1 보기 a | 낮음 · 예시 표기 | 팀원 15명의 모든 기록 원본 / All the raw records for 15 team members | 팀원 15명(예시)의 모든 기록 원본 / All the raw records for 15 team members (Example) |
| tl-support · 강의 소개 (ui.js courseTagline + 문안 "강의 소개" 행) | 낮음 · QA·트레이너는 팀원이 아님 | 팀장이 팀을 이루는 상담사, 직무전문가, QA, 트레이너를 / Learn how a team leader supports each role on the team: agents, SMEs, QA and trainers. | 팀장이 함께 일하는 상담사, 직무전문가, QA, 트레이너를 / Learn how a team leader supports each role they work with: agents, SMEs, QA and trainers. |
| tl-support · agents 스텝 3 | 낮음 · 1:1 주기를 상담사 강의와 맞춤 | 정기적인 1:1(예시: 2주에 한 번)로 듣습니다. / in regular one-on-ones (Example: every two weeks). | 정기적인 1:1(예시: 매주 평가 리뷰 때)로 듣습니다. / in regular one-on-ones (Example: at the weekly score review). |
| tl-support · agents 스텝 6 | 높음 · PIP는 성과 문제에만 (결정 5) | 코칭으로 풀리지 않으면 성과 개선 계획(PIP) 절차를 따릅니다. / If coaching doesn't solve it, follow the performance improvement plan (PIP) procedure. | 성과 문제가 코칭으로 풀리지 않으면 성과 개선 계획(PIP)을, 근태나 행동 문제는 센터의 근태 규정과 인사 절차를 따릅니다. / If coaching doesn't fix a performance problem, follow the performance improvement plan (PIP); for attendance or conduct, follow the center's attendance rules and HR procedure. |
| tl-support · sme 스텝 6 셋째 문장 | 낮음 · 꼭 필요한 사람(부매니저, 인사) | 근태나 성과 조치의 내용은 당사자와만 다룹니다. / keep attendance or performance actions between you and the agent. | 근태나 성과 조치의 내용은 당사자와 꼭 필요한 사람(부매니저, 인사 담당)하고만 다룹니다. / keep attendance or performance actions between you, the agent and only those who must know, such as your assistant manager or HR. |
| tl-support · sme-q2 보기 b (EN) | 낮음 · "처리했다" 빠짐 | (같음) / tell Harin only that you have taken it over. | (같음) / tell Harin only that you have taken it over and handled it. |
| tl-support · trainers 스텝 3 | 결정 1 · 순서(네스팅 → 수료) | 신입의 교육 기록, 수료 평가, 네스팅에서 더 볼 유형을 유나에게 받아 / Get new hires' training records, completion assessments and the types to watch in nesting from Yuna, | 신입의 교육 기록, 네스팅에서 더 볼 유형, 수료 평가를 유나에게 받아 / Get new hires' training records, the types to watch in nesting and completion assessments from Yuna, |
| tl-support · trainers 스텝 6 | 결정 1 · "수료 뒤 네스팅" 삭제 | 유나와 함께 수료를 미루고 추가 교육을 할지, 수료 뒤 네스팅 기간을 늘릴지 정합니다. / decide with Yuna whether to hold back completion for extra training or to extend nesting after it. | 유나와 함께 수료를 미루고, 네스팅 기간을 늘릴지 추가 교육을 할지 정합니다. / decide with Yuna to hold back completion, and whether to extend nesting or add extra training. |
| tl-support · trainers-q2 보기 a | 결정 1 · 수료 직전이면 네스팅은 이미 지남 | 인원이 급하니 네스팅 없이 바로 정식 팀에 투입한다. / You need people, so put them on the regular team right away, without nesting. | 인원이 급하니 예정대로 수료시켜 바로 정식 팀에 투입한다. / You need people, so let them complete on schedule and put them on the regular team right away. |
| tl-support · trainers-q2 보기 b (정답) | 결정 1 · 같은 항목 | 트레이너와 함께 수료를 미루고 추가 교육을 할지, 수료 뒤 네스팅을 늘릴지 정한다. / Decide with the trainer whether to hold back completion for extra training or extend nesting after it. | 트레이너와 함께 수료를 미루고, 네스팅을 늘릴지 추가 교육을 할지 정한다. / Decide with the trainer to hold back completion, and whether to extend nesting or add extra training. |
| review · REVIEW_UI.intro | 중간 · 팀장 퀴즈 범위와 맞춤 | 직급 강의를 모두 마쳤다면, 여러 레슨을 / Finished your role's courses? Review with | 범위에 적힌 강의를 모두 마쳤다면, 여러 레슨을 / Finished the courses listed in the scope? Review with |
| review · REVIEW_UI.nameTl (EN, 문안 md 제목 줄 포함) | 낮음 · team lead→TL | (같음) / Team lead review quiz | (같음) / TL review quiz |
| review · tl-q1 질문 (EN) | 중간 · 지민 she/her (결정 2) | (같음) / His FCR and QA accuracy are high. | (같음) / Her FCR and QA accuracy are high. |
| review · tl-q1 보기 b (EN) | 중간 · 같은 항목 | (같음) / find what he does well and which parts can be shorter. | (같음) / find what she does well and which parts can be shorter. |
| review · tl-q2 질문 (EN) | 중간 · 같은 항목 | (같음) / but he keeps skipping the same check step. | (같음) / but she keeps skipping the same check step. |
| review · tl-q2 보기 a (EN) | 중간 · 같은 항목 | (같음) / Coach him once more on the same thing. | (같음) / Coach her once more on the same thing. |
| review · tl-q2 보기 b (EN) | 중간 · 같은 항목 | (같음) / Suggest he leave, since there is no sign of improvement. | (같음) / Suggest she leave, since there is no sign of improvement. |
| review · tl-q3 보기 a (정답) | 높음 · SOP대로 부매니저·매니저에게 보고 | 같은 불만이 몰린다는 사실을 매니저·QA·WFM에 바로 공유한다. / Let that agent take a short break, and tell the OM, QA and WFM right away that the same complaint is piling up. | 같은 불만이 몰린다는 사실을 부매니저나 매니저에게 바로 보고한다. / Let that agent take a short break, and report to your assistant manager or operation manager right away that the same complaint is piling up. |
| review · tl-q3 해설 | 높음 · 같은 항목 | 사람을 먼저 보호하고, 몰리는 불만은 여러 팀이 함께 움직이도록 바로 알립니다. / Protect the person first, and raise the surge right away so several teams can move together. | 사람을 먼저 보호하고, 몰리는 불만은 부매니저나 매니저에게 바로 알려 여러 팀이 함께 움직이게 합니다. / Protect the person first, and report the surge to your assistant manager or operation manager right away so several teams can move together. |
| review · tl-q4 질문 | 낮음 · 어색한 표현 | "교대 근무가 이렇게 잦은 줄 몰랐다"는 말이 두 번째 나왔습니다. / (같음) | "교대 근무가 이렇게 잦은 줄 몰랐다"는 말이 벌써 두 번째로 나왔습니다. / (같음) |
| review · tl-q4 a 피드백 (EN) | 낮음 · rota → schedule | (같음) / the day they get their first rota. | (같음) / the day they get their first schedule. |
| review · tl-q5 보기 c (정답) | 낮음 · 캘리브레이션 진행은 QA | 평가 기준의 문제로 보고 QA와 캘리브레이션 세션을 열어 기준을 맞춘 뒤, 결과를 팀 전체에 알린다. / Treat it as a question about the standard: hold a calibration session with QA to align it, then tell the whole team the outcome. | QA에 캘리브레이션 세션을 요청해 기준을 맞추고, 결과를 팀 전체에 알린다. / Ask QA for a calibration session to align the standard, then tell the whole team the outcome. |
| review · tl-q6 질문 | 높음 · 실전 배치 후 첫 주 (결정 1) | 첫 주를 보내는 신입 서아가 질문을 거의 하지 않습니다. / Seoa, a new hire in her first week, hardly asks any questions. | 실전 배치 후 첫 주를 보내는 신입 서아가 질문을 거의 하지 않습니다. / Seoa, a new hire in her first week after Go Live, hardly asks any questions. |
| review · tl-q6 보기 c | 높음 · 같은 항목 | 아직 첫 주이니 한 달 동안은 지켜만 본다. / It is only the first week, so just watch for a month. | 아직 실전 첫 주이니 한 달 동안은 지켜만 본다. / It is only her first week live, so just watch for a month. |
| review · tl-q6 c 피드백 첫 문장 | 높음 · 같은 항목 | 첫 주는 가장 많이 떠나는 시기입니다. / The first weeks are when people are most likely to leave. | 실전 첫 몇 주는 가장 많이 떠나는 시기입니다. / The first weeks on the floor are when people are most likely to leave. |
| review · sme-q1 질문 | 중간 · 준호 쪽 고객은 기다리지 않음 | 동기 준호는 보상 승인을 요청했고, / your peer Junho asks for a compensation approval, | 동기 준호는 통화가 끝난 고객의 보상 승인을 티켓으로 요청했고, / your peer Junho asks by ticket for a compensation approval for a customer whose call has ended, |
| review · sme-q2 보기 c (정답) | 중간 · 승인 없는 보상은 팀장에게 바로 | 준호와 1:1로 누구에게나 같은 기준이라고 말하고, 반복된 사례는 팀장에게 건네는 요약에 담는다. / Tell Junho one on one that the standard is the same for everyone, and put the repeated cases in the summary for the team leader. | 준호와 1:1로 누구에게나 같은 기준이라고 말하고, 사례를 팀장에게 바로 알린다. / Tell Junho one on one that the standard is the same for everyone, and tell the team leader about the cases right away. |
| review · sme-q5 질문 | 높음 · 정답이 하나로 갈리게 + 지민 she | 캘리브레이션에서 확인 단계의 기준이 바뀌었습니다. 다음 날 지민이 바뀐 기준을 몰라 QA 점수가 낮게 나왔다며 찾아옵니다. / Calibration changed the standard for the check step. The next day, Jimin comes to you saying his QA score was low because he did not know about the change. | 캘리브레이션에서 확인 단계의 기준이 바뀌었고, 바뀐 기준의 평가는 모레부터입니다. 다음 날 지민이 처음 듣는 이야기라며 찾아옵니다. / Calibration changed the standard for the check step, and scoring on it starts the day after tomorrow. The next day, Jimin comes to you saying she has never heard of it. |
| review · sme-q5 보기 b | 높음 · 같은 항목 | 점수는 QA의 일이니 QA에게 물어보라고 한다. / Tell him to ask QA, since scores are QA's job. | 기준은 QA의 일이니 QA에게 물어보라고 한다. / Tell her to ask QA, since standards are QA's job. |
| review · sme-q5 보기 c | 높음 · 같은 항목 | QA에게 지민의 점수를 고쳐 달라고 요청한다. / Ask QA to correct Jimin's score. | QA에게 지민만 이번 평가에서 빼 달라고 요청한다. / Ask QA to leave Jimin out of this round of scoring. |
| review · sme-q5 c 피드백 | 높음 · 같은 항목 | 점수를 고치는 것은 평가의 일입니다. 같은 일이 다시 생기지 않게 기준을 전하는 것이 먼저입니다. / Correcting scores is part of evaluation. Passing on the standard so it doesn't happen again comes first. | 한 사람만 빼면 기준이 사람마다 달라집니다. 평가 전에 모두에게 기준을 전하는 것이 먼저입니다. / Leaving out one person makes the standard differ by person. Passing the standard to everyone before scoring comes first. |
| review · sme-q1~q6 관련 레슨 12곳 | 낮음 · 실제 레슨 이름으로 | 직무전문가 레슨  / SME lesson  | 직무전문가 첫걸음 레슨  / SME First Steps lesson  |
| review · 관련 레슨 레슨 2 | 낮음 · 같은 항목 | 레슨 2 · 신입 상담사 서포트 / lesson 2 · Supporting New Hires | 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트 / lesson 2 · Supporting Agents in Training or Just Trained |
| review · 관련 레슨 레슨 4 (EN, 2곳) | 낮음 · 같은 항목 | (같음) / lesson 4 · Supporting Former Peers | (같음) / lesson 4 · Supporting Senior Agents Who Were Your Peers |
| review · 관련 레슨 레슨 7 (EN, 2곳) | 낮음 · 같은 항목 | (같음) / lesson 7 · Giving Knowledge Back | (같음) / lesson 7 · Giving Knowledge Back to the Team |
| guide · s1 상황 | 중간 · AHT는 떨어질수록 좋음 | 팀원 한 명의 숫자(AHT, CSAT 등)가 몇 주째 떨어진다 / One team member's numbers (AHT, CSAT and so on) have been slipping for weeks | 팀원 한 명의 지표(AHT, CSAT 등)가 몇 주째 나빠진다 / One team member's metrics (AHT, CSAT and so on) have been getting worse for weeks |
| guide · s4 상황 (EN) | 낮음 · team lead→team leader | (같음) / want to grow into an SME or team lead | (같음) / want to grow into an SME or team leader |
| guide · s7 먼저 볼 곳 | 계획 Task C · 레슨 3 새 제목 (결정 1) | 라이프사이클 레슨 3 · 실전 배치 및 네스팅 / Lifecycle lesson 3 · Go Live and Nesting | 라이프사이클 레슨 3 · OJT 및 네스팅 / Lifecycle lesson 3 · OJT and Nesting |
| guide · s14 먼저 볼 곳, s18 이어서 볼 곳 (+팀장 본인 문안 md 2개의 s18 행) | 낮음 · Codex 페이지 제목과 맞춤 | Codex 원페이저 ④ 팀장의 하루 / Codex one-pager ④ A team lead's day | Codex 원페이저 ④ 직무별 일일 업무 가이드 · 팀장 / Codex one-pager ④ Daily Guide by Role · Team leader |
| guide · s16 이어서 볼 곳 | 낮음 · 팀장용 새 강의로 가는 상황 (제안) | Codex 원페이저 ① 운영 최적화 4대 원칙 (`../codex/#principles`) / Codex one-pager ① Four Optimization Principles | 팀장 서포트 라이프사이클 레슨 3 · QA 지원 (`../tl-support/#qa-0`) / TL Support Lifecycle lesson 3 · Supporting QA |
| guide/index.html meta description | (리뷰 밖, 같은 용어) 상황 수 17→18, team lead | 신입 팀장이 겪는 상황 17가지와 먼저 볼 곳. Seventeen situations a new team lead meets, and where to look first. | 신입 팀장이 겪는 상황 18가지와 먼저 볼 곳. Eighteen situations a new team leader meets, and where to look first. |

#### 반영하지 않은 항목
- **정답 길이 전용(결정 3, 2단계):** "tl·tl-support 체크포인트 전반, review tl-q1~q6"의 예시 문안(roster-q1 a, listen-q1 a·c, qa-q1 a·c, team-q2 a, trainers-q1 a, review tl-q2 a), "tl-support · team-q2 보기 b"(리뷰가 '체크포인트 전반의 대표 사례'라고 적음), 직무전문가 쪽 "체크포인트 전반"의 review 6문항.
- **길잡이 s18 이어서 볼 곳 → 팀장 첫걸음 레슨 1** ("guide 전반" 제안의 앞부분): 하지 않았습니다. s18의 이어서 볼 곳이 Codex "팀장의 하루"(주간 점검표)인 것은 11-22 승인 문안이고, guide.test(s18 테스트)와 브라우저 점검 (g7) "then opens the team leader's day with the week check"가 이 연결을 일부러 지키고 있습니다. 바꾸면 승인된 설계를 뒤집는 것이라 사용자 판단이 필요합니다. 대신 같은 제안의 뒷부분(s16 → 팀장 서포트 레슨 3)은 반영했습니다. 팀장 첫걸음으로 가는 상황은 아직 없습니다.
- `tl-course-copy-ko.md` 7행 "사용자가 알려 준 핵심: … 콜 레코딩 …"과 `tl-support-copy-ko.md` 7행 "사용자가 정한 것: … 팀 전체(상담사, 직무전문가, QA, 트레이너)" — 사용자의 말을 적어 둔 기록이라 그대로 두었습니다(화면에 나오지 않음). Review Focus 4의 "콜 레코딩" grep에는 이 한 줄이 걸립니다.
- `2026-11-19-situation-guide-design.md`의 "상황 17개" 같은 설계 당시 서술은 기록이라 두었습니다.

#### 다른 Task에 넘길 것
- **(Task A / E) 팀장 배지 영어 "team lead":** `practice/data.js` 44행 `Team lead course complete` / `Pass the team lead review quiz (5 or more of 6)`. 결정 4(team lead ✕)에 걸립니다. 이 문구는 `2026-11-25-review-quiz-copy.en.md` "## 2. Badges"의 "팀장 배지 이름/조건" 행과 review.test가 대조하므로, **두 파일을 함께** 바꿔야 합니다(제안: `TL course complete` / `Pass the TL review quiz (5 or more of 6)`, 짝인 `SME course complete`와 같은 꼴). practice/data.js가 Task A 파일이라 저는 문안 md도 건드리지 않았습니다.
- **(E, Codex 범위)** `codex/data/links.js` 129행 "a team lead's day", `codex/data/daily.js` 팀장 이름 "Team Lead" — 결정 4 용어. 어느 Task에도 속하지 않습니다.
- **(E, 브라우저 점검)** 길잡이 s16의 이어서 볼 곳이 `../tl-support/#qa-0`이 되었습니다. (g3)가 링크 36개를 모두 열어 보므로 새 주소도 함께 확인됩니다(링크 수는 그대로 36).
- **(E, README/LOG)** `README.en.md` 15행 TL First Steps 소개의 "listening to calls"는 그대로 맞습니다. 레슨 4 한국어 제목이 "녹취와 티켓 직접 보기"로 바뀐 것만 LOG에 적어 주세요.

#### 내가 내린 판단
- **팀장 서포트 trainers 레슨(결정 1):** 리뷰 항목에는 없지만 "수료 뒤 네스팅 기간을 늘릴지"(스텝 6, 체크포인트 2 보기 b)와 "수료 평가, 네스팅에서 더 볼 유형"(스텝 3)이 새 순서(교육 → OJT → 네스팅 → 수료 → 실전 배치)와 어긋나 고쳤습니다. 수료를 앞둔 신입은 이미 네스팅 중이므로, 오답 a의 "네스팅 없이 바로 투입"도 "예정대로 수료시켜 바로 정식 팀에 투입"으로 바꿨습니다(피드백은 그대로 맞음). 수료는 "유나(트레이너)와 함께" 정하므로 결정 5와도 맞습니다.
- **tl-q6(결정 1):** 리뷰 문안 그대로 "실전 배치 후 첫 주 / first week after Go Live"를 썼습니다. 상담사 첫걸음이 실전 배치를 영어로 "Go Live"라고 쓰므로 같은 말을 썼습니다.
- **Codex 링크 제목:** 리뷰는 "직무별 하루 · 팀장"을 제안했지만, 리뷰가 지적한 문제가 "Codex 페이지 제목(직무별 일일 업무 가이드 / Daily Guide by Role)과 다름"이라 페이지 제목을 그대로 써서 "Codex 원페이저 ④ 직무별 일일 업무 가이드 · 팀장 / Codex one-pager ④ Daily Guide by Role · Team leader"로 했습니다(길잡이의 다른 Codex 링크도 페이지 제목을 그대로 씀). s18 행은 승인 문안 `2026-11-22-team-leader-self-copy.md`·`.en.md`에도 있어 함께 바꿨습니다.
- **s16 이어서 볼 곳:** "guide 전반"은 '틀린 곳은 아니고 제안'이지만 결정 7에 따라 반영했습니다. 리뷰 예시대로 팀장 서포트 레슨 3(QA 지원)으로 바꿨고, 원래 연결(Codex ① 운영 최적화 4대 원칙)은 빠집니다. 먼저 볼 곳(5대 핵심팀 청사진)은 그대로입니다.
- **direction 스텝 9 (EN):** 리뷰 한국어 "한 달(예시) 뒤"를 영어에서는 읽기 쉽게 "A month later (Example), …"로 썼습니다.
- **tl-q5 보기 c:** 리뷰 문안대로 "평가 기준의 문제로 보고"를 뺐습니다. 이유는 역할(세션 진행은 QA)이지 정답 길이가 아니어서 이번에 반영했습니다.
- **start-q2 보기 a·c:** 정답 길이가 아니라 "정답만 네 단계를 다 담아 노드 이름으로 정답이 보인다"는 문제라 이번에 반영했습니다. 피드백도 리뷰 문안대로 바꿨습니다.
- **사용자가 쓴 표현을 바꾼 곳(결정 7 표시):** 팀장 첫걸음 레슨 4 제목과 스텝 1의 "콜 레코딩" → "녹취"(설계 메모상 사용자의 말). 결정 4 용어표(녹취, 콜 레코딩 ✕)에 따름.
- **guide/index.html:** 리뷰 항목 밖이지만 길잡이 파일이고 결정 4(team lead ✕)에 걸려, 메타 설명을 "상황 18가지 / Eighteen situations a new team leader meets"로 고쳤습니다(상황 수도 실제 18개에 맞춤).

---

## 팀장 2부 (Task D)

### Task D — 팀장 2부 (상담사 라이프사이클 · 팀장 SOP 라이브러리 · 용어집)

**상태: DONE**

검증: `cd agent-lifecycle && node --test tests/lessons.test.js tests/sop.test.js tests/glossary.test.js tests/track.test.js tests/korean-role-names.test.js`
→ **117개 통과 / 0개 실패**

참고: `npm test` 전체에서는 1개가 실패합니다(816 통과 / 1 실패). 실패한 것은 `the version changes whenever a listed file changes`이고, 파일이 바뀌었으니 sw 버전을 올리라는 뜻입니다. Task E에서 `python3 tools/sw_list.py`로 처리합니다.

고친 파일:
- 레슨: `agent-lifecycle/js/lessons/02-onboarding.js` `03-nesting.js` `04-coaching.js` `05-retention.js` `06-career.js`, `sop-library/lessons/01-escalation.js` `02-coaching.js` `03-pip.js` `04-calibration.js` `05-onboarding.js` `06-incident.js` `07-launch.js` `08-scrubbing.js` `09-nurture.js` `10-transition.js`, `glossary/terms.js`
- 테스트가 대조하는 문안 문서: `docs/superpowers/specs/` 아래 `2026-11-19-sop-library-copy-ko.md`, `2026-11-19-sop-library-2-copy-ko.md`, `2026-11-21-sop-scrubbing-design.md`, `2026-11-21-sop-nurture-design.md`, `2026-11-21-sop-wrong-feedback.md`, `2026-11-22-team-leader-self-copy.md`·`.en.md`, `2026-11-20-lifecycle-track-questions.md`, `2026-11-20-lifecycle-wrong-feedback.md`, `2026-11-25-role-home-copy.md`(8절 용어집 카드 한 행만. 아래 "다른 Task에 넘길 것" 참고)
- 테스트 기대값: `agent-lifecycle/tests/lessons.test.js`, `sop.test.js`, `glossary.test.js`

#### 변경 목록

##### 상담사 라이프사이클 (lifecycle)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| nesting · 제목 | 높음 · 결정 1 | 실전 배치 및 네스팅 / Go Live and Nesting | OJT 및 네스팅 / OJT and Nesting |
| nesting · 노드 | 높음 · 결정 1 | 교육 수료 → OJT → 네스팅 그룹 → 정식 팀 (id grad, team) | 스킬 검증(id verified) → OJT → 네스팅 그룹 → **수료**(id grad, 새 위치) → **실전 배치**(id team) / Verified · Graduation · Go Live. 화살표 verified→ojt, ojt→nest, nest→grad, grad→team |
| nesting · 노드 mentor | 중간 · 결정 4 | 플로어 워킹 / Floor walking | 플로어 서포트 / Floor support |
| nesting 스텝 1 | 높음 · 결정 1 | 교육을 마친 지민이 처음으로… / Training is over, and Jimin handles… | 스킬 검증을 통과한 지민이 처음으로 실제 고객의 문의를 받습니다. … / Jimin has passed skills verification and handles real customer contacts for the first time. … |
| nesting 스텝 2 | 중간 · 결정 4 | Trainer와 직무전문가가 참관하는 (EN 그대로) | 트레이너와 직무전문가가 참관하는 (EN 그대로) |
| nesting 스텝 3 끝 문장 | 중간 (예시) | 보통 1~2주 동안 운영합니다. / It usually runs for 1 to 2 weeks. | 운영 기간은 센터마다 다릅니다(예시: 1~2주). / How long it runs varies by center (Example: 1 to 2 weeks). |
| nesting 스텝 5 | 중간 · 결정 4 | 여기서 밀착 지원, 플로어 워킹이 움직입니다. 관리자나 선배 멘토가… / …floor walking… A supervisor or senior mentor… | 여기서 밀착 지원인 플로어 서포트가 움직입니다. 직무전문가나 선임이… / This is where floor support comes in. An SME or a senior agent… |
| nesting 스텝 6 첫 문장 | 중간 | 멘토의 귓속말을 듣고… / With the mentor’s whisper… | 직무전문가의 귓속말을 듣고… / With the SME’s whisper… |
| nesting 스텝 8 (EN) | 낮음 | …pass it to a senior colleague. | …pass it to someone more senior. |
| nesting 스텝 13 (마지막) | 높음 · 결정 1·5 | 네스팅을 마친 지민이 정식 팀으로 옵니다. 이제 팀장인 당신의 팀원입니다. / Nesting ends and Jimin joins a regular team. She is now on your team. | 네스팅이 끝나면 트레이너와 팀장이 함께 수료를 정합니다. 수료한 지민은 정식 팀에 실전 배치되어, 이제 다른 팀원들과 같은 기준으로 일합니다. / When nesting ends, the trainer and the team leader decide together on graduation. Having graduated, Jimin goes live on a regular team and from now on works to the same standard as everyone else. (강조: 수료 + 실전 배치) |
| nesting-general 보기 b, 해설 | 중간 | 멘토가 옆에서 함께 처리하고… / Have the mentor handle it… · 해설 "멘토가 함께 처리합니다" / "the mentor handles it" | 직무전문가가 옆에서 함께 처리하고… / Have the SME handle it… · 해설 "직무전문가가 함께 처리합니다" / "the SME handles it" |
| nesting-general-2 보기 b, 해설 | 중간 | …멘토가 계속 들으며 지원한다. / …with a mentor still listening… · 해설 "플로어 워킹 지원은 이어 갑니다" / "Floor walking support continues…" | …직무전문가가 계속 들으며 지원한다. / …with the SME still listening… · 해설 "플로어 서포트는 이어 갑니다" / "Floor support continues…" |
| onboarding 스텝 1 끝 문장 | 중간 (예시) ★사용자 승인 문구 | 기간은 센터마다 다르지만 보통 2~4주입니다. / The length varies by center, but it usually takes 2 to 4 weeks. | 기간은 센터마다 다릅니다(예시: 2~4주). / The length varies by center (Example: 2 to 4 weeks). |
| onboarding-q1 보기 a | 결정 1 (수료 위치) | 시험 점수가 좋으니 그대로 수료시킨다. / …so let her graduate as is. | 시험 점수가 좋으니 그대로 스킬 검증을 통과시킨다. / …so pass her through verification as is. |
| onboarding-general 보기 a 피드백 | 결정 1·용어 | …실전 투입만 늦어집니다. (EN 그대로: it only delays going live) | …실전 배치만 늦어집니다. |
| onboarding-general 해설 끝 문장 | 낮음 | 그래야 지민도 스킬 검증에서 무엇을 평가받는지 분명히 압니다. / It also makes clear to Jimin what skills verification will assess. | 그래야 실전에서 드문 문의를 만나도 스스로 찾아 확인할 수 있습니다. / That way, when a rare inquiry comes up on live contacts, she can look it up and check it herself. |
| coaching 스텝 4 둘째 문장 | 낮음 | 캘리브레이션은 팀장과 QA 담당이 같은 콜을… / …the team leader and QA staff each score… | 캘리브레이션은 QA, 직무전문가, 팀장이 같은 콜을… / …QA, SMEs and team leaders each score… |
| coaching 스텝 6 | 중간 ★사용자 결정 문구(계획/비계획 구분)를 손봄 | Shrinkage도 함께 봅니다. 상담사가 콜을 받을 수 없는 모든 시간의 비율입니다. 휴식·교육·회의처럼…(Planned Shrinkage)과 결근·지각·병가처럼…(Unplanned Shrinkage)으로 나눕니다. / You also watch Shrinkage. It is the share of all time an agent cannot take calls. It splits into… | 슈링키지(Shrinkage)는 팀 단위로 봅니다. 상담사가 콜을 받을 수 없는 모든 시간의 비율로, 휴식·교육·회의처럼 사전에 계획된 시간(Planned Shrinkage)과 결근·지각·병가처럼 계획되지 않은 시간(Unplanned Shrinkage)으로 나눕니다. 한 사람을 볼 때는 슈링키지가 아니라 스케줄 준수율을 봅니다. / Shrinkage is watched at team level. It is the share of all time agents cannot take calls, split into planned shrinkage, such as breaks, training, and meetings, and unplanned shrinkage, such as absence, lateness, and sick leave. For an individual, you look at schedule adherence, not shrinkage. |
| coaching 스텝 12 | 중간 (SOP 코칭과 모순) | 잘한 점을 칭찬하고, 바꿔 말할 구체적인 화법을 제시하는 것이 핵심입니다. / The key is to praise what went well and offer specific wording… | 잘한 점을 먼저 짚고, 질문으로 원인을 함께 찾은 뒤 바꿔 말할 구체적인 화법을 정합니다. / Name what went well first, find the cause together through questions, then agree on specific wording to use instead. |
| coaching-q1 보기 b(정답), 해설 | 중간 (SOP 코칭과 모순, 뜻 수정) | "한 번에 해결하는 비율이 높은 게 강점이에요. 본인 확인 단계에서 이 문장으로 바꿔 말하면 시간을 줄일 수 있어요." / “Solving things on the first contact is your strength. Try this sentence…” · 해설 "…무엇을 어떻게 바꿔 말할지 구체적으로 보여 줍니다." | "해결률이 높은 게 강점이에요. 본인 확인 단계에서 시간이 길어지는데, 어떻게 줄여 볼까요?" / “Your first-contact resolution is a strength. Your time runs long at the identity check; how could we shorten it?” · 해설 "좋은 코칭은 잘한 점을 먼저 짚고, 데이터로 어디서 시간이 길어지는지 보여 준 뒤 질문으로 방법을 함께 찾습니다." / "…shows from the data where the time goes, then finds a fix together through questions." |
| coaching-tech 질문, 보기 b·c (EN), 보기 c 피드백 | 높음 · 결정 2 | 지민의 티켓은 빨리 닫히지만 같은 고객의 문의가 다시 들어오는 일이 잦습니다. / Jimin’s tickets close quickly… · b EN "…coach the checks she skipped." · c EN "Tell her to escalate more often." · c 피드백 "…부담만 커지고 지민의 진단 능력은 그대로입니다." / "…and Jimin’s diagnosis skills…" | 팀원 한 명의 티켓은 빨리 닫히지만, 같은 고객이 같은 문제로 다시 연락하는 일이 잦습니다. 무엇을 볼까요? / One team member’s tickets close quickly… · b EN "…coach the checks that were skipped." · c EN "Tell them to escalate more often." · c 피드백 "…부담만 커지고, 그 팀원의 진단 능력은 그대로입니다." / "…and that agent’s diagnosis skills stay where they are." |
| coaching-tech-2 질문, 보기 a·b·c (EN), 보기 a 피드백 (EN) | 높음 · 결정 2 | 지민의 에스컬레이션 비율이… / Jimin’s escalation rate… · her/she | 팀원 한 명의 에스컬레이션 비율이 팀에서 가장 높습니다. 코칭에서 무엇부터 할까요? / One team member’s escalation rate is the highest on the team. … · EN 보기·피드백의 her/she → them/they ("…where the diagnosis stopped", "so they can compare") |
| retention 스텝 2 (EN) | 낮음 | …and promotional events give a sense of achievement. | …and incentive contests give a sense of achievement. |
| retention-general-2 보기 a(정답) | 높음 | 근무 뒤 짧게 모여… / Gather briefly after the shift… | 근무 시간 안에 짧게 모여… / Gather briefly during working hours… |
| career 스텝 1 (EN) | 중간 | One is growing a career beyond taking calls, … | One is growing a career that started as an agent, … |
| career 스텝 2 | 중간 | 상담 업무에서 QA(품질 관리자), 교육 강사, 팀 리더, WFM(인력 관리자)으로 승진하거나 직무를 바꿀 기회를 줍니다. / …to be promoted or to move into roles such as QA (quality analyst), trainer, team leader, or WFM… | 상담 업무에서 QA(품질 평가 담당), 트레이너, WFM(인력 관리)으로 직무를 바꾸거나, 직무전문가를 거쳐 팀장으로 승진할 기회를 줍니다. / …to move into roles such as QA (quality analyst), trainer, or WFM (workforce management), or to be promoted through SME to team leader. |
| career · 노드 | 중간 · 결정 4 | 교육 강사 · 팀 리더 | 트레이너 · 팀장 (EN 그대로) |
| career-general 보기 a | 중간 | 팀 리더가 아니면 길이 없다고 말한다. | 팀장이 아니면 길이 없다고 말한다. (EN 그대로) |
| career-tech 보기 b (EN) | 낮음 | …have them work some tickets alongside a Tier 2 agent. | …have them try some of those tickets with support. |

##### 팀장 SOP 라이브러리 (sop)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| escalation 스텝 7 (EN) | 낮음 | …I will pass this to a senior colleague. … | …I will pass this to someone more senior. … |
| coaching 스텝 7, coaching-q1 보기 b (EN) | 낮음 | "Looking at the data, the time gets longer at this point, so why do you think that is?" | "Looking at the data, your time runs long at this point; why do you think that is?" |
| pip 전체 · 인물 이름 | 낮음 | 도윤 / Doyun (박도윤 / Doyun Park) | 우진 / Woojin (박우진 / Woojin Park). 조사는 같은 받침이라 그대로 |
| pip 스텝 11 | 중간 | PIP를 시작하기 전에 인사 담당자와 확인하세요. / Check with your HR team before you start a PIP. | PIP를 시작하기 전에 인사 담당자와 확인하고, 목표에 미치지 못하면 어떤 절차로 이어지는지 첫 면담에서 우진에게 분명히 알립니다. / Check with HR before you start a PIP, and tell Woojin clearly at the first meeting what follows if the goal is not met. |
| calibration 스텝 3 둘째 문장 | 중간 (예시) | 지민은 세션 2~3일 전에… / Two or three days before the session, … | 지민은 세션 며칠 전(예시: 2~3일 전)에… / A few days before the session (Example: 2 to 3 days), … |
| calibration 스텝 10 둘째 문장 | 중간 (예시) | 지민은 세션이 끝나고 하루 안에… / Within a day of the session, … | 지민은 세션이 끝나고 정한 기한 안에(예시: 하루)… / Within a set time after the session (Example: one day), … |
| onboarding 스텝 1 | 중간 · 낮음 (예시, T&D) | …첫 2주 동안… HR, T&D, 운영, WFM 등… / …in their first two weeks. … including HR, T&D, Operations, and WFM. | …첫 2주(예시) 동안… HR, 교육팀(T&D), 운영, WFM 등… / …in their first two weeks (Example). … including HR, Training and Development (T&D), Operations, and WFM. |
| onboarding 스텝 9 | 중간 · 결정 1 | WFM이 교육을 마친 뒤의 첫 실전 투입을 위한 근무 스케줄을 배정하고… / …for her first live contacts after training… | WFM이 교육을 마친 뒤 OJT와 네스팅 기간의 근무 스케줄을 배정하고… / …for her OJT and nesting after training… |
| onboarding · 노드 schedule | 중간 · 결정 1 | 실전 투입 스케줄 배정 / First live schedule | OJT·네스팅 스케줄 배정 / OJT and nesting schedule |
| onboarding-q1 보기 c | 중간 · 결정 1 | 실전 투입을 위한 근무 스케줄을 배정한다. / …for her first live contacts. | OJT와 네스팅 기간의 근무 스케줄을 배정한다. / …for her OJT and nesting. |
| incident 스텝 2 (EN) | 낮음 | You report it to the AM or OM at once… | You report it to the assistant manager (AM) or operation manager (OM) at once… |
| incident 스텝 10 | 낮음 (용어 통일) | …경영진과 클라이언트에게 보고합니다. | …경영진과 고객사에게 보고합니다. (EN 그대로) |
| launch 스텝 1 | 낮음 (TA·T&D, 용어 통일) | 신규 클라이언트 프로젝트… 매니저, TA, T&D, WFM, HR이… / The OM, TA, T&D, WFM, and HR… | 신규 고객사 프로젝트… 매니저, 채용팀(TA), 교육팀(T&D), WFM, HR이… / The OM, Talent Acquisition (TA), Training and Development (T&D), WFM, and HR… |
| launch 스텝 2·3·10, launch-q2 보기 b와 피드백 | 낮음 (용어 통일) | 클라이언트 | 고객사 (EN 그대로) |
| scrubbing 스텝 2 | 낮음 | 매일 채널별로 티켓을 몇 건씩 고릅니다(예시: 채널마다 하루 2건). / …from each channel every day (example: 2 per channel per day). | 매일 티켓을 몇 건씩 고릅니다(예시: 하루 3~4건). / …a few tickets every day (Example: 3 to 4 a day). |
| scrubbing 스텝 7 (EN) | 낮음 | The team leader, SME, QA and OM meet… | The team leader, SME, QA and operation manager (OM) meet… |
| scrubbing 스텝 11 | 중간 | …잘 보이지 않고, 다음 1:1 코칭과 PIP의 근거가 됩니다. / …and it becomes evidence for the next one-on-one coaching and PIP. | …잘 보이지 않습니다. 다음 1:1 코칭의 근거가 되고, 코칭으로도 나아지지 않을 때는 PIP의 근거가 됩니다. / …hard to see in QA scores alone. It becomes evidence for the next one-on-one coaching, and for a PIP only if coaching does not help. |
| nurture 스텝 2 | 높음 · 결정 2 | 입사 1년 차가 된 지민이 이번 이야기의 주인공입니다. …이제 다음 단계를 고민하고 있습니다. / Jimin, now in her first full year, … | QA로 옮기기 전, 입사 1년 차였던 지민의 이야기입니다. 지민은 스크러빙과 1:1 코칭을 거치며 처리 시간을 줄였고, 다음 단계를 고민하고 있었습니다. / This story goes back to Jimin's first year, before she moved to QA. … she had cut her handle time, and she was thinking about her next step. |
| nurture 스텝 3 | 중간 | QA는 품질 점수와 CSAT, 스크러빙 기록을, WFM은… 최초 해결률(FCR)… / QA gathers quality scores, CSAT and scrubbing records… | QA는 품질 점수와 CSAT를, 직무전문가는 스크러빙 기록을, WFM은… 최초 통화 해결률(FCR)… / QA gathers quality scores and CSAT, the SME gathers scrubbing records, and WFM… |
| nurture 스텝 7 | 결정 5 (멘토 지정은 팀장) | 직무전문가와 T&D가 지민에게 신입 멘토 역할과 지식 문서 검토를 맡깁니다. / The SME and T&D give Jimin a mentor role… | 당신은 지민을 신입의 멘토로 지정하고, 직무전문가와 T&D는 지민에게 지식 문서 검토를 맡깁니다. / You assign Jimin as a mentor for new hires, and the SME and T&D give her knowledge articles to review. |
| nurture 스텝 9 | 중간 · 결정 4 | 당신과 운영 관리자가… / you and the operations manager… | 당신과 매니저가… / you and the operation manager (OM)… |
| nurture 스텝 11 | 높음 · 결정 2 | 지민은 멘토 경험을 살려 다음 분기 직무전문가 후보로 추천되었습니다. / …recommended as an SME candidate for next quarter. | 지민은 지식 문서 검토와 멘토 경험을 살려 전문가 트랙인 QA 자리에 추천되었습니다. / Building on her knowledge-article reviews and mentoring, Jimin was recommended for a QA role on the specialist track. |
| nurture-q1 보기 b(정답) | 중간 | 최초 해결률(FCR), 고객 만족, 지식 공유 기여. | 최초 통화 해결률(FCR), 고객 만족, 지식 공유 기여. (EN 그대로) |
| transition 스텝 6 | 중간 | 근태, 품질, 도움을 요청하는 방법처럼 팀이 함께 지킬 기준을 팀원들과 이야기해 정하고… / Talk with the team to set the standards…, such as attendance, quality… | 회사 규정 안에서 근태 연락 방법, 품질, 도움을 요청하는 방법처럼 팀이 함께 지킬 기준을 팀원들과 이야기해 정하고… / Within company rules, talk with the team to set the standards…, such as how to report attendance issues, quality… |
| transition → onboarding 연결 | 낮음 | 여기까지가 팀장이 직접 하는 여섯 가지 절차입니다. / These are the six procedures a team leader runs directly. | 여기까지가 팀장이 직접 하거나 함께하는 여섯 가지 절차입니다. / These are the six procedures a team leader runs or takes part in. |

##### 용어집 (glossary/terms.js)

| 위치 | 리뷰 항목 | 전 (ko / en) | 후 (ko / en) |
|---|---|---|---|
| team-lead · 라벨, 이름 | 중간 · 결정 4 | Team Lead · 팀장 (TL) / Team Lead (TL) | Team Leader · 팀장 (TL) / Team Leader (TL). id `team-lead`는 그대로 |
| team-lead · 정의 (EN) | 중간 | A team lead reviews… | A team leader reviews… |
| assistant-manager · 정의 (EN) | 중간 | …works with several team leads… | …works with several team leaders… |
| buddy · 정의 (EN) | 중간 | The team lead assigns the buddy… | The team leader assigns the buddy… |
| calibration · 정의 (EN) | 중간 | QA, SMEs, and team leads take part. | QA, SMEs, and team leaders take part. |
| one-on-one-coaching · 정의 (EN) | 중간 | Time a team lead spends… | Time a team leader spends… (승인 문안 `team-leader-self-copy.en.md`의 After 칸도 같이 고침) |
| trainer · 이름 | 중간 · 결정 4 | 교육 강사 | 트레이너 |
| ojt · 정의 | 중간 · 결정 4 ★사용자 문구 | …마친 신입이 Trainer와 직무전문가가 참관하는… | …마친 신입이 트레이너와 직무전문가가 참관하는… |
| floor-walking · 라벨, 이름, 정의 | 중간 · 결정 4 | Floor Walking · 플로어 워킹 / Floor Walking · 관리자나 선배가 상담사 곁에서… / a supervisor or senior stays near agents… | Floor Support · 플로어 서포트 / Floor Support · 직무전문가나 선임이 상담사 곁에서… / an SME or a senior agent stays near agents… id `floor-walking`은 그대로(링크 앵커) |
| escalation · 정의 (EN) | 낮음 | …to a senior colleague or a higher tier. | …to someone more senior or a higher tier. |

##### 테스트 기대값 (문안이 바뀌었기 때문에)
- `lessons.test.js`: 온보딩 기간 문구, career-tech b(이제 "alongside a Tier 2 agent"가 **없고** "with support"가 **있어야** 함), 레슨 3 순서 테스트(트레이너 표기, 화살표 verified→ojt→nest→grad→team, 마지막 스텝에 "트레이너와 팀장이 함께 수료"와 "실전 배치"), 레슨 3 제목 테스트("OJT 및 네스팅 / OJT and Nesting"). 약하게 만든 테스트는 없고 확인 항목만 늘렸습니다.
- `sop.test.js`: PIP 인물 우진/Woojin, 온보딩 절차 이름 "OJT·네스팅 스케줄 배정", transition 연결 문장 첫머리.
- `glossary.test.js`: OJT 정의의 "트레이너", 직급 카드 라벨 "Team Leader".

#### 반영하지 않은 항목
- **정답 길이 행**(lifecycle 30문항 중 23개, sop 21문항 중 10개): 결정 3에 따라 2단계로 넘깁니다. coaching-tech b, career-general-2 c, calibration-q1 b, coaching-general c(오답 늘리기)는 고치지 않았습니다. coaching-q1 b만 고쳤는데, 길이 때문이 아니라 SOP 코칭과 부딪치는 내용이어서입니다(아래 판단 참고).
- **coaching-general-2**(리뷰의 "캘리브레이션 참석자" 행): 질문은 팀장과 QA 두 평가자의 점수가 갈린 장면을 그릴 뿐, 누가 캘리브레이션에 참석하는지를 정의하지 않습니다. 그래서 참석자 정의가 있는 스텝 4만 고쳤습니다.
- **용어집 OJT 이름 "직무교육"**: 리뷰도 바꾸지 말자고 했습니다.
- **SOP transition 스텝 1 "세 단계"와 노드 4개**(팀장 1부 검수의 "판단하지 않은 것"에서 넘어온 항목): 고치지 않았습니다. "90일 돌아보기"는 절차 단계가 아니라 곁가지 노드입니다. PIP("PIP 종료·추가 계획")와 다른 SOP도 같은 방식이고, 테스트 EXTRAS에도 그렇게 정해져 있습니다.
- **SOP 목록 그룹 제목 "팀장이 직접 하는 절차"**(`sop-library/ui.js`, 테스트가 고정): 리뷰는 연결 문장만 지적했으므로 그대로 두었습니다. 그룹 제목까지 "직접 하거나 함께하는"으로 맞출지는 사용자 판단이 필요합니다.

#### 다른 Task에 넘길 것 (Task E)
1. **sw 버전**: `python3 tools/sw_list.py`를 실행해야 합니다. 지금 `npm test`의 `the version changes whenever a listed file changes`가 실패합니다.
2. **영어 "Team Lead"가 남은 곳**(결정 4, 내 파일이 아님): `shared/role-data.js:7` `'Team Lead / TL'`, 이를 고정하는 `agent-lifecycle/tests/korean-role-names.test.js:39`, `2026-11-25-role-home-copy.md` 8절 첫 표의 `Team Lead / TL`, `review/data.js:8` "Team lead review quiz", `practice/data.js:44` "Team lead course complete", `guide/data.js` 122·376·480행 "team lead", `codex/data/*`의 "Team Lead"와 "team lead". Review Focus 4를 grep으로 확인하면 여기서 걸립니다.
3. **`2026-11-25-role-home-copy.md`**: 이 문서를 고친 것은 용어집 카드 표의 Team Leader 한 행과 표 아래 메모 한 줄뿐입니다(glossary.test가 이 행과 대조). 같은 문서의 첫 표는 Task A가 동시에 고쳤고, 지금 diff에는 두 변경이 모두 들어 있습니다. 통합할 때 한 번 확인해 주세요.
4. **`agent-lifecycle/tests/sme.test.js:103`**(Task B): `'Doyun belongs to the PIP SOP'`라며 도윤을 검사합니다. PIP 인물이 이제 우진이므로 `'우진'`으로 바꾸는 것이 맞습니다(지금도 통과는 합니다).
5. **레슨 3 제목을 가리키는 링크 문구**: 내가 본 시점에 guide/sme-guide에는 옛 제목 "실전 배치 및 네스팅"이 남아 있지 않았습니다. 그래도 Task B·C의 결과에서 "OJT 및 네스팅 / OJT and Nesting"으로 맞는지 다시 확인해 주세요.
6. 참고로, 내 범위는 아니지만 SOP 캘리브레이션 스텝 11의 "교육 담당"은 결정 4의 금지어 목록에 없어서 그대로 두었습니다. "트레이너"로 맞출지는 판단에 맡깁니다.

#### 내가 내린 판단
- **레슨 3 순서(결정 1)**: 리뷰는 "수료 → 네스팅"을 전제로 노드 "교육 수료→스킬 검증"과 스텝 3 "OJT를 마치고 교육을 수료해도"를 제안했습니다. 결정 1(교육 → OJT → 네스팅 → 수료 → 실전 배치)에 맞춰 다시 썼습니다.
  - 스텝 3은 원래 문장 "OJT를 마쳐도"를 그대로 둡니다.
  - 노드 "수료"와 "실전 배치"를 네스팅 뒤에 둡니다. "수료"는 기존 id `grad`를 옮겨 쓰고, 앞쪽 노드는 새 id `verified`("스킬 검증")입니다.
  - 마지막 스텝에 수료(트레이너와 팀장이 함께 정함, 결정 5)와 실전 배치를 한 스텝으로 묶었습니다. 스텝을 따로 하나 더하면 보이는 스텝이 13개가 되어 "스텝 6~12개" 규칙을 넘기 때문입니다.
  - 레슨·질문·보기 id는 그대로입니다.
- **스텝 13**: 리뷰 문안 "네스팅을 마친 지민이 정식 팀에 실전 배치됩니다"에 결정 5(수료는 트레이너와 팀장이 함께)를 더해 위처럼 썼습니다.
- **onboarding-q1 a "수료시킨다"**: 교육 막바지에 수료를 말하므로 결정 1과 어긋납니다. "스킬 검증을 통과시킨다"로 바꿨습니다(오답 보기, 정답 id 그대로). onboarding-general a 피드백의 "실전 투입"은 "실전 배치"로 맞췄습니다.
- **슈링키지 스텝**: 리뷰 문안에서는 "모든 시간"과 "(Planned/Unplanned Shrinkage)" 표기가 빠집니다. 이 둘은 사용자 결정으로 들어간 것이고 테스트도 고정하고 있어 남겼습니다. 대신 리뷰의 핵심인 "팀 단위로 본다"와 "개인은 스케줄 준수율로 본다"를 넣었습니다.
- **coaching-q1 b**: 리뷰는 이 짧은 질문형 문안을 "정답 길이" 행에 넣었지만, 같은 중간 항목(SOP 코칭과 가르치는 방식이 반대)을 풀려면 필요해서 이번에 반영했습니다. 해설도 질문형에 맞췄습니다.
- **기술지원 트랙의 "팀원 한 명"(결정 2)**: 영어 대명사는 she 대신 they/them을 썼습니다("that agent’s"는 리뷰 문안대로).
- **SOP 코칭 EN**: 리뷰 문안처럼 두 문장으로 나누면 영어가 한국어보다 문장이 많아져 sop.test의 "영어 문장 수 ≤ 한국어" 검사에 걸립니다. 그래서 세미콜론으로 이어 한 문장으로 썼습니다("…at this point; why do you think that is?").
- **PIP 이름**: 리뷰는 바꿀지 검토하라고만 했지만 결정 7에 따라 바꿨습니다. 새 이름 "우진/Woojin"은 레포 어디에도 쓰이지 않습니다. 남성이라 영어 his는 그대로 맞고, 받침이 같아 조사도 그대로 둘 수 있습니다. 엑셀 실습의 "이도윤"은 다른 강의의 다른 인물이라 건드리지 않았습니다.
- **스크러빙 건수**: 리뷰 예시대로 직무전문가 강의에 맞춰 "(예시: 하루 3~4건)"으로 바꿨습니다. 그래서 "채널별로"는 뺐습니다.
- **nurture 스텝 7(결정 5)**: 리뷰 표에는 없지만 결정 5가 이 스텝을 지목하므로, 멘토 지정은 팀장(당신)이 하고 지식 문서 검토는 직무전문가와 T&D가 맡기도록 나눴습니다.
- **T&D·TA**: 첫 등장을 "교육팀(T&D)", "채용팀(TA)"으로 풀어 썼습니다. 결정 4는 "트레이너"를 사람 직무명으로 정한 것이고, 부서 이름은 "교육팀"으로 썼습니다.
- **고객사/클라이언트**: SOP 강의 안에서 "고객사"로 통일했습니다(incident 1곳, launch 5곳, launch-q2 b 피드백). 용어집 SLA·부매니저 정의의 "클라이언트"는 리뷰가 SOP 강의 안의 혼용만 지적했으므로 그대로 두었습니다.
- **용어집 플로어 서포트**: 결정 4가 "플로어 워킹"을 쓰지 말라고 했으므로 정의에 "플로어 워킹이라고도 함" 같은 별칭은 넣지 않았습니다. 검색 앵커가 깨지지 않도록 id는 `floor-walking` 그대로입니다.
- **사용자가 직접 쓰거나 승인한 표현을 바꾼 곳(결정 7 표시)**:
  - 레슨 3 제목 "실전 배치 및 네스팅"
  - 레슨 3 OJT 스텝과 용어집 OJT 정의의 "Trainer" (테스트 주석상 user wording)
  - 온보딩 기간 문구 "센터마다 다르지만 보통 2~4주" (Korean sign-off edit)
  - 슈링키지 스텝 (계획/비계획 구분은 유지)

## 최종 검토 뒤 고친 것 (새 검토자, 2026-11-26)
| 위치 | 전 | 후 |
|---|---|---|
| 복습 퀴즈 tl-q6 보기 c 피드백 | 실전 첫 몇 주는 가장 많이 떠나는 시기입니다. | 실전 첫 몇 주도 떠나는 사람이 많은 시기입니다. (가장 많이 떠나는 때는 OJT·네스팅이라고 말하는 다른 강의와 맞춤) |
| 팀장 서포트 trainers 스텝 3·6, trainers-q2 (EN) | completion / complete training | graduation / graduate from nesting |
| 커리어 라이프사이클 트레이너 레슨 연결 | 돕고, 재고, 가르치는 길 | 돕고, 평가하고, 가르치는 길 |
| 상담사 첫걸음 레슨 1 스텝 5 | 함께 수료를 정합니다 / decide together that you graduate | 함께 수료 여부를 정합니다 / decide together whether you graduate |
| 상담사 첫걸음 레슨 2 스텝 8 | 실전 배치 뒤에 같은 문의가 그대로 들어옵니다 | OJT부터 같은 문의가 실제로 들어옵니다 |
| Codex 5대 핵심팀 · Nesting Success Rate 정의 | 교육 후 실전 투입 성공률. | 네스팅을 마치고 수료한 비율. |

미뤄 둔 작은 지적 (2단계에서 함께 보기): 커리어 레슨 5 영어 "Next roles" 표현, "오래된 기록" 중복, 평가 리뷰 레슨 영어 어순, 팀장 서포트 직무전문가 레슨의 구어체 "하고만", 직무전문가 첫걸음 레슨 5 "정해진 날", 레슨 7 영어 in 중복, 팀장 SOP 육성 영어 긴 문장, sme-q5 질문 배경, 직무전문가 첫걸음 레슨 2 문장 주어, graduate-q2 정답에 트레이너 넣기(정답 길이와 함께), 팀장 SOP 캘리브레이션 연결 문구와 "교정 세션" 스텝 이름, 상담사 라이프사이클 레슨 2 노드 "실전 준비".
