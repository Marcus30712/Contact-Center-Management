import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 3. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["early", "channel", "whom", "document"];
const flow = ["early", "channel", "whom", "document", "early-channel", "channel-whom", "whom-document"];

export default {
  id: "absence",
  order: 3,
  title: tx("결근·병가 알리기", "Reporting an Absence or Sick Day"),
  short: tx("결근 알리기", "Absence"),
  subtitle: tx("빨리, 정한 방법으로, 정한 사람에게 알립니다.", "Tell them early, by the set method, to the set person."),
  roles: tx("상담사 → 팀장 (없으면 직무전문가)", "Agent → Team leader (SME if away)"),
  procedure,
  diagram: {
    nodes: [
      wide(node("early", "미리 알리기", 180, 36, "Tell them early")),
      wide(node("channel", "정한 방법", 180, 92, "Set method")),
      wide(node("whom", "받을 사람", 180, 148, "Right person")),
      wide(node("document", "서류 보내기", 180, 204, "Send documents")),
    ],
    edges: [edge("early", "channel"), edge("channel", "whom"), edge("whom", "document")],
  },
  steps: [
    step(tx("이 절차의 목적은 아프거나 불가피한 사정으로 출근할 수 없을 때, 팀이 빈자리를 메울 수 있도록 빨리, 정한 방법으로 알리는 것입니다.", "This procedure exists so that when you can't come in because you're sick or something can't be avoided, you report it early and by the set method, so the team can fill the gap."), flow, procedure, null),
    step(tx("새벽에 열이 나서 지민은 출근하기 어렵다고 느낍니다. 아플 때는 쉬어야 합니다. 다만 알리는 방법이 늦거나 틀리면 쉬는 날이 무단결근처럼 남을 수 있습니다.", "Jimin wakes up with a fever and feels she can't go in. When you're sick, rest. But if you report late or the wrong way, a day off can be recorded as a no-show."), flow, [], null),
    step(tx("첫 단계는 미리 알리기입니다. 근무 시작 1~2시간 전(예시)에는 알립니다. 팀이 그 시간에 다른 사람으로 자리를 메울 수 있습니다.", "The first step is telling them early. Report it 1 to 2 hours before your shift (Example). The team can use that time to fill the seat."), flow, ["early"], null),
    step(tx("둘째 단계는 정한 방법입니다. 전화, 메시지, 근태 시스템 등 팀이나 센터가 정한 방법으로 알립니다. 동료에게 전해 달라고 하지 않습니다.", "The second step is the set method. Report it the way your team or center has set: a call, a message or the attendance system. Don't ask a colleague to pass it on."), flow, ["channel"], null),
    step(tx("셋째 단계는 받을 사람입니다. 수진 팀장에게 직접 알리고, 수진 팀장이 휴가나 병가 중이면 하린에게 알립니다.", "The third step is the right person. Tell Sujin directly, or Harin if Sujin is on leave or sick herself."), flow, ["whom"], null),
    step(tx("사유는 짧고 분명하게 말합니다. 본인이 아프면 \"몸이 아파 오늘 출근이 어렵습니다\"라고 알리고, 병원에 들른 뒤 진단서를 보내겠다고 덧붙입니다. 예상치 못한 가족이나 개인 사정이면 대략적인 사유를 말하고 긴급 휴가를 요청합니다.", "Keep the reason short and clear. If you're sick, say \"I'm unwell and can't come in today,\" and add that you'll see a doctor and send a medical certificate. For an unexpected family or personal matter, give a rough reason and ask for Emergency Leave."), flow, ["whom"], null),
    step(tx("넷째 단계는 서류 보내기입니다. 병가를 알린 뒤 병원에 다녀오면, 진단서 같은 서류를 당일 안에 정한 연락 채널로 수진 팀장이나 하린에게 보냅니다. 제출 기한은 센터마다 다를 수 있으니, 병가도 출결 기록에 남는다는 것과 함께 내 센터의 규칙을 미리 알아 둡니다.", "The fourth step is sending documents. After reporting sick and visiting a doctor, send a document such as a medical certificate to Sujin or Harin through the set channel on the same day. Deadlines can differ by center, so learn your center's rules ahead of time, including that sick days stay on your attendance record."), flow, ["document"], null),
    step(tx("미소의 한마디: 저는 아픈 날 동료에게 \"팀장님께 말 좀 전해 줘\"라고 했다가 무단결근으로 남은 적이 있어요. 아플수록 정한 방법으로 직접 알리는 게 나를 지키는 길이었어요.", "A word from Miso: On a sick day I once asked a colleague to \"tell the team leader,\" and it was recorded as a no-show. The sicker you are, the more reporting it yourself by the set method protects you."), flow, ["document"], null),
  ],
  checkpoint: [
    {
      id: "absence-q1",
      prompt: tx("지민이 아파서 출근할 수 없습니다. 가장 알맞은 행동은 무엇일까요?", "Jimin is too sick to come in. What fits best?"),
      options: [
        option("a", tx("옆자리 동료에게 메시지로 팀장님께 결근을 꼭 전해 달라고 부탁해 둔다.", "Message the colleague next to her and ask them to be sure to pass on her absence to Sujin."), tx("전달이 늦거나 빠지면 무단결근으로 남을 수 있습니다. 정한 방법으로 직접 알립니다.", "If it's passed on late or not at all, it can be recorded as a no-show. Report it yourself by the set method.")),
        option("b", tx("근무 시작 시각에 맞춰 근태 시스템에 결근이라고만 표시한다.", "At the start of her shift, just mark herself absent in the attendance system."), tx("시작 시각에 알리면 팀이 자리를 메울 시간이 없습니다. 정한 방법으로 미리 알립니다.", "At shift start the team has no time to fill the seat. Report early, the way your team has set.")),
        option("c", tx("근무 1~2시간 전(예시)에 정한 방법으로 수진 팀장에게 직접 알린다.", "Tell Sujin directly, the way the team has set, 1 to 2 hours before her shift (Example).")),
      ],
      answer: "c",
      explanation: tx("빨리, 정한 방법으로, 정한 사람에게 직접 알려야 팀이 빈자리를 메우고 내 기록도 지켜집니다.", "Reporting early, by the set method, to the right person lets the team fill the gap and keeps your record right."),
    },
    {
      id: "absence-q2",
      prompt: tx("수진 팀장이 휴가 중입니다. 지민은 누구에게 알릴까요?", "Sujin is on leave. Whom does Jimin tell?"),
      options: [
        option("a", tx("팀장이 없으니, 직무전문가 하린에게 알린다.", "Since the team leader is out, tell Harin, the SME.")),
        option("b", tx("휴가 중이어도 수진 팀장에게 알리고 답을 기다린다.", "Tell Sujin anyway and wait for her reply, even though she's on leave."), tx("휴가 중인 팀장은 바로 답하기 어렵습니다. 그날 팀을 맡은 직무전문가에게 알립니다.", "A team leader on leave can't answer quickly. Tell the SME who has the team that day.")),
        option("c", tx("같은 팀 동료 아무에게나 알린다.", "Tell any colleague on the same team."), tx("동료는 결근을 처리할 수 없습니다. 팀장이 없으면 직무전문가에게 알립니다.", "A colleague can't process an absence. If the team leader is away, tell the SME.")),
      ],
      answer: "a",
      explanation: tx("팀장이 휴가나 병가 중이면 직무전문가가 출석을 대신 맡습니다. 직무전문가 SOP의 출석 관리 대행이 그 다음 부분입니다.", "When the team leader is on leave or sick, the SME covers attendance. The SME's attendance cover is what comes next."),
    },
  ],
  connection: { to: "huddle", text: tx("출근한 날 아침에는 허들이 있습니다. 다음은 고객사 업데이트를 듣고 바로 적용하는 절차입니다.", "On the mornings you do come in, there's a huddle. Next is listening to a client update and applying it right away.") },
};
