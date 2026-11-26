# 검수 반영 2단계 — 정답 길이 맞추기 제안 (2026-11-26)

상태: 승인·반영됨 (2026-11-26). 최종 검토 뒤 고친 곳은 LOG 69에 적었습니다.

목표: 강의마다 "정답이 혼자 가장 긴" 문항을 3분의 1 이하로. 정답은 뜻을 그대로 두고 줄이고, 오답은 현장에서 할 법한 행동으로 늘립니다. 정답이 늘 가장 짧아지지 않게 길이 위치를 섞었습니다. 질문·보기·정답 id는 그대로입니다.

| 강의 | 전 | 후 |
|---|---|---|
| 상담사 첫걸음 | 13/16 | 1/16 |
| 상담사 커리어 라이프사이클 | 9/10 | 0/10 |
| 직무전문가 첫걸음 | 13/14 | 1/14 |
| 직무전문가 서포트 라이프사이클 | 10/10 | 2/10 |
| 직무전문가 SOP | 16/16 | 3/16 |
| 팀장 첫걸음 | 12/14 | 2/14 |
| 팀장 서포트 라이프사이클 | 10/10 | 2/10 |
| 상담사 라이프사이클 | 29/30 | 6/30 |
| 팀장 SOP | 16/21 | 5/21 |
| 복습 퀴즈 (팀장 6 + 직무전문가 6) | 12/12 | 2/12 |
| 합계 | 140/153 | 24/153 |

1단계에서 미룬 작은 표현 지적 13건은 각 묶음의 맨 끝 표에 있습니다.

확인해 주시면 좋은 곳:
- 상담사 커리어 qa-q2: 정답을 "누가 매겨도 같은 점수가 나오게 하려고"로 줄이면서 "기준을 맞춘다"는 말이 보기에서 빠집니다.
- 팀장 SOP 캘리브레이션의 "교정 세션" → "캘리브레이션 세션"(용어 통일). Codex 직무별 하루의 "교정 세션 회의록"도 같이 "캘리브레이션 회의록"으로 맞추는 것을 제안합니다.
- 상담사 라이프사이클 레슨 2 노드 "실전 준비"(OJT 전) → "OJT 준비"(실전 배치와 헷갈리지 않게).

---

## 상담사

### agent 담당: 정답 길이 맞추기 제안 (상담사 첫걸음 · 상담사 커리어 라이프사이클)

- 길이는 한국어 글자 수(text.ko.length). "(그대로)"는 바꾸지 않는 보기입니다. 정답 id·보기 id는 모두 그대로, 정답에는 피드백 없음.
- 해설(explanation)은 바꾸지 않았습니다. 줄인 정답에서 빠진 세부(예: 승인, 보류 방법)는 해설과 스텝에 이미 있습니다.
- 정답이 늘 가장 짧아지지 않게, 일부 문항은 오답 하나만 늘려 정답이 중간 길이가 되게 했습니다.

#### 상담사 첫걸음 (agent)

요약: 정답이 혼자 가장 긴 문항 13 / 16 → 1 / 16

##### start / start-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| start-q1 | a | (그대로) 이름을 다 외울 때까지 누구에게도 묻지 않는다. | — | — |
| start-q1 | b ✓ | 자리와 역할을 메모해 두고, 누구에게 무엇을 물으면 되는지부터 익힌다. / Note down seats and roles, and learn first whom to ask about what. | 자리와 역할을 메모하고, 누구에게 무엇을 물을지부터 익힌다. / Note seats and roles, and learn first whom to ask about what. | — |
| start-q1 | c | 이름은 중요하지 않으니 신경 쓰지 않는다. / Names don't matter, so don't bother with them. | 이름은 중요하지 않으니, 첫 주에는 교육 내용만 외우고 사람은 신경 쓰지 않는다. / Names don't matter, so in the first week she memorizes only the training content and doesn't bother with people. | 사람을 알아야 막힐 때 도움을 청할 수 있습니다. 이름과 역할은 시간을 두고 익히면 됩니다. / Knowing people is how you get help when you're stuck. Learn names and roles over time. |

길이(ko): a=26, b=33, c=45 (정답 b) — 전: a=26, b=39, c=23

##### training / training-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| training-q1 | a | (그대로) 밤을 새워서라도 모두 외운다. | — | — |
| training-q1 | b ✓ | 자주 나오는 것부터 익히고, 나머지는 지식 베이스 어디에 있는지 익힌다. / Learn the common ones first, and for the rest, learn where they are in the knowledge base. | 자주 나오는 것은 익히고, 나머지는 지식 베이스 위치만 알아 둔다. / Learn the common ones, and for the rest, just know where they are in the knowledge base. | — |
| training-q1 | c | 실전 배치 뒤에 필요할 때 배운다. / Learn them after Go Live, when they're needed. | 지금 다 외우기는 어려우니, 실전 배치 뒤에 그 문의가 들어오면 그때 찾아 배운다. / She can't memorize it all now, so she'll look each one up after Go Live, when that contact comes in. | — |

길이(ko): a=16, b=37, c=46 (정답 b) — 전: a=16, b=40, c=19

##### nesting / nesting-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nesting-q1 | a | (그대로) 고객에게 기억나는 대로 안내한다. | — | — |
| nesting-q1 | b ✓ | 고객에게 확인할 시간이 필요하다고 양해를 구하고 통화를 보류한 뒤, 옆자리나 직무전문가에게 확인한다. / Tell the customer she needs a moment to check, put the call on hold, then check with the next seat or the SME. | 고객에게 양해를 구하고 보류한 뒤, 옆자리나 직무전문가에게 확인한다. / Ask the customer to bear with her, put the call on hold, then check with the next seat or the SME. | — |
| nesting-q1 | c | 찾을 때까지 고객을 말없이 기다리게 한다. / Leave the customer waiting in silence until she finds it. | 고객이 기다리는 것을 알기에, 찾을 때까지 말없이 지식 베이스를 계속 검색한다. / Knowing the customer is waiting, keep searching the knowledge base in silence until she finds it. | — |

길이(ko): a=18, b=38, c=44 (정답 b) — 전: a=18, b=56, c=23

##### nesting / nesting-q2 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nesting-q2 | a | "이거 어떻게 해요?" / "How do I do this?" | "고객이 환불해 달라는데 이거 어떻게 해요? 지금 통화 중이라 급해요." / "The customer wants a refund. How do I do this? I'm on the call, so it's urgent." | 무엇을 확인했고 무엇이 필요한지 빠져 있어, 하린이 되물어야 해서 답이 늦어집니다. / It leaves out what you checked and what you need, so Harin has to ask back and the answer comes later. |
| nesting-q2 | b ✓ | "환불 문의(예시)인데, 구매 날짜를 확인해 보니 기간이 지났습니다. 예외 승인이 되나요?" / "It's a refund request (Example). I checked the purchase date and it's past the window. Can we approve an exception?" | "환불 문의(예시)인데 구매 기간이 지났어요. 예외 승인 되나요?" / "Refund request (Example), past the purchase window. Can we approve an exception?" | — |
| nesting-q2 | c | "고객이 화났어요. 빨리 와 주세요." / "The customer is angry. Please come quickly." | "고객이 많이 화났어요. 제가 처리하기 어려우니 빨리 와 주세요." / "The customer is really angry. I can't handle this, so please come quickly." | — |

길이(ko): a=40, b=37, c=37 (정답 b) — 전: a=12, b=51, c=21

##### golive / golive-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| golive-q1 | a | 침묵이 길어지지 않게 아무 말이나 이어 간다. / Keep talking about anything so the silence doesn't drag on. | 침묵이 길어지면 고객이 불안해하니, 확실하지 않아도 생각나는 대로 말을 이어 간다. / Silence makes customers uneasy, so keep talking with whatever comes to mind, even if she isn't sure. | — |
| golive-q1 | b ✓ | "확인해 드리겠습니다"라고 말하고 정해진 방법으로 통화를 보류한 뒤, 메모와 지식 베이스를 본다. / Say "Let me check that for you," put the call on hold the agreed way, then look at her notes and the knowledge base. | "확인해 드리겠습니다" 하고 보류한 뒤, 메모와 지식 베이스를 본다. / Say "Let me check that for you," put the call on hold, then look at her notes and the knowledge base. | — |
| golive-q1 | c | 바로 통화를 다른 상담사에게 넘긴다. / Hand the call straight to another agent. | 혼자 해결하기 어려운 통화라고 보고, 바로 옆자리 선배 상담사에게 통화를 넘긴다. / Treat it as a call she can't solve alone and hand it straight to the senior agent next to her. | — |

길이(ko): a=46, b=38, c=45 (정답 b) — 전: a=25, b=54, c=20

##### golive / golive-q2 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| golive-q2 | a | 고객이 다시 연락하지 않으면 괜찮으니 넘어간다. / If the customer doesn't call back, it's fine, so let it go. | 고객이 다시 연락하지 않으면 문제없으니, 다음 문의를 받으며 넘어간다. / If the customer doesn't call back, there's no problem, so move on to the next contact. | — |
| golive-q2 | b ✓ | 바로 직무전문가나 팀장에게 알리고, 정해진 절차로 바로잡는다. / Tell the SME or team leader right away and correct it through the agreed process. | 바로 직무전문가나 팀장에게 알리고 절차대로 바로잡는다. / Tell the SME or team leader right away and correct it through the process. | — |
| golive-q2 | c | (그대로) 아무에게도 말하지 않고 혼자 고객에게 다시 연락한다. | — | — |

길이(ko): a=39, b=30, c=29 (정답 b) — 전: a=26, b=34, c=29

##### customers / customers-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| customers-q1 | a | 같은 문장을 더 크게, 빠르게 반복한다. / Repeat the same sentence louder and faster. | 잘 안 들리시는 것 같으니, 같은 문장을 더 크게 한 번 더 반복한다. / The customer seems not to hear well, so repeat the same sentence once more, louder. | — |
| customers-q1 | b ✓ | 더 짧은 문장으로 한 번에 하나씩 말하고, 이해했는지 확인한다. / Say one thing at a time in shorter sentences, and check they've understood. | 짧은 문장으로 하나씩 말하고, 이해했는지 확인한다. / Say one thing at a time in short sentences, and check they've understood. | — |
| customers-q1 | c | 문자로 보내 드리겠다고 하고 바로 통화를 끝낸다. / Say she'll send a text, then end the call right away. | 말로는 어려워 보이니 문자로 보내 드리겠다고 하고 바로 통화를 끝낸다. / Talking isn't working, so say she'll send a text and end the call right away. | — |

길이(ko): a=39, b=28, c=39 (정답 b) — 전: a=22, b=35, c=27

##### customers / customers-q2 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| customers-q2 | a | (그대로) 고객이니 끝까지 참고 듣는다. | — | — |
| customers-q2 | b ✓ | 센터가 정한 문구로 경고하고, 계속되면 필요할 때 상급자의 승인을 받아 통화를 종료한 뒤 상담 기록에 남긴다. / Warn with the center's set wording; if it continues, get a supervisor's approval if needed, end the call, then record it in the contact notes. | 센터 문구로 경고하고, 계속되면 절차대로 종료한 뒤 기록한다. / Warn with the center's wording; if it continues, end the call by the process and record it. | — |
| customers-q2 | c | 안내 없이 바로 통화를 끊는다. / Hang up straight away without a word. | 더 들을 필요가 없으니, 욕설이 나오는 순간 아무 안내 없이 바로 통화를 끊는다. / There's no need to listen, so hang up the moment the swearing starts, without a word. | — |

길이(ko): a=16, b=34, c=45 (정답 b) — 전: a=16, b=61, c=17

##### review / review-q2 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| review-q2 | a | 다음 주에 다섯 가지를 모두 고친다. / Fix all five next week. | 의욕이 있을 때 해야 하니, 다음 주 안에 다섯 가지를 한꺼번에 모두 고친다. / Strike while she's motivated: fix all five at once next week. | — |
| review-q2 | b ✓ | 가장 중요한 하나를 팀장과 함께 골라 이번 주에 고치고, 다음 리뷰에서 확인한다. / Pick the most important one with the team leader to fix this week, and check it at the next review. | 팀장과 가장 중요한 하나를 골라 고치고, 다음 리뷰에서 확인한다. / Pick the most important one with the team leader, fix it, and check it at the next review. | — |
| review-q2 | c | 가장 쉬운 것만 고치고 나머지는 잊는다. / Fix only the easiest one and forget the rest. | 가장 쉬운 것 하나만 고치고, 나머지 넷은 따로 적어 두지 않고 잊는다. / Fix only the easiest one, and forget the other four without writing them down. | — |

길이(ko): a=43, b=36, c=40 (정답 b) — 전: a=20, b=45, c=22

##### attendance / attendance-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| attendance-q1 | a | 근무가 시작된 뒤 몸이 나아지면 연락한다. / Get in touch once she feels better, after her shift has started. | 조금 쉬면 나아질 수도 있으니, 근무가 시작된 뒤 상태를 보고 연락한다. / She might feel better after some rest, so see how she is and get in touch after her shift starts. | — |
| attendance-q1 | b ✓ | 근무 시작 1~2시간 전(예시)에는 정해진 방법으로 팀장에게 직접 알린다. / Tell her team leader directly, the agreed way, at least 1–2 hours before her shift (Example). | 근무 1~2시간 전(예시) 팀장에게 직접 알린다. / Tell her team leader directly 1–2 hours before her shift (Example). | — |
| attendance-q1 | c | (그대로) 동료에게 대신 말해 달라고만 부탁한다. | — | — |

길이(ko): a=40, b=27, c=21 (정답 b) — 전: a=23, b=41, c=21

##### attendance / attendance-q2 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| attendance-q2 | a | 휴식을 건너뛰고 쉬지 않고 받는다. / Skip her breaks and keep taking contacts nonstop. | 팀이 바쁘니 오늘은 휴식을 건너뛰고 쉬지 않고 받는다. / The team is busy, so skip her breaks today and take contacts nonstop. | — |
| attendance-q2 | b ✓ | 정해진 휴식은 지키고, 한 건씩 정확하게 처리한다. / Keep her scheduled breaks and handle one contact at a time, accurately. | 휴식은 지키고, 한 건씩 정확하게 처리한다. / Keep her breaks and handle one contact at a time, accurately. | — |
| attendance-q2 | c | 빨리 끝내려고 확인 절차를 건너뛴다. / Skip the checks to finish faster. | 대기를 빨리 줄이려고 확인 절차를 건너뛰고 처리한다. / Skip the checks to bring the queue down faster. | — |

길이(ko): a=30, b=24, c=29 (정답 b) — 전: a=19, b=28, c=20

##### growth / growth-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| growth-q1 | a | 나는 이 일에 맞지 않는다고 판단한다. / Decide she isn't cut out for this job. | 동기보다 느리니, 이 일에 맞지 않는다고 판단하고 다른 일을 알아본다. / She's slower than her cohort, so decide she isn't cut out for this and look for other work. | — |
| growth-q1 | b ✓ | 지난달의 나와 비교하고, 코칭에서 한 가지를 골라 연습한다. / Compare herself with last month, and pick one thing from coaching to practice. | 지난달의 나와 비교하고, 한 가지를 골라 연습한다. / Compare herself with last month, and pick one thing to practice. | — |
| growth-q1 | c | (그대로) 속도를 올리려고 확인 절차를 줄인다. | — | — |

길이(ko): a=39, b=28, c=20 (정답 b) — 전: a=21, b=33, c=20

#### 상담사 커리어 라이프사이클 (agent-career)

요약: 정답이 혼자 가장 긴 문항 9 / 10 → 0 / 10

##### sme / sme-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| sme-q1 | a | 다른 상담사의 실수를 찾아 팀장에게 알린다. / Find other agents' mistakes and report them to the team leader. | 팀 품질을 높이려고, 다른 상담사의 실수를 찾아 모아서 팀장에게 알린다. / To raise team quality, collect other agents' mistakes and report them to the team leader. | — |
| sme-q1 | b ✓ | 자주 막히는 문의를 정리하고, 동료가 물어 오면 찾는 방법까지 함께 알려 준다. / Write up the contacts people often get stuck on, and when a peer asks, show them how to find the answer too. | 자주 막히는 문의를 정리하고, 동료에게 찾는 방법까지 알려 준다. / Write up the contacts people often get stuck on, and show peers how to find the answer too. | — |
| sme-q1 | c | (그대로) 직무전문가가 될 때까지는 다른 사람의 질문에 답하지 않는다. | — | — |

길이(ko): a=40, b=36, c=33 (정답 b) — 전: a=24, b=44, c=33

##### sme / sme-q2 (정답 a)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| sme-q2 | a ✓ | 자주 들어오는 질문과 VOC의 원인을 알려 개선할 수 있게 하려고 / To show the causes of frequent questions and VOC so they can be fixed | 자주 나오는 질문과 VOC의 원인을 알려 개선하게 하려고 / To show the causes of frequent questions and VOC so they get fixed | — |
| sme-q2 | b | 상담사 한 사람 한 사람의 점수를 매기려고 / To score each agent one by one | 상담사마다 품질 점수를 매겨 누가 잘하는지 팀장에게 보여 주려고 / To score each agent's quality and show the team leader who does well | — |
| sme-q2 | c | 팀장 대신 팀원을 평가하려고 / To evaluate team members in the team leader's place | 팀장이 바쁠 때 팀장 대신 팀원을 평가하고 순위를 정하려고 / To evaluate and rank team members in the team leader's place when they're busy | — |

길이(ko): a=31, b=35, c=32 (정답 a) — 전: a=36, b=23, c=15

##### qa / qa-q1 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| qa-q1 | a | 총점이 괜찮으면 그냥 넘어간다. / Move on if the total looks fine. | 총점이 목표를 넘었으니, 깎인 항목은 따로 보지 않고 다음 주 상담에 집중한다. / The total beat the target, so skip the items that lost points and focus on next week's contacts. | — |
| qa-q1 | b ✓ | 깎인 항목을 평가 기준과 함께 읽고, 녹취를 들을 수 있으면 다시 들으며 스스로 매겨 본다. / Read the items that lost points alongside the standard, listen to the recording again if she can, and score it herself. | 깎인 항목을 기준과 맞춰 읽고, 가능하면 녹취로 직접 매겨 본다. / Read the items that lost points against the standard and, if she can, score the recording herself. | — |
| qa-q1 | c | (그대로) 점수가 낮으면 도현에게 점수를 올려 달라고 부탁한다. | — | — |

길이(ko): a=44, b=36, c=29 (정답 b) — 전: a=17, b=51, c=29

