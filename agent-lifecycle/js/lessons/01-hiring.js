import { tx, node, edge, step, option, trackStep, trackQuestion } from './build.js';

const all = ['applicant', 'applicant-rjp', 'rjp', 'applicant-skills', 'skills', 'applicant-roleplay', 'roleplay'];

export default {
  id: 'hiring',
  order: 1,
  title: tx('채용 및 선발', 'Recruitment and Hiring'),
  short: tx('채용', 'Hiring'),
  subtitle: tx('자리를 채우는 것이 아니라, 이 일에 맞는 사람을 찾습니다.', 'Not filling seats. Finding people who fit this work.'),
  diagram: {
    nodes: [
      node('applicant', '지원자', 58, 120, 'Applicant'),
      node('rjp', '현실적 직무 안내', 180, 48, 'Job preview'),
      node('skills', '역량 평가', 180, 120, 'Skills check'),
      node('roleplay', '모의 상담', 180, 192, 'Mock call'),
      node('hire', '합격', 302, 120, 'Offer'),
    ],
    edges: [
      edge('applicant', 'rjp'), edge('applicant', 'skills'), edge('applicant', 'roleplay'),
      edge('rjp', 'hire'), edge('skills', 'hire'), edge('roleplay', 'hire'),
    ],
  },
  steps: [
    step(tx('채용은 인원을 채우는 일이 아닙니다. 컨택센터 환경에 맞는 성향을 가진 사람을 찾는 일입니다. 지원자 한지민을 따라가 봅니다.', 'Hiring is not about filling headcount. It is about finding people whose temperament fits a contact center. Follow one applicant, Jimin Han.'),
      ['applicant'], ['applicant'], 'applicant'),
    step(tx('첫 순서는 현실적 직무 안내(RJP)입니다. 업무 강도, 교대 근무 여부, 감정노동의 수준을 지원 단계에서 솔직하게 알려 줍니다.', 'First comes the realistic job preview (RJP). At the application stage you tell candidates honestly about the workload, shift work, and the level of emotional labor.'),
      ['applicant', 'applicant-rjp', 'rjp'], ['rjp', 'applicant-rjp'], 'rjp'),
    step(tx('좋은 점만 듣고 들어온 사람은 입사 직후 현실을 만나 떠나기 쉽습니다. RJP의 목적은 지원자를 줄이는 것이 아니라 조기 퇴사를 막는 것입니다. 지민은 설명을 다 듣고도 지원을 이어 갑니다.', 'People who hear only the good parts tend to leave soon after they meet the reality. The point of an RJP is to prevent early attrition, not to shrink the applicant pool. Jimin hears all of it and stays in the process.'),
      ['applicant', 'applicant-rjp', 'rjp'], ['rjp'], 'rjp'),
    step(tx('다음은 역량 평가입니다. 의사소통, 공감, 스트레스 내성, 그리고 상담하면서 전산을 입력하는 멀티태스킹 능력을 봅니다.', 'Next is the skills assessment. It looks at communication, empathy, stress tolerance, and multitasking: typing into the system while talking.'),
      ['applicant', 'applicant-rjp', 'rjp', 'applicant-skills', 'skills'], ['skills', 'applicant-skills'], 'skills'),
    step(tx('지민은 말이 빠른 편은 아닙니다. 대신 상대의 말을 끝까지 듣고 나서 답합니다. 평가자는 이 점을 기록해 둡니다.', 'Jimin is not a fast talker. She listens to the end before she answers. The assessor writes that down.'),
      ['applicant', 'applicant-rjp', 'rjp', 'applicant-skills', 'skills'], ['skills'], 'skills'),
    trackStep('general', tx('일반 고객지원 채용에서는 폭넓은 문의를 다루는 대화력과 공감을 더 눈여겨봅니다. 정해진 정책 안에서 고객에게 맞는 해결책을 찾아내는 유연성도 봅니다.', 'For general support, hiring pays closer attention to conversational range and empathy across many kinds of inquiries. It also looks for the flexibility to find a solution that fits the customer within set policy.'),
      ['applicant', 'applicant-rjp', 'rjp', 'applicant-skills', 'skills'], ['skills'], 'skills'),
    trackStep('tech', tx('기술지원 채용에서는 원인을 단계적으로 좁혀 가는 문제 해결력을 더 눈여겨봅니다. 기술적인 내용을 쉬운 말로 풀어 설명하는지, 채팅과 이메일처럼 글로도 응대할 수 있는지 봅니다.', 'For tech support, hiring pays closer attention to the ability to narrow down a cause step by step. It also checks whether the candidate can explain technical points in plain words and handle written channels such as chat and email.'),
      ['applicant', 'applicant-rjp', 'rjp', 'applicant-skills', 'skills'], ['skills'], 'skills'),
    step(tx('마지막은 모의 상담입니다. 실제와 비슷한 상황을 롤플레잉으로 주고, 문제를 어떻게 풀어 가는지 확인합니다.', 'Last is the mock call. A role-play close to a real situation shows how the candidate works through a problem.'),
      all, ['roleplay', 'applicant-roleplay'], 'roleplay'),
    trackStep('tech', tx('기술지원의 모의 상담에는 장애 진단 상황을 넣습니다. 지민이 증상을 묻고 가능한 원인을 하나씩 확인해 가는 순서를 봅니다.', 'The tech support mock call includes a fault-diagnosis scenario. You watch the order in which Jimin asks about symptoms and checks possible causes one by one.'),
      all, ['roleplay'], 'roleplay'),
    step(tx('정답을 아는지보다 막혔을 때 어떻게 하는지가 드러납니다. 지민은 모르는 질문에 "확인하고 정확히 안내드리겠습니다"라고 답합니다.', 'It reveals what someone does when stuck, more than whether they know the answer. Faced with a question she cannot answer, Jimin says, “Let me check and give you the right information.”'),
      all, ['roleplay'], 'roleplay'),
    step(tx('세 과정을 거친 지민이 합격합니다. 팀장이 받게 될 팀원은 이 과정을 거쳐 온 사람입니다.', 'After these three steps, Jimin gets the offer. The agent who joins your team has come through this process.'),
      [...all, 'rjp-hire', 'skills-hire', 'roleplay-hire', 'hire'], ['hire'], 'hire'),
  ],
  checkpoint: [{
    id: 'hiring-q1',
    prompt: tx('면접에 함께 들어간 자리에서 지민이 묻습니다. "야간이나 주말 교대가 자주 있나요?" 어떻게 답할까요?', 'You sit in on the interview and Jimin asks, “Are night or weekend shifts common?” How do you answer?'),
    options: [
      option('a', tx('"입사하면 조율할 수 있어요"라고 가볍게 넘긴다.', 'Brush it off: “We can sort that out once you join.”')),
      option('b', tx('실제 교대 빈도와 힘든 점을 있는 그대로 설명한다.', 'Describe the real shift pattern and the hard parts as they are.')),
      option('c', tx('지원 의지가 약해 보이니 감점한다.', 'Mark her down for seeming less committed.')),
    ],
    answer: 'b',
    explanation: tx('현실적 직무 안내의 핵심은 솔직함입니다. 지금 듣기 좋은 답은 입사 직후의 조기 퇴사로 돌아옵니다. 근무 조건을 묻는 지원자는 오히려 오래 일할 생각으로 따져 보는 중일 수 있습니다.', 'Honesty is the core of a realistic job preview. An answer that sounds good today comes back as early attrition right after joining. A candidate who asks about working conditions may well be weighing whether she can stay for the long run.'),
  }, trackQuestion('general', {
    id: 'hiring-general',
    prompt: tx('일반 고객지원 팀의 모의 상담입니다. 지원자가 정책상 들어줄 수 없는 요청을 받았습니다. 어떤 응대를 높게 볼까요?', 'This is a mock call for a general support team. The candidate gets a request that policy does not allow. Which response do you rate highly?'),
    options: [
      option('a', tx('규정상 안 된다는 말만 되풀이한다.', 'Keeps repeating that the rules do not allow it.')),
      option('b', tx('안 되는 이유를 설명하고, 정책 안에서 가능한 다른 방법을 제안한다.', 'Explains why not, and offers another option that policy does allow.')),
      option('c', tx('고객이 원하니 규정과 다르게 처리해 주겠다고 한다.', 'Promises to handle it outside the rules because the customer wants it.')),
    ],
    answer: 'b',
    explanation: tx('일반 고객지원은 다양한 문의를 정책 안에서 풀어야 합니다. 거절만 하는 것도, 규정을 벗어나는 것도 답이 아닙니다. 지민처럼 끝까지 듣고 가능한 길을 찾는 태도가 이 직군에 맞습니다.', 'General support has to resolve a wide range of inquiries within policy. Neither a flat refusal nor bending the rules is the answer. Listening to the end and finding a workable path, as Jimin does, suits this kind of team.'),
  }), trackQuestion('tech', {
    id: 'hiring-tech',
    prompt: tx('기술지원 팀의 모의 상담입니다. 지원자가 처음 보는 오류 증상을 만났습니다. 어떤 응대를 높게 볼까요?', 'This is a mock call for a tech support team. The candidate meets an error symptom they have never seen. Which response do you rate highly?'),
    options: [
      option('a', tx('가장 흔한 해결법 하나를 바로 안내하고 끝낸다.', 'Gives the single most common fix right away and stops there.')),
      option('b', tx('증상과 발생 조건을 먼저 묻고, 가능한 원인을 하나씩 확인한다.', 'Asks about the symptom and when it happens first, then checks possible causes one by one.')),
      option('c', tx('전문 용어를 써서 길게 설명한다.', 'Explains at length in technical jargon.')),
    ],
    answer: 'b',
    explanation: tx('기술지원에서는 답을 아는지보다 원인을 좁혀 가는 과정이 중요합니다. 추측으로 건너뛰면 같은 티켓이 다시 열립니다. 지민이 고객이 알아들을 수 있는 말로 묻고 설명하는지도 함께 봅니다.', 'In tech support, the process of narrowing down the cause matters more than knowing the answer. Skip ahead on a guess and the same ticket gets reopened. You also watch whether Jimin asks and explains in words the customer can follow.'),
  })],
  connection: {
    to: 'onboarding',
    text: tx('채용에서 확인한 것은 성향과 가능성입니다. 상품 지식도 시스템 조작도 아직 없습니다. 그 간격을 메우는 것이 다음 단계, 온보딩입니다.', 'Hiring confirms temperament and potential. Product knowledge and system skills are not there yet. Closing that gap is the next stage, onboarding.'),
  },
};
