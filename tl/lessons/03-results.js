import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 첫걸음, lesson 3. Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["gather", "trend", "together", "notes"];
const flow = ["gather", "trend", "together", "notes", "gather-trend", "trend-together", "together-notes"];

export default {
  id: "results",
  order: 3,
  title: tx("개인 성과 확인", "Checking Individual Results"),
  short: tx("개인 성과", "Results"),
  subtitle: tx("최근 몇 달의 기록으로 숫자가 어떻게 움직여 왔는지 봅니다.", "Use the last few months of records to see how the numbers have moved."),
  procedure,
  diagram: {
    nodes: [
      wide(node("gather", "기록 모으기", 180, 36, "Gather records")),
      wide(node("trend", "추세 보기", 180, 92, "Read the trend")),
      wide(node("together", "함께 읽기", 180, 148, "Read it together")),
      wide(node("notes", "메모하기", 180, 204, "Make notes")),
    ],
    edges: [edge("gather", "trend"), edge("trend", "together"), edge("together", "notes")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀원마다 최근 기록을 모아, 숫자가 어떻게 움직여 왔는지 보는 것입니다. 한 달의 점수보다 몇 달의 흐름이 더 많은 것을 알려 줍니다.", "This lesson is about gathering each team member's recent records and seeing how their numbers have moved. A few months of trend tell you more than one month's score."), flow, procedure, null),
    step(tx("첫 단계는 기록 모으기입니다. 최근 6개월(예시)의 티켓 처리 건수, 평균 처리 시간(AHT), 고객 만족도(CSAT), 품질 점수를 팀원별로 모읍니다.", "The first stage is gathering records. Collect each person's ticket volume, average handle time (AHT), customer satisfaction (CSAT) and quality scores for the last 6 months (Example)."), flow, ["gather"], null),
    step(tx("둘째 단계는 추세 보기입니다. 숫자가 꾸준한지, 오르는지, 떨어지는지 봅니다. 지민의 CSAT가 석 달째(예시) 내려가고 있다면, 그 시작 시점에 무슨 일이 있었는지가 단서입니다.", "The second stage is reading the trend. See whether the numbers are steady, rising or falling. If Jimin's CSAT has been dropping for three months (Example), what happened when it started is a clue."), flow, ["trend"], null),
    step(tx("숫자 하나만 보지 않습니다. 처리 건수가 많은데 품질 점수가 낮다면 서두르고 있을 수 있고, 처리 시간이 긴데 CSAT가 높다면 꼼꼼하게 응대하고 있을 수 있습니다.", "Don't look at one number alone. High volume with low quality may mean rushing, and long handling time with high CSAT may mean careful service."), flow, ["trend"], null),
    step(tx("셋째 단계는 함께 읽기입니다. QA 도현에게 품질 점수가 왜 그렇게 나왔는지, 자주 감점된 항목이 무엇인지 듣습니다. 점수의 이유는 점수를 매긴 사람이 가장 잘 압니다.", "The third stage is reading it together. Ask Dohyun from QA why the quality scores came out as they did and which items lose points most often. The person who gave the scores knows best why they are what they are."), flow, ["together"], null),
    step(tx("직무전문가 하린에게는 스크러빙에서 본 상담사별 트렌드를 받습니다. 같은 실수가 반복되는 사람과 다른 사람을 잘 돕는 사람이 보입니다.", "From Harin the SME, get the per-agent trends she has seen in scrubbing. You can see who repeats the same mistakes and who is good at helping others."), flow, ["together"], null),
    step(tx("넷째 단계는 메모하기입니다. 팀원마다 잘하는 점, 보완할 점, 확인할 질문을 한두 줄씩 적어 둡니다. 이 메모가 레슨 6의 출발점이 됩니다.", "The fourth stage is making notes. For each person, write a line or two on strengths, things to work on and questions to check. These notes are where lesson 6 begins."), flow, ["notes"], null),
    step(tx("이 단계에서는 결론을 내리지 않습니다. 숫자는 질문을 만들 뿐이고, 답은 실제로 일하는 모습을 보고 나서 찾습니다.", "Don't draw conclusions at this stage. Numbers only raise questions; you find the answers after seeing how people actually work."), flow, ["notes"], null),
  ],
  checkpoint: [
    {
      id: "results-q1",
      prompt: tx("준호의 처리 건수는 팀에서 가장 많은데 품질 점수는 평균보다 낮습니다. 먼저 할 일은 무엇일까요?", "Junho handles the most tickets on the team, but his quality score is below average. What do you do first?"),
      options: [
        option("a", tx("처리 건수가 많으니 우수 사원으로 적어 둔다.", "Note him down as a top performer, since his volume is high."), tx("한 숫자만 보면 품질이 떨어지는 이유를 놓칩니다.", "Looking at one number alone misses why quality is slipping.")),
        option("b", tx("QA에게 감점된 항목을 듣고, 실제 응대를 들으며 확인할 질문을 메모한다.", "Hear from QA which items lost points, and note questions to check by listening to his actual contacts.")),
        option("c", tx("품질 점수가 낮으니 바로 코칭 대상으로 정한다.", "His quality score is low, so put him on the coaching list right away."), tx("이유를 모른 채 코칭하면 엉뚱한 곳을 고치게 됩니다.", "Coaching without knowing why fixes the wrong thing.")),
      ],
      answer: "b",
      explanation: tx("숫자끼리 어긋나면 결론을 내리기보다 이유를 확인할 질문을 만듭니다.", "When numbers disagree, write questions to check rather than drawing conclusions."),
    },
    {
      id: "results-q2",
      prompt: tx("팀원 성과를 볼 기간으로 알맞은 것은 무엇일까요?", "What period fits for reviewing team members' results?"),
      options: [
        option("a", tx("지난주 한 주", "Last week only"), tx("한 주는 우연히 좋거나 나쁠 수 있어 흐름이 보이지 않습니다.", "A single week can be good or bad by chance, so no trend shows.")),
        option("b", tx("최근 몇 달 (예시: 6개월)", "The last few months (Example: 6 months)")),
        option("c", tx("입사 뒤 전체 기간", "Their whole time since joining"), tx("오래된 기록이 섞이면 지금의 모습이 흐려집니다.", "Mixing in old records blurs how they are doing now.")),
      ],
      answer: "b",
      explanation: tx("최근 몇 달의 흐름을 봐야 지금의 모습과 변화가 함께 보입니다.", "Looking at the last few months shows both where people are now and how they are changing."),
    },
  ],
  connection: { to: "listen", text: tx("숫자가 질문을 만들었습니다. 이제 숫자 뒤에서 실제로 어떻게 일하는지 직접 확인합니다.", "The numbers have raised questions. Now see for yourself how people actually work behind them.") },
};
