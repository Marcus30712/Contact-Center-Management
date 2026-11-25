import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 서포트 라이프사이클, lesson 4. Approved copy: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME First Steps lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["share", "delegate", "confirm", "next"];
const flow = ["share", "delegate", "confirm", "next", "share-delegate", "delegate-confirm", "confirm-next"];

export default {
  id: "senior",
  order: 4,
  title: tx("선임 상담사 지원"),
  short: tx("선임"),
  subtitle: tx("기준을 나누고, 일을 맡기고, 다음 자리를 준비시킵니다."),
  personaName: tx("준호"),
  procedure,
  diagram: {
    nodes: [
      wide(node("share", "기준 공유", 180, 36)),
      wide(node("delegate", "일 나누기", 180, 92)),
      wide(node("confirm", "판단 확인", 180, 148)),
      wide(node("next", "다음 자리 준비", 180, 204)),
    ],
    edges: [edge("share", "delegate"), edge("delegate", "confirm"), edge("confirm", "next")],
  },
  steps: [
    step(tx("이 레슨의 목적은 선임 상담사와 승인 기준을 나누고, 신입 지원을 함께 맡으며, 다음 자리를 준비하도록 돕는 것입니다. 동기였던 선임과의 관계는 SME 첫걸음 레슨 4에서 다뤘습니다."), flow, procedure, null),
    step(tx("준호는 팀의 선임 상담사입니다. 서준이 네스팅을 할 때 버디로 옆에서 도왔습니다."), flow, [], null),
    step(tx("첫 단계는 기준 공유입니다. 내 승인 기준과 자주 오는 에스컬레이션 사례를 준호와 함께 봅니다. 기준이 바뀌면 준호에게도 먼저 알립니다."), flow, ["share"], null),
    step(tx("선임이 기준을 알면 다른 상담사의 일반 질문에 SME와 같은 답을 줄 수 있습니다. 승인은 여전히 SME나 팀장이 합니다."), flow, ["share"], null),
    step(tx("둘째 단계는 일 나누기입니다. 신입의 버디, 일반 질문 1차 답변, 어려운 케이스 함께 검토처럼 준호가 맡을 수 있는 일을 정합니다. 맡기는 범위는 팀장과 먼저 맞춥니다."), flow, ["delegate"], null),
    step(tx("셋째 단계는 판단 확인입니다. 선임의 에스컬레이션은 답을 몰라서보다 판단을 확인받고 싶어서 올 때가 많습니다. 준호의 판단을 먼저 듣고, 기준에 맞으면 그대로 승인합니다."), flow, ["confirm"], null),
    step(tx("판단이 기준과 다르면 어느 부분이 다른지 짚어 줍니다. 이유를 알면 준호는 다음에 같은 판단을 혼자 할 수 있습니다."), flow, ["confirm"], null),
    step(tx("넷째 단계는 다음 자리 준비입니다. 준호가 SME나 팀장 자리를 바란다면 허들 진행이나 캘리브레이션 참관처럼 그 자리의 일을 조금씩 맡겨 봅니다."), flow, ["next"], null),
    step(tx("맡긴 일과 결과를 기록해 팀장에게 전합니다. 승진은 팀장과 매니저가 정하고, SME의 기록은 그 근거가 됩니다."), flow, ["next"], null),
  ],
  checkpoint: [
    {
      id: "senior-q1",
      prompt: tx("일반 질문을 맡은 준호가 승인이 필요한 보상 요청까지 \"괜찮을 거야\"라며 처리해 주려 합니다. 알맞은 것은 무엇일까요?"),
      options: [
        option("a", tx("준호는 기준을 알고 있으니 그대로 둔다."), tx("기준을 아는 것과 승인할 권한은 다릅니다. 선임이 승인하기 시작하면 승인 기록이 남지 않습니다.")),
        option("b", tx("일반 질문은 계속 준호에게 맡기고, 승인이 필요한 건은 SME에게 넘기도록 다시 맞춘다.")),
        option("c", tx("앞으로 준호에게 질문 답변을 맡기지 않는다."), tx("한 건 때문에 나눈 일을 모두 거두면 SME에게 다시 일이 몰리고, 준호도 자랄 기회를 잃습니다.")),
      ],
      answer: "b",
      explanation: tx("선임에게 나누는 것은 답변과 지원이고, 승인은 SME와 팀장에게 남깁니다."),
    },
    {
      id: "senior-q2",
      prompt: tx("준호가 에스컬레이션을 보내며 해결 방법을 적어 두었고, 그 방법은 기준에 맞습니다. 어떻게 할까요?"),
      options: [
        option("a", tx("처음부터 다시 판단해 내 방법을 찾는다."), tx("기준에 맞는 판단을 다시 하면 고객 응대가 늦어지고, 준호는 자기 판단을 믿지 않게 됩니다.")),
        option("b", tx("준호의 방법대로 승인하고, 판단이 맞았다고 짧게 알려 준다.")),
        option("c", tx("선임이니 앞으로는 확인 없이 알아서 처리하라고 한다."), tx("승인 권한은 사람이 아니라 자리에 붙어 있습니다. 확인 없이 처리하면 기록과 책임이 흐려집니다.")),
      ],
      answer: "b",
      explanation: tx("선임의 판단이 기준에 맞으면 그대로 승인하고 알려 줍니다. 이것이 선임을 다음 자리로 키우는 방법입니다."),
    },
  ],
  connection: { to: "leadsupport", text: tx("교육생부터 선임까지 한 바퀴를 돌았습니다. 마지막은 이 모든 단계를 함께 보는 사람, 팀장입니다.") },
};
