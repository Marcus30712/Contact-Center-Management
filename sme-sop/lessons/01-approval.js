import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 1. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["request", "scope", "decide", "handoff", "record"];
const flow = ["request", "scope", "decide", "handoff", "record", "request-scope", "scope-decide", "decide-handoff", "handoff-record"];

export default {
  id: "approval",
  order: 1,
  title: tx("에스컬레이션 승인", "Escalation Approval"),
  short: tx("승인", "Approval"),
  subtitle: tx("넘어온 건을 확인하고, 범위 안이면 승인하고, 밖이면 넘깁니다.", "Check what came in, approve it if it's in scope, and pass it on if not."),
  roles: tx("상담사 → SME → 팀장", "Agent → SME → Team leader"),
  procedure,
  diagram: {
    nodes: [
      wide(node("request", "요청 확인", 180, 24, "Check the request")),
      wide(node("scope", "범위 판단", 180, 72, "Judge the scope")),
      wide(node("decide", "승인 또는 처리", 180, 120, "Approve or handle")),
      wide(node("handoff", "팀장 인계", 180, 168, "Hand to the lead")),
      wide(node("record", "기록 남기기", 180, 216, "Keep a record")),
    ],
    edges: [edge("request", "scope"), edge("scope", "decide"), edge("decide", "handoff"), edge("handoff", "record")],
  },
  steps: [
    step(tx("이 절차의 목적은 상담사가 요청한 에스컬레이션을 같은 기준으로 빠르게 판단해, 승인하거나 직접 처리하거나 팀장에게 넘기는 것입니다. 팀장 SOP의 고객 불만 에스컬레이션에서 SME가 넘겨받은 다음 부분입니다.", "This procedure exists to judge an agent's escalation quickly and by the same rules, then approve it, handle it yourself, or pass it to the team leader. It is the part that comes after the SME takes over in the team leader's customer complaint escalation SOP."), flow, procedure, null),
    step(tx("지민이 메신저로 보상 승인을 요청합니다. 첫 단계는 요청 확인입니다. 티켓에 고객 요청, 지민이 이미 해 본 것, 고객 상태가 적혀 있는지 봅니다.", "Jimin asks for a compensation approval by messenger. The first step is checking the request. See whether the ticket records what the customer wants, what Jimin has already tried, and how the customer is feeling."), flow, ["request"], null),
    step(tx("기록이 부족하면 지민에게 짧게 되묻습니다. 고객에게 같은 질문을 다시 하지 않기 위해서입니다.", "If the record is thin, ask Jimin a quick question. That way the customer isn't asked the same thing again."), flow, ["request"], null),
    step(tx("둘째 단계는 범위 판단입니다. 팀장과 맞춰 둔 승인 범위 목록을 기준으로, 내 범위 안인지 밖인지 정합니다. 확실하지 않으면 범위 밖으로 봅니다.", "The second step is judging the scope. Use the approval scope list agreed with the team leader to decide whether it is inside your scope or not. If you're not sure, treat it as outside."), flow, ["scope"], null),
    step(tx("셋째 단계는 승인 또는 처리입니다. 범위 안이면 승인하고, 상담사가 풀기 어려운 건은 SME가 이어받아 직접 응대합니다. 이어받을 때는 고객에게 이전 내용을 알고 있다고 먼저 말합니다.", "The third step is approving or handling. Approve it if it's in scope; if the agent is stuck, take the case over and handle the customer yourself. When you take over, first tell the customer you already know what happened so far."), flow, ["decide"], null),
    step(tx("넷째 단계는 팀장 인계입니다. 범위 밖이거나 정책에 없는 요청은 팀장에게 넘깁니다. 그동안 고객에게 기다림을 안내하도록 지민에게 부탁합니다.", "The fourth step is handing it to the team leader. Requests outside your scope or outside policy go to the team leader. Meanwhile, ask Jimin to tell the customer about the wait."), flow, ["handoff"], null),
    step(tx("다섯째 단계는 기록 남기기입니다. 승인했든 넘겼든 티켓에 결정과 이유를 적고, 승인 기록에도 남깁니다. 같은 요청이 다시 오면 누구든 같은 기준으로 판단할 수 있습니다.", "The fifth step is keeping a record. Whether you approved it or passed it on, write the decision and the reason in the ticket and in the approval log. When the same request comes again, anyone can judge it by the same rule."), flow, ["record"], null),
    step(tx("답하는 데 시간이 걸리면 언제 답할지 먼저 알립니다(예시: 5분 안에). 상담사가 기다리는 동안 고객도 기다리고 있습니다.", "If an answer will take time, say first when you will answer (Example: within 5 minutes). While the agent waits, the customer is waiting too."), flow, ["record"], null),
  ],
  checkpoint: [
    {
      id: "approval-q1",
      prompt: tx("지민의 보상 요청이 범위 안이라 승인했습니다. 다음으로 할 일은 무엇일까요?", "Jimin's compensation request was in scope, so you approved it. What do you do next?"),
      options: [
        option("a", tx("승인했으니 따로 남길 것은 없다.", "Nothing else to record, since it's approved."), tx("이유가 남지 않으면 비슷한 요청이 왔을 때 사람마다 다르게 판단하게 됩니다.", "Without the reason on record, people judge similar requests differently.")),
        option("b", tx("티켓과 승인 기록에 결정과 이유를 적는다.", "Write the decision and the reason in the ticket and the approval log.")),
        option("c", tx("승인해도 되는지 팀장에게 다시 묻는다.", "Ask the team leader again whether the approval is okay."), tx("범위 안의 건까지 다시 물으면 팀장의 하루가 막히고, 승인 범위를 맞춘 의미가 없어집니다.", "Asking about in-scope cases too blocks the team leader's day and defeats the point of agreeing on a scope.")),
      ],
      answer: "b",
      explanation: tx("승인은 결정과 이유를 기록해야 끝납니다. 그래야 같은 기준이 이어집니다.", "An approval is finished only when the decision and reason are recorded. That keeps the rule consistent."),
    },
    {
      id: "approval-q2",
      prompt: tx("지민이 풀기 어려운 건을 SME가 이어받아 고객과 통화합니다. 먼저 할 말로 알맞은 것은 무엇일까요?", "The SME takes over a case Jimin found hard and calls the customer. What should you say first?"),
      options: [
        option("a", tx("\"처음부터 다시 설명해 주시겠어요?\"", "\"Could you explain it all again from the start?\""), tx("고객은 같은 이야기를 되풀이하는 것을 가장 싫어합니다. 기록을 읽고 이어받습니다.", "Customers dislike repeating themselves most of all. Read the record and pick up from there.")),
        option("b", tx("\"앞서 상담하신 내용을 확인했습니다. 이어서 도와드리겠습니다.\"", "\"I've reviewed your earlier conversation. I'll take it from here.\"")),
        option("c", tx("\"앞 상담사가 실수한 것 같습니다.\"", "\"I think the agent before me made a mistake.\""), tx("동료를 탓하면 고객의 신뢰가 떨어지고, 문제는 그대로 남습니다.", "Blaming a colleague lowers the customer's trust, and the problem stays.")),
      ],
      answer: "b",
      explanation: tx("이어받을 때는 이전 내용을 알고 있다고 먼저 말합니다.", "When you take over, first say you know what happened so far."),
    },
  ],
  connection: { to: "scrubbing", text: tx("에스컬레이션은 지금 들어온 문제를 푸는 일입니다. 다음은 이미 끝난 티켓에서 문제를 찾는 스크러빙입니다.", "Escalation solves problems as they come in. Next is scrubbing, which finds problems in tickets that are already closed.") },
};
