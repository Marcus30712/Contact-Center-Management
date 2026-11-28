import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 5. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["schedule", "verify", "questions", "handover"];
const flow = ["schedule", "verify", "questions", "handover", "schedule-verify", "verify-questions", "questions-handover"];

export default {
  id: "review",
  order: 5,
  title: tx("비즈니스 리뷰 자료 준비", "Preparing Business Review Materials"),
  short: tx("리뷰 준비", "Review prep"),
  subtitle: tx("미팅 날부터 거꾸로 일정을 잡고, 숫자와 예상 질문을 준비합니다.", "Schedule backward from the meeting date, and prepare the numbers and likely questions."),
  roles: tx("팀장·WFM → 부매니저 → 매니저", "TLs and WFM → AM → Manager"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("schedule", "일정 역산", 180, 36, "Schedule backward")),
      wide(node("verify", "숫자 검증", 180, 92, "Verify the numbers")),
      wide(node("questions", "예상 질문", 180, 148, "Likely questions")),
      wide(node("handover", "넘기기", 180, 204, "Hand over")),
    ],
    edges: [edge("schedule", "verify"), edge("verify", "questions"), edge("questions", "handover")],
  },
  steps: [
    step(tx("이 절차의 목적은 WBR·MBR·QBR에서 매니저가 발표할 자료를 정해진 일정대로, 같은 기준의 숫자로 준비하는 것입니다.", "This procedure exists to prepare the materials the manager presents at the WBR, MBR and QBR on a set schedule, with numbers on the same basis."), flow, procedure, null),
    step(tx("첫 단계는 일정 역산입니다. 미팅 날부터 거꾸로 자료 요청일, 마감일, 검토일, 매니저 전달일을 정합니다. MBR이라면 사흘 전(예시) 자료 마감, 하루 전 매니저 전달처럼 매달 같게 둡니다.", "The first step is scheduling backward. Count back from the meeting date to set the request date, the due date, the review date and the date to hand it to the manager. For an MBR, keep it the same every month, such as materials due three days before (Example) and handed over the day before."), flow, ["schedule"], null),
    step(tx("민석은 팀장과 WFM 담당자에게 지난번과 같은 양식과 같은 기간 기준으로 요청합니다. 양식이 바뀌면 지난달과 비교할 수 없습니다.", "Minseok asks TLs and the WFM analyst for the same template and the same date range as last time. Change the template, and you can't compare with last month."), flow, ["schedule"], null),
    step(tx("둘째 단계는 숫자 검증입니다. 기간과 기준이 같은지, 지난 보고서와 이어지는지, 시스템 자료와 맞는지 확인합니다. 어긋난 숫자는 그 마켓 팀장과 함께 다시 계산합니다.", "The second step is verifying the numbers. Check that the range and basis are the same, that they follow on from the last report and that they match the system data. Recalculate any number that doesn't fit, together with that market's TL."), flow, ["verify"], null),
    step(tx("셋째 단계는 예상 질문입니다. 목표에서 벗어난 숫자마다 고객사가 물을 질문과 답할 사람을 적습니다. 마켓 상세 질문은 그 마켓 팀장이 답하고, 바로 답하기 어려운 질문은 미팅 뒤에 보내기로 미리 맞춥니다.", "The third step is likely questions. For each number off target, write the question the client may ask and who will answer. The market's TL answers detailed market questions, and for anything hard to answer on the spot, you agree in advance to answer after the meeting."), flow, ["questions"], null),
    step(tx("넷째 단계는 넘기기입니다. 정은 매니저에게 자료와 함께 바뀐 숫자, 질문이 나올 만한 곳, 답할 사람을 한 장으로 보냅니다.", "The fourth step is handing over. Send Jeongeun the materials along with one page on the numbers that changed, where questions are likely and who will answer."), flow, ["handover"], null),
    step(tx("미팅이 끝나면 남은 질문 목록을 만들어 담당 팀장과 기한을 정하고, 확인된 답을 매니저의 확인을 거쳐 이메일이나 채팅으로 보냅니다.", "After the meeting, list the open questions, set an owner TL and a deadline for each, and send the confirmed answers by email or chat after the manager signs off."), flow, ["handover"], null),
    step(tx("미소의 한마디: 매달 일정을 새로 잡다 보니 늘 전날 밤에 숫자를 맞췄어요. 미팅 날부터 거꾸로 날짜를 고정하고 나서야 검토할 시간이 생겼어요.", "A word from Miso: I set the schedule from scratch every month, so I was always fixing numbers the night before. Only once I fixed the dates backward from the meeting did I have time to review."), flow, ["handover"], null),
  ],
  checkpoint: [
    {
      id: "review-q1",
      prompt: tx("MBR 자료 마감일인데 유키 팀장의 자료가 지난달과 다른 양식으로 왔습니다. 어떻게 할까요?", "It's the MBR materials due date, and Yuki's data came in a different template from last month. What do you do?"),
      options: [
        option("a", tx("양식은 달라도 숫자는 있으므로 그대로 합쳐서 넘긴다.", "The numbers are there even if the template differs, so merge it as it is and hand it over."), tx("양식과 기준이 다르면 지난달과 비교할 수 없고, 고객사 앞에서 숫자가 어긋납니다.", "A different template and basis can't be compared with last month, and the numbers won't match in front of the client.")),
        option("b", tx("지난번 양식과 기준을 다시 보내, 같은 기준으로 받아 검증한다.", "Send last time's template and basis again, get it on the same basis and verify it.")),
        option("c", tx("민석이 유키 팀장의 자료를 지난달 양식에 맞춰 혼자 옮겨 적는다.", "Minseok copies Yuki's data into last month's template by himself."), tx("혼자 옮기다 기준이 틀리면 팀장도 모르는 숫자가 발표됩니다. 같은 기준으로 다시 받습니다.", "Copy it alone and get the basis wrong, and a number even the TL doesn't know gets presented. Get it again on the same basis.")),
      ],
      answer: "b",
      explanation: tx("자료는 같은 양식과 기준으로 받아야 비교하고 검증할 수 있습니다.", "Data has to come in the same template and basis before it can be compared and verified."),
    },
    {
      id: "review-q2",
      prompt: tx("미팅에서 바로 답하지 못한 고객사 질문은 어떻게 할까요?", "What do you do with client questions that couldn't be answered in the meeting?"),
      options: [
        option("a", tx("다음 달 미팅 자료에 넣어, 그 자리에서 함께 자세히 답한다.", "Put them in next month's meeting materials and answer them in detail then."), tx("한 달을 기다리면 고객사의 판단이 늦어집니다.", "Wait a month, and the client's decisions are held up.")),
        option("b", tx("담당과 기한을 정해 확인하고, 매니저 확인 뒤 보낸다.", "Set an owner and a deadline, confirm, and send it once the manager signs off.")),
        option("c", tx("질문한 고객사 담당자에게 민석이 바로 전화해 아는 만큼 답한다.", "Minseok calls the client contact who asked right away and answers as far as he knows at that moment."), tx("확인 없이 답하면 매니저가 말한 것과 어긋날 수 있습니다.", "Answer without checking, and it may clash with what the manager said.")),
      ],
      answer: "b",
      explanation: tx("남은 질문은 담당과 기한을 정해 확인하고, 매니저 확인을 거쳐 미팅 뒤에 보냅니다.", "Open questions get an owner and a deadline, and go out after the meeting once the manager signs off."),
    },
  ],
  connection: { to: "requests", text: tx("미팅 밖에서도 고객사의 요청은 옵니다. 다음은 고객사 요청 정보 취합 절차입니다.", "Client requests come outside meetings, too. Next is the procedure for gathering information the client requests.") },
};
