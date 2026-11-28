import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 5. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["gather", "verify", "story", "handover"];
const flow = ["gather", "verify", "story", "handover", "gather-verify", "verify-story", "story-handover"];

export default {
  id: "review",
  order: 5,
  title: tx("비즈니스 리뷰 자료와 숫자 준비", "Preparing Business Review Materials and Numbers"),
  short: tx("리뷰 준비", "Review prep"),
  subtitle: tx("WBR·MBR·QBR 자료를 만들고, 숫자를 검증해 매니저에게 넘깁니다.", "Build the WBR, MBR and QBR materials, check the numbers and hand them to the manager."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("gather", "모으기", 180, 36, "Gather")),
      wide(node("verify", "검증하기", 180, 92, "Check")),
      wide(node("story", "이야기 만들기", 180, 148, "Tell the story")),
      wide(node("handover", "넘기기", 180, 204, "Hand over")),
    ],
    edges: [edge("gather", "verify"), edge("verify", "story"), edge("story", "handover")],
  },
  steps: [
    step(tx("이 레슨의 목적은 비즈니스 리뷰 미팅에서 매니저가 발표할 자료와 숫자를 준비하는 것입니다.", "This lesson is about preparing the materials and numbers the manager presents at business review meetings."), flow, procedure, null),
    step(tx("비즈니스 리뷰는 고객사가 참석하는 미팅으로, 매주(WBR), 매달(MBR), 분기마다(QBR) 열립니다. 발표는 정은 매니저가 하고, 마켓별 상세 질문에는 그 자리에 함께한 마켓 팀장이 답합니다.", "Business reviews are meetings the client attends, held weekly (WBR), monthly (MBR) and quarterly (QBR). Jeongeun presents, and the market TLs in the room answer detailed questions about their markets."), flow, [], null),
    step(tx("첫 단계는 모으기입니다. 민석은 미팅 사흘 전(예시)까지 마켓별 지표, 에스컬레이션 기록, 인원 현황을 팀장들과 WFM 담당자에게서 받습니다.", "The first stage is gathering. By three days (Example) before the meeting, Minseok collects each market's metrics, escalation records and headcount from the TLs and the WFM team."), flow, ["gather"], null),
    step(tx("둘째 단계는 검증하기입니다. 숫자가 지난 보고서와 이어지는지, 기간과 기준이 같은지, 시스템 자료와 맞는지 확인합니다. 유키 팀장의 표에서 기간이 한 주 어긋난 것을 찾아, 유키 팀장과 함께 다시 계산합니다.", "The second stage is checking. He checks that the numbers continue from the last report, use the same period and definitions, and match the system data. He finds that Yuki's table is off by a week, and recalculates it with her."), flow, ["verify"], null),
    step(tx("셋째 단계는 이야기 만들기입니다. 숫자만 나열하지 않고, 무엇이 좋아졌고 무엇이 나빠졌는지, 그 원인과 다음 조치를 한 장에 한 가지씩 담습니다.", "The third stage is telling the story. He doesn't just list numbers, but puts one point per page: what improved, what got worse, why, and the next step."), flow, ["story"], null),
    step(tx("고객사가 물을 만한 질문을 미리 적고, 마켓 팀장마다 답할 준비를 하게 합니다. 바로 답하기 어려운 질문은 미팅 뒤 확인해서 보내도 된다는 것을 팀장들과 미리 맞춥니다.", "He writes down the questions the client is likely to ask, and has each market TL ready to answer. He agrees with the TLs in advance that questions they can't answer on the spot can be checked and sent after the meeting."), flow, ["story"], null),
    step(tx("넷째 단계는 넘기기입니다. 미팅 전날까지 정은 매니저에게 자료와 함께 숫자가 바뀐 곳, 질문이 나올 만한 곳을 짧게 보고합니다.", "The fourth stage is handing over. By the day before the meeting, he gives Jeongeun the materials with a short note on which numbers changed and where questions are likely."), flow, ["handover"], null),
    step(tx("미소의 한마디: 고객사 앞에서 매니저가 틀린 숫자를 말하게 만든 적이 있어요. 그날부터 기간과 기준이 같은지부터 확인해요.", "A word from Miso: I once had a manager quote a wrong number in front of the client. From that day, the first thing I check is whether the period and definitions match."), flow, ["handover"], null),
  ],
  checkpoint: [
    {
      id: "review-q1",
      prompt: tx("MBR 자료를 검증하다가, 일본 마켓의 응대율이 지난 보고서와 다른 기간으로 계산된 것을 발견했습니다. 미팅은 이틀 뒤입니다. 어떻게 할까요?", "While checking the MBR materials, Minseok finds that the Japanese market's answer rate was calculated over a different period from the last report. The meeting is in two days. What does he do?"),
      options: [
        option("a", tx("차이가 크지 않아 보이므로 그대로 두고 매니저에게만 알린다.", "Leave it as is because the gap looks small, and only tell the manager."), tx("기간이 다르면 지난달과 비교할 수 없습니다. 작아 보여도 고객사는 바로 알아챕니다.", "With a different period you can't compare with last month. Even a small gap, the client notices right away.")),
        option("b", tx("유키 팀장과 같은 기간으로 다시 계산하고, 바뀐 곳을 매니저에게 보고한다.", "Recalculate with Yuki over the same period, and report what changed to the manager.")),
        option("c", tx("팀장에게 다시 묻지 않고, 민석이 직접 기간을 고친 숫자로 바꿔 넣고 넘어간다.", "Without checking with the TL again, swap in his own figure with the period fixed and move on."), tx("팀장 모르게 바꾸면 미팅에서 팀장의 답과 자료가 어긋납니다.", "Changing it without the TL knowing means their answers in the meeting won't match the materials.")),
      ],
      answer: "b",
      explanation: tx("숫자는 같은 기준으로 다시 맞추고, 바뀐 곳을 팀장과 매니저 모두 알게 합니다.", "Bring the numbers back to the same definitions, and make sure both the TL and the manager know what changed."),
    },
    {
      id: "review-q2",
      prompt: tx("비즈니스 리뷰 미팅에서 고객사가 미국 마켓의 이탈률을 자세히 묻습니다. 누가 어떻게 답할까요?", "At the business review, the client asks in detail about the US market's attrition. Who answers, and how?"),
      options: [
        option("a", tx("모든 질문에는 매니저가 답해야 한다며 정은 매니저가 즉석에서 답한다.", "Jeongeun answers on the spot, insisting the manager must answer every question."), tx("마켓의 상세 사정은 그 마켓 팀장이 가장 잘 압니다. 매니저 혼자 답하면 틀릴 수 있습니다.", "The market's TL knows its details best. A manager answering alone can get it wrong.")),
        option("b", tx("자료에 없는 질문이라 충분히 준비해서 다음 달 미팅에서 다루자고 정중하게 미룬다.", "It isn't in the materials, so politely suggest covering it at next month's meeting after preparing properly."), tx("다음 미팅까지 미루면 고객사의 판단이 늦어집니다. 확인해서 미팅 뒤에 바로 보낼 수 있습니다.", "Waiting until the next meeting delays the client's decisions. You can check and send it right after the meeting.")),
        option("c", tx("미국 마켓 팀장이 답하고, 바로 답하기 어려우면 확인 뒤 미팅이 끝나고 보낸다.", "The US market TL answers, and if it can't be answered right away, it's checked and sent after the meeting.")),
      ],
      answer: "c",
      explanation: tx("발표는 매니저가, 마켓 상세 질문은 그 마켓 팀장이 답하고, 남은 질문은 미팅 뒤 이메일이나 채팅으로 보냅니다.", "The manager presents, the market TL answers market details, and open questions go out by email or chat after the meeting."),
    },
  ],
  connection: { to: "requests", text: tx("미팅 밖에서도 고객사의 요청은 수시로 옵니다. 요청 정보를 모아 전달하는 법을 봅니다.", "Outside meetings, client requests come in all the time. Next, gathering and sending requested information.") },
};
