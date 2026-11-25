import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 1. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["role", "day", "approve", "share"];
const flow = [...procedure, "role-day", "day-approve", "approve-share"];

export default {
  id: "firstday",
  order: 1,
  title: tx("SME가 된 첫날"),
  short: tx("첫날"),
  subtitle: tx("내 자리가 무엇이고, 어디까지 내가 정하는지."),
  procedure,
  diagram: {
    nodes: [
      wide(node("role", "역할 알기", 180, 36)),
      wide(node("day", "하루 일과", 180, 92)),
      wide(node("approve", "승인 범위", 180, 148)),
      wide(node("share", "팀장과 나누기", 180, 204)),
    ],
    edges: [edge("role", "day"), edge("day", "approve"), edge("approve", "share")],
  },
  steps: [
    step(tx("이 레슨의 목적은 상담사에서 SME가 된 첫날, 내 자리가 무엇이고 하루를 어떻게 쓰며 어디까지 내가 정하는지 아는 것입니다. 네 단계로 살펴봅니다."), flow, procedure, null),
    step(tx("어제까지 당신은 수진 팀의 선임 상담사였습니다. 오늘부터는 같은 팀 12명(예시)을 받쳐 주는 SME입니다. 이제는 내 문의를 잘 처리하는 것보다 팀이 막히지 않게 하는 것이 일입니다."), flow, [], null),
    step(tx("첫 단계는 역할 알기입니다. SME는 팀의 지식 허브입니다. 막힌 문의에 답을 주고, 에스컬레이션을 승인하거나 처리하고, 동료의 성장을 돕습니다."), flow, ["role"], null),
    step(tx("SME는 상담사를 평가하거나 징계하는 자리가 아닙니다. 평가는 QA와 팀장이 맡습니다. 당신은 승인하고 돕는 사람입니다."), flow, ["role"], null),
    step(tx("둘째 단계는 하루 일과 알기입니다. 하루의 대부분은 에스컬레이션 지원과 어려운 케이스 처리, 상담사 멘토링에 씁니다. 여기에 VOC 정리와 QA와의 품질 교정 미팅이 더해집니다."), flow, ["day"], null),
    step(tx("서포트 요청은 두 곳에서 옵니다. 플로어를 돌며 손을 든 상담사를 돕고, 메신저와 팀 채팅방으로 들어오는 질문에도 답합니다."), flow, ["day"], null),
    step(tx("셋째 단계는 승인 범위 확인입니다. 첫날 수진 팀장과 앉아, 내가 승인할 수 있는 것과 팀장에게 넘길 것을 목록으로 맞춥니다. 예를 들어 정해진 기준 안의 보상은 승인하고, 정책 밖의 요청과 근태·성과 문제는 넘깁니다."), flow, ["approve"], null),
    step(tx("범위를 모르면 두 가지 실수가 생깁니다. 내 권한 밖을 승인해 버리거나, 반대로 모든 건을 팀장에게 넘겨 팀장의 하루가 막힙니다."), flow, ["approve"], null),
    step(tx("넷째 단계는 팀장과 나누기입니다. 팀장이 바쁠 때 출석 관리, 코칭 자료, 허들을 나눠 맡을 수 있다는 것도 미리 이야기해 둡니다. 레슨 5에서 자세히 다룹니다."), flow, ["share"], null),
    step(tx("첫날이 끝나면 오늘 받은 질문을 짧게 적어 둡니다. 자주 오는 질문이 내일 먼저 준비할 것입니다."), flow, ["share"], null),
  ],
  checkpoint: [
    {
      id: "firstday-q1",
      prompt: tx("첫날, 상담사가 고객에게 정책에 없는 큰 보상을 해 주자며 승인을 요청합니다. 어떻게 할까요?"),
      options: [
        option("a", tx("고객이 화가 많이 났으니 일단 승인한다."), tx("승인 범위 밖의 결정은 되돌리기 어렵고, 다른 고객에게도 같은 기준을 요구받게 됩니다.")),
        option("b", tx("승인 범위 밖이므로 고객에게 기다림을 안내하게 하고, 팀장에게 바로 넘긴다.")),
        option("c", tx("정책에 없으니 거절하고 상담사에게 그대로 응대하게 한다."), tx("거절로 끝내면 고객의 문제는 그대로 남습니다. 내가 정할 수 없는 건은 정할 수 있는 사람에게 넘깁니다.")),
      ],
      answer: "b",
      explanation: tx("승인 범위 안은 내가 정하고, 범위 밖은 팀장에게 넘깁니다. 첫날 범위를 맞춰 두는 이유입니다."),
    },
    {
      id: "firstday-q2",
      prompt: tx("지민의 응대 태도가 요즘 걱정됩니다. SME로서 알맞은 것은 무엇일까요?"),
      options: [
        option("a", tx("지민의 품질 점수를 직접 낮춰 기록한다."), tx("평가는 QA와 팀장이 맡습니다. SME가 점수를 매기면 역할이 섞여 지민도 누구에게 도움을 청할지 헷갈립니다.")),
        option("b", tx("옆에서 응대를 함께 보며 돕고, 같은 모습이 반복되면 팀장에게 사례와 함께 알린다.")),
        option("c", tx("SME가 관여할 일이 아니니 모른 척한다."), tx("돕는 것은 SME의 일입니다. 모른 척하면 문제가 커진 뒤에야 드러납니다.")),
      ],
      answer: "b",
      explanation: tx("SME는 평가 대신 돕고, 반복되는 문제는 근거와 함께 팀장에게 전합니다."),
    },
  ],
  connection: { to: "newcomer", text: tx("역할을 알았으니 이제 사람을 만날 차례입니다. 먼저 가장 가까이 붙어 있어야 할 사람, 막 교육을 마친 신입입니다.") },
};
