import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 2. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["summary", "send", "confirm", "report"];
const flow = ["summary", "send", "confirm", "report", "summary-send", "send-confirm", "confirm-report"];

export default {
  id: "instructions",
  order: 2,
  title: tx("지침 전달과 확인 보고", "Passing On Instructions and Reporting Back"),
  short: tx("지침 전달", "Instructions"),
  subtitle: tx("정리본 하나로 보내고, 확인 명단을 받아 보고합니다.", "Send one summary, get a confirmation list back and report."),
  roles: tx("고객사·매니저 → 부매니저 → 팀장 → 상담사", "Client and manager → AM → TL → Agent"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("summary", "정리본 만들기", 180, 36, "Write the summary")),
      wide(node("send", "보내기", 180, 92, "Send it")),
      wide(node("confirm", "확인 명단 받기", 180, 148, "Get the confirmation list")),
      wide(node("report", "결과 보고", 180, 204, "Report the result")),
    ],
    edges: [edge("summary", "send"), edge("send", "confirm"), edge("confirm", "report")],
  },
  steps: [
    step(tx("이 절차의 목적은 고객사·매니저·회사의 지침이 모든 마켓의 상담사까지 닿았는지 확인하고, 그 결과를 매니저에게 보고하는 것입니다.", "This procedure exists to confirm that instructions from the client, the manager and the company have reached agents in every market, and to report the result to the manager."), flow, procedure, null),
    step(tx("첫 단계는 정리본 만들기입니다. 무엇이 바뀌는지, 언제부터인지, 누구에게 해당하는지, 고객에게 어떻게 안내하는지를 한 장에 적습니다. 헷갈리는 곳은 보내기 전에 정은 매니저에게 확인합니다.", "The first step is writing the summary. On one page, write what changes, from when, who it applies to and how to explain it to customers. Check anything unclear with Jeongeun before sending."), flow, ["summary"], null),
    step(tx("둘째 단계는 보내기입니다. 세 마켓 팀장에게 같은 정리본을 같은 시각에 보내고, 마켓마다 다른 점은 따로 표시합니다. 팀장은 허들과 팀 채팅방으로 상담사에게 전합니다.", "The second step is sending it. Send the same summary to all three market TLs at the same time, and mark separately what differs by market. TLs pass it on to agents in huddles and team chat."), flow, ["send"], null),
    step(tx("셋째 단계는 확인 명단 받기입니다. 팀장마다 상담사 이름, 확인 여부, 확인 방법을 적은 명단을 시행 하루 전(예시)까지 받습니다. 휴무나 휴가인 상담사는 복귀 첫 근무 전 전달 계획을 함께 받습니다.", "The third step is getting the confirmation list. From each TL, get a list of agent names, whether they've confirmed and how, by one day before it takes effect (Example). For agents on days off or leave, also get the plan for telling them before their first shift back."), flow, ["confirm"], null),
    step(tx("태오 팀장은 명단 없이 \"공지 완료\"라고만 보냈습니다. 민석은 같은 양식의 명단을 다시 요청하고, 빠진 인원이 있으면 누가 언제 전할지 정하게 합니다.", "Taeo sent only \"notice done\", with no list. Minseok asks again for the list in the same template, and if anyone is missing, has him decide who tells them and when."), flow, ["confirm"], null),
    step(tx("넷째 단계는 결과 보고입니다. 마켓별 확인 비율, 아직 못 받은 인원과 전달 계획을 정은 매니저에게 보고합니다. 매니저는 이 보고로 고객사에 준비 상황을 답합니다.", "The fourth step is reporting the result. Report to Jeongeun the confirmation rate by market, the people who haven't got it yet and the plan for them. The manager uses this report to tell the client how ready the floor is."), flow, ["report"], null),
    step(tx("시행 첫날에는 직무전문가에게서 바뀐 안내와 관련된 질문이나 실수가 있었는지 짧게 받아, 필요하면 정리본을 고쳐 다시 보냅니다.", "On the first day it takes effect, get a short note from the SMEs on any questions or mistakes about the change, and fix and resend the summary if needed."), flow, ["report"], null),
    step(tx("미소의 한마디: \"다들 알죠?\"라고 물으면 모두 고개를 끄덕여요. 이름이 적힌 명단을 받기 시작한 뒤로는 월요일 아침이 조용해졌어요.", "A word from Miso: When you ask whether everyone knows, everyone nods. Once I started getting lists with names on them, Monday mornings got quiet."), flow, ["report"], null),
  ],
  checkpoint: [
    {
      id: "instructions-q1",
      prompt: tx("태오 팀장이 확인 명단 없이 \"공지 완료\"라고만 보냈습니다. 시행은 내일입니다. 어떻게 할까요?", "Taeo sent only \"notice done\", with no confirmation list. It takes effect tomorrow. What do you do?"),
      options: [
        option("a", tx("공지를 올렸다는 말을 믿고, 미국 마켓도 전달이 끝났다고 보고한다.", "Trust that the notice went out and report that the US market is done too."), tx("공지와 확인은 다릅니다. 명단 없이 보고하면 누가 모르는지 아무도 알 수 없습니다.", "A notice is not a confirmation. Report without a list, and no one knows who's missing.")),
        option("b", tx("민석이 미국 마켓 상담사에게 직접 메시지를 보내 한 명씩 확인한다.", "Minseok messages the US market agents himself and checks them one by one."), tx("팀장을 건너뛰면 태오가 명단 받는 법을 배우지 못하고, 다음에도 같은 일이 생깁니다.", "Skipping the TL means Taeo doesn't learn to collect a list, and it happens again.")),
        option("c", tx("같은 양식의 명단을 다시 받고, 빠진 인원의 전달 계획을 정하게 한다.", "Get the list in the same template, with a plan for whoever is missing.")),
      ],
      answer: "c",
      explanation: tx("전달은 이름이 적힌 확인 명단과, 빠진 인원의 계획까지 받아야 끝납니다.", "Passing it on ends only with a list of names and a plan for the people who were missed."),
    },
    {
      id: "instructions-q2",
      prompt: tx("지침 정리본에 꼭 들어가야 하는 것은 무엇일까요?", "What must the instruction summary include?"),
      options: [
        option("a", tx("지침이 나오게 된 고객사 내부 사정과 회의 기록 전문", "The client's internal reasons for the instruction and the full notes from that meeting"), tx("배경은 필요할 때 따로 설명하면 됩니다. 상담사가 바로 쓸 수 있는 내용이 먼저입니다.", "Background can be explained separately when needed. What agents can use right away comes first.")),
        option("b", tx("바뀌는 내용, 시작일, 해당 대상, 고객 안내 방법", "What changes, the start date, who it applies to and how to explain it to customers")),
        option("c", tx("지침을 어겼을 때 받게 되는 감점과 벌칙 목록", "The list of deductions and penalties for breaking the instruction"), tx("벌칙부터 보여 주면 무엇을 해야 하는지가 묻힙니다. 바르게 안내하는 방법을 먼저 적습니다.", "Leading with penalties buries what to do. Write first how to explain it correctly.")),
      ],
      answer: "b",
      explanation: tx("정리본은 상담사가 바로 안내할 수 있게 무엇, 언제, 누구, 어떻게를 담습니다.", "The summary covers what, when, who and how, so agents can explain it right away."),
    },
  ],
  connection: { to: "escalation", text: tx("아래에서 올라오는 것도 점검합니다. 다음은 팀장의 고객사 에스컬레이션 보고 점검 절차입니다.", "What comes up from below gets checked, too. Next is the procedure for checking TLs' escalation reports to the client.") },
};
