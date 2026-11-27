import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 첫걸음, lesson 1. Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md (2026-11-26).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["onboarding", "training", "nesting", "golive"];
const flow = ["onboarding", "training", "nesting", "golive", "onboarding-training", "training-nesting", "nesting-golive"];

export default {
  id: "start",
  order: 1,
  title: tx("첫 출근", "Your First Day at Work"),
  short: tx("첫 출근", "First day"),
  subtitle: tx("앞으로 반년의 길을 미리 보고, 함께 일할 사람들을 익힙니다.", "See the road ahead for the next half year, and get to know the people you'll work with."),
  procedure,
  diagram: {
    nodes: [
      wide(node("onboarding", "온보딩", 180, 36, "Onboarding")),
      wide(node("training", "교육", 180, 92, "Training")),
      wide(node("nesting", "OJT와 네스팅", 180, 148, "OJT and nesting")),
      wide(node("golive", "실전 배치", 180, 204, "Go Live")),
    ],
    edges: [edge("onboarding", "training"), edge("training", "nesting"), edge("nesting", "golive")],
  },
  steps: [
    step(tx("이 레슨의 목적은 첫 출근 날, 앞으로 걸어갈 길과 함께 일할 사람들을 미리 알아 두는 것입니다. 이 강의는 지민의 처음 반년을 따라갑니다.", "This lesson is about knowing, on your first day at work, the road ahead and the people you'll work with. The course follows Jimin through the first half year."), flow, procedure, null),
    step(tx("지민은 오늘 처음 고객센터에 출근했습니다. 면접은 지나갔지만, 앞으로 무엇을 배우고 언제 실제 고객을 만나는지는 아직 모릅니다.", "Today is Jimin's first day at a contact center. The interview is behind her, but she doesn't yet know what she'll learn or when she'll meet real customers."), flow, [], null),
    step(tx("첫 단계는 온보딩입니다. 회사와 프로젝트를 소개받고, 팀장과 동료, 직무전문가의 얼굴과 이름을 익힙니다.", "The first stage is onboarding. You're introduced to the company and the project, and you learn the faces and names of your team leader, colleagues and SME."), flow, ["onboarding"], null),
    step(tx("둘째 단계는 교육입니다. 프로젝트의 제품과 서비스, 시스템과 CRM 도구를 배웁니다. 처음이라면 가장 오래 걸리고 가장 어려운 시간입니다.", "The second stage is training. You learn the project's products and services, its systems and its CRM tools. If you're new to this, it's the longest and hardest stretch."), flow, ["training"], null),
    step(tx("셋째 단계는 OJT와 네스팅입니다. 트레이너와 직무전문가가 지켜보는 가운데 실제 문의를 받고, 신입끼리 모인 자리에서 조금 더 도움을 받으며 일합니다. 네스팅이 끝날 때 트레이너와 팀장이 함께 수료 여부를 정합니다.", "The third stage is OJT and nesting. You handle real contacts while the trainer and SME watch, then work in a group of new hires with closer support. At the end of nesting, the trainer and team leader decide together whether you graduate."), flow, ["nesting"], null),
    step(tx("넷째 단계는 실전 배치입니다. 수료하면 정식 팀에 합류해 혼자 문의를 받기 시작합니다. 레슨 4에서 다룹니다.", "The fourth stage is Go Live. Once you graduate, you join the regular team and start handling contacts on your own. Lesson 4 covers this."), flow, ["golive"], null),
    step(tx("첫 주에는 사람을 익히는 데 시간을 씁니다. 팀장은 수진, 플로어 선임은 준호, 직무전문가는 하린, 교육은 트레이너 유나가 맡고, 상담 품질은 QA 도현이 평가합니다.", "Spend the first week learning who is who. Sujin is the team leader, Junho is a senior agent on the floor, Harin is the SME, Yuna the trainer teaches you, and Dohyun from QA scores contact quality."), flow, ["onboarding"], null),
    step(tx("이름이 바로 외워지지 않으면 자리 배치도나 메신저 프로필을 보며 이름과 역할을 메모해 둡니다. 누구에게 무엇을 물으면 되는지 아는 것이 이름보다 먼저입니다.", "If names don't stick, use the seating plan or chat profiles to note down names and roles. Knowing whom to ask about what comes before names."), flow, ["onboarding"], null),
    step(tx("미소의 한마디: 저도 처음엔 이 길이 끝없어 보였어요. 익숙해지기까지 반년쯤 걸렸으니, 첫 주에 모든 걸 알려고 하지 않아도 괜찮아요.", "A word from Miso: At first this road looked endless to me too. It took me about half a year to feel at home, so you don't need to know everything in your first week."), flow, ["golive"], null),
  ],
  checkpoint: [
    {
      id: "start-q1",
      prompt: tx("첫 주, 지민은 동료들의 이름이 잘 외워지지 않습니다. 어떻게 할까요?", "In her first week, Jimin can't remember her colleagues' names. What should she do?"),
      options: [
        option("a", tx("이름을 다 외울 때까지 누구에게도 묻지 않는다.", "Ask no one anything until she knows every name."), tx("묻지 않으면 배우는 속도가 느려집니다. 이름보다 누구에게 무엇을 묻는지가 먼저입니다.", "Not asking slows down learning. Knowing whom to ask about what comes before names.")),
        option("b", tx("자리와 역할을 메모하고, 누구에게 무엇을 물을지부터 익힌다.", "Note seats and roles, and learn first whom to ask about what.")),
        option("c", tx("첫 주에는 교육 내용만 외우고, 사람은 신경 쓰지 않는다.", "In the first week, memorize only the training content and don't bother with people."), tx("사람을 알아야 막힐 때 도움을 청할 수 있습니다. 이름과 역할은 시간을 두고 익히면 됩니다.", "Knowing people is how you get help when you're stuck. Learn names and roles over time.")),
      ],
      answer: "b",
      explanation: tx("첫 주에는 사람과 역할을 익히는 것이 일입니다.", "In the first week, learning the people and their roles is the job."),
    },
    {
      id: "start-q2",
      prompt: tx("신입 상담사가 거치는 순서로 알맞은 것은 무엇일까요?", "Which order does a new agent go through?"),
      options: [
        option("a", tx("온보딩 → OJT와 네스팅 → 교육 → 실전 배치", "Onboarding → OJT and nesting → training → Go Live"), tx("제품과 시스템을 배우기 전에 실제 문의를 받으면 고객도 상담사도 힘들어집니다.", "Handling real contacts before learning the products and systems is hard on the customer and the agent.")),
        option("b", tx("온보딩 → 교육 → OJT와 네스팅 → 실전 배치", "Onboarding → training → OJT and nesting → Go Live")),
        option("c", tx("온보딩 → 교육 → 실전 배치 → OJT와 네스팅", "Onboarding → training → Go Live → OJT and nesting"), tx("OJT와 네스팅은 혼자 받기 전에 도움을 받으며 연습하는 단계입니다.", "OJT and nesting are where you practice with support before working alone.")),
      ],
      answer: "b",
      explanation: tx("배우고, 도움을 받으며 해 보고, 그다음 혼자 합니다.", "Learn, try it with support, then do it alone."),
    },
  ],
  connection: { to: "training", text: tx("가장 오래 걸리는 단계는 교육입니다. 교육을 버티는 요령부터 봅니다.", "The longest stage is training. First, how to get through it.") },
};
