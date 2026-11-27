// Review quizzes per role (2026-11-25). Korean: docs/superpowers/specs/2026-11-25-review-quiz-copy-ko.md;
// English: …-review-quiz-copy.en.md. agent-lifecycle/tests/review.test.js keeps them identical.
import { tx, option } from '../agent-lifecycle/js/lessons/build.js';

export const REVIEW_UI = {
  title: tx("복습 퀴즈", "Review quiz"),
  intro: tx("범위에 적힌 강의를 모두 마쳤다면, 여러 레슨을 함께 떠올려야 풀리는 상황 문제로 복습해 보세요. 복습용 퀴즈이며 공식 평가가 아닙니다.", "Finished the courses listed in the scope? Review with scenario questions that make you recall several lessons at once. This quiz is for review, not an official assessment."),
  nameTl: tx("팀장 복습 퀴즈", "TL review quiz"),
  scopeTl: tx("상담사 라이프사이클 6개 + 팀장 SOP 라이브러리 10개", "The Agent Lifecycle (6) + TL SOP Library (10)"),
  nameSme: tx("직무전문가 복습 퀴즈", "SME review quiz"),
  scopeSme: tx("직무전문가 첫걸음 7개", "SME First Steps (7)"),
  // The agent quiz (2026-11-27): docs/superpowers/specs/2026-11-27-agent-review-quiz-copy-ko.md (and .en.md).
  nameAgent: tx("상담사 복습 퀴즈", "Agent review quiz"),
  scopeAgent: tx("상담사 첫걸음 8개 + 상담사 SOP 라이브러리 8개", "Agent First Steps (8) + Agent SOP Library (8)"),
  locked: tx("레슨을 모두 마치면 열려요. 남은 레슨 {n}개.", "Opens when you finish all the lessons. {n} lessons left."),
  lockedLink: tx("이어서 볼 레슨 →", "Next lesson to take →"),
  start: tx("퀴즈 시작하기", "Start the quiz"),
  count: tx("문제 {i} / {n}", "Question {i} of {n}"),
  correct: tx("맞아요!", "That's right!"),
  wrong: tx("아쉬워요. 해설을 보고 관련 레슨을 다시 봐요.", "Not quite. Read the explanation and look at the related lessons again."),
  related: tx("관련 레슨 다시 보기", "Related lessons"),
  next: tx("다음 문제 →", "Next question →"),
  finish: tx("결과 보기 →", "See the result →"),
  score: tx("{n}문제 중 {x}개를 맞혔어요.", "You got {x} of {n} right."),
  passed: tx("통과했어요! 이 직급 강의의 핵심을 잘 기억하고 있어요.", "You passed! You remember the heart of this role's courses well."),
  failed: tx("{need}개 이상 맞히면 통과예요. 아래 레슨을 다시 보고 도전해 보세요.", "You pass with {need} or more right. Look at the lessons below again and try once more."),
  missedTitle: tx("다시 볼 레슨", "Lessons to review"),
  retry: tx("다시 풀기", "Try again"),
  best: tx("최고 기록 {x}/{n}", "Best {x}/{n}"),
  passMark: tx("✓ 통과", "✓ Passed"),
  homeStart: tx("복습 퀴즈 풀기 →", "Take the review quiz →"),
  homeDone: tx("복습 퀴즈 · 최고 기록 {x}/{n} · 다시 풀기 →", "Review quiz · best {x}/{n} · try again →"),
};

