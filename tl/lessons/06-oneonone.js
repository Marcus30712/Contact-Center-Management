import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 첫걸음, lesson 6. Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["first", "hear", "compare", "notes"];
const flow = ["first", "hear", "compare", "notes", "first-hear", "hear-compare", "compare-notes"];

export default {
  id: "oneonone",
  order: 6,
  title: tx("팀원 한 명씩 다루는 법 정하기", "Deciding How to Work with Each Team Member"),
  short: tx("한 명씩", "One by one"),
  subtitle: tx("첫 1:1 면담으로 듣고, 팀원마다 도울 방법을 메모합니다.", "Listen in a first one-on-one, and note how to help each person."),
  procedure,
  diagram: {
    nodes: [
      wide(node("first", "첫 면담", 180, 36, "First one-on-one")),
      wide(node("hear", "듣기", 180, 92, "Listen")),
      wide(node("compare", "맞춰 보기", 180, 148, "Compare")),
      wide(node("notes", "개인 메모", 180, 204, "Personal notes")),
    ],
    edges: [edge("first", "hear"), edge("hear", "compare"), edge("compare", "notes")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀원 한 사람씩 짧은 첫 면담을 하고, 지금까지 파악한 것과 합쳐 각자를 어떻게 도울지 정하는 것입니다.", "This lesson is about holding a short first one-on-one with each team member and combining it with what you've learned to decide how to help each person."), flow, procedure, null),
    step(tx("첫 단계는 첫 면담입니다. 팀원마다 15분(예시) 정도 1:1 시간을 잡습니다. 평가가 아니라 서로 알아 가는 자리라고 먼저 말합니다.", "The first stage is the first one-on-one. Set aside about 15 minutes (Example) with each person. Say first that this is a chance to get to know each other, not an evaluation."), flow, ["first"], null),
    step(tx("둘째 단계는 듣기입니다. 본인이 생각하는 강점, 어려운 점, 앞으로 해 보고 싶은 일을 묻습니다. 기록으로는 알 수 없는 것이 여기서 나옵니다.", "The second stage is listening. Ask about their strengths as they see them, what is hard, and what they would like to try. This is where you hear what the records can't tell you."), flow, ["hear"], null),
    step(tx("지민은 최근 집안 사정으로 야간 근무가 힘들다고 말합니다. CSAT가 떨어지기 시작한 시점과 겹칩니다. 숫자의 이유가 사람에게서 나옵니다.", "Jimin says that family matters have made night shifts hard lately. It lines up with when her CSAT started to drop. The reason behind the number comes from the person."), flow, ["hear"], null),
    step(tx("개인 사정은 필요한 만큼만 듣고, 지민의 허락 없이 다른 사람에게 말하지 않습니다. 근무 조정이 필요하면 정해진 절차로 진행합니다.", "Hear personal matters only as far as needed, and don't share them without Jimin's permission. If her shifts need changing, follow the agreed process."), flow, ["hear"], null),
    step(tx("셋째 단계는 맞춰 보기입니다. 본인의 이야기와 기록, 직접 본 모습을 맞춰 봅니다. 서로 다르면 어느 쪽이 맞는지 단정하지 않고 더 지켜봅니다.", "The third stage is comparing. Compare what they told you with the records and what you saw yourself. If they differ, don't decide which is right; keep watching."), flow, ["compare"], null),
    step(tx("넷째 단계는 개인 메모입니다. 팀원마다 강점, 도울 점, 맡겨 볼 일, 다음에 확인할 날을 적습니다. 예를 들어 준호는 마무리 확인 습관이 잡힐 때까지 신입 버디 역할을 잠시 쉬고, 그 습관을 함께 봅니다.", "The fourth stage is personal notes. For each person, write strengths, where to help, what to try giving them, and when to check again. For example, Junho steps back from the new-hire buddy role until his habit of checking before closing is in place, and you work on it with him."), flow, ["notes"], null),
    step(tx("메모는 계획이지 낙인이 아닙니다. 몇 주 뒤 다시 보며 맞지 않는 부분은 고칩니다.", "The notes are a plan, not a label. Look at them again in a few weeks and fix what doesn't fit."), flow, ["notes"], null),
  ],
  checkpoint: [
    {
      id: "oneonone-q1",
      prompt: tx("첫 1:1 면담을 시작하는 말로 알맞은 것은 무엇일까요?", "What fits as the opening of a first one-on-one?"),
      options: [
        option("a", tx("\"지난 몇 달 성과를 보니 보완할 점이 많네요. 오늘은 그 이야기부터 할게요.\"", "\"Looking at the last few months, there's a lot to improve. Let's start with that today.\""), tx("첫 만남을 평가로 시작하면 팀원은 방어적이 되어 속마음을 말하지 않습니다.", "Opening a first meeting with an evaluation makes people defensive, and they won't say what they really think.")),
        option("b", tx("\"서로 알아 가는 자리예요. 요즘 일은 어떤지 듣고 싶어요.\"", "\"This is for getting to know each other. I'd like to hear how work is going.\"")),
        option("c", tx("\"특별한 이야기가 없으면 짧게 끝낼게요.\"", "\"If there's nothing in particular, we'll keep it short.\""), tx("형식적으로 끝내면 기록으로는 알 수 없는 이야기를 들을 기회를 놓칩니다.", "Keeping it a formality misses the chance to hear what the records can't tell you.")),
      ],
      answer: "b",
      explanation: tx("첫 면담은 평가가 아니라 듣는 자리입니다.", "A first one-on-one is for listening, not evaluating."),
    },
    {
      id: "oneonone-q2",
      prompt: tx("지민이 면담에서 집안 사정으로 야간 근무가 힘들다고 말했습니다. 알맞은 것은 무엇일까요?", "In the one-on-one, Jimin says family matters have made night shifts hard. What fits?"),
      options: [
        option("a", tx("팀 허들에서 지민의 사정을 알리고, 야간 근무를 바꿔 줄 사람이 있는지 협조를 구한다.", "Tell the team at the huddle about her situation and ask who could swap night shifts with her."), tx("본인의 허락 없이 개인 사정을 알리면 신뢰가 무너집니다.", "Sharing someone's personal matters without permission destroys trust.")),
        option("b", tx("지민의 허락 없이 알리지 않고, 근무 조정은 정해진 절차로 확인한다.", "Don't share it without Jimin's permission, and check shift changes through the agreed process.")),
        option("c", tx("성과와 상관없는 개인 이야기라서 면담 메모에 남기지 않는다.", "Leave it out of your notes; it's personal and unrelated to performance."), tx("개인 사정이 성과에 영향을 주고 있을 수 있습니다. 필요한 만큼은 기억해 둡니다.", "Personal matters may be affecting performance. Keep what you need in mind.")),
      ],
      answer: "b",
      explanation: tx("개인 사정은 지키고, 필요한 조치는 절차대로 합니다.", "Protect personal matters, and take any needed action through the process."),
    },
  ],
  connection: { to: "direction", text: tx("한 사람씩 도울 방법을 정했습니다. 마지막은 이 모든 것을 들고 부매니저를 만나 팀 전체의 방향을 정하는 일입니다.", "You've decided how to help each person. Last, take all of this to your assistant manager and set the direction for the whole team.") },
};
