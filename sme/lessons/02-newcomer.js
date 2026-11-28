import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 2. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["prepare", "beside", "check", "report"];
const flow = [...procedure, "prepare-beside", "beside-check", "check-report"];

export default {
  id: "newcomer",
  order: 2,
  title: tx("교육 중·막 교육을 마친 상담사 서포트", "Supporting Agents in Training or Just Trained"),
  short: tx("신입 서포트", "New hires"),
  subtitle: tx("질문을 기다리지 말고 먼저 다가갑니다.", "Don't wait for questions; go to them first."),
  personaName: tx("서준", "Seojun"),
  procedure,
  diagram: {
    nodes: [
      wide(node("prepare", "미리 알기", 180, 36, "Learn ahead")),
      wide(node("beside", "옆에 붙기", 180, 92, "Stay close")),
      wide(node("check", "먼저 확인", 180, 148, "Check in first")),
      wide(node("report", "팀장에게 공유", 180, 204, "Share with the TL")),
    ],
    edges: [edge("prepare", "beside"), edge("beside", "check"), edge("check", "report")],
  },
  steps: [
    step(tx("이 레슨의 목적은 교육 중이거나 막 교육을 마친 상담사가 실제 문의에 적응하도록 돕는 것입니다. 이 시기는 상담사가 가장 많이 떠나는 시기입니다.", "This lesson is about helping agents in training or just out of training settle into real contacts. This is when agents are most likely to leave."), flow, procedure, null),
    step(tx("서준은 지난주 기본 교육과 실무 교육을 마치고, 이번 주부터 실무 체험 그룹에서 실제 문의를 받습니다. 지식은 있지만 트레이너 곁을 떠나 고객을 맡는 것은 처음입니다.", "Seojun finished classroom training and OJT last week, and from this week he takes real contacts in the Nesting group. He has the knowledge, but he has never handled customers without the trainer beside him."), flow, [], null),
    step(tx("첫 단계는 미리 알기입니다. 트레이너에게 서준이 교육에서 어려워한 부분을 미리 듣고, 오늘 들어올 문의 중 서준에게 어려울 만한 유형을 떠올려 둡니다.", "The first stage is learning ahead. Ask the trainer what Seojun found hard in training, and think about which of today's contact types may be hard for him."), flow, ["prepare"], null),
    step(tx("둘째 단계는 옆에 붙기입니다. 첫 며칠(예시)은 서준 자리 가까이 있으며 첫 몇 건을 함께 봅니다. 전화는 같이 듣고, 채팅과 이메일은 보내기 전에 함께 읽습니다.", "The second stage is staying close. For the first few days (Example), stay near Seojun's desk and go through his first few contacts with him. Listen in on calls, and read chats and emails with him before they go out."), flow, ["beside"], null),
    step(tx("답을 바로 주기보다 어디서 찾는지 보여 줍니다. 지식 베이스의 어느 문서에 있는지 알려 주면 다음에는 혼자 찾을 수 있습니다.", "Rather than giving the answer, show where to find it. When you point to the right knowledge base article, he can find it alone next time."), flow, ["beside"], null),
    step(tx("셋째 단계는 먼저 확인하기입니다. 신입은 질문하는 것 자체를 망설입니다. 손을 들 때까지 기다리지 말고, 정해진 간격(예시: 1시간에 한 번)으로 먼저 다가가 묻습니다.", "The third stage is checking in first. New hires hesitate to ask at all. Don't wait for a raised hand; go to him at set intervals (Example: once an hour) and ask."), flow, ["check"], null),
    step(tx("실수는 그 자리에서 짧게 고쳐 주고, 잘한 것도 바로 말해 줍니다. 이 시기에는 칭찬 한마디가 버티는 힘이 됩니다.", "Fix mistakes briefly on the spot, and say what he did well right away too. At this stage, one word of praise helps people hold on."), flow, ["check"], null),
    step(tx("실무 교육 때와 실무 체험 때는 곁에 붙어 있는 거리가 다릅니다. 실무 교육 기간에는 트레이너와 함께 보고, 실무 체험부터는 직무전문가가 더 가까이 붙습니다.", "You stay at a different distance in OJT and in Nesting. During OJT you watch alongside the trainer; from Nesting on, the SME stays closer."), flow, ["beside"], null),
    step(tx("넷째 단계는 팀장에게 공유하기입니다. 하루가 끝나면 서준이 무엇을 잘했고 어디서 막혔는지 팀장과 트레이너에게 짧게 전합니다. 평가가 아니라 다음 날 도울 곳을 정하기 위해서입니다.", "The fourth stage is sharing with the TL. At the end of the day, tell the TL and the trainer briefly what Seojun did well and where he got stuck. The point is not to evaluate, but to decide where to help tomorrow."), flow, ["report"], null),
    step(tx("같은 곳에서 계속 막히면 추가 교육이 필요할 수 있습니다. 결정은 팀장과 트레이너가 하고, 당신은 근거가 될 사례를 모읍니다.", "If he keeps getting stuck in the same place, he may need more training. The TL and the trainer decide; you gather the examples to base it on."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "newcomer-q1",
      prompt: tx("서준이 오전 내내 한 번도 질문하지 않았습니다. 어떻게 할까요?", "Seojun has not asked a single question all morning. What do you do?"),
      options: [
        option("a", tx("잘하고 있다고 믿고 그대로 둔다.", "Leave him be, trusting he's doing well."), tx("신입이 조용한 것은 잘해서가 아니라 묻기를 망설여서일 때가 많습니다.", "A quiet new hire is often hesitating to ask, not doing well.")),
        option("b", tx("먼저 다가가 오전 문의가 어땠는지 묻는다.", "Go to him first and ask how his morning contacts went.")),
        option("c", tx("질문이 없는 게 걱정되니 팀장에게 알려 따로 면담을 잡아 달라고 한다.", "Worried by the silence, tell the TL and ask for a one-on-one with him."), tx("아직 무슨 일인지 모르는 상태입니다. 면담보다 먼저 서준에게 직접 묻는 것이 순서입니다.", "You don't know yet what is going on. Asking Seojun directly comes before any meeting.")),
      ],
      answer: "b",
      explanation: tx("신입 서포트는 기다리는 것이 아니라 먼저 다가가는 것입니다.", "Supporting new hires means going to them first, not waiting."),
    },
    {
      id: "newcomer-q2",
      prompt: tx("서준이 같은 절차를 세 번째 묻습니다. 알맞은 것은 무엇일까요?", "Seojun asks about the same procedure for the third time. What fits best?"),
      options: [
        option("a", tx("이번에도 바로 답을 알려 주고, 화면 캡처로 정리해 보내 준다.", "Give him the answer right away again, and send it as a screenshot."), tx("정리한 답을 받아도 스스로 찾는 힘은 생기지 않아, 네 번째 질문도 오게 됩니다.", "Even a tidy answer builds no skill in finding it, so a fourth question will come.")),
        option("b", tx("지식 베이스에서 함께 찾아 보고, 반복되는 어려움은 팀장과 트레이너에게 전한다.", "Look it up in the knowledge base together, and pass the repeated difficulty to the TL and trainer.")),
        option("c", tx("이미 두 번 알려 줬으니, 이번에는 교육 자료를 다시 읽고 혼자 찾아보라고 한다.", "You've explained it twice, so tell him to reread the training material and find it himself this time."), tx("혼자 찾게 두면 고객이 그만큼 기다리고, 서준은 다시 묻기를 망설이게 됩니다.", "Leaving him to search keeps the customer waiting, and Seojun will hesitate to ask again.")),
      ],
      answer: "b",
      explanation: tx("찾는 방법을 보여 주고, 반복되는 어려움은 추가 교육의 근거로 전합니다.", "Show how to find answers, and pass on repeated difficulties as grounds for more training."),
    },
  ],
  connection: { to: "escalation", text: tx("신입만 직무전문가를 찾는 것은 아닙니다. 일이 익숙한 기존 상담사도 권한 밖의 문의를 들고 옵니다.", "New hires are not the only ones who come to the SME. Experienced agents bring contacts beyond their authority too.") },
};
