import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 8. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["notice", "alert", "tell", "follow"];
const flow = ["notice", "alert", "tell", "follow", "notice-alert", "alert-tell", "tell-follow"];

export default {
  id: "outage",
  order: 8,
  title: tx("시스템 장애 때 대응", "Responding to a System Outage"),
  short: tx("시스템 장애", "System outage"),
  subtitle: tx("혼자 고치려 하지 않고, 바로 알리고, 고객에게 정직하게 안내합니다.", "Don't try to fix it alone; report it right away and be honest with customers."),
  roles: tx("상담사 → 직무전문가 → 팀장", "Agent → SME → Team leader"),
  procedure,
  diagram: {
    nodes: [
      wide(node("notice", "알아차리기", 180, 36, "Notice it")),
      wide(node("alert", "바로 알리기", 180, 92, "Report it right away")),
      wide(node("tell", "고객 안내", 180, 148, "Tell the customer")),
      wide(node("follow", "기록과 후속", 180, 204, "Record and follow up")),
    ],
    edges: [edge("notice", "alert"), edge("alert", "tell"), edge("tell", "follow")],
  },
  steps: [
    step(tx("이 절차의 목적은 상담 시스템이나 고객사 시스템에 장애가 생겼을 때, 혼자 붙잡고 있지 않고 바로 알려 팀 전체가 같은 방식으로 대응하는 것입니다.", "This procedure exists so that when the contact system or a client's system goes down, you don't hold on to it alone but report it right away, so the whole team responds the same way."), flow, procedure, null),
    step(tx("지민의 화면에서 주문 조회가 계속 오류를 냅니다. 첫 단계는 알아차리기입니다. 새로고침이나 다시 로그인처럼 정해진 첫 조치(예시)를 해 보고, 그래도 안 되면 장애로 봅니다.", "Order lookup keeps throwing an error on Jimin's screen. The first step is noticing it. Try the set first fixes (Example: refresh, log in again), and if it still fails, treat it as an outage."), flow, ["notice"], null),
    step(tx("둘째 단계는 바로 알리기입니다. 어떤 화면에서, 언제부터, 어떤 오류가 나는지 하린이나 수진 팀장에게 바로 보고합니다. 두 사람이 오류를 모아 IT 헬프데스크에 티켓을 올려 오류를 알리고 지원을 받습니다.", "The second step is reporting it right away. Report to Harin or Sujin which screen, since when and what error. They gather the errors and raise a ticket with the IT help desk to report it and get support."), flow, ["alert"], null),
    step(tx("혼자 고쳐 보려고 오래 붙잡고 있으면, 그동안 같은 오류로 막힌 상담사가 계속 늘어납니다.", "If you hold on to it trying to fix it yourself, more agents keep getting stuck on the same error meanwhile."), flow, ["alert"], null),
    step(tx("셋째 단계는 고객 안내입니다. 하린이나 수진 팀장이 정해 준 안내 문장으로, 지금 확인이 어렵다고 정직하게 알리고 다시 연락할 방법을 안내합니다. 확실하지 않은 복구 시간은 약속하지 않습니다.", "The third step is telling the customer. With the wording Harin or Sujin gives, honestly say you can't check right now and explain how you'll get back to them. Don't promise a recovery time you're not sure of."), flow, ["tell"], null),
    step(tx("넷째 단계는 기록과 후속입니다. 장애로 처리하지 못한 문의는 정해진 표시를 해 두고, 복구되면 순서대로 다시 연락하거나 처리합니다.", "The fourth step is recording and following up. Mark the contacts you couldn't handle because of the outage as set, and once it's back, contact or handle them in order."), flow, ["follow"], null),
    step(tx("하린과 수진 팀장은 장애를 매니저에게도 보고하고, 문의가 몰리면 팀 전체의 대응이 시작됩니다. 팀장 SOP의 대규모 이슈 대응이 이 다음 부분입니다.", "Harin and Sujin also report the outage to the manager, and if contacts pile up, the whole team's response begins. The team leader's large-scale issue response is what comes next."), flow, ["follow"], null),
    step(tx("미소의 한마디: 저는 장애가 나면 제 컴퓨터 문제인 줄 알고 혼자 재부팅만 했어요. 먼저 알렸다면 팀 전체가 십 분은 더 빨리 같은 안내를 했을 거예요.", "A word from Miso: When an outage hit, I assumed it was my computer and just kept rebooting. If I'd reported it first, the whole team would have given the same guidance ten minutes sooner."), flow, ["follow"], null),
  ],
  checkpoint: [
    {
      id: "outage-q1",
      prompt: tx("정해진 첫 조치를 해 봐도 주문 조회가 계속 오류를 냅니다. 지민이 할 일은 무엇일까요?", "Even after the set first fixes, order lookup keeps throwing an error. What does Jimin do?"),
      options: [
        option("a", tx("내 컴퓨터 문제일 거라 여기고, 재부팅하고 프로그램을 다시 설치하며 계속 고쳐 본다.", "Keep rebooting and reinstalling the program, convinced it's her own computer."), tx("혼자 붙잡고 있는 동안 막힌 상담사와 고객이 늘어납니다. 첫 조치 뒤에도 안 되면 바로 알립니다.", "While you hold on to it, more agents and customers get stuck. If the first fixes don't work, report it right away.")),
        option("b", tx("어떤 화면에서 언제부터 어떤 오류인지 하린이나 수진 팀장에게 바로 알린다.", "Report to Harin or Sujin right away which screen, since when and what error.")),
        option("c", tx("다른 상담사가 알리겠지 하고 기다린다.", "Wait, assuming another agent will report it."), tx("모두가 그렇게 생각하면 아무도 알리지 않습니다. 먼저 본 사람이 알립니다.", "If everyone thinks that, no one reports it. Whoever sees it first reports it.")),
      ],
      answer: "b",
      explanation: tx("장애는 먼저 본 사람이 바로, 자세히 알릴수록 오류가 빨리 모여 IT 헬프데스크로 가고, 팀 전체가 같은 방식으로 대응합니다.", "The sooner and more precisely the first person to see it reports it, the faster the errors reach the IT help desk and the whole team responds the same way."),
    },
    {
      id: "outage-q2",
      prompt: tx("장애가 계속되는 동안 고객이 언제 되냐고 묻습니다. 가장 알맞은 안내는 무엇일까요?", "The outage goes on, and a customer asks when it will work. What is the best answer?"),
      options: [
        option("a", tx("고객을 안심시키려고, 늦어도 30분(예시) 안에는 된다고 약속한다.", "To reassure the customer, promise it will work within 30 minutes at the latest (Example)."), tx("확실하지 않은 시간을 약속하면 지키지 못했을 때 불만이 더 커집니다.", "Promising a time you're not sure of makes the complaint bigger if you can't keep it.")),
        option("b", tx("지금은 시스템이 안 된다며 아무것도 해 드릴 수 없다고만 말하고 끊는다.", "Say the system is down and you can't do anything right now, then end the call."), tx("이렇게 끝내면 고객은 다시 어떻게 해야 할지 모릅니다. 다시 연락할 방법을 안내합니다.", "Ending like this leaves the customer not knowing what to do next. Explain how you'll get back to them.")),
        option("c", tx("정해 준 문장으로 확인이 어렵다고 알리고, 다시 연락할 방법을 안내한다.", "With the given wording, say you can't check right now and explain how you'll get back to them.")),
      ],
      answer: "c",
      explanation: tx("장애 때는 정직하게 알리고, 다음에 어떻게 될지 안내합니다. 확실하지 않은 시간은 약속하지 않습니다.", "During an outage, be honest and explain what happens next. Don't promise a time you're not sure of."),
    },
  ],
  connection: { to: "home", text: tx("상담사 SOP 라이브러리를 마쳤습니다. 배운 순서대로 하면 직무전문가와 팀장이 내 일을 바로 이어받을 수 있습니다.", "You've finished the Agent SOP Library. Follow the steps in the order you learned, and the SME and the team leader can pick up your work right away.") },
};
