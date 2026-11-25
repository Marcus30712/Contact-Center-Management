import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 첫걸음, lesson 4. Approved copy: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SOP lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["reset", "same", "respect", "consult"];
const flow = [...procedure, "reset-same", "same-respect", "respect-consult"];

export default {
  id: "peer",
  order: 4,
  title: tx("동료였던 선임 서포트", "Supporting Senior Agents Who Were Your Peers"),
  short: tx("동료였던 선임", "Former peers"),
  subtitle: tx("친분이 아니라 같은 기준으로 승인하고 돕습니다.", "Approve and help by the same standard, not by friendship."),
  personaName: tx("준호", "Junho"),
  procedure,
  diagram: {
    nodes: [
      wide(node("reset", "관계 다시 맺기", 180, 36, "Reset the relationship")),
      wide(node("same", "같은 기준", 180, 92, "Same standard")),
      wide(node("respect", "존중하며 돕기", 180, 148, "Help with respect")),
      wide(node("consult", "팀장과 상의", 180, 204, "Talk to the lead")),
    ],
    edges: [edge("reset", "same"), edge("same", "respect"), edge("respect", "consult")],
  },
  steps: [
    step(tx("이 레슨의 목적은 동료였던 선임 상담사도 다른 상담사와 같은 기준으로 승인하고 도우며, 서로 존중하는 관계로 옮겨 가는 것입니다.", "This lesson is about approving and helping senior agents who were your peers by the same standard as everyone else, and moving to a relationship of mutual respect."), flow, procedure, null),
    step(tx("준호는 당신과 같은 날 입사한 동기이고, 성적도 비슷했습니다. 이제 준호도 에스컬레이션 승인이 필요하면 당신에게 요청해야 합니다.", "Junho joined on the same day as you, and your results were about the same. Now, when Junho needs an escalation approved, he has to ask you."), flow, [], null),
    step(tx("어색함은 양쪽 모두 느낍니다. 준호는 동기에게 승인을 받는 것이, 당신은 동기의 요청을 판단하는 것이 불편할 수 있습니다.", "Both of you feel awkward. Junho may find it uncomfortable to get approval from a peer, and you may find it uncomfortable to judge a peer's request."), flow, [], null),
    step(tx("첫 단계는 관계 다시 맺기입니다. 첫 주에 준호와 따로 이야기합니다. 내 역할이 무엇인지, 도움이 필요할 때 어떻게 요청하면 좋은지 솔직하게 말합니다.", "The first stage is resetting the relationship. In your first week, talk to Junho one on one. Say plainly what your role is and how he can best ask for help."), flow, ["reset"], null),
    step(tx("둘째 단계는 같은 기준입니다. 준호의 요청도 다른 상담사와 같은 승인 기준으로 판단합니다. 친해서 쉽게 승인하면 다른 상담사들은 기준이 사람마다 다르다고 느낍니다.", "The second stage is the same standard. Judge Junho's requests by the same approval standard as other agents'. If you approve easily because you are close, other agents feel the standard depends on the person."), flow, ["same"], null),
    step(tx("반대로 일부러 더 엄하게 대하는 것도 공정하지 않습니다. 기준은 같게 하고, 말투는 지금까지처럼 편해도 괜찮습니다.", "Being deliberately stricter with him is not fair either. Keep the standard the same; you can keep talking as casually as before."), flow, ["same"], null),
    step(tx("셋째 단계는 존중하며 돕기입니다. 선임 상담사는 아는 것이 많습니다. 가르치려 하기보다 준호의 판단을 먼저 묻고, 필요한 부분만 더합니다.", "The third stage is helping with respect. Senior agents know a lot. Rather than teaching, ask for Junho's judgment first and add only what is needed."), flow, ["respect"], null),
    step(tx("준호의 경험은 팀의 자원입니다. 신입 서준의 질문을 함께 봐 달라고 부탁하거나, 어려운 케이스를 같이 검토하자고 요청할 수 있습니다.", "Junho's experience is a resource for the team. You can ask him to look at new hire Seojun's questions with you, or to review hard cases together."), flow, ["respect"], null),
    step(tx("넷째 단계는 팀장과 상의하기입니다. 준호가 승인 없이 절차를 건너뛰는 일이 반복되면 혼자 해결하려 하지 말고 팀장과 상의합니다. 근태와 성과 문제는 팀장이 맡습니다.", "The fourth stage is talking to the team leader. If Junho keeps skipping steps without approval, don't try to fix it alone; talk to the team leader. Attendance and performance belong to the team leader."), flow, ["consult"], null),
    step(tx("첫 주의 솔직한 대화가 출발점입니다. 시간이 지나면 동기였던 사이가 서로를 가장 잘 받쳐 주는 관계가 될 수 있습니다.", "An honest talk in the first week is the starting point. In time, former peers can become the ones who back each other up best."), flow, ["reset"], null),
  ],
  checkpoint: [
    {
      id: "peer-q1",
      prompt: tx("준호가 \"우리 사이에 뭘 그렇게까지 해\"라며 승인 없이 보상을 처리하려 합니다. 어떻게 할까요?", "Junho says, \"Come on, between us?\" and tries to give a compensation without approval. What do you do?"),
      options: [
        option("a", tx("오래 함께한 동기니 이번에는 넘어간다.", "Let it go this time, since you have worked together so long."), tx("한 사람에게만 느슨하면 다른 상담사들은 승인 기준이 친분에 따라 달라진다고 느낍니다.", "When it is looser for one person, other agents feel the approval standard depends on friendship.")),
        option("b", tx("누구에게나 같은 기준이라고 차분히 말하고, 승인 절차를 거치게 한다.", "Say calmly that the standard is the same for everyone, and have it go through approval.")),
        option("c", tx("다른 상담사들 앞에서 절차를 어겼다고 지적한다.", "Point out in front of the other agents that he broke the procedure."), tx("공개적인 지적은 준호에게 상처가 되고, 팀은 직무전문가가 동기에게 본보기를 보였다고 받아들입니다.", "Calling it out in public hurts Junho, and the team reads it as the SME making an example of a peer.")),
      ],
      answer: "b",
      explanation: tx("같은 기준을, 존중하는 방식으로 적용합니다.", "Apply the same standard, in a respectful way."),
    },
    {
      id: "peer-q2",
      prompt: tx("준호가 어려운 케이스를 자기가 더 잘 안다며 당신의 안내와 다르게 처리하려 합니다. 알맞은 것은 무엇일까요?", "Junho says he knows a hard case better and wants to handle it differently from your guidance. What fits best?"),
      options: [
        option("a", tx("이제 내가 직무전문가이니 내 방식대로 하라고 한다.", "Tell him to do it your way, since you are the SME now."), tx("직급만으로 밀어붙이면 준호는 앞으로 의견을 내지 않고, 팀은 좋은 판단 하나를 잃습니다.", "Pushing by title alone means Junho stops speaking up, and the team loses a good call.")),
        option("b", tx("준호의 판단과 이유를 먼저 듣고, 승인 기준에 맞는지 함께 확인한다.", "Hear Junho's view and reasons first, and check together that it meets the approval standard.")),
        option("c", tx("어색해지기 싫으니 준호의 요청은 따로 확인하지 않고 승인한다.", "Approve Junho's requests without checking, to avoid awkwardness."), tx("확인을 건너뛰면 기준이 사람에 따라 달라지고, 문제가 생기면 승인한 당신의 책임이 됩니다.", "Skipping the check makes the standard depend on the person, and if something goes wrong, it is on you as the approver.")),
      ],
      answer: "b",
      explanation: tx("선임의 경험은 존중하되, 승인 기준은 누구에게나 똑같이 확인합니다.", "Respect a senior's experience, but check the approval standard the same way for everyone."),
    },
  ],
  connection: { to: "lead", text: tx("직무전문가가 받쳐 주는 사람은 상담사만이 아닙니다. 팀장의 일도 나눠 맡습니다.", "The SME does not back up only agents. You also take on part of the team leader's work.") },
};
