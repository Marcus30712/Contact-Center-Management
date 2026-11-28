import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 서포트 라이프사이클, lesson 4. Approved copy: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME First Steps lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["share", "delegate", "confirm", "next"];
const flow = ["share", "delegate", "confirm", "next", "share-delegate", "delegate-confirm", "confirm-next"];

export default {
  id: "senior",
  order: 4,
  title: tx("선임 상담사 지원", "Supporting Senior Agents"),
  short: tx("선임", "Senior"),
  subtitle: tx("기준을 나누고, 일을 맡기고, 다음 자리를 준비시킵니다.", "Share the rules, hand over work, and get them ready for the next role."),
  personaName: tx("준호", "Junho"),
  procedure,
  diagram: {
    nodes: [
      wide(node("share", "기준 공유", 180, 36, "Share the rules")),
      wide(node("delegate", "일 나누기", 180, 92, "Hand over work")),
      wide(node("confirm", "판단 확인", 180, 148, "Confirm judgment")),
      wide(node("next", "다음 자리 준비", 180, 204, "Next role prep")),
    ],
    edges: [edge("share", "delegate"), edge("delegate", "confirm"), edge("confirm", "next")],
  },
  steps: [
    step(tx("이 레슨의 목적은 선임 상담사와 승인 기준을 나누고, 신입 지원을 함께 맡으며, 다음 자리를 준비하도록 돕는 것입니다. 동기였던 선임과의 관계는 직무전문가 첫걸음 레슨 4에서 다뤘습니다.", "This lesson is about sharing approval rules with senior agents, splitting new-hire support with them, and helping them get ready for the next role. Your relationship with a former peer was covered in SME First Steps lesson 4."), flow, procedure, null),
    step(tx("준호는 팀의 선임 상담사입니다. 서준이 실무 체험을 할 때 버디로 옆에서 도왔습니다.", "Junho is the team's senior agent. When Seojun was in Nesting, Junho helped him as his buddy."), flow, [], null),
    step(tx("첫 단계는 기준 공유입니다. 내 승인 기준과 자주 오는 에스컬레이션 사례를 준호와 함께 봅니다. 기준이 바뀌면 준호에게도 먼저 알립니다.", "The first stage is sharing the rules. Go through your approval rules and common escalation cases with Junho. When a rule changes, tell Junho early too."), flow, ["share"], null),
    step(tx("선임이 기준을 알면 다른 상담사의 일반 질문에 직무전문가와 같은 답을 줄 수 있습니다. 승인은 여전히 직무전문가나 팀장이 합니다.", "A senior who knows the rules can give other agents the same answers to general questions as the SME. Approval still stays with the SME or the TL."), flow, ["share"], null),
    step(tx("둘째 단계는 일 나누기입니다. 신입의 버디, 일반 질문 1차 답변, 어려운 케이스 함께 검토처럼 준호가 맡을 수 있는 일을 정합니다. 맡기는 범위는 팀장과 먼저 맞춥니다.", "The second stage is handing over work. Decide what Junho can take on, such as being a new hire's buddy, first answers to general questions, and reviewing hard cases together. Agree on the scope with the TL first."), flow, ["delegate"], null),
    step(tx("셋째 단계는 판단 확인입니다. 선임의 에스컬레이션은 답을 몰라서보다 판단을 확인받고 싶어서 올 때가 많습니다. 준호의 판단을 먼저 듣고, 기준에 맞으면 그대로 승인합니다.", "The third stage is confirming judgment. A senior's escalation often comes from wanting a decision confirmed more than from not knowing the answer. Hear Junho's judgment first, and approve it as it is if it fits the rules."), flow, ["confirm"], null),
    step(tx("판단이 기준과 다르면 어느 부분이 다른지 짚어 줍니다. 이유를 알면 준호는 다음에 같은 판단을 혼자 할 수 있습니다.", "If his judgment differs from the rules, point out where. Once he knows why, Junho can make the same call alone next time."), flow, ["confirm"], null),
    step(tx("넷째 단계는 다음 자리 준비입니다. 준호가 직무전문가나 팀장 자리를 바란다면 허들 진행이나 캘리브레이션 참관처럼 그 자리의 일을 조금씩 맡겨 봅니다.", "The fourth stage is preparing for the next role. If Junho wants an SME or TL role, give him a little of that work at a time, such as running a huddle or sitting in on calibration."), flow, ["next"], null),
    step(tx("맡긴 일과 결과를 기록해 팀장에게 전합니다. 승진은 팀장과 매니저가 검토해 추천하고, 직무전문가의 기록은 그 근거가 됩니다.", "Record what you gave him and how it went, and pass it to the TL. Promotions are reviewed and recommended by the TL and the manager, and the SME's record is part of the grounds."), flow, ["next"], null),
  ],
  checkpoint: [
    {
      id: "senior-q1",
      prompt: tx("일반 질문을 맡은 준호가 승인이 필요한 보상 요청까지 \"괜찮을 거야\"라며 처리해 주려 합니다. 알맞은 것은 무엇일까요?", "Junho, who answers general questions, is about to handle a compensation request that needs approval, saying \"It'll be fine.\" What fits best?"),
      options: [
        option("a", tx("준호는 기준을 잘 알고 경력도 길어서, 이번 건은 그대로 처리하게 둔다.", "Junho knows the rules well and has years in, so let him handle this one."), tx("기준을 아는 것과 승인할 권한은 다릅니다. 선임이 승인하기 시작하면 승인 기록이 남지 않습니다.", "Knowing the rules is not the same as having approval authority. Once seniors start approving, no approval record is left.")),
        option("b", tx("승인 권한은 선임에게 없으니, 답변은 계속 맡기되 승인 건은 넘기게 한다.", "Seniors don't hold approval authority, so keep him on answering but have approval cases come to you.")),
        option("c", tx("승인 권한을 넘은 건 문제이니, 앞으로 준호에게 질문 답변을 맡기지 않는다.", "Overstepping approval is a problem, so stop giving Junho questions to answer."), tx("한 건 때문에 나눈 일을 모두 거두면 직무전문가에게 다시 일이 몰리고, 준호도 자랄 기회를 잃습니다.", "Taking back all the shared work over one case piles it on the SME again, and Junho loses a chance to grow.")),
      ],
      answer: "b",
      explanation: tx("선임에게 나누는 것은 답변과 지원이고, 승인은 직무전문가와 팀장에게 남깁니다.", "What you share with seniors is answering and support; approval stays with the SME and the TL."),
    },
    {
      id: "senior-q2",
      prompt: tx("준호가 에스컬레이션을 보내며 해결 방법을 적어 두었고, 그 방법은 기준에 맞습니다. 어떻게 할까요?", "Junho sends an escalation with a solution already written down, and it fits the rules. What do you do?"),
      options: [
        option("a", tx("처음부터 다시 판단해, 내 방법을 따로 찾아 본다.", "Judge it again from scratch and find your own way."), tx("기준에 맞는 판단을 다시 하면 고객 응대가 늦어지고, 준호는 자기 판단을 믿지 않게 됩니다.", "Judging again something that already fits the rules slows the customer's answer, and Junho stops trusting his own judgment.")),
        option("b", tx("준호의 방법대로 승인하고, 판단이 맞았다고 짧게 알려 준다.", "Approve it as Junho proposed, and tell him briefly that his call was right.")),
        option("c", tx("선임이니 앞으로 이런 건은 확인 없이 알아서 처리하라고 한다.", "He is a senior, so tell him to handle such cases himself without checking from now on."), tx("승인 권한은 사람이 아니라 자리에 붙어 있습니다. 확인 없이 처리하면 기록과 책임이 흐려집니다.", "Approval authority comes with the role, not the person. Handling cases without checking blurs records and responsibility.")),
      ],
      answer: "b",
      explanation: tx("선임의 판단이 기준에 맞으면 그대로 승인하고 알려 줍니다. 이것이 선임을 다음 자리로 키우는 방법입니다.", "When a senior's judgment fits the rules, approve it as is and say so. That is how a senior grows into the next role."),
    },
  ],
  connection: { to: "leadsupport", text: tx("교육생부터 선임까지 한 바퀴를 돌았습니다. 마지막은 이 모든 단계를 함께 보는 사람, 팀장입니다.", "From trainee to senior, you have gone once around. Last is the person who sees all these stages together: the TL.") },
};
