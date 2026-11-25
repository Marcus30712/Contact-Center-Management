import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 서포트 라이프사이클, lesson 2. Copy: docs/superpowers/specs/2026-11-25-tl-support-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["handover", "getback", "help", "stepin"];
const flow = ["handover", "getback", "help", "stepin", "handover-getback", "getback-help", "help-stepin"];

export default {
  id: "sme",
  order: 2,
  title: tx("SME 지원", "Supporting the SME"),
  short: tx("SME", "SME"),
  subtitle: tx("승인 범위와 대신 맡길 일을 정하고, 현장의 트렌드를 받습니다.", "Agree on the approval scope and the work to cover, and get the trends from the floor."),
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
    step(tx("이 레슨의 목적은 팀장이 SME를 지원하는 절차를 팀장 쪽에서 보는 것입니다.", "This lesson looks at how a team leader supports the SME, from the team leader's side."), flow, procedure, null),
    step(tx("첫 단계는 맡기기입니다. SME 하린과 승인 범위 목록을 맞추고, 출석 관리나 허들처럼 대신 맡길 일을 정합니다. 범위가 분명해야 하린이 매번 묻지 않고 판단할 수 있습니다.", "The first stage is handing over. Agree on the approval scope list with Harin, the SME, and decide what she will cover for you, such as attendance or huddles. A clear scope lets Harin decide without asking every time."), flow, ["handover"], null),
    step(tx("둘째 단계는 받기입니다. 하린에게서 주간 트렌드 요약, 출석 결과, 팀원별 단계 현황을 정해진 날에 받습니다. 받은 요약은 그 주의 코칭 계획에 바로 씁니다.", "The second stage is getting back. Get the weekly trend summary, attendance results and each member's stage from Harin on agreed days. Use the summary straight away in that week's coaching plan."), flow, ["getback"], null),
    step(tx("셋째 단계는 돕기입니다. SME는 요청이 몰리면 혼자 버티기 쉽습니다. 바쁜 시간대에는 팀장이 함께 서포트하거나 RTA와 인원을 조정합니다.", "The third stage is helping. SMEs tend to try to hold out alone when requests pile up. At busy times, the team leader helps support the floor or adjusts staffing with the RTA."), flow, ["help"], null),
    step(tx("SME의 성장도 돕습니다. 하린이 팀장 자리를 바란다면 회의 진행이나 신입 계획 같은 일을 조금씩 맡겨 봅니다.", "Help the SME grow too. If Harin wants to become a team leader, give her a little of that work at a time, such as running a meeting or planning for new hires."), flow, ["help"], null),
    step(tx("넷째 단계는 개입하기입니다. 근태, 성과 조치, 정책 밖 승인처럼 SME가 넘긴 일은 팀장이 직접 결정합니다. 승인 판단의 결과는 하린에게도 알려 같은 일이 다시 생기면 어떻게 할지 알게 하고, 근태나 성과 조치의 내용은 당사자와만 다룹니다.", "The fourth stage is stepping in. Matters the SME passes up, such as attendance, performance actions and approvals outside policy, are decided by the team leader. Tell Harin the outcome of approval calls so she knows what to do if it happens again, and keep attendance or performance actions between you and the agent."), flow, ["stepin"], null),
    step(tx("SME를 작은 팀장으로 쓰지 않습니다. 평가와 조치까지 넘기면 SME와 상담사의 관계가 무너집니다.", "Don't use the SME as a mini team leader. Handing over evaluation and action breaks the relationship between the SME and the agents."), flow, ["stepin"], null),
  ],
  checkpoint: [
    {
      id: "sme-q1",
      prompt: tx("하린이 비슷한 보상 요청마다 팀장에게 묻습니다. 먼저 할 일은 무엇일까요?", "Harin asks you about every similar compensation request. What do you do first?"),
      options: [
        option("a", tx("매번 바로 답해 준다.", "Answer each one right away."), tx("매번 답하면 팀장의 하루가 막히고, 하린은 스스로 판단할 기준을 얻지 못합니다.", "Answering every time blocks your day, and Harin never gets a standard to judge by herself.")),
        option("b", tx("하린과 승인 범위 목록을 다시 맞춘다.", "Go over the approval scope list with Harin again.")),
        option("c", tx("앞으로는 알아서 하라고 한다.", "Tell her to handle them on her own from now on."), tx("기준 없이 맡기면 요청마다 다르게 승인하게 됩니다.", "Handing over without a standard means each request gets approved differently.")),
      ],
      answer: "b",
      explanation: tx("범위를 분명히 맡겨야 SME가 같은 기준으로 판단합니다.", "A clear scope lets the SME judge by the same standard."),
    },
    {
      id: "sme-q2",
      prompt: tx("하린이 한 상담사의 반복되는 지각을 알려 왔습니다. 알맞은 것은 무엇일까요?", "Harin tells you an agent keeps coming in late. What fits?"),
      options: [
        option("a", tx("하린에게 그 상담사에게 경고하라고 한다.", "Tell Harin to warn the agent."), tx("근태 조치는 팀장의 몫입니다. SME에게 넘기면 상담사와의 관계가 무너집니다.", "Attendance action is the team leader's job. Passing it to the SME breaks her relationship with the agents.")),
        option("b", tx("팀장이 직접 확인하고 조치하며, 하린에게는 넘겨받아 처리했다는 것만 알린다.", "Check it yourself, take action, and tell Harin only that you have taken it over.")),
        option("c", tx("하린의 보고이니 따로 확인하지 않고 바로 조치한다.", "It's Harin's report, so act right away without checking."), tx("팀장이 직접 사실을 확인해야 공정한 조치가 됩니다.", "The team leader has to check the facts directly for the action to be fair.")),
      ],
      answer: "b",
      explanation: tx("넘겨받은 일은 팀장이 직접 확인하고 결정합니다.", "Matters passed up to you are checked and decided by the team leader directly."),
    },
  ],
  connection: { to: "qa", text: tx("SME가 현장을 돕는다면, QA는 품질의 기준을 지킵니다. 다음은 QA와 일하는 법입니다.", "If the SME helps the floor, QA guards the quality standard. Next is how to work with QA.") },
};
