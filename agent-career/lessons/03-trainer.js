import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 3. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Four stages run down one column, like the other ring courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["work", "skills", "prepare", "selection"];
const flow = ["work", "skills", "prepare", "selection", "work-skills", "skills-prepare", "prepare-selection"];

export default {
  id: "trainer",
  order: 3,
  title: tx("트레이너", "Trainer"),
  short: tx("트레이너", "Trainer"),
  subtitle: tx("처음 오는 사람이 바르게 배우게 합니다.", "Help newcomers learn it right."),
  personaName: tx("지민", "Jimin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("work", "하는 일", 180, 36, "The work")),
      wide(node("skills", "필요한 역량", 180, 92, "Skills needed")),
      wide(node("prepare", "지금부터 준비", 180, 148, "Prepare now")),
      wide(node("selection", "뽑을 때 더 보는 것", 180, 204, "What else they look for")),
    ],
    edges: [edge("work", "skills"), edge("skills", "prepare"), edge("prepare", "selection")],
  },
  steps: [
    step(tx("이 레슨의 목적은 트레이너가 무슨 일을 하는지, 그 자리로 가려면 지금부터 무엇을 준비하면 되는지 아는 것입니다.", "This lesson is about knowing what a trainer does, and what to prepare now to get there."), flow, procedure, null),
    step(tx("지민이 교육 첫 주에 만난 사람이 유나였습니다. 그때는 받아 적기 바빴지만, 이제는 앞에서 가르치는 사람의 일이 궁금해졌습니다.", "Yuna was the person Jimin met in her first week of training. Back then she was busy taking notes; now she's curious about the work of the person at the front."), flow, [], null),
    step(tx("첫 단계는 하는 일입니다. 트레이너는 신입 교육을 맡아 제품, 서비스, 시스템, 정책을 가르치고 시험으로 확인합니다. 수료 여부는 팀장과 함께 정합니다.", "The first stage is the work. The trainer runs new-hire training, teaches the products, services, systems and policies, and checks learning with tests. They decide with the team leader who graduates."), flow, ["work"], null),
    step(tx("새 제품이나 정책이 나오면 이미 일하는 상담사에게도 다시 가르칩니다. QA가 찾은 자주 틀리는 부분을 교육 자료에 반영하기도 합니다.", "When a new product or policy comes out, they teach agents who are already working too. They also put the mistakes QA often finds into the training material."), flow, ["work"], null),
    step(tx("둘째 단계는 필요한 역량입니다. 어려운 내용을 쉬운 말로 풀어 설명하는 힘과, 여러 사람 앞에서 말하는 발표력이 필요합니다. 교육생이 어디서 막히는지 시험 결과로 읽는 데이터 분석 기초도 필요합니다.", "The second stage is the skills needed. You need to explain hard things in plain words and to speak in front of a group. Basic data analysis, to read from test results where trainees get stuck, matters too."), flow, ["skills"], null),
    step(tx("셋째 단계는 지금부터 준비하기입니다. 교육과 시험 점수를 꾸준히 높게 받는 것이 첫 준비입니다. 내가 모르는 것은 남에게 가르칠 수 없습니다.", "The third stage is preparing now. Steadily high training and test scores are the first step. You can't teach what you don't know."), flow, ["prepare"], null),
    step(tx("신입이 들어오면 내가 처음에 헷갈렸던 부분을 쉬운 말로 알려 줍니다. 팀 회의에서 바뀐 정책을 짧게 설명할 기회가 오면 손을 듭니다.", "When new hires join, explain in plain words the parts that confused you at first. When there's a chance to explain a policy change briefly at a team meeting, raise your hand."), flow, ["prepare"], null),
    step(tx("넷째 단계는 뽑을 때 더 보는 것입니다. 트레이너를 뽑을 때는 최근 교육·시험 점수와 함께, 사람들 앞에서 알기 쉽게 설명할 수 있는지를 봅니다. 면접에서 짧은 시범 강의(예시: 5분)를 해 보게 하는 곳도 있습니다.", "The fourth stage is what else they look for. When choosing a trainer, they look at your recent training and test scores and whether you can explain clearly in front of people. Some centers ask for a short demo lesson (Example: 5 minutes) in the interview."), flow, ["selection"], null),
    step(tx("미소의 한마디: 저는 교육 때 이해가 안 되는 건 그냥 외웠어요. 왜 그런지 끝까지 물어서 내 말로 설명할 수 있게 해 뒀다면, 나중에 누군가를 가르칠 때 훨씬 편했을 거예요.", "A word from Miso: In training, when I didn't understand something, I just memorized it. If I'd kept asking why until I could explain it in my own words, teaching someone later would have been much easier."), flow, ["selection"], null),
  ],
  checkpoint: [
    {
      id: "trainer-q1",
      prompt: tx("트레이너를 꿈꾸는 지민에게 신입 동료가 바뀐 정책을 물었습니다. 가장 알맞은 것은 무엇일까요?", "Jimin dreams of becoming a trainer, and a new colleague asks her about a policy change. What fits best?"),
      options: [
        option("a", tx("동료가 다음엔 혼자 찾을 수 있게, 쉬운 말로 설명하고 정책 문서의 위치도 보여 준다.", "Explain it in plain words and show where it is in the policy document, so the colleague can find it alone next time.")),
        option("b", tx("트레이너가 할 일이라며 유나에게 물어보라고 한다.", "Say it's the trainer's job and tell them to ask Yuna."), tx("동료가 가까이에서 묻는 순간이 가르치는 연습을 할 좋은 기회입니다. 모르는 부분만 함께 찾아보면 됩니다.", "A colleague asking up close is a good chance to practice teaching. Just look up together the parts you don't know.")),
        option("c", tx("동료가 바빠 보이니 문서를 찾지 않고 기억나는 대로 빠르게 답해 준다.", "The colleague looks busy, so answer quickly from memory without checking the document."), tx("기억이 틀리면 잘못된 내용이 그대로 고객에게 갑니다. 가르칠 때는 문서로 확인한 것을 전합니다.", "If memory is wrong, the wrong answer goes straight to a customer. When teaching, pass on what you've checked in the document.")),
      ],
      answer: "a",
      explanation: tx("쉬운 말로 설명하고 근거가 있는 곳까지 보여 주는 것이 트레이너가 매일 하는 일입니다.", "Explaining in plain words and showing where the source is: that's what a trainer does every day."),
    },
    {
      id: "trainer-q2",
      prompt: tx("트레이너와 QA의 관계로 알맞은 것은 무엇일까요?", "What fits the relationship between the trainer and QA?"),
      options: [
        option("a", tx("트레이너가 교육 뒤 상담사의 품질 점수까지 매겨 관리한다.", "After training, the trainer also scores and tracks agents' quality."), tx("품질 점수는 QA가 매깁니다. 트레이너는 교육과 시험을 맡습니다.", "QA gives quality scores. The trainer runs training and tests.")),
        option("b", tx("QA가 찾은 잦은 실수를 트레이너가 교육에 반영한다.", "The trainer puts the mistakes QA often finds into training.")),
        option("c", tx("두 직무는 팀도 하는 일도 달라 서로 관계가 없다.", "The two roles sit in different teams with different work, so they have nothing to do with each other."), tx("두 직무는 같은 교육개발팀에 속하는 경우가 많고, 품질 결과가 다음 교육으로 이어집니다.", "The two roles often sit in the same Training & Development team, and quality results feed the next training.")),
      ],
      answer: "b",
      explanation: tx("QA가 현장에서 찾은 문제를 트레이너가 교육으로 고칩니다. 두 직무가 함께 상담 품질을 끌어올립니다.", "The trainer uses training to fix the problems QA finds on the floor. Together they raise contact quality."),
    },
  ],
  connection: { to: "tl", text: tx("여기까지는 돕고, 평가하고, 가르치는 길이었습니다. 다음은 팀 전체를 맡는 길, 수진 팀장을 만납니다.", "So far these were the paths of helping, evaluating and teaching. Next is the path that takes on the whole team: meet Sujin the team leader.") },
};
