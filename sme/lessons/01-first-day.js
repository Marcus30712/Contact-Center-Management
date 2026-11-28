import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 1. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["role", "day", "approve", "share"];
const flow = [...procedure, "role-day", "day-approve", "approve-share"];

export default {
  id: "firstday",
  order: 1,
  title: tx("직무전문가가 된 첫날", "Your First Day as an SME"),
  short: tx("첫날", "First day"),
  subtitle: tx("내 자리가 무엇이고, 어디까지 내가 정하는지.", "What your role is, and how far you decide."),
  procedure,
  diagram: {
    nodes: [
      wide(node("role", "역할 알기", 180, 36, "Know the role")),
      wide(node("day", "하루 일과", 180, 92, "The day")),
      wide(node("approve", "승인 범위", 180, 148, "Approval limits")),
      wide(node("share", "팀장과 나누기", 180, 204, "Share with the TL")),
    ],
    edges: [edge("role", "day"), edge("day", "approve"), edge("approve", "share")],
  },
  steps: [
    step(tx("이 레슨의 목적은 상담사에서 직무전문가가 된 첫날, 내 자리가 무엇이고 하루를 어떻게 쓰며 어디까지 내가 정하는지 아는 것입니다. 네 단계로 살펴봅니다.", "This lesson is about your first day after moving from agent to SME: what your role is, how you spend the day, and how far you decide. We look at it in four stages."), flow, procedure, null),
    step(tx("어제까지 당신은 수진 팀의 선임 상담사였습니다. 오늘부터는 같은 팀 12명(예시)을 받쳐 주는 직무전문가입니다. 이제는 내 문의를 잘 처리하는 것보다 팀이 막히지 않게 하는 것이 일입니다.", "Until yesterday you were a senior agent on Sujin's team. From today you are the SME who backs up the same team of 12 people (Example). Your job is no longer handling your own contacts well, but keeping the team from getting stuck."), flow, [], null),
    step(tx("첫 단계는 역할 알기입니다. 직무전문가는 팀의 지식 허브입니다. 막힌 문의에 답을 주고, 에스컬레이션을 승인하거나 처리하고, 동료의 성장을 돕습니다.", "The first stage is knowing the role. The SME is the team's knowledge hub. You give answers on stuck contacts, approve or handle escalations, and help colleagues grow."), flow, ["role"], null),
    step(tx("직무전문가는 상담사를 평가하거나 징계하는 자리가 아닙니다. 평가는 QA와 팀장이 맡습니다. 당신은 승인하고 돕는 사람입니다.", "The SME does not evaluate or discipline agents. QA and the team leader do the evaluating. You are the one who approves and helps."), flow, ["role"], null),
    step(tx("둘째 단계는 하루 일과 알기입니다. 하루의 대부분은 에스컬레이션 지원과 어려운 케이스 처리, 상담사 멘토링에 씁니다. 여기에 매일 하는 스크러빙과 VOC 정리, QA와의 캘리브레이션이 더해집니다.", "The second stage is knowing the day. Most of the day goes to escalation support, hard cases and mentoring agents. Daily scrubbing, VOC write-ups and calibration with QA come on top."), flow, ["day"], null),
    step(tx("서포트 요청은 두 곳에서 옵니다. 플로어를 돌며 손을 든 상담사를 돕고, 메신저와 팀 채팅방으로 들어오는 질문에도 답합니다.", "Requests come from two places. You walk the floor to help agents who raise a hand, and you answer questions that come in by messenger and the team chat."), flow, ["day"], null),
    step(tx("셋째 단계는 승인 범위 확인입니다. 첫날 수진 팀장과 앉아, 내가 승인할 수 있는 것과 팀장에게 넘길 것을 목록으로 맞춥니다. 예를 들어 정해진 기준 안의 보상은 승인하고, 정책 밖의 요청과 근태·성과 문제는 넘깁니다.", "The third stage is checking your approval limits. On day one, sit down with Sujin and list what you can approve and what goes to the team leader. For example, you approve compensation within set limits, and pass on requests outside policy and attendance or performance issues."), flow, ["approve"], null),
    step(tx("범위를 모르면 두 가지 실수가 생깁니다. 내 권한 밖을 승인해 버리거나, 반대로 모든 건을 팀장에게 넘겨 팀장의 하루가 막힙니다.", "Not knowing the limits leads to two mistakes. You approve something beyond your authority, or you pass everything to the team leader and jam their day."), flow, ["approve"], null),
    step(tx("넷째 단계는 팀장과 나누기입니다. 팀장이 바쁠 때 출석 관리, 트렌드 요약, 허들을 나눠 맡을 수 있다는 것도 미리 이야기해 둡니다. 레슨 5에서 자세히 다룹니다.", "The fourth stage is sharing with the team leader. Agree early that you can take on attendance, trend summaries and huddles when the team leader is busy. Lesson 5 covers this in detail."), flow, ["share"], null),
    step(tx("첫날이 끝나면 오늘 받은 질문을 짧게 적어 둡니다. 자주 오는 질문이 내일 먼저 준비할 것입니다.", "At the end of day one, jot down the questions you got. The ones that come up often are what you prepare first tomorrow."), flow, ["share"], null),
  ],
  checkpoint: [
    {
      id: "firstday-q1",
      prompt: tx("첫날, 상담사가 고객에게 정책에 없는 큰 보상을 해 주자며 승인을 요청합니다. 어떻게 할까요?", "On your first day, an agent asks you to approve a large compensation that policy does not cover. What do you do?"),
      options: [
        option("a", tx("고객이 많이 화가 나 있고 대기가 길어지니, 이번만 승인하고 팀장에게는 나중에 보고한다.", "The customer is very upset and the wait is growing, so approve it just this once and report to the team leader later."), tx("승인 범위 밖의 결정은 되돌리기 어렵고, 다른 고객에게도 같은 기준을 요구받게 됩니다.", "A decision beyond your limits is hard to undo, and other customers will ask for the same.")),
        option("b", tx("범위 밖이니, 고객에게 기다림을 안내하게 하고 팀장에게 바로 넘긴다.", "It's outside your limits, so have the agent ask the customer to wait and pass it to the team leader right away.")),
        option("c", tx("정책에 없는 요청이니 상담사에게 정중히 거절하게 하고, 사과 문구를 함께 써 준다.", "Policy doesn't cover it, so have the agent decline politely, and write the apology line together."), tx("정중히 거절해도 고객의 문제는 그대로 남습니다. 내가 정할 수 없는 건은 정할 수 있는 사람에게 넘깁니다.", "A polite refusal still leaves the customer's problem where it was. What you cannot decide goes to someone who can.")),
      ],
      answer: "b",
      explanation: tx("승인 범위 안은 내가 정하고, 범위 밖은 팀장에게 넘깁니다. 첫날 범위를 맞춰 두는 이유입니다.", "You decide within your limits and pass on what is outside them. That is why you agree on the limits on day one."),
    },
    {
      id: "firstday-q2",
      prompt: tx("지민의 응대 태도가 요즘 걱정됩니다. 직무전문가로서 알맞은 것은 무엇일까요?", "You are worried about how Jimin has been treating customers lately. What fits your role as SME?"),
      options: [
        option("a", tx("지민의 품질 점수를 직접 낮춰 기록하고, 다음 평가에 반영해 달라고 QA에 요청한다.", "Mark down Jimin's quality score yourself, and ask QA to reflect it in the next evaluation."), tx("평가는 QA와 팀장이 맡습니다. 직무전문가가 점수를 매기면 역할이 섞여 지민도 누구에게 도움을 청할지 헷갈립니다.", "QA and the team leader do the evaluating. If the SME scores agents, the roles blur and Jimin won't know whom to ask for help.")),
        option("b", tx("옆에서 응대를 함께 보며 돕고, 반복되면 팀장에게 사례와 함께 알린다.", "Watch Jimin's contacts alongside her and help, and if it repeats, tell the team leader with examples.")),
        option("c", tx("직무전문가의 일이 아니라며 모른 척한다.", "Say it isn't the SME's business and stay out of it."), tx("돕는 것은 직무전문가의 일입니다. 모른 척하면 문제가 커진 뒤에야 드러납니다.", "Helping is the SME's job. If you stay out of it, the problem shows only after it has grown.")),
      ],
      answer: "b",
      explanation: tx("직무전문가는 평가 대신 돕고, 반복되는 문제는 근거와 함께 팀장에게 전합니다.", "The SME helps instead of evaluating, and takes repeated problems to the team leader with evidence."),
    },
  ],
  connection: { to: "newcomer", text: tx("역할을 알았으니 이제 사람을 만날 차례입니다. 먼저 가장 가까이 붙어 있어야 할 사람, 막 실무 교육을 마치고 실무 체험을 시작한 신입입니다.", "Now that you know the role, it is time to meet people. First, the one you need to stay closest to: a new hire who has just finished OJT and started Nesting.") },
};
