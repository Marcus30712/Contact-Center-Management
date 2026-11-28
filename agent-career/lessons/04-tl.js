import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 4. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Stages run down one column.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["work", "skills"];
const flow = ["work", "skills", "work-skills"];

export default {
  id: "tl",
  order: 4,
  title: tx("팀장", "Team Leader"),
  short: tx("팀장", "Team Leader"),
  subtitle: tx("팀 전체가 목표에 닿게 이끕니다.", "Lead the whole team to its goals."),
  personaName: tx("지민", "Jimin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("work", "하는 일", 180, 36, "The work")),
      wide(node("skills", "필요한 역량", 180, 92, "Skills needed")),
    ],
    edges: [edge("work", "skills")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀장이 무슨 일을 하고, 어떤 역량이 필요한지 아는 것입니다.", "This lesson is about knowing what a TL does and what skills the role needs."), flow, procedure, null),
    step(tx("지민은 매주 수진 팀장과 평가 리뷰를 합니다. 오늘은 리뷰가 끝난 뒤, 팀장이 하루를 어떻게 보내는지 물었습니다.", "Jimin has a score review with Sujin every week. Today, after the review, she asks how a TL spends the day."), flow, [], null),
    step(tx("첫 단계는 하는 일입니다. 팀장은 팀원 10~15명(예시)의 성과를 관리하고, 코칭과 피드백으로 팀이 목표에 닿게 이끕니다. 스케줄과 근태를 챙기고 팀원의 고충을 듣는 것도 팀장의 일입니다.", "The first stage is the work. A TL manages the results of 10 to 15 team members (Example) and leads the team to its goals through coaching and feedback. Looking after schedules and attendance, and hearing team members' concerns, are part of it too."), flow, ["work"], null),
    step(tx("매일 팀의 지표를 보고, 매주 평가 리뷰를, 매달 퍼포먼스 리뷰를 합니다. 위로는 부매니저와 매니저에게 팀의 결과와 문제를 보고합니다.", "They check the team's metrics every day, hold score reviews every week and performance reviews every month. Upward, they report the team's results and problems to the assistant manager and the operation manager."), flow, ["work"], null),
    step(tx("둘째 단계는 필요한 역량입니다. 성과 데이터를 읽는 힘과 사람을 관리하는 힘이 필요합니다. 무엇보다 팀원이 다시 해 보고 싶게 만드는 리더십과 피드백이 필요합니다.", "The second stage is the skills needed. You need to read performance data and to manage people. Above all, you need the leadership and feedback that make team members want to try again."), flow, ["skills"], null),
    step(tx("센터마다 다르지만, 상담사에서 바로 팀장이 되기보다 직무전문가로 일하며 팀장 백업을 맡아 본 뒤 가는 경우가 많습니다.", "It varies by center, but rather than going straight from agent to TL, many work as an SME and serve as TL backup first."), flow, ["skills"], null),
    step(tx("미소의 한마디: 저는 팀장이 되면 리더십이 저절로 생길 줄 알았어요. 상담사 때부터 동료의 이야기를 들어 주고 함께 방법을 찾던 사람이 결국 좋은 팀장이 되더라고요.", "A word from Miso: I thought leadership would just appear once I became a TL. The people who listened to their peers and looked for answers with them as agents were the ones who became good TLs."), flow, ["skills"], null),
  ],
  checkpoint: [
    {
      id: "tl-q1",
      prompt: tx("많은 센터에서 볼 수 있는, 상담사에서 팀장까지 가는 길은 무엇일까요?", "Which path from agent to TL is common in many centers?"),
      options: [
        option("a", tx("상담사 → 팀장(팀원 관리 경험) → 직무전문가", "Agent → TL (managing a team) → SME"), tx("직무전문가는 대개 팀장으로 가기 전에 거치는 자리입니다.", "SME is usually the role you hold before becoming a TL.")),
        option("b", tx("입사 직후 팀장 교육(리더십 과정) → 팀장", "TL training (leadership course) right after joining → TL"), tx("상담사가 겪는 일을 알아야 팀을 이끌 수 있어서, 대개 현장 경험부터 쌓습니다.", "You need to know what agents go through to lead a team, so people usually build floor experience first.")),
        option("c", tx("상담사 → 직무전문가(팀장 백업) → 팀장", "Agent → SME (TL backup) → TL")),
      ],
      answer: "c",
      explanation: tx("직무전문가로 동료를 돕고 팀장 자리를 대신 맡아 보는 경험이 팀장으로 가는 다리가 됩니다. 센터마다 다를 수 있습니다.", "Helping peers as an SME and covering for the TL is the bridge to TL. It may differ by center."),
    },
    {
      id: "tl-q2",
      prompt: tx("팀 지표가 이번 주 크게 떨어졌습니다. 수진 팀장에게 알맞은 행동은 무엇일까요?", "The team's metrics dropped sharply this week. What fits best for Sujin, the TL?"),
      options: [
        option("a", tx("원인을 확인하고, 부매니저에게 결과와 계획을 보고한다.", "Check the cause and report the results and a plan to the assistant manager.")),
        option("b", tx("보고는 다음 주로 미루고, 회복되는지 지켜본다.", "Hold off on reporting until next week and see if it recovers."), tx("늦게 알면 위에서도 도울 수 없습니다. 원인과 계획을 함께 바로 보고합니다.", "If they hear late, the people above can't help. Report the cause and the plan together, right away.")),
        option("c", tx("지표가 낮은 팀원들을 불러, 바로 경고를 준다.", "Call in the team members with low metrics and warn them right away."), tx("원인을 확인하기 전에 경고부터 하면 팀원의 믿음을 잃습니다. 원인이 먼저입니다.", "Warning people before checking the cause costs their trust. The cause comes first.")),
      ],
      answer: "a",
      explanation: tx("팀장은 팀의 결과와 문제를 위로 보고하는 사람입니다. 원인과 계획을 함께 알리면 위에서도 도울 수 있습니다.", "A TL reports the team's results and problems upward. Sharing the cause and plan together lets the people above help."),
    },
  ],
  connection: { to: "home", text: tx("상담사 커리어 라이프사이클을 마쳤습니다. 오늘의 출석과 이번 주 평가 리뷰가 다음 자리를 위한 준비의 시작입니다.", "You've finished Agent Career Lifecycle. Today's attendance and this week's score review are where preparing for your next role begins.") },
};
