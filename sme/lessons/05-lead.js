import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 5. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["attendance", "trend", "huddle", "report"];
const flow = [...procedure, "attendance-trend", "trend-huddle", "huddle-report"];

export default {
  id: "lead",
  order: 5,
  title: tx("팀장 서포트"),
  short: tx("팀장 서포트"),
  subtitle: tx("출석 관리, 트렌드 요약, 허들을 나눠 맡습니다."),
  procedure,
  diagram: {
    nodes: [
      wide(node("attendance", "출석 관리", 180, 36)),
      wide(node("trend", "트렌드 요약", 180, 92)),
      wide(node("huddle", "허들 진행", 180, 148)),
      wide(node("report", "팀장에게 보고", 180, 204)),
    ],
    edges: [edge("attendance", "trend"), edge("trend", "huddle"), edge("huddle", "report")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀장의 일을 부분적으로 나눠 맡아, 팀장이 코칭과 팀 관리에 시간을 쓰도록 돕는 것입니다. 대표적인 일은 세 가지입니다."), flow, procedure, null),
    step(tx("수진 팀장은 15명(예시) 팀을 맡고 있고, 오늘은 오후 내내 고객사 미팅에 들어갑니다."), flow, [], null),
    step(tx("첫째는 출석 관리입니다. 팀원이 많거나 팀장이 자리에 없을 때 SME가 출석을 대신 확인합니다. 근무 시작 시각에 자리에 없는 사람과 지각, 결근 연락을 기록합니다."), flow, ["attendance"], null),
    step(tx("대행은 기록하고 알리는 데까지입니다. 사유를 판단하거나 근태 조치를 정하는 것은 팀장이 합니다. 결근이 늘어 인원이 부족하면 팀장과 RTA에게 바로 알립니다."), flow, ["attendance"], null),
    step(tx("둘째는 스크러빙 트렌드 요약입니다. 매일 스크러빙한 티켓에서 상담사별로 반복되는 모습을 모아, 팀장이 코칭에 바로 쓸 수 있게 짧게 정리합니다."), flow, ["trend"], null),
    step(tx("요약은 사실과 사례로 씁니다. 예를 들어 \"지민: 이번 주 환불 문의 3건에서 같은 확인 단계를 빠뜨림\"처럼 쓰고 티켓 번호를 붙이면, 팀장이 코칭에 바로 씁니다."), flow, ["trend"], null),
    step(tx("사람에 대한 평가 대신 행동을 적습니다. \"꼼꼼하지 않다\"가 아니라 \"확인 단계를 건너뛰었다\"고 씁니다."), flow, ["trend"], null),
    step(tx("셋째는 허들 진행입니다. 고객사가 정책이나 프로모션 업데이트를 보내오면 SME가 허들에서 팀에 전합니다."), flow, ["huddle"], null),
    step(tx("허들 전에 내용을 먼저 이해하고, 상담사가 고객에게 어떻게 말하면 되는지까지 준비합니다. 허들에서 나온 질문은 답을 정리해 팀 채팅방에 다시 올립니다."), flow, ["huddle"], null),
    step(tx("마지막으로 팀장에게 보고합니다. 팀장이 돌아왔을 때 무엇이 있었는지 한눈에 알 수 있도록 출석, 요약, 허들 내용을 짧게 전합니다."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "lead-q1",
      prompt: tx("팀장이 자리에 없는 동안 한 상담사가 30분 늦게 와서 사유를 설명합니다. 어떻게 할까요?"),
      options: [
        option("a", tx("사유가 타당해 보이니 지각 기록에서 뺀다."), tx("사유를 판단하는 것은 팀장의 일입니다. SME가 빼 주면 같은 사유를 가진 다른 사람과 기준이 달라질 수 있습니다.")),
        option("b", tx("도착 시각과 사유를 그대로 기록해 팀장에게 전한다.")),
        option("c", tx("다시는 늦지 말라고 경고한다."), tx("경고 같은 근태 조치는 팀장의 몫입니다. 대행은 기록하고 알리는 데까지입니다.")),
      ],
      answer: "b",
      explanation: tx("출석 대행은 사실을 기록하고 전하는 일입니다. 판단과 조치는 팀장이 합니다."),
    },
    {
      id: "lead-q2",
      prompt: tx("팀장에게 건넬 스크러빙 트렌드 요약에 알맞은 것은 무엇일까요?"),
      options: [
        option("a", tx("상담사마다 성격과 태도를 한 줄로 평가한다."), tx("성격 평가는 근거가 없고, 코칭에서 바꿀 행동을 알려 주지 않습니다.")),
        option("b", tx("상담사별로 반복된 행동과 그 행동이 나온 티켓 번호를 적는다.")),
        option("c", tx("이번 주 품질 점수 순위표를 만든다."), tx("순위는 누가 낮은지만 알려 줄 뿐, 무엇을 코칭해야 하는지는 알려 주지 않습니다.")),
      ],
      answer: "b",
      explanation: tx("행동과 사례가 있어야 팀장이 무엇을 코칭할지 바로 정할 수 있습니다."),
    },
  ],
  connection: { to: "priority", text: tx("신입, 기존 상담사, 선임, 팀장까지. 이 요청들은 차례로 오지 않고 한꺼번에 옵니다.") },
};
