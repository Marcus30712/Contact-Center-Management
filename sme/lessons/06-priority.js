import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 6. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["urgent", "tell", "hand", "call"];
const flow = [...procedure, "urgent-tell", "tell-hand", "hand-call"];

export default {
  id: "priority",
  order: 6,
  title: tx("요청이 동시에 몰릴 때", "When Requests Pile Up at Once"),
  short: tx("우선순위", "Priorities"),
  subtitle: tx("기다리는 고객부터, 아무도 버려졌다고 느끼지 않게.", "Waiting customers first, and nobody left feeling dropped."),
  procedure,
  diagram: {
    nodes: [
      wide(node("urgent", "급한 것 먼저", 180, 36, "Urgent first")),
      wide(node("tell", "기다림 알리기", 180, 92, "Say when")),
      wide(node("hand", "나눠 맡기기", 180, 148, "Hand off")),
      wide(node("call", "팀장 부르기", 180, 204, "Call the TL")),
    ],
    edges: [edge("urgent", "tell"), edge("tell", "hand"), edge("hand", "call")],
  },
  steps: [
    step(tx("이 레슨의 목적은 플로어와 온라인에서 요청이 한꺼번에 몰릴 때, 가장 급한 것부터 처리하고 아무도 버려졌다고 느끼지 않게 하는 것입니다.", "This lesson is about handling the most urgent requests first when they pile up on the floor and online, without anyone feeling dropped."), flow, procedure, null),
    step(tx("오전 11시(예시)입니다. 서준이 손을 들었고, 지민의 메신저가 깜박이고, 준호는 승인을 요청했고, 팀 채팅방에는 질문 두 개가 올라와 있습니다.", "It is 11 in the morning (Example). Seojun has his hand up, Jimin's messenger is blinking, Junho has asked for approval, and two questions sit in the team chat."), flow, [], null),
    step(tx("첫 단계는 급한 것 먼저입니다. 기준은 고객이 지금 기다리고 있느냐입니다. 통화 중 보류된 고객, 실시간 채팅 중인 고객의 건이 먼저입니다.", "The first stage is urgent first. The test is whether a customer is waiting right now. A customer on hold during a call, or in a live chat, comes first."), flow, ["urgent"], null),
    step(tx("이메일과 티켓처럼 고객이 실시간으로 기다리지 않는 건, 그리고 일반 질문은 그다음입니다.", "Contacts where the customer is not waiting live, such as emails and tickets, and general questions come next."), flow, ["urgent"], null),
    step(tx("급한 정도가 같다면 감정이 올라간 고객의 건과 신입의 건을 먼저 봅니다. 신입은 고객을 오래 붙잡고 있기 쉽기 때문입니다.", "If two are equally urgent, take the upset customer's case or the new hire's first. New hires tend to keep customers waiting longer."), flow, ["urgent"], null),
    step(tx("둘째 단계는 기다림 알리기입니다. 바로 갈 수 없는 사람에게는 \"2분 뒤에 갈게요\"(예시)처럼 언제 갈지 먼저 알립니다. 답이 없는 것보다 기다릴 시간을 아는 것이 훨씬 낫습니다.", "The second stage is saying when. Tell anyone you can't reach right away when you will come, as in \"I'll be there in 2 minutes\" (Example). Knowing how long to wait is far better than no answer."), flow, ["tell"], null),
    step(tx("셋째 단계는 나눠 맡기기입니다. 일반 질문은 준호 같은 선임 상담사에게 부탁하거나, 지식 베이스 문서 위치만 먼저 보내 줍니다.", "The third stage is handing off. Ask a senior agent like Junho to take general questions, or send just the knowledge base article first."), flow, ["hand"], null),
    step(tx("넷째 단계는 팀장 부르기입니다. 요청이 계속 쌓여 고객 대기가 길어지면 혼자 버티지 말고 팀장에게 알립니다. 팀장이 함께 서포트하거나 RTA와 인원을 조정할 수 있습니다.", "The fourth stage is calling the team leader. If requests keep piling up and customer waits get long, don't hold on alone; tell the team leader. The team leader can help support or adjust staffing with the RTA."), flow, ["call"], null),
    step(tx("플로어와 온라인을 모두 놓치지 않으려면 방법을 정해 둡니다. 센터 규정이 허락하면 플로어를 돌 때도 메신저를 볼 수 있는 기기를 들고 다닙니다.", "Decide how you will keep up with both the floor and online. If center rules allow, carry a device for the messenger while walking the floor."), flow, [], null),
    step(tx("바쁜 시간이 지나면 왜 몰렸는지 돌아봅니다. 같은 질문이 몰렸다면 허들 주제가 되고, 특정 시간대마다 몰린다면 팀장과 서포트 계획을 바꿉니다.", "After the rush, look back at why it piled up. If the same question piled up, it becomes a huddle topic; if it piles up at the same time each day, change the support plan with the team leader."), flow, [], null),
  ],
  checkpoint: [
    {
      id: "priority-q1",
      prompt: tx("통화 중 고객을 보류해 둔 서준과, 이메일 답변 문구를 확인받고 싶은 지민이 동시에 부릅니다. 어떻게 할까요?", "Seojun, with a customer on hold during a call, and Jimin, who wants an email reply checked, both call you at once. What do you do?"),
      options: [
        option("a", tx("먼저 부른 사람부터 간다.", "Go to whoever called first."), tx("순서보다 고객이 지금 기다리고 있는지가 기준입니다. 보류된 고객은 1분마다 더 지칩니다.", "The test is whether a customer is waiting now, not the order. A customer on hold gets more tired every minute.")),
        option("b", tx("서준에게 먼저 가고, 지민에게는 언제 갈지 알려 준다.", "Go to Seojun first, and tell Jimin when you will come.")),
        option("c", tx("지민의 건이 금방 끝나니 지민부터 처리한다.", "Do Jimin's first, since it will be quick."), tx("금방 끝나도 이메일은 기다릴 수 있습니다. 통화 중인 고객은 기다릴 수 없습니다.", "Even if it is quick, the email can wait. The customer on the call cannot.")),
      ],
      answer: "b",
      explanation: tx("실시간으로 기다리는 고객이 먼저이고, 기다리게 되는 사람에게는 언제 갈지 알립니다.", "Customers waiting live come first, and whoever has to wait hears when you will come."),
    },
    {
      id: "priority-q2",
      prompt: tx("30분째 요청이 계속 쌓이고 고객 대기가 길어지고 있습니다. 알맞은 것은 무엇일까요?", "Requests have kept piling up for 30 minutes and customer waits are getting longer. What fits best?"),
      options: [
        option("a", tx("점심을 미루고 혼자 끝까지 처리한다.", "Skip lunch and handle it all yourself to the end."), tx("혼자 버티는 동안 고객 대기는 더 길어지고, 팀장은 문제가 있다는 것도 모릅니다.", "While you hold on alone, customer waits grow and the team leader doesn't even know there is a problem.")),
        option("b", tx("팀장에게 상황을 알려 함께 대응한다.", "Tell the team leader what is happening and handle it together.")),
        option("c", tx("메신저를 잠시 끄고 플로어 요청만 처리한다.", "Turn off the messenger for a while and handle only floor requests."), tx("온라인 요청 뒤에도 기다리는 고객이 있습니다. 요청을 안 보이게 해도 사라지지 않습니다.", "Customers are waiting behind the online requests too. Hiding requests does not make them go away.")),
      ],
      answer: "b",
      explanation: tx("혼자 감당할 수 없는 양이면 팀장에게 알립니다. 인원 조정은 팀장과 RTA가 할 수 있습니다.", "When it is more than you can handle alone, tell the team leader. The team leader and the RTA can adjust staffing."),
    },
  ],
  connection: { to: "knowledge", text: tx("바쁜 하루가 지나고 나면 직무전문가에게 남는 일이 있습니다. 오늘 본 것을 팀의 지식으로 돌려주는 일입니다.", "When the busy day is over, one job is left for the SME: turning what you saw today into knowledge for the team.") },
};
