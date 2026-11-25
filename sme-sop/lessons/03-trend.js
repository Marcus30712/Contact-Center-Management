import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 3. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["gather", "repeat", "line", "report"];
const flow = ["gather", "repeat", "line", "report", "gather-repeat", "repeat-line", "line-report"];

export default {
  id: "trend",
  order: 3,
  title: tx("상담 트렌드 요약 보고"),
  short: tx("트렌드 요약"),
  subtitle: tx("스크러빙에서 본 것을 팀장이 코칭에 바로 쓸 수 있게 정리합니다."),
  roles: tx("SME → 팀장"),
  procedure,
  diagram: {
    nodes: [
      wide(node("gather", "모으기", 180, 36)),
      wide(node("repeat", "반복 찾기", 180, 92)),
      wide(node("line", "한 줄로 쓰기", 180, 148)),
      wide(node("report", "보고하기", 180, 204)),
    ],
    edges: [edge("gather", "repeat"), edge("repeat", "line"), edge("line", "report")],
  },
  steps: [
    step(tx("이 절차의 목적은 스크러빙에서 본 상담사별 반복 행동을 정리해, 팀장이 누구를 무엇으로 코칭할지 바로 정하게 돕는 것입니다."), flow, procedure, null),
    step(tx("수진 팀장은 매주 금요일(예시) 이 요약을 받아 다음 주 코칭 계획을 세웁니다."), flow, [], null),
    step(tx("첫 단계는 모으기입니다. 한 주 동안 스크러빙 시트에 적은 원인 가운데 상담사의 행동에서 나온 것을 상담사별로 모읍니다."), flow, ["gather"], null),
    step(tx("둘째 단계는 반복 찾기입니다. 같은 행동이 두 번 이상(예시) 나온 것만 트렌드로 봅니다. 한 번은 실수이고, 반복은 코칭할 행동입니다."), flow, ["repeat"], null),
    step(tx("셋째 단계는 한 줄로 쓰기입니다. 사람, 행동, 횟수, 티켓 번호를 적습니다. 예를 들어 \"지민: 환불 문의 3건(예시)에서 본인 확인 다음 단계 누락\"처럼 씁니다."), flow, ["line"], null),
    step(tx("성격이나 태도가 아니라 행동을 씁니다. 점수를 매기거나 순위를 만들지 않고, 코칭으로 바꿀 수 있는 것만 담습니다."), flow, ["line"], null),
    step(tx("넷째 단계는 보고하기입니다. 정해진 날 수진 팀장에게 보냅니다. 여러 사람에게 같은 행동이 나왔다면 따로 묶어 허들 주제로 제안합니다."), flow, ["report"], null),
    step(tx("준호처럼 다른 상담사를 잘 돕는 모습이 반복되면 그것도 적습니다. 요약은 고칠 점만이 아니라 팀장이 칭찬하고 키울 사람도 알려 줍니다."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "trend-q1",
      prompt: tx("이번 주 서준의 티켓 한 건에서 확인 단계 누락을 봤습니다. 요약에 어떻게 담을까요?"),
      options: [
        option("a", tx("서준의 트렌드로 적는다."), tx("한 번은 아직 트렌드가 아닙니다. 다음 주에도 나오는지 봅니다.")),
        option("b", tx("서준에게 짧게 알려 주고, 반복될 때 요약에 담는다.")),
        option("c", tx("팀 전체 문제로 허들에 올린다."), tx("한 사람의 한 번 실수를 팀 전체 문제로 올리면, 다른 상담사에게는 필요 없는 이야기가 됩니다.")),
      ],
      answer: "b",
      explanation: tx("반복된 행동만 트렌드로 요약합니다."),
    },
    {
      id: "trend-q2",
      prompt: tx("이번 주 팀원 다섯 명에게서 같은 안내 실수가 나왔습니다. 어떻게 할까요?"),
      options: [
        option("a", tx("다섯 명을 각각 한 줄씩만 적는다."), tx("각각만 적으면 팀 공통 문제라는 것이 보이지 않습니다.")),
        option("b", tx("팀 공통 트렌드로 묶어 허들 주제로 제안하고, 원인이 문서라면 지식 베이스 업데이트도 요청한다.")),
        option("c", tx("다섯 명에게 각각 주의를 준다."), tx("주의나 경고는 팀장의 몫입니다. 여러 명이 같다면 원인이 사람보다 문서나 교육에 있을 수 있습니다.")),
      ],
      answer: "b",
      explanation: tx("여러 사람에게 같은 실수가 나오면 사람보다 원인을 먼저 봅니다."),
    },
  ],
  connection: { to: "attendance", text: tx("팀장을 돕는 일은 요약만이 아닙니다. 팀장이 자리에 없을 때는 출석도 대신 확인합니다.") },
};
