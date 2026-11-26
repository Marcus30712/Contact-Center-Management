import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 2. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Four stages run down one column, like the other ring courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["work", "skills", "prepare", "selection"];
const flow = ["work", "skills", "prepare", "selection", "work-skills", "skills-prepare", "prepare-selection"];

export default {
  id: "qa",
  order: 2,
  title: tx("QA", "QA"),
  short: tx("QA", "QA"),
  subtitle: tx("상담의 품질을 같은 기준으로 잽니다.", "Measure contact quality against the same standard."),
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
    step(tx("이 레슨의 목적은 QA가 무슨 일을 하는지, 그 자리로 가려면 지금부터 무엇을 준비하면 되는지 아는 것입니다.", "This lesson is about knowing what a QA does, and what to prepare now to get there."), flow, procedure, null),
    step(tx("지민은 매주 평가 리뷰에서 도현이 매긴 품질 점수를 받아 봅니다. 늘 점수만 보다가, 오늘은 점수를 매기는 사람의 일을 묻기로 했습니다.", "Every week in her score review, Jimin sees the quality scores Dohyun gave. She has always looked only at the score; today she asks about the work of the person who gives it."), flow, [], null),
    step(tx("첫 단계는 하는 일입니다. QA는 콜 녹취와 채팅, 이메일을 정해진 평가 기준으로 확인하고 점수를 매깁니다. 결과를 팀장과 상담사에게 돌려주어 코칭의 근거가 되게 합니다.", "The first stage is the work. QA checks call recordings, chats and emails against a set scoring standard and gives scores. They send the results back to the team leader and agents so coaching has evidence to stand on."), flow, ["work"], null),
    step(tx("같은 녹취를 QA, 팀장, 직무전문가, 트레이너가 함께 듣고 점수를 맞추는 교정 회의(Calibration)도 엽니다. 평가하는 사람마다 점수가 다르면 상담사가 점수를 믿지 못하기 때문입니다.", "QA also runs calibration, where QA, the team leader, the SME and the trainer listen to the same recording and line up their scores. If scores differ by who gives them, agents stop trusting them."), flow, ["work"], null),
    step(tx("둘째 단계는 필요한 역량입니다. 평가 기준을 정확히 알고, 누가 들어도 같은 점수가 나오게 매기는 꼼꼼함이 필요합니다. 점수를 모아 어디서 자주 깎이는지 보는 데이터 분석 기초도 필요합니다.", "The second stage is the skills needed. You need to know the standard exactly and score carefully enough that anyone would reach the same score. Basic data analysis, to see where points are often lost, matters too."), flow, ["skills"], null),
    step(tx("셋째 단계는 지금부터 준비하기입니다. 평가표를 받으면 총점보다 항목마다 왜 깎였는지를 읽습니다. 평가 기준을 잘 알수록 내 상담도 좋아지고 QA의 눈도 생깁니다.", "The third stage is preparing now. When you get your score sheet, read why points were lost on each item, not just the total. The better you know the standard, the better your own contacts get and the more you see like a QA."), flow, ["prepare"], null),
    step(tx("내 녹취를 들을 수 있다면, 또는 평가 리뷰 때 함께 들으며 평가표로 스스로 점수를 매겨 보고 도현의 점수와 비교합니다. 차이가 나는 항목이 내가 아직 모르는 기준입니다.", "If you can play back your recording, or when you listen to it together in a score review, score it yourself with the sheet and compare with Dohyun's score. The items that differ are the standards you don't know yet."), flow, ["prepare"], null),
    step(tx("넷째 단계는 뽑을 때 더 보는 것입니다. QA를 뽑을 때는 내 품질 점수가 꾸준히 높은지, 평가 기준을 정확히 이해하는지를 봅니다. 친한 동료의 상담에도 같은 기준을 댈 수 있는 공정함도 봅니다.", "The fourth stage is what else they look for. When choosing a QA, they look at whether your own quality scores are steadily high and whether you understand the standard exactly. They also look for the fairness to hold a close friend's contacts to the same standard."), flow, ["selection"], null),
    step(tx("미소의 한마디: 저는 평가표를 받을 때마다 점수만 보고 덮었어요. 그 기준을 제대로 읽었다면 같은 실수를 덜 했을 거고, QA라는 자리도 더 일찍 눈에 들어왔을 거예요.", "A word from Miso: Every time I got a score sheet, I looked at the score and put it away. If I'd really read the standard, I'd have repeated fewer mistakes, and QA would have caught my eye sooner."), flow, ["selection"], null),
  ],
  checkpoint: [
    {
      id: "qa-q1",
      prompt: tx("지민이 이번 주 평가표를 받았습니다. QA를 준비하는 사람으로서 가장 알맞은 행동은 무엇일까요?", "Jimin has her score sheet for this week. As someone preparing for QA, what fits best?"),
      options: [
        option("a", tx("총점이 괜찮으면 그냥 넘어간다.", "Move on if the total looks fine."), tx("총점이 괜찮아도 깎인 항목에는 아직 모르는 기준이 숨어 있습니다.", "Even with a fine total, the items that lost points hide standards she doesn't know yet.")),
        option("b", tx("깎인 항목을 평가 기준과 함께 읽고, 녹취를 들을 수 있으면 다시 들으며 스스로 매겨 본다.", "Read the items that lost points alongside the standard, listen to the recording again if she can, and score it herself.")),
        option("c", tx("점수가 낮으면 도현에게 점수를 올려 달라고 부탁한다.", "Ask Dohyun to raise the score if it's low."), tx("다르게 생각하는 항목이 있으면 근거를 들고 평가 리뷰에서 묻습니다. 부탁으로 점수를 바꾸면 평가를 믿을 수 없게 됩니다.", "If she sees an item differently, she brings her evidence to the score review. Scores changed on request can't be trusted.")),
      ],
      answer: "b",
      explanation: tx("평가표는 점수가 아니라 기준을 배우는 자료입니다. 스스로 매겨 보고 비교하는 연습이 QA의 눈을 기릅니다.", "A score sheet is material for learning the standard, not just a score. Scoring yourself and comparing builds a QA's eye."),
    },
    {
      id: "qa-q2",
      prompt: tx("교정 회의(Calibration)를 하는 이유로 알맞은 것은 무엇일까요?", "Why is calibration held?"),
      options: [
        option("a", tx("점수가 낮은 상담사를 찾으려고", "To find agents with low scores"), tx("교정 회의는 평가하는 사람들의 기준을 맞추는 자리입니다. 특정 상담사를 찾는 자리가 아닙니다.", "Calibration lines up the standards of the people who score. It isn't for finding particular agents.")),
        option("b", tx("평가 기준을 없애고 각자 판단하려고", "To drop the standard and let each person judge"), tx("오히려 기준을 더 분명하게 맞추려는 자리입니다.", "It's the opposite: it makes the standard clearer.")),
        option("c", tx("누가 평가해도 같은 점수가 나오게 기준을 맞추려고", "To line up the standard so anyone scoring gets the same result")),
      ],
      answer: "c",
      explanation: tx("같은 상담에 평가하는 사람마다 다른 점수가 나오면 아무도 점수를 믿지 않습니다. 교정 회의가 그 차이를 줄입니다.", "If the same contact gets different scores from different people, no one trusts the scores. Calibration closes that gap."),
    },
  ],
  connection: { to: "trainer", text: tx("QA가 품질을 재는 사람이라면, 처음부터 바르게 배우도록 가르치는 사람도 있습니다. 다음은 트레이너 유나를 만납니다.", "If QA measures quality, someone also teaches people to learn it right from the start. Next, meet Yuna the trainer.") },
};
