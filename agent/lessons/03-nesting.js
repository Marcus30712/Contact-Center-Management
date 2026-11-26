import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 3. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["lookup", "nextseat", "senior", "sme"];
const flow = ["lookup", "nextseat", "senior", "sme", "lookup-nextseat", "nextseat-senior", "senior-sme"];

export default {
  id: "nesting",
  order: 3,
  title: tx("OJT와 네스팅: 묻는 법", "OJT and Nesting: How to Ask"),
  short: tx("묻는 법", "How to ask"),
  subtitle: tx("실제 문의를 받으며, 막혔을 때 누구에게 어떻게 물을지 익힙니다.", "While handling real contacts, learn whom to ask and how when you get stuck."),
  procedure,
  diagram: {
    nodes: [
      wide(node("lookup", "스스로 찾기", 180, 36, "Look it up")),
      wide(node("nextseat", "옆자리", 180, 92, "The next seat")),
      wide(node("senior", "선임", 180, 148, "A senior")),
      wide(node("sme", "직무전문가", 180, 204, "The SME")),
    ],
    edges: [edge("lookup", "nextseat"), edge("nextseat", "senior"), edge("senior", "sme")],
  },
  steps: [
    step(tx("이 레슨의 목적은 실제 문의를 받기 시작했을 때, 막히면 누구에게 어떻게 물을지 정하는 것입니다.", "This lesson is about deciding, once you start handling real contacts, whom to ask and how when you get stuck."), flow, procedure, null),
    step(tx("OJT에서 지민은 트레이너와 직무전문가가 지켜보는 가운데 채널별로 실제 문의를 받습니다. 네스팅에서는 신입끼리 모여 일하면서 조금 더 가까이 도움을 받습니다.", "In OJT, Jimin handles real contacts in each channel while the trainer and SME watch. In nesting, new hires work together and get closer support."), flow, [], null),
    step(tx("첫 단계는 스스로 찾기입니다. 막히면 지식 베이스와 내 메모를 먼저 짧게 찾아봅니다. 무엇을 찾아봤는지가 다음 질문의 재료가 됩니다.", "The first stage is looking it up. When stuck, search the knowledge base and your own notes briefly first. What you checked becomes the material for your question."), flow, ["lookup"], null),
    step(tx("둘째 단계는 옆자리입니다. 처음에는 양옆에 앉은 동료나 선임에게 가장 많이 묻습니다. 짧은 확인은 이렇게 빨리 해결됩니다.", "The second stage is the next seat. At first you ask the colleagues or seniors sitting on either side of you most often. Quick checks get solved fast this way."), flow, ["nextseat"], null),
    step(tx("셋째 단계는 선임입니다. 플로어의 선임 준호처럼 경험 많은 상담사에게 묻습니다. 비슷한 문의를 여러 번 받아 본 사람이라 요령까지 알려 줍니다.", "The third stage is a senior. Ask an experienced agent on the floor, such as Junho. Having handled similar contacts many times, he can share the tricks too."), flow, ["senior"], null),
    step(tx("넷째 단계는 직무전문가입니다. 정책 판단이나 승인이 필요하면 직무전문가 하린에게 채팅으로 묻거나, 손을 들어 플로어 서포트를 받습니다.", "The fourth stage is the SME. When you need a policy call or an approval, ask Harin the SME in chat, or raise your hand for floor support."), flow, ["sme"], null),
    step(tx("잘 묻는 법이 있습니다. 고객 상황, 내가 확인한 것, 필요한 것을 한 번에 말하면 답이 빨리 옵니다.", "There's a way to ask well. Say the customer's situation, what you checked and what you need all at once, and the answer comes faster."), flow, ["sme"], null),
    step(tx("받은 답은 메모해 둡니다. 같은 것을 두 번 묻지 않으려는 노력이 보이면, 다음 질문도 더 편하게 받아 줍니다.", "Note down the answers you get. When people see you trying not to ask the same thing twice, they're happier to take your next question."), flow, ["sme"], null),
    step(tx("미소의 한마디: 저는 묻는 게 민폐 같아서 혼자 붙잡고 있다가 고객을 더 기다리게 했어요. 잘 묻는 것도 실력이에요.", "A word from Miso: I felt asking was a bother, so I struggled alone and kept customers waiting longer. Asking well is a skill too."), flow, ["sme"], null),
  ],
  checkpoint: [
    {
      id: "nesting-q1",
      prompt: tx("지민이 고객과 통화하다가 필요한 정책을 찾지 못했습니다. 어떻게 할까요?", "During a call, Jimin can't find the policy she needs. What should she do?"),
      options: [
        option("a", tx("고객에게 기억나는 대로 안내한다.", "Tell the customer whatever she remembers."), tx("틀린 안내는 고객이 다시 연락하게 만들고, 신뢰도 잃게 합니다.", "Wrong information makes the customer contact you again and costs their trust.")),
        option("b", tx("고객이 불안하지 않도록, 양해를 구하고 보류한 뒤 옆자리나 직무전문가에게 확인한다.", "So the customer isn't left wondering, ask them to bear with her, put the call on hold, then check with the next seat or the SME.")),
        option("c", tx("고객이 기다리는 것을 알기에, 찾을 때까지 말없이 지식 베이스를 계속 검색한다.", "Knowing the customer is waiting, keep searching the knowledge base in silence until she finds it."), tx("아무 말 없이 기다리면 고객은 통화가 끊긴 줄 압니다. 기다려 달라고 먼저 말합니다.", "In silence, the customer thinks the call has dropped. Ask them to wait first.")),
      ],
      answer: "b",
      explanation: tx("모르면 고객에게 양해를 구하고, 확인한 뒤 안내합니다.", "When you don't know, ask the customer for a moment, check, then answer."),
    },
    {
      id: "nesting-q2",
      prompt: tx("직무전문가 하린에게 채팅으로 물을 때 가장 좋은 질문은 무엇일까요?", "Which is the best question to send Harin the SME in chat?"),
      options: [
        option("a", tx("\"고객이 환불해 달라는데 이거 어떻게 해요? 지금 통화 중이라 급해요.\"", "\"The customer wants a refund. How do I do this? I'm on the call, so it's urgent.\""), tx("무엇을 확인했고 무엇이 필요한지 빠져 있어, 하린이 되물어야 해서 답이 늦어집니다.", "It leaves out what you checked and what you need, so Harin has to ask back and the answer comes later.")),
        option("b", tx("\"환불 문의(예시)인데 구매 기간이 지났어요. 예외 승인 되나요?\"", "\"Refund request (Example), past the purchase window. Can we approve an exception?\"")),
        option("c", tx("\"고객이 많이 화났어요. 제가 처리하기 어려우니 빨리 와 주세요.\"", "\"The customer is really angry. I can't handle this, so please come quickly.\""), tx("급한 마음은 알지만, 무엇이 필요한지 알아야 하린이 바로 도울 수 있습니다.", "The urgency is understandable, but Harin needs to know what you need to help right away.")),
      ],
      answer: "b",
      explanation: tx("상황, 확인한 것, 필요한 것을 한 번에 말합니다.", "Say the situation, what you checked and what you need, all at once."),
    },
  ],
  connection: { to: "golive", text: tx("네스팅을 마치고 수료하면 정식 팀에 합류합니다. 혼자 받는 첫 콜입니다.", "Once you finish nesting and graduate, you join the regular team. Next is your first call on your own.") },
};
