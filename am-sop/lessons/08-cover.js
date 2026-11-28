import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 8. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["scope", "log", "check", "handback"];
const flow = ["scope", "log", "check", "handback", "scope-log", "log-check", "check-handback"];

export default {
  id: "cover",
  order: 8,
  title: tx("매니저 대행 인수인계", "Covering for the Manager and Handing Back"),
  short: tx("매니저 대행", "Manager cover"),
  subtitle: tx("대행 범위를 정해 받고, 대행 기록을 남겨 돌려줍니다.", "Agree the scope of cover, keep a cover log and hand it back."),
  roles: tx("매니저 → 부매니저 → 매니저", "Manager → AM → Manager"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("scope", "범위 정하기", 180, 36, "Set the scope")),
      wide(node("log", "대행 기록", 180, 92, "Cover log")),
      wide(node("check", "확인 뒤 답하기", 180, 148, "Check, then answer")),
      wide(node("handback", "돌려주기", 180, 204, "Hand back")),
    ],
    edges: [edge("scope", "log"), edge("log", "check"), edge("check", "handback")],
  },
  steps: [
    step(tx("이 절차의 목적은 매니저가 자리를 비우는 동안 정해진 범위 안에서 대신하고, 그동안의 일을 빠짐없이 돌려주는 것입니다.", "This procedure exists to cover for the manager within an agreed scope while she's away, and to hand back everything that happened in that time."), flow, procedure, null),
    step(tx("첫 단계는 범위 정하기입니다. 정은 매니저의 휴가 전에 민석이 정해도 되는 것, 매니저에게 물어야 하는 것, 긴급할 때 연락 방법을 한 장에 적어 둘이 함께 확인합니다.", "The first step is setting the scope. Before Jeongeun's leave, Minseok writes on one page what he may decide, what he must ask the manager and how to reach her in an emergency, and the two of them go through it."), flow, ["scope"], null),
    step(tx("손익과 계약의 결정은 대행 범위에 넣지 않습니다. 인력 계획, SLA 관리, 위기 대응은 매니저와 미리 정한 범위 안에서 민석이 대행할 수 있습니다. 범위 밖의 질문은 확인할 날짜를 정해 답합니다.", "P&L and contract decisions stay outside the scope of cover. Staffing plans, SLA management and crisis response can be covered by Minseok within the scope agreed in advance with the manager. Questions outside the scope get an answer on a set date after checking."), flow, ["scope"], null),
    step(tx("둘째 단계는 대행 기록입니다. 고객사 미팅, 받은 요청, 민석이 정한 것, 매니저에게 물은 것을 날짜별로 한 문서에 적습니다.", "The second step is the cover log. In one document, by date, write down client meetings, requests received, what Minseok decided and what he asked the manager."), flow, ["log"], null),
    step(tx("셋째 단계는 확인 뒤 답하기입니다. 범위 밖의 질문은 그날 안에 요점을 매니저에게 보내고, 답을 받아 약속한 날 고객사에 전합니다.", "The third step is checking, then answering. For questions outside the scope, send the key points to the manager that day, get her answer and give it to the client on the promised date."), flow, ["check"], null),
    step(tx("고객사 미팅에는 마켓 팀장들과 함께 들어갑니다. 대행 중 위기가 생기면 정해 둔 위기 대응 절차대로 먼저 움직이고, 매니저에게 요점을 바로 알립니다.", "Minseok goes into client meetings with the market team leaders. If a crisis hits during the cover, he acts first on the agreed crisis response procedure and tells the manager the key points right away."), flow, ["check"], null),
    step(tx("넷째 단계는 돌려주기입니다. 매니저가 돌아온 날 대행 기록을 넘기며 새로 한 약속, 남은 질문, 매니저가 정해야 할 일을 짚습니다.", "The fourth step is handing back. On the day the manager returns, hand over the cover log and point out the new commitments, open questions and what the manager needs to decide."), flow, ["handback"], null),
    step(tx("미소의 한마디: 대행이 끝나고 기억으로만 설명했더니 매니저가 고객사와 다른 이야기를 할 뻔했어요. 날짜별 기록 하나가 그날을 살렸어요.", "A word from Miso: When my cover ended, I explained from memory, and the manager nearly told the client something different. One log by date saved the day."), flow, ["handback"], null),
  ],
  checkpoint: [
    {
      id: "cover-q1",
      prompt: tx("대행 중 고객사가 다음 분기 계약 단가를 조정할 수 있느냐고 묻습니다. 어떻게 할까요?", "During the cover, the client asks whether next quarter's contract rate can be adjusted. What do you do?"),
      options: [
        option("a", tx("고객사와의 관계를 생각해 조정할 수 있다고 먼저 답해 둔다.", "With the client relationship in mind, answer first that it can be adjusted."), tx("계약과 단가는 손익이 걸린 매니저의 결정입니다. 대행이 약속하면 되돌리기 어렵습니다.", "Contracts and rates are the manager's decision, with P&L at stake. Promise it while covering, and it's hard to take back.")),
        option("b", tx("대행 범위 밖이라 매니저와 확인해, 정한 날까지 답하겠다고 한다.", "It's outside the scope of cover, so check with the manager and answer by a set date.")),
        option("c", tx("대행 기간이라 답할 수 없다며 매니저가 돌아오면 다시 물어 달라고 한다.", "You can't answer during the cover, so ask them to raise it again when the manager is back."), tx("기다리게만 하면 고객사의 계획이 늦어집니다. 확인할 날짜를 정해 답할 수 있습니다.", "Just making them wait holds up the client's plans. You can set a date and answer after checking.")),
      ],
      answer: "b",
      explanation: tx("범위 밖의 결정은 약속하지 않고, 매니저와 확인할 날짜를 정해 답합니다.", "Don't promise decisions outside the scope; set a date to check with the manager and answer."),
    },
    {
      id: "cover-q2",
      prompt: tx("매니저가 돌아왔을 때 대행을 가장 잘 돌려주는 방법은 무엇일까요?", "When the manager is back, what is the best way to hand back the cover?"),
      options: [
        option("a", tx("큰일이 없었으므로 \"별일 없었습니다\"라고 짧게 말한다.", "Nothing big happened, so just say briefly, \"Nothing much.\""), tx("작아 보여도 고객사와의 약속이 있었다면 매니저가 알아야 합니다.", "Even if it seems small, the manager needs to know about any commitment made to the client.")),
        option("b", tx("매니저가 궁금한 것을 물어볼 때마다 기억나는 대로 답한다.", "Answer from memory whenever the manager asks about something that happened."), tx("기억에 기대면 빠지는 것이 생깁니다.", "Rely on memory, and things get missed.")),
        option("c", tx("날짜별 대행 기록을 넘기며 새 약속과 남은 질문을 짚는다.", "Hand over the dated cover log and point out new commitments and open questions.")),
      ],
      answer: "c",
      explanation: tx("날짜별 기록으로 돌려주면 매니저가 빠짐없이 이어받습니다.", "Handing back with a log by date lets the manager pick up everything."),
    },
  ],
  connection: { to: "home", text: tx("부매니저 SOP 라이브러리를 마쳤습니다. 절차가 헷갈리는 날에는 목록으로 돌아와 그 SOP를 다시 펼쳐 보세요.", "You've finished the AM SOP Library. On days a procedure gets confusing, come back to the list and open that SOP again.") },
};
