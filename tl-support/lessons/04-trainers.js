import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 서포트 라이프사이클, lesson 4. Copy: docs/superpowers/specs/2026-11-25-tl-support-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["handover", "getback", "help", "stepin"];
const flow = ["handover", "getback", "help", "stepin", "handover-getback", "getback-help", "help-stepin"];

export default {
  id: "trainers",
  order: 4,
  title: tx("트레이너 지원", "Supporting Trainers"),
  short: tx("트레이너", "Trainers"),
  subtitle: tx("현장에 필요한 교육을 요청하고, 교육 결과를 현장에서 이어 갑니다.", "Ask for the training the floor needs, and carry the results onto the floor."),
  personaName: tx("유나", "Yuna"),
  procedure,
  diagram: {
    nodes: [
      wide(node("handover", "맡기기", 180, 36, "Hand over")),
      wide(node("getback", "받기", 180, 92, "Get back")),
      wide(node("help", "돕기", 180, 148, "Help")),
      wide(node("stepin", "개입하기", 180, 204, "Step in")),
    ],
    edges: [edge("handover", "getback"), edge("getback", "help"), edge("help", "stepin")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀장이 트레이너와 함께 신입 교육과 추가 교육을 현장에 맞게 만들어 가는 절차를 보는 것입니다.", "This lesson looks at how a team leader works with trainers to shape new-hire and refresher training to fit the floor."), flow, procedure, null),
    step(tx("첫 단계는 맡기기입니다. 트레이너 유나에게 팀에 필요한 교육을 근거와 함께 요청합니다. 예를 들어 \"환불 문의 오안내가 이번 달 12건(예시)\"처럼 사례를 붙이면 교육의 목표가 분명해집니다.", "The first stage is handing over. Ask Yuna the trainer for the training your team needs, with evidence. Attaching cases, such as \"12 wrong explanations on refund contacts this month (Example),\" makes the training goal clear."), flow, ["handover"], null),
    step(tx("둘째 단계는 받기입니다. 신입의 교육 기록, 실무 체험에서 더 볼 유형, 수료 평가를 유나에게 받아 직무전문가와 함께 나눕니다.", "The second stage is getting back. Get new hires' training records, the types to watch in Nesting and graduation assessments from Yuna, and share them with the SME."), flow, ["getback"], null),
    step(tx("셋째 단계는 돕기입니다. 교육 자료와 현장 방식이 다르면 알려 주고, 교육에 쓸 실제 사례와 녹취를 찾아 줍니다. 현장에서 온 사례가 교육을 살아 있게 합니다.", "The third stage is helping. Tell her when training material and the floor's way differ, and find real cases and recordings for training. Cases from the floor keep training alive."), flow, ["help"], null),
    step(tx("교육이 끝난 뒤가 더 중요합니다. 배운 것이 현장에서 쓰이는지 직무전문가와 함께 확인하고, 결과를 유나에게 다시 알려 줍니다.", "What happens after training matters more. Check with the SME whether what was learned is used on the floor, and tell Yuna the results."), flow, ["help"], null),
    step(tx("넷째 단계는 개입하기입니다. 준비가 덜 된 신입이 있으면, 유나와 함께 수료를 미루고, 실무 체험 기간을 늘릴지 추가 교육을 할지 정합니다. 인원이 급하다고 무리하게 투입하지 않습니다.", "The fourth stage is stepping in. If a new hire isn't ready, decide with Yuna to hold back graduation, and whether to extend Nesting or add extra training. Don't force someone onto the floor because you're short of people."), flow, ["stepin"], null),
    step(tx("트레이너는 교실 안을, 팀장은 현장을 책임집니다. 두 사람이 같은 신입을 같은 눈으로 볼 때 신입이 오래 남습니다.", "The trainer is responsible for the classroom, the team leader for the floor. New hires stay longer when both see them through the same eyes."), flow, ["stepin"], null),
  ],
  checkpoint: [
    {
      id: "trainers-q1",
      prompt: tx("트레이너에게 추가 교육을 요청할 때 알맞은 것은 무엇일까요?", "What fits when you ask a trainer for extra training?"),
      options: [
        option("a", tx("\"요즘 팀이 전반적으로 약해요. 기본 교육을 한 번 더 부탁드려요.\"", "\"The team seems weak across the board lately. Could you run the basics again?\""), tx("무엇이 약한지 모르면 트레이너는 교육의 목표를 정할 수 없습니다.", "Without knowing what is weak, the trainer can't set a training goal.")),
        option("b", tx("\"환불 오안내가 이번 달 12건(예시)이에요. 사례를 첨부합니다.\"", "\"There were 12 wrong refund explanations this month (Example). Cases are attached.\"")),
        option("c", tx("\"다음 기수 교육을 늘려 주세요. 신입이 같은 문제를 겪지 않게요.\"", "\"Please add more to the next class's training, so new hires don't hit the same problem.\""), tx("지금 팀원의 문제를 다음 기수 교육으로는 풀 수 없습니다.", "Training the next class won't fix the problems of the people on your team now.")),
      ],
      answer: "b",
      explanation: tx("교육 요청은 무엇을 왜 배워야 하는지 사례와 함께 합니다.", "Ask for training with cases that show what needs learning and why."),
    },
    {
      id: "trainers-q2",
      prompt: tx("인원이 부족한데 수료를 앞둔 신입 한 명이 아직 준비가 덜 됐습니다. 어떻게 할까요?", "You're short of people, and a new hire about to graduate from Nesting isn't ready yet. What do you do?"),
      options: [
        option("a", tx("예정대로 수료시켜 바로 정식 팀에 투입한다.", "Let them graduate on schedule and put them on the regular team right away."), tx("준비가 덜 된 채 투입하면 고객과 신입 모두 힘들어지고, 신입이 떠나기 쉽습니다.", "Putting someone on the floor before they're ready is hard on both customers and the new hire, who may well leave.")),
        option("b", tx("트레이너와 함께 수료를 미루고, 실무 체험 연장이나 추가 교육을 정한다.", "Decide with the trainer to hold back graduation, and choose between longer Nesting and extra training.")),
        option("c", tx("신입에게 자료를 주고, 수료 전까지 혼자 더 공부하라고 한다.", "Give the new hire materials and tell them to study more on their own before graduation."), tx("혼자 두면 같은 곳에서 계속 막히고, 무엇이 부족한지도 모른 채 시간이 갑니다.", "Left alone, they keep getting stuck in the same places, and time passes without knowing what is missing.")),
      ],
      answer: "b",
      explanation: tx("준비가 덜 된 신입은 트레이너와 함께 준비시킨 뒤 투입합니다.", "Get a new hire who isn't ready prepared with the trainer before putting them on the floor."),
    },
  ],
  connection: { to: "team", text: tx("상담사, 직무전문가, QA, 트레이너를 각각 보았습니다. 마지막은 이들을 한 팀으로 묶는 일입니다.", "You've looked at agents, the SME, QA and trainers in turn. Last is bringing them together as one team.") },
};
