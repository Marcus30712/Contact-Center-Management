import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 1. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["try", "tell", "ask", "record"];
const flow = ["try", "tell", "ask", "record", "try-tell", "tell-ask", "ask-record"];

export default {
  id: "request",
  order: 1,
  title: tx("에스컬레이션 요청하기", "Requesting an Escalation"),
  short: tx("에스컬레이션", "Escalation"),
  subtitle: tx("내 권한으로 안 될 때, 고객이 다시 말하지 않게 넘깁니다.", "When it's beyond your authority, pass it on so the customer doesn't have to repeat themselves."),
  roles: tx("상담사 → 직무전문가 → 팀장", "Agent → SME → Team leader"),
  procedure,
  diagram: {
    nodes: [
      wide(node("try", "혼자 풀어 보기", 180, 36, "Try it yourself")),
      wide(node("tell", "고객에게 안내", 180, 92, "Tell the customer")),
      wide(node("ask", "한 번에 요청", 180, 148, "Ask in one go")),
      wide(node("record", "기록과 이어 받기", 180, 204, "Record and follow through")),
    ],
    edges: [edge("try", "tell"), edge("tell", "ask"), edge("ask", "record")],
  },
  steps: [
    step(tx("이 절차의 목적은 내 권한으로 풀 수 없는 문의를 직무전문가에게 빠르게 넘기면서, 고객이 같은 이야기를 다시 하지 않게 하는 것입니다.", "This procedure exists to pass a contact you can't resolve to the SME quickly, without making the customer tell the story again."), flow, procedure, null),
    step(tx("지민이 화가 난 고객의 보상 요청 전화를 받습니다. 첫 단계는 혼자 풀어 보기입니다. 고객의 말을 끝까지 듣고, 표준 절차와 내 권한 안에서 먼저 풀어 봅니다.", "Jimin takes a call from an angry customer asking for compensation. The first step is trying it yourself. Listen to the end and try first within the standard process and your own authority."), flow, ["try"], null),
    step(tx("둘째 단계는 고객에게 안내입니다. 내 권한 밖이면 논쟁하지 않고, 담당자에게 전달하겠다고 알리고 얼마나 기다리는지 안내합니다.", "The second step is telling the customer. If it's beyond your authority, don't argue; say you'll pass it to the right person and how long they'll wait."), flow, ["tell"], null),
    step(tx("셋째 단계는 한 번에 요청입니다. 메신저나 손을 들어 하린에게 고객 요청, 이미 해 본 것, 고객 상태를 한 번에 전합니다.", "The third step is asking in one go. By messenger or by raising a hand, give Harin the customer's request, what you've already tried and how the customer is doing, all at once."), flow, ["ask"], null),
    step(tx("\"보상 돼요?\"처럼 묻기만 하면 하린이 다시 물어야 하고, 그동안 고객은 기다립니다.", "If you only ask \"Can I give compensation?\", Harin has to ask you back, and the customer waits all that time."), flow, ["ask"], null),
    step(tx("넷째 단계는 기록과 이어 받기입니다. 티켓에 에스컬레이션 표시를 하고 고객이 한 말과 감정까지 사실대로 적습니다. 하린의 답을 받으면 고객에게 결과를 이어서 안내합니다.", "The fourth step is recording and following through. Mark the ticket as an escalation and record what the customer said and how they felt, as fact. When Harin answers, carry the result back to the customer."), flow, ["record"], null),
    step(tx("하린은 승인 범위 안이면 바로 승인하고, 범위 밖이면 수진 팀장에게 넘깁니다. 직무전문가 SOP의 에스컬레이션 승인, 팀장 SOP의 고객 불만 에스컬레이션이 이 다음 부분입니다.", "Harin approves it right away if it's in scope, or passes it to Sujin if not. The SME's escalation approval and the team leader's customer complaint escalation are what come next."), flow, ["record"], null),
    step(tx("미소의 한마디: 저는 에스컬레이션을 넘기면 제 일은 끝난 줄 알았어요. 기록을 자세히 남긴 날일수록 고객이 덜 화내고, 저도 덜 불려 다녔더라고요.", "A word from Miso: I thought my job was done once I'd escalated. On the days I left a detailed record, the customer got less angry and I got called over less."), flow, ["record"], null),
  ],
  checkpoint: [
    {
      id: "request-q1",
      prompt: tx("지민의 권한으로 풀 수 없는 요청입니다. 하린에게 가장 알맞은 요청은 무엇일까요?", "The request is beyond Jimin's authority. What is the best way to ask Harin?"),
      options: [
        option("a", tx("\"보상 요청인데 승인 되나요?\" 하고 먼저 묻고, 답을 기다린다.", "Ask first, \"It's a compensation request; can it be approved?\", and wait for an answer."), tx("이렇게 물으면 하린이 무엇을 확인했는지 다시 물어야 하고, 그동안 고객이 기다립니다.", "Asked like this, Harin has to ask what you've already checked, and the customer waits meanwhile.")),
        option("b", tx("다시 묻지 않게, 고객 요청·해 본 것·고객 상태를 한 번에 전한다.", "So Harin needn't ask again, give the request, what you tried and the customer's state at once.")),
        option("c", tx("화가 난 고객의 통화를 하린에게 바로 돌려, 처음부터 하린이 직접 받게 한다.", "Transfer the angry customer's call straight to Harin so she takes it from the start."), tx("상황을 모르는 사람에게 바로 돌리면 고객이 처음부터 다시 말해야 합니다. 먼저 요청하고 기다림을 안내합니다.", "Transferring to someone who doesn't know the case makes the customer start over. Ask first and tell the customer about the wait.")),
      ],
      answer: "b",
      explanation: tx("요청을 한 번에 전하면 하린이 바로 판단하고, 고객은 같은 말을 되풀이하지 않습니다.", "Asking in one go lets Harin decide right away, and the customer doesn't repeat the same story."),
    },
    {
      id: "request-q2",
      prompt: tx("하린이 승인해 주었습니다. 지민이 마지막으로 할 일은 무엇일까요?", "Harin has approved it. What is the last thing Jimin does?"),
      options: [
        option("a", tx("승인을 받았으니 바로 다음 문의를 받는다.", "Now that it's approved, take the next contact right away."), tx("고객에게 결과를 이어서 안내하고 기록을 남겨야 끝납니다.", "It's done only after you carry the result to the customer and leave a record.")),
        option("b", tx("고객에게 결과만 짧게 알리고, 티켓에는 \"승인 완료\"라고만 적는다.", "Tell the customer only the result, briefly, and write just \"approved\" in the ticket."), tx("누가 왜 승인했는지 없으면 같은 요청이 다시 왔을 때 아무도 판단 근거를 찾을 수 없습니다.", "Without who approved it and why, no one can find the basis when the same request comes again.")),
        option("c", tx("고객에게 결과를 안내하고, 티켓에 승인자와 이유를 적는다.", "Give the customer the result, and record who approved it and why in the ticket.")),
      ],
      answer: "c",
      explanation: tx("에스컬레이션은 고객에게 결과를 알리고 승인자와 이유를 남길 때 끝납니다.", "An escalation ends when the customer hears the result and the approver and reason are recorded."),
    },
  ],
  connection: { to: "abuse", text: tx("넘겨야 하는 문의가 늘 정중한 것은 아닙니다. 다음은 욕설과 폭언이 계속될 때의 절차입니다.", "Contacts you have to pass on aren't always polite. Next is the procedure when abuse and swearing go on.") },
};
