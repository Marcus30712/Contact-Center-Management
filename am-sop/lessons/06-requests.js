import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 6. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["pin", "template", "review", "send"];
const flow = ["pin", "template", "review", "send", "pin-template", "template-review", "review-send"];

export default {
  id: "requests",
  order: 6,
  title: tx("고객사 요청 정보 취합", "Gathering Information the Client Requests"),
  short: tx("요청 취합", "Client requests"),
  subtitle: tx("요청을 정리해 모으고, 개인정보를 걸러 매니저 확인 뒤 전달합니다.", "Pin down the request, gather it, filter out personal data and pass it on after the manager signs off."),
  roles: tx("고객사 → 매니저 → 부매니저 → 팀장", "Client → Manager → AM → TL"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("pin", "요청 정리", 180, 36, "Pin down the request")),
      wide(node("template", "양식과 마감", 180, 92, "Template and deadline")),
      wide(node("review", "검토", 180, 148, "Review")),
      wide(node("send", "확인 뒤 전달", 180, 204, "Send after sign-off")),
    ],
    edges: [edge("pin", "template"), edge("template", "review"), edge("review", "send")],
  },
  steps: [
    step(tx("이 절차의 목적은 고객사가 요청한 정보를 팀장들에게서 모아, 매니저의 확인을 거쳐 정해진 경로로 전달하는 것입니다.", "This procedure exists to gather the information the client requests from TLs and send it through the agreed channel after the manager signs off."), flow, procedure, null),
    step(tx("첫 단계는 요청 정리입니다. 무엇을, 어느 기간으로, 어떤 형식으로, 언제까지 원하는지 적습니다. 모호하면 추측하지 않고 매니저를 통해 고객사에 먼저 묻습니다.", "The first step is pinning down the request. Write down what they want, for what period, in what form and by when. If it's unclear, don't guess; ask the client first through the manager."), flow, ["pin"], null),
    step(tx("둘째 단계는 양식과 마감입니다. 민석은 세 마켓 팀장에게 같은 양식을 보내고, 마감은 고객사 기한보다 하루(예시) 앞으로 같은 날에 둡니다.", "The second step is the template and deadline. Minseok sends the same template to all three market TLs, with one shared deadline a day (Example) before the client's."), flow, ["template"], null),
    step(tx("셋째 단계는 검토입니다. 숫자의 기간과 기준이 같은지, 사례에 정해진 범위를 넘는 개인정보가 없는지 봅니다. 유키 팀장의 사례에 고객 이름이 남아 있어 지워서 다시 보내 달라고 합니다.", "The third step is reviewing. Check that the numbers share the same range and basis, and that the examples carry no personal data beyond the set scope. A customer's name is left in one of Yuki's examples, so he asks Yuki to remove it and send it again."), flow, ["review"], null),
    step(tx("넷째 단계는 확인 뒤 전달입니다. 하나로 묶은 자료를 정은 매니저에게 보내 확인을 받습니다. 매니저가 자리에 없으면 메신저나 메일로 요점을 보내 확인을 받습니다.", "The fourth step is sending after sign-off. Send the combined materials to Jeongeun for sign-off. If the manager is away, send the key points by messenger or email and get sign-off that way."), flow, ["send"], null),
    step(tx("확인을 받은 자료는 고객사와 정한 경로로 보내고, 보낸 내용과 시각을 요청 기록에 남깁니다.", "Send the signed-off materials through the channel agreed with the client, and note what was sent and when in the request record."), flow, ["send"], null),
    step(tx("같은 요청이 매달 되풀이되면 양식을 고정해 두고, 팀장들에게 미리 알려 매달 같은 날 받습니다.", "If the same request comes every month, fix the template and tell TLs in advance, so it arrives on the same day every month."), flow, ["send"], null),
    step(tx("미소의 한마디: 급해서 매니저 확인 없이 보냈다가 고객사에 두 가지 숫자가 간 적이 있어요. 아무리 급해도 확인 한 번은 꼭 받으세요.", "A word from Miso: I once sent something in a hurry without the manager's sign-off, and the client got two different numbers. However urgent it is, always get one sign-off."), flow, ["send"], null),
  ],
  checkpoint: [
    {
      id: "requests-q1",
      prompt: tx("고객사가 \"지난달 환불 문의 자료\"를 요청했는데, 건수인지 사례인지 분명하지 않습니다. 어떻게 할까요?", "The client asked for \"last month's refund inquiry data\", and it's not clear whether they mean counts or examples. What do you do?"),
      options: [
        option("a", tx("둘 다 필요할 것이므로 세 마켓에서 건수와 사례를 모두 모아 보낸다.", "They'll probably need both, so gather counts and examples from all three markets and send them."), tx("필요 없는 자료까지 모으면 팀장들의 시간을 쓰고, 개인정보가 섞일 위험도 커집니다.", "Gathering what isn't needed takes TLs' time and raises the chance of personal data slipping in.")),
        option("b", tx("매니저를 통해 고객사에 먼저 묻고, 정해진 형식으로 요청한다.", "Ask the client first through the manager, and request it in the agreed form.")),
        option("c", tx("지난번 비슷한 요청 때 보낸 자료와 같은 형식으로 알아서 모은다.", "Gather it in the same form as for a similar request last time."), tx("지난번과 요청이 다를 수 있습니다. 모호하면 먼저 확인합니다.", "This request may differ from the last one. If it's unclear, check first.")),
      ],
      answer: "b",
      explanation: tx("모호한 요청은 추측하지 않고, 매니저를 통해 먼저 확인합니다.", "Don't guess at an unclear request; check first through the manager."),
    },
    {
      id: "requests-q2",
      prompt: tx("모은 자료를 검토할 때 무엇을 꼭 확인해야 할까요?", "What must you check when reviewing the gathered data?"),
      options: [
        option("a", tx("팀장마다 자료를 꾸민 방식이 보기 좋고 읽기 편한지", "Whether each TL's layout looks good and reads easily"), tx("모양보다 내용이 먼저입니다.", "Content comes before looks.")),
        option("b", tx("세 마켓의 숫자가 서로 비슷한 수준으로 나왔는지", "Whether the three markets' numbers came out at a similar level"), tx("마켓마다 숫자가 다를 수 있습니다. 같은 기준으로 계산했는지가 중요합니다.", "Markets can differ. What matters is that they were calculated on the same basis.")),
        option("c", tx("같은 기간과 기준인지, 범위를 넘는 개인정보가 없는지", "Same range and basis, and no personal data beyond scope")),
      ],
      answer: "c",
      explanation: tx("같은 기준의 숫자인지, 개인정보가 걸러졌는지 확인한 뒤 매니저에게 올립니다.", "Check that the numbers share a basis and personal data is filtered out, then raise it to the manager."),
    },
  ],
  connection: { to: "backup", text: tx("팀장이 자리를 비우는 날도 있습니다. 다음은 팀장 휴가와 백업 지정 절차입니다.", "Some days a TL is away. Next is the procedure for TL leave and naming a backup.") },
};