##### qa / qa-q2 (정답 c)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| qa-q2 | a | 점수가 낮은 상담사를 찾으려고 / To find agents with low scores | 점수가 낮은 상담사를 찾아 따로 코칭 대상으로 정하려고 / To find low-scoring agents and pick them out for coaching | — |
| qa-q2 | b | 평가 기준을 없애고 각자 판단하려고 / To drop the standard and let each person judge | 평가 기준을 없애고, 평가하는 사람이 각자 판단하게 하려고 / To drop the standard and let each scorer judge for themselves | — |
| qa-q2 | c ✓ | 누가 평가해도 같은 점수가 나오게 기준을 맞추려고 / To line up the standard so anyone scoring gets the same result | 누가 매겨도 같은 점수가 나오게 하려고 / So anyone scoring gets the same result | — |

길이(ko): a=30, b=32, c=21 (정답 c) — 전: a=16, b=19, c=27

##### trainer / trainer-q1 (정답 a)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| trainer-q1 | a ✓ | 쉬운 말로 설명하고, 정책 문서에서 어디를 보면 되는지 함께 보여 준다. / Explain it in plain words, and show where to look in the policy document. | 쉬운 말로 설명하고, 정책 문서의 위치도 보여 준다. / Explain it in plain words, and show where it is in the policy document. | — |
| trainer-q1 | b | (그대로) 트레이너가 할 일이라며 유나에게 물어보라고 한다. | — | — |
| trainer-q1 | c | 기억나는 대로 빠르게 답해 준다. / Answer quickly from memory. | 동료가 바빠 보이니 문서를 찾지 않고 기억나는 대로 빠르게 답해 준다. / The colleague looks busy, so answer quickly from memory without checking the document. | — |

길이(ko): a=29, b=27, c=39 (정답 a) — 전: a=40, b=27, c=18

##### trainer / trainer-q2 (정답 b)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| trainer-q2 | a | 트레이너가 상담사의 품질 점수를 매긴다. / The trainer scores agents' quality. | 트레이너가 교육 뒤 상담사의 품질 점수까지 매겨 관리한다. / After training, the trainer also scores and tracks agents' quality. | — |
| trainer-q2 | b ✓ | QA가 찾은 자주 틀리는 부분을 트레이너가 교육에 반영한다. / The trainer puts the mistakes QA often finds into training. | QA가 찾은 잦은 실수를 트레이너가 교육에 반영한다. / The trainer puts the mistakes QA often finds into training. | — |
| trainer-q2 | c | 두 직무는 서로 관계가 없다. / The two roles have nothing to do with each other. | 두 직무는 팀도 하는 일도 달라 서로 관계가 없다. / The two roles sit in different teams with different work, so they have nothing to do with each other. | — |

길이(ko): a=32, b=29, c=28 (정답 b) — 전: a=22, b=33, c=16

##### tl / tl-q1 (정답 c)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| tl-q1 | a | 상담사 → 팀장 → 직무전문가 / Agent → team leader → SME | 상담사 → 팀장(팀원 관리 경험) → 직무전문가 / Agent → team leader (managing a team) → SME | — |
| tl-q1 | b | 입사하자마자 팀장 교육 → 팀장 / Team leader training right after joining → team leader | 입사 직후 팀장 교육(리더십 과정) → 팀장 / Team leader training (leadership course) right after joining → team leader | — |
| tl-q1 | c ✓ | 상담사 → 직무전문가(팀장 백업 경험) → 팀장 / Agent → SME (team leader backup experience) → team leader | 상담사 → 직무전문가(팀장 백업) → 팀장 / Agent → SME (team leader backup) → team leader | — |

길이(ko): a=26, b=24, c=23 (정답 c) — 전: a=16, b=17, c=26

##### tl / tl-q2 (정답 a)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| tl-q2 | a ✓ | 평가 리뷰 때 내 지표를 먼저 읽고, 좋았던 점과 고칠 점을 말해 본다. / Read her own metrics first in the score review, and say what went well and what to fix. | 평가 리뷰에서 내 지표를 먼저 읽고 스스로 설명해 본다. / In the score review, read her own metrics first and explain them herself. | — |
| tl-q2 | b | 팀장이 되면 배우면 되니, 지금은 내 콜만 신경 쓴다. / Learn it once she's a team leader, and for now focus only on her own calls. | 지표 읽는 법은 팀장이 되면 배우면 되니, 지금은 내 콜만 신경 쓴다. / She can learn to read metrics once she's a team leader, so for now she focuses only on her own calls. | — |
| tl-q2 | c | (그대로) 동료들의 지각을 대신 챙겨 팀장에게 알린다. | — | — |

길이(ko): a=31, b=39, c=24 (정답 a) — 전: a=40, b=30, c=24

##### ready / ready-q2 (정답 c)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| ready-q2 | a | "동료들을 많이 도왔습니다." / "I helped my colleagues a lot." | "신입 동료들이 막힐 때마다 먼저 다가가 도왔고, 팀 분위기가 좋아졌다는 말을 많이 들었습니다." / "Whenever new colleagues got stuck, I went over to help first, and many people said the team mood got better." | 무엇을 어떻게 도왔고 결과가 어땠는지 사실이 빠져 있어 근거가 되지 않습니다. / It leaves out the facts of what she helped with, how, and what came of it, so it isn't evidence. |
| ready-q2 | b | "제 품질 점수가 팀에서 가장 높습니다." / "My quality score is the highest on the team." | "제 품질 점수가 6개월(예시) 연속 팀에서 가장 높았고, 처리 시간도 가장 짧습니다." / "My quality score has been the team's highest for 6 months (Example) running, and my handling time is the shortest." | — |
| ready-q2 | c ✓ | "배송 지연 문의가 잦은 원인을 VOC에서 찾아 안내 문구를 바꾸자고 제안했고, 다음 달 같은 문의가 줄었습니다." / "I found in VOC why delivery-delay contacts were frequent and proposed changing our guidance wording, and the next month those contacts dropped." | "VOC로 배송 지연 문의 원인을 찾아 문구 변경을 제안했고, 다음 달 그 문의가 줄었습니다." / "Using VOC, I found why delivery-delay contacts were frequent and proposed new wording; the next month those contacts dropped." | — |

길이(ko): a=54, b=49, c=53 (정답 c) — 전: a=16, b=23, c=64

#### 미룬 작은 지적

| 위치 | 항목 | 전 (ko / en) | 후 (ko / en) | 비고 |
|---|---|---|---|---|
| agent-career/lessons/05-ready.js:30 | 스텝 1 캡션 (en) | (ko 그대로) / The first stage is attendance, and it matters above all. Next roles work with many agents and other departments, so when you're often absent, the flow breaks when the team or project needs you. | (ko 그대로) / The first stage is attendance, and it matters above all. The roles you'd move into work with many agents and other departments, so when you're often absent, the flow breaks when the team or project needs you. | "Next roles" 주어 어색 → 풀어 씀 |
| agent-career/lessons/05-ready.js:43 | ready-q1 질문 (en) | (ko 그대로) / When looking at applicants for a next role, what do they look at first? | (ko 그대로) / When looking at applicants for the next role, what do they look at first? | 관사 |
| agent-career/lessons/05-ready.js:50 | ready-q1 해설 (en) | (ko 그대로) / Next roles work with many people. A record of showing up is the first thing that builds trust. | (ko 그대로) / Those roles work with many people. A record of showing up is the first thing that builds trust. | 앞 문장(질문)을 받는 지시어 |
| agent-career/lessons/05-ready.js:33 | ready 스텝 캡션 (ko) | 오래된 기록은 시간이 지나면 보는 기간 밖으로 빠집니다. … / (en 그대로) | 기록은 시간이 지나면 보는 기간 밖으로 빠집니다. … / (en 그대로: Records fall outside the window as time passes. …) | "오래된"과 "시간이 지나면" 중복, 영어와 맞춤 |
| agent/lessons/06-review.js:31 | review 스텝 캡션 (en) | (ko 그대로) / … Even with several things to fix, pick with your team leader just the most important one to change this week. … | (ko 그대로) / … Even with several things to fix, pick just the most important one to change this week, together with your team leader. … | 어순 (목적어를 동사 가까이) |

---

## 직무전문가

### sme 담당: 정답 길이 맞추기 제안 (sme · sme-lifecycle · sme-sop)

원본은 고치지 않았습니다. 정답 id·보기 id는 그대로이고, 정답은 모든 문항에서 b입니다(화면에서 섞임). 길이는 한국어 글자 수(공백·문장부호·따옴표 포함, JS length)입니다. EN이 "(그대로)"인 칸은 영어를 바꾸지 않아도 되는 경우입니다.

#### 직무전문가 첫걸음 (sme)

요약: 고치기 전 "정답이 혼자 가장 긴" 문항 13 / 14 → 고친 뒤 1 / 14 (정답이 가장 짧음 5, 중간 8)

건드리지 않은 문항(이미 길이가 고름): peer-q2(28/38/34), priority-q2(20/20/24)

##### firstday-q1 (레슨 firstday)
질문: 첫날, 상담사가 고객에게 정책에 없는 큰 보상을 해 주자며 승인을 요청합니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| firstday-q1 | a | 고객이 화가 많이 났으니 일단 승인한다. / Approve it for now, since the customer is very upset. | 고객이 많이 화가 나 있고 대기가 길어지니, 이번만 승인하고 팀장에게는 나중에 보고한다. / The customer is very upset and the wait is growing, so approve it just this once and report to the team leader later. | 없음 (기존 피드백 그대로 맞음) |
| firstday-q1 | b ✓ | 승인 범위 밖이므로 고객에게 기다림을 안내하게 하고, 팀장에게 바로 넘긴다. / It is outside your limits, so have the agent ask the customer to wait and pass it to the team leader right away. | 범위 밖이니 고객에게 기다림을 안내하게 하고, 팀장에게 바로 넘긴다. / It's outside your limits, so have the agent ask the customer to wait and pass it to the team leader right away. | (정답, 피드백 없음) |
| firstday-q1 | c | 정책에 없으니 거절하고 상담사에게 그대로 응대하게 한다. / Turn it down because policy does not cover it, and let the agent carry on. | 정책에 없는 요청이니 상담사에게 정중히 거절하게 하고, 사과 문구를 함께 써 준다. / Policy doesn't cover it, so have the agent decline politely, and write the apology line together. | 정중히 거절해도 고객의 문제는 그대로 남습니다. 내가 정할 수 없는 건은 정할 수 있는 사람에게 넘깁니다. / A polite refusal still leaves the customer's problem where it was. What you cannot decide goes to someone who can. |

길이(ko): a=49, b=38, c=46 (정답 b) — 전: 22/42/31 → 정답이 가장 짧음

##### firstday-q2 (레슨 firstday)
질문: 지민의 응대 태도가 요즘 걱정됩니다. 직무전문가로서 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| firstday-q2 | a | 지민의 품질 점수를 직접 낮춰 기록한다. / Mark down Jimin's quality score yourself. | 지민의 품질 점수를 직접 낮춰 기록하고, 다음 평가에 반영해 달라고 QA에 요청한다. / Mark down Jimin's quality score yourself, and ask QA to reflect it in the next evaluation. | 없음 (기존 피드백 그대로 맞음) |
| firstday-q2 | b ✓ | 옆에서 응대를 함께 보며 돕고, 같은 모습이 반복되면 팀장에게 사례와 함께 알린다. / Watch Jimin's contacts alongside her and help, and if it keeps happening, tell the team leader with examples. | 옆에서 응대를 함께 보며 돕고, 반복되면 팀장에게 사례와 함께 알린다. / Watch Jimin's contacts alongside her and help, and if it repeats, tell the team leader with examples. | (정답, 피드백 없음) |

길이(ko): a=47, b=39, c=25 (정답 b) — 전: 22/46/25 → 정답이 중간

##### newcomer-q1 (레슨 newcomer)
질문: 서준이 오전 내내 한 번도 질문하지 않았습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| newcomer-q1 | b ✓ | 먼저 다가가 오전에 받은 문의가 어땠는지 묻는다. / Go to him first and ask how the morning's contacts went. | 먼저 다가가 오전 문의가 어땠는지 묻는다. / Go to him first and ask how his morning contacts went. | (정답, 피드백 없음) |
| newcomer-q1 | c | 질문을 하지 않는다고 팀장에게 알린다. / Tell the team leader he is not asking questions. | 질문이 없는 게 걱정되니 팀장에게 알려 따로 면담을 잡아 달라고 한다. / Worried by the silence, tell the team leader and ask for a one-on-one with him. | 아직 무슨 일인지 모르는 상태입니다. 면담보다 먼저 서준에게 직접 묻는 것이 순서입니다. / You don't know yet what is going on. Asking Seojun directly comes before any meeting. |

길이(ko): a=19, b=23, c=39 (정답 b) — 전: 19/27/21 → 정답이 중간

##### newcomer-q2 (레슨 newcomer)
질문: 서준이 같은 절차를 세 번째 묻습니다. 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| newcomer-q2 | a | 이번에도 바로 답을 알려 준다. / Give him the answer right away again. | 고객이 기다리고 있으니 이번에도 바로 답을 알려 주고, 화면 캡처로 정리해 보내 준다. / The customer is waiting, so give him the answer right away again and send it as a screenshot. | 정리한 답을 받아도 스스로 찾는 힘은 생기지 않아, 네 번째 질문도 오게 됩니다. / Even a tidy answer builds no skill in finding it, so a fourth question will come. |
| newcomer-q2 | b ✓ | 지식 베이스에서 함께 찾아 보여 주고, 반복되는 부분을 팀장과 트레이너에게 전한다. / Find it in the knowledge base together, and tell the team leader and trainer about the repeated difficulty. | 지식 베이스에서 함께 찾아 보고, 반복되는 어려움은 팀장과 트레이너에게 전한다. / Look it up in the knowledge base together, and pass the repeated difficulty to the team leader and trainer. | (정답, 피드백 없음) |
| newcomer-q2 | c | 이미 알려 줬으니 혼자 찾아보라고 한다. / Tell him you already explained it and to look it up himself. | 이미 두 번 알려 줬으니, 이번에는 교육 자료를 다시 읽고 혼자 찾아보라고 한다. / You've explained it twice, so tell him to reread the training material and find it himself this time. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=48, b=44, c=45 (정답 b) — 전: 17/46/22 → 정답이 가장 짧음

##### escalation-q1 (레슨 escalation)
질문: 지민의 요청이 내 승인 범위 안인지 확실하지 않습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| escalation-q1 | b ✓ | 지민에게 고객 대기 안내를 부탁하고, 팀장에게 바로 확인한다. / Ask Jimin to let the customer know there is a short wait, and check with the team leader right away. | 지민에게 고객 대기 안내를 부탁하고, 팀장에게 바로 확인한다. / (그대로) | (정답, 피드백 없음) |
| escalation-q1 | c | 확실하지 않으니 거절한다. / Turn it down because you are not sure. | 확실하지 않을 때는 거절하는 게 안전하니, 고객에게 어렵다고 안내하게 한다. / When unsure, refusing is safer, so have Jimin tell the customer it can't be done. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=28, b=34, c=42 (정답 b) — 전: 28/34/14 → 정답이 중간

##### escalation-q2 (레슨 escalation)
질문: 같은 정책 질문이 하루에 다섯 명에게서 왔습니다. 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| escalation-q2 | a | 올 때마다 한 사람씩 답한다. / Answer each person as they come. | 물어본 사람마다 바로 답해 주고, 각자 메모해 두라고 한다. / Answer each person as they ask, and tell them to note it down. | 각자 메모해도 다른 팀원은 모르니 여섯 번째, 일곱 번째 질문도 오고, 그 시간에 더 급한 요청을 놓칩니다. / Their notes don't reach the rest of the team, so a sixth and seventh question will come, and you miss more urgent requests meanwhile. |
| escalation-q2 | c | 지식 베이스를 읽어 보라고만 답한다. / Just tell them to read the knowledge base. | 답이 지식 베이스에 있으니, 문서 링크를 보내며 읽어 보라고 한다. / The answer is in the knowledge base, so send the article link and tell them to read it. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=33, b=24, c=37 (정답 b) — 전: 16/24/20 → 정답이 가장 짧음

##### peer-q1 (레슨 peer)
질문: 준호가 "우리 사이에 뭘 그렇게까지 해"라며 승인 없이 보상을 처리하려 합니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| peer-q1 | a | 오래 함께한 동기니 이번에는 넘어간다. / Let it go this time, since you have worked together so long. | 오래 함께한 동기이고 금액도 작으니, 이번만 넘어가고 다음부터 지키자고 한다. / He's a long-time peer and the amount is small, so let it go this once and ask him to follow it next time. | 없음 (기존 피드백 그대로 맞음) |
| peer-q1 | b ✓ | 누구에게나 같은 기준이라고 차분히 말하고, 승인 절차를 거치게 한다. / Say calmly that the standard is the same for everyone, and have it go through approval. | 누구에게나 같은 기준이라고 차분히 말하고, 승인을 거치게 한다. / Say calmly that the standard is the same for everyone, and have it go through approval. | (정답, 피드백 없음) |

길이(ko): a=43, b=35, c=26 (정답 b) — 전: 21/38/26 → 정답이 중간

##### lead-q1 (레슨 lead)
질문: 팀장이 자리에 없는 동안 한 상담사가 30분 늦게 와서 사유를 설명합니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| lead-q1 | c | 다시는 늦지 말라고 경고한다. / Warn them not to be late again. | 같은 일이 반복되지 않게, 다시 늦으면 팀장에게 보고하겠다고 경고한다. / So it doesn't happen again, warn them you'll report it to the team leader next time. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=23, b=28, c=39 (정답 b) — 전: 23/28/16 → 정답이 중간

##### lead-q2 (레슨 lead)
질문: 팀장에게 건넬 스크러빙 트렌드 요약에 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| lead-q2 | b ✓ | 상담사별로 반복된 행동과 그 행동이 나온 티켓 번호를 적는다. / The behavior that kept showing up for each agent, with the ticket numbers where it appeared. | 상담사별로 반복된 행동과 그 티켓 번호를 적는다. / The behavior that repeated for each agent, with the ticket numbers. | (정답, 피드백 없음) |
| lead-q2 | c | 이번 주 품질 점수 순위표를 만든다. / A ranking of this week's quality scores. | 이번 주 품질 점수 순위표를 만들어 낮은 순서로 코칭 대상을 표시한다. / A ranking of this week's quality scores, marking coaching targets from the bottom up. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=24, b=27, c=39 (정답 b) — 전: 24/34/20 → 정답이 중간

##### priority-q1 (레슨 priority)
질문: 통화 중 고객을 보류해 둔 서준과, 이메일 답변 문구를 확인받고 싶은 지민이 동시에 부릅니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| priority-q1 | a | 먼저 부른 사람부터 간다. / Go to whoever called first. | 공정하게, 먼저 부른 사람부터 차례대로 간다. / To be fair, go in order, starting with whoever called first. | 없음 (기존 피드백 그대로 맞음) |
| priority-q1 | b ✓ | 서준에게 먼저 가고, 지민에게는 언제 갈지 알려 준다. / Go to Seojun first, and tell Jimin when you will come. | 서준에게 먼저 가고, 지민에게는 언제 갈지 알린다. / (그대로) | (정답, 피드백 없음) |
| priority-q1 | c | 지민의 건이 금방 끝나니 지민부터 처리한다. / Do Jimin's first, since it will be quick. | 지민의 건은 금방 끝나니, 지민부터 처리하고 바로 서준에게 간다. / Jimin's will be quick, so do hers first and then go straight to Seojun. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=25, b=28, c=36 (정답 b) — 전: 14/30/24 → 정답이 중간

