import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 7. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["gather", "count", "write", "track"];
const flow = ["gather", "count", "write", "track", "gather-count", "count-write", "write-track"];

export default {
  id: "voc",
  order: 7,
  title: tx("VOC 리포팅"),
  short: tx("VOC"),
  subtitle: tx("상담사가 바꿀 수 없는 고객의 목소리를, 고객사가 쓸 수 있게 정리합니다."),
  roles: tx("SME → 팀장 → 고객사"),
  procedure,
  diagram: {
    nodes: [
      wide(node("gather", "모으기", 180, 36)),
      wide(node("count", "묶고 세기", 180, 92)),
      wide(node("write", "리포트 쓰기", 180, 148)),
      wide(node("track", "전달과 추적", 180, 204)),
    ],
    edges: [edge("gather", "count"), edge("count", "write"), edge("write", "track")],
  },
  steps: [
    step(tx("이 절차의 목적은 고객이 반복해서 말하는 불만과 요청, 제품 의견을 모아, 고객사가 정책이나 제품을 고칠 근거로 전하는 것입니다."), flow, procedure, null),
    step(tx("첫 단계는 모으기입니다. 스크러빙에서 통제할 수 없다고 분류한 원인, 에스컬레이션, 상담사들이 전한 고객의 말을 한곳에 모읍니다."), flow, ["gather"], null),
    step(tx("둘째 단계는 묶고 세기입니다. 같은 주제끼리 묶고, 기간 동안 몇 건이었는지 셉니다. 고객의 실제 표현 한두 개를 그대로 붙여 둡니다."), flow, ["count"], null),
    step(tx("셋째 단계는 리포트 쓰기입니다. 주제마다 건수, 고객이 겪는 영향, 대표 사례, 제안을 적습니다."), flow, ["write"], null),
    step(tx("예를 들어 \"배송 지연 안내 문자 없음: 주 40건(예시), 재문의로 이어짐, 출고 지연 시 문자 발송 제안\"처럼 씁니다. 지민이 전한 고객의 말이 대표 사례가 될 수 있습니다."), flow, ["write"], null),
    step(tx("리포트에는 고객의 개인 정보와 상담사 이름을 넣지 않습니다. 고객사가 볼 것은 사람이 아니라 문제입니다."), flow, ["write"], null),
    step(tx("넷째 단계는 전달과 추적입니다. 리포트는 수진 팀장을 거쳐 고객사에 갑니다. 전달한 주제는 목록에 남기고, 바뀌었는지 다음 리포트에서 확인합니다."), flow, ["track"], null),
    step(tx("고객사가 고친 것이 생기면 팀에도 알립니다. 상담사는 자기가 들은 고객의 말이 무언가를 바꿨다는 것을 알 때 고객의 목소리를 더 잘 모읍니다."), flow, ["track"], null),
  ],
  checkpoint: [
    {
      id: "voc-q1",
      prompt: tx("이번 주 \"비밀번호 재설정 메일이 안 온다\"는 문의가 많았습니다. 리포트 항목으로 알맞은 것은 무엇일까요?"),
      options: [
        option("a", tx("\"고객들이 비밀번호 때문에 화가 많이 남\""), tx("건수와 사례, 제안이 없으면 고객사는 얼마나 큰 문제인지, 무엇을 고칠지 알 수 없습니다.")),
        option("b", tx("\"재설정 메일 미수신: 주 25건(예시), 대표 사례 2건, 발송 지연 확인 제안\"")),
        option("c", tx("\"지민이 받은 관련 문의 목록 전체\""), tx("상담사 이름과 정리되지 않은 목록은 고객사가 쓰기 어렵고, 개인 정보가 섞일 위험도 있습니다.")),
      ],
      answer: "b",
      explanation: tx("VOC는 주제, 건수, 대표 사례, 제안으로 씁니다."),
    },
    {
      id: "voc-q2",
      prompt: tx("지난달 전한 VOC 주제가 이번 달에도 그대로 많습니다. 어떻게 할까요?"),
      options: [
        option("a", tx("이미 전했으니 이번에는 뺀다."), tx("빠지면 고객사는 문제가 해결된 것으로 봅니다.")),
        option("b", tx("지난 리포트와 함께 건수 변화를 보여 다시 올리고, 팀장과 우선순위를 상의한다.")),
        option("c", tx("고객사 담당에게 직접 연락해 항의한다."), tx("고객사와의 소통은 팀장과 정해진 경로를 거칩니다. 혼자 연락하면 같은 이야기가 여러 길로 가서 혼란이 생깁니다.")),
      ],
      answer: "b",
      explanation: tx("전달한 VOC는 바뀔 때까지 추적합니다."),
    },
  ],
  connection: { to: "kbrequest", text: tx("VOC가 고객사를 바꾸는 일이라면, 마지막 절차는 팀이 매일 보는 문서를 바꾸는 일입니다.") },
};
