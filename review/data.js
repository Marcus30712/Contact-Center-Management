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
          option("b", tx("녹취 몇 건과 지표를 함께 보고, 1:1 코칭에서 잘한 점과 줄일 수 있는 구간을 함께 찾는다.", "Look at a few recordings together with the metrics, and in a one-on-one find what she does well and which parts can be shorter.")),
          option("c", tx("팀 허들에서 통화를 더 빨리 끝내자고 공지한다.", "Announce in the team huddle that calls need to end faster."), tx("시간만 강조하면 상담사는 정확히 안내하는 법보다 빨리 끊는 법을 배웁니다.", "Stressing time alone teaches agents to hang up fast rather than to explain correctly.")),
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
          option("a", tx("같은 내용으로 한 번 더 코칭한다.", "Coach her once more on the same thing."), tx("같은 방식이 세 번 통하지 않았다면, 목표와 지원을 공식적으로 정할 때입니다.", "If the same approach failed three times, it is time to set goals and support formally.")),
          option("b", tx("나아질 기미가 없으니 퇴사를 권한다.", "Suggest she leave, since there is no sign of improvement."), tx("기회와 지원 없이 끝내면 팀원들은 도움을 청해도 소용없다고 느낍니다.", "Ending it without a chance or support tells the team that asking for help is pointless.")),
          option("c", tx("데이터를 근거로 면담하고, 목표와 지원 약속을 함께 정해 주간으로 점검하는 PIP로 넘어간다.", "Move to a PIP: meet with the data, agree on goals and the support you will give, and check in weekly.")),
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
          option("a", tx("그 상담사를 잠시 쉬게 하고, 같은 불만이 몰린다는 사실을 부매니저나 매니저에게 바로 보고한다.", "Let that agent take a short break, and report to your assistant manager or operation manager right away that the same complaint is piling up.")),
          option("b", tx("대기 고객이 많으니 상담사를 바로 다음 콜로 돌려보낸다.", "Send the agent straight back to the next call, since many customers are waiting."), tx("충격이 그대로 다음 고객에게 이어지고, 상담사는 보호받지 못했다고 느낍니다.", "The shock carries straight into the next customer, and the agent feels unprotected.")),
          option("c", tx("불만이 가라앉을 때까지 팀 안에서만 처리한다.", "Handle it inside the team until the complaints calm down."), tx("대규모 이슈의 첫 단계는 감지하고 공유하는 것입니다. 혼자 막으면 원인 분석과 인력 계획이 늦어집니다.", "The first step in a large-scale issue is spotting and sharing it. Holding it alone delays cause analysis and staffing plans.")),
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
          option("a", tx("지원자가 줄지 않도록, 교대 근무는 묻는 사람에게만 설명한다.", "Explain shift work only to those who ask, so applicant numbers don't drop."), tx("좋은 점만 듣고 들어온 사람은 근무표를 처음 받는 날 퇴사를 고민합니다.", "People who heard only the good parts start thinking of leaving the day they get their first schedule.")),
          option("b", tx("면담 내용을 채용 담당과 나누고, 면접에서 교대 근무를 솔직하게 안내한다.", "Share the interview findings with the recruiter, and explain shift work honestly in the interviews.")),
          option("c", tx("퇴사자 개인의 사정으로 보고 면담 기록만 남긴다.", "Treat it as the leaver's personal situation and just keep the interview notes."), tx("같은 말이 반복된다면 개인 사정이 아니라 직무 안내를 고칠 신호입니다.", "When the same words keep coming up, it is not a personal matter but a sign the job preview needs fixing.")),
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
          option("a", tx("친한 사이니 하은의 점수만 다시 봐 달라고 QA에 부탁한다.", "Ask QA to look at Haeun's scores again, since you are close."), tx("한 사람만 챙기면 팀은 기준이 친분에 따라 다르다고 느낍니다.", "Looking after one person makes the team feel the standard depends on friendship.")),
          option("b", tx("평가는 QA의 일이니 관여하지 않는다.", "Stay out of it, since evaluation is QA's job."), tx("팀장도 캘리브레이션에 참여합니다. 기준이 흔들리면 코칭의 근거도 흔들립니다.", "Team leaders take part in calibration too. If the standard wobbles, so does the basis for coaching.")),
          option("c", tx("QA에 캘리브레이션 세션을 요청해 기준을 맞추고, 결과를 팀 전체에 알린다.", "Ask QA for a calibration session to align the standard, then tell the whole team the outcome.")),
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
          option("a", tx("버디와 함께 서아에게 먼저 다가가 막히는 곳을 묻고, 빠진 안내를 1:1로 짚어 준다.", "Go to Seoa first with her buddy, ask where she gets stuck, and go over the missing explanation one on one.")),
          option("b", tx("팀 허들에서 서아의 티켓을 사례로 보여 준다.", "Show Seoa's tickets as an example in the team huddle."), tx("신입의 실수를 팀 앞에서 다루면 서아는 더 묻지 않게 됩니다.", "Taking a new hire's mistakes in front of the team makes Seoa ask even less.")),
          option("c", tx("아직 실전 첫 주이니 한 달 동안은 지켜만 본다.", "It is only her first week live, so just watch for a month."), tx("실전 첫 몇 주도 떠나는 사람이 많은 시기입니다. 막힌 곳을 오래 두면 버티기 어렵습니다.", "Many people also leave in their first weeks on the floor. Leaving her stuck for long makes it hard to hold on.")),
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
          option("a", tx("서준에게 먼저 가고, 준호와 팀장에게는 언제 처리할지 짧게 알린다.", "Go to Seojun first, and tell Junho and the team leader briefly when you will get to them.")),
          option("b", tx("동기인 준호의 승인부터 처리한다.", "Approve Junho's request first, since he is your peer."), tx("순서는 친분이 아니라 고객이 지금 기다리느냐로 정합니다.", "The order is set by whether a customer is waiting now, not by friendship.")),
          option("c", tx("팀장의 요청이니 출석 확인부터 한다.", "Do the attendance first, since the team leader asked."), tx("출석은 잠시 뒤에도 할 수 있지만, 보류된 고객은 기다릴 수 없습니다.", "Attendance can wait a moment; the customer on hold cannot.")),
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
          option("a", tx("팀 채팅방에 준호의 건이라고 밝히고 절차를 다시 안내한다.", "Say in the team chat that these were Junho's and explain the procedure again."), tx("이름을 밝히면 준호는 창피를 당하고, 팀은 실수를 숨기기 시작합니다.", "Naming him embarrasses Junho, and the team starts hiding mistakes.")),
          option("b", tx("동기 사이니 이번에도 모른 척 넘어간다.", "Look the other way again, since you are peers."), tx("한 사람에게만 느슨하면 승인 기준이 친분에 따라 달라집니다.", "When it is looser for one person, the approval standard depends on friendship.")),
          option("c", tx("준호와 1:1로 누구에게나 같은 기준이라고 말하고, 사례를 팀장에게 바로 알린다.", "Tell Junho one on one that the standard is the same for everyone, and tell the team leader about the cases right away.")),
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
          option("a", tx("허들에서 이미 말했으니 다시 설명하지 않는다.", "Don't explain again, since you covered it in the huddle."), tx("네 명이 같은 것을 묻는다면 전달이 충분하지 않았다는 신호입니다.", "When four people ask the same thing, the message did not get through.")),
          option("b", tx("답을 정리해 팀 채팅방에 올리고 지식 베이스 업데이트를 요청하며, 서준에게는 그 문서 위치를 보여 준다.", "Sum up the answer in the team chat, ask for a knowledge base update, and show Seojun where the article is.")),
          option("c", tx("물어볼 때마다 한 사람씩 답한다.", "Answer each person as they ask."), tx("같은 질문이 계속 오고, 그동안 더 급한 요청을 놓칩니다.", "The same question keeps coming, and you miss more urgent requests meanwhile.")),
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
          option("a", tx("결근 사유를 들어 보고 병가로 처리해 준다.", "Hear the reasons and record them as sick leave."), tx("사유를 판단하고 근태를 정하는 것은 팀장의 몫입니다.", "Judging reasons and deciding attendance belong to the team leader.")),
          option("b", tx("결근 연락을 기록하고, 인원이 부족하다는 것을 팀장과 RTA에 바로 알린다.", "Record the absence messages, and tell the team leader and the RTA right away that the team is short.")),
          option("c", tx("서포트를 멈추고 혼자 콜을 더 받아 빈자리를 메운다.", "Stop supporting and take more calls yourself to fill the gap."), tx("혼자 메우는 동안 팀의 요청은 쌓이고, 인원을 조정할 수 있는 사람은 상황을 모릅니다.", "While you fill in alone, the team's requests pile up, and the people who can adjust staffing don't know.")),
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
        prompt: tx("캘리브레이션에서 확인 단계의 기준이 바뀌었고, 바뀐 기준의 평가는 모레부터입니다. 다음 날 지민이 처음 듣는 이야기라며 찾아옵니다. 알맞은 것은 무엇일까요?", "Calibration changed the standard for the check step, and scoring on it starts the day after tomorrow. The next day, Jimin comes to you saying she has never heard of it. What fits best?"),
        options: [
          option("a", tx("지민에게 바뀐 기준을 설명하고, 아직 모르는 상담사가 없도록 허들과 팀 채팅방으로 바로 전한다.", "Explain the new standard to Jimin, and pass it on right away through the huddle and team chat so no agent is left unaware.")),
          option("b", tx("기준은 QA의 일이니 QA에게 물어보라고 한다.", "Tell her to ask QA, since standards are QA's job."), tx("바뀐 기준을 상담사에게 먼저 전하는 것은 직무전문가의 일입니다.", "Passing changed standards to agents first is the SME's job.")),
          option("c", tx("QA에게 지민만 이번 평가에서 빼 달라고 요청한다.", "Ask QA to leave Jimin out of this round of scoring."), tx("한 사람만 빼면 기준이 사람마다 달라집니다. 평가 전에 모두에게 기준을 전하는 것이 먼저입니다.", "Leaving out one person makes the standard differ by person. Passing the standard to everyone before scoring comes first.")),
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
          option("a", tx("준호의 경험을 믿고 승인한다.", "Trust Junho's experience and approve it."), tx("승인 범위 밖의 결정은 되돌리기 어렵고, 경험이 기준을 대신하지 않습니다.", "A decision beyond your limits is hard to undo, and experience does not replace the standard.")),
          option("b", tx("정책에 없으니 거절하고 준호에게 그대로 응대하게 한다.", "Turn it down because policy does not cover it, and let Junho carry on."), tx("거절로 끝내면 고객의 문제가 남습니다. 내가 정할 수 없는 건은 정할 수 있는 사람에게 넘깁니다.", "Turning it down leaves the customer's problem where it was. What you cannot decide goes to someone who can.")),
          option("c", tx("승인 범위 밖이므로 준호에게 고객 대기 안내를 부탁하고, 팀장에게 바로 넘긴다.", "It is outside your limits, so ask Junho to tell the customer there is a short wait, and pass it to the team leader right away.")),
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
};
