import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 2. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Stages run down one column.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["work", "skills"];
const flow = ["work", "skills", "work-skills"];

export default {
  id: "sme",
  order: 2,
  title: tx("직무전문가", "SME"),
  short: tx("직무전문가", "SME"),
  subtitle: tx("팀이 막힐 때 찾는 사람이 됩니다.", "Become the person the team turns to when it's stuck."),
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
    step(tx("이 레슨의 목적은 직무전문가가 무슨 일을 하고, 어떤 역량이 필요한지 아는 것입니다.", "This lesson is about knowing what an SME does and what skills the role needs."), flow, procedure, null),
    step(tx("지민은 이제 웬만한 문의는 혼자 처리합니다. 처음에 늘 묻던 하린에게, 오늘은 반대로 하린의 일을 묻기로 했습니다.", "Jimin now handles most contacts on her own. Today, instead of asking Harin a question as she always did, she asks Harin about her work."), flow, [], null),
    step(tx("첫 단계는 하는 일입니다. 직무전문가는 팀의 지식 허브입니다. 상담사가 막히는 문의를 채팅이나 플로어 서포트로 돕고, 신입의 실무 교육과 실무 체험을 곁에서 지원합니다.", "The first stage is the work. The SME is the team's knowledge hub. They help agents with contacts they're stuck on through chat or floor support, and stay close to new hires through OJT and Nesting."), flow, ["work"], null),
    step(tx("자주 들어오는 질문과 고객의 소리(VOC)를 모아 원인을 찾고, 팀장에게 보고서로 전합니다. 팀장이 자리를 비우면 팀장 업무 일부를 대신 맡기도 합니다.", "They gather frequent questions and the voice of the customer (VOC), find the causes, and report them to the team leader. When the team leader is away, they cover part of the team leader's work."), flow, ["work"], null),
    step(tx("둘째 단계는 필요한 역량입니다. 제품과 시스템을 깊이 아는 것은 기본이고, 고객의 소리(VOC)를 분석해 보고서로 쓰는 힘이 필요합니다. 동료를 가르치는 코칭과 문제를 차근차근 푸는 분석적 사고도 필요합니다.", "The second stage is the skills needed. Knowing the products and systems in depth is the baseline, plus the ability to analyze VOC and write it up as a report. Coaching peers and analytical thinking, working through problems step by step, matter too."), flow, ["skills"], null),
    step(tx("답만 알려 주는 것으로는 부족합니다. 다음에는 상담사가 혼자 찾을 수 있게 어디서 찾는지까지 알려 주는 것이 직무전문가의 방식입니다.", "Just giving the answer isn't enough. The SME's way is to show where to find it, so the agent can find it alone next time."), flow, ["skills"], null),
    step(tx("미소의 한마디: 저는 모르는 걸 물으러 다니기만 했지, 알게 된 걸 정리할 생각은 못 했어요. 그때부터 메모를 모아 뒀다면 직무전문가가 됐을 때 훨씬 빨리 동료를 도왔을 거예요.", "A word from Miso: I only went around asking what I didn't know; I never thought to write down what I'd learned. If I'd kept notes from then on, I'd have helped my peers much faster once I became an SME."), flow, ["skills"], null),
  ],
  checkpoint: [
    {
      id: "sme-q1",
      prompt: tx("상담사가 처음 보는 문의로 채팅을 보내왔습니다. 직무전문가 하린에게 가장 알맞은 행동은 무엇일까요?", "An agent sends a chat about a kind of contact she has never handled before. What fits best for Harin, the SME?"),
      options: [
        option("a", tx("바쁜 시간에는 답만 짧게 보내고 다음 채팅으로 넘어간다.", "In a busy hour, send only a short answer and move on to the next chat."), tx("답만 주면 같은 문의에서 또 막힙니다. 찾는 곳까지 알려 줘야 다음에는 혼자 풉니다.", "With only the answer, the agent gets stuck on the same contact again. Showing where to find it lets her solve it alone next time.")),
        option("b", tx("다음엔 혼자 풀 수 있게, 답과 함께 찾는 곳을 알려 준다.", "So she can solve it alone next time, give the answer and where to find it.")),
        option("c", tx("처음 보는 문의는 바로 팀장에게 넘기라고 한다.", "Tell her to pass any new kind of contact straight to the team leader."), tx("직무전문가가 답할 수 있는 문의를 넘기면 팀장과 고객 모두 기다립니다. 범위 밖일 때만 팀장에게 넘깁니다.", "Passing on a contact the SME can answer makes both the team leader and the customer wait. Pass it on only when it's outside the SME's scope.")),
      ],
      answer: "b",
      explanation: tx("직무전문가는 답을 주는 사람이자, 상담사가 다음에 혼자 찾게 돕는 사람입니다.", "An SME gives answers and also helps agents find them on their own next time."),
    },
    {
      id: "sme-q2",
      prompt: tx("하린이 팀장에게 보고서를 쓰는 이유로 알맞은 것은 무엇일까요?", "Why does Harin write reports for the team leader?"),
      options: [
        option("a", tx("자주 나오는 질문과 고객의 소리(VOC)의 원인을 알려 개선하게 하려고", "To show the causes of frequent questions and VOC so they get fixed")),
        option("b", tx("상담사마다 품질 점수를 매겨 누가 더 잘하는지 팀장에게 따로 보여 주려고", "To score each agent's quality and show the team leader separately who does better"), tx("상담 품질 점수를 매기는 것은 QA의 일입니다.", "Scoring contact quality is QA's job.")),
        option("c", tx("팀장이 바쁠 때 팀장 대신 팀원을 평가하고 순위를 정하려고", "To evaluate and rank team members in the team leader's place when they're busy"), tx("팀원 평가는 팀장의 일입니다. 직무전문가는 팀장이 판단할 근거를 전합니다.", "Evaluating team members is the team leader's job. The SME brings the evidence the team leader decides on.")),
      ],
      answer: "a",
      explanation: tx("직무전문가의 보고서는 반복되는 문제의 원인을 팀장에게 알려, 팀 전체가 덜 막히게 하는 데 씁니다.", "An SME's report tells the team leader the causes of repeated problems, so the whole team gets stuck less often."),
    },
  ],
  connection: { to: "tlprep", text: tx("직무전문가에서 팀장으로 가려면 또 다른 준비가 필요합니다. 다음은 팀장 백업을 맡고 있는 하린의 준비를 봅니다.", "Going from SME to team leader takes a different kind of preparation. Next, see how Harin, who covers as team leader backup, gets ready.") },
};
