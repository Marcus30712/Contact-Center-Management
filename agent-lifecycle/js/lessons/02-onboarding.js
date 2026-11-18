import { tx, node, edge, step, option, trackStep, trackQuestion } from './build.js';

const hard = ['join', 'join-hard', 'hard'];
const soft = [...hard, 'join-soft', 'soft'];
const listen = [...soft, 'join-listen', 'listen'];
const verify = [...listen, 'hard-verify', 'soft-verify', 'listen-verify', 'verify'];

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
      node('verify', '스킬 검증', 302, 84, 'Verification'),
      node('ready', '실전 준비', 302, 172, 'Ready'),
    ],
    edges: [
      edge('join', 'hard'), edge('join', 'soft'), edge('join', 'listen'),
      edge('hard', 'verify'), edge('soft', 'verify'), edge('listen', 'verify'), edge('verify', 'ready'),
    ],
  },
  steps: [
    step(tx('지민이 첫 출근을 합니다. 실무에 들어가기 전에 필수 지식과 시스템을 익히는 기간이 온보딩입니다. 기간은 센터마다 다르지만 보통 2~4주입니다.', 'Jimin starts her first day. Onboarding is the period for learning the essential knowledge and systems before live work. The length varies by center, but it usually takes 2 to 4 weeks.'),
      ['join'], ['join'], 'join'),
    step(tx('팀장은 지민에게 버디(Buddy)를 정해 주고 팀원들에게 소개합니다. 편하게 물어볼 사람이 생기면 적응이 쉬워집니다. 첫 주가 끝나면 1:1로 만나 어려운 점을 듣고 필요한 지원을 약속합니다.', 'The team leader assigns Jimin a buddy and introduces her to the team. Having someone she can ask freely makes settling in easier. At the end of the first week, the team leader meets her one-on-one to hear what was hard and commit to the support she needs.'),
      ['join'], ['join'], 'join'),
    step(tx('하드 스킬은 "무엇을 안내할지"입니다. 자사 상품과 서비스 지식, 약관, 그리고 CRM(고객관계관리)과 CTI(전화 시스템) 조작법을 배웁니다.', 'Hard skills are what to tell the customer. Trainees learn the company’s products and services, the terms and conditions, and how to operate the CRM (customer relationship management) and CTI (telephony) systems.'),
      hard, ['hard', 'join-hard'], 'hard'),
    step(tx('지민은 상품 지식을 빨리 익힙니다. 하지만 말하면서 CRM에 입력하는 손은 아직 느립니다. 채용에서 본 멀티태스킹이 여기서 훈련 과제가 됩니다.', 'Jimin picks up product knowledge quickly. Her hands are still slow at entering data into the CRM while she talks. The multitasking seen in hiring now becomes a training task.'),
      hard, ['hard'], 'hard'),
    trackStep('general', tx('일반 고객지원은 다루는 상품과 정책, 절차의 범위가 넓습니다. 그래서 자주 들어오는 문의 유형별로 응대 흐름을 묶어서 익히게 합니다.', 'General support covers a wide range of products, policies, and procedures. So trainees learn handling flows grouped by the most common inquiry types.'),
      hard, ['hard'], 'hard'),
    trackStep('tech', tx('기술지원은 제품 구조와 진단 도구, 티켓을 기록하는 방법, 지식 자료를 찾는 법을 익힙니다. 전화든 채팅이든 이메일이든 문의는 모두 티켓으로 남기 때문입니다. 제품이 바뀔 때마다 교육도 이어집니다.', 'Tech support trainees learn the product architecture, diagnostic tools, how to document a ticket, and how to find knowledge base articles. That is because every inquiry is logged as a ticket, whether it arrives by phone, chat, or email. Training continues every time the product changes.'),
      hard, ['hard'], 'hard'),
    step(tx('소프트 스킬은 "어떻게 말할지"입니다. 전화 응대 예절, 경청 기법, 불만 고객 응대 화법, 감정 조절 방법을 훈련합니다.', 'Soft skills are how to say it. Trainees practice phone etiquette, active listening, wording for frustrated customers, and ways to manage their own emotions.'),
      soft, ['soft', 'join-soft'], 'soft'),
    step(tx('녹취 청취도 합니다. 선배 상담사의 우수 콜과 클레임 콜을 들으며 실제 응대가 어떻게 흘러가는지 파악합니다.', 'There is also call listening. Trainees listen to recordings of senior agents’ best calls and complaint calls to learn how a real conversation flows.'),
      listen, ['listen', 'join-listen'], 'listen'),
    step(tx('클레임 콜을 듣는 지민의 표정이 굳습니다. 이때 그 콜이 왜 그렇게 흘러갔고 선배가 어떻게 수습했는지 함께 짚어 주면, 겁이 배움으로 바뀝니다.', 'Jimin’s face tightens as she listens to a complaint call. Walk through why the call went that way and how the senior agent recovered it, and the fear turns into learning.'),
      listen, ['listen'], 'listen'),
    step(tx('교육을 마친 것과 실전에 준비된 것은 같지 않습니다. 그래서 교육 끝에 스킬 검증을 둡니다. 지식 시험과 모의 콜 평가로 실제 고객을 응대해도 되는 수준인지 확인합니다.', 'Finishing training is not the same as being ready for live work. That is why training ends with skills verification. A knowledge test and scored mock calls confirm that the trainee is ready to serve real customers.'),
      verify, ['verify', 'hard-verify', 'soft-verify', 'listen-verify'], 'verify'),
    step(tx('기준에 못 미쳤다고 바로 탈락은 아닙니다. 부족한 부분을 보충 교육한 뒤 재평가합니다. 합격 기준과 재평가 방식은 센터마다 다릅니다.', 'Falling short of the standard does not mean being dropped right away. The trainee gets extra training on the weak areas and is assessed again. The pass standard and the reassessment process vary by center.'),
      verify, ['verify'], 'verify'),
    step(tx('검증을 통과한 지민은 실전 준비를 마쳤습니다. 다만 교육장에서 해내는 것과 실제 고객 앞에서 해내는 것은 또 다릅니다.', 'Having passed verification, Jimin is ready for live work. Still, doing it in the classroom is different again from doing it in front of a real customer.'),
      [...verify, 'verify-ready', 'ready'], ['ready', 'verify-ready'], 'ready'),
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
  }, trackQuestion('general', {
    id: 'onboarding-general',
    prompt: tx('일반 고객지원 신입 교육에서 다룰 정책과 절차가 너무 많다는 말이 나옵니다. 어떻게 할까요?', 'People say there are too many policies and procedures to cover in general support new-hire training. What do you do?'),
    options: [
      option('a', tx('전부 외울 때까지 교육 기간을 늘린다.', 'Extend training until everything is memorized.')),
      option('b', tx('자주 들어오는 문의 유형부터 응대 흐름으로 익히게 하고, 나머지는 찾아보는 법을 가르친다.', 'Teach the most common inquiry types as handling flows first, and teach how to look up the rest.')),
      option('c', tx('실전에서 겪으면서 배우라고 한다.', 'Tell them to learn it by going through it on live calls.')),
    ],
    answer: 'b',
    explanation: tx('범위가 넓을수록 전부 외우게 하기는 어렵습니다. 자주 쓰는 흐름을 먼저 손에 익히고, 드문 문의는 자료에서 찾는 법을 알게 하는 편이 실전에 가깝습니다. 그래야 지민도 스킬 검증에서 무엇을 평가받는지 분명히 압니다.', 'The wider the scope, the harder it is to have everything memorized. Getting the common flows into their hands first and knowing how to look up rare cases is closer to real work. It also makes clear to Jimin what skills verification will assess.'),
  }), trackQuestion('tech', {
    id: 'onboarding-tech',
    prompt: tx('기술지원 교육 중인 지민이 문제는 잘 해결하는데 티켓 기록을 한 줄로만 남깁니다. 어떻게 할까요?', 'In tech support training, Jimin solves problems well but leaves only one line in the ticket. What do you do?'),
    options: [
      option('a', tx('해결했으니 기록은 넘어간다.', 'The problem was solved, so let the notes go.')),
      option('b', tx('다음 사람이 읽고 이어받을 수 있게 증상, 확인한 것, 조치를 남기는 연습을 시킨다.', 'Have her practice recording the symptom, what she checked, and what she did, so the next person can pick it up.')),
      option('c', tx('기록은 나중에 몰아서 쓰게 한다.', 'Let her write up the notes later in a batch.')),
    ],
    answer: 'b',
    explanation: tx('기술지원의 티켓은 다른 채널이나 상위 단계로 넘어갈 수 있습니다. 기록이 부실하면 다음 담당자가 고객에게 같은 질문을 다시 하게 됩니다. 기록도 교육에서 익혀야 할 스킬입니다.', 'A tech support ticket can move to another channel or to a higher tier. With thin notes, the next owner has to ask the customer the same questions again. Documentation is a skill to learn in training too.'),
  })],
  connection: {
    to: 'nesting',
    text: tx('스킬 검증을 통과해도 아직 실제 고객을 만난 적은 없습니다. 첫 응대의 순간이 가장 흔들리는 때입니다. 다음 단계인 네스팅은 그 순간을 혼자 두지 않기 위한 장치입니다.', 'Passing skills verification still means she has never met a real customer. The first live contact is the shakiest moment. The next stage, nesting, exists so she does not face that moment alone.'),
  },
};
