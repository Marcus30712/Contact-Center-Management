import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 8. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["threemonths", "coaching", "perfreview", "halfyear"];
const flow = ["threemonths", "coaching", "perfreview", "halfyear", "threemonths-coaching", "coaching-perfreview", "perfreview-halfyear"];

export default {
  id: "growth",
  order: 8,
  title: tx("익숙해지기까지", "Getting Comfortable"),
  short: tx("성장", "Growth"),
  subtitle: tx("매주의 코칭과 매달의 퍼포먼스 리뷰로, 반년 동안 업무에 익숙해지는 길을 봅니다.", "See how weekly coaching and monthly performance reviews get you comfortable in the job over half a year."),
  procedure,
  diagram: {
    nodes: [
      wide(node("threemonths", "석 달", 180, 36, "Three months")),
      wide(node("coaching", "코칭", 180, 92, "Coaching")),
      wide(node("perfreview", "퍼포먼스 리뷰", 180, 148, "Performance review")),
      wide(node("halfyear", "반년", 180, 204, "Half a year")),
    ],
    edges: [edge("threemonths", "coaching"), edge("coaching", "perfreview"), edge("perfreview", "halfyear")],
  },
  steps: [
    step(tx("이 레슨의 목적은 매주의 코칭과 매달의 퍼포먼스 리뷰로 업무에 익숙해지는 길을 미리 보는 것입니다.", "This lesson is about seeing ahead how weekly coaching and monthly performance reviews get you comfortable in the job."), flow, procedure, null),
    step(tx("실전 배치 뒤 몇 주가 지나도 지민은 아직 느리고, 모르는 문의도 많습니다. 다른 사람은 다 잘하는 것 같습니다.", "Weeks after Go Live, Jimin is still slow and still meets contacts she doesn't know. Everyone else seems to be doing fine."), flow, [], null),
    step(tx("첫 단계는 석 달(예시)입니다. 이쯤이면 자주 오는 문의는 대부분 혼자 처리하고, 내 숫자가 조금씩 안정됩니다.", "The first stage is three months (Example). By then you handle most common contacts on your own, and your numbers start to settle."), flow, ["threemonths"], null),
    step(tx("둘째 단계는 코칭입니다. 수진 팀장과 매주 한 가지씩 함께 연습할 것을 정합니다. 코칭에서 받은 것을 다음 날 콜에서 바로 써 봅니다.", "The second stage is coaching. Each week, you and Sujin pick one thing to practice together. Use what you got from coaching on your calls the very next day."), flow, ["coaching"], null),
    step(tx("셋째 단계는 퍼포먼스 리뷰입니다. 매달 한 달의 숫자와 평가를 돌아보고, 다음 달 목표를 함께 정합니다.", "The third stage is the performance review. Each month, look back at the month's numbers and scores, and set next month's goal together."), flow, ["perfreview"], null),
    step(tx("넷째 단계는 반년(예시)입니다. 대부분의 문의가 익숙해지고, 이제는 새로 온 신입이 지민에게 묻기 시작합니다.", "The fourth stage is half a year (Example). Most contacts feel familiar, and now new hires start coming to Jimin with questions."), flow, ["halfyear"], null),
    step(tx("비교는 다른 사람이 아니라 지난달의 나와 합니다. 처음 출근한 날과 비교하면 이미 많이 왔습니다.", "Compare yourself with last month's you, not with others. Next to your first day, you've already come a long way."), flow, ["halfyear"], null),
    step(tx("무엇을 시도했고 무엇이 바뀌었는지 짧게 적어 둡니다. 리뷰에서 할 이야기가 생기고, 나중에 선임이나 직무전문가 자리를 준비할 때도 도움이 됩니다.", "Jot down what you tried and what changed. It gives you things to talk about in reviews, and helps later when you prepare to become a senior or an SME."), flow, ["halfyear"], null),
    step(tx("미소의 한마디: 저도 익숙해지기까지 반년쯤 걸렸어요. 그때 알았더라면 좋았을 건, 제가 느린 게 아니라 배우는 중이었다는 거예요.", "A word from Miso: It took me about half a year to feel at home too. What I wish I'd known: I wasn't slow, I was learning."), flow, ["halfyear"], null),
  ],
  checkpoint: [
    {
      id: "growth-q1",
      prompt: tx("실전 배치 뒤 두 달이 지났는데, 지민의 처리 속도가 동기보다 느립니다. 어떻게 생각하면 좋을까요?", "Two months after Go Live, Jimin is slower than others who started with her. How should she see it?"),
      options: [
        option("a", tx("동기보다 느리다는 이유로, 이 일에 맞지 않는다고 판단해 다른 일을 알아본다.", "Conclude from being slower than her cohort that she isn't cut out for this, and look for other work."), tx("익숙해지는 속도는 사람마다 다릅니다. 판단하기엔 이른 시기입니다.", "People get comfortable at different speeds. It's too early to judge.")),
        option("b", tx("지난달의 나와 비교하고, 한 가지를 골라 연습한다.", "Compare herself with last month, and pick one thing to practice.")),
        option("c", tx("속도를 올리려고 확인 절차를 줄인다.", "Cut back the checks to speed up."), tx("속도는 정확함 위에 쌓입니다. 절차를 줄이면 다시 연락이 늘어납니다.", "Speed is built on accuracy. Cutting steps brings more repeat contacts.")),
      ],
      answer: "b",
      explanation: tx("비교는 지난달의 나와 하고, 하나씩 연습합니다.", "Compare yourself with last month, and practice one thing at a time."),
    },
    {
      id: "growth-q2",
      prompt: tx("매달 퍼포먼스 리뷰에 무엇을 가져가면 좋을까요?", "What should Jimin bring to the monthly performance review?"),
      options: [
        option("a", tx("아무것도 준비하지 않고 팀장의 말을 듣는다.", "Nothing; just listen to the TL."), tx("듣기만 하면 내가 궁금한 것은 다루지 못하고 끝납니다.", "If you only listen, what you wanted to ask goes undiscussed.")),
        option("b", tx("한 달 동안 시도한 것과 바뀐 것, 궁금한 점을 적어 간다.", "Notes on what she tried and what changed during the month, and her questions.")),
        option("c", tx("다른 동료와 비교한 내 숫자를 가져간다.", "Her numbers compared with other colleagues'."), tx("리뷰는 내 성장을 보는 자리입니다. 비교보다 나의 변화를 가져갑니다.", "The review is about your growth. Bring your own changes, not comparisons.")),
      ],
      answer: "b",
      explanation: tx("리뷰는 함께 다음 목표를 정하는 시간입니다.", "The review is a time to set the next goal together."),
    },
  ],
  connection: { to: "home", text: tx("상담사 첫걸음을 마쳤습니다. 다음은 상담사 커리어 라이프사이클로 가서, 운영팀 안에서 한 단계씩 오르는 길을 미리 보세요.", "You have finished Agent First Steps. Next, preview the path up the operations team in Agent Career Lifecycle.") },
};
