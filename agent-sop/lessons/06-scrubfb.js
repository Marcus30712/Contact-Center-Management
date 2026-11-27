import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 6. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["receive", "cause", "rewrite", "prevent"];
const flow = ["receive", "cause", "rewrite", "prevent", "receive-cause", "cause-rewrite", "rewrite-prevent"];

export default {
  id: "scrubfb",
  order: 6,
  title: tx("스크러빙 피드백 받고 고치기", "Taking Scrubbing Feedback and Fixing It"),
  short: tx("스크러빙 피드백", "Scrubbing feedback"),
  subtitle: tx("지적이 아니라 원인입니다. 같은 일이 다시 나오지 않게 고칩니다.", "It's a cause, not a scolding; fix it so it doesn't happen again."),
  roles: tx("직무전문가 → 상담사", "SME → Agent"),
  procedure,
  diagram: {
    nodes: [
      wide(node("receive", "피드백 받기", 180, 36, "Take the feedback")),
      wide(node("cause", "원인 이해", 180, 92, "Understand the cause")),
      wide(node("rewrite", "고쳐 쓰기", 180, 148, "Put it right")),
      wide(node("prevent", "반복 막기", 180, 204, "Stop it repeating")),
    ],
    edges: [edge("receive", "cause"), edge("cause", "rewrite"), edge("rewrite", "prevent")],
  },
  steps: [
    step(tx("이 절차의 목적은 직무전문가가 스크러빙에서 찾은 내 티켓의 문제를 이해하고, 같은 일이 다시 나오지 않게 고치는 것입니다.", "This procedure exists to understand the problem the SME found in your ticket during scrubbing, and to fix it so it doesn't happen again."), flow, procedure, null),
    step(tx("하린이 지민의 티켓 하나에서 본인 확인 단계가 빠진 것을 찾아 짧게 알려 줍니다. 첫 단계는 피드백 받기입니다. 변명보다 먼저 어느 티켓의 어느 부분인지 확인합니다.", "Harin finds that a verification step was skipped in one of Jimin's tickets and tells her briefly. The first step is taking the feedback. Before explaining yourself, confirm which part of which ticket it is."), flow, ["receive"], null),
    step(tx("둘째 단계는 원인 이해입니다. 바빠서 건너뛰었는지, 절차를 몰랐는지, 화면에서 놓쳤는지 스스로 원인을 찾습니다.", "The second step is understanding the cause. Find the cause yourself: did you skip it because you were busy, not know the step, or miss it on the screen?"), flow, ["cause"], null),
    step(tx("스크러빙은 누가 잘못했는지 찾는 일이 아니라 원인을 찾는 일입니다. 하린도 팀 채팅방에 이름을 밝혀 올리지 않습니다.", "Scrubbing isn't about finding who was wrong; it's about finding the cause. Harin doesn't post names in the team chat either."), flow, ["cause"], null),
    step(tx("셋째 단계는 고쳐 쓰기입니다. 아직 고객에게 영향이 남아 있으면 하린과 함께 바로잡는 방법을 정합니다. 예를 들어 다시 연락하거나 기록을 보완합니다.", "The third step is putting it right. If the customer is still affected, decide with Harin how to fix it. For example, contact them again or complete the record."), flow, ["rewrite"], null),
    step(tx("넷째 단계는 반복 막기입니다. 빠뜨린 단계를 화면 옆 체크리스트에 적어 두고, 다음 몇 건은 그 단계를 꼭 확인합니다.", "The fourth step is stopping it repeating. Write the skipped step on a checklist beside your screen, and make sure to check it for the next few contacts."), flow, ["prevent"], null),
    step(tx("같은 일이 반복되면 하린은 팀장에게 가는 트렌드 요약에 담고, 수진 팀장의 코칭으로 이어집니다. 직무전문가 SOP의 스크러빙이 이 앞부분입니다.", "If it keeps happening, Harin puts it in the trend summary for the team leader, and it leads to Sujin's coaching. The SME's scrubbing is what comes before this."), flow, ["prevent"], null),
    step(tx("미소의 한마디: 저는 스크러빙 피드백을 받으면 혼난 것 같아서 기분부터 상했어요. 원인을 찾아 주는 거라고 생각을 바꾼 뒤로 같은 실수가 확 줄었어요.", "A word from Miso: When I got scrubbing feedback, I felt scolded and got upset first. Once I saw it as someone finding the cause for me, the same mistakes dropped sharply."), flow, ["prevent"], null),
  ],
  checkpoint: [
    {
      id: "scrubfb-q1",
      prompt: tx("하린이 지민의 티켓에서 확인 단계가 빠진 것을 알려 줍니다. 지민이 먼저 할 일은 무엇일까요?", "Harin tells Jimin a verification step was skipped in her ticket. What does Jimin do first?"),
      options: [
        option("a", tx("그날은 너무 바빴다고 먼저 설명한다.", "Explain first that she was very busy that day."), tx("사정은 나중에 말해도 됩니다. 먼저 어느 티켓의 어느 부분인지 확인합니다.", "You can explain later. First, confirm which part of which ticket it is.")),
        option("b", tx("어느 티켓의 어느 부분인지 확인한다.", "Confirm which part of which ticket it is.")),
        option("c", tx("같은 실수를 한 다른 상담사도 있는지 하린에게 묻는다.", "Ask Harin whether other agents made the same mistake."), tx("다른 사람의 실수는 내 원인을 찾는 데 도움이 되지 않습니다. 내 티켓부터 봅니다.", "Others' mistakes don't help find your cause. Start with your own ticket.")),
      ],
      answer: "b",
      explanation: tx("피드백은 어느 티켓의 어느 부분인지 확인하는 데서 시작합니다. 그래야 원인을 찾을 수 있습니다.", "Feedback starts with confirming which part of which ticket it is. That's how you find the cause."),
    },
    {
      id: "scrubfb-q2",
      prompt: tx("원인은 바쁠 때 확인 단계를 건너뛴 것이었습니다. 다음에 같은 일이 없게 하려면 무엇이 가장 알맞을까요?", "The cause was skipping the verification step when busy. What best keeps it from happening again?"),
      options: [
        option("a", tx("그 단계를 체크리스트에 적고, 다음 몇 건은 꼭 확인한다.", "Write the step on a checklist, and be sure to check it for the next few contacts.")),
        option("b", tx("앞으로는 더 조심하겠다고 하린에게 말한다.", "Tell Harin she'll be more careful from now on."), tx("다짐만으로는 바쁠 때 또 빠집니다. 눈에 보이는 체크리스트로 막습니다.", "A promise alone slips again when you're busy. Block it with a checklist you can see.")),
        option("c", tx("바쁜 시간에는 확인 단계를 줄이고, 한가할 때 몰아서 확인한다.", "Shorten the verification step in busy hours, and catch up on checks when it's quiet."), tx("확인 단계는 줄일 수 있는 단계가 아닙니다. 바쁠수록 체크리스트로 지킵니다.", "Verification isn't a step you can shorten. The busier it is, the more the checklist keeps it.")),
      ],
      answer: "a",
      explanation: tx("반복은 다짐이 아니라 눈에 보이는 장치로 막습니다.", "Repeats are stopped by something you can see, not by a promise."),
    },
  ],
  connection: { to: "dispute", text: tx("스크러빙 말고 QA의 평가에서도 피드백을 받습니다. 다음은 평가 결과가 납득되지 않을 때의 절차입니다.", "Besides scrubbing, you also get feedback from QA scores. Next is what to do when a score doesn't seem right.") },
};
