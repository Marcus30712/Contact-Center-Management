import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 4. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Four stages run down one column, like the other ring courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["work", "skills", "prepare", "selection"];
const flow = ["work", "skills", "prepare", "selection", "work-skills", "skills-prepare", "prepare-selection"];

export default {
  id: "tl",
  order: 4,
  title: tx("팀장", "Team Leader"),
  short: tx("팀장", "Team leader"),
  subtitle: tx("팀 전체가 목표에 닿게 이끕니다.", "Lead the whole team to its goals."),
  personaName: tx("지민", "Jimin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("work", "하는 일", 180, 36, "The work")),
      wide(node("skills", "필요한 역량", 180, 92, "Skills needed")),
      wide(node("prepare", "지금부터 준비", 180, 148, "Prepare now")),
      wide(node("selection", "뽑을 때 더 보는 것", 180, 204, "What else they look for")),
    ],
    edges: [edge("work", "skills"), edge("skills", "prepare"), edge("prepare", "selection")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀장이 무슨 일을 하는지, 상담사에서 팀장까지 어떤 길을 거치는지 아는 것입니다.", "This lesson is about knowing what a team leader does, and the path from agent to team leader."), flow, procedure, null),
    step(tx("지민은 매주 수진 팀장과 평가 리뷰를 합니다. 오늘은 리뷰가 끝난 뒤, 팀장이 되기까지 어떤 길을 걸었는지 물었습니다.", "Jimin has a score review with Sujin every week. Today, after the review, she asks what path Sujin took to become a team leader."), flow, [], null),
    step(tx("첫 단계는 하는 일입니다. 팀장은 팀원 10~15명(예시)의 성과를 관리하고, 코칭과 피드백으로 팀이 목표에 닿게 이끕니다. 스케줄과 근태를 챙기고 팀원의 고충을 듣는 것도 팀장의 일입니다.", "The first stage is the work. A team leader manages the results of 10 to 15 team members (Example) and leads the team to its goals through coaching and feedback. Looking after schedules and attendance, and hearing team members' concerns, are part of it too."), flow, ["work"], null),
    step(tx("매일 팀의 지표를 보고, 매주 평가 리뷰를, 매달 퍼포먼스 리뷰를 합니다. 위로는 부매니저와 매니저에게 팀의 결과와 문제를 보고합니다.", "They check the team's metrics every day, hold score reviews every week and performance reviews every month. Upward, they report the team's results and problems to the assistant manager and the operation manager."), flow, ["work"], null),
    step(tx("둘째 단계는 필요한 역량입니다. 성과 데이터를 읽는 힘과 사람을 관리하는 힘이 필요합니다. 무엇보다 팀원이 다시 해 보고 싶게 만드는 리더십과 피드백이 필요합니다.", "The second stage is the skills needed. You need to read performance data and to manage people. Above all, you need the leadership and feedback that make team members want to try again."), flow, ["skills"], null),
    step(tx("셋째 단계는 지금부터 준비하기입니다. 센터마다 다르지만, 상담사에서 바로 팀장이 되기보다 직무전문가로 일하며 팀장 백업을 맡아 본 뒤 가는 경우가 많습니다.", "The third stage is preparing now. It varies by center, but rather than going straight from agent to team leader, many work as an SME and serve as team leader backup first."), flow, ["prepare"], null),
    step(tx("상담사인 지금은 내 지표를 스스로 읽는 연습부터 합니다. 평가 리뷰 때 수진 팀장이 말하기 전에, 이번 주에 좋았던 점과 고칠 점을 먼저 말해 봅니다.", "As an agent, start by practicing reading your own metrics. In your score review, before Sujin speaks, say first what went well this week and what to fix."), flow, ["prepare"], null),
    step(tx("넷째 단계는 뽑을 때 더 보는 것입니다. 팀장을 뽑을 때는 직무전문가나 팀장 백업으로 사람을 이끌어 본 경험과 리더십 교육 이수를 봅니다. 팀원들이 이미 믿고 따르는 사람인지도 봅니다.", "The fourth stage is what else they look for. When choosing a team leader, they look at experience leading people as an SME or team leader backup, and completed leadership training. They also look at whether the team already trusts and follows you."), flow, ["selection"], null),
    step(tx("미소의 한마디: 저는 팀장이 되면 리더십이 저절로 생길 줄 알았어요. 상담사 때부터 동료의 이야기를 들어 주고 함께 방법을 찾던 사람이 결국 좋은 팀장이 되더라고요.", "A word from Miso: I thought leadership would just appear once I became a team leader. The people who listened to their peers and looked for answers with them as agents were the ones who became good team leaders."), flow, ["selection"], null),
  ],
  checkpoint: [
    {
      id: "tl-q1",
      prompt: tx("많은 센터에서 볼 수 있는, 상담사에서 팀장까지 가는 길은 무엇일까요?", "Which path from agent to team leader is common in many centers?"),
      options: [
        option("a", tx("상담사 → 팀장(팀원 관리 경험) → 직무전문가", "Agent → team leader (managing a team) → SME"), tx("직무전문가는 대개 팀장으로 가기 전에 거치는 자리입니다.", "SME is usually the role you hold before becoming a team leader.")),
        option("b", tx("입사 직후 팀장 교육(리더십 과정) → 팀장", "Team leader training (leadership course) right after joining → team leader"), tx("상담사가 겪는 일을 알아야 팀을 이끌 수 있어서, 대개 현장 경험부터 쌓습니다.", "You need to know what agents go through to lead a team, so people usually build floor experience first.")),
        option("c", tx("상담사 → 직무전문가(팀장 백업) → 팀장", "Agent → SME (team leader backup) → team leader")),
      ],
      answer: "c",
      explanation: tx("직무전문가로 동료를 돕고 팀장 자리를 대신 맡아 보는 경험이 팀장으로 가는 다리가 됩니다. 센터마다 다를 수 있습니다.", "Helping peers as an SME and covering for the team leader is the bridge to team leader. It may differ by center."),
    },
    {
      id: "tl-q2",
      prompt: tx("팀장을 꿈꾸는 상담사 지민이 지금 할 수 있는 것은 무엇일까요?", "What can Jimin, an agent who dreams of becoming a team leader, do now?"),
      options: [
        option("a", tx("평가 리뷰에서 내 지표를 먼저 읽고 스스로 설명해 본다.", "In the score review, read her own metrics first and explain them herself.")),
        option("b", tx("지표 읽는 법은 팀장이 되면 배우면 되니, 지금은 내 콜만 신경 쓴다.", "She can learn to read metrics once she's a team leader, so for now she focuses only on her own calls."), tx("내 지표를 읽는 연습이 나중에 팀원의 지표를 읽는 힘이 됩니다.", "Practicing reading your own metrics becomes the ability to read team members' metrics later.")),
        option("c", tx("동료들의 지각을 대신 챙겨 팀장에게 알린다.", "Keep track of colleagues' lateness and report it to the team leader."), tx("근태 관리는 팀장의 일입니다. 동료를 지켜보는 모습은 오히려 믿음을 잃게 합니다.", "Managing attendance is the team leader's job. Watching colleagues tends to cost their trust.")),
      ],
      answer: "a",
      explanation: tx("팀장의 일은 지표를 읽고 사람과 이야기하는 것입니다. 내 지표를 스스로 읽는 데서부터 연습할 수 있습니다.", "A team leader's work is reading metrics and talking with people. You can start practicing by reading your own metrics."),
    },
  ],
  connection: { to: "ready", text: tx("네 자리를 모두 둘러봤습니다. 마지막으로, 어느 자리든 뽑을 때 공통으로 보는 것을 미소에게 듣습니다.", "You've looked at all four roles. Last, hear from Miso what every role looks for.") },
};
