import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 서포트 라이프사이클, lesson 3. Approved copy: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME First Steps lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["request", "scrub", "closer", "growth"];
const flow = ["request", "scrub", "closer", "growth", "request-scrub", "scrub-closer", "closer-growth"];

export default {
  id: "regular",
  order: 3,
  title: tx("정식 상담사 지원", "Supporting Regular Agents"),
  short: tx("정식", "Regular"),
  subtitle: tx("요청이 오면 돕고, 요청으로 오지 않는 것은 스크러빙으로 찾습니다.", "Help when asked, and find what never gets asked through scrubbing."),
  personaName: tx("서준", "Seojun"),
  procedure,
  diagram: {
    nodes: [
      wide(node("request", "요청으로 받기", 180, 36, "Take requests")),
      wide(node("scrub", "스크러빙으로 보기", 180, 92, "Scrubbing check")),
      wide(node("closer", "다시 가까이", 180, 148, "Move back in close")),
      wide(node("growth", "성장 신호 전하기", 180, 204, "Share growth signs")),
    ],
    edges: [edge("request", "scrub"), edge("scrub", "closer"), edge("closer", "growth")],
  },
  steps: [
    step(tx("이 레슨의 목적은 혼자 일하게 된 상담사를 요청과 스크러빙으로 지원하고, 다시 가까이 붙어야 할 때와 다음 자리를 준비할 때를 아는 것입니다.", "This lesson is about supporting an agent who now works alone through requests and scrubbing, and knowing when to step back in close and when to prepare him for the next role."), flow, procedure, null),
    step(tx("정식 팀에 합류하고 석 달(예시)이 지났습니다. 서준은 이제 대부분의 문의를 혼자 처리합니다.", "Three months (Example) have passed since he joined a regular team. Seojun now handles most contacts alone."), flow, [], null),
    step(tx("첫 단계는 요청으로 받기입니다. 서준은 승인이 필요하거나 막힐 때 플로어나 메신저로 직무전문가를 부릅니다. 승인하고 처리하는 순서는 직무전문가 첫걸음 레슨 3과 같습니다.", "The first stage is taking requests. Seojun calls the SME on the floor or by messenger when he needs approval or gets stuck. The order for approving and handling is the same as in SME First Steps lesson 3."), flow, ["request"], null),
    step(tx("둘째 단계는 스크러빙으로 보기입니다. 혼자 일하는 상담사의 실수는 스스로 모르기 때문에 요청으로 오지 않습니다. 매일 하는 스크러빙에서 서준의 티켓이 나오면 반복되는 모습이 있는지 봅니다.", "The second stage is checking through scrubbing. Mistakes by an agent who works alone don't arrive as requests, because he doesn't know about them. When Seojun's tickets come up in your daily scrubbing, look for anything that repeats."), flow, ["scrub"], null),
    step(tx("찾은 것은 행동과 티켓 번호로 적어 둡니다. 한 번의 실수는 서준에게 짧게 알려 주고, 반복되면 팀장에게 건네는 요약에 담습니다.", "Write down what you find as behaviors and ticket numbers. Tell Seojun briefly about a one-off mistake, and put a repeated one in the summary you hand the team leader."), flow, ["scrub"], null),
    step(tx("셋째 단계는 다시 가까이 붙기입니다. 새 상품이 나오거나 정책이 바뀌면 정식 상담사도 그 유형에서는 다시 신입이 됩니다. 바뀐 뒤 첫 며칠(예시)은 관련 문의를 먼저 확인합니다.", "The third stage is moving back in close. When a new product launches or a policy changes, even a regular agent is new again for that type. For the first few days (Example) after a change, check those contacts first."), flow, ["closer"], null),
    step(tx("서준의 품질이 갑자기 떨어지거나 요청이 크게 늘어도 다시 가까이 갑니다. 이유가 업무 밖에 있어 보이면 캐묻지 않고 팀장에게 알립니다.", "Move back in close as well when Seojun's quality suddenly drops or his requests rise sharply. If the reason seems to lie outside work, don't press him; tell the team leader."), flow, ["closer"], null),
    step(tx("넷째 단계는 성장 신호 전하기입니다. 서준이 어려운 문의를 혼자 끝내고, 다른 상담사의 질문에 답하기 시작하면 기록해 둡니다.", "The fourth stage is sharing signs of growth. When Seojun handles hard contacts alone and starts answering other agents' questions, write it down."), flow, ["growth"], null),
    step(tx("이런 신호는 팀장에게 전합니다. 신입의 버디를 맡길지, 선임으로 키울지는 팀장이 정합니다.", "Pass these signs on to the team leader. The team leader decides whether to make him a buddy for new hires or grow him into a senior."), flow, ["growth"], null),
  ],
  checkpoint: [
    {
      id: "regular-q1",
      prompt: tx("스크러빙에서 서준의 티켓 세 건(예시)에 같은 확인 단계 누락이 보였습니다. 어떻게 할까요?", "In scrubbing, three of Seojun's tickets (Example) show the same missed check step. What do you do?"),
      options: [
        option("a", tx("서준이 요청하지 않았으니 그대로 둔다.", "Seojun didn't ask, so leave it."), tx("혼자 일하는 상담사의 실수는 스스로 모르기 때문에 요청으로 오지 않습니다.", "Mistakes by an agent who works alone don't arrive as requests, because he doesn't know about them.")),
        option("b", tx("티켓 번호와 함께 팀장에게 건넬 요약에 담는다.", "Put it, with the ticket numbers, in the summary you hand the team leader.")),
        option("c", tx("팀 채팅방에 서준의 티켓을 사례로 올린다.", "Post Seojun's tickets in the team chat as an example."), tx("이름이 드러나면 서준은 창피를 당하고, 팀은 실수를 숨기기 시작합니다.", "With his name showing, Seojun is embarrassed and the team starts hiding mistakes.")),
      ],
      answer: "b",
      explanation: tx("반복되는 모습은 행동과 사례로 팀장에게 전합니다. 한 번의 실수는 서준에게 짧게 알려 줍니다.", "Pass repeated behavior to the team leader as behaviors and examples. Tell Seojun briefly about a one-off mistake."),
    },
    {
      id: "regular-q2",
      prompt: tx("다음 주에 새 요금제가 출시됩니다. 정식 상담사 서준에게 알맞은 지원은 무엇일까요?", "A new plan launches next week. What support fits Seojun, a regular agent?"),
      options: [
        option("a", tx("정식 상담사이니 허들 공지만으로 충분하다.", "He is a regular agent, so a huddle notice is enough."), tx("처음 보는 문의는 경력과 상관없이 막힙니다. 공지만으로는 첫 며칠의 실수를 막기 어렵습니다.", "Contacts you've never seen stall anyone, whatever their experience. A notice alone can't prevent mistakes in the first few days.")),
        option("b", tx("출시 후 첫 며칠은 새 요금제 문의를 먼저 확인한다.", "For the first few days after launch, check his contacts about the new plan first.")),
        option("c", tx("새 요금제 문의는 당분간 직무전문가가 모두 받는다.", "Have the SME take every new-plan contact for now."), tx("직무전문가 혼자 받으면 고객 대기가 길어지고, 서준은 새 요금제를 배우지 못합니다.", "If the SME takes them all, customers wait longer and Seojun never learns the new plan.")),
      ],
      answer: "b",
      explanation: tx("새것이 나오면 정식 상담사도 그 유형만큼은 다시 신입처럼 가까이 지원합니다.", "When something new comes out, support even a regular agent closely again, like a new hire, for that type."),
    },
  ],
  connection: { to: "senior", text: tx("서준처럼 자란 상담사는 언젠가 선임이 됩니다. 이 팀에는 이미 선임이 된 준호가 있습니다.", "Agents who grow like Seojun become seniors one day. This team already has a senior, Junho.") },
};
