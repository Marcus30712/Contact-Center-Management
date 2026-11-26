# 검수 반영 3단계 — 이유절 단서 없애기 제안 (2026-11-26)

상태: 승인·반영됨 (2026-11-26). 최종 검토 뒤 다듬은 문장은 LOG 70에 적었습니다. 정정: 직무전문가 첫걸음 firstday-q1 b는 원래 "범위 밖이니"라는 이유가 있었으므로 정답 이유는 실제로 1 → 3입니다.

문제: 2단계에서 오답에만 "~하니, ~하려고" 같은 이유를 붙여, 이유가 붙은 보기는 오답이라는 단서가 생겼습니다(정답 0/153, 오답 91/306).
고친 방법: 정답 일부에 짧은 현장 이유를 붙이고, 오답 일부는 이유를 빼고 행동만 남겼습니다. 정답 길이 조건(정답이 혼자 가장 긴 문항 1/3 이하)은 그대로 지킵니다. 질문·보기·정답 id, 피드백은 그대로입니다.

| 강의 | 정답에 이유 (전→후) | 오답에 이유 (전→후) | 두 오답에만 이유 (전→후) |
|---|---|---|---|
| 상담사 첫걸음 | 0/16 → 3/16 | 10/32 → 8/32 | 0 → 0 |
| 상담사 커리어 라이프사이클 | 0/10 → 1/10 | 3/20 → 3/20 | 0 → 0 |
| 직무전문가 첫걸음 | 0/14 → 3/14 | 8/28 → 8/28 | 1 → 0 |
| 직무전문가 서포트 라이프사이클 | 0/10 → 2/10 | 6/20 → 6/20 | 2 → 0 |
| 직무전문가 SOP | 0/16 → 3/16 | 11/32 → 9/32 | 3 → 0 |
| 팀장 첫걸음 | 0/14 → 2/14 | 2/28 → 2/28 | 0 → 0 |
| 팀장 서포트 라이프사이클 | 0/10 → 2/10 | 4/20 → 4/20 | 0 → 0 |
| 상담사 라이프사이클 | 0/30 → 8/30 | 30/60 → 24/60 | 9 → 0 |
| 팀장 SOP | 0/21 → 3/21 | 7/42 → 6/42 | 1 → 0 |
| 복습 퀴즈 | 0/12 → 3/12 | 10/24 → 8/24 | 2 → 0 |

확인해 주시면 좋은 곳 (길이 조건 때문에 줄인 표현): 상담사 라이프사이클 coaching-general-2 c "두 항목의 채점 기준" → "채점 기준", hiring-general b "다른 방법" → "대안", 팀장 SOP transition-q2 b "다른 팀원과 같은 기준" → "형평이 서도록 … 같은 기준".

---

## 상담사

### 3단계 초안: 이유절 단서 없애기 — agent (상담사 첫걸음, 상담사 커리어 라이프사이클)

작업 사본: /tmp/p3/agent/repo (원본 레포와 git 상태는 건드리지 않음). js 와 문안 md(ko/en)를 같은 문장으로 함께 고쳤습니다.
질문·보기 id·정답 id는 그대로입니다. 오답 피드백은 새 문장과 그대로 맞아서 바꾸지 않았습니다.

#### 상담사 첫걸음 (agent/, 16문항)

