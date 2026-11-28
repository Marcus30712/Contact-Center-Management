import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 2. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["weekly", "compare", "why", "help"];
const flow = ["weekly", "compare", "why", "help", "weekly-compare", "compare-why", "why-help"];

export default {
  id: "leaders",
  order: 2,
  title: tx("여러 마켓 팀장 관리", "Managing Team Leaders Across Markets"),
  short: tx("팀장 관리", "Team leaders"),
  subtitle: tx("주간 미팅과 마켓별 지표로, 맡길 팀장과 도울 팀장을 가립니다.", "Use the weekly meeting and each market's metrics to tell which team leaders to trust and which to help."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("weekly", "주간 미팅", 180, 36, "Weekly meeting")),
      wide(node("compare", "지표 비교", 180, 92, "Compare metrics")),
      wide(node("why", "원인 묻기", 180, 148, "Ask why")),
      wide(node("help", "도울 곳 정하기", 180, 204, "Decide where to help")),
    ],
    edges: [edge("weekly", "compare"), edge("compare", "why"), edge("why", "help")],
  },
  steps: [
    step(tx("이 레슨의 목적은 여러 마켓의 팀장을 한 기준으로 보고, 맡길 곳과 도울 곳을 가리는 것입니다.", "This lesson is about looking at team leaders across markets by one standard, and telling where to trust and where to help."), flow, procedure, null),
    step(tx("민석은 매주 월요일(예시) 세 마켓 팀장과 주간 성과 미팅을 엽니다. 수진과 유키는 연차가 쌓인 팀장이고, 태오는 이번 달 처음 팀장이 되었습니다.", "Every Monday (Example), Minseok holds a weekly performance meeting with the three market team leaders. Sujin and Yuki are experienced team leaders, and Taeo became a team leader this month."), flow, [], null),
    step(tx("첫 단계는 주간 미팅입니다. 팀장마다 지난주 지표와 이번 주 계획, 도움이 필요한 일을 짧게 말합니다. 민석은 결론을 서두르지 않고, 각 팀이 무엇을 보고 있는지 먼저 듣습니다.", "The first stage is the weekly meeting. Each team leader briefly covers last week's metrics, this week's plan and anything they need help with. Minseok doesn't rush to conclusions, and first listens to what each team is watching."), flow, ["weekly"], null),
    step(tx("둘째 단계는 지표 비교입니다. 마켓마다 문의 유형과 고객사 목표가 다르므로, 숫자를 그대로 줄 세우지 않고 각 마켓의 목표 대비로 봅니다. 응대율, 평균 처리 시간, 품질 점수, 근태를 같은 표에 놓습니다.", "The second stage is comparing metrics. Contact types and client targets differ by market, so he doesn't rank raw numbers but reads each market against its own target. Answer rate, average handle time, quality score and attendance go into the same table."), flow, ["compare"], null),
    step(tx("셋째 단계는 원인 묻기입니다. 미국 마켓의 품질 점수가 3주(예시) 연속 내려갔다면, 태오에게 숫자를 보여 주며 무엇이 달라졌는지 묻습니다. 신규 상담사 비율, 정책 변경, 코칭 횟수처럼 원인이 될 만한 것을 함께 짚습니다.", "The third stage is asking why. If the US market's quality score has dropped three weeks (Example) in a row, he shows Taeo the numbers and asks what has changed. Together they look at likely causes such as the share of new agents, policy changes and how often coaching happened."), flow, ["why"], null),
    step(tx("넷째 단계는 도울 곳 정하기입니다. 수진과 유키처럼 잘 돌아가는 팀은 맡기고 숫자만 함께 봅니다. 태오의 팀에는 코칭 계획을 같이 세우고, 다음 주 미팅에서 결과를 다시 봅니다.", "The fourth stage is deciding where to help. Teams running well, like Sujin's and Yuki's, are left to it, and he only reviews the numbers with them. With Taeo, he builds a coaching plan together and checks the result at next week's meeting."), flow, ["help"], null),
    step(tx("세 팀장을 똑같이 대하는 것이 공평한 것은 아닙니다. 기준은 같게, 돕는 양은 팀의 사정에 맞게 다르게 합니다.", "Treating all three team leaders the same isn't the same as being fair. Keep the standard the same, and match how much you help to each team's situation."), flow, ["help"], null),
    step(tx("미소의 한마디: 팀장일 때 저는 제 팀 숫자만 봤어요. 부매니저가 되고서야 마켓마다 목표가 다르다는 걸 알았죠. 줄 세우기 전에 목표부터 보세요.", "A word from Miso: As a team leader I only looked at my own team's numbers. Only as an AM did I learn that every market has a different target. Check the targets before you rank anyone."), flow, ["help"], null),
  ],
  checkpoint: [
    {
      id: "leaders-q1",
      prompt: tx("주간 미팅에서 보니 미국 마켓의 품질 점수가 3주(예시) 연속 내려갔습니다. 태오 팀장은 이번 달 처음 팀장이 되었습니다. 어떻게 할까요?", "At the weekly meeting, the US market's quality score has dropped three weeks (Example) in a row. Taeo became a team leader this month. What does Minseok do?"),
      options: [
        option("a", tx("미팅 자리에서 세 팀의 점수를 나란히 보여 주며 태오에게 분발을 요구한다.", "Show all three teams' scores side by side in the meeting and tell Taeo to step it up."), tx("다른 팀과 비교만 하면 원인은 나오지 않고, 신임 팀장은 방어부터 하게 됩니다.", "Comparing with other teams doesn't reveal the cause, and a new team leader starts defending first.")),
        option("b", tx("미팅 뒤 태오와 따로 만나 무엇이 달라졌는지 묻고, 코칭 계획을 함께 세운다.", "Meet Taeo separately after the meeting, ask what has changed, and build a coaching plan together.")),
        option("c", tx("신임 팀장의 부담을 덜어 주려고 당분간 미국 팀 코칭을 민석이 직접 맡는다.", "Take over the US team's coaching himself for now to take the load off the new team leader."), tx("대신 맡으면 태오가 배울 기회를 잃습니다. 함께 계획을 세우고 태오가 하게 합니다.", "Taking it over costs Taeo the chance to learn. Plan together and let Taeo do it.")),
      ],
      answer: "b",
      explanation: tx("숫자로 원인을 함께 짚고, 신임 팀장이 스스로 해 볼 수 있게 계획을 같이 세웁니다.", "Look at the cause together through the numbers, and plan together so the new team leader can try it himself."),
    },
    {
      id: "leaders-q2",
      prompt: tx("한국 마켓과 일본 마켓의 평균 처리 시간을 비교하려고 합니다. 어떻게 보는 것이 맞을까요?", "Minseok wants to compare average handle time in the Korean and Japanese markets. What is the right way to look at it?"),
      options: [
        option("a", tx("각 마켓의 목표 대비로 같은 표에 놓고 본다.", "Put each market against its own target in the same table.")),
        option("b", tx("처리 시간이 짧은 마켓을 기준으로 다른 마켓을 줄 세운다.", "Rank the other markets against the one with the shortest handle time."), tx("마켓마다 문의 유형과 고객사 목표가 달라서, 숫자만 줄 세우면 잘못 판단하게 됩니다.", "Contact types and client targets differ by market, so ranking raw numbers leads to wrong calls.")),
        option("c", tx("마켓마다 사정이 달라 서로 비교하지 않는다.", "Don't compare them, because every market is different."), tx("비교하지 않으면 도울 곳을 놓칩니다. 기준을 목표 대비로 맞추면 비교할 수 있습니다.", "Without comparing, you miss where to help. Read each against its target and you can compare.")),
      ],
      answer: "a",
      explanation: tx("마켓마다 목표가 다르므로, 목표 대비로 같은 표에 놓고 봅니다.", "Targets differ by market, so put each against its target in the same table."),
    },
  ],
  connection: { to: "instructions", text: tx("팀장들을 관리하는 일에는 위에서 내려오는 지침을 끝까지 전하는 일도 있습니다.", "Managing team leaders also means carrying instructions from above all the way down.") },
};
