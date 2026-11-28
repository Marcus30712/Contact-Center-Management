import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 7. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["request", "name", "handover", "return"];
const flow = ["request", "name", "handover", "return", "request-name", "name-handover", "handover-return"];

export default {
  id: "backup",
  order: 7,
  title: tx("팀장 휴가와 백업 지정", "Team Leader Leave and Naming a Backup"),
  short: tx("팀장 백업", "TL backup"),
  subtitle: tx("팀장이 자리를 비우는 동안 팀을 맡을 사람을 정하고, 인수인계를 확인합니다.", "Name who looks after the team while the team leader is away, and check the handover."),
  roles: tx("팀장 → 부매니저 → 백업", "Team leader → AM → Backup"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("request", "미리 신청", 180, 36, "Request early")),
      wide(node("name", "백업 지정", 180, 92, "Name a backup")),
      wide(node("handover", "인수인계", 180, 148, "Hand over")),
      wide(node("return", "복귀 확인", 180, 204, "Check the return")),
    ],
    edges: [edge("request", "name"), edge("name", "handover"), edge("handover", "return")],
  },
  steps: [
    step(tx("이 절차의 목적은 팀장이 휴가나 교육으로 자리를 비우는 동안 팀이 흔들리지 않게 백업을 정하고, 인수인계를 확인하는 것입니다.", "This procedure exists to name a backup while a team leader is away on leave or training, so the team stays steady, and to check the handover."), flow, procedure, null),
    step(tx("첫 단계는 미리 신청입니다. 팀장은 정해진 기한(예시: 2주 전)까지 민석에게 휴가를 신청합니다. 민석은 같은 기간에 다른 팀장의 휴가와 고객사 일정이 겹치지 않는지 봅니다.", "The first step is requesting early. Team leaders request leave from Minseok by the set deadline (Example: 2 weeks before). Minseok checks that it doesn't overlap with other team leaders' leave or client dates."), flow, ["request"], null),
    step(tx("둘째 단계는 백업 지정입니다. 수진 팀장의 휴가 동안 하린 직무전문가가 허들, 실시간 응대 관리, 상담사 질문 같은 현장 실무를 대행합니다. 팀원과 마켓 정보의 취합, 보고서 제출, 고객사 보고는 민석이 대행합니다.", "The second step is naming a backup. While Sujin is on leave, Harin the SME covers the floor work: huddles, real-time queue management and agents' questions. Minseok covers gathering team and market information, submitting reports and reporting to the client."), flow, ["name"], null),
    step(tx("셋째 단계는 인수인계입니다. 수진 팀장은 현장 일은 하린에게, 보고 일정과 양식은 민석에게 넘깁니다. 진행 중인 코칭, 에스컬레이션, 주의할 팀원 목록은 셋이 함께 봅니다.", "The third step is handing over. Sujin hands floor work to Harin and the report schedule and templates to Minseok. The three of them go through ongoing coaching, escalations and the list of agents to watch together."), flow, ["handover"], null),
    step(tx("신임 팀장 태오가 휴가를 갈 때는 경험이 있는 유키 팀장이 미국 마켓의 백업 직무전문가에게 현장 조언을 해 주게 하는 것도 방법입니다. 취합과 보고는 그대로 민석이 맡고, 백업이 처음인 사람에게는 하루 한 번(예시) 상황을 묻습니다.", "When new team leader Taeo goes on leave, having experienced team leader Yuki give floor advice to the US market's backup SME is one option. Gathering and reporting stay with Minseok, and he checks in once a day (Example) with anyone backing up for the first time."), flow, ["handover"], null),
    step(tx("넷째 단계는 복귀 확인입니다. 팀장이 돌아오면 하린은 현장에서 있었던 일과 남은 일을, 민석은 대신 낸 보고와 고객사의 답을 넘깁니다.", "The fourth step is checking the return. When the team leader is back, Harin hands over what happened on the floor and what's left, and Minseok hands over the reports he sent and the client's answers."), flow, ["return"], null),
    step(tx("백업을 맡은 하린의 경험은 팀장 승진 준비의 기록이 됩니다. 민석은 잘한 점과 다음에 더 맡겨 볼 일을 적어 둡니다.", "Harin's time as backup becomes part of her record as she prepares to become a team leader. Minseok notes what she did well and what to give her next time."), flow, ["return"], null),
    step(tx("미소의 한마디: 보고까지 직무전문가에게 맡겼더니, 팀장 휴가 중에 고객사 주간 보고가 빠졌어요. 그 뒤로 현장은 백업에게, 보고는 제가 맡았어요.", "A word from Miso: I once left the reports to the SME too, and the client's weekly report was missed while the team leader was on leave. After that, the backup took the floor and I took the reports."), flow, ["return"], null),
  ],
  checkpoint: [
    {
      id: "backup-q1",
      prompt: tx("수진 팀장이 다음 주 휴가를 갑니다. 하린을 백업으로 정한 뒤 민석이 꼭 할 일은 무엇일까요?", "Sujin goes on leave next week. After naming Harin as backup, what must Minseok do?"),
      options: [
        option("a", tx("보고서 취합과 제출까지 수진 팀장의 일을 모두 하린에게 넘긴다.", "Hand Harin all of Sujin's work, including gathering and submitting reports."), tx("보고서 취합과 제출까지 맡기면 하린이 현장을 볼 시간이 없고, 고객사 보고가 빠지기 쉽습니다.", "Give her gathering and submitting reports too, and Harin has no time for the floor and client reports slip.")),
        option("b", tx("휴가 동안 한국 마켓의 일을 민석이 모두 직접 챙긴다.", "Minseok takes care of all the Korean market's work himself during the leave."), tx("민석이 다 맡으면 다른 마켓을 놓치고, 하린의 백업 경험도 사라집니다.", "If Minseok takes it all, he loses sight of the other markets, and Harin loses her backup experience.")),
        option("c", tx("현장 실무는 하린에게, 취합과 보고 제출, 고객사 보고는 민석이 맡는다.", "Harin takes the floor work, and Minseok takes gathering, report submission and client reports.")),
      ],
      answer: "c",
      explanation: tx("직무전문가 백업은 현장 실무를 맡고, 팀원과 마켓 정보의 취합, 보고 제출, 고객사 보고는 부매니저가 대행합니다.", "An SME backup takes the floor work, and the AM covers gathering team and market information, submitting reports and reporting to the client."),
    },
    {
      id: "backup-q2",
      prompt: tx("팀장 휴가 신청이 들어왔을 때 민석이 먼저 확인할 것은 무엇일까요?", "When a team leader's leave request comes in, what does Minseok check first?"),
      options: [
        option("a", tx("같은 기간 다른 팀장의 휴가와 고객사 일정이 겹치지 않는지", "Whether it overlaps with other team leaders' leave or client dates")),
        option("b", tx("휴가를 가는 이유가 꼭 필요한 일인지", "Whether the reason for the leave is really necessary"), tx("휴가 사유를 따지는 것은 부매니저의 일이 아닙니다. 팀 운영에 겹치는 일정이 있는지를 봅니다.", "Questioning the reason for leave isn't the AM's job. Look for dates that clash with running the team.")),
        option("c", tx("휴가 동안에도 팀장이 메신저로 급한 연락을 받을 수 있는지", "Whether the team leader can still take urgent messages during the leave"), tx("휴가 중 연락을 기대하면 쉬지 못합니다. 백업과 인수인계로 대신합니다.", "Expect contact during leave, and they can't rest. A backup and a handover take its place.")),
      ],
      answer: "a",
      explanation: tx("겹치는 휴가와 고객사 일정을 먼저 보고, 백업과 인수인계로 공백을 메웁니다.", "Look first at overlapping leave and client dates, and fill the gap with a backup and a handover."),
    },
  ],
  connection: { to: "cover", text: tx("매니저가 자리를 비울 때는 부매니저가 대신합니다. 마지막은 매니저 대행 인수인계 절차입니다.", "When the manager is away, the AM covers. Last is the procedure for covering for the manager and handing back.") },
};