##### knowledge-q1 (레슨 knowledge)
질문: 스크러빙에서 지민의 절차 실수로 생긴 DSAT를 찾았습니다. 어떻게 나눌까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| knowledge-q1 | a | 허들에서 지민의 건이라고 밝히고 사례로 설명한다. / Explain it as an example in the huddle, saying it was Jimin's contact. | 허들에서 지민의 건이라고 밝히고, 같은 실수를 막을 사례로 설명한다. / In the huddle, say it was Jimin's contact and use it as an example to prevent the same mistake. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=38, b=36, c=24 (정답 b) — 전: 27/36/24 → 정답이 중간

##### knowledge-q2 (레슨 knowledge)
질문: 스크러빙을 매일 몇 건씩 꾸준히 하는 이유로 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| knowledge-q2 | a | 하루에 해야 할 건수가 규칙으로 정해져 있어서. / Because a rule sets how many to do each day. | 하루에 볼 건수가 규칙으로 정해져 있고, 채우지 못하면 실적에 남아서. / Because a rule sets how many to do each day, and a shortfall shows in your performance. | 없음 (기존 피드백 그대로 맞음) |
| knowledge-q2 | b ✓ | 원인이 쌓여야 트렌드가 보이고, 찾은 것을 바로 팀에 돌려줄 수 있어서. / Because trends show as causes build up, and you can give findings back to the team right away. | 원인이 쌓여야 트렌드가 보이고, 찾은 것을 바로 돌려줄 수 있어서. / Because trends show only as causes build up, and you can give findings back right away. | (정답, 피드백 없음) |
| knowledge-q2 | c | 바쁜 날 몰아서 해도 결과는 같지만 보고서 모양이 좋아서. / Doing them all on a busy day gives the same result, but the report looks better. | 바쁜 날 몰아서 해도 결과는 같지만, 매일 적으면 보고서 모양이 좋아서. / Doing them all on a busy day gives the same result, but daily entries make the report look better. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=39, b=37, c=40 (정답 b) — 전: 26/40/32 → 정답이 가장 짧음

#### 직무전문가 서포트 라이프사이클 (sme-lifecycle)

요약: 고치기 전 "정답이 혼자 가장 긴" 문항 10 / 10 → 고친 뒤 2 / 10 (정답이 가장 짧음 5, 중간 3)

건드리지 않은 문항(이미 길이가 고름): regular-q1(21/26/23), regular-q2(23/29/28)

##### trainee-q1 (레슨 trainee)
질문: OJT 중 서준이 교육 자료대로 응대했는데, 실제로는 현장에서 쓰지 않는 절차였습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| trainee-q1 | a | 교육 자료는 신경 쓰지 말고 현장 방식대로 하라고 서준에게 말한다. / Tell Seojun to ignore the training material and do it the floor's way. | 교육 자료는 오래된 것이니 신경 쓰지 말고, 현장 방식대로 하라고 서준에게 말한다. / The material is outdated, so tell Seojun to ignore it and do it the floor's way. | 없음 (기존 피드백 그대로 맞음) |
| trainee-q1 | b ✓ | 이번 문의는 함께 바르게 마무리하고, 다른 부분을 트레이너에게 전해 교육 내용을 맞춘다. / Finish this contact correctly together, and tell the trainer about the difference so the training is brought in line. | 이번 문의는 함께 바로잡고, 다른 부분은 트레이너에게 전해 교육을 맞춘다. / Put this contact right together, and tell the trainer about the difference so the training matches. | (정답, 피드백 없음) |
| trainee-q1 | c | 교육 중이니 틀려도 그대로 둔다. / He is still in training, so let it go even if it is wrong. | 교육 중이니 틀려도 그대로 두고, OJT가 끝나면 한꺼번에 알려 준다. / He's in training, so let it go even if it's wrong, and tell him everything once OJT ends. | 고객은 상대가 교육생인지 모릅니다. 실제 문의는 지금 바르게 마무리해야 하고, 나중에 알려 주면 그사이 같은 실수가 쌓입니다. / Customers don't know they are talking to a trainee. Real contacts have to be finished correctly now, and if you wait, the same mistake piles up meanwhile. |

길이(ko): a=46, b=41, c=39 (정답 b) — 전: 37/49/18 → 정답이 중간

##### trainee-q2 (레슨 trainee)
질문: 서준의 OJT 관찰 기록으로 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| trainee-q2 | a | "자신감이 부족함" / "Lacks confidence" | "전반적으로 자신감이 부족하고, 응대 중 자주 머뭇거림" / "Seems to lack confidence overall; often hesitates on contacts" | 성격에 대한 인상과 막연한 모습은 네스팅에서 무엇을 도와야 할지 알려 주지 않습니다. / A general impression of personality doesn't tell you what to help with in nesting. |
| trainee-q2 | c | "OJT 점수 70점(예시)" / "OJT score 70 points (Example)" | "OJT 점수 70점(예시)으로 동기 평균보다 낮음, 보충 필요" / "OJT score 70 points (Example), below the cohort average; needs extra work" | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=31, b=29, c=36 (정답 b) — 전: 10/29/16 → 정답이 가장 짧음

##### graduate-q1 (레슨 graduate)
질문: 서준이 배송 문의를 사흘 연속(예시) 혼자 끝냈습니다. 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| graduate-q1 | a | 오늘부터 모든 지원을 멈춘다. / Stop all support from today. | 배송을 혼자 해냈으니 오늘부터 모든 문의 지원을 멈추고 혼자 맡긴다. / He handled shipping alone, so stop all support from today and let him work on his own. | 없음 (기존 피드백 그대로 맞음) |
| graduate-q1 | b ✓ | 배송 문의는 요청이 올 때만 보기로 하고, 그렇게 바뀐다고 서준에게 알려 준다. / Look at shipping contacts only when he asks, and tell Seojun that this is changing. | 배송 문의는 요청할 때만 보기로 하고, 바뀐 점을 서준에게 알린다. / Look at shipping contacts only when he asks, and tell Seojun about the change. | (정답, 피드백 없음) |
| graduate-q1 | c | 아직 네스팅 기간이니 모든 문의를 계속 먼저 확인한다. / It is still nesting, so keep checking every contact first. | 아직 네스팅 기간이니 배송 문의까지 포함해 모든 문의를 계속 먼저 확인한다. / It's still nesting, so keep checking every contact first, shipping included. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=38, b=37, c=42 (정답 b) — 전: 16/44/30 → 정답이 가장 짧음

##### graduate-q2 (레슨 graduate)
질문: 네스팅 마지막 주인데 서준이 환불 문의에서 계속 막힙니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| graduate-q2 | a | 기간이 끝났으니 정식 팀으로 넘긴다. / Nesting is over, so move him to a regular team. | 기간이 끝났으니 예정대로 정식 팀으로 보내고, 환불 문의는 그 팀에서 익히게 한다. / The period is over, so send him to a regular team as planned and let him learn refunds there. | 없음 (기존 피드백 그대로 맞음) |
| graduate-q2 | b ✓ | 환불 문의 기록을 수진 팀장에게 보여 주고, 네스팅 연장이나 추가 교육을 상의한다. / Show Sujin the record of refund contacts, and discuss extending nesting or more training. | 기록을 트레이너, 수진 팀장과 함께 보고, 네스팅 연장이나 추가 교육을 상의한다. / Review the record with the trainer and Sujin, and discuss extending nesting or more training. | (정답, 피드백 없음) |
| graduate-q2 | c | 앞으로 환불 문의는 직무전문가가 대신 처리하겠다고 한다. / Say the SME will handle refund contacts for him from now on. | 서준이 지치지 않게, 앞으로 환불 문의는 직무전문가가 대신 처리하겠다고 한다. / So Seojun doesn't burn out, say the SME will handle refund contacts for him from now on. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=46, b=45, c=43 (정답 b) — 전: 20/46/31 → 정답이 중간

##### senior-q1 (레슨 senior)
질문: 일반 질문을 맡은 준호가 승인이 필요한 보상 요청까지 "괜찮을 거야"라며 처리해 주려 합니다. 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| senior-q1 | a | 준호는 기준을 알고 있으니 그대로 둔다. / Junho knows the rules, so leave it. | 준호는 기준을 잘 알고 경력도 길어서, 이번 건은 그대로 처리하게 둔다. / Junho knows the rules well and has years in, so let him handle this one. | 없음 (기존 피드백 그대로 맞음) |
| senior-q1 | b ✓ | 일반 질문은 계속 준호에게 맡기고, 승인이 필요한 건은 직무전문가에게 넘기도록 다시 맞춘다. / Keep general questions with Junho, and agree again that cases needing approval go to the SME. | 답변은 계속 맡기되, 승인이 필요한 건은 직무전문가에게 넘기게 다시 맞춘다. / Keep him on answering, but agree again that cases needing approval go to the SME. | (정답, 피드백 없음) |
| senior-q1 | c | 앞으로 준호에게 질문 답변을 맡기지 않는다. / Stop giving Junho questions to answer. | 승인 권한을 넘은 건 문제이니, 앞으로 준호에게 질문 답변을 맡기지 않는다. / Overstepping approval is a problem, so stop giving Junho questions to answer. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=40, b=42, c=42 (정답 b) — 전: 22/51/24 → 정답이 중간

##### senior-q2 (레슨 senior)
질문: 준호가 에스컬레이션을 보내며 해결 방법을 적어 두었고, 그 방법은 기준에 맞습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| senior-q2 | a | 처음부터 다시 판단해 내 방법을 찾는다. / Judge it again from scratch and find your own way. | 내가 책임질 승인이니, 처음부터 다시 판단해 내 방법을 찾아 본다. / It's your approval to answer for, so judge it again from scratch and find your own way. | 없음 (기존 피드백 그대로 맞음) |
| senior-q2 | c | 선임이니 앞으로는 확인 없이 알아서 처리하라고 한다. / Tell him that as a senior he can handle such cases without checking from now on. | 선임이니 앞으로 이런 건은 확인 없이 알아서 처리하라고 한다. / He is a senior, so tell him to handle such cases himself without checking from now on. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=37, b=33, c=34 (정답 b) — 전: 22/33/29 → 정답이 가장 짧음

##### leadsupport-q1 (레슨 leadsupport)
질문: 수진 팀장이 월요일 회의 전에 팀원 현황을 부탁했습니다. 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| leadsupport-q1 | a | 지난주에 문제가 있었던 팀원만 골라 보낸다. / Send only the team members who had problems last week. | 회의 시간이 짧으니, 지난주에 문제가 있었던 팀원만 골라 사례와 함께 보낸다. / The meeting is short, so send only those who had problems last week, with examples. | 없음 (기존 피드백 그대로 맞음) |
| leadsupport-q1 | b ✓ | 팀원마다 지금 단계, 지난주에 본 것, 다음 단계 신호를 한 줄씩 적어 보낸다. / Send one line per team member: current stage, what you saw last week, and signs for the next stage. | 팀원마다 지금 단계, 지난주 모습, 다음 단계 신호를 한 줄씩 적는다. / One line per team member: current stage, what you saw last week, and signs for the next stage. | (정답, 피드백 없음) |
| leadsupport-q1 | c | 지난주 하루 일과를 시간대별로 길게 적어 보낸다. / Send a long hour-by-hour log of last week. | 빠짐없이 보이도록, 지난주 하루 일과를 시간대별로 자세히 적어 보낸다. / To leave nothing out, send a detailed hour-by-hour log of last week. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=43, b=39, c=39 (정답 b) — 전: 24/44/27 → 정답이 가장 짧음

##### leadsupport-q2 (레슨 leadsupport)
질문: 정식 상담사 한 명의 결근이 늘고, 업무 요청도 갑자기 많아졌습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| leadsupport-q2 | a | 직무전문가가 직접 이유를 묻고 근무 시간을 조정해 준다. / Ask the reason yourself and adjust their work hours. | 직무전문가가 직접 따로 불러 이유를 묻고, 사정에 맞게 근무 시간을 조정해 준다. / Take them aside yourself, ask why, and adjust their hours to fit. | 없음 (기존 피드백 그대로 맞음) |
| leadsupport-q2 | b ✓ | 늘어난 업무 요청은 다시 가까이 지원하고, 결근과 변화는 사실대로 적어 팀장에게 넘긴다. / Support the extra work requests closely again, and hand the absences and changes to the team leader as facts. | 업무 요청은 다시 가까이 돕고, 결근과 변화는 사실대로 팀장에게 넘긴다. / Support the work requests closely again, and hand the absences and changes to the team leader as facts. | (정답, 피드백 없음) |
| leadsupport-q2 | c | 정식 상담사이니 지켜보기만 한다. / They are a regular agent, so just watch. | 정식 상담사이니 본인이 말할 때까지 지켜보고, 업무 요청에만 답해 준다. / They're a regular agent, so wait until they speak up, and just answer the work requests. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=45, b=40, c=40 (정답 b) — 전: 31/49/18 → 정답이 가장 짧음

#### 직무전문가 SOP (sme-sop)

요약: 고치기 전 "정답이 혼자 가장 긴" 문항 16 / 16 → 고친 뒤 3 / 16 (정답이 가장 짧음 6, 중간 7)

건드리지 않은 문항(이미 길이가 고름): approval-q1(18/23/21), scrubbing-q1(18/19/14)

##### approval-q2 (레슨 approval)
질문: 지민이 풀기 어려운 건을 직무전문가가 이어받아 고객과 통화합니다. 먼저 할 말로 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| approval-q2 | a | "처음부터 다시 설명해 주시겠어요?" / "Could you explain it all again from the start?" | "정확히 돕기 위해, 처음부터 다시 한번 설명해 주시겠어요?" / "To help you accurately, could you explain it all again from the start?" | 없음 (기존 피드백 그대로 맞음) |
| approval-q2 | b ✓ | "앞서 상담하신 내용을 확인했습니다. 이어서 도와드리겠습니다." / "I've reviewed your earlier conversation. I'll take it from here." | "앞선 상담 내용을 확인했습니다. 이어서 도와드리겠습니다." / (그대로) | (정답, 피드백 없음) |
| approval-q2 | c | "앞 상담사가 실수한 것 같습니다." / "I think the agent before me made a mistake." | "앞 상담사가 잘못 안내한 것 같습니다. 제가 바로잡겠습니다." / "I think the agent before me gave you wrong information. I'll fix it." | 동료를 탓하면 고객은 센터 전체를 믿기 어려워집니다. 이전 내용을 이어받는다고만 말합니다. / Blaming a colleague makes the customer distrust the whole center. Just say you are picking up from before. |

길이(ko): a=34, b=33, c=35 (정답 b) — 전: 20/35/20 → 정답이 가장 짧음

##### scrubbing-q2 (레슨 scrubbing)
질문: 환불이 늦어 DSAT가 난 티켓을 보니 상담사 안내는 맞았고, 원인은 고객사 결제 시스템 장애였습니다. 어떻게 분류하고 어디로 보낼까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| scrubbing-q2 | a | 고객이 화가 났으니 상담사 응대 문제로 보고 트렌드 요약에 담는다. / The customer was angry, so treat it as an agent handling issue and add it to the trend summary. | 고객이 크게 화를 냈으니 상담사 응대 문제로 보고, 트렌드 요약에 담아 코칭한다. / The customer was very angry, so treat it as an agent handling issue and put it in the trend summary for coaching. | 없음 (기존 피드백 그대로 맞음) |
| scrubbing-q2 | b ✓ | BPO가 통제할 수 없는 원인으로 분류하고, VOC 리포트로 고객사에 전한다. / Classify it as a cause the BPO can't control, and pass it to the client through the VOC report. | BPO가 통제할 수 없는 원인으로 분류해, VOC 리포트로 고객사에 전한다. / Classify it as a cause the BPO can't control, and pass it to the client through the VOC report. | (정답, 피드백 없음) |
| scrubbing-q2 | c | 분류하기 애매하니 기록하지 않는다. / It's hard to classify, so don't record it. | 상담사 잘못이 아니니 코칭할 것이 없어, 분류하지 않고 넘어간다. / The agent did nothing wrong, so there's nothing to coach; skip classifying it. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=45, b=42, c=36 (정답 b) — 전: 37/43/19 → 정답이 중간

##### trend-q1 (레슨 trend)
질문: 이번 주 서준의 티켓 한 건에서 확인 단계 누락을 봤습니다. 요약에 어떻게 담을까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| trend-q1 | a | 서준의 트렌드로 적는다. / Write it as Seojun's trend. | 놓치지 않도록 이번 주 서준의 트렌드로 요약에 적어 둔다. / So it isn't missed, write it in this week's summary as Seojun's trend. | 없음 (기존 피드백 그대로 맞음) |
| trend-q1 | b ✓ | 서준에게 짧게 알려 주고, 반복될 때 요약에 담는다. / Tell Seojun briefly, and add it to the summary when it repeats. | 서준에게 짧게 알려 주고, 반복되면 요약에 담는다. / Tell Seojun briefly, and add it to the summary if it repeats. | (정답, 피드백 없음) |
| trend-q1 | c | 팀 전체 문제로 허들에 올린다. / Raise it at the huddle as a team-wide issue. | 다른 상담사도 놓칠 수 있으니 팀 전체 문제로 허들에 올린다. / Others may miss it too, so raise it at the huddle as a team-wide issue. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=32, b=28, c=34 (정답 b) — 전: 13/29/17 → 정답이 가장 짧음

##### trend-q2 (레슨 trend)
질문: 이번 주 팀원 다섯 명에게서 같은 안내 실수가 나왔습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| trend-q2 | a | 다섯 명을 각각 한 줄씩만 적는다. / Just write one line for each of the five. | 누가 실수했는지 팀장이 바로 알 수 있게, 다섯 명을 각각 한 줄씩 요약에 적는다. / So the team leader sees who made the mistake, write one line for each of the five in the summary. | 없음 (기존 피드백 그대로 맞음) |
| trend-q2 | b ✓ | 팀 공통 트렌드로 묶어 허들 주제로 제안하고, 원인이 문서라면 지식 베이스 업데이트도 요청한다. / Group it as a team-wide trend, suggest it as a huddle topic, and if the cause is a document, request a knowledge base update too. | 팀 공통 트렌드로 묶어 허들 주제로 제안하고, 문서가 원인이면 업데이트도 요청한다. / Group it as a team-wide trend, suggest it as a huddle topic, and if a document is the cause, request an update too. | (정답, 피드백 없음) |
| trend-q2 | c | 다섯 명에게 각각 주의를 준다. / Warn each of the five. | 같은 실수가 더 퍼지기 전에, 다섯 명을 한 명씩 따로 불러 각각 주의를 준다. / Before it spreads, call the five in one by one and warn each of them. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=46, b=46, c=44 (정답 b) — 전: 19/53/17 → 정답이 중간

