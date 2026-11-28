import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 1. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["collect", "run", "actions", "report"];
const flow = ["collect", "run", "actions", "report", "collect-run", "run-actions", "actions-report"];

export default {
  id: "weekly",
  order: 1,
  title: tx("팀장 주간 성과 미팅", "Weekly Team Leader Performance Meeting"),
  short: tx("주간 미팅", "Weekly meeting"),
  subtitle: tx("매주 같은 순서로 지표를 보고, 조치와 담당을 남깁니다.", "Look at the metrics in the same order every week, and leave actions with owners."),
  roles: tx("팀장 → 부매니저 → 매니저", "TL → AM → Manager"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("collect", "자료 받기", 180, 36, "Collect the data")),
      wide(node("run", "미팅 진행", 180, 92, "Run the meeting")),
      wide(node("actions", "조치 정하기", 180, 148, "Set actions")),
      wide(node("report", "매니저 보고", 180, 204, "Report to the manager")),
    ],
    edges: [edge("collect", "run"), edge("run", "actions"), edge("actions", "report")],
  },
  steps: [
    step(tx("이 절차의 목적은 매주 같은 순서로 세 마켓의 지표를 보고, 누가 무엇을 언제까지 할지 남기는 것입니다.", "This procedure exists to look at the three markets' metrics in the same order every week and record who will do what by when."), flow, procedure, null),
    step(tx("첫 단계는 자료 받기입니다. 민석은 미팅 전날 오후(예시)까지 마켓마다 같은 양식의 지표 요약을 받습니다. 응대율, 평균 처리 시간, 품질 점수, 근태와 지난주 조치의 결과가 한 장에 들어갑니다.", "The first step is collecting the data. Minseok gets a metrics summary in the same template from each market by the afternoon before the meeting (Example). Answer rate, average handle time, quality score, attendance and the results of last week's actions fit on one page."), flow, ["collect"], null),
    step(tx("둘째 단계는 미팅 진행입니다. 팀장마다 5분(예시)씩 지난주 결과, 이번 주 계획, 도움이 필요한 일을 말합니다. 민석은 목표에서 벗어난 숫자만 골라 질문합니다.", "The second step is running the meeting. Each TL takes 5 minutes (Example) for last week's results, this week's plan and where they need help. Minseok asks only about the numbers that are off target."), flow, ["run"], null),
    step(tx("셋째 단계는 조치 정하기입니다. 문제마다 할 일, 담당, 기한을 하나씩 정하고 미팅 기록에 적습니다. 담당이 정해지지 않은 조치는 다음 주에 그대로 남아 있습니다.", "The third step is setting actions. For each problem, set one task, one owner and one deadline, and write them in the meeting notes. An action with no owner is still sitting there next week."), flow, ["actions"], null),
    step(tx("신임 팀장인 태오가 \"품질을 신경 쓰겠다\"고만 말하면, 민석은 무엇을 언제까지 할지로 바꿔 묻습니다. 예를 들어 \"이번 주 안에 상담사 3명(예시)과 1:1 코칭\"처럼 확인할 수 있게 적습니다.", "When Taeo, the new TL, only says he'll \"keep an eye on quality\", Minseok asks again in terms of what and by when. He writes it so it can be checked, such as \"1:1 coaching with 3 agents (Example) this week\"."), flow, ["actions"], null),
    step(tx("넷째 단계는 매니저 보고입니다. 미팅이 끝난 날 정은 매니저에게 마켓별 요약, 새 조치, 매니저의 판단이 필요한 일을 보냅니다.", "The fourth step is reporting to the manager. On the day of the meeting, send Jeongeun a summary by market, the new actions and anything that needs the manager's decision."), flow, ["report"], null),
    step(tx("다음 미팅은 지난주 조치 목록을 확인하는 것으로 시작합니다. 끝난 것, 늦어진 것, 이유를 먼저 보고 새 숫자로 넘어갑니다.", "The next meeting starts by checking last week's action list. Look first at what's done, what's late and why, then move on to the new numbers."), flow, ["actions"], null),
    step(tx("미소의 한마디: 미팅을 잘 마쳤다고 생각했는데, 다음 주에 보니 아무도 안 움직였던 적이 있어요. 담당과 기한을 적지 않은 조치는 조치가 아니더라고요.", "A word from Miso: I once thought a meeting went well, and the next week nobody had moved. An action without an owner and a deadline isn't an action."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "weekly-q1",
      prompt: tx("주간 미팅에서 태오 팀장이 품질 점수 하락에 대해 \"앞으로 신경 쓰겠습니다\"라고 말합니다. 민석은 어떻게 할까요?", "In the weekly meeting, Taeo says about a drop in quality score, \"I'll keep an eye on it from now on.\" What does Minseok do?"),
      options: [
        option("a", tx("신임 팀장이 의지를 보였으므로 격려하고 다음 마켓으로 넘어간다.", "The new TL showed he's willing, so encourage him and move on to the next market."), tx("의지만으로는 다음 주에 확인할 것이 없습니다. 할 일과 기한으로 바꿔 적어야 합니다.", "Willingness alone leaves nothing to check next week. Turn it into a task and a deadline.")),
        option("b", tx("무엇을 언제까지 할지 함께 정해, 담당과 기한을 미팅 기록에 적는다.", "Settle together what he'll do by when, and write the owner and deadline in the meeting notes.")),
        option("c", tx("미팅이 끝난 뒤 민석이 미국 마켓의 조치 계획을 대신 짜서 보내 준다.", "After the meeting, Minseok draws up the US market's action plan himself and sends it over to Taeo."), tx("대신 짜 주면 태오가 계획을 세우는 법을 배우지 못합니다. 미팅 자리에서 함께 정합니다.", "Drawing it up for him means Taeo doesn't learn to plan. Settle it together in the meeting.")),
      ],
      answer: "b",
      explanation: tx("조치는 할 일, 담당, 기한이 있어야 다음 주에 확인할 수 있습니다.", "An action needs a task, an owner and a deadline before it can be checked next week."),
    },
    {
      id: "weekly-q2",
      prompt: tx("주간 미팅은 무엇으로 시작하는 것이 좋을까요?", "What is the best way to start the weekly meeting?"),
      options: [
        option("a", tx("지난주에 정한 조치가 끝났는지부터 확인한다.", "Check first whether the actions set last week are done.")),
        option("b", tx("이번 주 숫자가 가장 나쁜 마켓부터 원인을 듣는다.", "Hear the causes from the market with the worst numbers this week first."), tx("지난주 조치를 확인하지 않으면 같은 문제를 매주 처음부터 다시 이야기하게 됩니다.", "Without checking last week's actions, you talk through the same problem from scratch every week.")),
        option("c", tx("회사와 고객사의 새 공지를 먼저 길게 전한다.", "Pass on new company and client notices first, at length."), tx("공지는 따로 전할 수 있습니다. 미팅 시간은 지표와 조치에 먼저 씁니다.", "Notices can go out separately. Spend the meeting time on metrics and actions first.")),
      ],
      answer: "a",
      explanation: tx("지난주 조치를 먼저 확인해야 조치가 끝까지 이어집니다.", "Checking last week's actions first keeps actions going to the end."),
    },
  ],
  connection: { to: "instructions", text: tx("미팅 밖에서도 위에서 내려오는 지침은 끝까지 전해야 합니다. 다음은 지침 전달과 확인 보고 절차입니다.", "Outside the meeting, instructions from above have to reach everyone, too. Next is the procedure for passing on instructions and reporting back.") },
};