export const QUIZZES = {
  tl: {
    name: REVIEW_UI.nameTl,
    scope: REVIEW_UI.scopeTl,
    questions: [
      {
        id: "tl-q1",
        prompt: tx("정식 팀에 온 지민의 평균 처리 시간(AHT)이 팀 평균보다 깁니다. FCR과 QA 정확도는 높습니다. 부매니저가 AHT를 줄이라고 합니다. 먼저 할 일은 무엇일까요?", "Jimin, now on the regular team, has an average handle time (AHT) longer than the team average. Her FCR and QA accuracy are high. Your assistant manager tells you to bring the AHT down. What do you do first?"),
        options: [
          option("a", tx("AHT를 팀 평균까지 줄이는 목표로 바로 성과 개선 계획(PIP)을 시작한다.", "Start a performance improvement plan (PIP) right away, with the team-average AHT as the goal."), tx("PIP는 코칭으로 부족할 때 쓰는 공식 절차입니다. 숫자 하나로 시작하면 지민이 잘하는 한 번에 해결하는 힘까지 흔들립니다.", "A PIP is the formal procedure for when coaching is not enough. Starting it over one number also shakes what Jimin does well: solving things in one go.")),
          option("b", tx("녹취와 지표를 함께 보고, 1:1에서 잘한 점과 줄일 구간을 찾는다.", "Review recordings with the metrics, and in a one-on-one find what she does well and which parts can be shorter.")),
          option("c", tx("팀 허들에서 AHT 목표를 다시 알리고, 통화를 더 빨리 끝내자고 공지한다.", "Restate the AHT target at the team huddle and announce that calls need to end faster."), tx("시간만 강조하면 상담사는 정확히 안내하는 법보다 빨리 끊는 법을 배웁니다.", "Stressing time alone teaches agents to hang up fast rather than to explain correctly.")),
        ],
        answer: "b",
        explanation: tx("한 지표만 보면 다른 지표를 희생시키는 코칭이 됩니다. 여러 지표와 실제 상담을 함께 보고, 1:1 코칭에서 행동을 정합니다.", "Looking at one metric leads to coaching that sacrifices the others. Look at several metrics and real contacts together, and agree on behavior in a one-on-one."),
        lessons: [
          { title: tx("라이프사이클 레슨 4 · 성과 관리 및 코칭", "Lifecycle lesson 4 · Performance Management and Coaching"), href: "../agent-lifecycle/#coaching-0" },
          { title: tx("팀장 SOP · 1:1 코칭", "TL SOP · One-on-One Coaching"), href: "../sop-library/#coaching-0" },
        ],
      },
      {
        id: "tl-q2",
        prompt: tx("1:1 코칭을 세 번 했지만 지민의 같은 확인 단계 누락이 계속됩니다. 다음으로 할 일은 무엇일까요?", "You have coached Jimin one on one three times, but she keeps skipping the same check step. What comes next?"),
        options: [
          option("a", tx("방식은 그대로 두고, 같은 내용으로 한 번 더 1:1 코칭을 잡는다.", "Keep the same approach and book one more one-on-one on the same point."), tx("같은 방식이 세 번 통하지 않았다면, 목표와 지원을 공식적으로 정할 때입니다.", "If the same approach failed three times, it is time to set goals and support formally.")),
          option("b", tx("세 번이나 기회를 줬으니, 나아질 기미가 없다고 보고 퇴사를 권한다.", "You've given three chances with no sign of improvement, so suggest she leave."), tx("공식적인 목표와 지원 없이 끝내면 팀원들은 도움을 청해도 소용없다고 느낍니다.", "Ending it without formal goals and support tells the team that asking for help is pointless.")),
          option("c", tx("데이터로 면담하고, 목표와 지원을 정해 매주 점검하는 PIP로 넘어간다.", "Move to a PIP: meet with the data, agree on goals and support, and check in weekly.")),
        ],
        answer: "c",
        explanation: tx("코칭만으로 부족하면 PIP로 넘어갑니다. PIP는 벌이 아니라, 목표와 지원과 점검을 분명히 하는 절차입니다.", "When coaching alone is not enough, move to a PIP. A PIP is not a punishment but a procedure that makes goals, support and check-ins clear."),
        lessons: [
          { title: tx("팀장 SOP · 성과 개선 계획 (PIP)", "TL SOP · Performance Improvement Plan (PIP)"), href: "../sop-library/#pip-0" },
          { title: tx("팀장 SOP · 1:1 코칭", "TL SOP · One-on-One Coaching"), href: "../sop-library/#coaching-0" },
        ],
      },
      {
        id: "tl-q3",
        prompt: tx("프로모션 오류로 같은 불만 전화가 쏟아지고, 폭언 콜을 끊은 상담사가 자리에서 굳어 있습니다. 먼저 할 일로 알맞은 것은 무엇일까요?", "A promotion error sets off a flood of identical complaint calls, and an agent who just ended an abusive call sits frozen at the desk. What fits best as the first thing to do?"),
        options: [
          option("a", tx("상담사를 잠시 쉬게 하고, 불만 급증을 부매니저나 매니저에게 바로 보고한다.", "Let the agent take a short break, and report the surge to your assistant manager or operation manager right away.")),
          option("b", tx("대기 고객이 많으니, 상담사를 다독여 바로 다음 콜로 돌려보내고 근무 뒤에 면담한다.", "Many customers are waiting, so reassure the agent, send them straight back to calls and talk after the shift."), tx("충격이 그대로 다음 고객에게 이어지고, 상담사는 보호받지 못했다고 느낍니다.", "The shock carries straight into the next customer, and the agent feels unprotected.")),
          option("c", tx("불만이 가라앉을 때까지 팀 안에서 응대 문구를 맞춰 처리한다.", "Agree on a response script within the team and handle it there until the complaints calm down."), tx("대규모 이슈의 첫 단계는 감지하고 공유하는 것입니다. 혼자 막으면 원인 분석과 인력 계획이 늦어집니다.", "The first step in a large-scale issue is spotting and sharing it. Holding it alone delays cause analysis and staffing plans.")),
        ],
        answer: "a",
        explanation: tx("사람을 먼저 보호하고, 몰리는 불만은 부매니저나 매니저에게 바로 알려 여러 팀이 함께 움직이게 합니다.", "Protect the person first, and report the surge to your assistant manager or operation manager right away so several teams can move together."),
        lessons: [
          { title: tx("라이프사이클 레슨 5 · 동기부여 및 유지", "Lifecycle lesson 5 · Engagement and Retention"), href: "../agent-lifecycle/#retention-0" },
          { title: tx("팀장 SOP · 대규모 이슈 대응", "TL SOP · Large-Scale Issue Response"), href: "../sop-library/#incident-0" },
        ],
      },
      {
        id: "tl-q4",
        prompt: tx("퇴사 면담에서 \"교대 근무가 이렇게 잦은 줄 몰랐다\"는 말이 벌써 두 번째로 나왔습니다. 다음 주에는 채용 면접관으로 들어갑니다. 어떻게 할까요?", "For the second time, an exit interview brings up \"I didn't know shifts would change this often.\" Next week you sit in on hiring interviews. What do you do?"),
        options: [
          option("a", tx("지원자가 줄지 않도록, 교대 근무는 묻는 지원자에게만 짧게 설명한다.", "Explain shift work briefly, and only to applicants who ask, so applicant numbers don't drop."), tx("좋은 점만 듣고 들어온 사람은 근무표를 처음 받는 날 퇴사를 고민합니다.", "People who heard only the good parts start thinking of leaving the day they get their first schedule.")),
          option("b", tx("채용 담당에게 공유하고, 면접에서 교대 근무를 솔직히 안내한다.", "Share it with the recruiter, and explain shift work honestly in the interviews.")),
          option("c", tx("두 명뿐이니 퇴사자 개인의 사정으로 보고, 면담 기록만 남긴다.", "It's only two people, so treat it as their personal situation and just keep the interview notes."), tx("같은 말이 반복된다면 개인 사정이 아니라 직무 안내를 고칠 신호입니다.", "When the same words keep coming up, it is not a personal matter but a sign the job preview needs fixing.")),
        ],
        answer: "b",
        explanation: tx("퇴사 면담에서 나온 개선점은 다음 채용으로 돌아갑니다. 현실적 직무 안내(RJP)가 조기 퇴사를 줄입니다.", "Improvements from exit interviews feed the next round of hiring. A realistic job preview (RJP) cuts early leaving."),
        lessons: [
          { title: tx("라이프사이클 레슨 6 · 경력 개발 및 전환·퇴사", "Lifecycle lesson 6 · Career Development and Offboarding"), href: "../agent-lifecycle/#career-0" },
          { title: tx("라이프사이클 레슨 1 · 채용 및 선발", "Lifecycle lesson 1 · Recruitment and Hiring"), href: "../agent-lifecycle/#hiring-0" },
        ],
      },
      {
        id: "tl-q5",
        prompt: tx("팀장이 된 지 2주째(예시), 가장 친했던 하은이 QA 점수가 평가자마다 다르다고 불만을 말합니다. 알맞은 것은 무엇일까요?", "Two weeks (Example) into being team leader, Haeun, your closest colleague, complains that QA scores differ by evaluator. What fits best?"),
        options: [
          option("a", tx("하은이 믿고 꺼낸 이야기이니, QA에 하은의 점수만 다시 봐 달라고 조용히 부탁한다.", "Haeun trusted you with this, so quietly ask QA to look at her scores again."), tx("한 사람만 챙기면 팀은 기준이 친분에 따라 다르다고 느낍니다.", "Looking after one person makes the team feel the standard depends on friendship.")),
          option("b", tx("평가는 QA의 일이니 관여하지 않는다.", "Stay out of it, since evaluation is QA's job."), tx("팀장도 캘리브레이션에 참여합니다. 기준이 흔들리면 코칭의 근거도 흔들립니다.", "Team leaders take part in calibration too. If the standard wobbles, so does the basis for coaching.")),
          option("c", tx("팀 전체의 문제일 수 있으니, QA에 캘리브레이션을 요청하고 결과를 팀에 알린다.", "It may be a team-wide problem, so ask QA for calibration and tell the team the outcome.")),
        ],
        answer: "c",
        explanation: tx("개인의 불만에서 팀 전체의 기준 문제를 찾고, 모두에게 같은 방식으로 풀어 줍니다.", "Find the team-wide standard problem behind one person's complaint, and settle it the same way for everyone."),
        lessons: [
          { title: tx("팀장 SOP · 캘리브레이션", "TL SOP · Calibration"), href: "../sop-library/#calibration-0" },
          { title: tx("팀장 SOP · 동료에서 팀장으로", "TL SOP · From Colleague to Team Leader"), href: "../sop-library/#transition-0" },
        ],
      },
      {
        id: "tl-q6",
        prompt: tx("실전 배치 후 첫 주를 보내는 신입 서아가 질문을 거의 하지 않습니다. 스크러빙에서 서아의 티켓에 같은 안내 누락이 두 번 보입니다. 알맞은 것은 무엇일까요?", "Seoa, a new hire in her first week after Go Live, hardly asks any questions. While scrubbing, you see the same missing explanation twice in her tickets. What fits best?"),
        options: [
          option("a", tx("버디와 함께 먼저 다가가 막힌 곳을 묻고, 빠진 안내를 1:1로 짚는다.", "Go to Seoa first with her buddy, ask where she's stuck, and go over the missing explanation one on one.")),
          option("b", tx("팀 허들에서 서아의 티켓을 사례로 보여 주며 같은 실수를 막는다.", "Show Seoa's tickets as an example at the team huddle to stop the mistake repeating."), tx("신입의 실수를 팀 앞에서 다루면 서아는 더 묻지 않게 됩니다.", "Taking a new hire's mistakes in front of the team makes Seoa ask even less.")),
          option("c", tx("실전 첫 주이니 부담 주지 않게, 한 달 동안은 질문이 올 때까지 지켜본다.", "It's only her first week live, so don't add pressure; watch for a month until she asks."), tx("실전 첫 몇 주도 떠나는 사람이 많은 시기입니다. 막힌 곳을 오래 두면 버티기 어렵습니다.", "Many people also leave in their first weeks on the floor. Leaving her stuck for long makes it hard to hold on.")),
        ],
        answer: "a",
        explanation: tx("신입은 기다리지 말고 먼저 챙기고, 실수는 1:1로 짚습니다. 버디가 그 거리를 좁혀 줍니다.", "Don't wait for new hires; reach out first, and go over mistakes one on one. A buddy closes that distance."),
        lessons: [
          { title: tx("팀장 SOP · 신규 입사자 온보딩", "TL SOP · New Hire Onboarding"), href: "../sop-library/#onboarding-0" },
          { title: tx("팀장 SOP · 스크러빙", "TL SOP · Scrubbing"), href: "../sop-library/#scrubbing-0" },
        ],
      },
    ],
  },
  sme: {
    name: REVIEW_UI.nameSme,
    scope: REVIEW_UI.scopeSme,
    questions: [
      {
        id: "sme-q1",
        prompt: tx("통화 중 고객을 보류해 둔 서준이 손을 들었고, 동기 준호는 통화가 끝난 고객의 보상 승인을 티켓으로 요청했고, 미팅 중인 수진 팀장은 오후 출석을 맡아 달라고 메신저를 보냈습니다. 먼저 할 일은 무엇일까요?", "Seojun has a customer on hold and his hand up, your peer Junho asks by ticket for a compensation approval for a customer whose call has ended, and Sujin, in a meeting, messages you to take the afternoon attendance. What do you do first?"),
        options: [
          option("a", tx("보류 고객이 먼저이니, 서준에게 가고 준호와 팀장에게 언제 할지 알린다.", "The customer on hold comes first, so go to Seojun, and tell Junho and the team leader when you will get to them.")),
          option("b", tx("동기인 준호의 승인부터 처리한다. 티켓으로 와 있어 금방 끝난다.", "Approve your peer Junho's request first; it's already in a ticket, so it's quick."), tx("순서는 빨리 끝나는 일이나 친분이 아니라, 고객이 지금 기다리느냐로 정합니다.", "The order is set by whether a customer is waiting now, not by what's quick or by friendship.")),
          option("c", tx("팀장의 요청이니 출석 확인부터 하고, 서준에게는 잠시 기다리라고 손짓한다.", "The team leader asked, so do attendance first and signal Seojun to wait a moment."), tx("출석은 잠시 뒤에도 할 수 있지만, 보류된 고객은 기다릴 수 없습니다.", "Attendance can wait a moment; the customer on hold cannot.")),
        ],
        answer: "a",
        explanation: tx("실시간으로 기다리는 고객이 먼저이고, 기다리게 되는 사람에게는 언제 갈지 알립니다.", "Customers waiting live come first, and whoever has to wait hears when you will come."),
        lessons: [
          { title: tx("직무전문가 첫걸음 레슨 6 · 요청이 동시에 몰릴 때", "SME First Steps lesson 6 · When Requests Pile Up at Once"), href: "../sme/#priority-0" },
          { title: tx("직무전문가 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트", "SME First Steps lesson 2 · Supporting Agents in Training or Just Trained"), href: "../sme/#newcomer-0" },
        ],
      },
      {
        id: "sme-q2",
        prompt: tx("스크러빙에서 준호가 승인 없이 처리한 보상 건이 이번 주에만 세 번(예시) 나왔습니다. 어떻게 할까요?", "Scrubbing turns up three (Example) compensations Junho gave without approval this week alone. What do you do?"),
        options: [
          option("a", tx("같은 일이 없도록 팀 채팅방에 준호의 건이라고 밝히고 절차를 다시 안내한다.", "So it doesn't happen again, say in the team chat these were Junho's and explain the procedure again."), tx("이름을 밝히면 준호는 창피를 당하고, 팀은 실수를 숨기기 시작합니다.", "Naming him embarrasses Junho, and the team starts hiding mistakes.")),
          option("b", tx("동기인 준호의 체면을 생각해, 이번에도 모른 척 넘어간다.", "Think of your peer Junho's pride and look the other way again."), tx("한 사람에게만 느슨하면 승인 기준이 친분에 따라 달라집니다.", "When it is looser for one person, the approval standard depends on friendship.")),
          option("c", tx("준호와 1:1로 같은 기준임을 말하고, 사례는 팀장에게 바로 알린다.", "Tell Junho one on one that the standard is the same for everyone, and tell the team leader about the cases right away.")),
        ],
        answer: "c",
        explanation: tx("같은 기준을 존중하는 방식으로 지키고, 반복되는 문제는 팀장과 함께 다룹니다.", "Keep the same standard in a respectful way, and handle repeated problems together with the team leader."),
        lessons: [
          { title: tx("직무전문가 첫걸음 레슨 4 · 동료였던 선임 서포트", "SME First Steps lesson 4 · Supporting Senior Agents Who Were Your Peers"), href: "../sme/#peer-0" },
          { title: tx("직무전문가 첫걸음 레슨 5 · 팀장 서포트", "SME First Steps lesson 5 · Supporting the Team Leader"), href: "../sme/#lead-0" },
        ],
      },
      {
        id: "sme-q3",
        prompt: tx("아침 허들에서 고객사의 환불 정책 변경을 전했는데, 오후에 서준과 기존 상담사 세 명이 같은 질문을 합니다. 알맞은 것은 무엇일까요?", "You passed on the client's refund policy change in the morning huddle, but in the afternoon Seojun and three experienced agents ask the same question. What fits best?"),
        options: [
          option("a", tx("허들에서 이미 설명했으니, 허들 메모를 다시 보라고만 한다.", "You covered it in the huddle, so just tell them to check the huddle notes again."), tx("네 명이 같은 것을 묻는다면 전달이 충분하지 않았다는 신호입니다.", "When four people ask the same thing, the message did not get through.")),
          option("b", tx("답을 팀 채팅방에 올리고 지식 베이스 수정을 요청하며, 서준에게 문서 위치를 보여 준다.", "Post the answer in the team chat, ask for a knowledge base update, and show Seojun where the article is.")),
          option("c", tx("물어볼 때마다 한 사람씩 자리로 가서 자세히 다시 설명해 준다.", "Go to each person as they ask and explain it again in detail."), tx("같은 질문이 계속 오고, 그동안 더 급한 요청을 놓칩니다.", "The same question keeps coming, and you miss more urgent requests meanwhile.")),
        ],
        answer: "b",
        explanation: tx("반복되는 질문은 팀 전체에 한 번에 돌려주고, 신입에게는 찾는 법을 보여 줍니다.", "Give repeated questions back to the whole team at once, and show new hires how to find answers."),
        lessons: [
          { title: tx("직무전문가 첫걸음 레슨 3 · 기존 상담사 서포트", "SME First Steps lesson 3 · Supporting Existing Agents"), href: "../sme/#escalation-0" },
          { title: tx("직무전문가 첫걸음 레슨 7 · 팀에 지식 돌려주기", "SME First Steps lesson 7 · Giving Knowledge Back to the Team"), href: "../sme/#knowledge-0" },
        ],
      },
      {
        id: "sme-q4",
        prompt: tx("팀장이 자리에 없는 오전, 결근 연락이 두 건 들어오고 대기 고객이 늘기 시작합니다. 어떻게 할까요?", "One morning while the team leader is away, two absence messages come in and customer waits start to grow. What do you do?"),
        options: [
          option("a", tx("결근 사유를 들어 보고, 아프다고 하면 병가로 처리해 둔다.", "Hear the reasons, and record sick leave if they say they are ill."), tx("사유를 판단하고 근태를 정하는 것은 팀장의 몫입니다.", "Judging reasons and deciding attendance belong to the team leader.")),
          option("b", tx("결근 연락을 기록하고, 인원 부족을 팀장과 RTA에 바로 알린다.", "Record the absence messages, and tell the team leader and the RTA right away that the team is short.")),
          option("c", tx("대기가 늘고 있으니 서포트를 멈추고, 혼자 콜을 더 받아 빈자리를 메운다.", "Waits are growing, so stop supporting and take more calls yourself to fill the gap."), tx("혼자 메우는 동안 팀의 요청은 쌓이고, 인원을 조정할 수 있는 사람은 상황을 모릅니다.", "While you fill in alone, the team's requests pile up, and the people who can adjust staffing don't know.")),
        ],
        answer: "b",
        explanation: tx("출석 대행은 기록하고 알리는 데까지입니다. 인원 조정은 팀장과 RTA가 할 수 있습니다.", "Covering attendance means recording and reporting, nothing more. The team leader and the RTA can adjust staffing."),
        lessons: [
          { title: tx("직무전문가 첫걸음 레슨 5 · 팀장 서포트", "SME First Steps lesson 5 · Supporting the Team Leader"), href: "../sme/#lead-0" },
          { title: tx("직무전문가 첫걸음 레슨 6 · 요청이 동시에 몰릴 때", "SME First Steps lesson 6 · When Requests Pile Up at Once"), href: "../sme/#priority-0" },
        ],
      },
      {
        id: "sme-q5",
        prompt: tx("캘리브레이션에서 확인 단계의 기준이 바뀌었고, 바뀐 기준의 평가는 모레부터입니다. 다음 날 지민이 동료에게 들었다며, 바뀐 기준을 전달받은 적이 없다고 찾아옵니다. 알맞은 것은 무엇일까요?", "Calibration changed the standard for the check step, and scoring on it starts the day after tomorrow. The next day, Jimin comes to you saying she heard it from a colleague but was never told. What fits best?"),
        options: [
          option("a", tx("평가가 코앞이니, 지민에게 설명하고 허들과 팀 채팅방으로 모두에게 전한다.", "Scoring starts tomorrow, so explain it to Jimin and pass it to everyone through the huddle and team chat.")),
          option("b", tx("기준은 QA가 정하는 일이니, 자세한 것은 QA에게 직접 물어보라고 한다.", "Standards are set by QA, so tell her to ask QA directly for the details."), tx("바뀐 기준을 상담사에게 먼저 전하는 것은 직무전문가의 일입니다.", "Passing changed standards to agents first is the SME's job.")),
          option("c", tx("지민만 이번 평가에서 빼 달라고 QA에게 요청한다.", "Ask QA to leave just Jimin out of this round of scoring."), tx("한 사람만 빼면 기준이 사람마다 달라집니다. 평가 전에 모두에게 기준을 전하는 것이 먼저입니다.", "Leaving out one person makes the standard differ by person. Passing the standard to everyone before scoring comes first.")),
        ],
        answer: "a",
        explanation: tx("기준이 바뀌면 직무전문가가 먼저 팀에 전합니다. 바뀐 기준을 모른 채 평가받는 상담사가 없게 합니다.", "When a standard changes, the SME tells the team first. No agent should be scored on a standard they did not know had changed."),
        lessons: [
          { title: tx("직무전문가 첫걸음 레슨 7 · 팀에 지식 돌려주기", "SME First Steps lesson 7 · Giving Knowledge Back to the Team"), href: "../sme/#knowledge-0" },
          { title: tx("직무전문가 첫걸음 레슨 1 · 직무전문가가 된 첫날", "SME First Steps lesson 1 · Your First Day as an SME"), href: "../sme/#firstday-0" },
        ],
      },
      {
        id: "sme-q6",
        prompt: tx("직무전문가가 된 첫 주, 동기 준호가 정책에 없는 큰 보상을 승인해 달라고 합니다. 고객은 통화 중에 기다리고 있습니다. 어떻게 할까요?", "In your first week as SME, your peer Junho asks you to approve a large compensation that policy does not cover. The customer is waiting on the call. What do you do?"),
        options: [
          option("a", tx("준호가 경력이 더 많으니, 그 판단을 믿고 이번 한 번은 승인한다.", "Junho has more experience, so trust his call and approve it this once."), tx("승인 범위 밖의 결정은 되돌리기 어렵고, 경험이 기준을 대신하지 않습니다.", "A decision beyond your limits is hard to undo, and experience does not replace the standard.")),
          option("b", tx("정책에 없는 보상이니 거절하고, 준호에게 그대로 응대를 이어 가게 한다.", "Policy does not cover it, so turn it down and let Junho carry on with the call."), tx("거절로 끝내면 고객의 문제가 남습니다. 내가 정할 수 없는 건은 정할 수 있는 사람에게 넘깁니다.", "Turning it down leaves the customer's problem where it was. What you cannot decide goes to someone who can.")),
          option("c", tx("범위 밖이니 준호에게 고객 대기 안내를 부탁하고, 팀장에게 바로 넘긴다.", "It is outside your limits, so ask Junho to tell the customer there is a short wait, and pass it to the team leader right away.")),
        ],
        answer: "c",
        explanation: tx("범위 안은 내가 정하고, 범위 밖은 팀장에게 넘깁니다. 동기의 요청도 같은 기준입니다.", "You decide within your limits and pass on what is outside them. A peer's request follows the same standard."),
        lessons: [
          { title: tx("직무전문가 첫걸음 레슨 1 · 직무전문가가 된 첫날", "SME First Steps lesson 1 · Your First Day as an SME"), href: "../sme/#firstday-0" },
          { title: tx("직무전문가 첫걸음 레슨 4 · 동료였던 선임 서포트", "SME First Steps lesson 4 · Supporting Senior Agents Who Were Your Peers"), href: "../sme/#peer-0" },
        ],
      },
    ],
  },
  agent: {
    name: REVIEW_UI.nameAgent,
    scope: REVIEW_UI.scopeAgent,
    questions: [
      {
        id: "agent-q1",
        prompt: tx("네스팅 중인 지민에게 고객이 환불 한도(예시)를 넘는 환불을 요구합니다. 지민은 지식 베이스에서 한도를 확인했고, 옆자리 동료는 \"그 정도는 그냥 해 줘도 돼\"라고 말합니다. 어떻게 할까요?", "During nesting, a customer asks Jimin for a refund over the refund limit (Example). She has checked the limit in the knowledge base, and the colleague next to her says, \"Just give it to them, it's not that much.\" What does she do?"),
        options: [
          option("a", tx("확인한 한도와 고객 상황을 정리해, 승인이 필요하다고 하린에게 묻는다.", "Sum up the limit she checked and the customer's situation, and ask Harin for the approval it needs.")),
          option("b", tx("옆자리 동료가 괜찮다고 했으니, 그대로 환불을 처리한다.", "The colleague said it's fine, so process the refund as is."), tx("승인이 필요한 판단은 옆자리가 아니라 직무전문가에게 묻습니다.", "A call that needs approval goes to the SME, not the next seat.")),
          option("c", tx("고객을 보류해 두고, 하린에게 \"이거 어떻게 해요?\"라고만 짧게 묻는다.", "Put the customer on hold and just ask Harin, \"What do I do with this?\""), tx("확인한 것과 필요한 것을 함께 말해야, 다시 묻지 않고 바로 답이 옵니다.", "Saying what you checked and what you need gets an answer right away, with no follow-up questions.")),
        ],
        answer: "a",
        explanation: tx("스스로 찾아본 것을 바탕으로, 승인이 필요한 일은 직무전문가에게 한 번에 정리해 요청합니다.", "Build on what you looked up yourself, and ask the SME for approval with everything in one message."),
        lessons: [
          { title: tx("상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법", "Agent First Steps lesson 3 · OJT and Nesting: How to Ask"), href: "../agent/#nesting-0" },
          { title: tx("상담사 SOP · 에스컬레이션 요청하기", "Agent SOP · Requesting an Escalation"), href: "../agent-sop/#request-0" },
        ],
      },
      {
        id: "agent-q2",
        prompt: tx("배송이 늦어 화가 난 고객이 처음에는 언성만 높이다가, 이제 지민에게 욕설을 하기 시작했습니다. 어떻게 할까요?", "A customer angry about a late delivery was only raising their voice at first, but now they have started swearing at Jimin. What does she do?"),
        options: [
          option("a", tx("고객의 화는 상황을 향하니, 욕설도 끝까지 참고 듣는다.", "A customer's anger is aimed at the situation, so put up with the swearing to the end."), tx("화는 들어 드리지만, 욕설은 참는 것이 아니라 정해진 절차로 다룹니다.", "You listen to anger, but swearing isn't something to put up with; it has a set procedure.")),
          option("b", tx("욕설이 시작됐으니, 센터가 정한 문구로 경고한다.", "The swearing has started, so warn the customer with the center's set wording.")),
          option("c", tx("경고 없이 바로 통화를 끊는다.", "End the call right away without a warning."), tx("경고 없이 끊으면 고객은 이유를 모르고, 센터의 절차도 지키지 못합니다.", "Hanging up without a warning leaves the customer without a reason and skips the center's procedure.")),
        ],
        answer: "b",
        explanation: tx("화난 고객은 듣고 인정합니다. 욕설이 시작되면 경고, 필요하면 승인, 종료 안내 순서를 따릅니다.", "Listen to and acknowledge an angry customer. Once swearing starts, follow the order: warn, get approval if needed, then announce the end of the call."),
        lessons: [
          { title: tx("상담사 첫걸음 레슨 5 · 어려운 고객", "Agent First Steps lesson 5 · Difficult Customers"), href: "../agent/#customers-0" },
          { title: tx("상담사 SOP · 욕설·폭언 고객 응대와 통화 종료", "Agent SOP · Handling Abusive Callers and Ending the Call"), href: "../agent-sop/#abuse-0" },
        ],
      },
      {
        id: "agent-q3",
        prompt: tx("밤새 열이 난 지민은 아침에 출근하기 어렵다고 느낍니다. 근무 시작까지 세 시간(예시) 남았고, 팀 단체 채팅방에는 동료들이 있습니다. 어떻게 할까요?", "Jimin ran a fever all night and doesn't think she can make it in this morning. Her shift starts in three hours (Example), and her colleagues are in the team group chat. What does she do?"),
        options: [
          option("a", tx("단체 채팅방에 \"오늘 못 나가요\"라고만 남기고 다시 잔다.", "Just post \"Can't make it today\" in the group chat and go back to sleep."), tx("받을 사람이 정해지지 않은 곳에 남기면, 팀장이 늦게 보거나 못 볼 수 있습니다.", "A message with no set recipient may reach the team leader late, or not at all.")),
          option("b", tx("동료가 빠지면 남은 사람에게 문의가 몰리니, 약을 먹고 무리해서 출근한다.", "Contacts pile up on the others when someone is out, so take medicine and push through to work."), tx("아픈데 무리하면 더 길게 빠질 수 있습니다. 절차대로 쉬는 것도 팀을 돕는 일입니다.", "Pushing through while sick can keep you out longer. Resting by the procedure helps the team too.")),
          option("c", tx("정한 방법으로 수진 팀장에게 바로 알리고, 진단서는 당일 안에 보낸다.", "Tell Sujin right away the way the team has set up, and send the doctor's note the same day.")),
        ],
        answer: "c",
        explanation: tx("미리, 정한 방법으로, 정한 사람에게 알리고, 서류는 센터가 정한 기한 안에 보냅니다.", "Report early, the set way, to the set person, and send the documents by the center's deadline."),
        lessons: [
          { title: tx("상담사 첫걸음 레슨 7 · 근태와 스케줄", "Agent First Steps lesson 7 · Attendance and Schedules"), href: "../agent/#attendance-0" },
          { title: tx("상담사 SOP · 결근·병가 알리기", "Agent SOP · Reporting an Absence or Sick Day"), href: "../agent-sop/#absence-0" },
        ],
      },
      {
        id: "agent-q4",
        prompt: tx("이번 주 평가에서 지민은 본인 확인 누락으로 크게 감점되었고, 안내 항목에서도 감점되었습니다. 본인 확인 감점은 맞다고 생각하지만, 안내 감점은 납득이 안 됩니다. 어떻게 할까요?", "In this week's evaluation, Jimin lost a lot of points for missing ID verification and some on the guidance item. She agrees with the ID verification points, but not with the guidance ones. What does she do?"),
        options: [
          option("a", tx("QA에게 바로 메시지를 보내, 두 항목 모두 억울하다고 따진다.", "Message QA right away and argue that both items are unfair."), tx("감정적으로 따지기보다 근거를 모아, 정해진 경로로 이의를 제기합니다.", "Rather than arguing from feelings, gather evidence and dispute through the set route.")),
          option("b", tx("본인 확인은 바로 고치고, 안내 감점은 녹취를 근거로 이의를 낸다.", "Fix ID verification right away, and dispute the guidance points with the recording as evidence.")),
          option("c", tx("한 주에 하나만 고친다는 원칙대로, 이번 주는 안내 항목만 고친다.", "Follow the one-fix-a-week rule and fix only the guidance item this week."), tx("본인 확인 누락 같은 치명적 오류는 순서를 기다리지 않고 바로 고칩니다.", "A critical error like missing ID verification gets fixed right away, without waiting its turn.")),
        ],
        answer: "b",
        explanation: tx("치명적 오류는 바로 고칩니다. 동의하기 어려운 감점은 녹취를 근거로, 팀장을 거쳐 정해진 기한 안에 다시 검토를 요청합니다.", "Fix critical errors right away. For points you can't agree with, ask for a second look with the recording as evidence, through the team leader and by the set deadline."),
        lessons: [
          { title: tx("상담사 첫걸음 레슨 6 · 매주 평가 리뷰", "Agent First Steps lesson 6 · The Weekly Score Review"), href: "../agent/#review-0" },
          { title: tx("상담사 SOP · 평가 결과 이의 제기", "Agent SOP · Disputing a Quality Score"), href: "../agent-sop/#dispute-0" },
        ],
      },
      {
        id: "agent-q5",
        prompt: tx("아침 허들에서 고객사의 환불 기간이 바뀌었다고 들었는데, 지식 베이스에는 아직 예전 기간이 그대로 있습니다. 마침 고객이 환불 기간을 묻습니다. 어떻게 할까요?", "At the morning huddle, Jimin heard the client's refund period has changed, but the knowledge base still shows the old period. Just then, a customer asks about the refund period. What does she do?"),
        options: [
          option("a", tx("지식 베이스가 공식 문서이니, 예전 기간으로 안내한다.", "The knowledge base is the official document, so give the old period."), tx("허들에서 바뀐 내용이 문서에 늦게 반영되었을 수 있습니다. 예전 기간을 안내하면 고객이 다시 연락하게 됩니다.", "The document may not have caught up with the huddle yet. Giving the old period means the customer will have to contact you again.")),
          option("b", tx("어느 쪽이 맞는지 직접 판단해, 지식 베이스 문서를 고쳐 둔다.", "Decide for herself which one is right and fix the knowledge base article."), tx("문서는 혼자 고치지 않고, 알려서 담당자가 바로잡게 합니다.", "You don't fix the document yourself; you report it so the owner can correct it.")),
          option("c", tx("허들 메모대로 안내하고, 문서가 다르다고 하린에게 알린다.", "Go by her huddle notes, and tell Harin the document is different.")),
        ],
        answer: "c",
        explanation: tx("허들에서 들은 업데이트를 적용하고, 문서와 다른 점은 직무전문가에게 알려 모두가 같은 내용으로 안내하게 합니다.", "Apply the update you heard at the huddle, and report any difference in the document to the SME so everyone guides customers the same way."),
        lessons: [
          { title: tx("상담사 SOP · 고객사 업데이트 허들 듣고 적용하기", "Agent SOP · Applying a Client Update from the Huddle"), href: "../agent-sop/#huddle-0" },
          { title: tx("상담사 SOP · 지식 베이스 오류 알리기", "Agent SOP · Reporting a Knowledge Base Error"), href: "../agent-sop/#kbreport-0" },
        ],
      },
      {
        id: "agent-q6",
        prompt: tx("실전 배치 첫 주, 통화 중에 상담 시스템이 멈췄습니다. 옆자리 동료의 화면도 멈춘 것 같고, 고객은 수화기 너머에서 기다리고 있습니다. 어떻게 할까요?", "In Jimin's first week after Go Live, the contact system freezes mid-call. Her neighbor's screen seems frozen too, and the customer is waiting on the line. What does she do?"),
        options: [
          option("a", tx("정해진 조치로도 안 되면, 바로 하린이나 팀장에게 알리고 고객에게 안내한다.", "If the set first fix doesn't help, tell Harin or the team leader right away and let the customer know.")),
          option("b", tx("첫 주라 내 실수 같아, 고객 몰래 혼자 재부팅해 본다.", "It's her first week and probably her mistake, so quietly reboot on her own without telling the customer."), tx("정해진 조치로도 안 되면 내 탓으로 여기지 말고 바로 알립니다. 고객에게도 상황을 안내해야 기다림이 길어지지 않습니다.", "If the set first fix doesn't help, don't blame yourself; report it right away. Telling the customer what's happening keeps the wait from dragging on.")),
          option("c", tx("고객에게 10분(예시) 안에 고쳐진다고 약속하고 기다리게 한다.", "Promise the customer it will be fixed within 10 minutes (Example) and ask them to wait."), tx("복구 시간은 상담사가 알 수 없으니, 지킬 수 없는 약속은 하지 않습니다.", "An agent can't know the recovery time, so don't make a promise you can't keep.")),
        ],
        answer: "a",
        explanation: tx("장애가 의심되면 바로 직무전문가나 팀장에게 알립니다. 고객에게는 정해 준 문장으로 안내하고 복구 시간은 약속하지 않습니다.", "If you suspect an outage, tell the SME or the team leader right away. Give the customer the set wording and don't promise a recovery time."),
        lessons: [
          { title: tx("상담사 첫걸음 레슨 4 · 실전 배치와 첫 콜", "Agent First Steps lesson 4 · Go Live and the First Call"), href: "../agent/#golive-0" },
          { title: tx("상담사 SOP · 시스템 장애 때 대응", "Agent SOP · Responding to a System Outage"), href: "../agent-sop/#outage-0" },
        ],
      },
    ],
  },
};
