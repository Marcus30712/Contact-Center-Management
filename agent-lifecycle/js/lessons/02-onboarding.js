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
      node('ready', 'OJT 준비', 302, 172, 'Ready for OJT'),
    ],
    edges: [
      edge('join', 'hard'), edge('join', 'soft'), edge('join', 'listen'),
      edge('hard', 'verify'), edge('soft', 'verify'), edge('listen', 'verify'), edge('verify', 'ready'),
    ],
  },
  steps: [
    step(tx('지민이 첫 출근을 합니다. 실무에 들어가기 전에 필수 지식과 시스템을 익히는 기간이 온보딩입니다. 기간은 센터마다 다릅니다(예시: 2~4주).', 'Jimin starts her first day. Onboarding is the period for learning the essential knowledge and systems before live work. The length varies by center (Example: 2 to 4 weeks).'),
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
    step(tx('검증을 통과한 지민은 OJT에 나갈 준비를 마쳤습니다. 다만 교육장에서 해내는 것과 실제 고객 앞에서 해내는 것은 또 다릅니다.', 'Having passed verification, Jimin is ready for OJT. Still, doing it in the classroom is different again from doing it in front of a real customer.'),
      [...verify, 'verify-ready', 'ready'], ['ready', 'verify-ready'], 'ready'),
  ],
  checkpoint: [{
    id: 'onboarding-q1',
    prompt: tx('교육 막바지, 지민은 상품 시험에서 만점을 받았지만 실습에서는 CRM 입력을 자주 놓칩니다. 어떻게 할까요?', 'Near the end of training, Jimin scores full marks on the product test but often misses CRM entries in practice calls. What do you do?'),
    options: [
      option('a', tx('시험 점수만으로 판단해 그대로 스킬 검증을 통과시킨다.', 'Pass her through verification as is, on her test score alone.'), tx('시험 점수는 아는 것을 보여 줄 뿐, 통화하면서 입력하는 손이 준비됐다는 뜻은 아닙니다.', 'A test score shows what she knows; it does not mean her hands are ready to type while she talks.')),
      option('b', tx('통화하면서 입력하는 실습 시간을 더 준다.', 'Give her more practice time entering data while on a call.')),
      option('c', tx('"입력은 실전에서 익히면 된다"고 말해 준다.', 'Tell her she can pick up data entry on the job.'), tx('실전에서 익히라고 하면 첫 고객들이 입력 누락과 늦어진 응대를 그대로 겪게 됩니다.', 'Leaving it to the job means her first customers live with the missed entries and slower service.')),
    ],
    answer: 'b',
    explanation: tx('아는 것과 통화 중에 해내는 것은 다른 능력입니다. 시스템 조작은 하드 스킬의 일부이고, 실전에 들어가기 전에 손에 익혀야 합니다. 그대로 넘기면 지민은 첫 콜부터 입력과 응대를 동시에 놓치게 됩니다.', 'Knowing something and doing it mid-call are different abilities. Operating the system is part of hard skills and needs to be in her hands before live work. If you pass it over, Jimin will drop both the entry and the conversation from her very first call.'),
  }, trackQuestion('general', {
    id: 'onboarding-general',
    prompt: tx('일반 고객지원 신입 교육에서 다룰 정책과 절차가 너무 많다는 말이 나옵니다. 어떻게 할까요?', 'People say there are too many policies and procedures to cover in general support new-hire training. What do you do?'),
    options: [
      option('a', tx('틀린 안내를 막으려고, 전부 외울 때까지 교육 기간을 늘린다.', 'Extend training until everything is memorized, to prevent wrong answers.'), tx('교육 기간을 늘려도 넓은 정책을 전부 외우기는 어렵고, 실전 배치만 늦어집니다.', 'A longer training period still will not make the whole range of policy memorable; it only delays going live.')),
      option('b', tx('자주 오는 문의 흐름부터 익히고, 나머지는 찾는 법을 가르친다.', 'Teach the common inquiry flows first, and how to look up the rest.')),
      option('c', tx('교육은 핵심만 짧게 하고, 나머지는 실전에서 겪으면서 배우라고 한다.', 'Keep training to the essentials and let them learn the rest on live contacts.'), tx('찾아보는 법도 모른 채 실전에서 배우게 하면, 틀린 안내가 고객에게 그대로 전해집니다.', 'Learning on live contacts without knowing how to look things up passes wrong information straight to customers.')),
    ],
    answer: 'b',
    explanation: tx('범위가 넓을수록 전부 외우게 하기는 어렵습니다. 자주 쓰는 흐름을 먼저 손에 익히고, 드문 문의는 자료에서 찾는 법을 알게 하는 편이 실전에 가깝습니다. 그래야 실전에서 드문 문의를 만나도 스스로 찾아 확인할 수 있습니다.', 'The wider the scope, the harder it is to have everything memorized. Getting the common flows into their hands first and knowing how to look up rare cases is closer to real work. That way, when a rare inquiry comes up on live contacts, she can look it up and check it herself.'),
  }), trackQuestion('tech', {
    id: 'onboarding-tech',
    prompt: tx('기술지원 교육 중인 지민이 문제는 잘 해결하는데 티켓 기록을 한 줄로만 남깁니다. 어떻게 할까요?', 'In tech support training, Jimin solves problems well but leaves only one line in the ticket. What do you do?'),
    options: [
      option('a', tx('해결을 먼저 보고, 기록은 한 줄이라도 남겼으면 넘어간다.', 'Look at the fix first, and let it go as long as there is a line in the ticket.'), tx('해결했더라도 기록이 한 줄뿐이면, 같은 고객이 다시 연락했을 때 다음 담당자가 처음부터 다시 물어야 합니다.', 'Even when it is solved, a one-line record means the next agent has to ask everything again if the customer comes back.')),
      option('b', tx('증상, 확인한 것, 조치를 남기는 연습을 시킨다.', 'Have her practice recording the symptom, what she checked, and what she did.')),
      option('c', tx('기록은 나중에 몰아서 쓰게 한다.', 'Let her write up the notes later in a batch.'), tx('나중에 몰아서 쓰면 확인한 내용과 순서를 잊어 기록이 부정확해집니다.', 'Writing records up in a batch later means forgetting what was checked and in what order, so the records become inaccurate.')),
    ],
    answer: 'b',
    explanation: tx('기술지원의 티켓은 다른 채널이나 상위 단계로 넘어갈 수 있습니다. 기록이 부실하면 다음 담당자가 고객에게 같은 질문을 다시 하게 됩니다. 기록도 교육에서 익혀야 할 스킬입니다.', 'A tech support ticket can move to another channel or to a higher tier. With thin notes, the next owner has to ask the customer the same questions again. Documentation is a skill to learn in training too.'),
  }), trackQuestion('general', {
    id: 'onboarding-general-2',
    prompt: tx('일반 고객지원 스킬 검증의 모의 콜에서 지민은 자주 들어오는 문의는 잘 처리했지만, 드문 정책 문의에서 틀리게 안내했습니다. 어떻게 할까요?', 'In the general support skills verification mock call, Jimin handles the common inquiries well but gives wrong information on a rarer policy question. What do you do?'),
    options: [
      option('a', tx('대부분 맞은 것을 보고 합격시키고, 실전에서 배우게 한다.', 'Pass her because she got most of it right, and let her learn on the job.'), tx('드문 문의라도 틀린 안내는 고객 불만으로 이어지므로, 대부분 맞았다는 이유로 넘길 수 없습니다.', 'Wrong information leads to complaints even on rare inquiries, so getting most of it right is not a reason to let it pass.')),
      option('b', tx('틀린 안내 하나로 기준 미달 판정을 내리고 바로 탈락시킨다.', 'Rule the wrong information below the standard and drop her right away.'), tx('한 유형을 틀렸다고 바로 탈락시키면, 보충하면 충분히 해낼 사람을 잃습니다.', 'Failing her for one inquiry type loses someone who could do the job well after a little more training.')),
      option('c', tx('보충 교육 뒤 그 유형으로 다시 평가한다.', 'Give extra training, then reassess her on that type.')),
    ],
    answer: 'c',
    explanation: tx('스킬 검증은 탈락시키려는 자리가 아니라, 실전에 나갈 준비가 됐는지 확인하는 자리입니다. 일반 고객지원은 정책 범위가 넓어서, 틀린 안내가 그대로 고객 불만으로 이어집니다.', 'Skills verification is not there to weed people out; it confirms readiness for real customers. General support covers a wide range of policy, so wrong information turns straight into customer complaints.'),
  }), trackQuestion('tech', {
    id: 'onboarding-tech-2',
    prompt: tx('기술지원 교육 막바지에 제품 업데이트가 나와 교육 자료 일부가 맞지 않게 됐습니다. 어떻게 할까요?', 'Near the end of tech support training, a product update makes part of the training material out of date. What do you do?'),
    options: [
      option('a', tx('바뀐 부분은 실전에서 알아서 익히게 한다.', 'Let the trainees pick up the changes on the job.'), tx('바뀐 내용을 모른 채 실전에 나가면, 업데이트 직후 몰리는 문의에 틀린 안내를 하게 됩니다.', 'Going live without knowing what changed means giving wrong answers in the rush of questions right after the update.')),
      option('b', tx('바뀐 부분을 지식 자료에서 찾는 법을 익히게 한다.', 'Have the trainees practice finding the changes in the knowledge base.')),
      option('c', tx('틀린 내용을 가르치지 않도록, 업데이트가 안정될 때까지 교육을 멈춘다.', 'Pause training until the update settles, so nothing wrong gets taught.'), tx('제품은 계속 바뀌므로 업데이트를 기다리면 교육은 끝나지 않습니다.', 'The product keeps changing, so waiting for updates to settle means training never ends.')),
    ],
    answer: 'b',
    explanation: tx('기술지원은 제품이 바뀌면 알아야 할 내용도 바뀝니다. 모든 내용을 외우게 하기보다, 지식 자료를 찾아 확인하는 습관을 교육 단계에서 길러 줍니다.', 'In tech support, when the product changes, what agents need to know changes too. Rather than memorizing everything, build the habit of looking things up in the knowledge base during training.'),
  })],
  connection: {
    to: 'nesting',
    text: tx('스킬 검증을 통과해도 아직 실제 고객을 만난 적은 없습니다. 첫 응대의 순간이 가장 흔들리는 때입니다. 다음 단계인 OJT와 네스팅은 그 순간을 혼자 두지 않기 위한 장치입니다.', 'Passing skills verification still means she has never met a real customer. The first live contact is the shakiest moment. The next stage, OJT and nesting, exists so she does not face that moment alone.'),
  },
};
