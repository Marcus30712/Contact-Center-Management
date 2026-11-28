import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 7. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["read", "evidence", "request", "accept"];
const flow = ["read", "evidence", "request", "accept", "read-evidence", "evidence-request", "request-accept"];

export default {
  id: "dispute",
  order: 7,
  title: tx("평가 결과 이의 제기", "Disputing a Quality Score"),
  short: tx("이의 제기", "Score dispute"),
  subtitle: tx("감정이 아니라 근거로, 정해진 경로로 요청합니다.", "Ask with evidence, not feelings, through the set route."),
  roles: tx("상담사 → 팀장 → QA", "Agent → TL → QA"),
  procedure,
  diagram: {
    nodes: [
      wide(node("read", "평가표 읽기", 180, 36, "Read the score sheet")),
      wide(node("evidence", "근거 모으기", 180, 92, "Gather evidence")),
      wide(node("request", "팀장에게 요청", 180, 148, "Ask the Team Leader")),
      wide(node("accept", "결과 받아들이기", 180, 204, "Accept the result")),
    ],
    edges: [edge("read", "evidence"), edge("evidence", "request"), edge("request", "accept")],
  },
  steps: [
    step(tx("이 절차의 목적은 품질 평가에서 납득되지 않는 항목이 있을 때, 근거를 갖추어 정해진 경로로 다시 검토를 요청하는 것입니다.", "This procedure exists so that when a quality score item doesn't seem right, you gather evidence and ask for a re-review through the set route."), flow, procedure, null),
    step(tx("지민이 받은 평가표에서 안내 항목이 감점되었지만, 지민은 허들에서 들은 대로 안내했다고 생각합니다. 첫 단계는 평가표 읽기입니다. 어느 항목이 어떤 기준으로 감점됐는지 확인합니다.", "Jimin lost points on the guidance item in her score sheet, though she believes she guided the customer as the huddle said. The first step is reading the score sheet. Check which item lost points and by which standard."), flow, ["read"], null),
    step(tx("둘째 단계는 근거 모으기입니다. 티켓 번호, 녹취나 기록의 해당 시점, 근거가 된 공지나 허들 내용을 모읍니다.", "The second step is gathering evidence. Collect the ticket number, the moment in the recording or record, and the notice or huddle content behind your guidance."), flow, ["evidence"], null),
    step(tx("셋째 단계는 팀장에게 요청입니다. QA에게 바로 따지지 않고, 평가를 공유받은 뒤 24~48시간(예시) 안에 수진 팀장을 거쳐 근거와 함께 다시 검토를 요청합니다. 기한은 센터마다 다를 수 있습니다.", "The third step is asking the TL. Don't argue with QA directly; within 24 to 48 hours (Example) of getting the score, ask for a re-review with your evidence through Sujin. The deadline can differ by center."), flow, ["request"], null),
    step(tx("수진 팀장은 녹취를 함께 듣고, 근거가 있으면 정해진 절차로 QA에 다시 검토를 요청합니다. 팀장 서포트의 QA 지원이 이 다음 부분입니다.", "Sujin listens to the recording with you, and if there's a basis, asks QA for a re-review through the set procedure. The TL's QA support is what comes next."), flow, ["request"], null),
    step(tx("넷째 단계는 결과 받아들이기입니다. 점수가 바뀌든 그대로든 이유를 듣고, 기준이 달랐다면 다음부터 그 기준으로 안내합니다.", "The fourth step is accepting the result. Whether the score changes or not, hear the reason, and if the standard was different, guide by that standard from then on."), flow, ["accept"], null),
    step(tx("이런 사례는 캘리브레이션에서 기준을 맞추는 데 쓰이기도 합니다. 근거 있는 이의는 나만이 아니라 팀 전체의 기준을 바로잡습니다.", "Cases like this are also used in calibration to align the standard. A dispute with evidence corrects the standard for the whole team, not just for you."), flow, ["accept"], null),
    step(tx("미소의 한마디: 저는 억울한 점수를 받으면 동료들한테 불평만 했어요. 근거를 모아 한 번 정식으로 요청해 봤다면, 기준을 이해하는 것도 훨씬 빨랐을 거예요.", "A word from Miso: When I got a score I thought was unfair, I just complained to colleagues. If I'd gathered evidence and asked once, properly, I'd have understood the standard much faster."), flow, ["accept"], null),
  ],
  checkpoint: [
    {
      id: "dispute-q1",
      prompt: tx("지민은 감점이 부당하다고 생각합니다. 가장 알맞은 첫 행동은 무엇일까요?", "Jimin thinks a deduction was unfair. What is the best first step?"),
      options: [
        option("a", tx("QA에게 바로 메시지를 보내 왜 감점했는지 따져 묻는다.", "Message QA and demand to know right away why points were taken."), tx("QA와 직접 다투면 감정싸움이 되기 쉽습니다. 정해진 경로인 팀장을 통해 요청합니다.", "Arguing with QA directly easily turns into a fight. Ask through the set route, the TL.")),
        option("b", tx("평가표를 읽고, 티켓·녹취·공지 같은 근거를 모은다.", "Read the score sheet and gather evidence like the ticket, recording and notice.")),
        option("c", tx("평가 기간이 끝나면 다음 달에 한꺼번에 이야기한다.", "Raise everything together next month, after the scoring period ends."), tx("이의 제기에는 기한이 있습니다. 근거를 모아 기한 안에 요청합니다.", "Disputes have a deadline. Gather evidence and ask within it.")),
      ],
      answer: "b",
      explanation: tx("이의 제기는 근거에서 시작합니다. 근거가 있어야 팀장도 QA에 다시 검토를 요청할 수 있습니다.", "A dispute starts with evidence. With evidence, the TL can ask QA for a re-review."),
    },
    {
      id: "dispute-q2",
      prompt: tx("다시 검토했지만 점수는 그대로입니다. 지민에게 알맞은 행동은 무엇일까요?", "After the re-review, the score stays the same. What fits best for Jimin?"),
      options: [
        option("a", tx("납득될 때까지 같은 건으로 다시 이의를 제기한다.", "Dispute the same case again until it makes sense."), tx("같은 근거로 다시 요청하면 결과는 같습니다. 이유를 듣고 기준을 이해합니다.", "The same evidence gets the same result. Hear the reason and understand the standard.")),
        option("b", tx("평가를 믿을 수 없으니 다음부터는 평가표를 보지 않는다.", "Stop reading score sheets from now on, since the scoring can't be trusted."), tx("평가표는 기준을 배우는 자료입니다. 결과가 마음에 들지 않아도 이유를 읽습니다.", "Score sheets are material for learning the standard. Read the reason even if you don't like the result.")),
        option("c", tx("결과의 이유를 듣고, 다음부터 그 기준으로 안내한다.", "Hear the reason for the result, and guide by that standard from now on.")),
      ],
      answer: "c",
      explanation: tx("결과가 그대로여도 이유를 들으면 기준을 알게 됩니다. 이의 제기는 기준을 이해하는 과정이기도 합니다.", "Even if the result stays, hearing the reason teaches you the standard. Disputing is also a way of understanding it."),
    },
  ],
  connection: { to: "outage", text: tx("마지막은 내 잘못이 아닌데 응대가 막히는 순간입니다. 다음은 시스템 장애 때의 절차입니다.", "The last one is when contacts get stuck through no fault of yours. Next is the procedure during a system outage.") },
};
