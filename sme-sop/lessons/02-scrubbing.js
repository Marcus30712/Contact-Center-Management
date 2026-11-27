import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 2. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["pick", "rca", "classify", "log"];
const flow = ["pick", "rca", "classify", "log", "pick-rca", "rca-classify", "classify-log"];

export default {
  id: "scrubbing",
  order: 2,
  title: tx("스크러빙", "Scrubbing"),
  short: tx("스크러빙", "Scrubbing"),
  subtitle: tx("매일 몇 건씩 다시 읽고, 원인을 찾아 분류해 보냅니다.", "Reread a few tickets every day, find the cause, classify it and send it on."),
  roles: tx("직무전문가 → 팀장 · 고객사", "SME → Team leader · Client"),
  personaName: tx("서준", "Seojun"),
  procedure,
  diagram: {
    nodes: [
      wide(node("pick", "대상 고르기", 180, 36, "Pick tickets")),
      wide(node("rca", "원인 분석", 180, 92, "Root cause")),
      wide(node("classify", "L1·L2 분류", 180, 148, "L1/L2 classification")),
      wide(node("log", "기록과 전달", 180, 204, "Log and pass on")),
    ],
    edges: [edge("pick", "rca"), edge("rca", "classify"), edge("classify", "log")],
  },
  steps: [
    step(tx("이 절차의 목적은 처리된 티켓과 쌓인 티켓을 다시 읽어 진짜 원인을 찾고, 고칠 수 있는 곳으로 보내는 것입니다. 팀장 SOP의 스크러빙 가운데 직무전문가가 매일 맡는 부분입니다.", "This procedure exists to reread closed and backlogged tickets, find the real cause, and send it where it can be fixed. It is the part of the team leader's scrubbing SOP that the SME does every day."), flow, procedure, null),
    step(tx("첫 단계는 대상 고르기입니다. DSAT, CSAT, 미해결 순서로 티켓을 고릅니다. 매일 3~4건(예시)씩 꾸준히 봅니다.", "The first step is picking tickets. Pick them in the order DSAT, CSAT, then unresolved. Review 3 to 4 a day (Example), steadily."), flow, ["pick"], null),
    step(tx("둘째 단계는 원인 분석입니다. 고객이 처음 원한 것, 상담사가 한 것, 결과가 어긋난 지점을 찾아 한두 문장으로 요약합니다.", "The second step is root cause analysis. Find what the customer first wanted, what the agent did, and where the result went wrong, and sum it up in a sentence or two."), flow, ["rca"], null),
    step(tx("원인은 \"왜\"를 몇 번 물어 끝까지 갑니다. \"안내가 틀렸다\"에서 멈추지 않고, 왜 틀렸는지, 문서가 없었는지, 문서가 오래됐는지까지 봅니다.", "Follow the cause to the end by asking \"why\" a few times. Don't stop at \"the explanation was wrong\"; check why it was wrong, whether there was no document, or whether the document was out of date."), flow, ["rca"], null),
    step(tx("셋째 단계는 L1·L2 분류입니다. L1은 원인이 있는 곳(제품, 절차, 지원, 고객, 기타)으로, L2는 BPO가 통제할 수 있는 원인인지로 나눕니다. 팀장 SOP의 스크러빙과 같은 기준입니다.", "The third step is L1/L2 classification. L1 sorts by where the cause lies (Product, Process, Support, Customer, Others), and L2 by whether the BPO can control it. These are the same rules as the team leader's scrubbing SOP."), flow, ["classify"], null),
    step(tx("넷째 단계는 기록과 전달입니다. 결과를 스크러빙 시트에 티켓 번호와 함께 적습니다. 상담사의 행동에서 나온 원인은 팀장에게 건네는 트렌드 요약으로, 통제할 수 없는 원인은 VOC 리포트로 이어집니다.", "The fourth step is logging and passing on. Write the result in the scrubbing sheet with the ticket number. Causes in an agent's behavior go into the trend summary for the team leader, and causes the BPO can't control go into the VOC report."), flow, ["log"], null),
    step(tx("서준의 티켓에서 확인 단계 누락을 찾았다면, 한 번은 서준에게 짧게 알려 주고, 반복되면 요약에 담습니다. 팀 채팅방에 이름을 밝혀 올리지 않습니다.", "If you find a missed check step in Seojun's ticket, tell Seojun briefly the first time, and put it in the summary if it repeats. Don't post it in the team chat with his name."), flow, ["log"], null),
  ],
  checkpoint: [
    {
      id: "scrubbing-q1",
      prompt: tx("오늘 스크러빙할 티켓을 고르는 순서로 알맞은 것은 무엇일까요?", "In what order should you pick today's tickets to scrub?"),
      options: [
        option("a", tx("처리 시간이 가장 짧았던 티켓부터", "Shortest handling time first"), tx("처리 시간으로는 고객이 만족했는지 알 수 없습니다. 고객이 만족하지 못한 티켓에서 원인이 먼저 보입니다.", "Handling time doesn't tell you whether the customer was satisfied. Causes show up first in tickets where the customer was unhappy.")),
        option("b", tx("DSAT, CSAT, 미해결 순서로", "DSAT, CSAT, then unresolved")),
        option("c", tx("잘 아는 상담사의 티켓부터", "Tickets from agents you know well first"), tx("사람을 골라 보면 원인이 아니라 사람을 보게 되고, 공정하지도 않습니다.", "Picking by person makes you look at people instead of causes, and it isn't fair.")),
      ],
      answer: "b",
      explanation: tx("고객이 만족하지 못한 티켓부터 봐야 고칠 원인이 먼저 나옵니다.", "Start with tickets where the customer was unhappy, so the causes to fix come out first."),
    },
    {
      id: "scrubbing-q2",
      prompt: tx("환불이 늦어 DSAT가 난 티켓을 보니 상담사 안내는 맞았고, 원인은 고객사 결제 시스템 장애였습니다. 어떻게 분류하고 어디로 보낼까요?", "A DSAT from a late refund: the agent's explanation was correct, and the cause was an outage in the client's payment system. How do you classify it, and where does it go?"),
      options: [
        option("a", tx("고객이 크게 화를 냈으니 상담사 응대 문제로 분류하고, 트렌드 요약에 담아 코칭한다.", "The customer was very angry, so file it as an agent handling issue and put it in the trend summary for coaching."), tx("상담사는 안내를 제대로 했습니다. 상담사의 행동이 아닌 원인을 코칭으로 보내면 고쳐지지 않습니다.", "The agent explained it correctly. Sending a cause that isn't the agent's behavior to coaching won't fix it.")),
        option("b", tx("BPO가 통제할 수 없는 원인으로 분류해, VOC 리포트로 고객사에 전한다.", "Classify it as a cause the BPO can't control, and pass it to the client through the VOC report.")),
        option("c", tx("코칭할 것이 없는 건이라 분류하지 않고 넘어간다.", "Skip classifying it; there's nothing to coach."), tx("분류해 두지 않으면 같은 불만이 쌓여도 고객사에 전할 근거가 남지 않습니다.", "Without classifying it, there is no evidence to give the client even as the same complaints pile up.")),
      ],
      answer: "b",
      explanation: tx("L2는 BPO가 통제할 수 있는지로 나눕니다. 통제할 수 있으면 우리가 바꾸고, 없으면 고객사에 요청합니다.", "L2 sorts by whether the BPO can control the cause. If we can, we change it; if not, we ask the client."),
    },
  ],
  connection: { to: "trend", text: tx("스크러빙에서 찾은 상담사의 행동은 팀장에게 갑니다. 다음은 그 요약을 만드는 절차입니다.", "The agent behaviors found in scrubbing go to the team leader. Next is the procedure for writing that summary.") },
};
