import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 2. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["products", "systems", "policies", "review"];
const flow = ["products", "systems", "policies", "review", "products-systems", "systems-policies", "policies-review"];

export default {
  id: "training",
  order: 2,
  title: tx("교육을 버티는 법", "Getting Through Training"),
  short: tx("교육", "Training"),
  subtitle: tx("제품, 시스템, 정책이 한꺼번에 쏟아질 때 무엇부터 잡을지 정합니다.", "When products, systems and policies pour in all at once, decide what to grasp first."),
  procedure,
  diagram: {
    nodes: [
      wide(node("products", "제품·서비스", 180, 36, "Products and services")),
      wide(node("systems", "시스템", 180, 92, "Systems")),
      wide(node("policies", "정책", 180, 148, "Policies")),
      wide(node("review", "복습", 180, 204, "Review")),
    ],
    edges: [edge("products", "systems"), edge("systems", "policies"), edge("policies", "review")],
  },
  steps: [
    step(tx("이 레슨의 목적은 교육 기간에 쏟아지는 내용을 무엇부터, 어떻게 잡을지 정하는 것입니다.", "This lesson is about deciding what to grasp first, and how, when training pours so much at you."), flow, procedure, null),
    step(tx("지민의 교육은 몇 주(예시) 동안 이어집니다. 매일 새로운 제품, 화면, 규칙이 나와서 어제 배운 것이 벌써 헷갈립니다.", "Jimin's training runs for a few weeks (Example). Every day brings new products, screens and rules, and yesterday's lesson already feels blurry."), flow, [], null),
    step(tx("첫 단계는 제품·서비스입니다. 고객이 무엇을 사고 무엇을 쓰는지 알아야 문의를 이해할 수 있습니다. 고객 입장에서 직접 써 보면 빨리 익힙니다.", "The first stage is products and services. You can only understand a contact if you know what customers buy and use. Trying them yourself as a customer helps you learn fast."), flow, ["products"], null),
    step(tx("둘째 단계는 시스템입니다. CRM과 여러 도구의 화면을 익힙니다. 버튼 위치를 외우기보다, 문의 하나를 처음부터 끝까지 처리하는 순서로 연습합니다.", "The second stage is systems. You learn the screens of the CRM and other tools. Rather than memorizing where buttons are, practice handling one contact from start to finish."), flow, ["systems"], null),
    step(tx("셋째 단계는 정책입니다. 본인 확인과 개인정보 규칙은 매 콜 쓰니 확실히 익힙니다. 환불 같은 세부 정책은 모두 외우려 하지 말고, 지식 베이스 어디에 있는지를 익힙니다.", "The third stage is policies. Identity checks and personal-data rules come up on every call, so learn them by heart. For detailed policies such as refunds, don't try to memorize them all; learn where each one sits in the knowledge base."), flow, ["policies"], null),
    step(tx("넷째 단계는 복습입니다. 그날 배운 것을 내 말로 짧게 정리하고, 모르는 것은 그날 안에 트레이너 유나에게 묻습니다.", "The fourth stage is review. Sum up what you learned that day in your own words, and ask Yuna the trainer about anything unclear the same day."), flow, ["review"], null),
    step(tx("교육 중에 모르는 것이 많은 건 당연합니다. 질문을 미루면 다음 날 내용 위에 쌓여 더 어려워집니다.", "It's normal not to know a lot during training. Questions you put off pile up under the next day's material and make it harder."), flow, ["review"], null),
    step(tx("시험이나 퀴즈가 있다면 점수보다 틀린 이유를 봅니다. 실전 배치 뒤에 같은 문의가 그대로 들어옵니다.", "If there are tests or quizzes, look at why you got things wrong rather than at the score. The same contacts will come in after Go Live."), flow, ["review"], null),
    step(tx("미소의 한마디: 저는 정책을 통째로 외우려다 지쳤어요. 어디에 있는지만 알아도 많은 콜이 풀린다는 걸 늦게 알았어요.", "A word from Miso: I wore myself out trying to memorize every policy. I learned too late that knowing where things are solves a lot of calls."), flow, ["review"], null),
  ],
  checkpoint: [
    {
      id: "training-q1",
      prompt: tx("교육에서 배운 정책이 너무 많아, 지민은 다 외울 수 없을 것 같습니다. 어떻게 할까요?", "Training covers so many policies that Jimin feels she can't memorize them all. What should she do?"),
      options: [
        option("a", tx("밤을 새워서라도 모두 외운다.", "Memorize them all, even if it takes all night."), tx("다 외워도 정책은 바뀝니다. 지치기만 하고 오래가지 않습니다.", "Even if you memorize them all, policies change. It only wears you out and doesn't last.")),
        option("b", tx("자주 나오는 것부터 익히고, 나머지는 지식 베이스 어디에 있는지 익힌다.", "Learn the common ones first, and for the rest, learn where they are in the knowledge base.")),
        option("c", tx("실전 배치 뒤에 필요할 때 배운다.", "Learn them after Go Live, when they're needed."), tx("그러면 고객을 기다리게 하면서 처음 찾게 됩니다. 어디에 있는지는 교육 중에 익혀 둡니다.", "Then you'll be looking for them for the first time while a customer waits. Learn where they are during training.")),
      ],
      answer: "b",
      explanation: tx("외울 것과 찾을 것을 나눕니다.", "Separate what to memorize from what to look up."),
    },
    {
      id: "training-q2",
      prompt: tx("오후에 배운 CRM 화면이 잘 이해되지 않았습니다. 언제 물을까요?", "A CRM screen from the afternoon session didn't make sense. When should Jimin ask?"),
      options: [
        option("a", tx("내일 다시 배우면 알게 될 테니 기다린다.", "Wait, since it will click when she learns it again tomorrow."), tx("모르는 것이 다음 날 내용 위에 쌓이면 더 어려워집니다.", "What you don't understand piles up under the next day's material and gets harder.")),
        option("b", tx("그날 안에 트레이너 유나에게 묻는다.", "Ask Yuna the trainer the same day.")),
        option("c", tx("실전 배치 뒤에 직무전문가에게 묻는다.", "Ask the SME after Go Live."), tx("교육 기간은 마음껏 물어도 되는 시간입니다. 지금 묻는 것이 가장 쉽습니다.", "Training is the time when you can ask as much as you like. Asking now is easiest.")),
      ],
      answer: "b",
      explanation: tx("모르는 것은 그날 묻습니다.", "Ask about what you don't understand the same day."),
    },
  ],
  connection: { to: "nesting", text: tx("교육이 끝나면 실제 문의를 받기 시작합니다. 도움을 받으며 일하는 OJT와 네스팅입니다.", "After training, you start handling real contacts. Next is OJT and nesting, where you work with support.") },
};