##### attendance-q1 (레슨 attendance)
질문: 근무 시작 10분 뒤에도 두 명이 로그인하지 않았고 연락도 없습니다. 먼저 할 일은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| attendance-q1 | a | 팀장이 돌아오면 알린다. / Tell the team leader when she's back. | 근태는 팀장의 일이니, 출석 시트에 적어 두고 팀장이 돌아오면 알린다. / Attendance is the team leader's job, so write it in the sheet and tell her when she's back. | 없음 (기존 피드백 그대로 맞음) |
| attendance-q1 | b ✓ | 출석 시트에 적고, RTA와 수진 팀장에게 인원 공백을 바로 알린다. / Write it in the attendance sheet, and flag the gap to the RTA and Sujin right away. | 출석 시트에 적고, RTA와 수진 팀장에게 공백을 바로 알린다. / Write it in the attendance sheet, and flag the gap to the RTA and Sujin right away. | (정답, 피드백 없음) |
| attendance-q1 | c | 두 사람 몫의 문의를 직무전문가가 대신 받는다. / The SME takes the two people's contacts. | 대기열이 밀리지 않게, 두 사람 몫의 문의를 직무전문가가 대신 받는다. / So the queue doesn't back up, the SME takes the two people's contacts. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=39, b=35, c=39 (정답 b) — 전: 13/38/26 → 정답이 가장 짧음

##### attendance-q2 (레슨 attendance)
질문: 준호가 오늘 15분 늦었는데, 출석 시트에서 빼 달라고 부탁합니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| attendance-q2 | a | 오래 함께한 동료이니 빼 준다. / He's a colleague of many years, so leave it off. | 오래 함께한 동료이고 15분뿐이니, 이번 한 번만 시트에서 빼 준다. / He's a long-time colleague and it's only 15 minutes, so leave it off just this once. | 없음 (기존 피드백 그대로 맞음) |
| attendance-q2 | b ✓ | 사실대로 기록하고, 사정이 있다면 팀장에게 직접 말하도록 안내한다. / Record it as it is, and suggest he talk to the team leader directly if there's a reason. | 사실대로 기록하고, 사정이 있으면 팀장에게 직접 말하라고 한다. / Record it as it is, and tell him to talk to the team leader directly if there's a reason. | (정답, 피드백 없음) |
| attendance-q2 | c | 늦은 사실을 팀 채팅방에 알린다. / Mention in the team chat that he was late. | 다른 팀원도 기준을 알도록, 늦은 사실을 팀 채팅방에 알린다. / So everyone knows the rule, mention in the team chat that he was late. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=38, b=35, c=34 (정답 b) — 전: 17/37/18 → 정답이 중간

##### huddle-q1 (레슨 huddle)
질문: 공지의 "일부 회원"이 누구인지 분명하지 않은데, 허들은 10분 뒤입니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| huddle-q1 | a | 일단 모든 회원에게 적용된다고 전한다. / Say for now that it applies to all members. | 시간이 없으니 일단 모든 회원에게 적용된다고 전하고, 나중에 바로잡는다. / There's no time, so say for now it applies to all members and correct it later. | 없음 (기존 피드백 그대로 맞음) |
| huddle-q1 | b ✓ | 고객사 담당이나 팀장에게 확인하고, 확인 전이라면 그 부분은 확인 중이라고 전한다. / Check with the client contact or the team leader, and if it isn't confirmed yet, say that part is being checked. | 팀장이나 고객사 담당에게 확인하고, 확인 전이면 확인 중이라고 전한다. / Check with the team leader or the client contact, and if it isn't confirmed yet, say it's being checked. | (정답, 피드백 없음) |
| huddle-q1 | c | 모호한 부분은 빼고 전한다. / Leave out the unclear part. | 틀리게 전하는 것보다 나으니, 모호한 부분은 빼고 확실한 것만 전한다. / It beats passing on something wrong, so leave out the unclear part and share only what's certain. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=40, b=39, c=39 (정답 b) — 전: 21/46/15 → 정답이 가장 짧음

##### huddle-q2 (레슨 huddle)
질문: 야간 근무 상담사들이 허들에 참석하지 못했습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| huddle-q2 | a | 다음 날 허들에서 다시 전한다. / Share it again at the next day's huddle. | 다음 날 허들에서 야간 근무자까지 모아 다시 전하고, 질문도 함께 받는다. / Gather the night shift too at the next day's huddle, share it again and take questions. | 없음 (기존 피드백 그대로 맞음) |
| huddle-q2 | b ✓ | 같은 내용을 글로 남겨 근무 시작 전에 읽게 하고, 야간 담당 직무전문가나 팀장에게도 전한다. / Leave the same content in writing for them to read before their shift, and pass it to the night SME or team leader too. | 글로 남겨 근무 전에 읽게 하고, 야간 직무전문가나 팀장에게도 전한다. / Leave it in writing for them to read before their shift, and pass it to the night SME or team leader too. | (정답, 피드백 없음) |
| huddle-q2 | c | 고객이 물으면 그때 직무전문가에게 물어보라고 한다. / Tell them to ask the SME when a customer asks. | 고객이 물으면 그때 직무전문가에게 메신저로 물어보라고 안내해 둔다. / Tell them to message the SME whenever a customer asks. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=41, b=39, c=37 (정답 b) — 전: 17/52/28 → 정답이 중간

##### calibration-q1 (레슨 calibration)
질문: 점수가 갈린 항목에서 직무전문가가 할 말로 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| calibration-q1 | a | "상담사 입장도 생각해서 점수를 올려 주세요." / "Please raise the score with the agent's side in mind." | "상담사가 많이 애쓴 건이니, 그 입장도 생각해서 점수를 올려 주세요." / "The agent worked hard on this one, so please raise the score with their side in mind." | 없음 (기존 피드백 그대로 맞음) |
| calibration-q1 | c | "저는 QA가 아니니 의견이 없습니다." / "I'm not QA, so I have no opinion." | "저는 QA가 아니니 점수에는 의견이 없고, 정해지는 대로 따르겠습니다." / "I'm not QA, so I have no view on the score; I'll go with whatever is decided." | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=40, b=34, c=41 (정답 b) — 전: 26/34/22 → 정답이 가장 짧음

##### calibration-q2 (레슨 calibration)
질문: 세션에서 사과 표현 기준이 바뀌었고, 다음 평가는 내일부터입니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| calibration-q2 | a | 공식 공지가 나올 때까지 기다린다. / Wait for the official notice. | 잘못 전하지 않도록, 공식 공지가 나올 때까지 기다린다. / So nothing is passed on wrongly, wait for the official notice. | 없음 (기존 피드백 그대로 맞음) |
| calibration-q2 | c | 점수가 낮게 나온 상담사에게만 알려 준다. / Tell only the agents who scored low. | 모두에게 알리면 혼란스러우니, 점수가 낮게 나온 상담사에게만 알려 준다. / Telling everyone causes confusion, so tell only the agents who scored low. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=31, b=30, c=40 (정답 b) — 전: 19/30/23 → 정답이 가장 짧음

##### voc-q1 (레슨 voc)
질문: 이번 주 "비밀번호 재설정 메일이 안 온다"는 문의가 많았습니다. 리포트 항목으로 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| voc-q1 | a | "고객들이 비밀번호 때문에 화가 많이 남" / "Customers are very angry about passwords" | "비밀번호 재설정 관련 불만이 매우 많고 고객들이 화가 많이 남, 빠른 조치 바람" / "Very many complaints about password resets; customers are very angry; please act quickly" | 없음 (기존 피드백 그대로 맞음) |
| voc-q1 | b ✓ | "재설정 메일 미수신: 주 25건(예시), 대표 사례 2건, 발송 지연 확인 제안" / "Reset email not received: 25 a week (Example), 2 typical cases, suggest checking for send delays" | "재설정 메일 미수신: 주 25건(예시), 사례 2건, 발송 지연 확인 제안" / "Reset email not received: 25 a week (Example), 2 cases, suggest checking for send delays" | (정답, 피드백 없음) |
| voc-q1 | c | "지민이 받은 관련 문의 목록 전체" / "The full list of related contacts Jimin took" | "지민이 이번 주 받은 관련 문의 전체 목록(고객 이름·연락처 포함)" / "The full list of related contacts Jimin took this week (with customer names and contact details)" | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=46, b=43, c=39 (정답 b) — 전: 23/46/20 → 정답이 중간

##### voc-q2 (레슨 voc)
질문: 지난달 전한 VOC 주제가 이번 달에도 그대로 많습니다. 어떻게 할까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| voc-q2 | a | 이미 전했으니 이번에는 뺀다. / You already sent it, so leave it out this time. | 이미 전한 주제이니 이번 리포트에서는 빼고, 새 주제에 자리를 준다. / It's a topic you already sent, so leave it out this time and make room for new ones. | 없음 (기존 피드백 그대로 맞음) |
| voc-q2 | b ✓ | 지난 리포트와 함께 건수 변화를 보여 다시 올리고, 팀장과 우선순위를 상의한다. / Raise it again with the figures from the last report to show the change, and discuss priority with the team leader. | 지난 리포트와 건수 변화를 함께 보여 다시 올리고, 우선순위를 팀장과 상의한다. / Raise it again with last report's figures to show the change, and discuss priority with the team leader. | (정답, 피드백 없음) |
| voc-q2 | c | 고객사 담당에게 직접 연락해 항의한다. / Contact the client directly and complain. | 한 달이 지나도 그대로이니, 고객사 담당에게 직접 연락해 빨리 고쳐 달라고 항의한다. / Nothing has changed in a month, so contact the client directly and complain for a quick fix. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=38, b=44, c=47 (정답 b) — 전: 16/44/21 → 정답이 중간

##### kbrequest-q1 (레슨 kbrequest)
질문: 지식 베이스 업데이트 요청으로 알맞은 것은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| kbrequest-q1 | a | "환불 문서 내용이 이상합니다." / "The refund article looks wrong." | "환불 문서 내용이 최근 고객사 공지와 다른 것 같습니다. 확인하고 고쳐 주세요." / "The refund article seems to differ from the client's recent notice. Please check and fix it." | 무엇이 어떻게 다른지 담당자가 다시 찾아야 해서 반영이 늦어집니다. / The owner has to work out what differs and how, which slows the fix. |
| kbrequest-q1 | b ✓ | "환불 문서 3번 항목의 신청 기간을 14일에서 7일로: 고객사 공지와 관련 티켓 2건 첨부" / "Refund article item 3: claim period from 14 days to 7 days; client notice and 2 related tickets attached" | "환불 문서 3번 항목의 신청 기간을 14일에서 7일로: 고객사 공지, 티켓 2건 첨부" / "Refund article item 3: claim period from 14 days to 7 days; client notice and 2 tickets attached" | (정답, 피드백 없음) |
| kbrequest-q1 | c | 편집 권한이 있으니 검토 없이 바로 고친다. / You have edit access, so fix it yourself right away without review. | 편집 권한이 있으니 검토를 기다리지 않고 직접 고친 뒤 팀에 알린다. / You have edit access, so fix it yourself without waiting for review, then tell the team. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=46, b=49, c=38 (정답 b) — 전: 18/52/24 → 정답이 가장 김

##### kbrequest-q2 (레슨 kbrequest)
질문: 요청을 보냈지만 문서가 아직 고쳐지지 않았습니다. 그사이 할 일은 무엇일까요?

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| kbrequest-q2 | a | 고쳐질 때까지 기다린다. / Wait until it's fixed. | 요청은 보냈으니, 담당자가 고칠 때까지 기다리며 진행 상황만 확인한다. / The request is in, so wait for the owner to fix it and just check on progress. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=39, b=31, c=25 (정답 b) — 전: 13/31/25 → 정답이 중간

#### 미룬 작은 지적 (sme 담당)

| 위치 | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| sme/lessons/05-lead.js 스텝 5 (lead) | - | 둘째는 스크러빙 트렌드 요약입니다. 매일 스크러빙한 티켓에서 상담사별로 반복되는 모습을 모아, 정해진 날(예시: 매주 금요일) 팀장이 코칭에 바로 쓸 수 있게 짧게 정리합니다. / The second is the scrubbing trend summary. From the tickets you scrub each day, collect what keeps showing up for each agent, and on the agreed day (Example: every Friday) sum it up briefly so the team leader can use it for coaching. | 둘째는 스크러빙 트렌드 요약입니다. 매일 스크러빙한 티켓에서 상담사별로 반복되는 모습을 모아, 정해진 날(예시: 매주 금요일)에 짧게 정리해 팀장이 코칭에 바로 쓸 수 있게 합니다. / The second is the scrubbing trend summary. From the tickets you scrub each day, collect what keeps showing up for each agent, and sum it up briefly on the agreed day (Example: every Friday) so the team leader can use it right away for coaching. | 해당 없음 (스텝) |
| sme/lessons/07-knowledge.js 스텝 3 셋째 문장 (knowledge) | - | 절차는 직무전문가 SOP의 스크러빙에 있습니다. / The procedure is in Scrubbing in the SME SOP Library. | 절차는 직무전문가 SOP의 스크러빙에 있습니다. (그대로) / The procedure is in the Scrubbing lesson of the SME SOP Library. | 해당 없음 (스텝, 영어만) |
| sme/lessons/02-newcomer.js 스텝 8 첫 문장 (newcomer) | - | OJT와 네스팅은 붙어 있는 거리가 다릅니다. / You stay at a different distance in OJT and in nesting. | OJT 때와 네스팅 때는 곁에 붙어 있는 거리가 다릅니다. / You stay at a different distance in OJT and in nesting. (그대로) | 해당 없음 (스텝, 한국어만) |
| sme-lifecycle graduate-q2 | b ✓ | 환불 문의 기록을 수진 팀장에게 보여 주고, 네스팅 연장이나 추가 교육을 상의한다. / Show Sujin the record of refund contacts, and discuss extending nesting or more training. | 기록을 트레이너, 수진 팀장과 함께 보고, 네스팅 연장이나 추가 교육을 상의한다. / Review the record with the trainer and Sujin, and discuss extending nesting or more training. | (정답, 피드백 없음) — 오답 a·c 길이 맞춤은 위 sme-lifecycle 표 graduate-q2에 함께 적었습니다. |

graduate-q2 길이(ko): a=46, b=45, c=43 (정답 b, 중간). 해설("수료할지 네스팅을 늘릴지는 트레이너와 팀장이 정합니다")과도 맞습니다.

참고: 문안 md(docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md 113·236행, 2026-11-25-sme-course-copy.en.md 310행)에도 같은 문장이 있어 함께 고치면 됩니다.

---

## 팀장 1부 (팀장 첫걸음 · 팀장 서포트 · 복습 퀴즈)

### tl-a 길이 맞추기 제안 (문안만, 레포 미수정)

맡은 범위: 팀장 첫걸음(tl), 팀장 서포트 라이프사이클(tl-support), 복습 퀴즈 tl-q1~6 · sme-q1~6.
길이는 JS 문자열 길이(ko, 공백·문장부호·따옴표 포함)로 셌습니다. 정답 id·보기 id는 모두 그대로입니다.
복습 퀴즈는 review/data.js 와 함께 docs/superpowers/specs/2026-11-25-review-quiz-copy-ko.md, 2026-11-25-review-quiz-copy.en.md 의 같은 칸도 같이 바꿔야 합니다.

#### 팀장 첫걸음 (tl)

요약: 정답이 혼자 가장 긴 문항 12/14 → 2/14 (정답 위치: 가장 김 2, 중간 7, 가장 짧음 4, 셋이 같음 1)

건드리지 않은 문항: start-q2 (28/28/28, 정답 b), direction-q1 (20/20/22, 정답 b)

##### start-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| start-q1 | a | 첫날부터 내 방식으로 바꾼다. / Switch to your own way from day one. | 첫날 허들에서 내 방식을 알리고 바로 바꾼다. 처음에 기준을 세워야 나중에 덜 흔들린다. / Announce your way at the first huddle and switch right away; setting the standard early means less wobbling later. | 없음 (기존 피드백 그대로 맞음) |
| start-q1 | b (정답) | 적어 두고, 왜 그렇게 해 왔는지 파악한 뒤에 바꿀지 정한다. / Note it down, and decide whether to change it once you know why it has been done that way. | 적어 두고, 이유를 파악한 뒤에 바꿀지 정한다. / Note it down, and decide whether to change it once you know why. | (정답, 피드백 없음) |
| start-q1 | c | 팀이 해 온 방식이니 앞으로도 손대지 않는다. / It's how the team has always worked, so leave it alone from now on. | 팀이 오래 해 온 방식이니, 팀원들이 불편하지 않게 앞으로도 손대지 않는다. / It's how the team has long worked, so leave it alone for good so no one is put out. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=49, b=26, c=42 (정답 b) — 고치기 전 16/34/25

##### roster-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| roster-q1 | a | "열정적이고 성실함" / "Passionate and diligent" | "열정적이고 성실함, 팀원들과 잘 어울리며 늘 먼저 돕는 편" / "Passionate and diligent; gets on well with everyone and is always first to help" | 없음 (기존 피드백 그대로 맞음) |
| roster-q1 | b (정답) | "채팅·이메일 가능, 환불·배송 문의 처리, 신입 버디 경험" / "Chat and email; refund and delivery contacts; new-hire buddy experience" | "채팅·이메일, 환불·배송 문의, 신입 버디 경험" / "Chat and email; refund and delivery contacts; new-hire buddy experience" | (정답, 피드백 없음) |

길이(ko): a=34, b=28, c=15 (정답 b) — 고치기 전 11/34/15

##### roster-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| roster-q2 | a | 같은 팀 상담사들에게 서준에 대해 묻는다. / Ask the other agents on the team about Seojun. | 같은 팀 상담사들에게 서준이 요즘 어디서 힘들어하는지 슬쩍 물어본다. / Quietly ask the other agents on the team where Seojun seems to struggle lately. | 없음 (기존 피드백 그대로 맞음) |
| roster-q2 | b (정답) | 서준을 가까이에서 도와 온 직무전문가 하린에게 묻는다. / Ask Harin, the SME who has helped Seojun up close. | 서준을 매일 도와 온 직무전문가 하린에게 묻는다. / Ask Harin, the SME who has helped Seojun every day. | (정답, 피드백 없음) |

길이(ko): a=38, b=27, c=23 (정답 b) — 고치기 전 23/30/23

##### results-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| results-q1 | b (정답) | QA에게 감점된 항목을 듣고, 실제 응대를 들으며 확인할 질문을 메모한다. / Hear from QA which items lost points, and note questions to check by listening to his actual contacts. | QA에게 감점 항목을 듣고, 녹취로 확인할 질문을 적는다. / Hear from QA which items lost points, and note questions to check in his recordings. | (정답, 피드백 없음) |

