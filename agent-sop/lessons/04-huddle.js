import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 4. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["note", "ask", "apply", "reread"];
const flow = ["note", "ask", "apply", "reread", "note-ask", "ask-apply", "apply-reread"];

export default {
  id: "huddle",
  order: 4,
  title: tx("고객사 업데이트 허들 듣고 적용하기", "Applying a Client Update from the Huddle"),
  short: tx("허들", "Huddle"),
  subtitle: tx("바뀐 점을 듣고, 첫 고객부터 바뀐 대로 안내합니다.", "Hear what changed, and guide customers the new way from the very first one."),
  roles: tx("직무전문가 → 상담사", "SME → Agent"),
  procedure,
  diagram: {
    nodes: [
      wide(node("note", "듣고 적기", 180, 36, "Listen and note")),
      wide(node("ask", "모르면 묻기", 180, 92, "Ask if unsure")),
      wide(node("apply", "바로 적용", 180, 148, "Apply right away")),
      wide(node("reread", "글로 다시 보기", 180, 204, "Read it again")),
    ],
    edges: [edge("note", "ask"), edge("ask", "apply"), edge("apply", "reread")],
  },
  steps: [
    step(tx("이 절차의 목적은 고객사의 정책이나 프로모션이 바뀌었을 때, 허들에서 들은 내용을 첫 고객부터 바뀐 대로 안내하는 것입니다.", "This procedure exists so that when a client's policy or promotion changes, you guide customers the new way from the very first one after the huddle."), flow, procedure, null),
    step(tx("교대 시작 전 짧은 허들(예시: 5분)에서 하린이 내일부터 환불 기간이 바뀐다고 전합니다. 첫 단계는 듣고 적기입니다. 무엇이, 언제부터, 누구에게 바뀌는지 적습니다.", "In a short huddle before the shift (Example: 5 minutes), Harin says the refund period changes from tomorrow. The first step is listening and noting. Write down what changes, from when, and for whom."), flow, ["note"], null),
    step(tx("둘째 단계는 모르면 묻기입니다. 헷갈리는 부분은 허들에서 바로 묻습니다. 하린이 바로 답하지 못하면 확인해서 알려 줍니다.", "The second step is asking if unsure. Ask about anything confusing right there in the huddle. If Harin can't answer on the spot, she'll check and let you know."), flow, ["ask"], null),
    step(tx("혼자 짐작해서 안내하면, 틀렸을 때 같은 실수가 여러 고객에게 갑니다.", "If you guess on your own and it's wrong, the same mistake reaches many customers."), flow, ["ask"], null),
    step(tx("셋째 단계는 바로 적용입니다. 적용 시각부터 하린이 준 안내 문장으로 안내합니다. 예전 방식이 손에 익어도 화면 옆에 바뀐 점을 붙여 둡니다.", "The third step is applying it right away. From the start time, guide customers with the wording Harin gave. Even if the old way is a habit, stick a note about the change next to your screen."), flow, ["apply"], null),
    step(tx("넷째 단계는 글로 다시 보기입니다. 허들에 늦었거나 쉬는 날이었으면 팀 채팅방에 올라온 내용을 먼저 읽고 근무를 시작합니다.", "The fourth step is reading it again. If you were late for the huddle or off that day, read what was posted in the team chat before starting work."), flow, ["reread"], null),
    step(tx("하린은 적용 첫날 스크러빙에서 바뀐 정책과 관련된 티켓을 먼저 봅니다. 직무전문가 SOP의 고객사 업데이트 허들이 이 앞부분입니다.", "On the first day, Harin checks tickets about the changed policy first in scrubbing. The SME's client-update huddle is what comes before this."), flow, ["reread"], null),
    step(tx("미소의 한마디: 저는 허들 때 고개만 끄덕이고 적지 않았어요. 그날 오후에 예전 기간으로 안내한 걸 스크러빙에서 듣고 나서야 메모하는 습관이 생겼어요.", "A word from Miso: In huddles I just nodded and didn't write anything down. Only after scrubbing showed I'd quoted the old period that afternoon did I start taking notes."), flow, ["reread"], null),
  ],
  checkpoint: [
    {
      id: "huddle-q1",
      prompt: tx("허들에서 들은 내용 중 한 부분이 헷갈립니다. 지민에게 알맞은 행동은 무엇일까요?", "Part of what Jimin heard in the huddle is confusing. What fits best?"),
      options: [
        option("a", tx("헷갈린 채로 안내하면 틀리기 쉬우니, 허들에서 바로 묻는다.", "Guiding while unsure is easy to get wrong, so ask right there in the huddle.")),
        option("b", tx("응대 중에 짐작해서 안내하고, 틀리면 나중에 고친다.", "Guess during the contact, and fix it later if it was wrong."), tx("짐작이 틀리면 같은 실수가 여러 고객에게 갑니다. 모르면 그 자리에서 묻습니다.", "A wrong guess sends the same mistake to many customers. If you're unsure, ask on the spot.")),
        option("c", tx("허들이 끝난 뒤 옆자리 동료에게 어떻게 이해했는지 물어본다.", "After the huddle, ask the colleague next to her how they understood it."), tx("동료도 잘못 이해했을 수 있습니다. 전한 사람에게 바로 묻는 것이 가장 정확합니다.", "The colleague may have misunderstood too. Asking the person who shared it right away is most accurate.")),
      ],
      answer: "a",
      explanation: tx("헷갈리면 허들에서 바로 묻습니다. 바로 답이 없으면 하린이 확인해 알려 줍니다.", "If you're unsure, ask in the huddle. If there's no answer yet, Harin checks and tells you."),
    },
    {
      id: "huddle-q2",
      prompt: tx("지민이 쉬는 날에 허들이 있었습니다. 다음 근무에서 먼저 할 일은 무엇일까요?", "There was a huddle on Jimin's day off. What does she do first on her next shift?"),
      options: [
        option("a", tx("다음 허들에서 다시 전해 줄 테니, 그때까지 하던 대로 안내한다.", "The next huddle will cover it again, so keep guiding the way she did until then."), tx("그사이 예전 방식으로 안내하게 됩니다. 근무를 시작하기 전에 글로 남은 내용을 읽습니다.", "Meanwhile you'd be guiding the old way. Read what was written before you start work.")),
        option("b", tx("바뀐 안내를 놓치지 않게, 팀 채팅방의 허들 내용부터 읽는다.", "Read the huddle notes in the team chat first so she doesn't miss the change.")),
        option("c", tx("하린에게 허들 내용을 처음부터 다시 말해 달라고 한다.", "Ask Harin to go over the whole huddle again from the start."), tx("같은 내용이 글로 남아 있습니다. 먼저 읽고, 헷갈리는 부분만 묻습니다.", "The same content is already in writing. Read it first, and ask only about what's confusing.")),
      ],
      answer: "b",
      explanation: tx("허들 내용은 근무 시간이 다른 사람을 위해 글로도 남습니다. 근무 전에 읽고 시작합니다.", "Huddle content is also written down for people on other shifts. Read it before you start."),
    },
  ],
  connection: { to: "kbreport", text: tx("들은 내용과 지식 베이스가 다를 때도 있습니다. 다음은 지식 베이스의 오류를 알리는 절차입니다.", "Sometimes what you heard and the knowledge base don't match. Next is reporting a knowledge base error.") },
};
