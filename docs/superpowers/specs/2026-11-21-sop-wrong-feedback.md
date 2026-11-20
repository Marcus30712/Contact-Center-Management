# SOP 라이브러리: 오답마다 다른 피드백 (짧은 설계)

작성일: 2026-11-21 · 한국어 28문장 승인: 2026-11-21 (견본 8문장 "승인", 나머지 20문장 "진행")

## 결정
- 상담사 라이프사이클과 같은 방식(`2026-11-20-lifecycle-wrong-feedback.md`의 방법 A)을 SOP 라이브러리 14문제의 오답 28개에 적용한다.
- 화면 코드는 같은 레슨 화면(`agent-lifecycle/js/render/lesson.js`)을 쓰므로 바꾸지 않는다. 오늘의 연습에도 그대로 나온다.
- 각 SOP 본문의 역할 분담(HR·WFM·T&D·OM)에 맞춰 쓴다.

## 문안 (테스트가 레슨 파일과 이 표가 같은지 확인한다)

| 문제.보기 | 한국어 | English |
|---|---|---|
| escalation-q1.a | 권한 밖의 요구를 두고 규정만 설명하면, 고객은 해결이 아니라 논쟁을 하고 있다고 느껴 감정이 더 올라갑니다. | Explaining the rules about a request beyond her authority makes the customer feel they are in an argument, not getting help, and emotions rise. |
| escalation-q1.c | 다음 처리 없이 상담을 마치면 고객은 같은 불만을 처음부터 다시 말해야 하고, 불만은 더 커집니다. | Ending the call with no next step means the customer must repeat the whole complaint from the start, and the complaint grows. |
| escalation-q2.a | 결과만 적으면 넘겨받는 사람이 그동안 무슨 일이 있었는지 몰라, 고객에게 같은 질문을 다시 하게 됩니다. | Recording only the outcome leaves the next person unaware of what happened, so they ask the customer the same questions again. |
| escalation-q2.c | 느낌과 추측은 다음 담당자의 판단을 흐리고, 사실과 섞이면 실제로 무슨 일이 있었는지 알 수 없게 됩니다. | Feelings and guesses cloud the next person’s judgment, and mixed with facts they hide what actually happened. |
| coaching-q1.a | 원인을 먼저 정해 주면 지민은 이유를 스스로 생각해 볼 기회를 잃고, 해결책도 남의 것이 됩니다. | Naming the cause for her takes away Jimin’s chance to think it through, and the fix becomes someone else’s. |
| coaching-q1.c | 다른 팀원과 비교하면 방어적으로 되기 쉽고, 시간이 길어지는 진짜 이유는 이야기되지 않습니다. | Comparing her with teammates tends to make her defensive, and the real reason the time runs long never comes up. |
| coaching-q2.a | 고칠 점을 모두 적으면 무엇부터 할지 흐려지고, 다음 코칭 때 지켰는지 확인하기도 어렵습니다. | Listing every point to fix blurs what comes first, and makes it hard to check at the next session whether it was done. |
| coaching-q2.c | 계획 없이 숫자만 지켜보면 지민은 무엇을 해야 할지 모른 채 한 달을 보냅니다. | Watching the numbers without a plan leaves Jimin spending a month not knowing what to do. |
| pip-q1.a | 징계 근거를 남기려는 PIP로 받아들여지면, 도윤은 개선보다 방어에 힘을 쓰게 됩니다. | If the PIP comes across as building a case for discipline, Doyun will put his energy into defending himself rather than improving. |
| pip-q1.c | 다른 팀원에게 보여 주려는 PIP는 도윤을 본보기로 만들 뿐, 개선을 돕지 못합니다. | A PIP meant as a message to others only makes an example of Doyun; it does not help him improve. |
| pip-q2.a | "더 친절하게"는 잴 수 없어서, 기간이 끝나도 달성했는지 함께 판단할 수 없습니다. | “Be friendlier” cannot be measured, so when the period ends there is no shared way to judge whether it was met. |
| pip-q2.c | 팀 1등은 다른 사람의 결과에 달려 있어서, 도윤이 스스로 이룰 수 있는 공정한 목표가 되지 못합니다. | Being the best on the team depends on other people’s results, so it is not a fair goal Doyun can reach on his own. |
| calibration-q1.a | 시간을 줄이려고 함께 채점하면 점수가 서로 닮아 가, 정작 맞춰야 할 기준의 차이가 가려집니다. | Scoring together to save time makes the scores drift toward each other and hides the very differences in standards you need to align. |
| calibration-q1.c | 평가자를 줄 세우는 자리가 되면 솔직한 점수가 나오지 않아, 기준을 맞출 수 없습니다. | If the session ranks the evaluators, people stop giving honest scores, and the standards cannot be aligned. |
| calibration-q2.a | 참고용으로만 남기면 다음 평가에서 각자 원래 기준으로 돌아가 같은 차이가 다시 생깁니다. | Keeping it only for reference sends everyone back to their own standard at the next evaluation, and the same gap returns. |
| calibration-q2.c | 직급으로 점수를 정하면 토론한 근거가 사라지고, 다음 세션에서 아무도 의견을 내지 않게 됩니다. | Settling the score by rank throws away the reasons discussed, and at the next session nobody speaks up. |
| onboarding-q1.b | 근로 계약과 장비 지급은 HR이 맡는 일이라, 팀장이 붙잡으면 팀장만 할 수 있는 일이 비게 됩니다. | Contracts and equipment are HR’s job; if the team leader takes them on, the work only the team leader can do is left undone. |
| onboarding-q1.c | 근무 스케줄은 WFM이 맡고, 첫 2주의 서아에게 먼저 필요한 것은 팀에 속해 있다는 느낌입니다. | Schedules belong to WFM, and what Seoa needs first in her first two weeks is a sense that she belongs on the team. |
| onboarding-q2.a | 결과를 공유받는 사람은 I(Informed)이며, 그 일을 직접 하지는 않습니다. | The person told about the result afterward is I (Informed), who does not do the work. |
| onboarding-q2.b | 시작 전에 협의하는 사람은 C(Consulted)이며, 의견을 주지만 실무를 맡지는 않습니다. | The person consulted beforehand is C (Consulted), who gives input but does not do the work. |
| incident-q1.a | 원인을 직접 찾는 동안 보고가 늦어지면, 그사이 같은 불만이 쌓이고 다른 팀은 움직이지 못합니다. | Delaying the report while you hunt for the cause lets the same complaints pile up while the other teams cannot move. |
| incident-q1.b | 임시 답변은 원인 분석 뒤 T&D가 만드는 것이라, 지금 나눠 주면 팀마다 다른 안내가 나가 이슈가 커질 수 있습니다. | Interim answers are written by T&D after the cause is analyzed; handing out your own now sends different answers from different teams and can make the issue bigger. |
| incident-q2.b | 인력만 돌려보내고 마치면 이번에 배운 것이 남지 않아, 다음에도 같은 혼란을 겪습니다. | Just sending people back leaves nothing of what was learned, so the next incident brings the same confusion. |
| incident-q2.c | 실수한 팀을 찾는 회고는 사람들이 문제를 숨기게 만들어, 다음 대응을 오히려 어렵게 합니다. | A review that hunts for the team at fault teaches people to hide problems, which makes the next response harder. |
| launch-q1.b | 교육은 뽑은 사람을 가르치는 일이라, 몇 명이 필요한지 정해진 뒤에야 규모와 일정을 잡을 수 있습니다. | Training teaches the people you hire, so its size and schedule can only be set once you know how many people you need. |
| launch-q1.c | 상담 시스템을 다 갖춰도 필요한 인원을 모르면 몇 명을 뽑을지 정할 수 없습니다. | Even with the systems fully built, you cannot decide how many people to hire without knowing the staffing need. |
| launch-q2.a | 첫 달 데이터를 기다리는 동안, 현장에서 먼저 드러난 문제가 그대로 고객에게 전해집니다. | While you wait for first-month data, the problems that show up first on the floor go straight to customers. |
| launch-q2.b | 클라이언트 비즈니스 리뷰는 OM이 맡는 일이고, 론칭 직후 팀장이 있어야 할 곳은 현장입니다. | The client business review is the OM’s job; right after launch, the team leader belongs on the floor. |
