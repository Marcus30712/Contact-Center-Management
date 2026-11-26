import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 5. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["listen", "acknowledge", "simple", "handover"];
const flow = ["listen", "acknowledge", "simple", "handover", "listen-acknowledge", "acknowledge-simple", "simple-handover"];

export default {
  id: "customers",
  order: 5,
  title: tx("어려운 고객", "Difficult Customers"),
  short: tx("어려운 고객", "Difficult customers"),
  subtitle: tx("화난 고객과, 내 말을 알아듣기 어려워하는 고객을 응대하는 순서를 익힙니다.", "Learn the order for handling angry customers and customers who struggle to understand you."),
  procedure,
  diagram: {
    nodes: [
      wide(node("listen", "듣기", 180, 36, "Listen")),
      wide(node("acknowledge", "인정하기", 180, 92, "Acknowledge")),
      wide(node("simple", "쉽게 말하기", 180, 148, "Say it simply")),
      wide(node("handover", "넘기기", 180, 204, "Hand over")),
    ],
    edges: [edge("listen", "acknowledge"), edge("acknowledge", "simple"), edge("simple", "handover")],
  },
  steps: [
    step(tx("이 레슨의 목적은 화난 고객과, 내 말을 알아듣기 어려워하는 고객을 응대하는 순서를 익히는 것입니다.", "This lesson is about learning the order for handling angry customers and customers who struggle to understand you."), flow, procedure, null),
    step(tx("지민은 오늘 배송이 늦어 화가 난 고객(예시)과, 안내를 여러 번 되묻는 고객을 연달아 만났습니다. 통화가 끝나고도 가슴이 두근거립니다.", "Today Jimin had an angry customer whose delivery was late (Example), then one who kept asking her to repeat herself. Her heart is still racing after the calls."), flow, [], null),
    step(tx("첫 단계는 듣기입니다. 고객의 화는 대부분 상담사가 아니라 상황을 향합니다. 말을 끊지 않고 끝까지 듣고, 핵심을 메모합니다.", "The first stage is listening. A customer's anger is usually aimed at the situation, not at the agent. Listen to the end without cutting in, and note the key points."), flow, ["listen"], null),
    step(tx("둘째 단계는 인정하기입니다. \"많이 불편하셨겠습니다\"처럼 마음을 먼저 인정합니다. 할 수 없는 약속은 하지 않습니다.", "The second stage is acknowledging. Acknowledge their feelings first, with something like \"That must have been really frustrating.\" Don't promise what you can't do."), flow, ["acknowledge"], null),
    step(tx("셋째 단계는 쉽게 말하기입니다. 문장을 짧게, 한 번에 하나씩 말하고, 회사 안에서만 쓰는 말은 풀어서 씁니다. 중간중간 이해했는지 확인합니다.", "The third stage is saying it simply. Use short sentences, one point at a time, and explain in-house terms in plain words. Check along the way that they've understood."), flow, ["simple"], null),
    step(tx("넷째 단계는 넘기기입니다. 내 권한을 넘는 요청은 센터의 절차대로 직무전문가 하린이나 팀장에게 넘깁니다. 넘길 때는 고객 상황과 내가 안내한 것을 함께 전합니다.", "The fourth stage is handing over. Hand requests beyond your authority to Harin the SME or your team leader, as your center's process says. When you do, pass on the customer's situation and what you've told them."), flow, ["handover"], null),
    step(tx("욕설이 계속될 때도 정해진 절차가 있습니다. 먼저 센터가 정한 문구로 경고하고, 정한 횟수를 넘으면 욕설 때문에 더 안내할 수 없다고 알린 뒤 통화를 종료합니다.", "There's a set process for ongoing abuse too. First warn the customer with your center's set wording; if it goes past the number of times your center allows, tell them you can't continue because of the abusive language, then end the call."), flow, ["handover"], null),
    step(tx("상급자의 승인이 필요한 센터라면, 종료하기 전에 직무전문가나 팀장에게 말이나 메시지로 승인을 받습니다. 통화가 끝나면 상담 기록에 승인한 사람과 욕설로 인한 종료라는 사유를 남깁니다.", "If your center needs a supervisor's approval, get it from the SME or team leader by voice or message before ending the call. After the call, record in the contact notes who approved it and that it ended because of abusive language."), flow, ["handover"], null),
    step(tx("넘기거나 종료하는 것은 포기가 아니라 절차입니다. 힘든 통화 뒤에는 정해진 범위 안에서 잠깐 숨을 고르고, 마음이 크게 흔들렸다면 팀장에게 말해도 됩니다.", "Handing over or ending a call isn't giving up; it's the process. After a hard call, take a short breather within the agreed limits, and if it shook you badly, tell your team leader."), flow, ["handover"], null),
    step(tx("미소의 한마디: 저는 화난 고객의 말을 제 탓으로 듣고 오래 속상해했어요. 상황에 화가 난 거라는 걸 알고 나서야 버틸 수 있었어요.", "A word from Miso: I used to take angry customers' words as my fault and stay upset for a long time. Only when I saw that they were angry at the situation could I keep going."), flow, ["handover"], null),
  ],
  checkpoint: [
    {
      id: "customers-q1",
      prompt: tx("고객이 지민의 안내를 여러 번 되묻습니다. 어떻게 할까요?", "A customer keeps asking Jimin to repeat what she said. What should she do?"),
      options: [
        option("a", tx("고객이 알아들을 때까지 같은 문장을 더 크게 반복한다.", "Repeat the same sentence, louder, until the customer gets it."), tx("같은 말을 반복하면 고객은 더 답답해집니다.", "Hearing the same words again only frustrates the customer more.")),
        option("b", tx("짧은 문장으로 하나씩 말하고, 이해했는지 확인한다.", "Say one thing at a time in short sentences, and check they've understood.")),
        option("c", tx("말로는 어려워 보이니 문자로 보내 드리겠다고 하고 바로 통화를 끝낸다.", "Talking isn't working, so say she'll send a text and end the call right away."), tx("문자 안내가 도움이 될 수는 있지만, 이해했는지 확인하지 않고 끝내면 다시 연락이 옵니다.", "A text can help, but ending without checking they understood brings another contact.")),
      ],
      answer: "b",
      explanation: tx("쉬운 말로, 하나씩, 확인하며 말합니다.", "Use simple words, one at a time, and check as you go."),
    },
    {
      id: "customers-q2",
      prompt: tx("고객의 욕설이 계속됩니다. 어떻게 할까요?", "The customer keeps swearing. What should Jimin do?"),
      options: [
        option("a", tx("고객이니 끝까지 참고 듣는다.", "Put up with it to the end, since it's a customer."), tx("상담사를 보호하는 절차가 있습니다. 혼자 견딜 일이 아닙니다.", "There's a process that protects agents. It's not something to endure alone.")),
        option("b", tx("센터 문구로 경고하고, 계속되면 절차대로 종료한 뒤 기록한다.", "Warn with the center's wording; if it continues, end the call by the process and record it.")),
        option("c", tx("더 들을 필요가 없으니, 욕설이 나오는 순간 아무 안내 없이 바로 통화를 끊는다.", "There's no need to listen, so hang up the moment the swearing starts, without a word."), tx("경고와 기록 없이 끊으면 고객 불만이 상담사의 책임으로 남을 수 있습니다. 승인이 필요한 센터라면 승인도 받습니다.", "Ending without a warning and a record can leave the complaint on the agent. If your center needs approval, get that too.")),
      ],
      answer: "b",
      explanation: tx("욕설은 경고부터 시작하는 센터의 절차를 따르고, 필요하면 승인을 받아 기록까지 남깁니다.", "For abuse, follow the center's process starting with a warning, get approval where it's needed, and leave a record."),
    },
  ],
  connection: { to: "review", text: tx("이런 통화들은 평가 점수로도 돌아옵니다. 매주 팀장과 하는 평가 리뷰를 봅니다.", "Calls like these also come back as quality scores. Next is the weekly score review with your team leader.") },
};
