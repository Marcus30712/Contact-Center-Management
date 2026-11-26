import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 1. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Four stages run down one column, like the other ring courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["work", "skills", "prepare", "selection"];
const flow = ["work", "skills", "prepare", "selection", "work-skills", "skills-prepare", "prepare-selection"];

export default {
  id: "sme",
  order: 1,
  title: tx("직무전문가", "SME"),
  short: tx("직무전문가", "SME"),
  subtitle: tx("팀이 막힐 때 찾는 사람이 됩니다.", "Become the person the team turns to when it's stuck."),
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
    step(tx("이 레슨의 목적은 직무전문가가 무슨 일을 하는지, 그 자리로 가려면 지금부터 무엇을 준비하면 되는지 아는 것입니다. 이 강의는 실전 배치 뒤 1년쯤(예시) 지난 지민이 다음 자리를 알아보는 순서를 따라갑니다.", "This lesson is about knowing what an SME does, and what to prepare now to get there. The course follows Jimin, about a year after Go Live (Example), as she looks into her next role."), flow, procedure, null),
    step(tx("지민은 이제 웬만한 문의는 혼자 처리합니다. 처음에 늘 묻던 하린에게, 오늘은 반대로 하린의 일을 묻기로 했습니다.", "Jimin now handles most contacts on her own. Today, instead of asking Harin a question as she always did, she asks Harin about her work."), flow, [], null),
    step(tx("첫 단계는 하는 일입니다. 직무전문가는 팀의 지식 허브입니다. 상담사가 막히는 문의를 채팅이나 플로어 서포트로 돕고, 신입의 OJT와 네스팅을 곁에서 지원합니다.", "The first stage is the work. The SME is the team's knowledge hub. They help agents with contacts they're stuck on through chat or floor support, and stay close to new hires through OJT and nesting."), flow, ["work"], null),
    step(tx("자주 들어오는 질문과 고객의 소리(VOC)를 모아 원인을 찾고, 팀장에게 보고서로 전합니다. 팀장이 자리를 비우면 팀장 업무 일부를 대신 맡기도 합니다.", "They gather frequent questions and the voice of the customer (VOC), find the causes, and report them to the team leader. When the team leader is away, they cover part of the team leader's work."), flow, ["work"], null),
    step(tx("둘째 단계는 필요한 역량입니다. 제품과 시스템을 깊이 아는 것은 기본이고, VOC를 분석해 보고서로 쓰는 힘이 필요합니다. 동료를 가르치는 코칭과 문제를 차근차근 푸는 분석적 사고도 필요합니다.", "The second stage is the skills needed. Knowing the products and systems in depth is the baseline, plus the ability to analyze VOC and write it up as a report. Coaching peers and analytical thinking, working through problems step by step, matter too."), flow, ["skills"], null),
    step(tx("셋째 단계는 지금부터 준비하기입니다. 내가 자주 막혔던 문의와 그 답을 정리해 둡니다. 나중에 같은 곳에서 막히는 동료를 돕는 자료가 됩니다.", "The third stage is preparing now. Keep a note of the contacts you often got stuck on, with their answers. It becomes material for helping peers who get stuck in the same place."), flow, ["prepare"], null),
    step(tx("옆자리 동료가 물어 오면 답만 주지 않고 어디서 찾는지도 함께 알려 줍니다. 묻는 사람을 돕는 경험이 직무전문가의 일과 가장 닮았습니다.", "When the colleague next to you asks, don't just give the answer; show where to find it too. Helping someone who asks is the closest thing to an SME's work."), flow, ["prepare"], null),
    step(tx("넷째 단계는 뽑을 때 더 보는 것입니다. 직무전문가를 뽑을 때는 제품 지식과 함께 평소 동료를 얼마나 도왔는지를 봅니다. 팀장과 하린에게 이미 \"물어보면 잘 알려 주는 사람\"으로 알려져 있으면 유리합니다.", "The fourth stage is what else they look for. When choosing an SME, they look at product knowledge and how much you've helped peers. It helps if the team leader and Harin already know you as \"the one who explains things well.\""), flow, ["selection"], null),
    step(tx("미소의 한마디: 저는 모르는 걸 물으러 다니기만 했지, 알게 된 걸 정리할 생각은 못 했어요. 그때부터 메모를 모아 뒀다면 직무전문가 면접에서 보여 줄 게 훨씬 많았을 거예요.", "A word from Miso: I only went around asking what I didn't know; I never thought to write down what I'd learned. If I'd kept notes from then on, I'd have had far more to show in my SME interview."), flow, ["selection"], null),
  ],
  checkpoint: [
    {
      id: "sme-q1",
      prompt: tx("직무전문가가 되고 싶은 지민이 지금 할 수 있는 일로 가장 알맞은 것은 무엇일까요?", "What's the best thing Jimin, who wants to become an SME, can do now?"),
      options: [
        option("a", tx("다른 상담사의 실수를 찾아 팀장에게 알린다.", "Find other agents' mistakes and report them to the team leader."), tx("실수를 찾아 알리는 일은 품질 평가에 가깝고, 동료의 믿음을 잃기 쉽습니다. 직무전문가의 핵심은 돕는 것입니다.", "Finding and reporting mistakes is closer to quality scoring, and it easily costs peers' trust. The heart of an SME's work is helping.")),
        option("b", tx("자주 막히는 문의를 정리하고, 동료가 물어 오면 찾는 방법까지 함께 알려 준다.", "Write up the contacts people often get stuck on, and when a peer asks, show them how to find the answer too.")),
        option("c", tx("직무전문가가 될 때까지는 다른 사람의 질문에 답하지 않는다.", "Not answer anyone's questions until she becomes an SME."), tx("돕는 경험이 곧 준비입니다. 뽑는 사람도 평소에 동료를 도와 온 모습을 봅니다.", "Helping is the preparation. The people choosing also look at how you've helped peers.")),
      ],
      answer: "b",
      explanation: tx("직무전문가는 팀이 막힐 때 찾는 사람입니다. 지금 동료를 돕고 아는 것을 정리하는 것이 가장 가까운 준비입니다.", "An SME is the person the team turns to when it's stuck. Helping peers now and writing down what you know is the closest preparation."),
    },
    {
      id: "sme-q2",
      prompt: tx("하린이 팀장에게 보고서를 쓰는 이유로 알맞은 것은 무엇일까요?", "Why does Harin write reports for the team leader?"),
      options: [
        option("a", tx("자주 들어오는 질문과 VOC의 원인을 알려 개선할 수 있게 하려고", "To show the causes of frequent questions and VOC so they can be fixed")),
        option("b", tx("상담사 한 사람 한 사람의 점수를 매기려고", "To score each agent one by one"), tx("상담 품질 점수를 매기는 것은 QA의 일입니다.", "Scoring contact quality is QA's job.")),
        option("c", tx("팀장 대신 팀원을 평가하려고", "To evaluate team members in the team leader's place"), tx("팀원 평가는 팀장의 일입니다. 직무전문가는 팀장이 판단할 근거를 전합니다.", "Evaluating team members is the team leader's job. The SME brings the evidence the team leader decides on.")),
      ],
      answer: "a",
      explanation: tx("직무전문가의 보고서는 반복되는 문제의 원인을 팀장에게 알려, 팀 전체가 덜 막히게 하는 데 씁니다.", "An SME's report tells the team leader the causes of repeated problems, so the whole team gets stuck less often."),
    },
  ],
  connection: { to: "qa", text: tx("직무전문가가 상담을 돕는 사람이라면, 상담의 품질을 재는 사람도 있습니다. 다음은 QA 도현을 만납니다.", "If the SME helps with contacts, someone also measures their quality. Next, meet Dohyun from QA.") },
};