길이(ko): a=25, b=32, c=26 (정답 b) — 고치기 전 25/41/26

##### results-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| results-q2 | c | 입사 뒤 전체 기간 / Their whole time since joining | 입사 뒤 전체 기간 (길게 볼수록 정확하므로) / Their whole time since joining (the longer, the more accurate) | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=7, b=16, c=25 (정답 b) — 고치기 전 7/16/10

##### listen-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| listen-q1 | a | 지민의 습관으로 메모한다. / Note it as Jimin's habit. | 지민의 습관으로 메모한다. 작은 것도 적어 둬야 나중에 코칭 근거가 된다. / Note it as Jimin's habit; writing down even small things gives you grounds for coaching later. | 없음 (기존 피드백 그대로 맞음) |
| listen-q1 | b (정답) | 다른 건에서도 같은 모습이 나오는지 더 들어 본 뒤에 습관으로 적는다. / Listen to more contacts to see whether it repeats before noting it as a habit. | 몇 건 더 들어 보고, 반복되면 습관으로 적는다. / Listen to a few more, and note it as a habit if it repeats. | (정답, 피드백 없음) |
| listen-q1 | c | 바로 지민에게 알려 주의를 준다. / Tell Jimin right away and warn her. | 그 자리에서 지민에게 알려 주의를 준다. 바로 말해야 반복을 막는다. / Tell Jimin on the spot and warn her; saying it right away stops it repeating. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=41, b=27, c=38 (정답 b) — 고치기 전 14/39/18

##### listen-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| listen-q2 | a | 잘못한 상담사들을 한 명씩 코칭한다. / Coach each of them one by one. | 잘못 안내한 상담사들을 한 명씩 불러 코칭한다. / Call in each agent who got it wrong and coach them one by one. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=26, b=27, c=16 (정답 b) — 고치기 전 20/27/16

##### contribution-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| contribution-q1 | a | 팀원들에게 스케줄을 더 잘 지키라고 공지한다. / Tell the team to keep to their schedules better. | 팀원들에게 스케줄을 더 잘 지키라고 공지하고, 매일 허들에서 준수율을 공유한다. / Tell the team to keep to their schedules better, and share adherence at the huddle every day. | 없음 (기존 피드백 그대로 맞음) |
| contribution-q1 | b (정답) | 같은 프로젝트의 다른 팀도 같은지 보고, 원인이 팀 안에 있는지 밖에 있는지 나눈다. / See whether other teams on the project are the same, and separate causes inside the team from those outside. | 다른 팀도 같은지 보고, 원인이 팀 안인지 밖인지 나눈다. / See whether other teams are the same, and sort causes inside the team from those outside. | (정답, 피드백 없음) |
| contribution-q1 | c | 목표가 잘못됐다고 보고 신경 쓰지 않는다. / Decide the target is wrong and ignore it. | 목표가 잘못 잡혔다고 보고, 팀원들이 부담을 느끼지 않게 그냥 둔다. / Decide the target was set wrong and leave it, so the team doesn't feel pressured. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=44, b=32, c=38 (정답 b) — 고치기 전 25/47/23

##### contribution-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| contribution-q2 | c | 지난 6개월(예시)의 모든 지표 원본 / Raw data for every metric over the last 6 months (Example) | 빠짐없이 모은 지난 6개월(예시)의 모든 지표 원본 / Raw data for every metric over the last 6 months (Example), with nothing left out | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=7, b=22, c=28 (정답 b) — 고치기 전 7/22/20

##### oneonone-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| oneonone-q1 | a | "지난 6개월(예시) 성과를 보니 보완할 점이 많네요." / "Looking at your last 6 months (Example), there's a lot to improve." | "지난 6개월(예시) 성과를 보니 보완할 점이 많네요. 오늘은 그 이야기부터 할게요." / "Looking at your last 6 months (Example), there's a lot to improve. Let's start with that today." | 없음 (기존 피드백 그대로 맞음) |
| oneonone-q1 | b (정답) | "서로 알아 가려고 마련한 자리예요. 지금 일하면서 어떤지 듣고 싶어요." / "This is a chance for us to get to know each other. I'd like to hear how work is going for you." | "서로 알아 가는 자리예요. 요즘 일은 어떤지 듣고 싶어요." / "This is for getting to know each other. I'd like to hear how work is going." | (정답, 피드백 없음) |

길이(ko): a=48, b=34, c=23 (정답 b) — 고치기 전 31/41/23

##### oneonone-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| oneonone-q2 | a | 팀 허들에서 지민의 사정을 알리고 협조를 구한다. / Tell the team at the huddle about her situation and ask for their cooperation. | 팀 허들에서 지민의 사정을 알리고, 야간 근무를 바꿔 줄 사람이 있는지 협조를 구한다. / Tell the team at the huddle about her situation and ask who could swap night shifts with her. | 없음 (기존 피드백 그대로 맞음) |
| oneonone-q2 | b (정답) | 사정은 지민의 허락 없이 말하지 않고, 근무 조정이 가능한지 정해진 절차로 확인한다. / Don't share it without Jimin's permission, and check through the agreed process whether her shifts can change. | 지민의 허락 없이 알리지 않고, 근무 조정은 정해진 절차로 확인한다. / Don't share it without Jimin's permission, and check shift changes through the agreed process. | (정답, 피드백 없음) |
| oneonone-q2 | c | 성과와 상관없는 이야기이니 메모하지 않는다. / It has nothing to do with performance, so don't note it. | 성과와 상관없는 개인 이야기이니 면담 메모에 남기지 않는다. / It's personal and unrelated to performance, so leave it out of your notes. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=48, b=38, c=33 (정답 b) — 고치기 전 27/47/24

##### direction-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| direction-q2 | a | 팀에 돌아가 내 우선순위대로 진행한다. / Go back to the team and follow your own priorities. | 팀 사정은 내가 더 잘 아니, 팀에 돌아가 내 우선순위대로 진행한다. / You know the team better, so go back and follow your own priorities. | 없음 (기존 피드백 그대로 맞음) |
| direction-q2 | b (정답) | 근거를 들어 의견을 말하고, 결정된 방침을 따르며 의견은 기록해 둔다. / Give your view with evidence, follow the direction once it's set, and keep a record of your view. | 근거를 들어 의견을 말하되, 정해지면 따르고 기록해 둔다. / Give your view with evidence; once it's set, follow it and keep a record of your view. | (정답, 피드백 없음) |

길이(ko): a=38, b=32, c=22 (정답 b) — 고치기 전 21/39/22

#### 팀장 서포트 라이프사이클 (tl-support)

요약: 정답이 혼자 가장 긴 문항 10/10 → 2/10 (정답 위치: 가장 김 2, 중간 5, 가장 짧음 3)

건드리지 않은 문항: 없음

##### agents-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| agents-q1 | a | 돕기: 코칭이 부족했다. / Helping: there wasn't enough coaching. | 돕기: 목표를 따라갈 수 있게 코칭이 충분하지 않았다. / Helping: there wasn't enough coaching for him to keep up with the target. | 없음 (기존 피드백 그대로 맞음) |
| agents-q1 | b (정답) | 맡기기: 기대하는 목표를 분명히 전하지 않았다. / Handing over: the expected goal wasn't made clear. | 맡기기: 목표를 분명히 전하지 않았다. / Handing over: the goal wasn't made clear. | (정답, 피드백 없음) |
| agents-q1 | c | 개입하기: 더 일찍 지적했어야 했다. / Stepping in: you should have pointed it out sooner. | 개입하기: 목표에 못 미칠 때 더 일찍 지적했어야 했다. / Stepping in: you should have pointed it out sooner when he fell short. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=30, b=21, c=31 (정답 b) — 고치기 전 13/26/20

##### agents-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| agents-q2 | a | 지민이 스스로 고치기를 더 기다린다. / Wait longer for Jimin to fix it herself. | 지민은 오래 일한 사람이니, 스스로 고치기를 몇 주 더 기다린다. / Jimin is experienced, so wait a few more weeks for her to fix it herself. | 없음 (기존 피드백 그대로 맞음) |
| agents-q2 | b (정답) | 직접 개입해 원인을 함께 보고, 계속되면 PIP 절차를 검토한다. / Step in directly, look at the cause together, and consider the PIP procedure if it continues. | 직접 개입해 원인을 보고, 계속되면 PIP를 검토한다. / Step in directly, look at the cause, and consider a PIP if it continues. | (정답, 피드백 없음) |
| agents-q2 | c | 직무전문가에게 지민의 실수를 맡긴다. / Hand Jimin's mistake over to the SME. | 지민을 매일 보는 직무전문가에게 실수 관리를 맡긴다. / Hand managing the mistake to the SME, who sees Jimin every day. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=36, b=30, c=29 (정답 b) — 고치기 전 20/36/20

##### sme-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q1 | c | 앞으로는 알아서 하라고 한다. / Tell her to handle them on her own from now on. | 하린을 믿고, 앞으로는 알아서 판단하라고 한다. / Trust Harin and tell her to decide on her own from now on. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=12, b=21, c=26 (정답 b) — 고치기 전 12/21/16

##### sme-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q2 | a | 하린에게 그 상담사에게 경고하라고 한다. / Tell Harin to warn the agent. | 상황을 가장 잘 아는 하린에게, 그 상담사에게 직접 경고하라고 한다. / Tell Harin, who knows the situation best, to warn the agent herself. | 없음 (기존 피드백 그대로 맞음) |
| sme-q2 | b (정답) | 팀장이 직접 확인하고 조치하며, 하린에게는 넘겨받아 처리했다는 것만 알린다. / Check it yourself, take action, and tell Harin only that you have taken it over and handled it. | 직접 확인해 조치하고, 하린에게는 처리했다는 것만 알린다. / Check and act yourself, and tell Harin only that it's been handled. | (정답, 피드백 없음) |

길이(ko): a=38, b=32, c=28 (정답 b) — 고치기 전 22/42/28

##### qa-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| qa-q1 | a | 팀 순위표 / A team ranking | 팀 순위표 (누가 가장 낮은지 바로 보이게) / A team ranking (so you can see at once who is lowest) | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=24, b=18, c=10 (정답 b) — 고치기 전 5/18/10

##### qa-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| qa-q2 | a | 서준에게 QA에 직접 따지라고 한다. / Tell Seojun to take it up with QA directly. | 점수는 본인 일이니, 서준에게 QA를 직접 찾아가 따지라고 한다. / It's his score, so tell Seojun to go to QA and argue it himself. | 없음 (기존 피드백 그대로 맞음) |
| qa-q2 | b (정답) | 녹취를 함께 듣고, 근거가 있으면 정해진 절차로 다시 검토를 요청한다. / Listen to the recording together, and if there are grounds, ask for a re-review through the agreed process. | 녹취를 함께 듣고, 근거가 있으면 절차대로 재검토를 요청한다. / Listen to the recording together, and if there are grounds, ask for a re-review through the process. | (정답, 피드백 없음) |
| qa-q2 | c | QA의 평가이니 무조건 받아들이라고 한다. / Tell him to accept it, since it's QA's scoring. | QA의 평가이니 이번에는 그대로 받아들이라고 다독인다. / It's QA's scoring, so calm him down and tell him to accept it this time. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=36, b=34, c=30 (정답 b) — 고치기 전 20/39/23

##### trainers-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| trainers-q1 | a | "요즘 팀이 전반적으로 약해요." / "The team seems weak across the board lately." | "요즘 팀이 전반적으로 약해요. 기본 교육을 한 번 더 부탁드려요." / "The team seems weak across the board lately. Could you run the basics again?" | 없음 (기존 피드백 그대로 맞음) |
| trainers-q1 | b (정답) | "환불 문의 오안내가 이번 달 12건(예시)이고, 대표 사례를 첨부합니다." / "There were 12 wrong explanations on refund contacts this month (Example); typical cases are attached." | "환불 오안내가 이번 달 12건(예시)이에요. 사례를 첨부합니다." / "There were 12 wrong refund explanations this month (Example). Cases are attached." | (정답, 피드백 없음) |
| trainers-q1 | c | "다음 기수 교육을 늘려 주세요." / "Please add more to the next class's training." | "다음 기수 교육을 늘려 주세요. 신입이 같은 문제를 겪지 않게요." / "Please add more to the next class's training, so new hires don't hit the same problem." | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=38, b=37, c=38 (정답 b) — 고치기 전 18/42/19

##### trainers-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| trainers-q2 | b (정답) | 트레이너와 함께 수료를 미루고, 네스팅을 늘릴지 추가 교육을 할지 정한다. / Decide with the trainer to hold back graduation, and whether to extend nesting or add extra training. | 트레이너와 수료를 미루고, 네스팅 연장이나 추가 교육을 정한다. / Decide with the trainer to hold back completion, and choose between longer nesting and extra training. | (정답, 피드백 없음) |
| trainers-q2 | c | 신입에게 혼자 더 공부하라고 한다. / Tell the new hire to study more on their own. | 신입에게 자료를 주고, 수료 전까지 혼자 더 공부하라고 한다. / Give the new hire materials and tell them to study more on their own before completion. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=32, b=35, c=34 (정답 b) — 고치기 전 32/41/19

##### team-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| team-q1 | a | 각자 알아서 해결하라고 한다. / Tell each of them to sort it out on their own. | 각자 맡은 분야이니, 알아서 해결하고 결과만 알려 달라고 한다. / It's each one's own area, so tell them to sort it out and just report back. | 없음 (기존 피드백 그대로 맞음) |
| team-q1 | b (정답) | 한자리에 모아 세 이야기가 같은 원인을 가리키는지 함께 본다. / Bring them together and see whether the three stories point to the same cause. | 한자리에 모아 같은 원인인지 함께 본다. / Bring them together and see whether it is the same cause. | (정답, 피드백 없음) |
| team-q1 | c | 숫자가 가장 나쁜 문제 하나만 고른다. / Pick only the problem with the worst numbers. | 숫자가 가장 나쁜 문제 하나만 골라 먼저 고친다. / Pick only the problem with the worst numbers and fix it first. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=35, b=22, c=27 (정답 b) — 고치기 전 16/34/21

##### team-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| team-q2 | a | "다들 수고했어요." / "Thanks for your hard work, everyone." | "다들 수고했어요. 이번 주도 목표를 넘겼으니 오늘도 힘내 봐요!" / "Thanks for your hard work, everyone. We beat the target again this week, so let's keep it up today!" | 없음 (기존 피드백 그대로 맞음) |
| team-q2 | b (정답) | "어제 지민이 어려운 환불 문의를 끝까지 해결했어요. 고객이 감사 메일을 보냈어요." / "Yesterday Jimin saw a tough refund contact through to the end. The customer sent a thank-you email." | "어제 지민이 어려운 환불 건을 끝까지 해결해 감사 메일을 받았어요." / "Yesterday Jimin saw a tough refund case through to the end and got a thank-you email." | (정답, 피드백 없음) |
| team-q2 | c | 칭찬은 1:1에서만 한다. / Give praise only in one-on-ones. | 칭찬은 다른 팀원이 비교당하지 않도록 1:1에서만 따로 한다. / Give praise only in one-on-ones, so other team members don't feel compared. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=37, b=39, c=34 (정답 b) — 고치기 전 11/47/14

#### 복습 퀴즈 · 팀장 (tl-q1~6)

요약: 정답이 혼자 가장 긴 문항 6/6 → 1/6 (정답 위치: 가장 김 1, 중간 3, 가장 짧음 2)

건드리지 않은 문항: 없음

##### tl-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| tl-q1 | b (정답) | 녹취 몇 건과 지표를 함께 보고, 1:1 코칭에서 잘한 점과 줄일 수 있는 구간을 함께 찾는다. / Look at a few recordings together with the metrics, and in a one-on-one find what she does well and which parts can be shorter. | 녹취와 지표를 함께 보고, 1:1에서 잘한 점과 줄일 구간을 찾는다. / Review recordings with the metrics, and in a one-on-one find what she does well and which parts can be shorter. | (정답, 피드백 없음) |
| tl-q1 | c | 팀 허들에서 통화를 더 빨리 끝내자고 공지한다. / Announce in the team huddle that calls need to end faster. | 팀 허들에서 AHT 목표를 다시 알리고, 통화를 더 빨리 끝내자고 공지한다. / Restate the AHT target at the team huddle and announce that calls need to end faster. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=43, b=38, c=42 (정답 b) — 고치기 전 43/53/26

##### tl-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| tl-q2 | a | 같은 내용으로 한 번 더 코칭한다. / Coach her once more on the same thing. | 방식은 그대로 두고, 같은 내용으로 한 번 더 1:1 코칭을 잡는다. / Keep the same approach and book one more one-on-one on the same point. | 없음 (기존 피드백 그대로 맞음) |
| tl-q2 | b | 나아질 기미가 없으니 퇴사를 권한다. / Suggest she leave, since there is no sign of improvement. | 세 번이나 기회를 줬으니, 나아질 기미가 없다고 보고 퇴사를 권한다. / You've given three chances with no sign of improvement, so suggest she leave. | 공식적인 목표와 지원 없이 끝내면 팀원들은 도움을 청해도 소용없다고 느낍니다. / Ending it without formal goals and support tells the team that asking for help is pointless. |
| tl-q2 | c (정답) | 데이터를 근거로 면담하고, 목표와 지원 약속을 함께 정해 주간으로 점검하는 PIP로 넘어간다. / Move to a PIP: meet with the data, agree on goals and the support you will give, and check in weekly. | 데이터로 면담하고, 목표와 지원을 정해 매주 점검하는 PIP로 넘어간다. / Move to a PIP: meet with the data, agree on goals and support, and check in weekly. | (정답, 피드백 없음) |

길이(ko): a=38, b=38, c=40 (정답 c) — 고치기 전 19/20/52

##### tl-q3

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| tl-q3 | a (정답) | 그 상담사를 잠시 쉬게 하고, 같은 불만이 몰린다는 사실을 부매니저나 매니저에게 바로 보고한다. / Let that agent take a short break, and report to your assistant manager or operation manager right away that the same complaint is piling up. | 상담사를 잠시 쉬게 하고, 불만 급증을 부매니저나 매니저에게 바로 보고한다. / Let the agent take a short break, and report the surge to your assistant manager or operation manager right away. | (정답, 피드백 없음) |
| tl-q3 | b | 대기 고객이 많으니 상담사를 바로 다음 콜로 돌려보낸다. / Send the agent straight back to the next call, since many customers are waiting. | 대기 고객이 많으니, 상담사를 다독여 바로 다음 콜로 돌려보내고 근무 뒤에 면담한다. / Many customers are waiting, so reassure the agent, send them straight back to calls and talk after the shift. | 없음 (기존 피드백 그대로 맞음) |
| tl-q3 | c | 불만이 가라앉을 때까지 팀 안에서만 처리한다. / Handle it inside the team until the complaints calm down. | 불만이 가라앉을 때까지 팀 안에서 응대 문구를 맞춰 처리한다. / Agree on a response script within the team and handle it there until the complaints calm down. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=42, b=47, c=34 (정답 a) — 고치기 전 53/31/25

