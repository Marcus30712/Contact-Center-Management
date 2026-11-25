import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 3. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["gather", "repeat", "line", "report"];
const flow = ["gather", "repeat", "line", "report", "gather-repeat", "repeat-line", "line-report"];

export default {
  id: "trend",
  order: 3,
  title: tx("상담 트렌드 요약 보고", "Contact Trend Summary Report"),
  short: tx("트렌드 요약", "Trend summary"),
  subtitle: tx("스크러빙에서 본 것을 팀장이 코칭에 바로 쓸 수 있게 정리합니다.", "Turn what you saw in scrubbing into something the team leader can use for coaching right away."),
  roles: tx("직무전문가 → 팀장", "SME → Team leader"),
  procedure,
  diagram: {
    nodes: [
      wide(node("gather", "모으기", 180, 36, "Gather")),
      wide(node("repeat", "반복 찾기", 180, 92, "Find repeats")),
      wide(node("line", "한 줄로 쓰기", 180, 148, "One line each")),
      wide(node("report", "보고하기", 180, 204, "Report")),
    ],
    edges: [edge("gather", "repeat"), edge("repeat", "line"), edge("line", "report")],
  },
  steps: [
    step(tx("이 절차의 목적은 스크러빙에서 본 상담사별 반복 행동을 정리해, 팀장이 누구를 무엇으로 코칭할지 바로 정하게 돕는 것입니다.", "This procedure exists to sum up each agent's repeated behaviors seen in scrubbing, so the team leader can decide right away whom to coach on what."), flow, procedure, null),
    step(tx("수진 팀장은 매주 금요일(예시) 이 요약을 받아 다음 주 코칭 계획을 세웁니다.", "Sujin, the team leader, gets this summary every Friday (Example) and plans the next week's coaching."), flow, [], null),
    step(tx("첫 단계는 모으기입니다. 한 주 동안 스크러빙 시트에 적은 원인 가운데 상담사의 행동에서 나온 것을 상담사별로 모읍니다.", "The first step is gathering. From the causes you logged in the scrubbing sheet this week, gather those that came from agents' behavior, by agent."), flow, ["gather"], null),
    step(tx("둘째 단계는 반복 찾기입니다. 같은 행동이 두 번 이상(예시) 나온 것만 트렌드로 봅니다. 한 번은 실수이고, 반복은 코칭할 행동입니다.", "The second step is finding repeats. Only a behavior seen twice or more (Example) counts as a trend. Once is a mistake; a repeat is a behavior to coach."), flow, ["repeat"], null),
    step(tx("셋째 단계는 한 줄로 쓰기입니다. 사람, 행동, 횟수, 티켓 번호를 적습니다. 예를 들어 \"지민: 환불 문의 3건(예시)에서 본인 확인 다음 단계 누락\"처럼 씁니다.", "The third step is writing one line each. Note the person, the behavior, how often, and the ticket numbers. For example, write \"Jimin: missed the step after identity verification in 3 refund contacts (Example).\""), flow, ["line"], null),
    step(tx("성격이나 태도가 아니라 행동을 씁니다. 점수를 매기거나 순위를 만들지 않고, 코칭으로 바꿀 수 있는 것만 담습니다.", "Write behaviors, not personality or attitude. Don't score or rank; include only what coaching can change."), flow, ["line"], null),
    step(tx("넷째 단계는 보고하기입니다. 정해진 날 수진 팀장에게 보냅니다. 여러 사람에게 같은 행동이 나왔다면 따로 묶어 허들 주제로 제안합니다.", "The fourth step is reporting. Send it to Sujin on the agreed day. If several people show the same behavior, group it separately and suggest it as a huddle topic."), flow, ["report"], null),
    step(tx("준호처럼 다른 상담사를 잘 돕는 모습이 반복되면 그것도 적습니다. 요약은 고칠 점만이 아니라 팀장이 칭찬하고 키울 사람도 알려 줍니다.", "If Junho keeps helping other agents well, write that down too. The summary tells the team leader not only what to fix but also whom to praise and grow."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "trend-q1",
      prompt: tx("이번 주 서준의 티켓 한 건에서 확인 단계 누락을 봤습니다. 요약에 어떻게 담을까요?", "This week you saw a missed check step in one of Seojun's tickets. How does it go into the summary?"),
      options: [
        option("a", tx("서준의 트렌드로 적는다.", "Write it as Seojun's trend."), tx("한 번은 아직 트렌드가 아닙니다. 다음 주에도 나오는지 봅니다.", "Once is not yet a trend. See whether it shows up again next week.")),
        option("b", tx("서준에게 짧게 알려 주고, 반복될 때 요약에 담는다.", "Tell Seojun briefly, and add it to the summary when it repeats.")),
        option("c", tx("팀 전체 문제로 허들에 올린다.", "Raise it at the huddle as a team-wide issue."), tx("한 사람의 한 번 실수를 팀 전체 문제로 올리면, 다른 상담사에게는 필요 없는 이야기가 됩니다.", "Raising one person's one-time mistake as a team issue gives everyone else a talk they don't need.")),
      ],
      answer: "b",
      explanation: tx("반복된 행동만 트렌드로 요약합니다.", "Only repeated behaviors go into the summary as trends."),
    },
    {
      id: "trend-q2",
      prompt: tx("이번 주 팀원 다섯 명에게서 같은 안내 실수가 나왔습니다. 어떻게 할까요?", "This week the same explanation mistake came up with five team members. What do you do?"),
      options: [
        option("a", tx("다섯 명을 각각 한 줄씩만 적는다.", "Just write one line for each of the five."), tx("각각만 적으면 팀 공통 문제라는 것이 보이지 않습니다.", "Separate lines hide that it's a team-wide problem.")),
        option("b", tx("팀 공통 트렌드로 묶어 허들 주제로 제안하고, 원인이 문서라면 지식 베이스 업데이트도 요청한다.", "Group it as a team-wide trend, suggest it as a huddle topic, and if the cause is a document, request a knowledge base update too.")),
        option("c", tx("다섯 명에게 각각 주의를 준다.", "Warn each of the five."), tx("주의나 경고는 팀장의 몫입니다. 여러 명이 같다면 원인이 사람보다 문서나 교육에 있을 수 있습니다.", "Cautions and warnings are the team leader's call. When several people make the same mistake, the cause may lie in a document or training rather than the people.")),
      ],
      answer: "b",
      explanation: tx("여러 사람에게 같은 실수가 나오면 사람보다 원인을 먼저 봅니다.", "When several people make the same mistake, look at the cause before the people."),
    },
  ],
  connection: { to: "attendance", text: tx("팀장을 돕는 일은 요약만이 아닙니다. 팀장이 자리에 없을 때는 출석도 대신 확인합니다.", "Supporting the team leader isn't only summaries. When the team leader is away, you also check attendance.") },
};
