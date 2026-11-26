import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 서포트 라이프사이클, lesson 3. Copy: docs/superpowers/specs/2026-11-25-tl-support-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["handover", "getback", "help", "stepin"];
const flow = ["handover", "getback", "help", "stepin", "handover-getback", "getback-help", "help-stepin"];

export default {
  id: "qa",
  order: 3,
  title: tx("QA 지원", "Supporting QA"),
  short: tx("QA", "QA"),
  subtitle: tx("평가 기준을 함께 맞추고, 품질 결과를 코칭으로 바꿉니다.", "Align on the scoring standard together, and turn quality results into coaching."),
  personaName: tx("도현", "Dohyun"),
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
    step(tx("이 레슨의 목적은 팀장이 QA와 함께 일하며 품질 평가를 팀의 성장으로 이어 가는 절차를 보는 것입니다.", "This lesson looks at how a team leader works with QA to turn quality scoring into the team's growth."), flow, procedure, null),
    step(tx("첫 단계는 맡기기입니다. QA 도현에게 팀에서 특히 봐 줬으면 하는 부분을 요청합니다. 예를 들어 새 정책이 시작된 주에는 관련 문의를 더 많이 평가해 달라고 부탁합니다.", "The first stage is handing over. Ask Dohyun from QA to look closely at what matters for your team. For example, in the week a new policy starts, ask for more of those contacts to be scored."), flow, ["handover"], null),
    step(tx("둘째 단계는 받기입니다. 팀원별 품질 점수와 자주 감점된 항목을 정해진 주기(예시: 매주)로 받습니다. 점수만이 아니라 감점 이유와 녹취 사례까지 받아야 코칭에 쓸 수 있습니다.", "The second stage is getting back. Get each member's quality score and the items that lose points most often on a set cycle (Example: weekly). To use it for coaching, get the reasons and recorded examples, not just the scores."), flow, ["getback"], null),
    step(tx("셋째 단계는 돕기입니다. 캘리브레이션에 참여해 현장 사정과 팀장의 시각을 전합니다. 기준이 바뀌면 팀에 먼저 알려, 상담사가 모르는 기준으로 평가받지 않게 합니다.", "The third stage is helping. Join calibration and bring the floor's reality and the team leader's view. When a standard changes, tell the team first so no agent is scored on a standard they don't know."), flow, ["help"], null),
    step(tx("상담사가 평가에 이의를 제기하면, 팀장이 먼저 녹취를 함께 듣고 근거가 있을 때 정해진 절차로 다시 검토를 요청합니다. QA와 상담사가 직접 다투게 두지 않습니다.", "If an agent disputes a score, the team leader first listens to the recording with them and asks for a re-review through the agreed process only when there are grounds. Don't leave QA and the agent to argue it out directly."), flow, ["help"], null),
    step(tx("넷째 단계는 개입하기입니다. 팀의 품질이 계속 떨어지거나 평가가 사람마다 다르다는 말이 나오면, 팀장이 QA와 따로 만나 원인을 함께 봅니다.", "The fourth stage is stepping in. If the team's quality keeps falling, or people say scoring varies by evaluator, meet QA separately and look at the cause together."), flow, ["stepin"], null),
    step(tx("QA는 상대 팀이 아니라 같은 목표를 가진 동료입니다. 점수를 두고 다투기보다 같은 녹취를 함께 듣는 시간이 더 많은 것을 바꿉니다.", "QA isn't the other side but a colleague with the same goal. Listening to the same recording together changes more than arguing over scores."), flow, ["stepin"], null),
  ],
  checkpoint: [
    {
      id: "qa-q1",
      prompt: tx("도현에게서 품질 점수만 받고 있습니다. 코칭에 쓰려면 무엇을 더 받아야 할까요?", "You only get quality scores from Dohyun. What else do you need to use them for coaching?"),
      options: [
        option("a", tx("팀 순위표 (누가 가장 낮은지 바로 보이게)", "A team ranking (so you can see at once who is lowest)"), tx("순위는 누가 낮은지만 알려 줄 뿐, 무엇을 코칭할지는 알려 주지 않습니다.", "A ranking shows only who is lowest, not what to coach.")),
        option("b", tx("자주 감점된 항목과 그 녹취 사례", "The items that lose points most often, with recorded examples")),
        option("c", tx("평가한 사람의 이름", "The names of the evaluators"), tx("누가 평가했는지보다 무엇이 왜 감점됐는지가 코칭에 필요합니다.", "What lost points and why matters for coaching more than who scored it.")),
      ],
      answer: "b",
      explanation: tx("감점 이유와 사례가 있어야 점수가 코칭으로 바뀝니다.", "Reasons and examples turn scores into coaching."),
    },
    {
      id: "qa-q2",
      prompt: tx("서준이 QA 점수가 부당하다며 이의를 제기합니다. 알맞은 것은 무엇일까요?", "Seojun says his QA score is unfair and disputes it. What fits?"),
      options: [
        option("a", tx("점수는 본인 일이니, 서준에게 QA를 직접 찾아가 따지라고 한다.", "It's his score, so tell Seojun to go to QA and argue it himself."), tx("상담사와 QA가 직접 다투면 관계가 나빠지고 결론도 나기 어렵습니다.", "When an agent and QA argue directly, the relationship sours and it's hard to reach a conclusion.")),
        option("b", tx("녹취를 함께 듣고, 근거가 있으면 절차대로 재검토를 요청한다.", "Listen to the recording together, and if there are grounds, ask for a re-review through the process.")),
        option("c", tx("QA의 평가이니 이번에는 그대로 받아들이라고 다독인다.", "It's QA's scoring, so calm him down and tell him to accept it this time."), tx("근거 있는 이의를 막으면 상담사는 평가를 믿지 않게 됩니다.", "Blocking a dispute that has evidence makes agents stop trusting the scoring.")),
      ],
      answer: "b",
      explanation: tx("이의는 팀장이 먼저 근거를 확인하고 절차대로 전합니다.", "The team leader checks the grounds for a dispute first and passes it on through the process."),
    },
  ],
  connection: { to: "trainers", text: tx("품질의 기준을 맞췄다면, 그 기준을 처음 가르치는 사람은 트레이너입니다. 다음은 트레이너와 일하는 법입니다.", "Once the quality standard is aligned, the person who teaches it first is the trainer. Next is how to work with trainers.") },
};
