import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 첫걸음, lesson 2. Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["basics", "skills", "pattern", "current"];
const flow = ["basics", "skills", "pattern", "current", "basics-skills", "skills-pattern", "pattern-current"];

export default {
  id: "roster",
  order: 2,
  title: tx("로스터 만들기", "Building the Roster"),
  short: tx("로스터", "Roster"),
  subtitle: tx("팀원마다 무엇을 할 수 있고 무엇을 해 왔는지 한곳에 모읍니다.", "Gather in one place what each team member can do and has done."),
  procedure,
  diagram: {
    nodes: [
      wide(node("basics", "기본 정보", 180, 36, "Basic details")),
      wide(node("skills", "스킬과 업무", 180, 92, "Skills and work")),
      wide(node("pattern", "근무 형태", 180, 148, "Work pattern")),
      wide(node("current", "계속 고치기", 180, 204, "Keep it current")),
    ],
    edges: [edge("basics", "skills"), edge("skills", "pattern"), edge("pattern", "current")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀원 한 사람 한 사람의 정보를 로스터 한 장에 모아, 팀을 한눈에 보는 것입니다.", "This lesson is about gathering each team member's details on one roster, so you can see the whole team at a glance."), flow, procedure, null),
    step(tx("첫 단계는 기본 정보입니다. 이름, 입사일, 정식 팀 합류일, 교육 기수를 적습니다. 서준처럼 합류한 지 얼마 안 된 사람과 지민처럼 2년째인 사람은 도울 방식이 다릅니다.", "The first stage is basic details. Note each person's name, start date, the date they joined the team and their training class. Someone who joined recently like Seojun and someone in their second year like Jimin need different kinds of help."), flow, ["basics"], null),
    step(tx("둘째 단계는 스킬과 업무입니다. 처리할 수 있는 채널과 문의 유형, 맡아 온 일을 적습니다. 예를 들어 준호는 선임으로 신입 버디와 어려운 케이스 검토를 맡아 왔습니다.", "The second stage is skills and work. Note the channels and contact types each person can handle and the work they have taken on. For example, Junho, as a senior agent, has been a new-hire buddy and has reviewed hard cases."), flow, ["skills"], null),
    step(tx("기록만으로 모르는 것은 사람에게 묻습니다. SME 하린은 누가 어떤 유형에서 막히는지, 트레이너 유나는 누가 어떤 교육을 받았는지 알고 있습니다.", "Ask people about what the records don't show. Harin the SME knows who gets stuck on which types, and Yuna the trainer knows who has had which training."), flow, ["skills"], null),
    step(tx("셋째 단계는 근무 형태입니다. 근무 시간대, 정해진 휴가, 파트타임 여부를 적습니다. 인력 계획과 코칭 일정을 짤 때 필요합니다.", "The third stage is the work pattern. Note shift times, scheduled leave and whether someone works part-time. You need these when planning staffing and coaching."), flow, ["pattern"], null),
    step(tx("로스터에는 사실만 적습니다. \"성실함\"처럼 인상을 적으면 나중에 다른 사람이 볼 때 근거가 없습니다.", "Put only facts on the roster. If you write impressions like \"diligent,\" others who read it later have nothing to go on."), flow, ["pattern"], null),
    step(tx("개인 정보는 필요한 만큼만 정해진 곳에 둡니다. 로스터는 팀장과 꼭 필요한 사람만 봅니다.", "Keep personal details to what is needed, in the agreed place. Only the team leader and those who truly need it see the roster."), flow, ["pattern"], null),
    step(tx("넷째 단계는 계속 고치기입니다. 로스터는 첫 주에 한 번 만들고 끝나는 문서가 아닙니다. 새 스킬을 배우거나 업무가 바뀌면 그때마다 고칩니다.", "The fourth stage is keeping it current. The roster isn't a document you make once in the first week. Update it whenever someone learns a new skill or their work changes."), flow, ["current"], null),
  ],
  checkpoint: [
    {
      id: "roster-q1",
      prompt: tx("로스터의 \"스킬\" 칸에 알맞은 것은 무엇일까요?", "What fits the \"Skills\" column of the roster?"),
      options: [
        option("a", tx("\"열정적이고 성실함\"", "\"Passionate and diligent\""), tx("성격에 대한 인상은 어떤 일을 맡길 수 있는지 알려 주지 않습니다.", "An impression of personality doesn't tell you what work you can give someone.")),
        option("b", tx("\"채팅·이메일 가능, 환불·배송 문의 처리, 신입 버디 경험\"", "\"Chat and email; refund and delivery contacts; new-hire buddy experience\"")),
        option("c", tx("\"지난달 CSAT 팀 3위\"", "\"Third on the team for CSAT last month\""), tx("순위는 성과 기록에 둡니다. 스킬 칸은 할 수 있는 일을 적는 곳입니다.", "Rankings belong in the results record. The skills column is for what someone can do.")),
      ],
      answer: "b",
      explanation: tx("스킬은 할 수 있는 채널, 문의 유형, 맡아 본 일로 적습니다.", "Write skills as the channels, contact types and work someone has taken on."),
    },
    {
      id: "roster-q2",
      prompt: tx("기록에는 없지만 서준이 어떤 유형에서 자주 막히는지 알고 싶습니다. 누구에게 묻는 것이 알맞을까요?", "The records don't show it, but you want to know which types Seojun often gets stuck on. Whom should you ask?"),
      options: [
        option("a", tx("같은 팀 상담사들에게 서준에 대해 묻는다.", "Ask the other agents on the team about Seojun."), tx("동료에게 다른 사람을 평가하게 하면 팀 안에 불편한 분위기가 생깁니다.", "Asking colleagues to judge someone creates an uneasy mood in the team.")),
        option("b", tx("서준을 가까이에서 도와 온 SME 하린에게 묻는다.", "Ask Harin, the SME who has helped Seojun up close.")),
        option("c", tx("묻지 않고 숫자에 나타날 때까지 기다린다.", "Don't ask; wait until it shows in the numbers."), tx("숫자에 나타날 때쯤이면 서준은 이미 오래 막혀 있었을 수 있습니다.", "By the time it shows in the numbers, Seojun may have been stuck for a long time.")),
      ],
      answer: "b",
      explanation: tx("상담사가 어디서 막히는지는 매일 도와 온 SME가 가장 잘 압니다.", "The SME who helps agents every day knows best where they get stuck."),
    },
  ],
  connection: { to: "results", text: tx("로스터로 누가 있는지 알았습니다. 이제 각자 어떤 성과를 내 왔는지 볼 차례입니다.", "The roster shows who is on the team. Next, look at the results each person has delivered.") },
};
