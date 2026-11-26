import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 4. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["prepare", "greet", "confirm", "wrapup"];
const flow = ["prepare", "greet", "confirm", "wrapup", "prepare-greet", "greet-confirm", "confirm-wrapup"];

export default {
  id: "golive",
  order: 4,
  title: tx("실전 배치와 첫 콜", "Go Live and the First Call"),
  short: tx("첫 콜", "First call"),
  subtitle: tx("혼자 받는 첫 콜을, 긴장 속에서도 끝까지 해내는 순서를 익힙니다.", "Learn the order that gets you through your first call alone, even when nervous."),
  procedure,
  diagram: {
    nodes: [
      wide(node("prepare", "준비", 180, 36, "Prepare")),
      wide(node("greet", "인사", 180, 92, "Greet")),
      wide(node("confirm", "확인", 180, 148, "Confirm")),
      wide(node("wrapup", "마무리", 180, 204, "Wrap up")),
    ],
    edges: [edge("prepare", "greet"), edge("greet", "confirm"), edge("confirm", "wrapup")],
  },
  steps: [
    step(tx("이 레슨의 목적은 실전 배치 뒤 혼자 받는 콜을, 긴장한 상태에서도 끝까지 해내는 순서를 익히는 것입니다.", "This lesson is about learning the order that gets you through a call on your own after Go Live, even when you're nervous."), flow, procedure, null),
    step(tx("지민은 수료하고 오늘부터 정식 팀에서 일합니다. 네스팅 때처럼 곁에서 봐 주는 사람 없이 혼자 받는 첫 콜이 울리자, 손이 떨리고 배운 것이 하나도 생각나지 않는 것 같습니다.", "Jimin has graduated, and from today she's on the regular team. When her first call without nesting support rings, her hands shake and it feels like she remembers nothing."), flow, [], null),
    step(tx("첫 단계는 준비입니다. 근무가 시작되면 바로 받을 수 있도록 도구에 로그인하고, 지식 베이스와 자주 쓰는 화면을 열어 둡니다. 물 한 잔도 챙깁니다.", "The first stage is preparing. Log in to your tools so you're ready to take contacts as your shift starts, and open the knowledge base and the screens you use most. Get a glass of water too."), flow, ["prepare"], null),
    step(tx("둘째 단계는 인사입니다. 정해진 인사말을 천천히 말합니다. 첫 문장이 안정되면 나머지도 따라옵니다.", "The second stage is the greeting. Say the set greeting slowly. Once the first sentence is steady, the rest follows."), flow, ["greet"], null),
    step(tx("셋째 단계는 확인입니다. 본인 확인을 하고, 고객이 원하는 것을 내 말로 한 번 되짚습니다. 잘못 알아들은 채 시작하면 통화가 길어집니다.", "The third stage is confirming. Check the customer's identity, then repeat back what they want in your own words. Starting on a misunderstanding makes the call longer."), flow, ["confirm"], null),
    step(tx("넷째 단계는 마무리입니다. 안내한 내용을 짧게 정리하고 더 필요한 것이 있는지 묻습니다. 통화가 끝나면 상담 기록을 바로 남깁니다.", "The fourth stage is wrapping up. Sum up what you told them and ask whether they need anything else. When the call ends, write the contact notes right away."), flow, ["wrapup"], null),
    step(tx("처음에는 평균 처리 시간(AHT)이 길게 나옵니다. 정확하게 안내하는 것이 먼저이고, 속도는 익숙해지면서 따라옵니다.", "At first your average handle time (AHT) will be long. Accuracy comes first; speed follows as you get used to it."), flow, ["wrapup"], null),
    step(tx("실수했다면 숨기지 않고 바로 직무전문가 하린이나 팀장에게 알립니다. 빨리 알릴수록 바로잡기도 쉬워집니다.", "If you made a mistake, don't hide it; tell Harin the SME or your team leader right away. The sooner you tell, the easier it is to put right."), flow, ["wrapup"], null),
    step(tx("미소의 한마디: 첫 콜은 저도 무슨 말을 했는지 기억이 안 나요. 그래도 끝까지 해냈다는 것만으로 충분했어요.", "A word from Miso: I still can't remember what I said on my first call. Getting to the end was enough."), flow, ["wrapup"], null),
  ],
  checkpoint: [
    {
      id: "golive-q1",
      prompt: tx("통화 중에 지민은 머리가 하얘져서 다음에 할 말이 생각나지 않습니다. 어떻게 할까요?", "Mid-call, Jimin's mind goes blank and she can't think what to say next. What should she do?"),
      options: [
        option("a", tx("침묵이 길어지면 고객이 불안해하니, 확실하지 않아도 생각나는 대로 말을 이어 간다.", "Silence makes customers uneasy, so keep talking with whatever comes to mind, even if she isn't sure."), tx("확실하지 않은 말은 나중에 바로잡기 어렵습니다.", "Things said without certainty are hard to correct later.")),
        option("b", tx("\"확인해 드리겠습니다\" 하고 보류한 뒤, 메모와 지식 베이스를 본다.", "Say \"Let me check that for you,\" put the call on hold, then look at her notes and the knowledge base.")),
        option("c", tx("혼자 해결하기 어려운 통화라고 보고, 바로 옆자리 선배 상담사에게 통화를 넘긴다.", "Treat it as a call she can't solve alone and hand it straight to the senior agent next to her."), tx("넘길 일이 아니라 잠깐 확인할 시간이 필요한 상황입니다.", "This isn't a call to hand over; she just needs a moment to check.")),
      ],
      answer: "b",
      explanation: tx("확인할 시간을 요청하는 것은 정상적인 응대입니다.", "Asking for a moment to check is a normal part of handling a contact."),
    },
    {
      id: "golive-q2",
      prompt: tx("통화를 마친 뒤 잘못 안내한 것을 알았습니다. 어떻게 할까요?", "After a call ends, Jimin realizes she gave wrong information. What should she do?"),
      options: [
        option("a", tx("고객이 다시 연락하지 않으면 문제없다고 보고 다음 문의로 넘어간다.", "Treat it as fine unless the customer calls back, and move on to the next contact."), tx("잘못된 안내는 더 큰 불만으로 돌아올 수 있습니다.", "Wrong information can come back as a bigger complaint.")),
        option("b", tx("바로 직무전문가나 팀장에게 알리고 절차대로 바로잡는다.", "Tell the SME or team leader right away and correct it through the process.")),
        option("c", tx("아무에게도 말하지 않고 혼자 고객에게 다시 연락한다.", "Contact the customer again on her own without telling anyone."), tx("다시 연락하는 방법과 기록 규칙이 정해져 있을 수 있습니다. 먼저 알리고 절차를 따릅니다.", "There may be set rules for contacting customers again and recording it. Tell someone first and follow the process.")),
      ],
      answer: "b",
      explanation: tx("실수는 빨리 알릴수록 작게 끝납니다.", "The sooner a mistake is reported, the smaller it stays."),
    },
  ],
  connection: { to: "customers", text: tx("콜이 익숙해질 즈음 가장 힘든 고객들을 만납니다. 화난 고객과, 내 말을 알아듣기 어려워하는 고객입니다.", "Just as calls start to feel familiar, you meet the hardest customers: angry ones, and ones who struggle to understand you.") },
};
