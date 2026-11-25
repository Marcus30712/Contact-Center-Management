import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 2. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["pick", "rca", "classify", "log"];
const flow = ["pick", "rca", "classify", "log", "pick-rca", "rca-classify", "classify-log"];

export default {
  id: "scrubbing",
  order: 2,
  title: tx("스크러빙"),
  short: tx("스크러빙"),
  subtitle: tx("매일 몇 건씩 다시 읽고, 원인을 찾아 분류해 보냅니다."),
  roles: tx("SME → 팀장 · 고객사"),
  personaName: tx("서준"),
  procedure,
  diagram: {
    nodes: [
      wide(node("pick", "대상 고르기", 180, 36)),
      wide(node("rca", "원인 분석", 180, 92)),
      wide(node("classify", "L1·L2 분류", 180, 148)),
      wide(node("log", "기록과 전달", 180, 204)),
    ],
    edges: [edge("pick", "rca"), edge("rca", "classify"), edge("classify", "log")],
  },
  steps: [
    step(tx("이 절차의 목적은 처리된 티켓과 쌓인 티켓을 다시 읽어 진짜 원인을 찾고, 고칠 수 있는 곳으로 보내는 것입니다. 팀장 SOP의 스크러빙 가운데 SME가 매일 맡는 부분입니다."), flow, procedure, null),
    step(tx("첫 단계는 대상 고르기입니다. DSAT, CSAT, 미해결 순서로 티켓을 고릅니다. 매일 3~4건(예시)씩 꾸준히 봅니다."), flow, ["pick"], null),
    step(tx("둘째 단계는 원인 분석입니다. 고객이 처음 원한 것, 상담사가 한 것, 결과가 어긋난 지점을 찾아 한두 문장으로 요약합니다."), flow, ["rca"], null),
    step(tx("원인은 \"왜\"를 몇 번 물어 끝까지 갑니다. \"안내가 틀렸다\"에서 멈추지 않고, 왜 틀렸는지, 문서가 없었는지, 문서가 오래됐는지까지 봅니다."), flow, ["rca"], null),
    step(tx("셋째 단계는 L1·L2 분류입니다. L1은 원인이 있는 곳(제품, 절차, 지원, 고객, 기타)으로, L2는 BPO가 통제할 수 있는 원인인지로 나눕니다. 팀장 SOP의 스크러빙과 같은 기준입니다."), flow, ["classify"], null),
    step(tx("넷째 단계는 기록과 전달입니다. 결과를 스크러빙 시트에 티켓 번호와 함께 적습니다. 상담사의 행동에서 나온 원인은 팀장에게 건네는 트렌드 요약으로, 통제할 수 없는 원인은 VOC 리포트로 이어집니다."), flow, ["log"], null),
    step(tx("서준의 티켓에서 확인 단계 누락을 찾았다면, 한 번은 서준에게 짧게 알려 주고, 반복되면 요약에 담습니다. 팀 채팅방에 이름을 밝혀 올리지 않습니다."), flow, ["log"], null),
  ],
  checkpoint: [
    {
      id: "scrubbing-q1",
      prompt: tx("오늘 스크러빙할 티켓을 고르는 순서로 알맞은 것은 무엇일까요?"),
      options: [
        option("a", tx("처리 시간이 가장 짧았던 티켓부터"), tx("짧게 끝난 티켓은 대개 문제가 없습니다. 고객이 만족하지 못한 티켓에서 원인이 먼저 보입니다.")),
        option("b", tx("DSAT, CSAT, 미해결 순서로")),
        option("c", tx("잘 아는 상담사의 티켓부터"), tx("사람을 골라 보면 원인이 아니라 사람을 보게 되고, 공정하지도 않습니다.")),
      ],
      answer: "b",
      explanation: tx("고객이 만족하지 못한 티켓부터 봐야 고칠 원인이 먼저 나옵니다."),
    },
    {
      id: "scrubbing-q2",
      prompt: tx("환불이 늦어 DSAT가 난 티켓의 원인이 고객사 결제 시스템 장애였습니다. 어떻게 분류하고 어디로 보낼까요?"),
      options: [
        option("a", tx("고객이 화가 났으니 상담사 응대 문제로 보고 트렌드 요약에 담는다."), tx("상담사는 안내를 제대로 했습니다. 상담사의 행동이 아닌 원인을 코칭으로 보내면 고쳐지지 않습니다.")),
        option("b", tx("BPO가 통제할 수 없는 원인으로 분류하고, VOC 리포트로 고객사에 전한다.")),
        option("c", tx("분류하기 애매하니 기록하지 않는다."), tx("기록하지 않으면 같은 불만이 쌓여도 고객사에 전할 근거가 남지 않습니다.")),
      ],
      answer: "b",
      explanation: tx("L2는 BPO가 통제할 수 있는지로 나눕니다. 통제할 수 있으면 우리가 바꾸고, 없으면 고객사에 요청합니다."),
    },
  ],
  connection: { to: "trend", text: tx("스크러빙에서 찾은 상담사의 행동은 팀장에게 갑니다. 다음은 그 요약을 만드는 절차입니다.") },
};
