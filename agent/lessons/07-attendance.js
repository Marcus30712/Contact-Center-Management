import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 7. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["schedule", "early", "sick", "covering"];
const flow = ["schedule", "early", "sick", "covering", "schedule-early", "early-sick", "sick-covering"];

export default {
  id: "attendance",
  order: 7,
  title: tx("근태와 스케줄", "Attendance and Schedules"),
  short: tx("근태", "Attendance"),
  subtitle: tx("빡빡한 스케줄 속에서 출결을 지키고, 아픈 날과 바쁜 날을 넘기는 법을 익힙니다.", "Learn to keep your attendance in a tight schedule, and to get through sick days and busy days."),
  procedure,
  diagram: {
    nodes: [
      wide(node("schedule", "스케줄 확인", 180, 36, "Check the schedule")),
      wide(node("early", "미리 알리기", 180, 92, "Tell them early")),
      wide(node("sick", "아픈 날", 180, 148, "Sick days")),
      wide(node("covering", "동료가 빠진 날", 180, 204, "Days a colleague is out")),
    ],
    edges: [edge("schedule", "early"), edge("early", "sick"), edge("sick", "covering")],
  },
  steps: [
    step(tx("이 레슨의 목적은 빡빡한 스케줄 속에서 출결을 지키고, 아픈 날과 바쁜 날을 넘기는 법을 익히는 것입니다.", "This lesson is about keeping your attendance in a tight schedule and getting through sick days and busy days."), flow, procedure, null),
    step(tx("고객센터는 시간대마다 필요한 인원을 맞춰 스케줄을 짭니다. 지민 한 사람이 빠지면 그 시간의 콜과 채팅, 이메일이 남은 사람에게 몰립니다.", "A contact center builds its schedule to match the people needed in each time slot. If Jimin is out, that slot's calls, chats and emails fall on everyone else."), flow, [], null),
    step(tx("첫 단계는 스케줄 확인입니다. 다음 주 근무와 휴식, 교육 시간을 미리 확인하고 정해진 시간을 지킵니다. 이것을 스케줄 준수율로 봅니다.", "The first stage is checking the schedule. Check next week's shifts, breaks and training times ahead, and keep to them. This is what schedule adherence measures."), flow, ["schedule"], null),
    step(tx("둘째 단계는 미리 알리기입니다. 휴가나 일정 변경은 센터가 정한 방법과 기한에 맞춰 최대한 일찍 신청합니다.", "The second stage is telling them early. Request leave or schedule changes as early as you can, using the method and deadline your center sets."), flow, ["early"], null),
    step(tx("셋째 단계는 아픈 날입니다. 아프거나 불가피한 사정으로 출근할 수 없으면, 근무 시작 1~2시간 전(예시)에는 팀이나 센터가 정한 방법으로 수진 팀장에게 직접 알립니다. 수진 팀장이 휴가나 병가 중이면 직무전문가 하린에게 알리고, 필요한 서류가 있다면 챙깁니다.", "The third stage is sick days. If you're ill or something unavoidable keeps you from work, tell Sujin, your team leader, directly at least 1–2 hours before your shift (Example), the way your team or center sets. If Sujin is on leave or off sick, tell Harin the SME, and bring any documents that are needed."), flow, ["sick"], null),
    step(tx("넷째 단계는 동료가 빠진 날입니다. 문의가 몰려도 정해진 휴식은 지키고, 한 건씩 정확하게 처리합니다.", "The fourth stage is days a colleague is out. Even when contacts pile up, keep your scheduled breaks and handle one contact at a time, accurately."), flow, ["covering"], null),
    step(tx("병가도 출결 기록에 남아 평가에 영향을 줄 수 있습니다. 내 센터의 출결 규칙을 미리 알아 두면 불필요한 불이익을 줄일 수 있습니다.", "Sick days are recorded too and can affect your evaluation. Knowing your center's attendance rules ahead of time helps you avoid needless penalties."), flow, ["sick"], null),
    step(tx("아픈데 무리해서 출근하면 더 길게 빠지게 될 수 있습니다. 쉬어야 할 때 절차대로 쉬는 것도 팀을 돕는 일입니다.", "Coming in when you're ill can keep you out for longer. Resting by the process when you need to is also a way of helping the team."), flow, ["sick"], null),
    step(tx("미소의 한마디: 저는 동료가 빠진 날 휴식까지 건너뛰다가 오후에 실수가 늘었어요. 쉬는 시간을 지키는 게 결국 팀을 돕는 거였어요.", "A word from Miso: On days a colleague was out, I skipped even my breaks, and my mistakes piled up in the afternoon. Keeping my breaks was what really helped the team."), flow, ["covering"], null),
  ],
  checkpoint: [
    {
      id: "attendance-q1",
      prompt: tx("지민이 아침에 열이 나서 출근하기 어렵습니다. 어떻게 할까요?", "Jimin wakes up with a fever and can't come in. What should she do?"),
      options: [
        option("a", tx("조금 쉬면 나아질 수도 있으니, 근무가 시작된 뒤 상태를 보고 연락한다.", "She might feel better after some rest, so see how she is and get in touch after her shift starts."), tx("늦게 알리면 스케줄을 다시 짤 시간이 없고, 무단 결근으로 남을 수 있습니다.", "Telling them late leaves no time to rearrange the schedule and can go down as an unexcused absence.")),
        option("b", tx("스케줄을 다시 짤 수 있게, 근무 1~2시간 전(예시)에 팀장에게 직접 알린다.", "Tell her team leader directly 1–2 hours before her shift (Example), so the schedule can be rearranged.")),
        option("c", tx("동료에게 대신 말해 달라고만 부탁한다.", "Only ask a colleague to pass it on."), tx("동료를 거치면 전달이 늦거나 빠질 수 있습니다. 정해진 방법으로 직접 알립니다.", "Going through a colleague can delay or lose the message. Tell them directly the agreed way.")),
      ],
      answer: "b",
      explanation: tx("아픈 날은 근무 시작 전에 여유를 두고, 정해진 방법으로 팀장에게 직접 알립니다. 팀장이 자리에 없으면 직무전문가에게 알립니다.", "On a sick day, tell your team leader directly, well before your shift and the agreed way. If your team leader is away, tell the SME."),
    },
    {
      id: "attendance-q2",
      prompt: tx("동료 두 명이 병가를 내서 대기 중인 문의가 많습니다. 어떻게 할까요?", "Two colleagues are off sick, and many contacts are waiting. What should Jimin do?"),
      options: [
        option("a", tx("팀이 바쁘니 오늘은 휴식을 건너뛰고 쉬지 않고 받는다.", "The team is busy, so skip her breaks today and take contacts nonstop."), tx("지치면 실수가 늘고 처리 시간도 길어집니다. 휴식도 스케줄의 일부입니다.", "When you're worn out, mistakes rise and handling time grows. Breaks are part of the schedule too.")),
        option("b", tx("휴식은 지키고, 한 건씩 정확하게 처리한다.", "Keep her breaks and handle one contact at a time, accurately.")),
        option("c", tx("대기를 빨리 줄이려고 확인 절차를 건너뛰고 처리한다.", "Skip the checks to bring the queue down faster."), tx("확인을 건너뛰면 다시 연락이 오고, 그 문의가 또 쌓입니다.", "Skipping checks brings contacts back, and they pile up again.")),
      ],
      answer: "b",
      explanation: tx("바쁜 날일수록 정해진 순서와 휴식을 지킵니다.", "The busier the day, the more you keep to the set order and breaks."),
    },
  ],
  connection: { to: "growth", text: tx("이렇게 몇 달을 보내면, 어느새 달라진 내가 보입니다. 익숙해지기까지의 이야기입니다.", "After a few months like this, you'll notice how much you've changed. Next is the story of getting comfortable.") },
};
