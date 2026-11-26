import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 5. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Four stages run down one column, like the other ring courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["attendance", "record", "scores", "contribution"];
const flow = ["attendance", "record", "scores", "contribution", "attendance-record", "record-scores", "scores-contribution"];

export default {
  id: "ready",
  order: 5,
  title: tx("다음 자리 준비하기", "Getting Ready for the Next Role"),
  short: tx("준비", "Ready"),
  subtitle: tx("어느 자리든 공통으로 보는 네 가지가 있습니다.", "Every role looks at the same four things."),
  personaName: tx("지민", "Jimin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("attendance", "출석률", 180, 36, "Attendance")),
      wide(node("record", "깨끗한 기록", 180, 92, "Clean record")),
      wide(node("scores", "품질·시험 점수", 180, 148, "Quality and test scores")),
      wide(node("contribution", "팀 기여", 180, 204, "Team contribution")),
    ],
    edges: [edge("attendance", "record"), edge("record", "scores"), edge("scores", "contribution")],
  },
  steps: [
    step(tx("이 레슨의 목적은 어느 직무에 지원하든 공통으로 보는 네 가지를 알고, 오늘부터 쌓는 것입니다. 뽑는 기준은 센터마다 다르지만 기본은 비슷합니다.", "This lesson is about knowing the four things every role looks at, and building them from today. Selection criteria differ by center, but the basics are similar."), flow, procedure, null),
    step(tx("지민이 다음 달 직무전문가 모집 공고를 봤습니다. 지원해도 될지 몰라 미소에게 물었습니다.", "Jimin saw a posting for an SME opening next month. Not sure whether she should apply, she asked Miso."), flow, [], null),
    step(tx("첫 단계는 출석률이고, 무엇보다 중요합니다. 다음 자리는 여러 상담사, 다른 부서와 함께 일하기 때문에 자주 빠지면 팀이나 프로젝트가 필요할 때 흐름이 깨집니다.", "The first stage is attendance, and it matters above all. The roles you'd move into work with many agents and other departments, so when you're often absent, the flow breaks when the team or project needs you."), flow, ["attendance"], null),
    step(tx("품질과 기여가 아무리 높아도 출석률이 낮으면 뽑히기 어렵습니다. 아플 때는 쉬어야 합니다. 다만 지각이나 무단 결근처럼 피할 수 있는 빈자리를 줄이는 것이 가장 큰 믿음이 됩니다.", "However high your quality and contribution, low attendance makes it hard to be chosen. When you're sick, rest. But cutting the gaps you can avoid, like lateness and no-shows, builds the most trust."), flow, ["attendance"], null),
    step(tx("둘째 단계는 깨끗한 기록입니다. 최근 6개월(예시) 동안 고객이나 고객사로부터 받은 클레임이 없는 사람이 선호됩니다. 회사 내규를 어겨 징계를 받은 기록이 없는지도 봅니다.", "The second stage is a clean record. People with no complaints from customers or the client in the last 6 months (Example) are preferred. They also check for any disciplinary record for breaking company rules."), flow, ["record"], null),
    step(tx("기록은 시간이 지나면 보는 기간 밖으로 빠집니다. 지원하고 싶은 때가 있다면, 그 6개월(예시) 전부터가 준비 기간입니다.", "Records fall outside the window as time passes. If you have a time in mind to apply, your preparation starts 6 months (Example) before it."), flow, ["record"], null),
    step(tx("셋째 단계는 품질·시험 점수입니다. 지금 프로젝트의 제품, 서비스, 시스템을 다른 지원자보다 잘 알아야 합니다. 이를 보여 주는 객관적인 지표가 최근 3~6개월(예시)의 QA 품질 점수와 트레이너의 교육·시험 점수입니다.", "The third stage is quality and test scores. You need to know the current project's products, services and systems better than the other applicants. The objective measures are QA quality scores and the trainer's training and test scores from the last 3 to 6 months (Example)."), flow, ["scores"], null),
    step(tx("한 달만 높은 점수보다 몇 달 동안 꾸준한 점수가 강합니다. 매주 평가 리뷰에서 고칠 점 하나를 정해 온 습관이 여기서 숫자로 드러납니다.", "Steady scores over several months beat one high month. The habit of picking one thing to fix in each weekly score review shows up here as numbers."), flow, ["scores"], null),
    step(tx("넷째 단계는 팀 기여입니다. 평소 주변 상담사의 업무를 도와 온 것은 면접에서 더 어필할 수 있는 부분입니다.", "The fourth stage is team contribution. Having helped the agents around you is something extra you can show in the interview."), flow, ["contribution"], null),
    step(tx("VOC에서 고객이 자주 불만을 말하는 이유를 찾아, 근본 원인 분석(RCA) 같은 방법으로 개선안을 논리 있게 제안해 왔다면 더 좋습니다. 면접에서 언제, 무엇을, 왜 했고 결과가 어땠는지 말할 수 있게 기록해 둡니다.", "It's even better if you've found why customers often complain in VOC and proposed fixes logically, using a method like root cause analysis (RCA). Keep a record so you can say in the interview when, what, why, and what came of it."), flow, ["contribution"], null),
    step(tx("미소의 한마디: 저는 모집 공고가 뜨고 나서야 준비를 시작했어요. 출석, 기록, 점수, 기여는 모두 지난 몇 달이 쌓인 결과라서, 공고가 뜬 날은 이미 늦은 날이더라고요.", "A word from Miso: I only started preparing after the posting went up. Attendance, record, scores and contribution are all the sum of the past few months, so the day the posting goes up is already late."), flow, ["contribution"], null),
  ],
  checkpoint: [
    {
      id: "ready-q1",
      prompt: tx("다음 자리 지원자를 볼 때 무엇보다 먼저 보는 것은 무엇일까요?", "When looking at applicants for the next role, what do they look at first?"),
      options: [
        option("a", tx("입사한 지 얼마나 오래됐는지", "How long they've been with the company"), tx("연차보다 최근 몇 달의 출석, 기록, 점수, 기여를 봅니다.", "They look at the last few months of attendance, record, scores and contribution rather than tenure.")),
        option("b", tx("출석률", "Attendance")),
        option("c", tx("팀장과 얼마나 가까운지", "How close they are to the team leader"), tx("친분이 아니라 기록으로 봅니다. 출석률, 클레임과 징계 기록, 품질·시험 점수가 근거가 됩니다.", "It's the record, not closeness. Attendance, complaint and disciplinary records, and quality and test scores are the evidence.")),
      ],
      answer: "b",
      explanation: tx("다음 자리는 여러 사람과 함께 일합니다. 자리를 지켜 온 기록이 가장 먼저 믿음이 됩니다.", "Those roles work with many people. A record of showing up is the first thing that builds trust."),
    },
    {
      id: "ready-q2",
      prompt: tx("면접에서 팀 기여를 가장 잘 보여 주는 말은 무엇일까요?", "In an interview, which statement best shows team contribution?"),
      options: [
        option("a", tx("\"신입 동료들이 막힐 때마다 먼저 다가가 도왔고, 팀 분위기가 좋아졌다는 말을 많이 들었습니다.\"", "\"Whenever new colleagues got stuck, I went over to help first, and many people said the team mood got better.\""), tx("무엇을 어떻게 도왔고 결과가 어땠는지 사실이 빠져 있어 근거가 되지 않습니다.", "It leaves out the facts of what she helped with, how, and what came of it, so it isn't evidence.")),
        option("b", tx("\"제 품질 점수가 몇 달째 팀에서 가장 높았고, 처리 시간도 가장 짧습니다.\"", "\"My quality score has been the team's highest for months, and my handling time is the shortest.\""), tx("점수는 품질·시험 점수 항목에서 봅니다. 팀 기여는 내 점수가 아니라 다른 사람과 팀을 위해 한 일입니다.", "Scores belong to the quality and test scores criterion. Team contribution is what you did for others and the team, not your own score.")),
        option("c", tx("\"VOC로 배송 지연 문의 원인을 찾아 문구 변경을 제안했고, 다음 달 그 문의가 줄었습니다.\"", "\"Using VOC, I found why delivery-delay contacts were frequent and proposed new wording; the next month those contacts dropped.\"")),
      ],
      answer: "c",
      explanation: tx("팀 기여는 언제, 무엇을, 왜 했고 결과가 어땠는지로 말합니다. 원인을 찾아 개선안을 낸 경험은 근거가 분명해 힘이 됩니다.", "Describe team contribution as when, what, why, and what came of it. Experience of finding a cause and proposing a fix has clear evidence, and that gives it weight."),
    },
  ],
  connection: { to: "home", text: tx("상담사 커리어 라이프사이클을 마쳤습니다. 오늘의 출석과 이번 주 평가 리뷰가 다음 자리를 위한 준비의 시작입니다.", "You've finished Agent Career Lifecycle. Today's attendance and this week's score review are where preparing for your next role begins.") },
};
