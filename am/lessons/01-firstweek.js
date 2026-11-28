import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 첫걸음, lesson 1. Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md.
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["role", "split", "relations", "lines"];
const flow = ["role", "split", "relations", "lines", "role-split", "split-relations", "relations-lines"];

export default {
  id: "firstweek",
  order: 1,
  title: tx("첫 주: 팀장들을 이끄는 자리", "First Week: Leading Team Leaders"),
  short: tx("첫 주", "First week"),
  subtitle: tx("어제까지 동료였던 팀장들과 새 관계를 세웁니다.", "Build new working relationships with the team leaders who were your peers until yesterday."),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("role", "자리 알기", 180, 36, "Know the role")),
      wide(node("split", "일 나누기", 180, 92, "Split the work")),
      wide(node("relations", "관계 세우기", 180, 148, "Build relationships")),
      wide(node("lines", "보고 길 정하기", 180, 204, "Set reporting lines")),
    ],
    edges: [edge("role", "split"), edge("split", "relations"), edge("relations", "lines")],
  },
  steps: [
    step(tx("이 레슨의 목적은 부매니저가 된 첫 주에 무엇이 달라지는지 알고, 팀장들과 새 관계를 세우는 것입니다. 이 강의는 민석의 처음 몇 달을 따라갑니다.", "This lesson is about what changes in your first week as an assistant manager, and how to build new relationships with the team leaders. The course follows Minseok through his first few months."), flow, procedure, null),
    step(tx("민석은 한국 마켓의 시니어 팀장이었고, 이번 주부터 한국·일본·미국 세 마켓을 함께 보는 부매니저가 되었습니다. 어제까지 옆자리 동료였던 수진 팀장이 오늘부터 민석에게 보고합니다.", "Minseok was a senior team leader in the Korean market, and this week he became the assistant manager over the Korean, Japanese and US markets. Sujin, his peer at the next desk until yesterday, now reports to him."), flow, [], null),
    step(tx("첫 단계는 자리 알기입니다. 팀장은 팀원을 이끌었지만, 부매니저는 팀장들을 이끌고 매니저의 일을 나눠 맡습니다. 내 팀의 숫자가 아니라 프로젝트 전체의 숫자를 봅니다.", "The first stage is knowing the role. A team leader leads agents, but an assistant manager leads team leaders and takes on part of the manager's work. You look at the whole project's numbers, not just your own team's."), flow, ["role"], null),
    step(tx("둘째 단계는 일 나누기입니다. 정은 매니저와 첫 1:1에서 민석이 맡을 일과 매니저가 맡을 일을 적어 둡니다. 마켓 팀장 관리, 비즈니스 리뷰 숫자 준비, 에스컬레이션 보고 점검, 매니저 부재 때 대행이 민석의 몫입니다.", "The second stage is splitting the work. In his first 1:1 with Jeongeun, the manager, Minseok writes down what he owns and what she owns. Managing the market team leaders, preparing business review numbers, checking escalation reports and covering for the manager are his."), flow, ["split"], null),
    step(tx("셋째 단계는 관계 세우기입니다. 팀장마다 따로 1:1을 잡고, 지금 팀의 사정과 민석에게 바라는 것을 먼저 듣습니다. 연차가 쌓인 팀장에게는 잘하는 일을 그대로 맡기고, 신임 팀장에게는 더 자주 곁에 있겠다고 말합니다.", "The third stage is building relationships. He sets a separate 1:1 with each team leader and first listens to how their team is doing and what they want from him. He leaves experienced team leaders to what they do well, and tells the new one he'll be around more often."), flow, ["relations"], null),
    step(tx("오래 함께한 수진 팀장과는 어색할 수 있습니다. 민석은 바뀐 역할을 솔직하게 말하고, 일은 예전처럼 같이 고민하되 결정과 보고는 이제 민석이 맡는다고 분명히 합니다.", "Things may feel awkward with Sujin after so many years together. Minseok is open about the new role, and makes clear that they'll still think problems through together, but decisions and reporting are now his."), flow, ["relations"], null),
    step(tx("넷째 단계는 보고 길 정하기입니다. 팀장들은 언제, 무엇을, 어떤 방법으로 민석에게 보고하는지, 민석은 무엇을 정은 매니저에게 올리는지 정합니다. 보고 길이 정해져야 고객사 질문에 빨리 답할 수 있습니다.", "The fourth stage is setting reporting lines. He agrees when, what and how the team leaders report to him, and what he passes up to Jeongeun. Clear reporting lines let him answer the client's questions quickly."), flow, ["lines"], null),
    step(tx("미소의 한마디: 저도 승진한 첫 주에 예전 동료에게 지시하는 게 가장 어려웠어요. 먼저 듣고, 바뀐 역할을 솔직하게 말한 날부터 편해졌어요.", "A word from Miso: In my first week after promotion, giving instructions to a former peer was the hardest part. It got easier the day I listened first and was honest about my new role."), flow, ["lines"], null),
  ],
  checkpoint: [
    {
      id: "firstweek-q1",
      prompt: tx("부매니저 첫 주, 오래 함께 일한 수진 팀장이 민석에게 \"이제 보고는 어떻게 하면 돼?\"라고 어색하게 묻습니다. 어떻게 할까요?", "In Minseok's first week as AM, Sujin, who has worked with him for years, awkwardly asks, \"So how should I report to you now?\" What does he do?"),
      options: [
        option("a", tx("어색해지지 않게 예전처럼 편하게 지내고, 보고 방법은 따로 정하지 않는다.", "Keep things as relaxed as before to avoid awkwardness, and leave the reporting method undecided."), tx("보고 길이 흐려지면 고객사 질문에 답이 늦어지고, 다른 팀장들과도 기준이 달라집니다.", "Blurry reporting lines slow down answers to the client and leave a different standard from the other team leaders.")),
        option("b", tx("바뀐 역할을 솔직히 말하고, 다른 팀장들과 같은 보고 방법을 정한다.", "Be open about the new role, and agree on the same reporting method as the other team leaders.")),
        option("c", tx("거리를 두기 위해 앞으로는 모든 연락을 메일로만 하겠다고 미리 말해 둔다.", "Keep his distance by telling her in advance that from now on all contact will be by email only."), tx("거리를 두면 팀의 사정을 듣기 어려워집니다. 관계는 지키되 역할과 보고 길만 분명히 하면 됩니다.", "Keeping your distance makes it harder to hear how the team is doing. Keep the relationship, and just make the role and reporting lines clear.")),
      ],
      answer: "b",
      explanation: tx("관계는 이어 가되, 역할과 보고 길은 모든 팀장에게 같은 기준으로 분명히 합니다.", "Keep the relationship going, but make the role and reporting lines clear to every team leader by the same standard."),
    },
    {
      id: "firstweek-q2",
      prompt: tx("부매니저가 되면서 민석의 일에서 가장 크게 달라지는 것은 무엇일까요?", "What changes most in Minseok's work when he becomes an assistant manager?"),
      options: [
        option("a", tx("상담사를 직접 코칭하는 시간이 늘어난다.", "He spends more time coaching agents directly."), tx("상담사 코칭은 여전히 팀장의 일입니다. 부매니저는 팀장들이 코칭을 잘하도록 돕습니다.", "Coaching agents is still the team leader's job. The AM helps team leaders coach well.")),
        option("b", tx("손익과 계약을 혼자 맡아 고객사에 보고한다.", "He takes on P&L and contracts alone and reports them to the client."), tx("손익과 계약은 매니저가 맡습니다. 부매니저는 필요한 숫자를 준비해 돕습니다.", "P&L and contracts belong to the manager. The AM helps by preparing the numbers they need.")),
        option("c", tx("팀장들을 이끌고 매니저의 일을 나눠 맡는다.", "He leads team leaders and takes on part of the manager's work.")),
      ],
      answer: "c",
      explanation: tx("부매니저는 여러 마켓의 팀장을 이끌고 매니저의 일을 나눠 맡으며 다음 자리를 준비합니다.", "An AM leads team leaders across markets and takes on part of the manager's work while getting ready for the next role."),
    },
  ],
  connection: { to: "leaders", text: tx("이제 세 마켓의 팀장을 함께 봅니다. 여러 팀장을 어떻게 관리하는지 봅니다.", "Now he oversees team leaders in three markets. Next, how to manage several team leaders.") },
};
