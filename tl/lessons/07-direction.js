import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 첫걸음, lesson 7. Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["prepare", "hear", "plan", "tell"];
const flow = ["prepare", "hear", "plan", "tell", "prepare-hear", "hear-plan", "plan-tell"];

export default {
  id: "direction",
  order: 7,
  title: tx("부매니저·매니저에게 방침 받기", "Getting Direction from Your Assistant Manager or Operation Manager"),
  short: tx("방침 받기", "Direction"),
  subtitle: tx("파악한 것을 들고 운영 방침을 받고, 첫 계획을 세웁니다.", "Take what you've learned, get the operating direction and make your first plan."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("prepare", "보고 준비", 180, 36, "Prepare the report")),
      wide(node("hear", "방침 듣기", 180, 92, "Hear the direction")),
      wide(node("plan", "첫 계획", 180, 148, "First plan")),
      wide(node("tell", "팀에 알리기", 180, 204, "Tell the team")),
    ],
    edges: [edge("prepare", "hear"), edge("hear", "plan"), edge("plan", "tell")],
  },
  steps: [
    step(tx("이 레슨의 목적은 지금까지 파악한 내용을 부매니저(AM)나 매니저(OM)에게 보고하고, 운영 방침을 받아 팀의 첫 계획을 세우는 것입니다.", "This lesson is about reporting what you've learned to your assistant manager (AM) or operation manager (OM), getting the operating direction and making the team's first plan."), flow, procedure, null),
    step(tx("첫 단계는 보고 준비입니다. 레슨 5의 팀 요약과 레슨 6의 개인 메모에서 꼭 전할 것만 추립니다. 팀원의 개인 사정은 보고에 넣지 않습니다.", "The first stage is preparing the report. From the team summary in lesson 5 and the personal notes in lesson 6, pick only what you must pass on. Leave team members' personal matters out of the report."), flow, ["prepare"], null),
    step(tx("민석 부매니저와의 첫 미팅은 30분(예시)입니다. 팀의 지금 모습, 그 원인, 당신이 보는 우선순위를 짧게 전합니다.", "Your first meeting with Minseok, your assistant manager, is 30 minutes (Example). Briefly share how the team is now, why, and what you see as the priorities."), flow, ["prepare"], null),
    step(tx("둘째 단계는 방침 듣기입니다. 프로젝트가 이번 분기에 가장 중요하게 보는 지표, 팀에 기대하는 것, 팀장이 정할 수 있는 범위를 확인합니다.", "The second stage is hearing the direction. Confirm which metrics the project cares about most this quarter, what it expects from the team and what the team leader may decide alone."), flow, ["hear"], null),
    step(tx("당신의 우선순위와 방침이 다르면 근거를 들어 의견을 말합니다. 그래도 방침이 정해지면 그 방침을 따르고, 의견은 기록해 둡니다.", "If your priorities differ from the direction, give your view with evidence. If the direction is still set, follow it and keep a record of your view."), flow, ["hear"], null),
    step(tx("셋째 단계는 첫 계획입니다. 방침에 맞춰 앞으로 한 달(예시) 동안 할 일을 정합니다. 누구를 어떻게 코칭할지, 팀 전체에서 무엇을 먼저 바꿀지, 직무전문가·QA·트레이너에게 무엇을 부탁할지 적습니다.", "The third stage is the first plan. In line with the direction, decide what to do over the next month (Example). Write down whom to coach and how, what to change first across the team, and what to ask of the SME, QA and the trainer."), flow, ["plan"], null),
    step(tx("계획은 작게 시작합니다. 한 번에 다 바꾸려 하면 팀도 당신도 지칩니다. 가장 큰 문제 한두 개부터 시작합니다.", "Start the plan small. Trying to change everything at once wears out both the team and you. Start with the one or two biggest problems."), flow, ["plan"], null),
    step(tx("넷째 단계는 팀에 알리기입니다. 팀 허들에서 앞으로의 방향과 첫 목표를 짧게 전합니다. 누구의 이름도 지적하지 않고, 팀이 함께 갈 방향만 말합니다.", "The fourth stage is telling the team. At the team huddle, briefly share the direction ahead and the first goals. Don't single anyone out; just say where the team is heading together."), flow, ["tell"], null),
    step(tx("한 달(예시) 뒤 결과를 들고 민석 부매니저와 다시 만납니다. 파악과 계획, 실행과 점검이 이 순서로 계속 돕니다.", "A month later (Example), meet Minseok again with the results. Understanding and planning, doing and checking keep turning in this order."), flow, ["tell"], null),
  ],
  checkpoint: [
    {
      id: "direction-q1",
      prompt: tx("부매니저와의 첫 미팅에 가져갈 것으로 알맞은 것은 무엇일까요?", "What should you take to your first meeting with your assistant manager?"),
      options: [
        option("a", tx("팀원 15명(예시)의 모든 기록 원본", "All the raw records for 15 team members (Example)"), tx("원본만 가져가면 짧은 시간에 무엇이 중요한지 전할 수 없습니다.", "With only raw records, you can't get across what matters in a short meeting.")),
        option("b", tx("팀 요약 한 장과 내가 보는 우선순위", "The one-page team summary and the priorities you see")),
        option("c", tx("아무것도 가져가지 않고 방침부터 듣는다.", "Nothing; just hear the direction first"), tx("팀의 지금 모습을 전하지 않으면 방침이 팀의 현실과 어긋날 수 있습니다.", "If you don't share how the team is now, the direction may not fit the team's reality.")),
      ],
      answer: "b",
      explanation: tx("파악한 것을 짧게 전해야 팀에 맞는 방침을 받을 수 있습니다.", "Share what you've learned briefly, so you get direction that fits the team."),
    },
    {
      id: "direction-q2",
      prompt: tx("내가 본 우선순위와 부매니저의 방침이 다릅니다. 어떻게 할까요?", "Your priorities differ from your assistant manager's direction. What do you do?"),
      options: [
        option("a", tx("팀 사정을 더 잘 아는 내 판단대로 진행한다.", "Follow your own priorities, trusting your better feel for the team."), tx("방침과 다르게 운영하면 프로젝트 전체의 계획과 어긋나고 신뢰를 잃습니다.", "Running the team against the direction puts you out of step with the project's plan and costs trust.")),
        option("b", tx("근거를 들어 의견을 말하되, 정해지면 따르고 의견은 기록해 둔다.", "Give your view with evidence; once it's set, follow it and keep a record of your view.")),
        option("c", tx("의견을 말하지 않고 방침만 받아 적는다.", "Say nothing and just write down the direction."), tx("현장을 가장 가까이에서 본 팀장의 의견이 빠지면 좋은 결정을 놓칠 수 있습니다.", "Leaving out the view of the team leader who sees the floor most closely can mean missing a good decision.")),
      ],
      answer: "b",
      explanation: tx("의견은 근거와 함께 말하고, 결정된 방침은 따릅니다.", "Give your view with evidence, and follow the direction once it's decided."),
    },
  ],
  connection: { to: "home", text: tx("팀장 첫걸음을 마쳤습니다. 다음은 상담사 라이프사이클에서 상담사 한 사람이 채용부터 성장까지 거치는 단계를 봅니다.", "You have finished TL First Steps. Next, The Agent Lifecycle shows the stages one agent goes through, from hiring to growth.") },
};
