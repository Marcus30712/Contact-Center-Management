import { tx, node, edge, step, option } from './build.js';

const hard = ['join', 'join-hard', 'hard'];
const soft = [...hard, 'join-soft', 'soft'];
const listen = [...soft, 'join-listen', 'listen'];

export default {
  id: 'onboarding',
  order: 2,
  title: tx('온보딩 및 초기 교육', 'Onboarding and Initial Training'),
  short: tx('온보딩', 'Onboarding'),
  subtitle: tx('실제 전화를 받기 전에 지식과 시스템을 익힙니다.', 'Learning the knowledge and systems before taking real calls.'),
  diagram: {
    nodes: [
      node('join', '입사', 58, 120, 'Day one'),
      node('hard', '하드 스킬', 180, 48, 'Hard skills'),
      node('soft', '소프트 스킬', 180, 120, 'Soft skills'),
      node('listen', '녹취 청취', 180, 192, 'Call listening'),
      node('ready', '실전 준비', 302, 120, 'Ready'),
    ],
    edges: [
      edge('join', 'hard'), edge('join', 'soft'), edge('join', 'listen'),
      edge('hard', 'ready'), edge('soft', 'ready'), edge('listen', 'ready'),
    ],
  },
  steps: [
    step(tx('지민이 첫 출근을 합니다. 실무에 들어가기 전에 필수 지식과 시스템을 익히는 기간이 온보딩입니다. 기간은 센터마다 다르지만 보통 2~4주입니다.', 'Jimin starts her first day. Onboarding is the period for learning the essential knowledge and systems before live work. The length varies by center, but it usually takes 2 to 4 weeks.'),
      ['join'], ['join'], 'join'),
    step(tx('하드 스킬은 "무엇을 안내할지"입니다. 자사 상품과 서비스 지식, 약관, 그리고 CRM(고객관계관리)과 CTI(전화 시스템) 조작법을 배웁니다.', 'Hard skills are what to tell the customer. Trainees learn the company’s products and services, the terms and conditions, and how to operate the CRM (customer relationship management) and CTI (telephony) systems.'),
      hard, ['hard', 'join-hard'], 'hard'),
    step(tx('지민은 상품 지식을 빨리 익힙니다. 하지만 말하면서 CRM에 입력하는 손은 아직 느립니다. 채용에서 본 멀티태스킹이 여기서 훈련 과제가 됩니다.', 'Jimin picks up product knowledge quickly. Her hands are still slow at entering data into the CRM while she talks. The multitasking seen in hiring now becomes a training task.'),
      hard, ['hard'], 'hard'),
    step(tx('소프트 스킬은 "어떻게 말할지"입니다. 전화 응대 예절, 경청 기법, 불만 고객 응대 화법, 감정 조절 방법을 훈련합니다.', 'Soft skills are how to say it. Trainees practice phone etiquette, active listening, wording for frustrated customers, and ways to manage their own emotions.'),
      soft, ['soft', 'join-soft'], 'soft'),
    step(tx('녹취 청취도 합니다. 선배 상담사의 우수 콜과 클레임 콜을 들으며 실제 응대가 어떻게 흘러가는지 파악합니다.', 'There is also call listening. Trainees listen to recordings of senior agents’ best calls and complaint calls to learn how a real conversation flows.'),
      listen, ['listen', 'join-listen'], 'listen'),
    step(tx('클레임 콜을 듣는 지민의 표정이 굳습니다. 이때 그 콜이 왜 그렇게 흘러갔고 선배가 어떻게 수습했는지 함께 짚어 주면, 겁이 배움으로 바뀝니다.', 'Jimin’s face tightens as she listens to a complaint call. Walk through why the call went that way and how the senior agent recovered it, and the fear turns into learning.'),
      listen, ['listen'], 'listen'),
    step(tx('세 가지를 갖추면 실전 준비가 끝납니다. 다만 교육장에서 아는 것과 실제 고객 앞에서 해내는 것은 다릅니다.', 'With all three in place, she is ready for live calls. Still, knowing something in the classroom is different from doing it in front of a real customer.'),
      [...listen, 'hard-ready', 'soft-ready', 'listen-ready', 'ready'], ['ready'], 'ready'),
  ],
  checkpoint: [{
    id: 'onboarding-q1',
    prompt: tx('교육 막바지, 지민은 상품 시험에서 만점을 받았지만 실습에서는 CRM 입력을 자주 놓칩니다. 어떻게 할까요?', 'Near the end of training, Jimin scores full marks on the product test but often misses CRM entries in practice calls. What do you do?'),
    options: [
      option('a', tx('시험 점수가 좋으니 그대로 수료시킨다.', 'Her test score is good, so let her graduate as is.')),
      option('b', tx('통화하면서 입력하는 실습 시간을 더 준다.', 'Give her more practice time entering data while on a call.')),
      option('c', tx('"입력은 실전에서 익히면 된다"고 말해 준다.', 'Tell her she can pick up data entry on the job.')),
    ],
    answer: 'b',
    explanation: tx('아는 것과 통화 중에 해내는 것은 다른 능력입니다. 시스템 조작은 하드 스킬의 일부이고, 실전에 들어가기 전에 손에 익혀야 합니다. 그대로 넘기면 지민은 첫 콜부터 입력과 응대를 동시에 놓치게 됩니다.', 'Knowing something and doing it mid-call are different abilities. Operating the system is part of hard skills and needs to be in her hands before live work. If you pass it over, Jimin will drop both the entry and the conversation from her very first call.'),
  }],
  connection: {
    to: 'nesting',
    text: tx('교육을 마쳐도 아직 실제 고객을 만난 적은 없습니다. 첫 전화를 받는 순간이 가장 흔들리는 때입니다. 다음 단계인 네스팅은 그 순간을 혼자 두지 않기 위한 장치입니다.', 'Finishing training still means she has never met a real customer. The first live call is the shakiest moment. The next stage, nesting, exists so she does not face that moment alone.'),
  },
};
