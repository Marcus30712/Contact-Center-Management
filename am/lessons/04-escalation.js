import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 4. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["flow", "sort", "check", "record"];
const flow = ["flow", "sort", "check", "record", "flow-sort", "sort-check", "check-record"];

export default {
  id: "escalation",
  order: 4,
  title: tx("에스컬레이션 보고 점검", "Checking Escalation Reports"),
  short: tx("보고 점검", "Escalations"),
  subtitle: tx("자체 해결 건과 고객사 보고 건을 나누고, 팀장의 보고를 점검합니다.", "Separate what the center can solve from what goes to the client, and check the Team Leaders' reports."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("flow", "모이는 길", 180, 36, "How cases flow")),
      wide(node("sort", "나누기", 180, 92, "Sort")),
      wide(node("check", "점검하기", 180, 148, "Check")),
      wide(node("record", "남기기", 180, 204, "Keep records")),
    ],
    edges: [edge("flow", "sort"), edge("sort", "check"), edge("check", "record")],
  },
  steps: [
    step(tx("이 레슨의 목적은 에스컬레이션이 어떤 길로 고객사까지 가는지 알고, 팀장이 보내는 보고를 점검하는 것입니다.", "This lesson is about knowing how escalations reach the client, and checking the reports TLs send."), flow, procedure, null),
    step(tx("상담사가 받은 에스컬레이션과 고객 클레임은 직무전문가가 모아 팀장에게 보고합니다. 팀장은 메일로, 또는 고객사와 정한 주기에 맞춰 고객사에 보고하고 처리합니다.", "Escalations agents receive and customer complaints are gathered by the SME and reported to the TL. The TL reports them to the client by email, or at the interval agreed with the client, and handles them."), flow, [], null),
    step(tx("첫 단계는 모이는 길 알기입니다. 한국 마켓에서는 하린이 매일 저녁(예시) 그날의 건을 모아 수진 팀장에게 보냅니다. 민석은 세 마켓의 정리본을 함께 받아 봅니다.", "The first stage is knowing how cases flow. In the Korean market, Harin gathers the day's cases every evening (Example) and sends them to Sujin. Minseok receives all three markets' summaries."), flow, ["flow"], null),
    step(tx("둘째 단계는 나누기입니다. 센터 안에서 해결할 수 있는 건과 고객사의 판단이나 조치가 필요한 건을 나눕니다. 정책 예외, 시스템 오류, 개인정보 관련 건처럼 고객사에 보고해야 하는 기준은 고객사와 정한 대로 따릅니다.", "The second stage is sorting. Cases the center can resolve itself are separated from cases that need the client's decision or action. What must go to the client, such as policy exceptions, system errors and personal data issues, follows what was agreed with the client."), flow, ["sort"], null),
    step(tx("셋째 단계는 점검하기입니다. 민석은 팀장의 보고에 고객 정보, 일어난 일, 지금까지 한 조치, 고객사에 요청하는 것이 빠짐없이 들어갔는지 봅니다. 같은 문제가 여러 마켓에서 나오면 따로따로가 아니라 묶어서 보고하게 합니다.", "The third stage is checking. Minseok checks that a TL's report covers the customer details, what happened, what has been done so far and what is being asked of the client. If the same problem shows up in several markets, he has them reported together rather than one by one."), flow, ["check"], null),
    step(tx("고객사에 보고해야 할 건이 자체 해결로 분류되어 있으면, 민석은 보내기 전에 팀장과 함께 다시 분류합니다. 고객사 보고가 늦어질 만한 큰 건은 정은 매니저에게도 바로 알립니다.", "If a case that should go to the client is marked as solved in-house, he re-sorts it with the TL before it goes out. A big case that might be reported late he also flags to Jeongeun right away."), flow, ["check"], null),
    step(tx("넷째 단계는 남기기입니다. 보고한 건과 고객사의 답, 처리 결과를 마켓별 기록에 남겨, 다음 비즈니스 리뷰에서 숫자와 사례로 쓸 수 있게 합니다.", "The fourth stage is keeping records. Reported cases, the client's replies and the outcomes go into each market's record, ready to use as numbers and examples at the next business review."), flow, ["record"], null),
    step(tx("미소의 한마디: 팀장 보고를 하나하나 고쳐 주다 보니 제가 병목이 됐어요. 보고에 꼭 들어갈 네 가지를 정해 두니, 팀장들이 스스로 채워 오더라고요.", "A word from Miso: I fixed every TL's report myself and became the bottleneck. Once I set four things every report must include, the TLs filled them in on their own."), flow, ["record"], null),
  ],
  checkpoint: [
    {
      id: "escalation-q1",
      prompt: tx("일본과 미국 마켓에서 같은 결제 오류 클레임이 각각 들어와, 두 팀장이 고객사에 따로 보고하려고 합니다. 어떻게 할까요?", "The same payment error complaint comes in from the Japanese and US markets, and the two TLs plan to report it to the client separately. What does Minseok do?"),
      options: [
        option("a", tx("같은 문제로 묶어 한 번에 보고하게 하고, 정은 매니저에게도 알린다.", "Have it reported once as one problem, and let Jeongeun know too.")),
        option("b", tx("마켓마다 담당 팀장이 다르므로 각자 보고하게 두고, 민석은 결과만 받아 본다.", "Each market has its own TL, so let them report separately and just receive the results."), tx("따로 보고하면 고객사는 같은 문제를 두 번 받고, 규모를 작게 보게 됩니다.", "Separate reports mean the client gets the same problem twice and sees it as smaller than it is.")),
        option("c", tx("고객사에 보고하기 전에 센터 안에서 먼저 원인을 다 찾아낸다.", "Find the full cause inside the center first, before reporting it to the client."), tx("시스템 오류는 고객사의 조치가 필요합니다. 원인을 다 찾을 때까지 기다리면 보고가 늦어집니다.", "A system error needs the client's action. Waiting until you find the full cause makes the report late.")),
      ],
      answer: "a",
      explanation: tx("여러 마켓에서 같은 문제가 나오면 묶어서 보고하고, 큰 건은 매니저에게도 알립니다.", "When the same problem appears in several markets, report it together, and let the manager know about big cases."),
    },
    {
      id: "escalation-q2",
      prompt: tx("팀장의 에스컬레이션 보고를 점검할 때 꼭 들어가 있어야 하는 것은 무엇일까요?", "What must be in a TL's escalation report when Minseok checks it?"),
      options: [
        option("a", tx("담당 상담사의 이름과 그 상담사의 지난달 품질 점수, 근태 기록", "The agent's name, their quality score last month and their attendance record"), tx("상담사 평가는 고객사 보고의 목적이 아닙니다. 일어난 일과 필요한 조치가 먼저입니다.", "Rating the agent isn't the purpose of a client report. What happened and what's needed come first.")),
        option("b", tx("팀장의 의견과 고객이 얼마나 화가 났는지에 대한 묘사", "The TL's opinion and a description of how angry the customer was"), tx("감정 묘사보다 사실과 조치가 있어야 고객사가 판단할 수 있습니다.", "The client needs facts and actions, not a description of feelings, to make a decision.")),
        option("c", tx("고객 정보, 일어난 일, 지금까지의 조치, 고객사에 요청하는 것", "Customer details, what happened, what's been done so far, and what's asked of the client")),
      ],
      answer: "c",
      explanation: tx("고객사가 바로 판단할 수 있게, 사실과 조치와 요청을 빠짐없이 담습니다.", "Include the facts, the actions and the request in full so the client can decide right away."),
    },
  ],
  connection: { to: "review", text: tx("이렇게 모인 숫자와 사례는 비즈니스 리뷰로 이어집니다. 리뷰 자료를 준비합니다.", "These numbers and cases lead into the business review. Next, preparing the review materials.") },
};
