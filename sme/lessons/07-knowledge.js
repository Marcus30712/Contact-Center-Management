import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 7. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["scrub", "voc", "calibrate", "give"];
const flow = [...procedure, "scrub-voc", "voc-calibrate", "calibrate-give"];

export default {
  id: "knowledge",
  order: 7,
  title: tx("팀에 지식 돌려주기", "Giving Knowledge Back to the Team"),
  short: tx("지식 돌려주기", "Giving back"),
  subtitle: tx("매일 스크러빙하고, 찾은 것을 팀에 돌려줍니다.", "Scrub every day, and give what you find back to the team."),
  procedure,
  diagram: {
    nodes: [
      wide(node("scrub", "매일 스크러빙", 180, 36, "Daily scrubbing")),
      wide(node("voc", "VOC 정리", 180, 92, "VOC write-up")),
      wide(node("calibrate", "캘리브레이션", 180, 148, "Calibration")),
      wide(node("give", "팀에 돌려주기", 180, 204, "Give it back")),
    ],
    edges: [edge("scrub", "voc"), edge("voc", "calibrate"), edge("calibrate", "give")],
  },
  steps: [
    step(tx("이 레슨의 목적은 매일 하는 스크러빙과 VOC, 캘리브레이션으로 팀의 트렌드를 파악하고, 알게 된 것을 팀 전체에 돌려주는 것입니다.", "This lesson is about using daily scrubbing, VOC and calibration to see the team's trends, and giving what you learn back to the whole team."), flow, procedure, null),
    step(tx("스크러빙은 SME의 주된 일입니다. 처리된 티켓과 쌓여 있는 티켓을 다시 읽고 진짜 원인을 찾습니다. 매일 몇 건씩(예시: 하루 3~4건) 꾸준히 합니다.", "Scrubbing is one of the SME's main jobs. You reread handled tickets and tickets that have piled up and find the real causes. You do a few every day (Example: 3 to 4 a day)."), flow, ["scrub"], null),
    step(tx("첫 단계는 매일 스크러빙하기입니다. DSAT, CSAT, 미해결 순서로 티켓을 고르고, 원인을 한두 문장으로 요약해 정해진 분류로 나눕니다. 절차는 SOP 스크러빙에 있습니다.", "The first stage is scrubbing every day. Pick tickets in the order DSAT, CSAT, then unresolved, sum up each cause in a sentence or two, and sort it into the set categories. The procedure is in the Scrubbing SOP."), flow, ["scrub"], null),
    step(tx("매일 조금씩 하는 이유는 트렌드가 쌓여야 보이기 때문입니다. 한 번에 몰아서 보면 원인이 겹치는 것을 놓치기 쉽고, 돌려주는 것도 늦어집니다.", "A little each day works because trends show only as they build up. Looking at many at once makes it easy to miss shared causes, and slows giving them back."), flow, ["scrub"], null),
    step(tx("둘째 단계는 VOC 정리입니다. 고객이 반복해서 하는 말, 곧 불만과 요청과 제품에 대한 의견을 모아 정리합니다. 상담사가 바꿀 수 없는 원인은 고객사에 전할 내용이 됩니다.", "The second stage is the VOC write-up. Collect what customers keep saying: complaints, requests and views on the product. Causes agents cannot change become something to pass to the client."), flow, ["voc"], null),
    step(tx("셋째 단계는 캘리브레이션입니다. QA, 팀장과 함께 같은 상담을 각자 평가하고 점수 차이를 맞춥니다. SME는 상담사가 현장에서 실제로 겪는 상황을 알려 주는 역할을 합니다.", "The third stage is calibration. With QA and the team leader, each person scores the same contact and you align the differences. The SME brings what agents really face on the floor."), flow, ["calibrate"], null),
    step(tx("캘리브레이션에서 기준이 바뀌면 상담사들에게 먼저 전하는 사람도 SME입니다. 바뀐 기준을 모른 채 평가받는 상담사가 없게 합니다.", "When calibration changes a standard, the SME is also the one who tells the agents first. No agent should be scored on a standard they did not know had changed."), flow, ["calibrate"], null),
    step(tx("넷째 단계는 팀에 돌려주기입니다. 찾은 것을 허들, 팀 채팅방, 지식 베이스 업데이트로 나눠 전합니다.", "The fourth stage is giving it back. Pass what you found to the team through huddles, the team chat and knowledge base updates."), flow, ["give"], null),
    step(tx("한 사람의 실수가 원인이면 팀 앞이 아니라 팀장에게 건네는 요약(레슨 5)으로 보냅니다. 팀에는 누구의 건인지 밝히지 않고 배울 점만 나눕니다.", "If one person's mistake is the cause, send it in the summary for the team leader (lesson 5), not to the whole team. With the team, share only the lesson, without saying whose contact it was."), flow, ["give"], null),
    step(tx("돌려준 지식이 쌓이면 같은 질문이 줄고, 당신에게 오는 요청도 줄어듭니다. 이것이 SME가 팀을 키우는 방식입니다.", "As the knowledge you give back builds up, the same questions drop, and so do the requests that come to you. That is how an SME grows a team."), flow, ["give"], null),
  ],
  checkpoint: [
    {
      id: "knowledge-q1",
      prompt: tx("스크러빙에서 지민의 절차 실수로 생긴 DSAT를 찾았습니다. 어떻게 나눌까요?", "While scrubbing, you find a DSAT caused by Jimin's procedure mistake. How do you share it?"),
      options: [
        option("a", tx("허들에서 지민의 건이라고 밝히고 사례로 설명한다.", "Explain it as an example in the huddle, saying it was Jimin's contact."), tx("이름이 나오면 지민은 창피를 당하고, 다른 상담사들은 실수를 숨기기 시작합니다.", "Naming him embarrasses Jimin, and other agents start hiding their mistakes.")),
        option("b", tx("팀장에게 건넬 요약에 담고, 팀에는 이름 없이 배울 점만 나눈다.", "Put it in the summary for the team leader, and share only the lesson with the team, without names.")),
        option("c", tx("한 번의 실수이니 아무에게도 알리지 않는다.", "Tell no one, since it was a single mistake."), tx("같은 실수가 다른 상담사에게도 생길 수 있습니다. 배울 점은 팀에 돌려줘야 합니다.", "The same mistake can happen to other agents. The lesson belongs back with the team.")),
      ],
      answer: "b",
      explanation: tx("개인의 건은 팀장에게, 배울 점은 이름 없이 팀에게 돌려줍니다.", "Individual cases go to the team leader; the lesson goes back to the team without names."),
    },
    {
      id: "knowledge-q2",
      prompt: tx("스크러빙을 매일 몇 건씩 꾸준히 하는 이유로 알맞은 것은 무엇일까요?", "Why scrub a few tickets every day, steadily?"),
      options: [
        option("a", tx("하루에 해야 할 건수가 규칙으로 정해져 있어서.", "Because a rule sets how many to do each day."), tx("건수는 센터마다 다른 예시입니다. 중요한 것은 매일 이어서 보는 것입니다.", "The count is an example that differs by center. What matters is looking every day.")),
        option("b", tx("원인이 쌓여야 트렌드가 보이고, 찾은 것을 바로 팀에 돌려줄 수 있어서.", "Because trends show as causes build up, and you can give findings back to the team right away.")),
        option("c", tx("바쁜 날 몰아서 해도 결과는 같지만 보고서 모양이 좋아서.", "Doing them all on a busy day gives the same result, but the report looks better."), tx("몰아서 하면 돌려주는 시점이 늦어지고, 그사이 같은 실수가 되풀이됩니다.", "Doing them all at once delays giving them back, and the same mistakes repeat in the meantime.")),
      ],
      answer: "b",
      explanation: tx("매일 조금씩 봐야 트렌드가 보이고, 지식을 제때 돌려줄 수 있습니다.", "Looking a little each day shows the trends and lets you give knowledge back in time."),
    },
  ],
  connection: { to: "home", text: tx("SME 첫걸음을 마쳤습니다. 더 깊이 보고 싶다면 TL SOP 라이브러리의 스크러빙, 캘리브레이션, 기존 상담사 육성을 이어서 보세요.", "You have finished SME First Steps. To go deeper, continue with Scrubbing, Calibration and Developing Existing Agents in the TL SOP Library.") },
};
