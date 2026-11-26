import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 5. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["attendance", "trend", "huddle", "report"];
const flow = [...procedure, "attendance-trend", "trend-huddle", "huddle-report"];

export default {
  id: "lead",
  order: 5,
  title: tx("팀장 서포트", "Supporting the Team Leader"),
  short: tx("팀장 서포트", "TL support"),
  subtitle: tx("출석 관리, 트렌드 요약, 허들을 나눠 맡습니다.", "Take on attendance, trend summaries and huddles."),
  procedure,
  diagram: {
    nodes: [
      wide(node("attendance", "출석 관리", 180, 36, "Attendance")),
      wide(node("trend", "트렌드 요약", 180, 92, "Trend summary")),
      wide(node("huddle", "허들 진행", 180, 148, "Run the huddle")),
      wide(node("report", "팀장에게 보고", 180, 204, "Report to the TL")),
    ],
    edges: [edge("attendance", "trend"), edge("trend", "huddle"), edge("huddle", "report")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀장의 일을 부분적으로 나눠 맡아, 팀장이 코칭과 팀 관리에 시간을 쓰도록 돕는 것입니다. 대표적인 일은 세 가지입니다.", "This lesson is about taking on part of the team leader's work so the team leader can spend time on coaching and running the team. There are three typical tasks."), flow, procedure, null),
    step(tx("수진 팀장은 12명(예시) 팀을 맡고 있고, 오늘은 오후 내내 고객사 미팅에 들어갑니다.", "Sujin leads a team of 12 people (Example), and today she is in client meetings all afternoon."), flow, [], null),
    step(tx("첫째는 출석 관리입니다. 팀원이 많거나 팀장이 자리에 없을 때 직무전문가가 출석을 대신 확인합니다. 근무 시작 시각에 자리에 없는 사람과 지각, 결근 연락을 기록합니다.", "The first is attendance. When the team is large or the team leader is away, the SME checks attendance instead. You note who is not at their desk at start time, and any late or absence messages."), flow, ["attendance"], null),
    step(tx("대행은 기록하고 알리는 데까지입니다. 사유를 판단하거나 근태 조치를 정하는 것은 팀장이 합니다. 결근이 늘어 인원이 부족하면 팀장과 RTA에게 바로 알립니다.", "Covering means recording and reporting, nothing more. The team leader judges the reasons and decides on attendance action. If absences leave the team short, tell the team leader and the RTA right away."), flow, ["attendance"], null),
    step(tx("둘째는 스크러빙 트렌드 요약입니다. 매일 스크러빙한 티켓에서 상담사별로 반복되는 모습을 모아, 정해진 날(예시: 매주 금요일)에 짧게 정리해 팀장이 코칭에 바로 쓸 수 있게 합니다.", "The second is the scrubbing trend summary. From the tickets you scrub each day, collect what keeps showing up for each agent, and sum it up briefly on the agreed day (Example: every Friday) so the team leader can use it right away for coaching."), flow, ["trend"], null),
    step(tx("요약은 사실과 사례로 씁니다. 예를 들어 \"지민: 이번 주 환불 문의 3건(예시)에서 같은 확인 단계를 빠뜨림\"처럼 쓰고 티켓 번호를 붙이면, 팀장이 코칭에 바로 씁니다.", "Write the summary with facts and examples. For example, \"Jimin: skipped the same check step in 3 refund contacts (Example) this week,\" with the ticket numbers, is something the team leader can coach from right away."), flow, ["trend"], null),
    step(tx("사람에 대한 평가 대신 행동을 적습니다. \"꼼꼼하지 않다\"가 아니라 \"확인 단계를 건너뛰었다\"고 씁니다.", "Write down behavior, not judgments about people. Not \"careless,\" but \"skipped the check step.\""), flow, ["trend"], null),
    step(tx("셋째는 허들 진행입니다. 고객사가 정책이나 프로모션 업데이트를 보내오면 직무전문가가 허들에서 팀에 전합니다.", "The third is running the huddle. When the client sends a policy or promotion update, the SME passes it to the team in the huddle."), flow, ["huddle"], null),
    step(tx("허들 전에 내용을 먼저 이해하고, 상담사가 고객에게 어떻게 말하면 되는지까지 준비합니다. 허들에서 나온 질문은 답을 정리해 팀 채팅방에 다시 올립니다.", "Before the huddle, understand the update yourself and prepare how agents should explain it to customers. Questions raised in the huddle get answers posted back in the team chat."), flow, ["huddle"], null),
    step(tx("마지막으로 팀장에게 보고합니다. 팀장이 돌아왔을 때 무엇이 있었는지 한눈에 알 수 있도록 출석, 요약, 허들 내용을 짧게 전합니다.", "Last, report to the team leader. Pass on attendance, the summary and the huddle briefly, so the team leader sees at a glance what happened while she was away."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "lead-q1",
      prompt: tx("팀장이 자리에 없는 동안 한 상담사가 30분 늦게 와서 사유를 설명합니다. 어떻게 할까요?", "While the team leader is away, an agent arrives 30 minutes late and explains why. What do you do?"),
      options: [
        option("a", tx("사유가 타당해 보이니 지각 기록에서 뺀다.", "Leave it off the late record, since the reason sounds fair."), tx("사유를 판단하는 것은 팀장의 일입니다. 직무전문가가 빼 주면 같은 사유를 가진 다른 사람과 기준이 달라질 수 있습니다.", "Judging the reason is the team leader's job. If the SME excuses it, the standard can differ for someone else with the same reason.")),
        option("b", tx("도착 시각과 사유를 그대로 기록해 팀장에게 전한다.", "Record the arrival time and the reason as given, and pass them to the team leader.")),
        option("c", tx("같은 일이 반복되지 않게, 다시 늦으면 팀장에게 보고하겠다고 경고한다.", "So it doesn't happen again, warn them you'll report it to the team leader next time."), tx("경고 같은 근태 조치는 팀장의 몫입니다. 대행은 기록하고 알리는 데까지입니다.", "Attendance action like a warning belongs to the team leader. Covering means recording and reporting, nothing more.")),
      ],
      answer: "b",
      explanation: tx("출석 대행은 사실을 기록하고 전하는 일입니다. 판단과 조치는 팀장이 합니다.", "Covering attendance means recording the facts and passing them on. The team leader judges and acts."),
    },
    {
      id: "lead-q2",
      prompt: tx("팀장에게 건넬 스크러빙 트렌드 요약에 알맞은 것은 무엇일까요?", "What belongs in the scrubbing trend summary you give the team leader?"),
      options: [
        option("a", tx("상담사마다 성격과 태도를 한 줄로 평가한다.", "A one-line rating of each agent's personality and attitude."), tx("성격 평가는 근거가 없고, 코칭에서 바꿀 행동을 알려 주지 않습니다.", "A personality rating has no evidence and does not show what behavior to coach.")),
        option("b", tx("상담사별로 반복된 행동과 그 티켓 번호를 적는다.", "The behavior that repeated for each agent, with the ticket numbers.")),
        option("c", tx("이번 주 품질 점수 순위표를 만들어 낮은 순서로 코칭 대상을 표시한다.", "A ranking of this week's quality scores, marking coaching targets from the bottom up."), tx("순위는 누가 낮은지만 알려 줄 뿐, 무엇을 코칭해야 하는지는 알려 주지 않습니다.", "A ranking shows only who is low, not what to coach.")),
      ],
      answer: "b",
      explanation: tx("행동과 사례가 있어야 팀장이 무엇을 코칭할지 바로 정할 수 있습니다.", "Behavior and examples let the team leader decide right away what to coach."),
    },
  ],
  connection: { to: "priority", text: tx("신입, 기존 상담사, 선임, 팀장까지. 이 요청들은 차례로 오지 않고 한꺼번에 옵니다.", "New hires, experienced agents, seniors, the team leader. These requests do not come one at a time; they come all at once.") },
};
