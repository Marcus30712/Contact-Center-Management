import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 서포트 라이프사이클, lesson 5. Copy: docs/superpowers/specs/2026-11-25-tl-support-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["handover", "getback", "help", "stepin"];
const flow = ["handover", "getback", "help", "stepin", "handover-getback", "getback-help", "help-stepin"];

export default {
  id: "team",
  order: 5,
  title: tx("팀 전체 지원", "Supporting the Whole Team"),
  short: tx("팀 전체", "Whole team"),
  subtitle: tx("허들과 팀 회의로 같은 목표를 보게 하고, 역할 사이를 잇습니다.", "Use huddles and team meetings to keep everyone on the same goal, and connect the roles."),
  personaName: tx("하린", "Harin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("handover", "맡기기", 180, 36, "Hand over")),
      wide(node("getback", "받기", 180, 92, "Get back")),
      wide(node("help", "돕기", 180, 148, "Help")),
      wide(node("stepin", "개입하기", 180, 204, "Step in")),
    ],
    edges: [edge("handover", "getback"), edge("getback", "help"), edge("help", "stepin")],
  },
  steps: [
    step(tx("이 레슨의 목적은 상담사, 직무전문가, QA, 트레이너가 따로 움직이지 않고 한 팀으로 같은 목표를 보도록 팀장이 잇는 절차를 보는 것입니다.", "This lesson looks at how a TL connects agents, the SME, QA and trainers so they work as one team toward the same goal instead of separately."), flow, procedure, null),
    step(tx("첫 단계는 맡기기입니다. 팀 목표를 모두가 아는 말로 정하고, 각 역할이 그 목표에 어떻게 기여하는지 알려 줍니다.", "The first stage is handing over. Set the team goal in words everyone understands, and show how each role contributes to it."), flow, ["handover"], null),
    step(tx("둘째 단계는 받기입니다. 정기적인 팀 회의(예시: 주 1회)에서 직무전문가, QA, 트레이너가 본 것을 함께 나눕니다. 따로 들으면 놓치는 연결이 한자리에서 보입니다.", "The second stage is getting back. At regular team meetings (Example: once a week), have the SME, QA and the trainer share what they've seen. Connections you miss when you hear them separately show up in one room."), flow, ["getback"], null),
    step(tx("예를 들어 하린은 환불 문의가 늘었다고 하고, 도현은 환불 안내 감점이 늘었다고 하고, 유나는 환불 교육이 지난 정책 기준이라고 말합니다. 세 사람의 이야기가 한 원인을 가리킵니다.", "For example, Harin says refund contacts are up, Dohyun says points lost on refund explanations are up, and Yuna says the refund training is based on the old policy. The three stories point to one cause."), flow, ["getback"], null),
    step(tx("셋째 단계는 돕기입니다. 매일 허들에서 오늘의 우선순위와 바뀐 정책을 짧게 전하고, 잘한 사람과 잘한 일을 구체적으로 칭찬합니다.", "The third stage is helping. At the daily huddle, briefly share today's priorities and policy changes, and praise specific people for specific work."), flow, ["help"], null),
    step(tx("넷째 단계는 개입하기입니다. 상담사와 QA가 평가를 두고 부딪히는 것처럼 역할 사이에 갈등이 생기면, 팀장이 양쪽 이야기를 듣고 QA와 캘리브레이션으로 기준을 다시 맞춥니다.", "The fourth stage is stepping in. When roles clash, for example an agent and QA disagreeing over a score, the TL hears both sides and brings everyone back to one standard through calibration with QA."), flow, ["stepin"], null),
    step(tx("팀의 결과는 정해진 주기로 부매니저에게 보고하고, 받은 방침을 다시 팀 목표로 바꿔 전합니다. 팀장은 위와 아래를 잇는 자리입니다.", "Report the team's results to your assistant manager on a set cycle, and turn the direction you get back into team goals. The TL is the link between above and below."), flow, ["stepin"], null),
    step(tx("이렇게 한 바퀴를 돌면 다시 한 사람씩 볼 차례입니다. 팀 전체에서 보인 것이 다음 상담사 지원의 출발점이 됩니다.", "After one round like this, it's time to look at one person at a time again. What you saw across the team is where the next round of agent support begins."), flow, ["stepin"], null),
  ],
  checkpoint: [
    {
      id: "team-q1",
      prompt: tx("직무전문가, QA, 트레이너가 각각 다른 문제를 이야기합니다. 팀장이 먼저 할 일은 무엇일까요?", "The SME, QA and the trainer each raise a different problem. What should the TL do first?"),
      options: [
        option("a", tx("각자 맡은 분야는 알아서 해결하고 결과만 알려 달라고 한다.", "Tell each to sort out their own area and just report back."), tx("따로 풀면 같은 원인을 세 번 다르게 고치게 됩니다.", "Solving them separately means fixing the same cause three different ways.")),
        option("b", tx("원인이 하나일 수 있으니, 한자리에 모아 함께 본다.", "The problems may share a cause, so bring them together and look at them jointly.")),
        option("c", tx("숫자가 가장 나쁜 문제 하나만 골라 먼저 고친다.", "Pick only the problem with the worst numbers and fix it first."), tx("연결된 문제라면 하나만 고쳐서는 다시 생깁니다.", "If the problems are connected, fixing just one lets them come back.")),
      ],
      answer: "b",
      explanation: tx("역할 사이를 잇는 것이 팀장의 일입니다.", "Connecting the roles is the TL's job."),
    },
    {
      id: "team-q2",
      prompt: tx("허들에서 칭찬할 때 알맞은 것은 무엇일까요?", "What fits when giving praise at the huddle?"),
      options: [
        option("a", tx("\"다들 수고했어요. 이번 주도 목표를 넘겼으니 오늘도 힘내 봐요!\"", "\"Thanks for your hard work, everyone. We beat the target again this week, so let's keep it up today!\""), tx("누가 무엇을 잘했는지 모르면 무엇을 계속해야 할지 알 수 없습니다.", "If no one knows who did what well, no one knows what to keep doing.")),
        option("b", tx("\"어제 지민이 어려운 환불 건을 끝까지 해결해 감사 메일을 받았어요.\"", "\"Yesterday Jimin saw a tough refund case through to the end and got a thank-you email.\"")),
        option("c", tx("칭찬은 다른 팀원이 비교당하지 않도록 1:1에서만 따로 한다.", "Give praise only in one-on-ones, so other team members don't feel compared."), tx("팀 앞에서 하는 칭찬은 무엇이 좋은 일인지 모두에게 보여 줍니다. 지적은 1:1로, 칭찬은 함께 합니다.", "Praise in front of the team shows everyone what good work looks like. Correct in private; praise together.")),
      ],
      answer: "b",
      explanation: tx("칭찬은 구체적으로, 팀 앞에서 합니다.", "Give praise specifically, in front of the team."),
    },
  ],
  connection: { to: "home", text: tx("팀장 서포트 라이프사이클을 마쳤습니다. 팀장이 따르는 절차는 팀장 SOP 라이브러리에서 하나씩 자세히 볼 수 있습니다.", "You have finished TL Support Lifecycle. You can see a TL's procedures one by one in the TL SOP Library.") },
};
