import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 7. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["takeover", "stepin", "check", "handback"];
const flow = ["takeover", "stepin", "check", "handback", "takeover-stepin", "stepin-check", "check-handback"];

export default {
  id: "cover",
  order: 7,
  title: tx("매니저 부재 시 대행", "Covering for the Manager"),
  short: tx("대행", "Covering"),
  subtitle: tx("고객사 미팅에 대신 들어가고, 정할 수 없는 것은 확인 뒤 답합니다.", "Sit in on client meetings, and answer after checking what you can't decide."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("takeover", "넘겨받기", 180, 36, "Take over")),
      wide(node("stepin", "대신 들어가기", 180, 92, "Step in")),
      wide(node("check", "확인 뒤 답하기", 180, 148, "Check, then answer")),
      wide(node("handback", "돌려주기", 180, 204, "Hand back")),
    ],
    edges: [edge("takeover", "stepin"), edge("stepin", "check"), edge("check", "handback")],
  },
  steps: [
    step(tx("이 레슨의 목적은 매니저가 자리를 비운 동안 그 자리를 대신하되, 정할 수 있는 것과 없는 것을 가리는 것입니다.", "This lesson is about filling in while the manager is away, and telling what you can decide from what you can't."), flow, procedure, null),
    step(tx("정은 매니저가 다음 주 휴가(예시)를 갑니다. 그 주에는 고객사와의 주간 미팅이 있고, 민석이 대신 들어갑니다.", "Jeongeun is on leave next week (Example). There's a weekly meeting with the client that week, and Minseok goes in her place."), flow, [], null),
    step(tx("첫 단계는 넘겨받기입니다. 휴가 전에 매니저와 진행 중인 일, 고객사와 약속한 것, 민석이 정해도 되는 것과 매니저에게 물어야 하는 것을 적어 둡니다. 급한 일이 생기면 연락할 방법도 정합니다.", "The first stage is taking over. Before her leave, they write down the work in progress, what has been promised to the client, and what Minseok may decide versus what he must ask her. They also agree how to reach her if something urgent comes up."), flow, ["takeover"], null),
    step(tx("둘째 단계는 대신 들어가기입니다. 민석은 지난 미팅 기록과 이번 주 숫자를 미리 읽고, 마켓 팀장들과 함께 미팅에 들어갑니다. 진행은 평소처럼 하되, 자리에 없는 매니저의 생각을 짐작해서 말하지 않습니다.", "The second stage is stepping in. Minseok reads the last meeting's notes and this week's numbers ahead of time, and goes into the meeting with the market TLs. He runs it as usual, but doesn't guess at what the absent manager would say."), flow, ["stepin"], null),
    step(tx("셋째 단계는 확인 뒤 답하기입니다. 미팅에서 고객사가 다음 달 인원을 늘려 줄 수 있느냐고 묻습니다. 고객사에 인원을 늘려 주겠다는 약속은 계약과 비용이 걸린 일이므로, 민석은 매니저와 확인해 정해진 날까지 답하겠다고 말합니다.", "The third stage is checking, then answering. In the meeting, the client asks whether the center can add people next month. Promising the client more people touches the contract and costs, so Minseok says he'll check with her and answer by a set date."), flow, ["check"], null),
    step(tx("미팅이 끝나면 민석은 그날 바로 매니저에게 요약과 확인이 필요한 질문을 보냅니다. 매니저의 답을 받아 약속한 날 고객사에 전달합니다.", "Right after the meeting, he sends Jeongeun a summary and the questions that need her decision. He takes her answers and passes them to the client on the promised day."), flow, ["check"], null),
    step(tx("넷째 단계는 돌려주기입니다. 매니저가 돌아오면 그 주에 있었던 일, 고객사와 새로 약속한 것, 아직 남은 질문을 한 번에 넘깁니다.", "The fourth stage is handing back. When the manager returns, he hands over in one go what happened that week, any new promises to the client and the questions still open."), flow, ["handback"], null),
    step(tx("미소의 한마디: 처음 대행할 때 고객사 앞에서 뭐라도 답해야 할 것 같았어요. 확인하고 답하겠다는 말이 오히려 믿음을 준다는 걸 그때 배웠어요.", "A word from Miso: The first time I covered, I felt I had to answer something in front of the client. That's when I learned that saying I'd check and get back actually builds trust."), flow, ["handback"], null),
  ],
  checkpoint: [
    {
      id: "cover-q1",
      prompt: tx("정은 매니저 대신 들어간 주간 미팅에서, 고객사가 다음 달 인원을 열 명(예시) 늘려 줄 수 있느냐고 묻습니다. 어떻게 할까요?", "Covering Jeongeun's weekly meeting, Minseok is asked by the client whether the center can add ten people (Example) next month. What does he do?"),
      options: [
        option("a", tx("고객사와의 관계를 생각해 그 자리에서 바로 가능하다고 답해 둔다.", "With the client relationship in mind, say right there that it can be done."), tx("고객사에 인원을 늘려 주는 약속은 계약과 비용이 걸린 매니저의 결정입니다. 대신 약속하면 되돌리기 어렵습니다.", "Promising the client more people is the manager's decision, tied to the contract and costs. A promise made in her place is hard to take back.")),
        option("b", tx("민석은 대행일 뿐이므로 매니저가 돌아온 뒤 미팅에서 다루자고 한다.", "Say he's only covering, and suggest taking it up at the meeting after the manager returns."), tx("일주일을 미루면 고객사의 계획이 늦어집니다. 매니저와 확인해 날짜를 정해 답할 수 있습니다.", "Putting it off a week delays the client's plans. He can check with the manager and answer by a set date.")),
        option("c", tx("매니저와 확인해 정한 날까지 답하겠다고 하고, 그날 바로 묻는다.", "Say he'll check with the manager and answer by a set date, then ask her that same day.")),
      ],
      answer: "c",
      explanation: tx("대행 중에도 매니저가 정할 일은 약속하지 않고, 확인할 날짜를 정해 답합니다.", "Even when covering, don't promise what the manager decides; set a date to check and answer."),
    },
    {
      id: "cover-q2",
      prompt: tx("매니저가 휴가를 가기 전에 꼭 넘겨받아야 하는 것은 무엇일까요?", "What must Minseok take over before the manager goes on leave?"),
      options: [
        option("a", tx("진행 중인 일과 고객사와의 약속, 민석이 정해도 되는 것의 범위", "Work in progress, promises to the client, and what he may decide himself")),
        option("b", tx("고객사 담당자 연락처와 매니저가 쓰던 주간 보고서 양식", "The client contacts' details and the weekly report template the manager uses"), tx("양식과 연락처는 필요할 때 찾으면 됩니다. 진행 중인 약속을 모르면 고객사에 다른 말을 하게 됩니다.", "Templates and contacts can be found when needed. Without knowing the promises in progress, you'll tell the client something different.")),
        option("c", tx("매니저가 돌아올 때까지 미뤄 두어도 되는 일과 그 이유를 적은 목록", "A list of what can wait until the manager returns, with the reasons why"), tx("미룰 일만 알아서는 대신할 수 없습니다. 무엇을 정해도 되는지가 먼저입니다.", "Knowing only what can wait isn't enough to cover. What you may decide comes first.")),
      ],
      answer: "a",
      explanation: tx("진행 중인 일과 약속, 그리고 대행이 정해도 되는 범위를 미리 정해 둡니다.", "Agree in advance on the work in progress, the promises and what the cover may decide."),
    },
  ],
  connection: { to: "mentoring", text: tx("대행은 다음 자리를 미리 해 보는 시간이기도 합니다. 마지막으로 신임 팀장 멘토링과 다음 자리 준비를 봅니다.", "Covering is also a chance to try the next role. Last, mentoring new TLs and getting ready for what's next.") },
};