##### tl-q4

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| tl-q4 | a | 지원자가 줄지 않도록, 교대 근무는 묻는 사람에게만 설명한다. / Explain shift work only to those who ask, so applicant numbers don't drop. | 지원자가 줄지 않도록, 교대 근무는 묻는 지원자에게만 짧게 설명한다. / Explain shift work briefly, and only to applicants who ask, so applicant numbers don't drop. | 없음 (기존 피드백 그대로 맞음) |
| tl-q4 | b (정답) | 면담 내용을 채용 담당과 나누고, 면접에서 교대 근무를 솔직하게 안내한다. / Share the interview findings with the recruiter, and explain shift work honestly in the interviews. | 채용 담당에게 공유하고, 면접에서 교대 근무를 솔직히 안내한다. / Share it with the recruiter, and explain shift work honestly in the interviews. | (정답, 피드백 없음) |
| tl-q4 | c | 퇴사자 개인의 사정으로 보고 면담 기록만 남긴다. / Treat it as the leaver's personal situation and just keep the interview notes. | 두 명뿐이니 퇴사자 개인의 사정으로 보고, 면담 기록만 남긴다. / It's only two people, so treat it as their personal situation and just keep the interview notes. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=38, b=35, c=35 (정답 b) — 고치기 전 34/41/27

##### tl-q5

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| tl-q5 | a | 친한 사이니 하은의 점수만 다시 봐 달라고 QA에 부탁한다. / Ask QA to look at Haeun's scores again, since you are close. | 하은이 믿고 꺼낸 이야기이니, QA에 하은의 점수만 다시 봐 달라고 조용히 부탁한다. / Haeun trusted you with this, so quietly ask QA to look at her scores again. | 없음 (기존 피드백 그대로 맞음) |
| tl-q5 | c (정답) | QA에 캘리브레이션 세션을 요청해 기준을 맞추고, 결과를 팀 전체에 알린다. / Ask QA for a calibration session to align the standard, then tell the whole team the outcome. | QA에 캘리브레이션을 요청해 기준을 맞추고, 결과를 팀에 알린다. / Ask QA for calibration to align the standard, then tell the team the outcome. | (정답, 피드백 없음) |

길이(ko): a=47, b=21, c=36 (정답 c) — 고치기 전 33/21/42

##### tl-q6

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| tl-q6 | a (정답) | 버디와 함께 서아에게 먼저 다가가 막히는 곳을 묻고, 빠진 안내를 1:1로 짚어 준다. / Go to Seoa first with her buddy, ask where she gets stuck, and go over the missing explanation one on one. | 버디와 함께 먼저 다가가 막힌 곳을 묻고, 빠진 안내를 1:1로 짚는다. / Go to Seoa first with her buddy, ask where she's stuck, and go over the missing explanation one on one. | (정답, 피드백 없음) |
| tl-q6 | b | 팀 허들에서 서아의 티켓을 사례로 보여 준다. / Show Seoa's tickets as an example in the team huddle. | 같은 실수가 없도록, 팀 허들에서 서아의 티켓을 사례로 보여 준다. / Show Seoa's tickets as an example at the team huddle, so no one repeats the mistake. | 없음 (기존 피드백 그대로 맞음) |
| tl-q6 | c | 아직 실전 첫 주이니 한 달 동안은 지켜만 본다. / It is only her first week live, so just watch for a month. | 실전 첫 주이니 부담 주지 않게, 한 달 동안은 질문이 올 때까지 지켜본다. / It's only her first week live, so don't add pressure; watch for a month until she asks. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=40, b=37, c=42 (정답 a) — 고치기 전 48/25/27

#### 복습 퀴즈 · 직무전문가 (sme-q1~6)

요약: 정답이 혼자 가장 긴 문항 6/6 → 1/6 (정답 위치: 가장 김 1, 중간 2, 가장 짧음 2, 다른 보기와 같음 1 — sme-q6 b·c 40자)

건드리지 않은 문항: 없음

##### sme-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q1 | a (정답) | 서준에게 먼저 가고, 준호와 팀장에게는 언제 처리할지 짧게 알린다. / Go to Seojun first, and tell Junho and the team leader briefly when you will get to them. | 서준에게 먼저 가고, 준호와 팀장에게는 언제 할지 알린다. / Go to Seojun first, and tell Junho and the team leader when you will get to them. | (정답, 피드백 없음) |
| sme-q1 | b | 동기인 준호의 승인부터 처리한다. / Approve Junho's request first, since he is your peer. | 동기인 준호의 승인부터 처리한다. 티켓으로 와 있어 금방 끝난다. / Approve your peer Junho's request first; it's already in a ticket, so it's quick. | 순서는 빨리 끝나는 일이나 친분이 아니라, 고객이 지금 기다리느냐로 정합니다. / The order is set by whether a customer is waiting now, not by what's quick or by friendship. |
| sme-q1 | c | 팀장의 요청이니 출석 확인부터 한다. / Do the attendance first, since the team leader asked. | 팀장의 요청이니 출석 확인부터 하고, 서준에게는 잠시 기다리라고 손짓한다. / The team leader asked, so do attendance first and signal Seojun to wait a moment. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=32, b=36, c=41 (정답 a) — 고치기 전 37/18/20

##### sme-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q2 | a | 팀 채팅방에 준호의 건이라고 밝히고 절차를 다시 안내한다. / Say in the team chat that these were Junho's and explain the procedure again. | 같은 일이 없도록 팀 채팅방에 준호의 건이라고 밝히고 절차를 다시 안내한다. / So it doesn't happen again, say in the team chat these were Junho's and explain the procedure again. | 없음 (기존 피드백 그대로 맞음) |
| sme-q2 | b | 동기 사이니 이번에도 모른 척 넘어간다. / Look the other way again, since you are peers. | 동기인 준호의 체면을 생각해, 이번에도 모른 척 넘어간다. / Think of your peer Junho's pride and look the other way again. | 없음 (기존 피드백 그대로 맞음) |
| sme-q2 | c (정답) | 준호와 1:1로 누구에게나 같은 기준이라고 말하고, 사례를 팀장에게 바로 알린다. / Tell Junho one on one that the standard is the same for everyone, and tell the team leader about the cases right away. | 준호와 1:1로 같은 기준임을 말하고, 사례는 팀장에게 바로 알린다. / Tell Junho one on one that the standard is the same for everyone, and tell the team leader about the cases right away. | (정답, 피드백 없음) |

길이(ko): a=42, b=32, c=38 (정답 c) — 고치기 전 32/22/45

##### sme-q3

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q3 | a | 허들에서 이미 말했으니 다시 설명하지 않는다. / Don't explain again, since you covered it in the huddle. | 허들에서 이미 설명했으니, 허들 메모를 다시 보라고만 한다. / You covered it in the huddle, so just tell them to check the huddle notes again. | 없음 (기존 피드백 그대로 맞음) |
| sme-q3 | b (정답) | 답을 정리해 팀 채팅방에 올리고 지식 베이스 업데이트를 요청하며, 서준에게는 그 문서 위치를 보여 준다. / Sum up the answer in the team chat, ask for a knowledge base update, and show Seojun where the article is. | 답을 팀 채팅방에 올리고 지식 베이스 수정을 요청하며, 서준에게 문서 위치를 보여 준다. / Post the answer in the team chat, ask for a knowledge base update, and show Seojun where the article is. | (정답, 피드백 없음) |
| sme-q3 | c | 물어볼 때마다 한 사람씩 답한다. / Answer each person as they ask. | 물어볼 때마다 한 사람씩 자리로 가서 자세히 다시 설명해 준다. / Go to each person as they ask and explain it again in detail. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=33, b=49, c=35 (정답 b) — 고치기 전 25/58/18

##### sme-q4

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q4 | a | 결근 사유를 들어 보고 병가로 처리해 준다. / Hear the reasons and record them as sick leave. | 결근 사유를 들어 보고, 아프다고 하면 병가로 처리해 둔다. / Hear the reasons, and record sick leave if they say they are ill. | 없음 (기존 피드백 그대로 맞음) |
| sme-q4 | b (정답) | 결근 연락을 기록하고, 인원이 부족하다는 것을 팀장과 RTA에 바로 알린다. / Record the absence messages, and tell the team leader and the RTA right away that the team is short. | 결근 연락을 기록하고, 인원 부족을 팀장과 RTA에 바로 알린다. / Record the absence messages, and tell the team leader and the RTA right away that the team is short. | (정답, 피드백 없음) |
| sme-q4 | c | 서포트를 멈추고 혼자 콜을 더 받아 빈자리를 메운다. / Stop supporting and take more calls yourself to fill the gap. | 대기가 늘고 있으니 서포트를 멈추고, 혼자 콜을 더 받아 빈자리를 메운다. / Waits are growing, so stop supporting and take more calls yourself to fill the gap. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=33, b=36, c=41 (정답 b) — 고치기 전 24/42/29

##### sme-q5

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q5 | a (정답) | 지민에게 바뀐 기준을 설명하고, 아직 모르는 상담사가 없도록 허들과 팀 채팅방으로 바로 전한다. / Explain the new standard to Jimin, and pass it on right away through the huddle and team chat so no agent is left unaware. | 지민에게 설명하고, 허들과 팀 채팅방으로 모두에게 바로 전한다. / Explain it to Jimin, and pass it to everyone right away through the huddle and team chat. | (정답, 피드백 없음) |
| sme-q5 | b | 기준은 QA의 일이니 QA에게 물어보라고 한다. / Tell her to ask QA, since standards are QA's job. | 기준은 QA가 정하는 일이니, 자세한 것은 QA에게 직접 물어보라고 한다. / Standards are set by QA, so tell her to ask QA directly for the details. | 없음 (기존 피드백 그대로 맞음) |
| sme-q5 | c | QA에게 지민만 이번 평가에서 빼 달라고 요청한다. / Ask QA to leave Jimin out of this round of scoring. | 평가가 모레부터이니, QA에게 지민만 이번 평가에서 빼 달라고 요청한다. / Scoring starts the day after tomorrow, so ask QA to leave Jimin out of this round. | 없음 (기존 피드백 그대로 맞음) |

길이(ko): a=35, b=41, c=40 (정답 a) — 고치기 전 53/26/28

##### sme-q6

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| sme-q6 | a | 준호의 경험을 믿고 승인한다. / Trust Junho's experience and approve it. | 준호가 경력이 더 많으니, 그 판단을 믿고 이번 한 번은 승인한다. / Junho has more experience, so trust his call and approve it this once. | 없음 (기존 피드백 그대로 맞음) |
| sme-q6 | b | 정책에 없으니 거절하고 준호에게 그대로 응대하게 한다. / Turn it down because policy does not cover it, and let Junho carry on. | 정책에 없는 보상이니 거절하고, 준호에게 그대로 응대를 이어 가게 한다. / Policy does not cover it, so turn it down and let Junho carry on with the call. | 없음 (기존 피드백 그대로 맞음) |
| sme-q6 | c (정답) | 승인 범위 밖이므로 준호에게 고객 대기 안내를 부탁하고, 팀장에게 바로 넘긴다. / It is outside your limits, so ask Junho to tell the customer there is a short wait, and pass it to the team leader right away. | 범위 밖이니 준호에게 고객 대기 안내를 부탁하고, 팀장에게 바로 넘긴다. / It is outside your limits, so ask Junho to tell the customer there is a short wait, and pass it to the team leader right away. | (정답, 피드백 없음) |

길이(ko): a=37, b=40, c=40 (정답 c) — 고치기 전 16/30/44

#### 미룬 작은 지적

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (있으면 후 ko / en) |
|---|---|---|---|---|
| tl-support/lessons/02-sme.js 레슨 sme 6단계 캡션 (보기 아님) | — | …근태나 성과 조치의 내용은 당사자와 꼭 필요한 사람(부매니저, 인사 담당)하고만 다룹니다. / …and keep attendance or performance actions between you, the agent and only those who must know, such as your assistant manager or HR. | …근태나 성과 조치의 내용은 당사자, 꼭 필요한 사람(부매니저, 인사 담당)과만 다룹니다. / (영어는 그대로) | — |
| 복습 퀴즈 sme-q5 질문 (보기 아님) | — | 캘리브레이션에서 확인 단계의 기준이 바뀌었고, 바뀐 기준의 평가는 모레부터입니다. 다음 날 지민이 처음 듣는 이야기라며 찾아옵니다. 알맞은 것은 무엇일까요? / Calibration changed the standard for the check step, and scoring on it starts the day after tomorrow. The next day, Jimin comes to you saying she has never heard of it. What fits best? | 캘리브레이션에서 확인 단계의 기준이 바뀌었고, 바뀐 기준의 평가는 모레부터입니다. 다음 날 지민이 동료에게 들었다며, 바뀐 기준을 전달받은 적이 없다고 찾아옵니다. 알맞은 것은 무엇일까요? / Calibration changed the standard for the check step, and scoring on it starts the day after tomorrow. The next day, Jimin comes to you saying she heard it from a colleague but was never told. What fits best? | — |

sme-q5 새 질문 배경과 위 sme-q5 새 보기(정답 a "지민에게 설명하고, 허들과 팀 채팅방으로 모두에게 바로 전한다.")가 서로 맞는지 확인했습니다. 02-sme.js 는 review-quiz 문안 md 처럼 따로 적힌 문서가 있다면 그곳도 같이 바꿉니다.

---

## 팀장 2부 (상담사 라이프사이클 · 팀장 SOP)

### tl-b — 정답 길이 맞추기 초안 (상담사 라이프사이클 · 팀장 SOP 라이브러리)

레포는 고치지 않았습니다. 아래 문안은 제안입니다. 길이는 한국어 `text.ko.length`(공백·문장부호 포함)입니다.
"(정답)" 표시가 없는 줄은 오답입니다. 표에 없는 보기는 그대로 둡니다. 피드백 칸이 "—"이면 지금 피드백이 새 문장과 그대로 맞습니다.

전체 요약
- 상담사 라이프사이클: 29 / 30 → 6 / 30 (정답이 가장 짧음 11, 중간 13). 트랙 질문 24개 포함.
- 팀장 SOP 라이브러리: 16 / 21 → 5 / 21 (정답이 가장 짧음 8(동률 포함), 중간 8).
- 그대로 둔 문항(이미 고르거나 차이가 작음): 라이프사이클 hiring-q1(27/28/19), onboarding-q1, career-q1(23/30/29) · SOP escalation-q1, scrubbing-q1, coaching-q3(29/33/23), transition-q1, onboarding-q2, incident-q1(19/26/29), incident-q2, nurture-q2(24/27/20).
- 방향: 정답은 핵심만 남겨 줄이고, 오답 일부에 "~하니, ~한다"처럼 현장에서 실제로 댈 법한 이유를 붙였습니다. 정답이 늘 가장 짧아지는 반대 패턴을 막으려고, 일부 문항은 오답 하나를 원문 그대로 두거나 짧게 줄여 정답이 중간이나 가장 길게(차이 작게) 남도록 섞었습니다.
- 주의해서 본 점: 새 오답이 맞는 답처럼 읽히지 않게 했습니다(예: retention-general-2 b는 "일찍 정리"처럼 배려로 읽힐 수 있는 표현을 빼고 "따로 이야기 없이"로 정함). 출처 없는 숫자는 새로 넣지 않았습니다(pip-q2 정답은 "예시:"를 유지).

#### 상담사 라이프사이클 (lifecycle)

요약: 고치기 전 "정답이 혼자 가장 긴" 29 / 30 → 고친 뒤 6 / 30 (고친 뒤 정답이 가장 짧음(동률 포함) 11, 중간 13)

###### hiring-general (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| hiring-general | b (정답) | 안 되는 이유를 설명하고, 정책 안에서 가능한 다른 방법을 제안한다. / Explains why not, and offers another option that policy does allow. | 안 되는 이유와 함께 정책 안의 다른 방법을 제안한다. / Explains why not, along with another option within policy. | — |
| hiring-general | c | 고객이 원하니 규정과 다르게 처리해 주겠다고 한다. / Promises to handle it outside the rules because the customer wants it. | 고객 만족이 우선이니, 이번 한 번만 규정과 다르게 처리해 주겠다고 한다. / Puts customer satisfaction first and promises to make an exception to the rules just this once. | — |

길이(ko): a=19, b=30, c=41 (정답 b) — 전: a=19, b=38, c=28

###### hiring-tech (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| hiring-tech | a | 가장 흔한 해결법 하나를 바로 안내하고 끝낸다. / Gives the single most common fix right away and stops there. | 통화를 끌지 않으려고, 가장 흔한 해결법 하나를 바로 안내하고 끝낸다. / Gives the single most common fix right away to keep the call short, and stops there. | — |
| hiring-tech | b (정답) | 증상과 발생 조건을 먼저 묻고, 가능한 원인을 하나씩 확인한다. / Asks about the symptom and when it happens first, then checks possible causes one by one. | 증상과 발생 조건부터 묻고, 원인을 하나씩 좁힌다. / Asks about the symptom and when it happens, then narrows down causes one by one. | — |

길이(ko): a=39, b=28, c=18 (정답 b) — 전: a=26, b=35, c=18

###### hiring-general-2 (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| hiring-general-2 | a | A — 빠른 입력이 처리 시간을 줄인다. / A — fast entry cuts handle time. | A — 빠른 입력이 처리 시간을 줄이고, 대화는 교육으로 늘릴 수 있다. / A — fast entry cuts handle time, and conversation can be built in training. | 빠른 입력은 온보딩에서 기를 수 있지만, 대화하며 공감하는 성향은 교육으로 바꾸기 어렵습니다. / Fast typing can be built in onboarding, but a temperament for conversation and empathy is hard to change through training. |
| hiring-general-2 | b | 둘 다 탈락시키고 다시 뽑는다. / Reject both and start again. | 둘 다 아쉬우니 탈락시키고, 두 가지를 다 갖춘 지원자를 다시 찾는다. / Reject both as falling short, and look again for a candidate who has both. | — |
| hiring-general-2 | c (정답) | B — 폭넓은 문의를 다루는 대화력과 공감은 가르치기 어렵다. / B — conversational range and empathy across many inquiries are hard to teach. | B — 대화력과 공감은 가르치기 어렵다. / B — conversational range and empathy are hard to teach. | — |

길이(ko): a=40, b=39, c=22 (정답 c) — 전: a=22, b=17, c=34

###### hiring-tech-2 (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| hiring-tech-2 | b (정답) | 고객에게 보낼 해결 안내 메일을 직접 쓰게 하고, 따라 하기 쉬운 말로 단계를 설명했는지 본다. / Have them write the solution email they would send a customer, and check whether the steps are explained in words that are easy to follow. | 해결 안내 메일을 직접 쓰게 하고, 따라 하기 쉬운지 본다. / Have them write a solution email and check whether it is easy to follow. | — |
| hiring-tech-2 | c | 기술 용어 시험 점수만 본다. / Look only at a technical vocabulary test score. | 기술 용어 필기시험을 넣어, 용어를 정확히 아는 지원자를 가려낸다. / Add a written technical vocabulary test to pick out candidates who know the terms precisely. | — |

