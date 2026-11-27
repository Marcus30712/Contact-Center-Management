import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 5. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["notice", "check", "report", "interim"];
const flow = ["notice", "check", "report", "interim", "notice-check", "check-report", "report-interim"];

export default {
  id: "kbreport",
  order: 5,
  title: tx("지식 베이스 오류 알리기", "Reporting a Knowledge Base Error"),
  short: tx("오류 알리기", "KB errors"),
  subtitle: tx("문서가 이상하면 혼자 고쳐 쓰지 않고, 고칠 사람에게 알립니다.", "If a document looks wrong, don't rewrite it for yourself; tell the person who can fix it."),
  roles: tx("상담사 → 직무전문가", "Agent → SME"),
  procedure,
  diagram: {
    nodes: [
      wide(node("notice", "이상함 알아차리기", 180, 36, "Notice something off")),
      wide(node("check", "확인하기", 180, 92, "Check it")),
      wide(node("report", "알리기", 180, 148, "Report it")),
      wide(node("interim", "임시 안내 따르기", 180, 204, "Follow the interim guidance")),
    ],
    edges: [edge("notice", "check"), edge("check", "report"), edge("report", "interim")],
  },
  steps: [
    step(tx("이 절차의 목적은 지식 베이스에서 틀리거나 빠진 내용을 찾았을 때, 고칠 사람이 바로 고칠 수 있게 알리는 것입니다.", "This procedure exists so that when you find something wrong or missing in the knowledge base, you report it in a way the person who fixes it can act on right away."), flow, procedure, null),
    step(tx("첫 단계는 이상함 알아차리기입니다. 문서대로 안내했는데 고객이 다른 이야기를 하거나, 허들에서 들은 내용과 문서가 다르면 문서를 의심합니다.", "The first step is noticing something off. If a customer tells a different story after you followed the document, or the huddle and the document disagree, suspect the document."), flow, ["notice"], null),
    step(tx("둘째 단계는 확인하기입니다. 최신 공지나 허들 내용과 문서를 비교해 정말 다른지 봅니다. 확실하지 않으면 하린에게 먼저 묻습니다.", "The second step is checking it. Compare the document with the latest notice or the huddle to see if it really differs. If you're not sure, ask Harin first."), flow, ["check"], null),
    step(tx("셋째 단계는 알리기입니다. 하린에게 문서 이름, 이상한 문장, 그렇게 생각한 근거(공지나 티켓 번호)를 함께 전합니다.", "The third step is reporting it. Give Harin the document name, the sentence that looks wrong, and your basis (a notice or a ticket number) together."), flow, ["report"], null),
    step(tx("\"환불 문서가 이상해요\"처럼 말하면 하린이 다시 찾아야 합니다. 어느 문서의 어느 문장인지까지 알려야 빨리 고쳐집니다.", "If you only say \"The refund document is weird,\" Harin has to go looking for it. Saying which sentence in which document gets it fixed fast."), flow, ["report"], null),
    step(tx("넷째 단계는 임시 안내 따르기입니다. 고쳐지기 전까지는 하린이 팀 채팅방에 올린 임시 안내대로 응대합니다. 혼자 다른 내용으로 안내하지 않습니다.", "The fourth step is following the interim guidance. Until it's fixed, handle contacts with the interim guidance Harin posted in the team chat. Don't guide customers differently on your own."), flow, ["interim"], null),
    step(tx("하린은 원문을 확인해 담당자에게 업데이트를 요청합니다. 직무전문가 SOP의 지식 베이스 업데이트 요청이 이 다음 부분입니다.", "Harin checks the source and asks the owner to update it. The SME's knowledge base update request is what comes next."), flow, ["interim"], null),
    step(tx("미소의 한마디: 저는 틀린 문서를 보면 제 메모장에 바른 내용을 적어 두고 혼자만 썼어요. 그때 알렸다면 팀 전체가 같은 실수를 덜 했을 거예요.", "A word from Miso: When I saw a wrong document, I wrote the right answer in my own notes and used it alone. If I'd reported it, the whole team would have made that mistake less often."), flow, ["interim"], null),
  ],
  checkpoint: [
    {
      id: "kbreport-q1",
      prompt: tx("지식 베이스의 환불 문서가 허들 내용과 다릅니다. 지민이 하린에게 알릴 때 무엇을 함께 전할까요?", "The refund document in the knowledge base differs from the huddle. What does Jimin give Harin along with the report?"),
      options: [
        option("a", tx("\"환불 문서가 좀 이상해요.\"", "\"The refund document seems a bit off.\""), tx("어느 문장이 왜 이상한지 없으면 하린이 다시 찾아야 합니다.", "Without which sentence is off and why, Harin has to go looking again.")),
        option("b", tx("문서 이름, 이상한 문장, 근거가 된 공지나 티켓 번호", "The document name, the sentence that looks wrong, and the notice or ticket number behind it")),
        option("c", tx("바른 내용이라고 생각하는 문장만 정리한 글", "A note with only the sentences she thinks are right"), tx("어느 문서의 어느 문장을 바꿀지와 근거가 없으면 고칠 사람이 확인할 수 없습니다.", "Without which sentence in which document to change, and why, the person fixing it can't check.")),
      ],
      answer: "b",
      explanation: tx("무엇이, 어디에서, 왜 이상한지를 한 번에 전해야 빨리 고쳐집니다.", "Reporting what, where and why in one go gets it fixed fast."),
    },
    {
      id: "kbreport-q2",
      prompt: tx("문서가 아직 고쳐지지 않았습니다. 그동안 지민은 어떻게 안내할까요?", "The document hasn't been fixed yet. How does Jimin guide customers meanwhile?"),
      options: [
        option("a", tx("문서가 공식 자료이니, 고쳐질 때까지 문서대로 안내한다.", "The document is the official source, so follow it until it's fixed."), tx("틀린 줄 알면서 문서대로 안내하면 고객이 잘못된 안내를 받습니다. 임시 안내를 따릅니다.", "Following a document you know is wrong gives customers wrong guidance. Follow the interim guidance.")),
        option("b", tx("내가 확인한 내용이 맞을 거라 믿고 계속 안내한다.", "Trust what she checked and keep guiding that way."), tx("상담사마다 다른 내용으로 안내하게 됩니다. 팀 전체가 같은 임시 안내를 따릅니다.", "Then each agent guides differently. The whole team follows the same interim guidance.")),
        option("c", tx("팀 채팅방에 올라온 하린의 임시 안내대로 응대한다.", "Handle contacts with Harin's interim guidance from the team chat.")),
      ],
      answer: "c",
      explanation: tx("고쳐지기 전까지는 팀 전체가 같은 임시 안내를 따라야 고객이 같은 답을 받습니다.", "Until it's fixed, the whole team follows the same interim guidance so customers get the same answer."),
    },
  ],
  connection: { to: "scrubfb", text: tx("내가 한 안내가 틀렸는지는 스크러빙에서도 드러납니다. 다음은 스크러빙 피드백을 받고 고치는 절차입니다.", "Whether your guidance was wrong also shows up in scrubbing. Next is taking scrubbing feedback and fixing things.") },
};
