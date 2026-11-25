import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 4. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["confirm", "check", "record", "alert"];
const flow = ["confirm", "check", "record", "alert", "confirm-check", "check-record", "record-alert"];

export default {
  id: "attendance",
  order: 4,
  title: tx("출석 관리 대행"),
  short: tx("출석 대행"),
  subtitle: tx("기록하고 알리는 데까지, 판단과 조치는 팀장이 합니다."),
  roles: tx("SME → 팀장 · RTA"),
  personaName: tx("준호"),
  procedure,
  diagram: {
    nodes: [
      wide(node("confirm", "대행 확인", 180, 36)),
      wide(node("check", "출석 확인", 180, 92)),
      wide(node("record", "사실 기록", 180, 148)),
      wide(node("alert", "공백 알리기", 180, 204)),
    ],
    edges: [edge("confirm", "check"), edge("check", "record"), edge("record", "alert")],
  },
  steps: [
    step(tx("이 절차의 목적은 팀장이 자리에 없거나 팀원이 많을 때, SME가 출석을 대신 확인하고 기록해 인원 공백을 빨리 알리는 것입니다."), flow, procedure, null),
    step(tx("첫 단계는 대행 확인입니다. 수진 팀장에게 오늘 대행을 맡는지, 연락 올 곳과 보고할 시각을 미리 받습니다."), flow, ["confirm"], null),
    step(tx("둘째 단계는 출석 확인입니다. 근무 시작 시각에 스케줄과 실제 로그인을 맞춰 보고, 없는 사람을 확인합니다."), flow, ["check"], null),
    step(tx("지각이나 결근 연락이 오면 받은 시각과 말한 사유를 그대로 받습니다. 사유가 타당한지는 판단하지 않습니다."), flow, ["check"], null),
    step(tx("셋째 단계는 사실 기록입니다. 출석 시트에 도착 시각, 연락 여부, 사유를 사실대로 적습니다. 빼거나 고치지 않습니다."), flow, ["record"], null),
    step(tx("넷째 단계는 공백 알리기입니다. 결근으로 인원이 부족하면 RTA에게 바로 알려 대기열을 지킬 수 있게 합니다."), flow, ["alert"], null),
    step(tx("정해진 시각에 수진 팀장에게 출석 결과를 보냅니다. 경고, 근태 조치, 스케줄 변경은 팀장이 정합니다."), flow, ["alert"], null),
  ],
  checkpoint: [
    {
      id: "attendance-q1",
      prompt: tx("근무 시작 10분 뒤에도 두 명이 로그인하지 않았고 연락도 없습니다. 먼저 할 일은 무엇일까요?"),
      options: [
        option("a", tx("팀장이 돌아오면 알린다."), tx("그동안 대기열은 두 명이 빠진 채로 돌아갑니다. 인원 공백은 바로 알려야 합니다.")),
        option("b", tx("출석 시트에 적고, RTA와 수진 팀장에게 인원 공백을 바로 알린다.")),
        option("c", tx("두 사람 몫의 문의를 SME가 대신 받는다."), tx("SME가 상담 자리를 채우면 에스컬레이션 승인이 막힙니다. 인원 조정은 RTA와 팀장이 합니다.")),
      ],
      answer: "b",
      explanation: tx("출석 대행에서 가장 급한 것은 인원 공백을 빨리 알리는 것입니다."),
    },
    {
      id: "attendance-q2",
      prompt: tx("준호가 오늘 15분 늦었는데, 출석 시트에서 빼 달라고 부탁합니다. 어떻게 할까요?"),
      options: [
        option("a", tx("오래 함께한 동료이니 빼 준다."), tx("기록을 고치면 다른 팀원과 기준이 달라지고, 대행자의 기록을 믿을 수 없게 됩니다.")),
        option("b", tx("사실대로 기록하고, 사정이 있다면 팀장에게 직접 말하도록 안내한다.")),
        option("c", tx("늦은 사실을 팀 채팅방에 알린다."), tx("근태는 공개할 일이 아닙니다. 기록과 보고는 팀장에게만 갑니다.")),
      ],
      answer: "b",
      explanation: tx("대행은 사실을 기록하고 전하는 일입니다. 바꾸거나 판단하지 않습니다."),
    },
  ],
  connection: { to: "huddle", text: tx("팀장 대신 하는 또 하나의 일은 고객사 업데이트를 팀에 전하는 허들입니다.") },
};