길이(ko): a=21, b=33, c=37 (정답 b) — 전: a=21, b=53, c=16

###### onboarding-general (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| onboarding-general | a | 전부 외울 때까지 교육 기간을 늘린다. / Extend training until everything is memorized. | 틀린 안내를 막으려고, 전부 외울 때까지 교육 기간을 늘린다. / Extend training until everything is memorized, to prevent wrong answers. | — |
| onboarding-general | b (정답) | 자주 들어오는 문의 유형부터 응대 흐름으로 익히게 하고, 나머지는 찾아보는 법을 가르친다. / Teach the most common inquiry types as handling flows first, and teach how to look up the rest. | 자주 오는 문의 흐름부터 익히고, 나머지는 찾는 법을 가르친다. / Teach the common inquiry flows first, and how to look up the rest. | — |
| onboarding-general | c | 실전에서 겪으면서 배우라고 한다. / Tell them to learn it by going through it on live calls. | 교육은 핵심만 짧게 하고, 나머지는 실전에서 겪으면서 배우라고 한다. / Keep training to the essentials and let them learn the rest on live contacts. | 찾아보는 법도 모른 채 실전에서 배우게 하면, 틀린 안내가 고객에게 그대로 전해집니다. / Learning on live contacts without knowing how to look things up passes wrong information straight to customers. |

길이(ko): a=34, b=35, c=38 (정답 b) — 전: a=21, b=50, c=18

###### onboarding-tech (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| onboarding-tech | a | 해결했으니 기록은 넘어간다. / The problem was solved, so let the notes go. | 해결이 더 중요하니, 기록은 한 줄이라도 남겼으면 넘어간다. / Solving is what matters, so as long as there is a line in the ticket, let it go. | — |
| onboarding-tech | b (정답) | 다음 사람이 읽고 이어받을 수 있게 증상, 확인한 것, 조치를 남기는 연습을 시킨다. / Have her practice recording the symptom, what she checked, and what she did, so the next person can pick it up. | 증상, 확인한 것, 조치를 남기는 연습을 시킨다. / Have her practice recording the symptom, what she checked, and what she did. | — |

길이(ko): a=33, b=27, c=18 (정답 b) — 전: a=15, b=47, c=18

###### onboarding-general-2 (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| onboarding-general-2 | b | 바로 탈락시킨다. / Fail her on the spot. | 틀린 안내는 기준 미달이니, 바로 탈락시킨다. / Wrong information is below the standard, so drop her right away. | — |
| onboarding-general-2 | c (정답) | 틀린 부분을 보충 교육한 뒤 그 유형으로 다시 평가한다. / Give extra training on what was wrong, then reassess her on that type. | 보충 교육 뒤 그 유형으로 다시 평가한다. / Give extra training, then reassess her on that type. | — |

길이(ko): a=27, b=25, c=23 (정답 c) — 전: a=27, b=9, c=31

###### onboarding-tech-2 (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| onboarding-tech-2 | b (정답) | 바뀐 부분을 지식 자료에서 찾아 확인하는 법을 함께 익히게 한다. / Have the trainees practice finding and checking the changed parts in the knowledge base. | 바뀐 부분을 지식 자료에서 찾는 법을 익히게 한다. / Have the trainees practice finding the changes in the knowledge base. | — |
| onboarding-tech-2 | c | 업데이트가 안정될 때까지 교육을 멈춘다. / Pause training until the update settles. | 틀린 내용을 가르치지 않도록, 업데이트가 안정될 때까지 교육을 멈춘다. / Pause training until the update settles, so nothing wrong gets taught. | — |

길이(ko): a=27, b=28, c=39 (정답 b) — 전: a=27, b=36, c=22

###### nesting-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nesting-q1 | a | 정식 상담사와 같은 AHT 목표를 바로 적용한다. / Apply the same AHT target as regular agents right away. | 팀 평균과 차이가 크니, 정식 상담사와 같은 AHT 목표를 바로 적용한다. / The gap from the team average is large, so apply the regular agents' AHT target right away. | — |
| nesting-q1 | b (정답) | 정확한 안내를 칭찬하고, 속도는 적응한 뒤에 다루겠다고 알려 준다. / Praise the accuracy and tell her that speed can wait until she has settled in. | 정확성을 칭찬하고, 속도는 적응한 뒤에 다루자고 한다. / Praise her accuracy and say speed can wait until she settles in. | — |

길이(ko): a=41, b=30, c=29 (정답 b) — 전: a=27, b=37, c=29

###### nesting-general (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nesting-general | a | 좋은 경험이니 끝까지 혼자 하게 둔다. / It is good experience, so leave her to finish it alone. | 부딪혀 봐야 빨리 느니, 끝까지 혼자 처리하게 둔다. / People learn fastest by facing it, so leave her to finish it alone. | — |
| nesting-general | b (정답) | 직무전문가가 옆에서 함께 처리하고, 그 유형은 준비된 뒤에 맡긴다. / Have the SME handle it with her, and assign that type once she is ready. | 직무전문가가 함께 처리하고, 그 유형은 준비된 뒤 맡긴다. / Have the SME handle it with her, and assign that type once she is ready. | — |
| nesting-general | c | 제대로 못 하면 지민의 실수로 기록한다. / If it goes badly, record it as Jimin’s mistake. | 어디서 막혔는지 알 수 있게, 처리 결과를 지민의 평가 기록에 남긴다. / Record the outcome in Jimin's performance record so you can see where she got stuck. | 아직 맡기지 않은 유형에서 생긴 일은 지민의 실수가 아니라 배정의 문제라, 평가에 남길 일이 아닙니다. / What happens on a type she has not been assigned yet is an assignment problem, not Jimin's mistake, so it does not belong in her evaluation. |

길이(ko): a=29, b=32, c=39 (정답 b) — 전: a=21, b=37, c=22

###### nesting-tech (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nesting-tech | a | 스스로 해결할 때까지 기다린다. / Wait until she solves it herself. | 스스로 원인을 찾아야 실력이 느니, 해결할 때까지 기다려 준다. / Finding the cause herself is how she grows, so wait until she solves it. | — |
| nesting-tech | b (정답) | 에스컬레이션 기준을 다시 짚어 주고, 확인한 내용을 기록해 상위 단계로 넘기게 한다. / Go over the escalation criteria again, and have her document what she checked and escalate. | 넘기는 기준을 짚어 주고, 확인한 내용을 적어 넘기게 한다. / Go over the escalation criteria, and have her note what she checked and escalate. | — |
| nesting-tech | c | 대신 받아서 조용히 처리한다. / Take it over and resolve it quietly. | 고객을 더 기다리게 할 수 없으니, 대신 받아서 조용히 처리한다. / The customer cannot wait any longer, so take it over and resolve it quietly. | — |

길이(ko): a=35, b=33, c=36 (정답 b) — 전: a=17, b=47, c=16

###### nesting-general-2 (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nesting-general-2 | b (정답) | 변경 문의부터 범위를 넓히고, 직무전문가가 계속 들으며 지원한다. / Widen her range starting with change requests, with the SME still listening in to support her. | 변경 문의로 범위를 넓히고, 직무전문가가 계속 들으며 돕는다. / Widen her range to change requests, with the SME still listening in to help. | — |
| nesting-general-2 | c | 실수가 없으니 지금 유형만 계속 맡긴다. / She makes no mistakes, so keep her on the same types. | 자신감을 지키도록, 실수 없는 지금 유형만 당분간 계속 맡긴다. / To protect her confidence, keep her on the types she handles without mistakes for now. | — |

길이(ko): a=18, b=34, c=35 (정답 b) — 전: a=18, b=36, c=22

###### nesting-tech-2 (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nesting-tech-2 | a (정답) | 넘기기 전에 해 볼 확인 단계와 넘기는 기준을 함께 다시 짚어 준다. / Go over with her the checks to try before passing a ticket on, and the criteria for passing it. | 넘기기 전 확인 단계와 넘기는 기준을 다시 짚어 준다. / Go over the checks to try before passing a ticket on, and the criteria for passing it. | — |
| nesting-tech-2 | b | 넘기는 것을 금지하고 혼자 해결하게 한다. / Ban passing tickets on and make her solve them alone. | 혼자 푸는 힘을 기르도록, 넘기는 것을 금지하고 혼자 해결하게 한다. / Ban passing tickets on so she builds the ability to solve them alone. | — |
| nesting-tech-2 | c | 신입이니 그대로 둔다. / She is new, so leave it. | 신입에게는 넘기는 쪽이 안전하니, 익숙해질 때까지 그대로 둔다. / Passing tickets on is the safe choice for someone new, so leave it until she gets used to the work. | — |

길이(ko): a=30, b=38, c=35 (정답 a) — 전: a=38, b=23, c=12

###### coaching-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| coaching-q1 | a | "통화가 너무 깁니다. 다음 달까지 줄이세요." / “Your calls are too long. Bring them down by next month.” | "통화가 너무 깁니다. 다음 달까지 팀 평균 수준으로 줄여 주세요." / “Your calls are too long. Please bring them down to the team average by next month.” | — |
| coaching-q1 | b (정답) | "해결률이 높은 게 강점이에요. 본인 확인 단계에서 시간이 길어지는데, 어떻게 줄여 볼까요?" / “Your first-contact resolution is a strength. Your time runs long at the identity check; how could we shorten it?” | "해결률이 강점이에요. 본인 확인 단계는 어떻게 줄여 볼까요?" / “Your resolution rate is a strength. How could we shorten the identity check?” | — |
| coaching-q1 | c | "다른 분들은 다 목표를 맞추고 있어요." / “Everyone else is hitting the target.” | "다른 분들은 다 목표를 맞추고 있어요. 지민 님도 할 수 있어요." / “Everyone else is hitting the target. You can do it too, Jimin.” | — |

길이(ko): a=38, b=35, c=38 (정답 b) — 전: a=26, b=52, c=23

###### coaching-general (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| coaching-general | a | 친절했으니 넘어간다. / She was courteous, so let it pass. | 친절도가 높았으니, 이번 콜은 칭찬하고 넘어간다. / Courtesy was high, so praise this call and move on. | — |
| coaching-general | b (정답) | 공감 표현을 칭찬하고, 틀린 안내는 맞는 내용과 말할 문장까지 짚어 준다. / Praise the empathy, then go over the wrong information with the correct content and the sentence to say. | 공감을 칭찬하고, 맞는 내용과 말할 문장을 알려 준다. / Praise the empathy, and give her the correct content and the sentence to say. | — |
| coaching-general | c | 틀린 부분만 지적한다. / Point out only what was wrong. | 정확도가 우선이니, 틀린 부분만 짚어 준다. / Accuracy comes first, so point out only what was wrong. | — |

길이(ko): a=27, b=30, c=24 (정답 b) — 전: a=11, b=41, c=12

###### coaching-tech (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| coaching-tech | a | 해결 시간이 짧으니 문제없다고 본다. / Resolution time is short, so there is no problem. | 해결 시간이 짧은 건 강점이니, 다른 팀원에게 노하우를 공유하게 한다. / A short resolution time is a strength, so have them share their know-how with the team. | 같은 문의가 다시 들어온다면 해결되지 않은 채 닫힌 것이라, 공유할 노하우가 아닙니다. / If the same issue comes back, the ticket was closed without being solved; that is not know-how to share. |
| coaching-tech | b (정답) | 진단 과정을 녹취, 채팅 로그, 이메일 로그와 티켓 기록으로 확인하고, 건너뛴 확인 단계를 코칭한다. / Review the diagnostic process through call recordings, chat logs, email logs, and ticket notes, and coach the checks that were skipped. | 녹취·로그·티켓 기록으로 진단 과정을 보고, 건너뛴 단계를 코칭한다. / Review the diagnosis through recordings, logs, and ticket notes, and coach the skipped steps. | — |
| coaching-tech | c | 에스컬레이션을 더 많이 하라고 한다. / Tell them to escalate more often. | 재문의를 줄이도록, 확실하지 않은 티켓은 에스컬레이션을 더 하라고 한다. / To cut repeat contacts, tell them to escalate more often whenever they are unsure. | — |

길이(ko): a=39, b=38, c=40 (정답 b) — 전: a=20, b=56, c=20

###### coaching-general-2 (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| coaching-general-2 | a | 팀장 점수를 따른다. / Go with the team leader’s score. | 팀원을 가장 잘 아는 사람이니, 팀장 점수를 공식 점수로 따른다. / The team leader knows the agent best, so use the team leader's score as the official one. | — |
| coaching-general-2 | b | 두 점수의 평균을 낸다. / Average the two scores. | 어느 쪽도 틀리지 않았으니, 두 점수의 평균을 공식 점수로 삼는다. / Neither is wrong, so make the average of the two the official score. | — |
| coaching-general-2 | c (정답) | 캘리브레이션에서 공감과 정책 안내를 각각 어떻게 볼지 기준을 맞춘다. / In calibration, agree how to score empathy and policy information separately. | 캘리브레이션에서 두 항목의 채점 기준을 맞춘다. / In calibration, align how each of the two items is scored. | — |

길이(ko): a=36, b=37, c=26 (정답 c) — 전: a=11, b=13, c=38

###### coaching-tech-2 (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| coaching-tech-2 | a | 비율을 낮추라고만 말한다. / Just tell them to bring the rate down. | 다음 달까지 비율을 낮추라고 한다. / Tell them to bring the rate down by next month. | — |
| coaching-tech-2 | b (정답) | 넘긴 티켓 몇 건을 함께 보며 진단 과정의 어디에서 멈췄는지 찾는다. / Go through a few of the tickets they passed on and find where the diagnosis stopped. | 넘긴 티켓 몇 건으로 진단이 멈춘 곳을 함께 찾는다. / Go through a few tickets they passed on and find together where the diagnosis stopped. | — |
| coaching-tech-2 | c | 다른 팀원과의 비율을 공개해 비교한다. / Publish everyone’s rate so they can compare. | 비율을 공개해 다른 팀원과 비교하게 한다. / Publish the rates so they can compare with others. | — |

길이(ko): a=19, b=29, c=23 (정답 b) — 전: a=14, b=38, c=21

###### retention-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| retention-q1 | a | 대기 콜이 많으니 바로 다음 콜을 받게 한다. / The queue is long, so have her take the next call right away. | 대기 콜이 밀려 있으니, 다음 콜을 받게 하고 끝난 뒤에 이야기한다. / The queue is long, so have her take the next call and talk afterward. | — |
| retention-q1 | b (정답) | 잠시 자리를 벗어나 쉬게 하고, 끊은 판단이 맞았다고 말해 준다. / Let her step away for a short break and tell her that ending the call was the right decision. | 잠시 쉬게 하고, 끊은 판단이 맞았다고 말해 준다. / Give her a short break and tell her ending the call was the right decision. | — |

길이(ko): a=38, b=28, c=19 (정답 b) — 전: a=25, b=36, c=19

###### retention-general (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| retention-general | a | 누구나 겪는 일이라고 말하고 넘긴다. / Tell her everyone goes through it and move on. | 누구나 겪는 일이라며 다독이고 넘긴다. / Reassure her that everyone goes through it, and move on. | — |
| retention-general | b (정답) | 이야기를 듣고, 맡는 문의 유형을 넓히거나 바꿀 방법을 함께 찾는다. / Listen, and look together for ways to widen or change the inquiry types she handles. | 듣고, 문의 유형을 넓히거나 바꿀 방법을 함께 찾는다. / Listen, and look together for ways to widen or change her inquiry types. | — |
| retention-general | c | 성과급 이야기만 한다. / Talk only about the performance bonus. | 성과급과 포상 기준을 다시 설명해 준다. / Explain the bonus and award criteria again. | — |

길이(ko): a=21, b=30, c=22 (정답 b) — 전: a=20, b=38, c=12

###### retention-tech (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| retention-tech | b (정답) | 근무 일정 안에 학습 시간을 나눠 잡고, 그 시간을 지켜 준다. / Schedule learning time in slots within working hours, and protect it. | 근무 안에 학습 시간을 잡고, 그 시간을 지켜 준다. / Schedule learning time within working hours, and protect it. | — |
| retention-tech | c | 출시 후 티켓을 받으면서 익히게 한다. / Let them learn by taking tickets after launch. | 실제 티켓으로 배우는 게 가장 빠르니, 출시 후 티켓을 받으며 익히게 한다. / Real tickets teach fastest, so let them learn by taking tickets after launch. | — |

길이(ko): a=17, b=29, c=42 (정답 b) — 전: a=17, b=35, c=21

###### retention-general-2 (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| retention-general-2 | a (정답) | 근무 시간 안에 짧게 모여 힘들었던 콜을 이야기하고, 심리 상담 프로그램(EAP)을 안내한다. / Gather briefly during working hours to talk through the hard calls, and point people to the employee assistance program (EAP). | 근무 중 짧게 모여 힘든 콜을 나누고, 심리 상담(EAP)을 안내한다. / Gather briefly during work to talk through the hard calls, and point people to the EAP. | — |
| retention-general-2 | b | 다들 겪는 일이니 내일 다시 하자고 한다. / Everyone goes through it, so say you will start fresh tomorrow. | 다들 겪는 일이니, 따로 이야기 없이 내일 새로 시작하자고 한다. / Everyone goes through it, so skip any talk and say you will start fresh tomorrow. | — |
| retention-general-2 | c | 가장 지친 사람만 따로 불러 실적 이야기를 한다. / Call in only the most exhausted person and talk about performance. | 가장 지친 사람을 따로 불러, 오늘 실적이 떨어진 이유를 함께 짚어 본다. / Call in the most exhausted person and go over why their numbers dropped today. | — |

길이(ko): a=39, b=36, c=41 (정답 a) — 전: a=52, b=23, c=27

###### retention-tech-2 (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| retention-tech-2 | a | 실력이 좋으니 계속 어려운 티켓을 맡긴다. / They are skilled, so keep giving them the hard tickets. | 어려운 티켓은 실력 있는 사람이 맡아야 하니, 지금 배정을 그대로 둔다. / Hard tickets need a skilled person, so keep the current assignments as they are. | — |
| retention-tech-2 | b (정답) | 어려운 티켓과 쉬운 티켓을 섞어 배정하고, 해결한 사례를 팀 지식 자료로 정리할 기회를 준다. / Mix hard and easy tickets in their assignments, and give them a chance to write up solved cases for the team knowledge base. | 쉬운 티켓을 섞어 주고, 해결 사례를 지식 자료로 정리하게 한다. / Mix in easier tickets, and have them write up solved cases for the knowledge base. | — |
| retention-tech-2 | c | 당분간 쉬운 티켓만 맡긴다. / Give them only easy tickets for a while. | 지친 상태이니, 회복될 때까지 당분간 쉬운 티켓만 맡겨 부담을 덜어 준다. / They are worn out, so give them only easy tickets until they recover. | — |

