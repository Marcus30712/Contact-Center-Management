import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 6. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["send", "score", "context", "pass"];
const flow = ["send", "score", "context", "pass", "send-score", "score-context", "context-pass"];

export default {
  id: "calibration",
  order: 6,
  title: tx("캘리브레이션 참여와 기준 전달", "Joining Calibration and Passing On Standards"),
  short: tx("캘리브레이션", "Calibration"),
  subtitle: tx("현장의 사정을 세션에 가져가고, 맞춘 기준을 현장에 가져옵니다.", "Bring the floor's reality to the session, and bring the agreed standard back to the floor."),
  roles: tx("QA · 직무전문가 · 팀장 → 상담사", "QA · SME · Team leader → Agents"),
  procedure,
  diagram: {
    nodes: [
      wide(node("send", "사례 보내기", 180, 36, "Send cases")),
      wide(node("score", "독립 평가", 180, 92, "Score alone")),
      wide(node("context", "현장 사정 전하기", 180, 148, "Explain the floor")),
      wide(node("pass", "기준 전달", 180, 204, "Pass on the standard")),
    ],
    edges: [edge("send", "score"), edge("score", "context"), edge("context", "pass")],
  },
  steps: [
    step(tx("이 절차의 목적은 캘리브레이션에서 직무전문가가 현장 사정을 알려 평가 기준을 현실에 맞추고, 바뀐 기준을 상담사에게 먼저 전하는 것입니다. 세션 진행은 팀장 SOP의 캘리브레이션을 따릅니다.", "This procedure exists so the SME explains the floor's reality at calibration to keep the standard realistic, and passes any changed standard to agents first. The session itself follows the team leader's calibration SOP."), flow, procedure, null),
    step(tx("첫 단계는 사례 보내기입니다. 지민이 현장 방식대로 처리했는데 감점된 티켓처럼, 평가 기준과 현장 방식이 엇갈린 사례를 골라 세션 전에 QA에게 보냅니다.", "The first step is sending cases. Pick cases where the standard and the floor's way differ, such as a ticket Jimin handled the floor's way but lost points on, and send them to QA before the session."), flow, ["send"], null),
    step(tx("둘째 단계는 독립 평가입니다. 다른 사람의 점수를 보기 전에, 기준표에 따라 직접 점수를 매기고 이유를 적습니다.", "The second step is scoring alone. Before seeing anyone else's score, score it yourself against the scorecard and write down why."), flow, ["score"], null),
    step(tx("셋째 단계는 현장 사정 전하기입니다. 점수가 갈린 항목에서, 상담사가 그 순간 화면에서 무엇을 볼 수 있었고 어떤 도구를 썼는지 설명합니다.", "The third step is explaining the floor. On items where scores differ, explain what the agent could see on screen at that moment and which tools they used."), flow, ["context"], null),
    step(tx("직무전문가는 상담사 편을 드는 자리가 아닙니다. 현장 사정을 알려 기준이 현실에 맞게 정해지도록 돕는 자리입니다.", "The SME is not there to take the agents' side. The SME is there to share the floor's reality so the standard fits it."), flow, ["context"], null),
    step(tx("넷째 단계는 기준 전달입니다. 합의로 기준이 바뀌면, 그 기준으로 평가받기 전에 상담사들이 알도록 팀장과 맞춰 허들과 팀 채팅방에서 먼저 전합니다. QA의 공식 공유가 나오면 그 내용도 다시 알립니다.", "The fourth step is passing on the standard. If the agreed standard changes, agree with the team leader and tell agents first at the huddle and in the team chat, before they are scored on it. When QA's official summary comes out, share that too."), flow, ["pass"], null),
    step(tx("바뀐 기준은 예시 한 건과 함께 전합니다. \"이제 이렇게 하면 됩니다\"를 보여 주면 상담사가 바로 따라 할 수 있습니다.", "Pass on a changed standard with one example. Showing \"this is how to do it now\" lets agents follow it right away."), flow, ["pass"], null),
  ],
  checkpoint: [
    {
      id: "calibration-q1",
      prompt: tx("점수가 갈린 항목에서 직무전문가가 할 말로 알맞은 것은 무엇일까요?", "On an item where scores differ, what should the SME say?"),
      options: [
        option("a", tx("\"상담사가 많이 애쓴 건이니, 그 입장도 생각해서 점수를 올려 주세요.\"", "\"The agent worked hard on this one, so please raise the score with their side in mind.\""), tx("편을 들면 기준이 흐려지고, 직무전문가의 의견도 믿기 어려워집니다.", "Taking sides blurs the standard and makes the SME's view harder to trust.")),
        option("b", tx("\"그 시점에 상담사 화면에는 주문 상태가 보이지 않았습니다.\"", "\"At that point, the order status wasn't visible on the agent's screen.\"")),
        option("c", tx("\"저는 QA가 아니라서 점수에는 의견이 없고, 정해지는 대로 따르겠습니다.\"", "\"I'm not QA, so I have no view on the score; I'll go with whatever is decided.\""), tx("현장 사정을 아는 사람이 말하지 않으면 기준이 현실과 어긋난 채 정해집니다.", "If the person who knows the floor says nothing, the standard is set out of step with reality.")),
      ],
      answer: "b",
      explanation: tx("직무전문가는 편을 드는 대신 현장에서 실제로 있었던 사실을 전합니다.", "Instead of taking sides, the SME shares what actually happened on the floor."),
    },
    {
      id: "calibration-q2",
      prompt: tx("세션에서 사과 표현 기준이 바뀌었고, 다음 평가는 내일부터입니다. 어떻게 할까요?", "The apology standard changed at the session, and the next scoring starts tomorrow. What do you do?"),
      options: [
        option("a", tx("잘못 전하지 않도록, 공식 공지가 나올 때까지 기다린다.", "So nothing is passed on wrongly, wait for the official notice."), tx("공지가 늦으면 상담사들은 모르는 기준으로 평가받습니다.", "If the notice comes late, agents are scored on a standard they don't know.")),
        option("b", tx("평가가 내일부터이니, 오늘 허들이나 팀 채팅방에서 예시와 함께 전한다.", "Evaluations start tomorrow, so share it today with an example at a huddle or in the team chat.")),
        option("c", tx("모두에게 알리면 혼란스러우니, 점수가 낮게 나온 상담사에게만 알려 준다.", "Telling everyone causes confusion, so tell only the agents who scored low."), tx("평가를 받은 뒤에 알게 되면 이미 늦습니다. 모두가 미리 알아야 합니다.", "Learning it after being scored is too late. Everyone needs to know beforehand.")),
      ],
      answer: "b",
      explanation: tx("바뀐 기준은 평가보다 먼저 현장에 닿아야 합니다.", "A changed standard must reach the floor before the scoring does."),
    },
  ],
  connection: { to: "voc", text: tx("직무전문가가 현장의 목소리를 전하는 곳은 QA만이 아닙니다. 고객의 목소리는 고객사로 갑니다.", "QA isn't the only place the SME carries the floor's voice. The customer's voice goes to the client.") },
};
