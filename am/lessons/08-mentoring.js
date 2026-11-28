import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 8. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["teach", "delegate", "help", "learn"];
const flow = ["teach", "delegate", "help", "learn", "teach-delegate", "delegate-help", "help-learn"];

export default {
  id: "mentoring",
  order: 8,
  title: tx("신임 팀장 멘토링과 다음 자리 준비", "Mentoring New Team Leaders and Getting Ready for What's Next"),
  short: tx("멘토링", "Mentoring"),
  subtitle: tx("해 온 일을 가르치고, 매니저의 일을 도우며 배웁니다.", "Teach what you've done, and learn by helping with the manager's work."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("teach", "가르치기", 180, 36, "Teach")),
      wide(node("delegate", "맡기기", 180, 92, "Hand over")),
      wide(node("help", "돕기", 180, 148, "Help")),
      wide(node("learn", "배우기", 180, 204, "Learn")),
    ],
    edges: [edge("teach", "delegate"), edge("delegate", "help"), edge("help", "learn")],
  },
  steps: [
    step(tx("이 레슨의 목적은 시니어 팀장 때 해 온 일을 신임 팀장에게 전하고, 매니저의 일을 도우며 다음 자리를 준비하는 것입니다.", "This lesson is about passing on what you did as a senior team leader to new team leaders, and getting ready for the next role by helping with the manager's work."), flow, procedure, null),
    step(tx("태오 팀장은 팀장이 된 지 한 달째입니다. 팀원 1:1, 근태 관리, 주간 보고가 한꺼번에 몰려 저녁마다 늦게까지 남습니다.", "Taeo has been a team leader for a month. Agent 1:1s, attendance and the weekly report all pile up at once, and he stays late every evening."), flow, [], null),
    step(tx("첫 단계는 가르치기입니다. 민석은 시니어 팀장 때 쓰던 주간 일정표와 1:1 메모 양식을 태오와 함께 보며, 언제 무엇을 하는지 보여 줍니다.", "The first stage is teaching. Minseok goes through the weekly schedule and 1:1 note template he used as a senior team leader with Taeo, showing when to do what."), flow, ["teach"], null),
    step(tx("둘째 단계는 맡기기입니다. 가르친 뒤에는 태오가 직접 해 보게 하고, 민석은 결과만 함께 봅니다. 대신 해 주면 그 주는 편하지만, 태오는 다음 주에도 같은 곳에서 막힙니다.", "The second stage is handing over. After teaching, he lets Taeo do it himself and only reviews the results with him. Doing it for him makes that week easier, but Taeo gets stuck in the same place next week."), flow, ["delegate"], null),
    step(tx("매주 30분(예시) 정해진 멘토링 시간을 잡고, 태오가 막힌 일을 하나씩 가져오게 합니다. 연차가 쌓인 수진과 유키에게는 태오와 사례를 나눠 달라고 부탁합니다.", "He sets a fixed 30-minute (Example) mentoring slot each week, and has Taeo bring one thing he's stuck on each time. He asks Sujin and Yuki, the experienced team leaders, to share cases with Taeo."), flow, ["delegate"], null),
    step(tx("셋째 단계는 돕기입니다. 민석은 정은 매니저의 일을 조금씩 나눠 맡습니다. 리뷰 자료의 한 장을 직접 발표해 보고, 인력 계획 회의에 함께 들어가 숫자가 정해지는 과정을 봅니다.", "The third stage is helping. Minseok takes on bits of Jeongeun's work. He presents one page of the review materials himself, and sits in on headcount planning meetings to see how the numbers get decided."), flow, ["help"], null),
    step(tx("넷째 단계는 배우기입니다. 매니저와의 1:1에서 이번 달 무엇을 배웠는지, 다음 달 무엇을 맡아 볼지 정합니다. 언젠가 매니저가 되든 다른 곳으로 옮기든, 이 기록이 다음 자리를 위한 준비가 됩니다.", "The fourth stage is learning. In his 1:1 with the manager, they settle what he learned this month and what he'll take on next month. Whether he becomes a manager one day or moves elsewhere, this record is his preparation for the next role."), flow, ["learn"], null),
    step(tx("미소의 한마디: 신임 팀장을 도와준다고 제가 다 해 줬더니, 그 팀장은 반년이 지나도 혼자 서지 못했어요. 가르치고, 맡기고, 결과만 함께 보세요.", "A word from Miso: I once did everything for a new team leader to help, and half a year later that team leader still couldn't stand alone. Teach, hand it over, and just review the results together."), flow, ["learn"], null),
  ],
  checkpoint: [
    {
      id: "mentoring-q1",
      prompt: tx("신임 팀장 태오가 주간 보고를 매번 마감 직전에 내고, 내용도 자주 빠집니다. 어떻게 할까요?", "Taeo, the new team leader, always turns in the weekly report at the last minute, often with things missing. What does Minseok do?"),
      options: [
        option("a", tx("이번 달만 민석이 대신 써 주고, 다음 달부터 맡긴다.", "Write it for him just this month, and hand it over from next month."), tx("대신 써 주면 태오가 무엇이 빠졌는지 배우지 못합니다.", "Writing it for him means Taeo never learns what was missing.")),
        option("b", tx("쓰던 양식으로 가르치고, 태오가 쓴 보고를 멘토링 때 같이 본다.", "Teach him with the template he used, and go over Taeo's report together in their mentoring time.")),
        option("c", tx("마감을 지키지 못하면 다른 팀장들에게 알리겠다고 단호하게 말한다.", "Tell him firmly that if he misses the deadline, the other team leaders will hear about it."), tx("압박만으로는 무엇을 어떻게 해야 하는지 알 수 없습니다. 방법을 먼저 보여 줍니다.", "Pressure alone doesn't show what to do or how. Show the method first.")),
      ],
      answer: "b",
      explanation: tx("가르치고, 직접 해 보게 하고, 결과를 함께 봅니다.", "Teach, let him try it himself, and review the results together."),
    },
    {
      id: "mentoring-q2",
      prompt: tx("민석이 다음 자리를 준비하는 방법으로 가장 알맞은 것은 무엇일까요?", "What is the best way for Minseok to get ready for the next role?"),
      options: [
        option("a", tx("매니저가 맡는 일은 승진한 뒤에 배우고, 지금은 팀장 관리에만 집중한다.", "Learn the manager's work after a promotion, and for now focus only on managing team leaders."), tx("그 자리에 앉은 뒤 처음 배우면 늦습니다. 지금 조금씩 맡아 보는 것이 준비입니다.", "Learning it only once you're in the seat is too late. Taking bits on now is the preparation.")),
        option("b", tx("매니저의 일을 조금씩 맡고, 1:1에서 배운 것과 다음에 맡을 것을 정한다.", "Take on bits of the manager's work, and settle in their 1:1s what he learned and what to take on next.")),
        option("c", tx("자격증과 외부 리더십 과정부터 따 두고, 지금 맡은 일은 그대로 한다.", "Get certifications and an outside leadership course first, and keep his current work as it is."), tx("자격과 과정도 도움이 되지만, 매니저의 일을 실제로 해 보는 경험을 대신하지는 못합니다.", "Certificates and courses help, but they can't replace actually doing part of the manager's work.")),
      ],
      answer: "b",
      explanation: tx("매니저와 함께 범위를 정해 일을 나눠 맡고, 배운 것을 기록하며 준비합니다.", "Agree the scope with the manager, take on part of the work, and keep a record of what you learn."),
    },
  ],
  connection: { to: "home", text: tx("부매니저 첫걸음을 마쳤습니다. 막히는 순간이 오면 목록으로 돌아와 그 레슨을 다시 펼쳐 보세요.", "You've finished AM First Steps. When you hit a hard moment, come back to the list and open that lesson again.") },
};