길이(ko): a=40, b=36, c=41 (정답 b) — 전: a=23, b=52, c=15

###### career-general (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| career-general | a | 팀장이 아니면 길이 없다고 말한다. / Say there is no path other than team leader. | 관리 경험이 있어야 성장하니, 팀장 길을 다시 생각해 보라고 권한다. / Growth needs management experience, so urge them to reconsider the team leader path. | — |
| career-general | b (정답) | 전문 상담 담당처럼 응대의 깊이를 넓히는 길을 소개한다. / Introduce a path that deepens handling skill, such as specialist support. | 전문 상담처럼 응대의 깊이를 넓히는 길을 소개한다. / Introduce a path that deepens handling skill, such as specialist support. | — |

길이(ko): a=38, b=28, c=16 (정답 b) — 전: a=19, b=31, c=16

###### career-tech (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| career-tech | a | 지금 맡은 범위만 하라고 한다. / Tell them to stay within their current scope. | 1차 지원 인력이 빠지면 안 되니, 지금 맡은 범위만 하라고 한다. / Tier 1 cannot spare anyone, so tell them to stay within their current scope. | — |
| career-tech | b (정답) | 2차 지원에 필요한 역량을 알려 주고, 일부 티켓을 함께 처리해 보게 한다. / Explain the skills Tier 2 requires, and have them try some of those tickets with support. | 필요한 역량을 알려 주고, 2차 티켓 일부를 함께 해 보게 한다. / Explain the skills needed, and have them try some Tier 2 tickets with support. | — |
| career-tech | c | 준비 없이 바로 2차 지원으로 보낸다. / Move them to Tier 2 right away with no preparation. | 의욕이 있을 때 맡겨야 하니, 준비 과정 없이 바로 2차 지원으로 보낸다. / Use the motivation while it lasts and move them to Tier 2 right away, with no preparation. | — |

길이(ko): a=37, b=36, c=41 (정답 b) — 전: a=17, b=42, c=21

###### career-general-2 (track: general)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| career-general-2 | a | 개인 성향 문제로 기록하고 넘긴다. / Record it as a matter of personal temperament and move on. | 성장을 원하는 성향의 사람들이었으니, 개인 성향 문제로 기록하고 넘긴다. / They were people who wanted to grow, so record it as a matter of personal temperament and move on. | — |
| career-general-2 | b | 그달에만 있었던 일로 본다. / Treat it as something that happened only that month. | 그달에 퇴사가 몰렸을 뿐이니, 다음 달 면담 결과를 보고 판단한다. / Departures just clustered that month, so decide after seeing next month's interviews. | — |
| career-general-2 | c (정답) | 문의 유형 순환과 전문 상담 같은 경로를 남아 있는 팀원에게 먼저 보여 주도록 관리 방식을 고친다. / Change how you manage so the people still on the team are shown inquiry rotation and paths such as specialist support up front. | 남은 팀원에게 문의 유형 순환과 전문 상담 경로를 먼저 보여 준다. / Show the people still on the team inquiry rotation and paths such as specialist support up front. | — |

길이(ko): a=40, b=37, c=37 (정답 c) — 전: a=19, b=15, c=55

###### career-tech-2 (track: tech)

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| career-tech-2 | a (정답) | 지식 자료를 만들고 고치는 역할을 맡겨 보고, 그 경로를 함께 이야기한다. / Try giving them the role of creating and updating knowledge base articles, and talk through that path together. | 지식 자료 담당을 맡겨 보고, 그 경로를 함께 이야기한다. / Try giving them the knowledge base role, and talk through that path together. | — |
| career-tech-2 | b | 업무 시간에는 문서를 쓰지 말라고 한다. / Tell them not to write documents during work hours. | 업무 시간에는 문서 대신 상담에 집중하라고 한다. / Tell them to focus on contacts, not documents, during work hours. | — |
| career-tech-2 | c | 문서를 받아 팀장 이름으로 공유한다. / Take the document and share it under the team leader’s name. | 문서를 받아 팀장 이름으로 공유한다. / Take the document and share it under the team leader's name. | — |

길이(ko): a=32, b=27, c=20 (정답 a) — 전: a=41, b=22, c=20

#### 팀장 SOP 라이브러리 (sop)

요약: 고치기 전 "정답이 혼자 가장 긴" 16 / 21 → 고친 뒤 5 / 21 (고친 뒤 정답이 가장 짧음(동률 포함) 8, 중간 8)

###### escalation-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| escalation-q2 | a | 문제가 해결된 뒤에 결과만 적는다. / Only the outcome, written once the problem is solved. | 넘겨받는 사람이 헷갈리지 않게, 해결된 뒤 결과만 깔끔하게 적는다. / Only the outcome, written cleanly once it is solved so the next person is not confused. | — |
| escalation-q2 | b (정답) | 고객의 감정 표현을 포함해 모든 과정을 사실대로 적는다. / The whole exchange as fact, including how the customer expressed their feelings. | 감정 표현까지 포함해 모든 과정을 사실대로 적는다. / The whole exchange as fact, including the customer's expressions of feeling. | — |

길이(ko): a=37, b=28, c=23 (정답 b) — 전: a=19, b=31, c=23

###### scrubbing-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| scrubbing-q2 | a | 팀에서 바로 모두 종료한다. / Close them all right away within the team. | SLA가 더 떨어지기 전에, 팀에서 오늘 바로 모두 종료 처리한다. / Close them all within the team today, before SLA drops any further. | — |
| scrubbing-q2 | b | 그대로 두고 SLA가 떨어졌다고 보고만 한다. / Leave them and only report that SLA has dropped. | 고객 답변을 기다리는 건이니 그대로 두고, SLA 하락 사유로 보고만 한다. / They are waiting on the customer, so leave them and only report them as the reason SLA dropped. | — |
| scrubbing-q2 | c (정답) | 팔로업을 정해진 횟수만큼 한 뒤 종료하는 프로세스를 만들어 고객사에 건의한다. / Build a process that closes them after a set number of follow-ups, and propose it to the client. | 팔로업 횟수를 정해 종료하는 프로세스를 고객사에 건의한다. / Propose to the client a process that closes them after a set number of follow-ups. | — |

길이(ko): a=37, b=42, c=32 (정답 c) — 전: a=15, b=25, c=43

###### coaching-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| coaching-q1 | a | "통화가 긴 이유는 확인 절차가 느려서예요. 고치세요." / "Your calls are long because your checks are slow. Fix that." | "통화가 긴 이유는 확인 절차가 느려서예요. 다음 주까지 고쳐 주세요." / "Your calls are long because your checks are slow. Please fix that by next week." | — |
| coaching-q1 | c | "다른 팀원들은 이만큼 걸리지 않아요." / "The rest of the team does not take this long." | "다른 팀원들은 이만큼 걸리지 않아요. 지민 님도 맞출 수 있을 거예요." / "The rest of the team does not take this long. I'm sure you can match them." | — |

길이(ko): a=40, b=40, c=41 (정답 b) — 전: a=31, b=40, c=22

###### coaching-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| coaching-q2 | a | 고칠 점을 빠짐없이 모두 적는다. / Write down every single thing that needs fixing. | 고칠 점을 빠짐없이 모두 적는다. / Write down every single thing that needs fixing. | — |
| coaching-q2 | b (정답) | 다음 주까지 실천할 수 있는 구체적인 것으로 한두 가지를 함께 정한다. / Agree together on one or two specific actions she can carry out by next week. | 다음 주까지 할 구체적인 행동 한두 가지를 함께 정한다. / Agree together on one or two specific actions for next week. | — |
| coaching-q2 | c | 따로 정하지 않고 다음 달 숫자를 지켜본다. / Set nothing and watch next month's numbers. | 따로 정하지 않고 다음 달 숫자를 지켜본다. / Set nothing and watch next month's numbers. | — |

길이(ko): a=18, b=31, c=24 (정답 b) — 전: a=18, b=39, c=24

###### pip-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| pip-q1 | b (정답) | 분명한 데이터와 구체적인 목표로 개선의 기회를 주는 것. / To give a chance to improve, with clear data and a specific goal. | 데이터와 구체적인 목표로 개선 기회를 주는 것. / To give a chance to improve, with data and a specific goal. | — |
| pip-q1 | c | 다른 팀원에게 경각심을 주는 것. / To send a warning to the rest of the team. | 같은 문제가 번지지 않도록, 다른 팀원에게 경각심을 주는 것. / To send a warning to the rest of the team so the same problem does not spread. | — |

길이(ko): a=14, b=26, c=34 (정답 b) — 전: a=14, b=31, c=18

###### pip-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| pip-q2 | a | "더 친절하게 응대하기." / "Be friendlier with customers." | "고객에게 더 친절하게, 공감 표현을 늘려 응대하기." / "Be friendlier with customers and show more empathy." | — |
| pip-q2 | b (정답) | 예시: "앞으로 4주 동안 CSAT 점수를 5점 올리기." / Example: "Raise the CSAT score by 5 points over the next 4 weeks." | 예시: "4주 동안 CSAT 5점 올리기." / Example: "Raise CSAT by 5 points in 4 weeks." | — |
| pip-q2 | c | "팀에서 가장 좋은 점수 받기." / "Get the best score on the team." | "다음 달까지 팀에서 가장 좋은 CSAT 점수 받기." / "Get the best CSAT score on the team by next month." | — |

길이(ko): a=30, b=24, c=30 (정답 b) — 전: a=14, b=32, c=18

###### calibration-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| calibration-q1 | a | 세션 시간을 줄이기 위해서. / To make the session shorter. | 회의가 길어지지 않도록, 세션 시간을 줄이기 위해서. / To keep the meeting from running long by shortening the session. | — |
| calibration-q1 | b (정답) | 다른 사람의 점수에 영향받지 않은 각자의 기준이 드러나야 차이를 이야기할 수 있어서. / Because the gaps can only be discussed once each person's own standard shows, unaffected by anyone else's score. | 남의 점수에 영향받지 않은 각자의 기준이 드러나야 해서. / Because each person's own standard has to show, unaffected by others' scores. | — |
| calibration-q1 | c | 평가자들의 순위를 매기기 위해서. / To rank the evaluators. | 누가 기준에 가장 가까운지 보고, 평가자들의 순위를 매기기 위해서. / To see who is closest to the standard and rank the evaluators. | — |

길이(ko): a=29, b=31, c=37 (정답 b) — 전: a=15, b=47, c=18

###### calibration-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| calibration-q2 | a | 참고용으로만 남긴다. / It is kept for reference only. | 세션 내용은 참고용으로만 남긴다. / The session is kept for reference only. | — |
| calibration-q2 | b (정답) | 그 케이스의 공식 점수가 되고, 합의한 근거는 기록해 다음 평가의 기준으로 삼는다. / It becomes the official score for the case, and the reasoning is recorded as the reference for later evaluations. | 공식 점수가 되고, 합의 근거는 다음 평가의 기준이 된다. / It becomes the official score, and the reasoning becomes the reference for later evaluations. | — |
| calibration-q2 | c | 직급이 가장 높은 참석자의 점수로 바꾼다. / It is replaced by the score of the most senior person present. | 직급이 가장 높은 참석자의 점수로 바꾼다. / It is replaced by the score of the most senior person present. | — |

길이(ko): a=18, b=32, c=23 (정답 b) — 전: a=11, b=46, c=23

###### transition-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| transition-q2 | a | 친한 사이니 이번에는 넘어간다. / You are close, so let it go this time. | 친한 사이라 팀 분위기를 생각해, 이번 한 번은 조용히 넘어간다. / You are close and care about the team mood, so quietly let it go this once. | — |
| transition-q2 | b (정답) | 다른 팀원과 같은 기준으로, 1:1에서 차분히 이야기한다. / Talk with her calmly in a one-on-one, by the same standard as everyone else. | 다른 팀원과 같은 기준으로, 1:1에서 차분히 말한다. / Talk with her calmly in a one-on-one, by the same standard as everyone else. | — |

길이(ko): a=36, b=30, c=28 (정답 b) — 전: a=17, b=32, c=28

###### onboarding-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| onboarding-q1 | a (정답) | 버디를 지정해 팀에 소개하고, 1:1 미팅으로 첫 주의 어려움을 듣는다. / Assign a buddy, introduce her to the team, and hear what was hard in her first week in a one-on-one. | 버디를 정해 팀에 소개하고, 첫 주 1:1로 어려움을 듣는다. / Assign a buddy, introduce her to the team, and hear her first-week struggles in a one-on-one. | — |
| onboarding-q1 | b | 근로 계약서를 작성하고 장비를 지급한다. / Complete the employment contract and hand over equipment. | 첫날 로그인 문제가 없도록, 근로 계약서 작성과 장비 지급을 직접 챙긴다. / Handle the employment contract and equipment yourself so there are no login problems on day one. | — |

길이(ko): a=34, b=41, c=26 (정답 a) — 전: a=40, b=22, c=26

###### nurture-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| nurture-q1 | a | 근속 연수와 하루 콜 수. / Tenure and calls per day. | 근속 연수와 하루 콜 수처럼, 얼마나 꾸준히 일했는지 보여 주는 숫자. / Numbers that show how steadily she has worked, such as tenure and calls per day. | — |
| nurture-q1 | c | 인사말과 말투 점검 결과. / Checks on her greetings and tone. | 인사말과 말투 점검처럼, 응대 기본기를 지켰는지 보여 주는 기록. / Records that show whether she kept to the basics, such as greeting and tone checks. | — |

길이(ko): a=39, b=32, c=36 (정답 b) — 전: a=14, b=32, c=14

###### launch-q1

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| launch-q1 | a (정답) | 초기 인입량 예측과 필요한 인력(FTE) 규모 산정. / A forecast of the initial contact volume and the number of agents (FTE) needed. | 초기 인입량 예측과 필요 인력(FTE) 산정. / A forecast of initial contact volume and the FTE needed. | — |
| launch-q1 | b | 완성된 교육 커리큘럼. / A finished training curriculum. | 몇 명을 가르칠지 보이도록, 완성된 교육 커리큘럼과 일정. / A finished training curriculum and schedule, to show how many people will be taught. | — |
| launch-q1 | c | 구축을 마친 상담 시스템. / A contact system that is fully built. | 자리와 계정 수를 알 수 있도록, 구축을 마친 상담 시스템. / A fully built contact system, so you know how many seats and accounts there are. | — |

길이(ko): a=25, b=32, c=33 (정답 a) — 전: a=29, b=12, c=14

###### launch-q2

| 질문 id | 보기 | 전 (ko / en) | 후 (ko / en) | 피드백 변경 (후 ko / en) |
|---|---|---|---|---|
| launch-q2 | a | 첫 달 성과 데이터가 나올 때까지 기다린다. / Wait until the first month's performance data comes in. | 정확한 판단을 위해, 첫 달 성과 데이터가 나올 때까지 지켜본다. / Watch until the first month's performance data comes in, so you can judge accurately. | — |
| launch-q2 | c (정답) | 매니저와 함께 초기 집중 관리 기간을 운영하며 현장을 밀착 지원한다. / Run the hyper-care period with the OM and support the floor closely. | 매니저와 함께 초기 집중 관리로 현장을 밀착 지원한다. / Run hyper-care with the OM and support the floor closely. | — |

길이(ko): a=36, b=23, c=30 (정답 c) — 전: a=24, b=23, c=38

#### 미룬 작은 지적

| 위치 | 항목 | 전 (ko / en) | 후 (ko / en) | 비고 |
|---|---|---|---|---|
| sop-library/lessons/09-nurture.js 스텝 3 | EN 둘째 문장 | (ko 그대로) / QA gathers quality scores and CSAT, the SME gathers scrubbing records, and WFM gathers handle time and attendance, and they hand them to you. | (ko 그대로) / QA brings quality scores and CSAT, the SME brings scrubbing records, and WFM brings handle time and attendance, all to you. | 뜻 그대로, "and … and they hand them" 겹침 정리 |
| sop-library/lessons/04-calibration.js connection(→ transition) | 연결 문구 | 팀장이 직접 하는 절차가 하나 더 있습니다. 동료들의 팀장이 된 첫 90일을 다루는 다음 레슨, 동료에서 팀장으로입니다. / There is one more procedure a team leader runs directly. The next lesson, From Colleague to Team Leader, covers your first 90 days leading the colleagues you worked beside. | 팀장이 직접 하거나 함께하는 절차가 하나 더 있습니다. 동료들의 팀장이 된 첫 90일을 다루는 다음 레슨, 동료에서 팀장으로입니다. / There is one more procedure a team leader runs or takes part in. The next lesson, From Colleague to Team Leader, covers your first 90 days leading the colleagues you worked beside. | transition 연결 문구 "팀장이 직접 하거나 함께하는 여섯 가지 절차" / "runs or takes part in"과 같은 표현으로 맞춤 |
| sop-library/lessons/04-calibration.js 노드 session | 스텝 이름 | 교정 세션 / Calibration session | 캘리브레이션 세션 / Calibration session | 사이트 용어 "캘리브레이션"으로 통일. 9자라 같은 열의 "후속 조치 및 공유"(9자)와 같아 `wide` 노드 안에 들어감 |
| sop-library/lessons/04-calibration.js 스텝 6 | 캡션 첫 문장 | 셋째 단계는 교정 세션입니다. … / The third step is the calibration session. … | 셋째 단계는 캘리브레이션 세션입니다. … / (EN 그대로) | 노드 이름과 함께 변경. 함께 고칠 곳: agent-lifecycle/tests/sop.test.js:49 의 기대값 '교정 세션' → '캘리브레이션 세션'. 문안 md(docs/superpowers/specs/2026-11-19-sop-library-copy-ko.md:129-130)도 맞추면 좋음. codex/data/daily.js:273 "교정 세션 회의록"은 Codex 범위라 판단만 남김 |
| agent-lifecycle/js/lessons/02-onboarding.js 노드 ready | 노드 이름 | 실전 준비 / Ready | OJT 준비 / Ready for OJT | 다음 단계가 OJT라는 것이 바로 보이고, 수료 뒤 "실전 배치"와 겹치지 않음. 대안: "검증 통과 / Verified" (다만 레슨 3 첫 노드 "스킬 검증 / Verified"와 겹침), "현장 투입 전 / Pre-OJT" |
| agent-lifecycle/js/lessons/02-onboarding.js 스텝 12 | 캡션 첫 문장 | 검증을 통과한 지민은 실전 준비를 마쳤습니다. 다만 … / Having passed verification, Jimin is ready for live work. Still, … | 검증을 통과한 지민은 OJT에 나갈 준비를 마쳤습니다. 다만 … / Having passed verification, Jimin is ready for OJT. Still, … | 노드 이름과 맞춤. 뒷문장("교육장에서 해내는 것과 실제 고객 앞에서…")은 그대로 |
