import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 첫걸음, lesson 1. Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["people", "results", "contribution", "plan"];
const flow = ["people", "results", "contribution", "plan", "people-results", "results-contribution", "contribution-plan"];

export default {
  id: "start",
  order: 1,
  title: tx("팀장이 된 첫날", "Your First Day as a Team Leader"),
  short: tx("첫날", "First day"),
  subtitle: tx("운영하기 전에, 무엇을 어떤 순서로 파악할지 정합니다.", "Before you run the team, decide what to learn about it and in what order."),
  procedure,
  diagram: {
    nodes: [
      wide(node("people", "팀원 파악", 180, 36, "Know the people")),
      wide(node("results", "개인 성과", 180, 92, "Individual results")),
      wide(node("contribution", "팀의 기여", 180, 148, "Team contribution")),
      wide(node("plan", "첫 계획", 180, 204, "First plan")),
    ],
    edges: [edge("people", "results"), edge("results", "contribution"), edge("contribution", "plan")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀장이 된 첫날, 팀을 운영하기 전에 무엇을 어떤 순서로 파악할지 정하는 것입니다. 이 강의 전체가 이 순서를 따라갑니다.", "This lesson is about deciding, on your first day as a TL, what to learn about the team and in what order before you start running it. The whole course follows this order."), flow, procedure, null),
    step(tx("당신은 오늘부터 15명(예시) 팀의 팀장입니다. 팀원들은 당신을 모르고, 당신도 팀원들이 어떻게 일해 왔는지 모릅니다.", "From today you lead a team of 15 people (Example). The team doesn't know you, and you don't know how they have been working."), flow, [], null),
    step(tx("첫 단계는 팀원 파악입니다. 누가 있고, 각자 어떤 스킬을 가지고 어떤 업무를 해 왔는지 알아야 합니다. 레슨 2의 로스터가 그 출발점입니다.", "The first stage is getting to know the people. You need to know who is on the team, what skills each person has and what work they have done. The roster in lesson 2 is the starting point."), flow, ["people"], null),
    step(tx("둘째 단계는 개인 성과입니다. 지민, 서준, 준호가 지금까지 어떤 숫자를 냈고 실제로 어떻게 일해 왔는지 봅니다. 레슨 3과 4에서 다룹니다.", "The second stage is individual results. Look at what numbers Jimin, Seojun and Junho have delivered and how they have actually worked. Lessons 3 and 4 cover this."), flow, ["results"], null),
    step(tx("셋째 단계는 팀의 기여입니다. 이 팀이 프로젝트 전체에서 어떤 몫을 해 왔는지, 어디가 우수했고 어디가 모자랐는지 봅니다. 레슨 5에서 다룹니다.", "The third stage is the team's contribution. Look at what share this team has carried in the whole project, where it excelled and where it fell short. Lesson 5 covers this."), flow, ["contribution"], null),
    step(tx("넷째 단계는 첫 계획입니다. 팀원 한 명씩 어떻게 도울지 정하고, 부매니저에게 운영 방침을 받아 팀 전체의 계획을 세웁니다. 레슨 6과 7에서 다룹니다.", "The fourth stage is the first plan. Decide how to help each team member, get the operating direction from your assistant manager, and plan for the whole team. Lessons 6 and 7 cover this."), flow, ["plan"], null),
    step(tx("혼자 파악하지 않습니다. 팀을 가장 가까이에서 봐 온 직무전문가 하린, QA 도현, 트레이너 유나의 기록과 관찰이 큰 도움이 됩니다.", "You don't do this alone. The records and observations of Harin the SME, Dohyun from QA and Yuna the trainer, who have watched the team most closely, help a great deal."), flow, ["plan"], null),
    step(tx("첫 몇 주 동안은 큰 변화를 서두르지 않습니다. 파악하기 전에 바꾸면 잘 돌아가던 것까지 흔들 수 있습니다.", "Don't rush big changes in the first few weeks. Changing things before you understand them can shake what was working well."), flow, ["plan"], null),
    step(tx("첫날에는 팀원들에게 짧게 인사하고, 앞으로 몇 주 동안 한 사람씩 이야기를 나누겠다고 알립니다. 팀원들도 새 팀장이 무엇을 할지 궁금해합니다.", "On day one, greet the team briefly and tell them you will talk with each person over the next few weeks. They are also curious about what the new TL will do."), flow, ["plan"], null),
  ],
  checkpoint: [
    {
      id: "start-q1",
      prompt: tx("첫날, 전 팀장 때와 다른 방식이 눈에 띕니다. 어떻게 할까요?", "On your first day, you notice ways of working that differ from the previous TL's. What do you do?"),
      options: [
        option("a", tx("흔들리지 않을 기준을 일찍 세우려고, 첫날 허들에서 내 방식을 알리고 바로 바꾼다.", "To set a firm standard early, announce your way at the first huddle and switch right away."), tx("이유를 알기 전에 바꾸면 잘 돌아가던 것까지 흔들리고, 팀원들은 새 팀장을 경계합니다.", "Changing things before you know why shakes what was working, and the team grows wary of the new TL.")),
        option("b", tx("그 방식에도 사정이 있을 수 있으니, 적어 두고 이유를 파악한 뒤에 바꿀지 정한다.", "There may be a reason behind the old way, so note it down and decide whether to change it once you know why.")),
        option("c", tx("팀이 오래 해 온 방식이니, 팀원들이 불편하지 않게 앞으로도 손대지 않는다.", "It's how the team has long worked, so leave it alone for good so no one is put out."), tx("파악한 뒤에도 바꾸지 않으면 개선할 기회를 놓칩니다. 바꿀지는 파악한 다음에 정합니다.", "If you never change anything even after learning why, you miss chances to improve. Decide whether to change it after you understand it.")),
      ],
      answer: "b",
      explanation: tx("첫 몇 주는 바꾸기보다 파악하는 시간입니다.", "The first few weeks are for understanding, not changing."),
    },
    {
      id: "start-q2",
      prompt: tx("팀을 파악하는 순서로 알맞은 것은 무엇일까요?", "Which order fits getting to know the team?"),
      options: [
        option("a", tx("개인 성과 → 팀원 파악 → 팀의 기여 → 첫 계획", "Individual results → know the people → team contribution → first plan"), tx("숫자를 먼저 보면 그 숫자 뒤의 사람과 사정을 놓칩니다.", "Looking at numbers first misses the people and circumstances behind them.")),
        option("b", tx("팀원 파악 → 개인 성과 → 팀의 기여 → 첫 계획", "Know the people → individual results → team contribution → first plan")),
        option("c", tx("팀의 기여 → 팀원 파악 → 개인 성과 → 첫 계획", "Team contribution → know the people → individual results → first plan"), tx("팀 전체부터 보면 한 사람 한 사람이 가려지고, 기여의 원인도 보이지 않습니다.", "Starting with the whole team hides each person, and you can't see what drives the contribution.")),
      ],
      answer: "b",
      explanation: tx("사람을 먼저 알고, 성과와 기여를 본 뒤에 계획합니다.", "Know the people first, look at results and contribution, then plan."),
    },
  ],
  connection: { to: "roster", text: tx("파악의 출발점은 팀원 한 사람 한 사람입니다. 먼저 로스터를 만듭니다.", "Getting to know the team starts with each person. First, build the roster.") },
};
