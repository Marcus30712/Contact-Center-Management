import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 3. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["receive", "pass", "confirm", "report"];
const flow = ["receive", "pass", "confirm", "report", "receive-pass", "pass-confirm", "confirm-report"];

export default {
  id: "instructions",
  order: 3,
  title: tx("지침 전달과 확인", "Passing On and Confirming Instructions"),
  short: tx("지침 전달", "Instructions"),
  subtitle: tx("고객사·매니저·회사의 지침이 팀원까지 닿았는지 확인하고 보고합니다.", "Confirm that instructions from the client, the manager and the company reach every agent, and report back."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("receive", "받기", 180, 36, "Receive")),
      wide(node("pass", "나누기", 180, 92, "Pass on")),
      wide(node("confirm", "확인하기", 180, 148, "Confirm")),
      wide(node("report", "보고하기", 180, 204, "Report")),
    ],
    edges: [edge("receive", "pass"), edge("pass", "confirm"), edge("confirm", "report")],
  },
  steps: [
    step(tx("이 레슨의 목적은 위에서 내려온 지침이 마켓마다 팀원 한 사람까지 닿았는지 확인하고, 매니저에게 보고하는 것입니다.", "This lesson is about confirming that an instruction from above has reached every agent in every market, and reporting it to the manager."), flow, procedure, null),
    step(tx("금요일 오후, 고객사가 다음 주 월요일(예시)부터 환불 기준을 바꾼다고 알려 왔습니다. 정은 매니저는 민석에게 세 마켓 모두 월요일 전까지 전달하라고 합니다.", "On Friday afternoon, the client announces that its refund rules change next Monday (Example). Jeongeun, the manager, asks Minseok to pass it on to all three markets before Monday."), flow, [], null),
    step(tx("첫 단계는 받기입니다. 민석은 지침이 무엇을, 언제부터, 누구에게 바꾸는지 한 장으로 정리합니다. 헷갈리는 부분은 전달하기 전에 정은 매니저에게 먼저 확인합니다.", "The first stage is receiving. Minseok sums up on one page what the instruction changes, from when and for whom. Anything unclear he checks with Jeongeun before passing it on."), flow, ["receive"], null),
    step(tx("둘째 단계는 나누기입니다. 세 마켓 팀장에게 같은 정리본을 보내고, 마켓마다 달라지는 점이 있으면 따로 적어 줍니다. 팀장들은 허들과 팀 채팅방으로 팀원에게 전합니다.", "The second stage is passing it on. He sends the same summary to all three market TLs, and notes separately anything that differs by market. The TLs pass it to agents through the huddle and the team chat."), flow, ["pass"], null),
    step(tx("셋째 단계는 확인하기입니다. 보냈다고 끝이 아닙니다. 팀장마다 팀원 확인 명단을 받아, 쉬는 날이었거나 휴가 중인 팀원까지 언제 전달받는지 챙깁니다.", "The third stage is confirming. Sending it isn't the end. He gets a confirmation list from each TL, and checks when agents who were off or on leave will hear it."), flow, ["confirm"], null),
    step(tx("신임 팀장인 태오는 팀 채팅방에 공지만 올리고 확인을 받지 않았습니다. 민석은 태오에게 확인 명단을 만드는 방법을 알려 주고, 빠진 팀원 두 명(예시)에게 첫 근무 전에 전달하게 합니다.", "Taeo, the new TL, only posted a notice in the team chat and didn't collect confirmations. Minseok shows him how to keep a confirmation list, and has him reach the two agents (Example) who missed it before their first shift."), flow, ["confirm"], null),
    step(tx("넷째 단계는 보고하기입니다. 민석은 마켓별 전달 결과와 아직 전달받지 못한 인원, 전달 예정일을 정은 매니저에게 보고합니다. 매니저는 이 보고로 고객사에 준비가 끝났다고 답합니다.", "The fourth stage is reporting. Minseok reports to Jeongeun the results by market, who hasn't heard it yet, and when they will. With this report, the manager tells the client the center is ready."), flow, ["report"], null),
    step(tx("미소의 한마디: 공지만 보내 놓고 다 전달됐다고 보고했다가, 월요일 아침에 잘못된 안내가 나간 적이 있어요. 그 뒤로는 명단을 받기 전에는 보고하지 않아요.", "A word from Miso: I once reported that everything had been passed on just because notices went out, and wrong information went out on Monday morning. Since then I don't report until I have the lists."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "instructions-q1",
      prompt: tx("고객사의 환불 기준이 월요일부터 바뀝니다. 금요일 저녁, 세 마켓 팀장 모두 팀 채팅방에 공지를 올렸다고 알려 왔습니다. 정은 매니저에게 어떻게 보고할까요?", "The client's refund rules change on Monday. On Friday evening, all three market TLs say they've posted a notice in their team chats. How does Minseok report to Jeongeun?"),
      options: [
        option("a", tx("세 마켓 모두 공지를 올렸다는 말을 듣고 전달이 끝났다고 보고한다.", "Report that it has all been passed on, as he heard the notices went up in all three markets."), tx("공지를 올린 것과 팀원이 확인한 것은 다릅니다. 쉬는 날인 팀원은 월요일에 잘못 안내할 수 있습니다.", "Posting a notice isn't the same as agents confirming it. Agents who were off may give wrong answers on Monday.")),
        option("b", tx("팀원 확인 명단을 받아, 아직 못 받은 인원과 전달 예정일까지 함께 보고한다.", "Get the agents' confirmation lists, and report who hasn't heard it yet and when they will.")),
        option("c", tx("월요일 첫 근무가 끝난 뒤 실수가 있었는지 확인하고 나서 그 결과를 함께 보고한다.", "Report after Monday's first shift, once he has checked whether there were any mistakes."), tx("실수가 나온 뒤에 보고하면 늦습니다. 바뀌기 전에 누가 아직 모르는지 알아야 합니다.", "Reporting after mistakes happen is too late. You need to know who still doesn't know before the change.")),
      ],
      answer: "b",
      explanation: tx("지침은 팀원 한 사람까지 닿았는지 확인한 뒤, 빠진 인원과 계획까지 보고합니다.", "Confirm the instruction reached every agent, then report who is missing and the plan."),
    },
    {
      id: "instructions-q2",
      prompt: tx("고객사 지침에 헷갈리는 부분이 있습니다. 팀장들에게 전달하기 전에 어떻게 할까요?", "Part of the client's instruction is unclear. What does Minseok do before passing it to the TLs?"),
      options: [
        option("a", tx("각 마켓 팀장이 자기 마켓 사정에 맞게 알아서 해석해 팀원에게 전하게 한다.", "Let each market TL read it their own way to fit their market and pass it on."), tx("마켓마다 해석이 달라지면 고객이 같은 질문에 다른 답을 듣게 됩니다.", "If each market reads it differently, customers get different answers to the same question.")),
        option("b", tx("민석이 가장 그럴듯하게 해석해 그대로 전달한다.", "Read it the most likely way himself and pass that on."), tx("추측으로 전달하면 틀렸을 때 세 마켓을 다시 바로잡아야 합니다.", "Passing on a guess means fixing all three markets if it's wrong.")),
        option("c", tx("정은 매니저에게 먼저 확인한 뒤 한 장으로 정리해 전한다.", "Check with Jeongeun first, then sum it up on one page and pass it on.")),
      ],
      answer: "c",
      explanation: tx("헷갈리는 지침은 전달하기 전에 확인하고, 모든 마켓에 같은 정리본을 보냅니다.", "Check unclear instructions before passing them on, and send every market the same summary."),
    },
  ],
  connection: { to: "escalation", text: tx("아래에서 위로 올라가는 것도 있습니다. 팀장들이 고객사에 보내는 에스컬레이션 보고를 점검합니다.", "Things go up as well as down. Next, checking the escalation reports TLs send to the client.") },
};