요약
- 정답 이유절: 0/16 → 3/16 (18.8%)
- 오답 이유절: 10/32 → 8/32 (25.0%; 통과 기준은 정답 비율 ≥ 12.5%)
- 단서 문항(두 오답에만 이유절): 0 → 0
- 정답이 혼자 가장 긴 문항(후): 4/16 (training-q1, nesting-q1, attendance-q1, growth-q2), 한도 5

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| training-q1 | b (정답) | 자주 나오는 것은 익히고, 나머지는 지식 베이스 위치만 알아 둔다. / Learn the common ones, and for the rest, just know where they are in the knowledge base. | 정책은 바뀌기 마련이니, 자주 나오는 것은 익히고 나머지는 지식 베이스 위치만 알아 둔다. / Policies keep changing, so learn the common ones and, for the rest, just know where they are in the knowledge base. | 없음 (정답) |
| nesting-q1 | b (정답) | 고객에게 양해를 구하고 보류한 뒤, 옆자리나 직무전문가에게 확인한다. / Ask the customer to bear with her, put the call on hold, then check with the next seat or the SME. | 고객이 불안하지 않도록, 양해를 구하고 보류한 뒤 옆자리나 직무전문가에게 확인한다. / So the customer isn't left wondering, ask them to bear with her, put the call on hold, then check with the next seat or the SME. | 없음 (정답) |
| attendance-q1 | b (정답) | 근무 1~2시간 전(예시)에 팀장에게 직접 알린다. / Tell her team leader directly 1–2 hours before her shift (Example). | 스케줄을 다시 짤 수 있게, 근무 1~2시간 전(예시)에 팀장에게 직접 알린다. / Tell her team leader directly 1–2 hours before her shift (Example), so the schedule can be rearranged. | 없음 (정답) |
| golive-q2 | a (오답) | 고객이 다시 연락하지 않으면 문제없으니, 다음 문의를 받으며 넘어간다. / If the customer doesn't call back, there's no problem, so move on to the next contact. | 고객이 다시 연락하지 않으면 문제없다고 보고 다음 문의로 넘어간다. / Treat it as fine unless the customer calls back, and move on to the next contact. | 없음 ("잘못된 안내는 더 큰 불만으로 돌아올 수 있습니다." 그대로 맞음) |
| customers-q1 | a (오답) | 잘 안 들리시는 것 같으니, 같은 문장을 더 크게 한 번 더 반복한다. / The customer seems not to hear well, so repeat the same sentence once more, louder. | 고객이 알아들을 때까지 같은 문장을 더 크게 반복한다. / Repeat the same sentence, louder, until the customer gets it. | 없음 ("같은 말을 반복하면 고객은 더 답답해집니다." 그대로 맞음) |

#### 상담사 커리어 라이프사이클 (agent-career/, 10문항)

요약
- 정답 이유절: 0/10 → 1/10 (10%)
- 오답 이유절: 3/20 → 3/20 (15%; 통과 기준은 정답 비율 ≥ 7.5%)
- 단서 문항: 0 → 0
- 정답이 혼자 가장 긴 문항(후): 1/10 (trainer-q1), 한도 3

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| trainer-q1 | a (정답) | 쉬운 말로 설명하고, 정책 문서의 위치도 보여 준다. / Explain it in plain words, and show where it is in the policy document. | 동료가 다음엔 혼자 찾을 수 있게, 쉬운 말로 설명하고 정책 문서의 위치도 보여 준다. / Explain it in plain words and show where it is in the policy document, so the colleague can find it alone next time. | 없음 (정답) |

#### 고친 사본 파일
- agent/lessons/02-training.js, 03-nesting.js, 04-golive.js, 05-customers.js, 07-attendance.js
- agent-career/lessons/03-trainer.js
- docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md, 2026-11-26-agent-course-copy.en.md
- docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md, 2026-11-26-agent-career-copy.en.md

#### 테스트 (사본)
`cd /tmp/p3/agent/repo/agent-lifecycle && node --test tests/answer-length.test.js tests/tl-courses.test.js tests/agent-career.test.js tests/korean-role-names.test.js`
- pass 90 / fail 8. "agent: reason clauses…", "agent-career: reason clauses…"는 이제 통과합니다(전에는 실패). 길이 가드 두 개도 통과합니다.
- 남은 실패 8개는 모두 다른 강의(sme, sme-lifecycle, sme-sop, tl, tl-support, lifecycle, sop, review)의 이유절 테스트이고, 맡은 범위 밖입니다.

전체 `node --test`: pass 827 / fail 11. 위 8개 외에 사본에서만 실패하는 3개가 있습니다.
- 421, 445: 사본에 .git 이 없어서 `git ls-files` 가 실패합니다. 사본 환경 때문입니다.
- 763 "the version changes whenever a listed file changes": 강의 파일이 바뀌어서 버전 해시가 달라졌습니다. 원본에 반영할 때 버전을 올리면 해결됩니다.

---

## 직무전문가

### 3단계 초안: 이유절 단서 없애기 — sme (직무전문가 첫걸음 · 서포트 라이프사이클 · SOP)

