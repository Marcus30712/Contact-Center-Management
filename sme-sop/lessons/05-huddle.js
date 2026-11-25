import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME SOP 라이브러리, procedure 5. Approved copy: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md (2026-11-25).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["understand", "prepare", "run", "follow"];
const flow = ["understand", "prepare", "run", "follow", "understand-prepare", "prepare-run", "run-follow"];

export default {
  id: "huddle",
  order: 5,
  title: tx("고객사 업데이트 허들", "Client Update Huddle"),
  short: tx("업데이트 허들", "Update huddle"),
  subtitle: tx("바뀐 정책을 먼저 이해하고, 상담사가 고객에게 할 말까지 준비합니다.", "Understand the change first, and prepare what agents should say to customers."),
  roles: tx("고객사 → SME → 상담사 전체", "Client → SME → All agents"),
  personaName: tx("수진", "Sujin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("understand", "내용 이해", 180, 36, "Understand it")),
      wide(node("prepare", "안내 준비", 180, 92, "Prepare the wording")),
      wide(node("run", "허들 진행", 180, 148, "Run the huddle")),
      wide(node("follow", "후속 공유", 180, 204, "Follow up")),
    ],
    edges: [edge("understand", "prepare"), edge("prepare", "run"), edge("run", "follow")],
  },
  steps: [
    step(tx("이 절차의 목적은 고객사가 보낸 정책이나 프로모션 업데이트를 팀 전체가 같은 날, 같은 내용으로 고객에게 안내하게 하는 것입니다.", "This procedure exists so the whole team explains a client's policy or promotion update to customers on the same day, in the same words."), flow, procedure, null),
    step(tx("오후에 고객사가 환불 기간 변경 공지를 보내왔습니다. 내일부터 적용됩니다.", "In the afternoon, the client sent a notice changing the refund period. It takes effect tomorrow."), flow, [], null),
    step(tx("첫 단계는 내용 이해입니다. 무엇이 언제부터 바뀌는지, 누구에게 적용되는지 확인합니다. 모호한 부분은 허들 전에 고객사 담당이나 수진 팀장에게 묻습니다.", "The first step is understanding it. Check what changes, from when, and for whom. Ask the client contact or Sujin about anything unclear before the huddle."), flow, ["understand"], null),
    step(tx("둘째 단계는 안내 준비입니다. 바뀐 점을 세 줄 이내로 정리하고, 상담사가 고객에게 할 안내 문장과 예상 질문의 답을 만듭니다.", "The second step is preparing the wording. Sum up the change in three lines or fewer, and write what agents should say to customers and answers to likely questions."), flow, ["prepare"], null),
    step(tx("셋째 단계는 허들 진행입니다. 교대 시작 전 짧은 허들(예시: 5분)에서 바뀐 점, 안내 문장, 적용 시각을 전합니다. 근무 시간이 다른 상담사를 위해 같은 내용을 글로도 남깁니다.", "The third step is running the huddle. In a short huddle before the shift (Example: 5 minutes), share the change, the wording and when it takes effect. Leave the same content in writing for agents on other shifts."), flow, ["run"], null),
    step(tx("허들에서 바로 답하지 못한 질문은 적어 두고, 확인한 뒤 답합니다. 추측으로 답하면 팀 전체가 잘못 안내하게 됩니다.", "Note any question you can't answer on the spot, and answer it once you've checked. If you guess, the whole team will explain it wrong."), flow, ["run"], null),
    step(tx("넷째 단계는 후속 공유입니다. 허들에서 나온 질문과 답을 팀 채팅방에 올리고, 지식 베이스에 반영되도록 요청합니다.", "The fourth step is following up. Post the questions and answers from the huddle in the team chat, and ask for the knowledge base to be updated."), flow, ["follow"], null),
    step(tx("적용 첫날에는 스크러빙에서 바뀐 정책과 관련된 티켓을 먼저 봅니다. 잘못 안내된 건이 있으면 바로 다시 알립니다.", "On the first day it applies, check tickets about the changed policy first in scrubbing. If something was explained wrong, tell the team again right away."), flow, ["follow"], null),
  ],
  checkpoint: [
    {
      id: "huddle-q1",
      prompt: tx("공지의 \"일부 회원\"이 누구인지 분명하지 않은데, 허들은 10분 뒤입니다. 어떻게 할까요?", "\"Some members\" in the notice is unclear, and the huddle is in 10 minutes. What do you do?"),
      options: [
        option("a", tx("일단 모든 회원에게 적용된다고 전한다.", "Say for now that it applies to all members."), tx("추측으로 전하면 팀 전체가 같은 잘못을 고객에게 안내합니다.", "Passing on a guess means the whole team tells customers the same wrong thing.")),
        option("b", tx("고객사 담당이나 팀장에게 확인하고, 확인 전이라면 그 부분은 확인 중이라고 전한다.", "Check with the client contact or the team leader, and if it isn't confirmed yet, say that part is being checked.")),
        option("c", tx("모호한 부분은 빼고 전한다.", "Leave out the unclear part."), tx("상담사는 그 질문을 받게 되고, 그때마다 각자 다르게 답하게 됩니다.", "Agents will get that question anyway, and each will answer it differently.")),
      ],
      answer: "b",
      explanation: tx("모호한 것은 확인한 뒤 전하고, 확인 중이라면 그렇다고 말합니다.", "Pass on unclear things after checking, and if you're still checking, say so."),
    },
    {
      id: "huddle-q2",
      prompt: tx("야간 근무 상담사들이 허들에 참석하지 못했습니다. 어떻게 할까요?", "Night-shift agents couldn't attend the huddle. What do you do?"),
      options: [
        option("a", tx("다음 날 허들에서 다시 전한다.", "Share it again at the next day's huddle."), tx("그사이 야간 고객은 예전 정책으로 안내받습니다.", "Meanwhile, night customers are told the old policy.")),
        option("b", tx("같은 내용을 글로 남겨 근무 시작 전에 읽게 하고, 야간 담당 SME나 팀장에게도 전한다.", "Leave the same content in writing for them to read before their shift, and pass it to the night SME or team leader too.")),
        option("c", tx("고객이 물으면 그때 SME에게 물어보라고 한다.", "Tell them to ask the SME when a customer asks."), tx("야간에는 SME가 없을 수 있고, 모든 문의가 SME를 거치면 고객 대기가 길어집니다.", "There may be no SME at night, and sending every contact through the SME makes customers wait longer.")),
      ],
      answer: "b",
      explanation: tx("허들에 오지 못한 사람에게도 같은 날, 같은 내용이 닿아야 합니다.", "The same content needs to reach those who missed the huddle, on the same day."),
    },
  ],
  connection: { to: "calibration", text: tx("SME가 팀에 전하는 기준은 고객사 공지만이 아닙니다. 품질 평가 기준도 SME가 현장에 전합니다.", "Client notices aren't the only rules the SME brings to the team. The SME also brings quality standards to the floor.") },
};
