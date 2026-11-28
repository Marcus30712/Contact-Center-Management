import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 6. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["score", "listenback", "pickone", "nextweek"];
const flow = ["score", "listenback", "pickone", "nextweek", "score-listenback", "listenback-pickone", "pickone-nextweek"];

export default {
  id: "review",
  order: 6,
  title: tx("매주 평가 리뷰", "The Weekly Score Review"),
  short: tx("평가 리뷰", "Score review"),
  subtitle: tx("평가 점수를 읽고, 팀장과의 리뷰를 내 성장에 쓰는 법을 익힙니다.", "Learn to read your quality scores and use the review with your Team Leader to grow."),
  procedure,
  diagram: {
    nodes: [
      wide(node("score", "점수 보기", 180, 36, "Read the score")),
      wide(node("listenback", "녹취 듣기", 180, 92, "Listen back")),
      wide(node("pickone", "목표 1~2가지 고르기", 180, 148, "Pick 1–2 goals")),
      wide(node("nextweek", "중간·최종 검토", 180, 204, "Midpoint and final check")),
    ],
    edges: [edge("score", "listenback"), edge("listenback", "pickone"), edge("pickone", "nextweek")],
  },
  steps: [
    step(tx("이 레슨의 목적은 매주 받는 평가 점수를 읽고, 팀장과의 리뷰를 내 성장에 쓰는 법을 익히는 것입니다.", "This lesson is about reading the quality scores you get each week and using the review with your TL to grow."), flow, procedure, null),
    step(tx("QA 도현은 지민의 상담을 매주 몇 건(예시) 골라 평가합니다. 수진 팀장은 그 점수로 지민과 매주 리뷰를 합니다.", "Dohyun from QA scores a few of Jimin's contacts each week (Example). Sujin, her TL, reviews those scores with her every week."), flow, [], null),
    step(tx("첫 단계는 점수 보기입니다. 총점보다 항목별 점수를 봅니다. 인사, 본인 확인, 정확한 안내처럼 어디서 깎였는지가 중요합니다.", "The first stage is reading the score. Look at each item's score rather than the total. What matters is where you lost points, such as the greeting, the identity check or accurate information."), flow, ["score"], null),
    step(tx("둘째 단계는 녹취 듣기입니다. 리뷰 전에 평가받은 내 녹취나 채팅 로그를 다시 보고, 직접 볼 수 없는 센터라면 팀장이나 QA에게 함께 듣자고 요청합니다. 점수만 볼 때 보이지 않던 것이 들립니다.", "The second stage is listening back. Before the review, go back over the recording or chat log that was scored, or, if your center doesn't let agents open them, ask your TL or QA to listen with you. You'll hear what the score alone doesn't show."), flow, ["listenback"], null),
    step(tx("셋째 단계는 목표 1~2가지 고르기입니다. 고칠 것이 여러 개여도 팀장과 함께 가장 중요한 1~2가지만 목표로 고르고, 목표마다 최소 2주의 기간을 잡습니다. 짧은 기간에 목표가 너무 많으면 하나도 이루기 어렵습니다.", "The third stage is picking one or two goals. Even with several things to fix, pick just the one or two most important as goals with your TL, and give each goal at least two weeks. With too many goals in a short time, it's hard to reach any of them."), flow, ["pickone"], null),
    step(tx("넷째 단계는 중간·최종 검토입니다. 첫 주가 지나면 얼마나 나아졌는지 중간 검토를 하고, 마지막 주가 지나면 나아진 점과 도움이 필요한 점을 팀장과 함께 최종 검토합니다. 다만 본인 확인 누락처럼 치명적 오류로 깎였다면 기간을 기다리지 않고 바로 고칩니다.", "The fourth stage is the midpoint and final check. After the first week, do a midpoint check on how much has improved, and after the last week, do a final check with your TL on what improved and where you still need help. But if you lost points for a critical error, such as a missed identity check, fix it right away instead of waiting out the period."), flow, ["nextweek"], null),
    step(tx("리뷰에서는 \"이 항목은 어떻게 말하면 되나요?\"처럼 구체적으로 묻습니다. 수진 팀장은 그 답을 주려고 이 시간을 씁니다.", "In the review, ask concretely, for example: \"How should I say this part?\" Sujin spends this time precisely to give you that answer."), flow, ["nextweek"], null),
    step(tx("평가에 동의하기 어려우면 감정적으로 반박하지 않습니다. 녹취를 함께 보자고 요청하면, 근거가 있을 때 정해진 절차로 다시 검토될 수 있습니다.", "If you disagree with a score, don't push back emotionally. Ask to go over the recording together; if there are grounds, it can be reviewed again through the agreed process."), flow, ["nextweek"], null),
    step(tx("미소의 한마디: 처음엔 점수가 저를 평가하는 것 같아 리뷰가 무서웠어요. 점수는 다음에 무엇을 고칠지 알려 주는 지도라는 걸 나중에야 알았어요.", "A word from Miso: At first the reviews scared me, because the score felt like a verdict on me. Only later did I see it as a map of what to fix next."), flow, ["nextweek"], null),
  ],
  checkpoint: [
    {
      id: "review-q1",
      prompt: tx("이번 주 지민의 점수가 떨어졌습니다. 리뷰 전에 무엇을 할까요?", "Jimin's score dropped this week. What should she do before the review?"),
      options: [
        option("a", tx("리뷰에서 팀장이 알려 줄 때까지 아무것도 하지 않는다.", "Nothing until the TL explains it in the review."), tx("미리 보고 가면 같은 리뷰 시간에 훨씬 많이 얻습니다.", "Looking first gets you far more out of the same review.")),
        option("b", tx("평가받은 상담을 다시 보고, 궁금한 점을 적어 간다.", "Go back over the scored contact and write down her questions.")),
        option("c", tx("점수가 낮은 이유를 해명할 말부터 준비한다.", "Prepare explanations for why the score is low."), tx("해명보다 무엇을 바꿀지 찾는 쪽이 다음 주 점수에 도움이 됩니다.", "Finding what to change helps next week's score more than explaining.")),
      ],
      answer: "b",
      explanation: tx("리뷰 전에 내 상담을 먼저 봅니다.", "Look at your own contacts before the review."),
    },
    {
      id: "review-q2",
      prompt: tx("리뷰에서 고칠 점이 다섯 가지 나왔습니다. 어떻게 할까요?", "The review turned up five things to fix. What should Jimin do?"),
      options: [
        option("a", tx("다음 주 안에 다섯 가지를 한꺼번에 모두 고친다.", "Fix all five at once next week."), tx("한꺼번에 바꾸려 하면 아무것도 몸에 붙지 않습니다.", "Trying to change everything at once means none of it sticks.")),
        option("b", tx("팀장과 중요한 1~2가지를 골라, 최소 2주 동안 고치며 검토받는다.", "Pick the one or two most important with the TL, and work on them for at least two weeks with check-ins.")),
        option("c", tx("가장 쉬운 것 하나만 고치고, 나머지 넷은 따로 적어 두지 않고 잊는다.", "Fix only the easiest one, and forget the other four without writing them down."), tx("나머지를 잊으면 같은 감점이 되풀이됩니다. 중요한 것부터 차례로 다루고, 나머지는 적어 둡니다.", "Forgetting the rest means the same points keep being lost. Take them in order of importance, and write down the rest.")),
      ],
      answer: "b",
      explanation: tx("중요한 것 1~2가지를 최소 2주 동안 고치고, 중간과 마지막에 함께 확인합니다.", "Work on the one or two most important things for at least two weeks, and check them together at the midpoint and the end."),
    },
  ],
  connection: { to: "attendance", text: tx("점수만큼 신경 쓰이는 것이 근태입니다. 빡빡한 스케줄 속에서 나를 지키는 법을 봅니다.", "Attendance weighs on you as much as scores. Next, how to look after yourself in a tight schedule.") },
};
