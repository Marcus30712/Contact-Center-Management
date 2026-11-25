import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 2. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["prepare", "beside", "check", "report"];
const flow = [...procedure, "prepare-beside", "beside-check", "check-report"];

export default {
  id: "newcomer",
  order: 2,
  title: tx("교육 중·막 교육을 마친 상담사 서포트"),
  short: tx("신입 서포트"),
  subtitle: tx("질문을 기다리지 말고 먼저 다가갑니다."),
  personaName: tx("서준"),
  procedure,
  diagram: {
    nodes: [
      wide(node("prepare", "미리 알기", 180, 36)),
      wide(node("beside", "옆에 붙기", 180, 92)),
      wide(node("check", "먼저 확인", 180, 148)),
      wide(node("report", "팀장에게 공유", 180, 204)),
    ],
    edges: [edge("prepare", "beside"), edge("beside", "check"), edge("check", "report")],
  },
  steps: [
    step(tx("이 레슨의 목적은 교육 중이거나 막 교육을 마친 상담사가 실제 문의에 적응하도록 돕는 것입니다. 이 시기는 상담사가 가장 많이 떠나는 시기입니다."), flow, procedure, null),
    step(tx("서준은 지난주 교육을 마치고 오늘 처음 팀에 합류했습니다. 지식은 있지만 실제 고객 앞에 서는 것은 처음입니다."), flow, [], null),
    step(tx("첫 단계는 미리 알기입니다. 트레이너에게 서준이 교육에서 어려워한 부분을 미리 듣고, 오늘 들어올 문의 중 서준에게 어려울 만한 유형을 떠올려 둡니다."), flow, ["prepare"], null),
    step(tx("둘째 단계는 옆에 붙기입니다. 첫 며칠(예시)은 서준 자리 가까이 있으며 첫 몇 건을 함께 봅니다. 전화는 같이 듣고, 채팅과 이메일은 보내기 전에 함께 읽습니다."), flow, ["beside"], null),
    step(tx("답을 바로 주기보다 어디서 찾는지 보여 줍니다. 지식 베이스의 어느 문서에 있는지 알려 주면 다음에는 혼자 찾을 수 있습니다."), flow, ["beside"], null),
    step(tx("셋째 단계는 먼저 확인하기입니다. 신입은 질문하는 것 자체를 망설입니다. 손을 들 때까지 기다리지 말고, 정해진 간격(예시: 1시간에 한 번)으로 먼저 다가가 묻습니다."), flow, ["check"], null),
    step(tx("실수는 그 자리에서 짧게 고쳐 주고, 잘한 것도 바로 말해 줍니다. 이 시기에는 칭찬 한마디가 버티는 힘이 됩니다."), flow, ["check"], null),
    step(tx("교육 중인 상담사(OJT)와 막 교육을 마친 상담사는 붙어 있는 거리가 다릅니다. OJT 기간에는 트레이너와 함께 보고, 네스팅부터는 SME가 더 가까이 붙습니다."), flow, ["beside"], null),
    step(tx("넷째 단계는 팀장에게 공유하기입니다. 하루가 끝나면 서준이 무엇을 잘했고 어디서 막혔는지 팀장과 트레이너에게 짧게 전합니다. 평가가 아니라 다음 날 도울 곳을 정하기 위해서입니다."), flow, ["report"], null),
    step(tx("같은 곳에서 계속 막히면 추가 교육이 필요할 수 있습니다. 결정은 팀장과 트레이너가 하고, 당신은 근거가 될 사례를 모읍니다."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "newcomer-q1",
      prompt: tx("서준이 오전 내내 한 번도 질문하지 않았습니다. 어떻게 할까요?"),
      options: [
        option("a", tx("잘하고 있다는 뜻이니 그대로 둔다."), tx("신입이 조용한 것은 잘해서가 아니라 묻기를 망설여서일 때가 많습니다.")),
        option("b", tx("먼저 다가가 오전에 받은 문의가 어땠는지 묻는다.")),
        option("c", tx("질문을 하지 않는다고 팀장에게 알린다."), tx("아직 무슨 일인지 모르는 상태입니다. 먼저 서준에게 직접 묻는 것이 순서입니다.")),
      ],
      answer: "b",
      explanation: tx("신입 서포트는 기다리는 것이 아니라 먼저 다가가는 것입니다."),
    },
    {
      id: "newcomer-q2",
      prompt: tx("서준이 같은 절차를 세 번째 묻습니다. 알맞은 것은 무엇일까요?"),
      options: [
        option("a", tx("이번에도 바로 답을 알려 준다."), tx("답만 주면 스스로 찾는 힘이 생기지 않아, 네 번째 질문도 오게 됩니다.")),
        option("b", tx("지식 베이스에서 함께 찾아 보여 주고, 반복되는 부분을 팀장과 트레이너에게 전한다.")),
        option("c", tx("이미 알려 줬으니 혼자 찾아보라고 한다."), tx("혼자 찾게 두면 고객이 그만큼 기다리고, 서준은 다시 묻기를 망설이게 됩니다.")),
      ],
      answer: "b",
      explanation: tx("찾는 방법을 보여 주고, 반복되는 어려움은 추가 교육의 근거로 전합니다."),
    },
  ],
  connection: { to: "escalation", text: tx("신입만 SME를 찾는 것은 아닙니다. 일이 익숙한 기존 상담사도 권한 밖의 문의를 들고 옵니다.") },
};
