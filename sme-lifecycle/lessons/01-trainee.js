import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 서포트 라이프사이클, lesson 1. Approved copy: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME First Steps lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["roles", "demo", "record", "handover"];
const flow = ["roles", "demo", "record", "handover", "roles-demo", "demo-record", "record-handover"];

export default {
  id: "trainee",
  order: 1,
  title: tx("교육 중인 상담사 지원", "Supporting Agents in Training"),
  short: tx("교육 중", "Training"),
  subtitle: tx("가르치는 사람은 트레이너, SME는 현장을 보여 줍니다.", "The trainer teaches; the SME shows the floor."),
  personaName: tx("서준", "Seojun"),
  procedure,
  diagram: {
    nodes: [
      wide(node("roles", "역할 나누기", 180, 36, "Divide roles")),
      wide(node("demo", "시연과 쉐도잉", 180, 92, "Demos and shadowing")),
      wide(node("record", "관찰 기록", 180, 148, "Observation record")),
      wide(node("handover", "인계 준비", 180, 204, "Handover prep")),
    ],
    edges: [edge("roles", "demo"), edge("demo", "record"), edge("record", "handover")],
  },
  steps: [
    step(tx("이 레슨의 목적은 교육 중인 상담사를 지원할 때 SME가 무엇을 확인하고, 무엇을 기록하고, 언제 넘기는지 아는 것입니다. 이 강의는 서준 한 사람이 자라는 순서를 따라 단계마다 SME의 절차를 봅니다.", "This lesson is about knowing what an SME checks, records and hands off when supporting an agent in training. This course follows one agent, Seojun, as he grows, and looks at the SME's procedure at each stage."), flow, procedure, null),
    step(tx("서준은 입사 3주 차(예시) 교육생입니다. 이론 교육을 마치고 이번 주부터 OJT로 실제 문의를 처음 받습니다.", "Seojun is a trainee in his third week (Example). He has finished classroom training, and this week he takes real contacts for the first time in OJT."), flow, [], null),
    step(tx("첫 단계는 역할 나누기입니다. 교육 과정과 수료 판단은 트레이너가 맡습니다. SME는 실제 시스템과 도구로 교육 내용이 현장에서 어떻게 쓰이는지 보여 줍니다.", "The first stage is dividing the roles. The trainer owns the curriculum and decides who graduates. The SME uses the real systems and tools to show how the training is used on the floor."), flow, ["roles"], null),
    step(tx("OJT 시작 전에 트레이너와 짧게 맞춥니다. 이번 주에 서준이 받을 채널과 문의 유형, SME가 참관할 시간을 정합니다.", "Before OJT starts, align briefly with the trainer. Agree on the channels and contact types Seojun will take this week, and when the SME will sit in."), flow, ["roles"], null),
    step(tx("둘째 단계는 시연과 쉐도잉입니다. 실제 시스템과 도구로 여러 유형의 티켓을 처리하는 모습을 시연합니다. 멀티 헤드셋을 연결해 SME가 받는 실제 콜을 서준이 함께 듣게 합니다.", "The second stage is demos and shadowing. Demonstrate handling several ticket types in the real systems and tools. Connect a multi-headset so Seojun can listen in on real calls the SME takes."), flow, ["demo"], null),
    step(tx("서준이 직접 콜을 받기 시작하면 반대로 SME가 멀티 헤드셋으로 함께 듣습니다. 서준이 막히면 통화를 잠시 음소거하고 다음 절차를 알려 줍니다.", "When Seojun starts taking calls himself, the SME listens in on the multi-headset instead. If he gets stuck, mute the call for a moment and tell him the next step."), flow, ["demo"], null),
    step(tx("교육 자료와 현장 방식이 다르면 서준에게 따로 고쳐 가르치지 않고 트레이너에게 먼저 전합니다. 교육생은 두 사람에게서 다른 답을 들으면 무엇을 따라야 할지 혼란스러워합니다.", "If the training material and the floor's way differ, don't reteach Seojun on your own; tell the trainer first. Trainees who hear different answers from two people don't know which to follow."), flow, ["demo"], null),
    step(tx("셋째 단계는 관찰 기록입니다. 참관이 끝날 때마다 서준이 혼자 처리한 유형, 도움이 필요했던 유형, 자주 멈춘 지점을 짧게 적습니다.", "The third stage is the observation record. After each session, note briefly the types Seojun handled alone, the types he needed help with, and where he often paused."), flow, ["record"], null),
    step(tx("기록은 평가가 아니라 인계 자료입니다. 점수나 성격이 아니라 어떤 문의에서 어떤 행동이 나왔는지만 적습니다.", "The record is a handover note, not an evaluation. Write only which behavior came up in which contact, not scores or personality."), flow, ["record"], null),
    step(tx("넷째 단계는 인계 준비입니다. 수료 일주일 전(예시)에 트레이너와 기록을 함께 보고, 네스팅에서 더 가까이 볼 문의 유형을 정합니다.", "The fourth stage is preparing the handover. A week before graduation (Example), go through the record with the trainer and choose the contact types to watch more closely in nesting."), flow, ["handover"], null),
    step(tx("수료 여부를 정하는 것은 트레이너와 팀장입니다. SME는 기록을 근거로 의견을 전합니다.", "Whether he graduates is up to the trainer and the team leader. The SME gives an opinion based on the record."), flow, ["handover"], null),
  ],
  checkpoint: [
    {
      id: "trainee-q1",
      prompt: tx("OJT 중 서준이 교육 자료대로 응대했는데, 실제로는 현장에서 쓰지 않는 절차였습니다. 어떻게 할까요?", "During OJT, Seojun followed the training material, but it was a procedure the floor no longer uses. What do you do?"),
      options: [
        option("a", tx("교육 자료는 신경 쓰지 말고 현장 방식대로 하라고 서준에게 말한다.", "Tell Seojun to ignore the training material and do it the floor's way."), tx("서준은 트레이너와 SME에게서 다른 답을 듣게 되고, 교육 자료도 그대로 남아 다음 교육생이 같은 혼란을 겪습니다.", "Seojun then hears different answers from the trainer and the SME, and the material stays as it is, so the next trainee meets the same confusion.")),
        option("b", tx("이번 문의는 함께 바르게 마무리하고, 다른 부분을 트레이너에게 전해 교육 내용을 맞춘다.", "Finish this contact correctly together, and tell the trainer about the difference so the training is brought in line.")),
        option("c", tx("교육 중이니 틀려도 그대로 둔다.", "He is still in training, so let it go even if it is wrong."), tx("고객은 상대가 교육생인지 모릅니다. 실제 문의는 바르게 마무리해야 합니다.", "Customers don't know they are talking to a trainee. Real contacts have to be finished correctly.")),
      ],
      answer: "b",
      explanation: tx("현장과 교육이 다르면 교육생이 아니라 트레이너와 맞춥니다. 그래야 다음 교육생도 같은 답을 듣습니다.", "When the floor and the training differ, align with the trainer, not the trainee. That way the next trainee hears the same answer too."),
    },
    {
      id: "trainee-q2",
      prompt: tx("서준의 OJT 관찰 기록으로 알맞은 것은 무엇일까요?", "Which fits Seojun's OJT observation record?"),
      options: [
        option("a", tx("\"자신감이 부족함\"", "\"Lacks confidence\""), tx("성격에 대한 인상은 네스팅에서 무엇을 도와야 할지 알려 주지 않습니다.", "An impression of personality doesn't tell you what to help with in nesting.")),
        option("b", tx("\"환불 문의에서 본인 확인 다음 단계를 매번 물어봄\"", "\"Asks every time what comes after identity verification in refund contacts\"")),
        option("c", tx("\"OJT 점수 70점(예시)\"", "\"OJT score 70 points (Example)\""), tx("점수를 매기는 것은 트레이너와 QA의 일이고, 숫자만으로는 어떤 문의를 도와야 할지 알 수 없습니다.", "Scoring is the trainer's and QA's job, and a number alone doesn't tell you which contacts to help with.")),
      ],
      answer: "b",
      explanation: tx("관찰 기록은 문의 유형과 행동으로 씁니다. 네스팅에서 어디를 도울지 정하는 인계 자료가 됩니다.", "Write the observation record as contact types and behaviors. It becomes the handover note that decides where to help in nesting."),
    },
  ],
  connection: { to: "graduate", text: tx("서준이 교육을 수료했습니다. 이제 트레이너의 손을 떠나 SME 곁에서 실제 문의를 받는 네스팅입니다.", "Seojun has graduated from training. Next is nesting, where he leaves the trainer's hands and takes real contacts beside the SME.") },
};
