# 상담사 라이프사이클: 직군별 체크포인트 문제 추가 (짧은 설계)

작성일: 2026-11-20 · 한국어 문안 승인: 2026-11-20 (사용자 "승인")

## 결정
- 단계마다 일반 고객지원·기술지원 체크포인트 문제를 1개씩 더한다. 내 직군에서 보이는 문항은 공통 1 + 직군 2 = 3개. (레슨 검사기는 직군별로 1–3개를 허용한다. SOP 라이브러리처럼 직군 구분이 없는 강의도 같은 검사기를 쓰기 때문이다.)
- 영어는 검토 뒤 강의 전체 용어(team leader, skills verification, higher tier, Tier 1, QA staff, knowledge base articles, specialist support)에 맞췄다.
- id: `<레슨>-general-2`, `<레슨>-tech-2`. 지금 있는 직군 문제 바로 뒤에 둔다. 정답 위치는 a·b·c로 고르게 나눈다.
- 각 단계 강의에서 다룬 내용만 묻고, 지금 있는 문제와 상황이 겹치지 않게 한다. 해설 3문장 이내, 특정 국가 법 이름 없음.
- `2026-11-18-tracks-and-verification-design.md`의 "트랙별로 보이는 체크포인트 문항은 1–2개"는 "2–3개"로 바뀐다.
- 오늘의 연습: 마친 레슨에서 고르는 문제가 12개 늘어난다(별도 코드 변경 없음).

## 문안 (테스트가 레슨 파일과 이 표가 같은지 확인한다)