작업 사본: /tmp/p3/sme/repo (레포 원본과 git 상태는 손대지 않음).
고친 파일(사본): docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md / .en.md, sme-lifecycle-copy-ko.md / .en.md, sme-sop-copy-ko.md / .en.md.
lessons/*.js 는 md 에서 다시 만들었습니다(/tmp/p3/sme/tools/regen.sh = /tmp/fixes/B/regen.sh 와 같은 방식, 사본 경로로 실행). 고치기 전 사본에서 다시 만들어 보니 원본 js 와 똑같아서 생성 방식이 맞는 것을 확인했습니다.
질문, 보기 id, 정답 id, 피드백, 해설은 바꾸지 않았습니다(피드백은 새 문장과 그대로 맞아서 바꿀 필요가 없었습니다).

#### 1. 직무전문가 첫걸음 (sme/)

요약
- 정답 이유절: 0/14 → 3/14 (21%)
- 오답 이유절: 8/28 → 8/28 (29%, 절반 기준 14%)
- 단서 문항(두 오답에만 이유절): 1개(priority-q1) → 0개
- 정답이 혼자 가장 긴 문항(후): 2/14 (peer-q2, priority-q1), 한도 4

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| firstday-q1 | b (정답) | 범위 밖이니 고객에게 기다림을 안내하게 하고, 팀장에게 바로 넘긴다. / It's outside your limits, so have the agent ask the customer to wait and pass it to the team leader right away. | 범위 밖이니, 고객에게 기다림을 안내하게 하고, 팀장에게 바로 넘긴다. / (영어 그대로) | 없음 (정답) |
| priority-q1 | b (정답) | 서준에게 먼저 가고, 지민에게는 언제 갈지 알린다. / Go to Seojun first, and tell Jimin when you will come. | 보류된 고객이 기다리니, 서준에게 먼저 가고 지민에게는 언제 갈지 알린다. / A customer is waiting on hold, so go to Seojun first and tell Jimin when you will come. | 없음 (정답) |
| escalation-q2 | b (정답) | 답을 정리해 허들이나 팀 채팅방에 공유한다. / Sum up the answer and share it in the huddle or the team chat. | 모두에게 필요한 답이니, 정리해서 허들이나 팀 채팅방에 공유한다. / Everyone needs this answer, so sum it up and share it in the huddle or the team chat. | 없음 (정답) |

#### 2. 서포트 라이프사이클 (sme-lifecycle/)

요약
- 정답 이유절: 0/10 → 2/10 (20%)
- 오답 이유절: 6/20 → 6/20 (30%, 절반 기준 15%)
- 단서 문항: 2개(senior-q1, leadsupport-q1) → 0개
- 정답이 혼자 가장 긴 문항(후): 2/10 (regular-q1, regular-q2, 전과 같음), 한도 3

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| senior-q1 | b (정답) | 답변은 계속 맡기되, 승인이 필요한 건은 직무전문가에게 넘기게 다시 맞춘다. / Keep him on answering, but agree again that cases needing approval go to the SME. | 승인은 직무전문가 몫이니, 답변은 계속 맡기되 승인 건은 넘기게 한다. / Approval stays with the SME, so keep him on answering but have approval cases come to you. | 없음 (정답) |
| leadsupport-q1 | a (오답) | 회의 시간이 짧으니, 지난주에 문제가 있었던 팀원만 골라 사례와 함께 보낸다. / (영어 그대로) | 회의 시간이 짧으니, 지난주에 문제가 있었던 팀원만 골라 사례와 함께 자세히 정리해 보낸다. / (영어 그대로) | 없음 (정답이 혼자 가장 길어지지 않게 맞춘 것, 뜻 같음) |
| leadsupport-q1 | b (정답) | 팀원마다 지금 단계, 지난주 모습, 다음 단계 신호를 한 줄씩 적는다. / One line per team member: current stage, what you saw last week, and signs for the next stage. | 팀장이 바로 정하게, 팀원별 지금 단계·지난주 모습·다음 단계 신호를 한 줄로 적는다. / So Sujin can decide quickly, write one line per team member: current stage, what you saw last week, and signs for the next stage. | 없음 (정답) |


#### 3. 직무전문가 SOP (sme-sop/)

요약
- 정답 이유절: 0/16 → 3/16 (19%)
- 오답 이유절: 11/32 → 9/32 (28%, 절반 기준 14%)
- 단서 문항: 3개(attendance-q1, attendance-q2, calibration-q2) → 0개
- 정답이 혼자 가장 긴 문항(후): 3/16 (approval-q1, scrubbing-q1, kbrequest-q1, 전과 같음), 한도 5

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| attendance-q1 | b (정답) | 출석 시트에 적고, RTA와 수진 팀장에게 공백을 바로 알린다. / Write it in the attendance sheet, and flag the gap to the RTA and Sujin right away. | 인원 조정이 급하니, 출석 시트에 적고 RTA와 수진 팀장에게 알린다. / Staffing needs adjusting fast, so log it in the attendance sheet and flag the gap to the RTA and Sujin. | 없음 (정답) |
| attendance-q2 | b (정답) | 사실대로 기록하고, 사정이 있으면 팀장에게 직접 말하라고 한다. / Record it as it is, and tell him to talk to the team leader directly if there's a reason. | 대행은 기록만 하니, 사실대로 적고 사정은 팀장에게 말하라고 한다. / Covering means recording, not deciding, so log it as it is and tell him to take any reason to the team leader. | 없음 (정답) |
| calibration-q2 | b (정답) | 오늘 안에 허들이나 팀 채팅방에서 예시와 함께 전한다. / Share it with an example at a huddle or in the team chat today. | 평가가 내일부터이니, 오늘 허들이나 팀 채팅방에서 예시와 함께 전한다. / Evaluations start tomorrow, so share it today with an example at a huddle or in the team chat. | 없음 (정답) |
| huddle-q1 | c (오답) | 틀리게 전하는 것보다 나으니, 모호한 부분은 빼고 확실한 것만 전한다. / It beats passing on something wrong, so leave out the unclear part and share only what's certain. | 모호한 부분은 빼고, 확실한 내용만 정리해 전한다. / Leave out the unclear part, and share only what's certain. | 없음 (기존 피드백 "상담사는 그 질문을 받게 되고, 그때마다 각자 다르게 답하게 됩니다." 그대로 맞음) |
| kbrequest-q2 | a (오답) | 요청은 보냈으니, 담당자가 고칠 때까지 기다리며 진행 상황만 확인한다. / The request is in, so wait for the owner to fix it and just check on progress. | 요청을 보낸 뒤 담당자가 고칠 때까지 기다리며 진행 상황만 확인한다. / Wait for the owner to fix it after sending the request, and just check on progress. | 없음 (기존 피드백 "그동안 상담사들은 틀린 문서대로 안내합니다." 그대로 맞음) |

#### 사본에서 돌린 테스트

```
cd /tmp/p3/sme/repo/agent-lifecycle && node --test tests/answer-length.test.js tests/sme.test.js tests/sme-lifecycle.test.js tests/sme-sop.test.js tests/korean-role-names.test.js
```

결과: pass 74 / fail 7.
- 통과: sme, sme-lifecycle, sme-sop 의 "reason clauses do not give away the wrong options"와 "single longest option" 길이 가드, sme/sme-lifecycle/sme-sop 강의 테스트 전체(한국어·영어 문안 일치, 영어 문장 수 ≤ 한국어 포함), korean-role-names 전체.
- 실패 7개는 모두 다른 강의(agent, agent-career, tl, tl-support, lifecycle, sop, review)의 이유절 가드로, 맡은 범위 밖입니다.

다른 곳 확인: 바꾼 보기 문장은 review/data.js 나 다른 강의에서 쓰이지 않습니다(docs/superpowers/reviews/2026-11-26-answer-length-proposal.md 에 2단계 기록으로만 남아 있음, 손대지 않음).

---

## 팀장 1부 (팀장 첫걸음 · 팀장 서포트 · 복습 퀴즈)

### 3단계 초안 — tl-a (팀장 첫걸음 · 팀장 서포트 라이프사이클 · 복습 퀴즈)

작업 사본: /tmp/p3/tl-a/repo (레포 원본은 손대지 않음). 사본에서 js 와 문안 md(ko/en)를 함께 고쳤습니다.
질문·보기 id·정답 id는 그대로입니다. 고친 보기 9개(정답 7, 오답 4 — 한 문항에서 정답과 오답을 함께 고친 경우 포함).

#### 팀장 첫걸음 (tl/)

요약: 정답 이유절 0/14 → 2/14, 오답 이유절 2/28 → 2/28, 단서 문항 0 → 0, 정답이 혼자 가장 긴 문항(후) 2/14.

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| start-q1 | b (정답) | 적어 두고, 이유를 파악한 뒤에 바꿀지 정한다. / Note it down, and decide whether to change it once you know why. | 그 방식에도 사정이 있을 수 있으니, 적어 두고 이유를 파악한 뒤에 바꿀지 정한다. / There may be a reason behind the old way, so note it down and decide whether to change it once you know why. | 없음 (정답) |
| listen-q1 | b (정답) | 몇 건 더 들어 보고, 반복되면 습관으로 적는다. / Listen to a few more, and note it as a habit if it repeats. | 한 건은 우연일 수 있으니, 몇 건 더 듣고 반복되면 습관으로 적는다. / One call could be chance, so listen to a few more and note it as a habit if it repeats. | 없음 (정답) |

#### 팀장 서포트 라이프사이클 (tl-support/)

요약: 정답 이유절 0/10 → 2/10, 오답 이유절 4/20 → 4/20, 단서 문항 0 → 0, 정답이 혼자 가장 긴 문항(후) 2/10.

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| sme-q1 | b (정답) | 하린과 승인 범위 목록을 다시 맞춘다. / Go over the approval scope list with Harin again. | 같은 요청이 반복되니, 하린과 승인 범위 목록을 다시 맞춘다. / The same requests keep coming, so go over the approval scope list with Harin again. | 없음 (정답) |
| sme-q1 | c (오답) | 하린을 믿고, 앞으로는 알아서 판단하라고 한다. / Trust Harin and tell her to decide on her own from now on. | 하린을 믿고, 앞으로는 보상 요청을 모두 알아서 판단하라고 한다. / Trust Harin and tell her to decide every compensation request on her own from now on. | 없음 ("기준 없이 맡기면 요청마다 다르게 승인하게 됩니다"가 그대로 맞음). 정답 b가 혼자 가장 길어지지 않게 늘림 |
| team-q1 | b (정답) | 한자리에 모아 같은 원인인지 함께 본다. / Bring them together and see whether it is the same cause. | 원인이 하나일 수 있으니, 한자리에 모아 함께 본다. / The problems may share a cause, so bring them together and look at them jointly. | 없음 (정답) |

#### 복습 퀴즈 (review/data.js)

요약: 정답 이유절 0/12 → 3/12, 오답 이유절 10/24 → 8/24, 단서 문항 2 (tl-q6, sme-q5) → 0, 정답이 혼자 가장 긴 문항(후) 2/12.

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| tl-q5 | c (정답) | QA에 캘리브레이션을 요청해 기준을 맞추고, 결과를 팀에 알린다. / Ask QA for calibration to align the standard, then tell the team the outcome. | 팀 전체의 문제일 수 있으니, QA에 캘리브레이션을 요청하고 결과를 팀에 알린다. / It may be a team-wide problem, so ask QA for calibration and tell the team the outcome. | 없음 (정답) |
| tl-q6 | b (오답) | 같은 실수가 없도록, 팀 허들에서 서아의 티켓을 사례로 보여 준다. / Show Seoa's tickets as an example at the team huddle, so no one repeats the mistake. | 팀 허들에서 서아의 티켓을 사례로 보여 주며 같은 실수를 막는다. / Show Seoa's tickets as an example at the team huddle to stop the mistake repeating. | 없음 ("신입의 실수를 팀 앞에서 다루면…"이 그대로 맞음) |
| sme-q1 | a (정답) | 서준에게 먼저 가고, 준호와 팀장에게는 언제 할지 알린다. / Go to Seojun first, and tell Junho and the team leader when you will get to them. | 보류 고객이 먼저이니, 서준에게 가고 준호와 팀장에게 언제 할지 알린다. / The customer on hold comes first, so go to Seojun, and tell Junho and the team leader when you will get to them. | 없음 (정답) |
| sme-q5 | a (정답) | 지민에게 설명하고, 허들과 팀 채팅방으로 모두에게 바로 전한다. / Explain it to Jimin, and pass it to everyone right away through the huddle and team chat. | 평가가 코앞이니, 지민에게 설명하고 허들과 팀 채팅방으로 모두에게 전한다. / Scoring is close, so explain it to Jimin and pass it to everyone through the huddle and team chat. | 없음 (정답) |
| sme-q5 | c (오답) | 평가가 모레부터이니, QA에게 지민만 이번 평가에서 빼 달라고 요청한다. / Scoring starts the day after tomorrow, so ask QA to leave Jimin out of this round. | 지민만 이번 평가에서 빼 달라고 QA에게 요청한다. / Ask QA to leave just Jimin out of this round of scoring. | 없음 ("한 사람만 빼면 기준이 사람마다 달라집니다…"가 그대로 맞음; 평가 일정은 질문에 이미 있음) |

참고: 정답 길이 가드 때문에 동률을 쓴 문항이 있습니다 — 복습 sme-q1 a(40)는 c(41)보다 짧고, sme-q5 a(41)는 b(41)와 같은 길이입니다(동률은 '혼자 가장 긺'이 아님).

#### 사본에서 돌린 테스트

```
cd /tmp/p3/tl-a/repo/agent-lifecycle && node --test tests/answer-length.test.js tests/tl-courses.test.js tests/review.test.js tests/korean-role-names.test.js
```
결과: tests 96, pass 89, fail 7. 실패 7개는 모두 다른 강의(agent, agent-career, sme, sme-lifecycle, sme-sop, lifecycle, sop)의 이유절 가드입니다. 맡은 항목인 tl / tl-support / review 의 길이 가드·이유절 가드, tl-courses(ko/en 문안 일치), review(ko/en 문안 일치, 영어 문장 수 ≤ 한국어), korean-role-names 는 모두 통과했습니다.
추가로 `tests/option-order.test.js tests/lessonSchema.test.js tests/i18n.test.js` 도 41/41 통과했습니다.

옛 문구는 docs/superpowers/reviews/2026-11-26-answer-length-proposal.md(2단계 기록)에만 남아 있으며, 기록 문서라 그대로 두었습니다.

---

## 팀장 2부 (상담사 라이프사이클 · 팀장 SOP)

### tl-b — 3단계 초안: 이유절 단서 없애기 (상담사 라이프사이클 · 팀장 SOP)

레포 원본은 건드리지 않았고, 사본 `/tmp/p3/tl-b/repo` 에서만 고쳤습니다.
고친 파일(사본):
- 상담사 라이프사이클: `agent-lifecycle/js/lessons/01-hiring.js, 03-nesting.js, 04-coaching.js, 05-retention.js, 06-career.js`, `docs/superpowers/specs/2026-11-20-lifecycle-track-questions.md` (트랙 -2 문항 보기)
- 팀장 SOP: `sop-library/lessons/01-escalation.js, 05-onboarding.js, 07-launch.js, 10-transition.js`, `docs/superpowers/specs/2026-11-19-sop-library-copy-ko.md, 2026-11-19-sop-library-2-copy-ko.md, 2026-11-22-team-leader-self-copy.md, 2026-11-22-team-leader-self-copy.en.md`
- 오답 피드백 문안(md·js)은 바꿀 필요가 없었습니다. 바꾼 오답 4+1개 모두 행동은 그대로 두고 이유 표시만 뺐기 때문에 기존 피드백이 그대로 맞습니다. 질문·보기 id·정답 id·해설은 그대로입니다.

#### 상담사 라이프사이클 (30문항, 트랙 질문 포함)

| 항목 | 전 | 후 |
|---|---|---|
| 정답 중 이유절 | 0/30 | 8/30 (26.7%) |
| 오답 중 이유절 | 30/60 (50%) | 24/60 (40%) → 기준 절반 20% |
| 단서 문항(오답 둘만 이유절) | 9 | 0 |
| 정답이 혼자 가장 긴 문항 | 7 | 7 (한도 10) |

방법: 정답 8개에 짧은 현장 이유를 붙이고(길이 가드를 넘지 않게 다른 부분을 줄임), 단서 문항의 오답 6개는 이유절을 빼고 행동만 남기거나 "~로 보고, ~하며," 같은 서술로 바꿨습니다.

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| hiring-general | b (정답) | 안 되는 이유와 함께 정책 안의 다른 방법을 제안한다. / Explains why not, along with another option within policy. | 방법을 얻어 가도록, 안 되는 이유와 정책 안의 대안을 함께 제안한다. / So the customer leaves with a way forward, explains why not along with another option within policy. | 없음 (기존 피드백이 새 문장과 맞음) |
| hiring-tech | b (정답) | 증상과 발생 조건부터 묻고, 원인을 하나씩 좁힌다. / Asks about the symptom and when it happens, then narrows down causes one by one. | 처음 보는 증상이니, 증상과 발생 조건부터 묻고 원인을 하나씩 좁힌다. / Since the symptom is new, asks about it and when it happens first, then narrows down causes one by one. | 없음 (기존 피드백이 새 문장과 맞음) |
| nesting-q1 | b (정답) | 정확성을 칭찬하고, 속도는 적응한 뒤에 다루자고 한다. / Praise her accuracy and say speed can wait until she settles in. | 안내가 정확하니, 그 점을 칭찬하고 속도는 적응한 뒤에 다루자고 한다. / Her information is accurate, so praise that and say speed can wait until she settles in. | 없음 (기존 피드백이 새 문장과 맞음) |
| nesting-general | a (오답) | 부딪혀 봐야 빨리 느니, 끝까지 혼자 처리하게 둔다. / People learn fastest by facing it, so leave her to finish it alone. | 끝까지 혼자 처리하게 두고, 부딪히며 배우게 한다. / Leave her to finish it alone and learn by facing it. | 없음 (기존 피드백이 새 문장과 맞음) |
| nesting-tech | a (오답) | 스스로 원인을 찾아야 실력이 느니, 해결할 때까지 기다려 준다. / Finding the cause herself is how she grows, so wait until she solves it. | 해결할 때까지 기다려 주며, 스스로 원인을 찾게 한다. / Wait until she solves it, and let her find the cause herself. | 없음 (기존 피드백이 새 문장과 맞음) |
| nesting-tech-2 | a (정답) | 넘기기 전 확인 단계와 넘기는 기준을 다시 짚어 준다. / Go over the checks to try before passing a ticket on, and the criteria for passing it. | 습관이 되지 않도록, 넘기기 전 확인 단계와 기준을 다시 짚어 준다. / So it does not become a habit, go over the checks to try before passing a ticket on, and the criteria for passing it. | 없음 (기존 피드백이 새 문장과 맞음) |
| coaching-general | b (정답) | 공감을 칭찬하고, 맞는 내용과 말할 문장을 알려 준다. / Praise the empathy, and give her the correct content and the sentence to say. | 둘 다 다음 콜로 이어지도록, 공감을 칭찬하고 맞는 내용과 말할 문장을 알려 준다. / So both carry into her next call, praise the empathy and give her the correct content and the sentence to say. | 없음 (기존 피드백이 새 문장과 맞음) |
| coaching-tech | a (오답) | 해결 시간이 짧은 건 강점이니, 다른 팀원에게 노하우를 공유하게 한다. / A short resolution time is a strength, so have them share their know-how with the team. | 해결 시간이 짧은 것을 강점으로 보고, 노하우를 다른 팀원에게 공유하게 한다. / Treat the short resolution time as a strength and have them share their know-how with the team. | 없음 (기존 피드백이 새 문장과 맞음) |
| coaching-general-2 | c (정답) | 캘리브레이션에서 두 항목의 채점 기준을 맞춘다. / In calibration, align how each of the two items is scored. | 기준이 달라 생긴 차이니, 캘리브레이션에서 채점 기준을 맞춘다. / The gap comes from different standards, so align the scoring standards in calibration. | 없음 (기존 피드백이 새 문장과 맞음) |
| retention-q1 | b (정답) | 잠시 쉬게 하고, 끊은 판단이 맞았다고 말해 준다. / Give her a short break and tell her ending the call was the right decision. | 충격이 가라앉도록, 잠시 쉬게 하고 끊은 판단이 맞았다고 말해 준다. / So the shock can settle, give her a short break and tell her ending the call was the right decision. | 없음 (기존 피드백이 새 문장과 맞음) |
| retention-tech | b (정답) | 근무 안에 학습 시간을 잡고, 그 시간을 지켜 준다. / Schedule learning time within working hours, and protect it. | 출시 전에 익히도록, 근무 안에 학습 시간을 잡고 그 시간을 지켜 준다. / So everyone learns it before launch, schedule learning time within working hours, and protect it. | 없음 (기존 피드백이 새 문장과 맞음) |
| retention-tech-2 | c (오답) | 지친 상태이니, 회복될 때까지 당분간 쉬운 티켓만 맡겨 부담을 덜어 준다. / They are worn out, so give them only easy tickets until they recover. | 회복될 때까지 당분간 쉬운 티켓만 맡겨 부담을 덜어 준다. / Give them only easy tickets until they recover, to lighten the load. | 없음 (기존 피드백이 새 문장과 맞음) |
| career-tech | c (오답) | 의욕이 있을 때 맡겨야 하니, 준비 과정 없이 바로 2차 지원으로 보낸다. / Use the motivation while it lasts and move them to Tier 2 right away, with no preparation. | 의욕이 있을 때 준비 과정 없이 바로 2차 지원으로 보낸다. / Move them to Tier 2 right away while the motivation lasts, with no preparation. | 없음 (기존 피드백이 새 문장과 맞음) |
| career-general-2 | b (오답) | 그달에 퇴사가 몰렸을 뿐이니, 다음 달 면담 결과를 보고 판단한다. / Departures just clustered that month, so decide after seeing next month's interviews. | 그달에 퇴사가 몰린 것으로 보고, 다음 달 면담 결과까지 기다려 판단한다. / Treat it as departures clustering that month, and wait for next month's interviews before deciding. | 없음 (기존 피드백이 새 문장과 맞음) |

#### 팀장 SOP (21문항)

| 항목 | 전 | 후 |
|---|---|---|
| 정답 중 이유절 | 0/21 | 3/21 (14.3%) |
| 오답 중 이유절 | 7/42 (16.7%) | 6/42 (14.3%) → 기준 절반 7.1% |
| 단서 문항 | 1 (launch-q1) | 0 |
| 정답이 혼자 가장 긴 문항 | 5 | 5 (한도 7) |

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 |
|---|---|---|---|---|
| escalation-q2 | b (정답) | 감정 표현까지 포함해 모든 과정을 사실대로 적는다. / The whole exchange as fact, including the customer's expressions of feeling. | 그대로 전해지도록, 감정 표현까지 모든 과정을 사실대로 적는다. / The whole exchange as fact, including the customer's expressions of feeling, so it carries over intact. | 없음 (기존 피드백이 새 문장과 맞음) |
| transition-q2 | b (정답) | 다른 팀원과 같은 기준으로, 1:1에서 차분히 말한다. / Talk with her calmly in a one-on-one, by the same standard as everyone else. | 형평이 서도록, 같은 기준으로 1:1에서 차분히 말한다. / So fairness holds, talk with her calmly in a one-on-one, by the same standard as everyone else. | 없음 (기존 피드백이 새 문장과 맞음) |
| onboarding-q1 | a (정답) | 버디를 정해 팀에 소개하고, 첫 주 1:1로 어려움을 듣는다. / Assign a buddy, introduce her to the team, and hear her first-week struggles in a one-on-one. | 적응하도록, 버디를 정해 팀에 소개하고 첫 주 1:1로 어려움을 듣는다. / To help her settle in, assign a buddy, introduce her to the team, and hear her first-week struggles in a one-on-one. | 없음 (기존 피드백이 새 문장과 맞음) |
| launch-q1 | b (오답) | 몇 명을 가르칠지 보이도록, 완성된 교육 커리큘럼과 일정. / A finished training curriculum and schedule, to show how many people will be taught. | 완성된 교육 커리큘럼과 일정. / A finished training curriculum and schedule. | 없음 (기존 피드백이 새 문장과 맞음) |

#### 사본 검증

```
cd /tmp/p3/tl-b/repo/agent-lifecycle && node --test tests/answer-length.test.js tests/lessons.test.js tests/sop.test.js tests/track.test.js tests/glossary.test.js tests/korean-role-names.test.js
```
결과: pass 130 / fail 8. 맡은 두 강의 항목은 모두 통과합니다:
- `lifecycle: reason clauses do not give away the wrong options` ok, `sop: …` ok
- `lifecycle/sop: the right answer is the single longest option …` ok
- lessons.test.js(트랙 질문 승인 문안 대조, 오답 피드백 60개 대조), sop.test.js(문안 md 대조, 피드백 42개 대조), track, glossary, korean-role-names 모두 ok
남은 실패 8개는 다른 담당 강의(agent, agent-career, sme, sme-lifecycle, sme-sop, tl, tl-support, review)의 이유절 항목입니다.

#### 확인해 주실 점
- coaching-general-2.c 는 길이 때문에 "두 항목의 채점 기준" → "채점 기준"으로 줄였습니다(두 항목은 질문에 나옴).
- hiring-general.b 는 "다른 방법" → "대안"으로 줄였습니다.
- transition-q2.b 는 "다른 팀원과 같은 기준" → "같은 기준"(앞의 "형평이 서도록"이 같은 뜻을 담음). 영어는 "by the same standard as everyone else" 유지.
