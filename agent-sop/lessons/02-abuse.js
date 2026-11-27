import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 SOP 라이브러리, procedure 2. Approved copy: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md (2026-11-27).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["warn", "approve", "close", "record"];
const flow = ["warn", "approve", "close", "record", "warn-approve", "approve-close", "close-record"];

export default {
  id: "abuse",
  order: 2,
  title: tx("욕설·폭언 고객 응대와 통화 종료", "Handling Abusive Callers and Ending the Call"),
  short: tx("욕설 응대", "Abusive callers"),
  subtitle: tx("참고 버티지 않고, 센터가 정한 순서대로 끝냅니다.", "Don't just endure it; end the call in the order your center sets."),
  roles: tx("상담사 → 직무전문가 또는 팀장", "Agent → SME or Team leader"),
  procedure,
  diagram: {
    nodes: [
      wide(node("warn", "경고", 180, 36, "Warn")),
      wide(node("approve", "승인 받기", 180, 92, "Get approval")),
      wide(node("close", "종료 안내", 180, 148, "Announce the end")),
      wide(node("record", "기록", 180, 204, "Record")),
    ],
    edges: [edge("warn", "approve"), edge("approve", "close"), edge("close", "record")],
  },
  steps: [
    step(tx("이 절차의 목적은 욕설과 폭언이 계속될 때 상담사가 혼자 참지 않고, 센터가 정한 순서대로 통화를 끝내고 기록을 남기는 것입니다.", "This procedure exists so that when abuse and swearing go on, the agent doesn't endure it alone but ends the call in the order the center sets and leaves a record."), flow, procedure, null),
    step(tx("지민의 통화에서 고객이 욕설을 시작합니다. 화가 난 것과 욕설은 다릅니다. 화가 난 고객은 끝까지 듣지만, 욕설은 정해진 절차를 따릅니다.", "A customer on Jimin's call starts swearing. Being angry and swearing are different. Listen to an angry customer to the end, but follow the set procedure for swearing."), flow, [], null),
    step(tx("첫 단계는 경고입니다. 센터가 정한 문구로, 욕설이 계속되면 더 안내할 수 없다고 차분하게 알립니다.", "The first step is warning. Using the center's set wording, calmly say you can't continue helping if the swearing goes on."), flow, ["warn"], null),
    step(tx("정한 횟수(예시: 3회)를 넘으면 다음 단계로 갑니다. 횟수와 문구는 센터마다 다르니, 내 센터의 기준을 미리 알아 둡니다.", "Past the set number of times (Example: 3), move to the next step. The count and the wording differ by center, so know your center's rules ahead of time."), flow, ["warn"], null),
    step(tx("둘째 단계는 승인 받기입니다. 상급자의 승인이 필요한 센터라면, 종료하기 전에 하린이나 수진 팀장에게 말이나 메시지로 승인을 받습니다.", "The second step is getting approval. If your center requires a supervisor's approval, get it from Harin or Sujin by voice or message before ending the call."), flow, ["approve"], null),
    step(tx("셋째 단계는 종료 안내입니다. 욕설로 더 안내할 수 없어 통화를 종료한다고 알린 뒤 끊습니다. 아무 말 없이 끊지 않습니다.", "The third step is announcing the end. Say you are ending the call because you can't continue due to the swearing, then hang up. Don't hang up without a word."), flow, ["close"], null),
    step(tx("넷째 단계는 기록입니다. 상담 기록에 경고한 횟수, 승인한 사람, 욕설로 인한 종료를 남깁니다. 끝난 뒤 힘들면 하린이나 수진 팀장에게 잠시 쉬겠다고 말해도 됩니다.", "The fourth step is recording. In the contact record, note how many warnings you gave, who approved it, and that the call ended due to abuse. If it was hard on you afterward, it's fine to tell Harin or Sujin you need a short break."), flow, ["record"], null),
    step(tx("미소의 한마디: 저는 욕을 듣고도 끝까지 참는 게 프로라고 생각했어요. 절차대로 끊는 것도 일이고, 그 기록이 다음 상담사를 지킨다는 걸 늦게 알았어요.", "A word from Miso: I thought enduring the swearing to the end was being professional. I learned late that ending the call by the procedure is part of the job, and that the record protects the next agent."), flow, ["record"], null),
  ],
  checkpoint: [
    {
      id: "abuse-q1",
      prompt: tx("고객이 처음으로 욕설을 했습니다. 지민이 먼저 할 일은 무엇일까요?", "The customer has sworn for the first time. What does Jimin do first?"),
      options: [
        option("a", tx("승인을 받아 그 자리에서 바로 통화를 끝낸다.", "Get approval and end the call on the spot."), tx("첫 욕설에는 먼저 경고합니다. 정한 횟수를 넘었을 때 종료 절차로 갑니다.", "The first time, you warn. The ending procedure starts only past the set number of times.")),
        option("b", tx("욕설이 처음이니, 센터가 정한 문구로 경고한다.", "Since it's the first time, warn using the center's set wording.")),
        option("c", tx("고객이 진정할 때까지 아무 말 없이 듣고만 있는다.", "Listen in silence until the customer calms down."), tx("참고 듣기만 하면 욕설이 이어집니다. 정한 문구로 경고하는 것이 첫 단계입니다.", "Just listening lets the swearing go on. Warning with the set wording is the first step.")),
      ],
      answer: "b",
      explanation: tx("욕설은 경고부터 시작합니다. 횟수와 문구는 센터가 정한 기준을 따릅니다.", "Swearing starts with a warning. The count and the wording follow your center's rules."),
    },
    {
      id: "abuse-q2",
      prompt: tx("승인을 받아 통화를 종료했습니다. 상담 기록에 무엇을 남길까요?", "With approval, Jimin ended the call. What goes in the contact record?"),
      options: [
        option("a", tx("경고 횟수, 승인한 사람, 욕설로 인한 종료", "The number of warnings, who approved it, and that it ended due to abuse")),
        option("b", tx("고객이 한 욕설을 한 글자도 빠짐없이 그대로", "Every word of the customer's swearing, exactly as said"), tx("욕설을 다 옮겨 적을 필요는 없습니다. 절차를 따랐다는 사실(경고, 승인, 종료)을 남깁니다.", "There's no need to copy out the swearing. Record that you followed the procedure: warnings, approval, ending.")),
        option("c", tx("다음 상담사가 조심하도록, \"악성 고객\"이라는 메모만", "Just a \"difficult customer\" note so the next agent is careful"), tx("낙인 같은 메모는 근거가 되지 않고 다음 응대를 흐립니다. 사실을 적습니다.", "A label-like note isn't evidence and clouds the next contact. Record the facts.")),
      ],
      answer: "a",
      explanation: tx("기록에는 절차를 지켰다는 사실을 남깁니다. 그래야 다음에 같은 고객이 와도 근거가 됩니다.", "The record shows that the procedure was followed. That gives a basis if the same customer calls again."),
    },
  ],
  connection: { to: "absence", text: tx("나를 지키는 절차가 하나 더 있습니다. 다음은 아파서 출근할 수 없을 때입니다.", "There is one more procedure that protects you. Next is what to do when you're too sick to come in.") },
};
