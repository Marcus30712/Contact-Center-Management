import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 3. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["category", "content", "combine", "record"];
const flow = ["category", "content", "combine", "record", "category-content", "content-combine", "combine-record"];

export default {
  id: "escalation",
  order: 3,
  title: tx("에스컬레이션 보고 점검", "Checking Escalation Reports"),
  short: tx("보고 점검", "Report check"),
  subtitle: tx("분류와 보고 내용을 점검하고, 여러 마켓의 같은 문제는 묶습니다.", "Check the category and content of each report, and combine the same problem across markets."),
  roles: tx("직무전문가 → 팀장 → 고객사 (부매니저 점검)", "SME → TL → Client (AM checks)"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("category", "분류 확인", 180, 36, "Check the category")),
      wide(node("content", "내용 점검", 180, 92, "Check the content")),
      wide(node("combine", "묶음 판단", 180, 148, "Decide on combining")),
      wide(node("record", "기록 남기기", 180, 204, "Keep a record")),
    ],
    edges: [edge("category", "content"), edge("content", "combine"), edge("combine", "record")],
  },
  steps: [
    step(tx("이 절차의 목적은 팀장이 고객사에 보내는 에스컬레이션 보고가 바르게 분류되고, 빠짐없이 쓰였는지 점검하는 것입니다.", "This procedure exists to check that the escalation reports TLs send to the client are correctly categorized and complete."), flow, procedure, null),
    step(tx("직무전문가가 상담사의 에스컬레이션과 고객 클레임을 모아 팀장에게 보고하고, 팀장은 메일이나 고객사와 정한 주기로 고객사에 보고합니다. 팀장이 고객사에 보내기 전에, 민석은 그 보고를 매일 저녁(예시) 함께 받아 봅니다.", "SMEs gather agents' escalations and customer complaints and report them to the TL, who reports to the client by email or at the interval agreed with the client. Minseok sees those reports every evening (Example) before they go to the client."), flow, [], null),
    step(tx("첫 단계는 분류 확인입니다. 센터 안에서 해결할 건과 고객사에 보고할 건이 고객사와 정한 기준대로 나뉘었는지 봅니다. 정책 예외, 시스템 오류, 개인정보 관련 건은 대개 고객사 보고 건입니다.", "The first step is checking the category. See whether cases solved in-house and cases reported to the client were split by the criteria agreed with the client. Policy exceptions, system errors and personal data cases usually go to the client."), flow, ["category"], null),
    step(tx("둘째 단계는 내용 점검입니다. 고객 정보, 일어난 일, 지금까지의 조치, 고객사에 요청하는 것이 모두 들어갔는지 봅니다. 빠진 것이 있으면 민석이 고치지 않고 팀장에게 돌려보냅니다.", "The second step is checking the content. See whether the customer details, what happened, what's been done so far and what's being asked of the client are all there. If anything is missing, Minseok doesn't fix it but sends it back to the TL."), flow, ["content"], null),
    step(tx("셋째 단계는 묶음 판단입니다. 같은 문제가 두 마켓 이상에서 나오면 따로 보고하지 않고 한 건으로 묶어 규모와 함께 보고하게 합니다. 시스템 오류처럼 큰 건은 정은 매니저에게도 바로 알립니다.", "The third step is deciding on combining. When the same problem comes up in two or more markets, have it reported as one case with its scale rather than separately. Big cases such as system errors also go straight to Jeongeun."), flow, ["combine"], null),
    step(tx("하린이 올린 한국 마켓 건 중 개인정보 관련 건이 자체 해결로 분류되어 있었습니다. 민석은 수진 팀장과 기준을 다시 보고 고객사 보고 건으로 옮기게 합니다.", "Among the Korean market cases Harin raised, one involving personal data was marked as solved in-house. Minseok reviews the criteria again with Sujin and has it moved to a client report."), flow, ["combine"], null),
    step(tx("넷째 단계는 기록 남기기입니다. 보고한 건, 고객사의 답, 처리 결과와 걸린 시간을 마켓별 기록에 남깁니다. 이 기록은 비즈니스 리뷰의 숫자와 사례가 됩니다.", "The fourth step is keeping a record. In each market's record, note the cases reported, the client's answers, the outcome and how long it took. This record becomes the numbers and examples for business reviews."), flow, ["record"], null),
    step(tx("미소의 한마디: 보고서를 제가 고쳐서 보내 주다 보니 팀장들은 무엇이 틀렸는지 몰랐어요. 돌려보내며 빠진 항목만 짚어 주니 두 달 만에 고칠 게 거의 없어졌어요.", "A word from Miso: I used to fix reports and send them myself, so the TLs never knew what was wrong. Once I sent them back pointing only at what was missing, within two months there was almost nothing left to fix."), flow, ["record"], null),
  ],
  checkpoint: [
    {
      id: "escalation-q1",
      prompt: tx("수진 팀장의 보고에 \"고객사에 요청하는 것\"이 빠져 있습니다. 보고 마감까지 한 시간(예시) 남았습니다. 어떻게 할까요?", "Sujin's report is missing \"what's being asked of the client\". The report is due in an hour (Example). What do you do?"),
      options: [
        option("a", tx("시간이 없으므로 민석이 요청 사항을 직접 써 넣어 보낸다.", "Time is short, so Minseok writes in the request himself and sends it on before the deadline."), tx("대신 고치면 팀장은 무엇이 빠졌는지 모른 채 다음에도 같은 보고를 씁니다.", "Fix it for her, and the TL writes the same report next time without knowing what was missing.")),
        option("b", tx("빠진 항목을 짚어 수진 팀장에게 돌려보내고, 마감 안에 다시 받는다.", "Point out the missing part, send it back to Sujin and get it again before it's due.")),
        option("c", tx("요청 사항은 고객사가 알아서 판단하도록 그대로 보내게 한다.", "Send it as it is and let the client work out what's being requested."), tx("요청이 없으면 고객사는 무엇을 해야 하는지 몰라 다시 묻게 되고, 처리가 늦어집니다.", "Without a request, the client doesn't know what to do, asks again and the case slows down.")),
      ],
      answer: "b",
      explanation: tx("빠진 항목은 짚어서 팀장에게 돌려보내, 팀장이 직접 채우게 합니다.", "Point out what's missing and send it back, so the TL fills it in herself."),
    },
    {
      id: "escalation-q2",
      prompt: tx("고객사 보고 건인지 자체 해결 건인지는 무엇으로 정할까요?", "What decides whether a case is a client report or solved in-house?"),
      options: [
        option("a", tx("그 건을 처리한 팀장이 상황을 보고 그때그때 정한다.", "The TL who handled it judges the situation case by case."), tx("팀장마다 판단이 달라지면 마켓마다 보고 기준이 어긋납니다.", "If each TL judges differently, reporting drifts apart across markets.")),
        option("b", tx("고객이 얼마나 화가 났는지를 보고 정한다.", "How angry the customer was."), tx("고객의 감정은 중요하지만, 보고 여부는 정해진 기준으로 나눠야 빠지는 건이 없습니다.", "The customer's feelings matter, but set criteria are what keep cases from slipping through.")),
        option("c", tx("고객사와 미리 정한 보고 기준에 따라 정한다.", "The reporting criteria agreed with the client in advance.")),
      ],
      answer: "c",
      explanation: tx("분류는 고객사와 정한 기준을 따릅니다. 그래야 마켓마다 같은 기준으로 보고합니다.", "Categories follow the criteria agreed with the client, so every market reports the same way."),
    },
  ],
  connection: { to: "risk", text: tx("점검하다 보면 아직 터지지 않은 위험도 보입니다. 다음은 리스크 관리 대장 절차입니다.", "Checking reports, you also spot risks that haven't happened yet. Next is the risk register procedure.") },
};
