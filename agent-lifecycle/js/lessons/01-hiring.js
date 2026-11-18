import { tx, node, edge, step, option } from './build.js';

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
    step(tx('마지막은 모의 상담입니다. 실제와 비슷한 상황을 롤플레잉으로 주고, 문제를 어떻게 풀어 가는지 확인합니다.', 'Last is the mock call. A role-play close to a real situation shows how the candidate works through a problem.'),
      all, ['roleplay', 'applicant-roleplay'], 'roleplay'),
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
  }],
  connection: {
    to: 'onboarding',
    text: tx('채용에서 확인한 것은 성향과 가능성입니다. 상품 지식도 시스템 조작도 아직 없습니다. 그 간격을 메우는 것이 다음 단계, 온보딩입니다.', 'Hiring confirms temperament and potential. Product knowledge and system skills are not there yet. Closing that gap is the next stage, onboarding.'),
  },
};
