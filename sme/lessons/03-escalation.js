import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 3. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["record", "decide", "answer", "share"];
const flow = [...procedure, "record-decide", "decide-answer", "answer-share"];

export default {
  id: "escalation",
  order: 3,
  title: tx("기존 상담사 서포트", "Supporting Existing Agents"),
  short: tx("에스컬레이션", "Escalations"),
  subtitle: tx("넘어온 건을 승인하거나, 처리하거나, 넘깁니다.", "Approve, handle, or pass on what comes to you."),
  procedure,
  diagram: {
    nodes: [
      wide(node("record", "기록 확인", 180, 36, "Check the record")),
      wide(node("decide", "판단", 180, 92, "Decide")),
      wide(node("answer", "답 돌려주기", 180, 148, "Report back")),
      wide(node("share", "팀에 나누기", 180, 204, "Share with the team")),
    ],
    edges: [edge("record", "decide"), edge("decide", "answer"), edge("answer", "share")],
  },
  steps: [
    step(tx("이 레슨의 목적은 기존 상담사가 넘긴 문의와 에스컬레이션을 빠르게 판단해, 승인·직접 처리·팀장에게 넘기기 중 하나로 정리하는 것입니다.", "This lesson is about deciding quickly on contacts and escalations that existing agents pass to you: approve, handle yourself, or pass to the team leader."), flow, procedure, null),
    step(tx("지민은 2년째 일하는 상담사입니다. 일은 익숙하지만, 오늘 받은 문의는 자기 권한으로 풀 수 없습니다. 지민이 메신저로 당신에게 승인을 요청합니다.", "Jimin has been an agent for two years. He knows the work, but today's contact is beyond his authority. He messages you to ask for approval."), flow, [], null),
    step(tx("첫 단계는 기록 확인입니다. 티켓에 고객이 원하는 것, 지민이 이미 해 본 것, 고객의 감정 상태가 적혀 있는지 봅니다.", "The first stage is checking the record. See whether the ticket says what the customer wants, what Jimin already tried, and how the customer feels."), flow, ["record"], null),
    step(tx("기록이 부족하면 지민에게 짧게 다시 묻습니다. 고객에게 같은 질문을 되풀이하지 않기 위해서입니다.", "If the record is thin, ask Jimin briefly. That way the customer does not get the same questions again."), flow, ["record"], null),
    step(tx("둘째 단계는 판단입니다. 내 승인 범위 안이면 승인하고, 직접 응대가 필요하면 내가 이어서 처리하고, 범위 밖이면 팀장에게 넘깁니다.", "The second stage is deciding. Within your approval limits, you approve; if it needs you to speak to the customer, you take it over; if it is outside your limits, it goes to the team leader."), flow, ["decide"], null),
    step(tx("승인할 때는 이유도 함께 적어 둡니다. 비슷한 요청이 다시 오면 다른 사람도 같은 기준으로 판단할 수 있습니다.", "When you approve, note the reason too. When a similar request comes in, others can decide by the same standard."), flow, ["decide"], null),
    step(tx("직접 처리할 때는 고객에게 이전 내용을 알고 있다고 먼저 말합니다. 넘겨받은 사람이 처음부터 다시 묻는 것을 고객은 가장 싫어합니다.", "When you take it over, first tell the customer you know what happened so far. Customers hate nothing more than being asked everything again by the next person."), flow, ["decide"], null),
    step(tx("셋째 단계는 답 돌려주기입니다. 처리가 끝나면 결과와 이유를 지민에게 알려 줍니다. 다음에 비슷한 건이 오면 지민이 혼자 풀 수 있습니다.", "The third stage is reporting back. When it is done, tell Jimin the outcome and the reason. Next time a similar contact comes, he can handle it himself."), flow, ["answer"], null),
    step(tx("넷째 단계는 팀에 나누기입니다. 같은 질문이 여러 상담사에게서 오면, 허들이나 팀 채팅방에 한 번에 정리해 공유합니다.", "The fourth stage is sharing with the team. When several agents ask the same question, sum it up once in the huddle or the team chat."), flow, ["share"], null),
    step(tx("기존 상담사는 답을 빨리 원합니다. 판단이 길어지면 \"5분 안에 답 드릴게요\"(예시)처럼 언제 답할지 먼저 알려 줍니다.", "Experienced agents want answers fast. If deciding takes time, say first when you will answer, as in \"I'll get back to you within 5 minutes\" (Example)."), flow, ["answer"], null),
  ],
  checkpoint: [
    {
      id: "escalation-q1",
      prompt: tx("지민의 요청이 내 승인 범위 안인지 확실하지 않습니다. 어떻게 할까요?", "You are not sure Jimin's request is within your approval limits. What do you do?"),
      options: [
        option("a", tx("고객을 오래 기다리게 할 수 없으니 일단 승인한다.", "Approve it for now, since the customer can't be kept waiting."), tx("확실하지 않은 승인은 나중에 되돌리기 어렵고, 잘못된 기준이 팀에 퍼집니다.", "An unsure approval is hard to undo later, and the wrong standard spreads through the team.")),
        option("b", tx("지민에게 고객 대기 안내를 부탁하고, 팀장에게 바로 확인한다.", "Ask Jimin to let the customer know there is a short wait, and check with the team leader right away.")),
        option("c", tx("확실하지 않으니 거절한다.", "Turn it down because you are not sure."), tx("범위 안의 요청이었다면 고객이 받을 수 있던 해결을 놓치게 됩니다.", "If it was within your limits, the customer misses a fix they could have had.")),
      ],
      answer: "b",
      explanation: tx("모르면 추측하지 말고 확인합니다. 그동안 고객이 기다린다는 사실을 상담사가 알리게 합니다.", "When you don't know, check instead of guessing. Meanwhile, have the agent tell the customer they are waiting."),
    },
    {
      id: "escalation-q2",
      prompt: tx("같은 정책 질문이 하루에 다섯 명에게서 왔습니다. 알맞은 것은 무엇일까요?", "Five agents ask you the same policy question in one day. What fits best?"),
      options: [
        option("a", tx("올 때마다 한 사람씩 답한다.", "Answer each person as they come."), tx("여섯 번째, 일곱 번째 질문도 오게 되고, 그 시간에 더 급한 요청을 놓칩니다.", "A sixth and seventh question will come, and you miss more urgent requests meanwhile.")),
        option("b", tx("답을 정리해 허들이나 팀 채팅방에 공유한다.", "Sum up the answer and share it in the huddle or the team chat.")),
        option("c", tx("지식 베이스를 읽어 보라고만 답한다.", "Just tell them to read the knowledge base."), tx("다섯 명이 같은 것을 묻는다면 문서가 찾기 어렵거나 불분명하다는 신호입니다.", "When five people ask the same thing, the article is hard to find or unclear.")),
      ],
      answer: "b",
      explanation: tx("반복되는 질문은 팀 전체에 한 번에 돌려줍니다. 그래야 다음 질문이 줄어듭니다.", "Give repeated questions back to the whole team at once. That is how the next questions drop."),
    },
  ],
  connection: { to: "peer", text: tx("에스컬레이션을 요청하는 사람 중에는 어제까지 동료였던 사람도 있습니다. 이 관계가 새 SME에게 가장 어렵습니다.", "Some of the people asking for escalations were your peers until yesterday. That relationship is the hardest part for a new SME.") },
};