| 항목 | 한국어 | English |
|---|---|---|
| hiring-general-2.prompt | 일반 고객지원 면접에서 두 지원자가 남았습니다. A는 타자가 매우 빠르지만 질문에 짧게만 답하고, B는 타자는 보통이지만 고객의 말을 되짚으며 대화를 이어 갑니다. 누구를 더 높게 볼까요? | In a general support interview, two candidates are left. A types very fast but gives only short answers; B types at an ordinary pace but reflects back what the customer says and keeps the conversation going. Who do you rate higher? |
| hiring-general-2.a | A — 빠른 입력이 처리 시간을 줄이고, 대화는 교육으로 늘릴 수 있다. | A — fast entry cuts handle time, and conversation can be built in training. |
| hiring-general-2.b | 둘 다 탈락시키고, 두 가지를 다 갖춘 지원자를 다시 찾는다. | Reject both, and look again for a candidate who has both. |
| hiring-general-2.c | B — 대화력과 공감은 가르치기 어렵다. | B — conversational range and empathy are hard to teach. |
| hiring-general-2.answer | c | c |
| hiring-general-2.explanation | 일반 고객지원 채용은 대화력과 공감을 더 봅니다. 입력 속도는 온보딩에서 훈련할 수 있지만, 성향은 교육으로 바꾸기 어렵습니다. | General support hiring pays closer attention to conversational range and empathy. Typing speed can be trained in onboarding, but temperament is hard to change through training. |
| hiring-tech-2.prompt | 기술지원 채용에서 채팅·이메일 응대 능력을 확인하려 합니다. 어떤 평가를 넣을까요? | In tech support hiring, you want to check how candidates handle chat and email. What assessment do you add? |
| hiring-tech-2.a | 전화 모의 상담만으로 충분하다고 본다. | A phone mock call alone is enough. |
| hiring-tech-2.b | 해결 안내 메일을 직접 쓰게 하고, 따라 하기 쉬운지 본다. | Have them write a solution email and check whether it is easy to follow. |
| hiring-tech-2.c | 기술 용어 필기시험을 넣어, 용어를 정확히 아는 지원자를 가려낸다. | Add a written technical vocabulary test to pick out candidates who know the terms precisely. |
| hiring-tech-2.answer | b | b |
| hiring-tech-2.explanation | 기술지원 문의는 글로도 들어옵니다. 원인과 해결 단계를 고객이 따라 할 수 있게 글로 쓰는지가 채용에서 확인할 부분입니다. | Tech support inquiries also arrive in writing. Hiring should check whether a candidate can write the cause and the fix so the customer can follow along. |
| onboarding-general-2.prompt | 일반 고객지원 스킬 검증의 모의 콜에서 지민은 자주 들어오는 문의는 잘 처리했지만, 드문 정책 문의에서 틀리게 안내했습니다. 어떻게 할까요? | In the general support skills verification mock call, Jimin handles the common inquiries well but gives wrong information on a rarer policy question. What do you do? |
| onboarding-general-2.a | 대부분 맞은 것을 보고 합격시키고, 실전에서 배우게 한다. | Pass her because she got most of it right, and let her learn on the job. |
| onboarding-general-2.b | 틀린 안내 하나로 기준 미달 판정을 내리고 바로 탈락시킨다. | Rule the wrong information below the standard and drop her right away. |
| onboarding-general-2.c | 보충 교육 뒤 그 유형으로 다시 평가한다. | Give extra training, then reassess her on that type. |
| onboarding-general-2.answer | c | c |
| onboarding-general-2.explanation | 스킬 검증은 탈락시키려는 자리가 아니라, 실전에 나갈 준비가 됐는지 확인하는 자리입니다. 일반 고객지원은 정책 범위가 넓어서, 틀린 안내가 그대로 고객 불만으로 이어집니다. | Skills verification is not there to weed people out; it confirms readiness for real customers. General support covers a wide range of policy, so wrong information turns straight into customer complaints. |
| onboarding-tech-2.prompt | 기술지원 교육 막바지에 제품 업데이트가 나와 교육 자료 일부가 맞지 않게 됐습니다. 어떻게 할까요? | Near the end of tech support training, a product update makes part of the training material out of date. What do you do? |
| onboarding-tech-2.a | 바뀐 부분은 실전에서 알아서 익히게 한다. | Let the trainees pick up the changes on the job. |
| onboarding-tech-2.b | 바뀐 부분을 지식 자료에서 찾는 법을 익히게 한다. | Have the trainees practice finding the changes in the knowledge base. |
| onboarding-tech-2.c | 틀린 내용을 가르치지 않도록, 업데이트가 안정될 때까지 교육을 멈춘다. | Pause training until the update settles, so nothing wrong gets taught. |
| onboarding-tech-2.answer | b | b |
| onboarding-tech-2.explanation | 기술지원은 제품이 바뀌면 알아야 할 내용도 바뀝니다. 모든 내용을 외우게 하기보다, 지식 자료를 찾아 확인하는 습관을 교육 단계에서 길러 줍니다. | In tech support, when the product changes, what agents need to know changes too. Rather than memorizing everything, build the habit of looking things up in the knowledge base during training. |
| nesting-general-2.prompt | 네스팅 둘째 주, 지민은 단순 조회와 안내 문의를 실수 없이 처리합니다. 다음은 어떻게 할까요? | In the second week of nesting, Jimin handles simple lookups and information requests without mistakes. What next? |
| nesting-general-2.a | 바로 모든 유형의 문의를 맡긴다. | Give her every type of inquiry at once. |
| nesting-general-2.b | 변경 문의로 범위를 넓히고, 직무전문가가 계속 들으며 돕는다. | Widen her range to change requests, with the SME still listening in to help. |
| nesting-general-2.c | 자신감을 지키도록, 실수 없는 지금 유형만 당분간 계속 맡긴다. | To protect her confidence, keep her on the types she handles without mistakes for now. |
| nesting-general-2.answer | b | b |
| nesting-general-2.explanation | 일반 고객지원은 쉬운 유형부터 차례로 넓힙니다. 한 번에 모든 유형을 맡기면 막히는 순간이 몰립니다. 범위를 넓힐 때도 플로어 서포트는 이어 갑니다. | General support widens from easy types in order. Handing over every type at once piles up the moments she gets stuck. Floor support continues as the range widens. |
| nesting-tech-2.prompt | 기술지원 네스팅 중인 지민이 원인을 찾아보기도 전에 티켓을 곧바로 상위 단계로 넘기는 일이 잦습니다. 어떻게 할까요? | During tech support nesting, Jimin often passes tickets straight to a higher tier before looking for the cause. What do you do? |
| nesting-tech-2.a | 습관이 되지 않도록, 넘기기 전 확인 단계와 기준을 다시 짚어 준다. | So it does not become a habit, go over the checks to try before passing a ticket on, and the criteria for passing it. |
| nesting-tech-2.b | 혼자 푸는 힘을 기르도록, 넘기는 것을 금지하고 혼자 해결하게 한다. | Ban passing tickets on so she builds the ability to solve them alone. |
| nesting-tech-2.c | 익숙해질 때까지 바로 넘기는 습관을 그대로 둔다. | Leave the habit of passing tickets straight on until she gets used to the work. |
| nesting-tech-2.answer | a | a |
| nesting-tech-2.explanation | 너무 늦게 넘기는 것도, 너무 빨리 넘기는 것도 문제입니다. 1차 지원에서 할 수 있는 확인을 마치고 정해진 기준에 따라 넘기는 습관을 네스팅에서 들여야 상위 단계의 부담이 줄어듭니다. | Passing too late and passing too early are both problems. Building the habit in nesting of finishing the Tier 1 checks and escalating by the agreed criteria eases the load on higher tiers. |
| coaching-general-2.prompt | 같은 콜을 두고 팀장은 공감 표현이 좋았다고, QA 담당은 정책 안내 순서를 지키지 않았다고 서로 다른 점수를 매겼습니다. 어떻게 할까요? | On the same call, the team leader scored the empathy highly, while the QA staff member marked it down for not explaining the policy in the set order. Their scores differ. What do you do? |
| coaching-general-2.a | 팀원을 가장 잘 아는 팀장의 점수를 공식 점수로 따른다. | Use the score of the team leader, who knows the agent best, as the official one. |
| coaching-general-2.b | 어느 쪽도 틀리지 않았으니, 두 점수의 평균을 공식 점수로 삼는다. | Neither is wrong, so make the average of the two the official score. |
| coaching-general-2.c | 기준이 달라 생긴 차이니, 캘리브레이션에서 채점 기준을 맞춘다. | The gap comes from different standards, so align the scoring standards in calibration. |
| coaching-general-2.answer | c | c |
| coaching-general-2.explanation | 평가자마다 기준이 다르면 상담사는 무엇을 고쳐야 할지 알 수 없습니다. 일반 고객지원은 정책 정확도와 공감을 함께 보므로, 두 항목의 채점 기준을 캘리브레이션으로 맞춥니다. | If each evaluator uses a different standard, agents cannot tell what to fix. General support looks at both policy accuracy and empathy, so calibration aligns how each is scored. |
| coaching-tech-2.prompt | 팀원 한 명의 에스컬레이션 비율이 팀에서 가장 높습니다. 코칭에서 무엇부터 할까요? | One team member’s escalation rate is the highest on the team. What do you start with in coaching? |
| coaching-tech-2.a | 다음 달까지 비율을 낮추라고 한다. | Tell them to bring the rate down by next month. |
| coaching-tech-2.b | 넘긴 티켓 몇 건으로 진단이 멈춘 곳을 함께 찾는다. | Go through a few tickets they passed on and find together where the diagnosis stopped. |
| coaching-tech-2.c | 비율을 공개해 다른 팀원과 비교하게 한다. | Publish the rates so they can compare with others. |
| coaching-tech-2.answer | b | b |
| coaching-tech-2.explanation | 숫자는 무엇이 문제인지가 아니라 어디를 봐야 하는지를 알려 줍니다. 실제 티켓으로 진단 과정을 짚어야 구체적인 개선 방법이 나옵니다. | A number tells you where to look, not what the problem is. Walking through real tickets is what turns up a specific way to improve. |
| retention-general-2.prompt | 악성 민원 콜이 이어진 날, 일반 고객지원 팀원 여럿이 지쳐 보입니다. 어떻게 할까요? | After a day of abusive calls, several people on the general support team look worn out. What do you do? |
| retention-general-2.a | 근무 중 짧게 모여 힘든 콜을 나누고, 심리 상담(EAP)을 안내한다. | Gather briefly during work to talk through the hard calls, and point people to the EAP. |
| retention-general-2.b | 따로 이야기 없이, 내일 새로 시작하자고 한다. | Skip any talk and say you will start fresh tomorrow. |
| retention-general-2.c | 가장 지친 사람을 따로 불러, 오늘 실적이 떨어진 이유를 함께 짚어 본다. | Call in the most exhausted person and go over why their numbers dropped today. |
| retention-general-2.answer | a | a |
| retention-general-2.explanation | 감정노동은 쌓이면 번아웃이 됩니다. 힘든 날을 함께 정리하는 자리를 만들고 회사의 케어 제도를 팀장이 직접 연결해 줄 때, 제도가 실제로 쓰입니다. | Emotional labor turns into burnout when it builds up. Care programs actually get used when the team leader makes room to process hard days together and connects people to them directly. |
| retention-tech-2.prompt | 기술지원 상담사 한 명이 몇 주째 어려운 티켓만 맡아 지쳐 보입니다. 어떻게 할까요? | A tech support agent has handled only hard tickets for weeks and looks worn out. What do you do? |
| retention-tech-2.a | 어려운 티켓은 실력 있는 사람에게 계속 맡기고, 지금 배정을 그대로 둔다. | Keep hard tickets with the skilled person, and leave the current assignments as they are. |
| retention-tech-2.b | 쉬운 티켓을 섞어 주고, 해결 사례를 지식 자료로 정리하게 한다. | Mix in easier tickets, and have them write up solved cases for the knowledge base. |
| retention-tech-2.c | 회복될 때까지 당분간 쉬운 티켓만 맡겨 부담을 덜어 준다. | Give them only easy tickets until they recover, to lighten the load. |
| retention-tech-2.answer | b | b |
| retention-tech-2.explanation | 어려운 티켓이 이어지면 인지 부담이 쌓입니다. 부담은 나누고 해결 경험을 지식 자료로 남기게 하면, 지친 경험이 기술적인 성장으로 이어집니다. | A run of hard tickets builds cognitive load. Spreading the load and having them record what they solved in the knowledge base turns a draining stretch into technical growth. |
| career-general-2.prompt | 일반 고객지원 퇴사 면담에서 "매일 같은 문의만 받아 성장하는 느낌이 없었다"는 말이 여러 번 나옵니다. 무엇을 할까요? | In general support exit interviews, several people say, “I handled the same inquiries every day and never felt I was growing.” What do you do? |
| career-general-2.a | 개인 성향의 문제로 기록하고 넘긴다. | Record it as a matter of personal temperament and move on. |
| career-general-2.b | 그달에 퇴사가 몰렸을 뿐이라 여기고, 다음 달 면담 결과까지 기다려 판단한다. | Wait for next month's interviews before deciding, putting it down to departures clustering that month. |
| career-general-2.c | 남은 팀원에게 문의 유형 순환과 전문 상담 경로를 먼저 보여 준다. | Show the people still on the team inquiry rotation and paths such as specialist support up front. |
| career-general-2.answer | c | c |
| career-general-2.explanation | 퇴사 면담에서 나온 개선점은 다음 관리에 반영해야 의미가 있습니다. 같은 이유가 반복된다면 남아 있는 팀원도 같은 이유로 떠날 수 있습니다. | Improvements from exit interviews only matter once they feed into how you manage next. If the same reason keeps coming up, the people still on the team may leave for the same reason. |
| career-tech-2.prompt | 기술지원 상담사가 같은 문제를 고객마다 반복해 설명하는 것이 아깝다며 해결 방법을 문서로 정리해 두었습니다. 무엇을 할까요? | A tech support agent felt it was wasteful to explain the same problem to customer after customer, so they wrote the fix up as a document. What do you do? |
| career-tech-2.a | 지식 자료 담당을 맡겨 보고, 그 경로를 함께 이야기한다. | Try giving them the knowledge base role, and talk through that path together. |
| career-tech-2.b | 업무 시간에는 문서 대신 상담에 집중하라고 한다. | Tell them to focus on contacts, not documents, during work hours. |
| career-tech-2.c | 문서를 받아 팀장 이름으로 공유한다. | Take the document and share it under the team leader's name. |
| career-tech-2.answer | a | a |
| career-tech-2.explanation | 기술지원에는 지식 자료를 만들고 고치는 길도 있습니다. 상담사가 스스로 보여 준 강점을 경로와 연결해 주는 것이 팀장의 몫입니다. | Tech support also has a path in creating and updating knowledge base articles. Connecting a strength the agent has shown on their own to a career path is the team leader’s part. |
