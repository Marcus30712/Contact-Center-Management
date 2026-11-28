import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 첫걸음, lesson 4. Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["pick", "listen", "habits", "cause"];
const flow = ["pick", "listen", "habits", "cause", "pick-listen", "listen-habits", "habits-cause"];

export default {
  id: "listen",
  order: 4,
  title: tx("녹취와 티켓 직접 보기", "Listening to Calls and Reading Tickets"),
  short: tx("직접 보기", "Look closer"),
  subtitle: tx("숫자 뒤에서 실제로 어떻게 일하는지 확인합니다.", "See how people really work behind the numbers."),
  procedure,
  diagram: {
    nodes: [
      wide(node("pick", "고르기", 180, 36, "Pick contacts")),
      wide(node("listen", "듣고 읽기", 180, 92, "Listen and read")),
      wide(node("habits", "습관 찾기", 180, 148, "Find habits")),
      wide(node("cause", "원인 확인", 180, 204, "Check the cause")),
    ],
    edges: [edge("pick", "listen"), edge("listen", "habits"), edge("habits", "cause")],
  },
  steps: [
    step(tx("이 레슨의 목적은 녹취와 티켓을 직접 보며, 팀원마다 실제로 어떻게 일하는지 확인하는 것입니다.", "This lesson is about listening to call recordings and reading tickets yourself to see how each team member actually works."), flow, procedure, null),
    step(tx("첫 단계는 고르기입니다. 팀원마다 몇 건씩(예시: 3~5건) 고르되, 잘 끝난 건과 불만으로 끝난 건을 섞습니다. 레슨 3의 메모에 적은 질문과 관련된 건을 먼저 고릅니다.", "The first stage is picking contacts. Pick a few per person (Example: 3 to 5), mixing ones that ended well with ones that ended in complaints. Start with contacts related to the questions in your lesson 3 notes."), flow, ["pick"], null),
    step(tx("둘째 단계는 듣고 읽기입니다. 인사, 문제 파악, 안내, 마무리의 흐름을 따라가며 무엇을 잘했고 어디서 흔들렸는지 적습니다.", "The second stage is listening and reading. Follow the flow of greeting, understanding the problem, explaining and closing, and note what went well and where it wobbled."), flow, ["listen"], null),
    step(tx("준호의 콜을 들어 보니, 문제를 빨리 해결하지만 고객이 이해했는지 확인하지 않고 끝냅니다. 처리 건수는 많고 품질 점수는 낮았던 이유가 보입니다.", "Listening to Junho's calls, you hear him solve problems quickly but end without checking that the customer understood. That explains his high volume and low quality score."), flow, ["listen"], null),
    step(tx("셋째 단계는 습관 찾기입니다. 한 건의 실수가 아니라 여러 건에서 반복되는 모습을 찾습니다. 좋은 습관도 똑같이 적습니다.", "The third stage is finding habits. Look for what repeats across several contacts, not a single mistake. Note good habits the same way."), flow, ["habits"], null),
    step(tx("QA 도현과 같은 건을 함께 들어 보면 좋습니다. 같은 콜을 두고 무엇을 보는지 맞추면, 나중에 코칭할 때 기준이 어긋나지 않습니다.", "It helps to listen to the same contacts with Dohyun from QA. Agreeing on what you each listen for keeps your standards aligned when you coach later."), flow, ["habits"], null),
    step(tx("넷째 단계는 원인 확인입니다. 찾은 습관이 그 사람만의 습관인지, 교육에서 그렇게 배웠기 때문인지 트레이너 유나에게 확인합니다.", "The fourth stage is checking the cause. Ask Yuna the trainer whether a habit you found is the person's own or how they were taught in training."), flow, ["cause"], null),
    step(tx("교육 내용이 원인이라면 한 사람을 코칭할 일이 아니라 교육을 고칠 일입니다. 트레이너와 함께 다음 교육에 반영합니다.", "If the training is the cause, the fix is the training, not coaching one person. Work it into the next training with the trainer."), flow, ["cause"], null),
  ],
  checkpoint: [
    {
      id: "listen-q1",
      prompt: tx("지민의 콜 한 건에서 사소한 안내 하나를 빠뜨린 것을 발견했습니다. 어떻게 기록할까요?", "In one of Jimin's calls, you notice she left out a minor explanation. How do you record it?"),
      options: [
        option("a", tx("나중에 코칭 근거가 되게, 지민의 습관으로 메모해 둔다.", "Note it as Jimin's habit, so you have grounds for coaching later."), tx("한 건은 아직 습관이 아닙니다. 다른 건에서도 나오는지 봅니다.", "One contact isn't a habit yet. See whether it shows up in others.")),
        option("b", tx("한 건은 우연일 수 있으니, 몇 건 더 듣고 반복되면 습관으로 적는다.", "One call could be chance, so listen to a few more and note it as a habit if it repeats.")),
        option("c", tx("반복을 막으려고, 그 자리에서 바로 지민을 불러 주의를 주고 다시 설명한다.", "To stop it repeating, call Jimin over on the spot, warn her and explain again."), tx("파악하는 단계에서 한 건으로 지적하면, 팀원은 새 팀장을 감시자로 느낍니다.", "Pointing out a single contact while you're still getting to know the team makes people see the new TL as a watchdog.")),
      ],
      answer: "b",
      explanation: tx("여러 건에서 반복될 때 습관이라고 봅니다. 다만 필수 고지처럼 꼭 해야 하는 안내라면 한 건이라도 바로 바로잡습니다.", "Call it a habit when it repeats across several contacts. But if it is a required disclosure, correct it right away, even once."),
    },
    {
      id: "listen-q2",
      prompt: tx("여러 상담사가 같은 방식으로 안내를 잘못하고 있습니다. 먼저 확인할 것은 무엇일까요?", "Several agents are giving the same wrong explanation. What do you check first?"),
      options: [
        option("a", tx("잘못 안내한 상담사들을 한 명씩 불러 코칭한다.", "Call in each agent who got it wrong and coach them one by one."), tx("원인이 교육에 있다면 코칭을 해도 다음 기수에서 같은 일이 생깁니다.", "If the cause is the training, the next class will make the same mistake even after coaching.")),
        option("b", tx("트레이너에게 교육에서 그렇게 가르쳤는지 확인한다.", "Ask the trainer whether it was taught that way in training.")),
        option("c", tx("팀 허들에서 잘못을 지적한다.", "Point out the mistake at the team huddle."), tx("원인을 모른 채 지적하면 상담사들은 배운 대로 했을 뿐이라고 느낍니다.", "Pointing it out without knowing the cause makes agents feel they only did what they were taught.")),
      ],
      answer: "b",
      explanation: tx("여러 사람이 같은 실수를 하면 사람보다 원인을 먼저 확인합니다. 다만 잘못된 안내가 지금도 고객에게 나가고 있다면, 바른 안내부터 팀에 바로 공유합니다.", "When several people make the same mistake, check the cause before the people. But if the wrong explanation is still reaching customers, share the correct one with the team right away."),
    },
  ],
  connection: { to: "contribution", text: tx("한 사람씩 어떻게 일하는지 보았습니다. 이제 눈을 넓혀, 이 팀이 프로젝트 전체에서 어떤 몫을 해 왔는지 봅니다.", "You've seen how each person works. Now widen the view to what this team has contributed to the whole project.") },
};
