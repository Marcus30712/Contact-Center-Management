import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 8. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["spot", "source", "request", "verify"];
const flow = ["spot", "source", "request", "verify", "spot-source", "source-request", "request-verify"];

export default {
  id: "kbrequest",
  order: 8,
  title: tx("지식 베이스 업데이트 요청", "Knowledge Base Update Requests"),
  short: tx("지식 베이스", "Knowledge base"),
  subtitle: tx("틀리거나 빠진 문서를 찾으면, 고칠 사람이 바로 고칠 수 있게 요청합니다.", "When you find a wrong or missing article, ask so the owner can fix it right away."),
  roles: tx("SME → 지식 베이스 담당", "SME → Knowledge base owner"),
  procedure,
  diagram: {
    nodes: [
      wide(node("spot", "문제 찾기", 180, 36, "Spot the problem")),
      wide(node("source", "원문 확인", 180, 92, "Check the source")),
      wide(node("request", "요청 쓰기", 180, 148, "Write the request")),
      wide(node("verify", "반영 확인", 180, 204, "Confirm the fix")),
    ],
    edges: [edge("spot", "source"), edge("source", "request"), edge("request", "verify")],
  },
  steps: [
    step(tx("이 절차의 목적은 지식 베이스의 틀리거나 빠진 내용을 찾아 담당자가 바로 고칠 수 있게 요청하고, 고쳐지면 팀에 알리는 것입니다.", "This procedure exists to find wrong or missing content in the knowledge base, ask for a fix the owner can make right away, and tell the team once it's fixed."), flow, procedure, null),
    step(tx("첫 단계는 문제 찾기입니다. 서준과 지민이 같은 질문을 하거나, 스크러빙에서 문서대로 안내했는데 틀린 건이 나오면 문서를 의심합니다.", "The first step is spotting the problem. When Seojun and Jimin ask the same question, or scrubbing finds a wrong answer given by the book, suspect the article."), flow, ["spot"], null),
    step(tx("둘째 단계는 원문 확인입니다. 정책 원문이나 고객사의 최신 공지와 문서를 비교해, 정말 틀렸는지 또는 빠졌는지 확인합니다.", "The second step is checking the source. Compare the article with the policy text or the client's latest notice to confirm whether it is really wrong or missing."), flow, ["source"], null),
    step(tx("셋째 단계는 요청 쓰기입니다. 문서 이름, 틀린 문장, 바른 내용, 근거가 된 공지나 티켓 번호를 적어 정해진 경로로 보냅니다.", "The third step is writing the request. Note the article name, the wrong sentence, the right content, and the notice or ticket numbers it is based on, and send it through the agreed channel."), flow, ["request"], null),
    step(tx("\"환불 문서가 이상해요\"처럼 보내면 담당자가 다시 물어야 합니다. 무엇을 무엇으로 바꿀지까지 적어야 빨리 고쳐집니다.", "A request like \"the refund article looks off\" makes the owner ask again. Say what to change into what, and it gets fixed fast."), flow, ["request"], null),
    step(tx("고쳐지기 전까지는 팀 채팅방에 임시 안내를 올립니다. 문서를 고치는 동안에도 고객은 계속 문의합니다.", "Until it's fixed, post an interim note in the team chat. Customers keep asking while the article is being fixed."), flow, ["request"], null),
    step(tx("넷째 단계는 반영 확인입니다. 문서가 고쳐지면 내용을 다시 확인하고, 허들이나 팀 채팅방에 바뀐 곳을 알립니다.", "The fourth step is confirming the fix. When the article is fixed, check it again, and tell the team what changed at a huddle or in the team chat."), flow, ["verify"], null),
  ],
  checkpoint: [
    {
      id: "kbrequest-q1",
      prompt: tx("지식 베이스 업데이트 요청으로 알맞은 것은 무엇일까요?", "Which fits as a knowledge base update request?"),
      options: [
        option("a", tx("\"환불 문서 내용이 이상합니다.\"", "\"The refund article looks wrong.\""), tx("무엇이 틀렸는지 담당자가 다시 찾아야 해서 반영이 늦어집니다.", "The owner has to find out what is wrong, which slows the fix.")),
        option("b", tx("\"환불 문서 3번 항목의 신청 기간을 14일에서 7일로: 고객사 공지와 관련 티켓 2건 첨부\"", "\"Refund article item 3: claim period from 14 days to 7 days; client notice and 2 related tickets attached\"")),
        option("c", tx("권한이 없어도 동료 계정으로 문서를 직접 고친다.", "Fix the article yourself with a colleague's account, even without permission."), tx("검토 없이 고친 문서는 팀 전체의 안내를 한 번에 바꿉니다. 정해진 경로로 요청합니다.", "An article changed without review changes the whole team's answers at once. Use the agreed channel.")),
      ],
      answer: "b",
      explanation: tx("요청에는 문서, 틀린 곳, 바른 내용, 근거를 적습니다.", "A request names the article, what's wrong, the right content and the source."),
    },
    {
      id: "kbrequest-q2",
      prompt: tx("요청을 보냈지만 문서가 아직 고쳐지지 않았습니다. 그사이 할 일은 무엇일까요?", "You sent a request, but the article isn't fixed yet. What do you do meanwhile?"),
      options: [
        option("a", tx("고쳐질 때까지 기다린다.", "Wait until it's fixed."), tx("그동안 상담사들은 틀린 문서대로 안내합니다.", "Meanwhile, agents keep giving answers from the wrong article.")),
        option("b", tx("팀 채팅방에 임시 안내를 올리고, 반영되면 다시 알린다.", "Post an interim note in the team chat, and tell the team again once it's fixed.")),
        option("c", tx("상담사들에게 지식 베이스를 보지 말라고 한다.", "Tell agents not to use the knowledge base."), tx("지식 베이스 전체를 막으면 맞는 내용까지 찾을 곳이 사라집니다.", "Blocking the whole knowledge base removes the place to find the correct content too.")),
      ],
      answer: "b",
      explanation: tx("고쳐지기 전까지는 임시 안내로 빈틈을 막고, 반영되면 알립니다.", "Until it's fixed, cover the gap with an interim note, and say so once it's fixed."),
    },
  ],
  connection: { to: "home", text: tx("SME SOP 라이브러리를 마쳤습니다. 단계마다 어떤 절차를 쓰는지는 서포트 라이프사이클에서 다시 볼 수 있습니다.", "You have finished the SME SOP Library. You can see which procedure to use at each stage again in Support Lifecycle.") },
};
