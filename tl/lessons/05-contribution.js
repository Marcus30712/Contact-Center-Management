import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 첫걸음, lesson 5. Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["goals", "compare", "strengths", "summary"];
const flow = ["goals", "compare", "strengths", "summary", "goals-compare", "compare-strengths", "strengths-summary"];

export default {
  id: "contribution",
  order: 5,
  title: tx("팀의 기여 파악", "Understanding the Team's Contribution"),
  short: tx("팀의 기여", "Contribution"),
  subtitle: tx("프로젝트 전체에서 이 팀이 해 온 몫과 강점, 약점을 정리합니다.", "Sum up what this team has carried in the project, and its strengths and gaps."),
  personaName: tx("하린", "Harin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("goals", "목표와 결과", 180, 36, "Goals and results")),
      wide(node("compare", "다른 팀과 비교", 180, 92, "Compare teams")),
      wide(node("strengths", "강점과 약점", 180, 148, "Strengths and gaps")),
      wide(node("summary", "한 장 요약", 180, 204, "One-page summary")),
    ],
    edges: [edge("goals", "compare"), edge("compare", "strengths"), edge("strengths", "summary")],
  },
  steps: [
    step(tx("이 레슨의 목적은 이 팀이 프로젝트 전체에서 어떤 몫을 해 왔는지, 어디가 우수했고 어디가 모자랐는지 정리하는 것입니다.", "This lesson is about summing up what this team has contributed to the whole project, where it excelled and where it fell short."), flow, procedure, null),
    step(tx("첫 단계는 목표와 결과입니다. 프로젝트가 이 팀에 기대한 목표(스케줄 준수율, 품질, 처리량)와 지난 몇 달의 실제 결과를 나란히 놓습니다.", "The first stage is goals and results. Put the goals the project set for this team (schedule adherence, quality, volume) next to the actual results of the last few months."), flow, ["goals"], null),
    step(tx("둘째 단계는 다른 팀과 비교입니다. 같은 프로젝트의 다른 팀과 비교하면, 우리 팀만의 문제인지 프로젝트 전체의 문제인지 구분됩니다.", "The second stage is comparing with other teams. Comparing with other teams on the same project shows whether a problem is just yours or the whole project's."), flow, ["compare"], null),
    step(tx("비교는 순위를 매기기 위한 것이 아닙니다. 다른 팀이 잘하는 방식에서 배울 점을 찾기 위해서입니다.", "Comparing isn't for ranking. It's for finding what you can learn from how other teams do well."), flow, ["compare"], null),
    step(tx("셋째 단계는 강점과 약점입니다. 예를 들어 \"채팅 품질은 프로젝트 1위(예시), 스케줄 준수율은 목표 미달\"처럼 구체적으로 적습니다.", "The third stage is strengths and gaps. Write them specifically, for example \"chat quality first in the project (Example), schedule adherence below target.\""), flow, ["strengths"], null),
    step(tx("원인을 함께 봅니다. 직무전문가 하린의 스크러빙과 VOC 기록에서 고객 불만의 주제를, QA 도현의 기록에서 팀 공통 감점 항목을 확인합니다.", "Look at the causes too. Check customer complaint topics in Harin's scrubbing and VOC records, and team-wide point losses in Dohyun's QA records."), flow, ["strengths"], null),
    step(tx("팀이 바꿀 수 있는 것과 바꿀 수 없는 것을 나눕니다. 정책이나 시스템 때문이라면 팀의 약점이 아니라 위로 올려야 할 문제입니다.", "Separate what the team can change from what it can't. If the cause is a policy or a system, it isn't the team's weakness but an issue to raise."), flow, ["strengths"], null),
    step(tx("넷째 단계는 한 장 요약입니다. 팀의 목표, 결과, 강점, 약점, 원인을 한 장에 정리합니다. 이 요약을 들고 레슨 7에서 부매니저를 만납니다.", "The fourth stage is the one-page summary. Put the team's goals, results, strengths, gaps and causes on one page. You take this summary to your assistant manager in lesson 7."), flow, ["summary"], null),
  ],
  checkpoint: [
    {
      id: "contribution-q1",
      prompt: tx("이 팀의 스케줄 준수율이 목표에 못 미칩니다. 먼저 확인할 것은 무엇일까요?", "This team's schedule adherence is below target. What do you check first?"),
      options: [
        option("a", tx("팀원들에게 스케줄을 더 잘 지키라고 공지한다.", "Tell the team to keep to their schedules better."), tx("원인을 모른 채 공지만 하면 같은 일이 되풀이됩니다.", "A notice sent without knowing the cause only lets the same thing happen again.")),
        option("b", tx("같은 프로젝트의 다른 팀도 같은지 보고, 원인이 팀 안에 있는지 밖에 있는지 나눈다.", "See whether other teams on the project are the same, and separate causes inside the team from those outside.")),
        option("c", tx("목표가 잘못됐다고 보고 신경 쓰지 않는다.", "Decide the target is wrong and ignore it."), tx("목표가 현실과 맞지 않더라도 근거를 갖고 위로 올려야 바뀝니다.", "Even when a target doesn't fit reality, it changes only when you raise it with evidence.")),
      ],
      answer: "b",
      explanation: tx("비교로 원인이 팀 안에 있는지 밖에 있는지부터 나눕니다.", "Compare first to separate causes inside the team from those outside it."),
    },
    {
      id: "contribution-q2",
      prompt: tx("팀 요약 한 장에 알맞은 것은 무엇일까요?", "What fits the team's one-page summary?"),
      options: [
        option("a", tx("팀원별 순위표", "A ranking of team members"), tx("순위는 누가 낮은지만 보여 줄 뿐, 팀이 무엇을 해 왔는지는 알려 주지 않습니다.", "A ranking shows only who is lowest, not what the team has done.")),
        option("b", tx("목표와 결과, 강점과 약점, 그리고 원인", "Goals and results, strengths and gaps, and their causes")),
        option("c", tx("지난 6개월의 모든 지표 원본", "Raw data for every metric over the last 6 months"), tx("원본만 있으면 읽는 사람이 무엇이 중요한지 다시 찾아야 합니다.", "With only raw data, readers have to work out again what matters.")),
      ],
      answer: "b",
      explanation: tx("요약은 목표 대비 결과와 그 이유를 한눈에 보여 줘야 합니다.", "A summary should show results against goals, and why, at a glance."),
    },
  ],
  connection: { to: "oneonone", text: tx("팀 전체의 모습이 보입니다. 이제 다시 한 사람씩, 각자를 어떻게 도울지 정합니다.", "You can see the whole team now. Next, go back to one person at a time and decide how to help each.") },
};
