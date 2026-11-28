import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 6. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["scope", "collect", "signoff", "send"];
const flow = ["scope", "collect", "signoff", "send", "scope-collect", "collect-signoff", "signoff-send"];

export default {
  id: "requests",
  order: 6,
  title: tx("고객사 요청 정보 취합", "Gathering Information the Client Requests"),
  short: tx("요청 취합", "Client requests"),
  subtitle: tx("팀장들에게서 모으고, 매니저의 확인을 거쳐 고객사에 전달합니다.", "Collect from the Team Leaders, get the manager's sign-off and send it to the client."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("scope", "요청 정리", 180, 36, "Pin down the request")),
      wide(node("collect", "모으기", 180, 92, "Collect")),
      wide(node("signoff", "확인받기", 180, 148, "Get sign-off")),
      wide(node("send", "전달하기", 180, 204, "Send")),
    ],
    edges: [edge("scope", "collect"), edge("collect", "signoff"), edge("signoff", "send")],
  },
  steps: [
    step(tx("이 레슨의 목적은 고객사가 요청한 정보를 팀장들에게서 모아, 매니저의 확인을 거쳐 전달하는 내부 조율을 익히는 것입니다.", "This lesson is about the internal coordination of collecting what the client asks for from the TLs, and sending it after the manager signs off."), flow, procedure, null),
    step(tx("화요일 아침, 고객사가 지난달 마켓별 환불 문의 건수와 대표 사례를 목요일까지(예시) 보내 달라고 정은 매니저에게 메일을 보냈습니다. 매니저는 민석에게 취합을 맡깁니다.", "On Tuesday morning, the client emails Jeongeun asking for last month's refund contact counts and typical cases by market by Thursday (Example). She hands the collection to Minseok."), flow, [], null),
    step(tx("첫 단계는 요청 정리입니다. 무엇을, 어느 기간으로, 어떤 형식으로, 언제까지 원하는지 정리합니다. 요청이 모호하면 추측하지 않고 매니저를 통해 고객사에 먼저 묻습니다.", "The first stage is pinning down the request. He sets out what they want, for what period, in what format and by when. If the request is unclear, he doesn't guess but asks the client first through the manager."), flow, ["scope"], null),
    step(tx("둘째 단계는 모으기입니다. 세 마켓 팀장에게 같은 양식과 마감을 보내고, 마감은 고객사 기한보다 하루(예시) 앞으로 잡습니다. 그래야 검토하고 고칠 시간이 남습니다.", "The second stage is collecting. He sends all three market TLs the same template and deadline, setting the deadline a day (Example) before the client's. That leaves time to review and fix."), flow, ["collect"], null),
    step(tx("유키 팀장은 일본 마켓 사례에 고객 이름을 그대로 적어 보냈습니다. 민석은 개인정보를 지우고 다시 보내 달라고 합니다. 고객사에 나가는 자료라도 정해진 범위를 넘는 개인정보는 담지 않습니다.", "Yuki sent the Japanese market's cases with customer names left in. Minseok asks her to remove the personal data and resend. Even in material for the client, no personal data beyond the agreed scope goes in."), flow, ["collect"], null),
    step(tx("셋째 단계는 확인받기입니다. 모은 자료를 하나로 묶고, 숫자와 사례를 검토한 뒤 정은 매니저에게 온라인으로 보고해 확인을 받습니다. 매니저가 자리에 없어도 메신저나 메일로 확인을 받고 나서 보냅니다.", "The third stage is getting sign-off. He merges what he collected, reviews the numbers and cases, and reports to Jeongeun online for her sign-off. Even when the manager is away, he gets her sign-off by chat or email before sending."), flow, ["signoff"], null),
    step(tx("넷째 단계는 전달하기입니다. 매니저가 확인한 자료를 정해진 경로로 고객사에 보내고, 보낸 내용과 시각을 기록합니다. 고객사의 추가 질문이 오면 같은 길로 다시 모읍니다.", "The fourth stage is sending. He sends the signed-off material to the client through the agreed channel, and logs what was sent and when. If the client asks follow-up questions, he collects again the same way."), flow, ["send"], null),
    step(tx("미소의 한마디: 급해서 매니저 확인 없이 보냈다가, 매니저가 고객사와 다르게 말해 둔 숫자와 어긋난 적이 있어요. 아무리 급해도 확인 한 번은 꼭 받으세요.", "A word from Miso: I once sent something in a hurry without the manager's sign-off, and it clashed with a number she had already given the client. However urgent it is, always get that one sign-off."), flow, ["send"], null),
  ],
  checkpoint: [
    {
      id: "requests-q1",
      prompt: tx("고객사가 요청한 자료의 마감이 오늘 오후입니다. 취합은 끝났는데 정은 매니저가 외부 미팅 중입니다. 어떻게 할까요?", "The client's material is due this afternoon. The collection is done, but Jeongeun is in an external meeting. What does Minseok do?"),
      options: [
        option("a", tx("마감이 급하므로 민석이 판단해 고객사에 바로 보낸다.", "The deadline is tight, so he decides himself and sends it to the client right away."), tx("매니저가 고객사와 나눈 이야기와 어긋날 수 있습니다. 확인을 받을 방법부터 찾습니다.", "It may clash with what the manager has told the client. First find a way to get her sign-off.")),
        option("b", tx("메신저로 요점과 자료를 보내 확인을 받은 뒤 고객사에 보낸다.", "Send her the key points and the material by chat, get her sign-off, then send it to the client.")),
        option("c", tx("매니저가 돌아올 때까지 기다리고, 마감은 넘겨도 사정을 설명한다.", "Wait until the manager is back, and explain if the deadline slips."), tx("매니저가 자리에 없어도 온라인으로 확인받을 수 있습니다. 마감을 넘기는 것은 마지막 방법입니다.", "You can get sign-off online even when the manager is away. Missing the deadline is the last resort.")),
      ],
      answer: "b",
      explanation: tx("매니저가 자리에 없어도 온라인으로 확인을 받고, 마감 안에 전달합니다.", "Get the manager's sign-off online even when she's away, and deliver by the deadline."),
    },
    {
      id: "requests-q2",
      prompt: tx("팀장들에게 자료를 요청할 때 마감을 언제로 잡는 것이 좋을까요?", "When asking the TLs for material, when is the best deadline?"),
      options: [
        option("a", tx("고객사 기한과 같은 날로 잡는다.", "The same day as the client's deadline."), tx("같은 날로 잡으면 검토하고 고칠 시간이 없습니다.", "The same day leaves no time to review and fix.")),
        option("b", tx("팀장마다 편한 날을 묻고, 마감은 각자 사정에 맞게 정하게 한다.", "Ask each TL which day suits them, and let each set their own."), tx("마감이 제각각이면 가장 늦은 팀장에 맞춰 모두 기다리게 됩니다.", "Different deadlines mean everyone waits for the slowest TL.")),
        option("c", tx("고객사 기한보다 하루(예시) 앞으로, 모두 같은 날로 잡는다.", "A day (Example) before the client's deadline, the same day for everyone.")),
      ],
      answer: "c",
      explanation: tx("검토하고 고칠 시간을 남기도록, 같은 양식과 같은 마감을 고객사 기한보다 앞에 둡니다.", "Put one template and one deadline ahead of the client's, to leave time to review and fix."),
    },
  ],
  connection: { to: "cover", text: tx("매니저가 자리를 비우는 날도 있습니다. 매니저를 대신하는 법을 봅니다.", "Some days the manager is away. Next, how to cover for the manager.") },
};
