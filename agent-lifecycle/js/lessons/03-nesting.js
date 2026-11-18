import { tx, node, edge, step, option, trackStep, trackQuestion } from './build.js';

const base = ['grad', 'grad-nest', 'nest'];
const walk = [...base, 'mentor', 'mentor-nest'];
const all = [...walk, 'target', 'target-nest'];

export default {
  id: 'nesting',
  order: 3,
  title: tx('실전 배치 및 네스팅', 'Go-Live and Nesting'),
  short: tx('네스팅', 'Nesting'),
  subtitle: tx('처음 실제 전화를 받는 적응기. 가장 많이 떠나는 시기입니다.', 'The first weeks on real calls, when people are most likely to leave.'),
  diagram: {
    nodes: [
      node('grad', '교육 수료', 58, 120, 'Training done'),
      node('mentor', '플로어 워킹', 180, 48, 'Floor walking'),
      node('nest', '네스팅 그룹', 180, 120, 'Nesting group'),
      node('target', '목표치 완화', 180, 192, 'Relaxed targets'),
      node('team', '정식 팀', 302, 120, 'Regular team'),
    ],
    edges: [edge('grad', 'nest'), edge('mentor', 'nest'), edge('target', 'nest'), edge('nest', 'team')],
  },
  steps: [
    step(tx('교육을 마친 지민이 처음으로 실제 고객의 전화를 받습니다. 이 적응기는 컨택센터에서 이직률이 가장 높은 시기입니다. 그래서 집중 관리가 필요합니다.', 'Training is over, and Jimin takes real customer calls for the first time. This adjustment period has the highest attrition in a contact center. That is why it needs close attention.'),
      ['grad'], ['grad'], 'grad'),
    step(tx('곧바로 정식 팀에 넣지 않습니다. 별도의 집중 케어 그룹에서 먼저 전화를 받게 하는데, 이것이 네스팅입니다. 보통 1~2주 동안 운영합니다.', 'She does not go straight into a regular team. She first takes calls in a separate, closely supported group, which is called nesting. It usually runs for 1 to 2 weeks.'),
      base, ['nest', 'grad-nest'], 'nest'),
    step(tx('지민의 첫 콜입니다. 고객이 교육에서 다루지 않은 것을 묻습니다. 지민의 말이 멈춥니다.', 'Jimin’s first call. The customer asks about something training did not cover. Jimin goes silent.'),
      base, ['nest'], 'nest'),
    step(tx('여기서 밀착 지원, 플로어 워킹이 움직입니다. 관리자나 선배 멘토가 옆에서 콜을 실시간으로 듣다가, 막히는 순간 채팅이나 귓속말 기능으로 바로 도와줍니다.', 'This is where floor walking comes in. A supervisor or senior mentor listens to the call live from close by and helps at once through chat or the whisper function when she gets stuck.'),
      walk, ['mentor', 'mentor-nest'], 'nest'),
    step(tx('멘토의 귓속말을 듣고 지민은 콜을 끝까지 마칩니다. 혼자 무너진 첫 콜과 도움을 받아 끝낸 첫 콜은 전혀 다른 기억으로 남습니다.', 'With the mentor’s whisper in her ear, Jimin finishes the call. A first call that fell apart alone and a first call finished with help leave very different memories.'),
      walk, ['mentor', 'nest'], 'nest'),
    step(tx('혼자 해결하기 어려운 불만 문의도 만납니다. 이때 따르는 순서가 에스컬레이션입니다. 끝까지 듣고, 자기 권한 안에서 먼저 해결을 시도합니다.', 'She will also meet complaints she cannot resolve alone. The sequence to follow then is escalation. Listen to the end, and first try to resolve it within your own authority.'),
      walk, ['nest'], 'nest'),
    step(tx('어렵다고 판단되면 고객과 논쟁하지 않고 상급자에게 전달하겠다고 정중히 안내합니다. 팀장에게 바로 알리고, 있었던 일을 사실대로 기록해 넘깁니다. 네스팅 기간에 이 순서를 몸에 익히게 합니다.', 'If that will not work, do not argue with the customer; tell them politely that you will pass it to a senior colleague. Notify the team leader right away, and record what happened factually before handing it over. Nesting is when this sequence becomes habit.'),
      walk, ['mentor', 'nest'], 'nest'),
    trackStep('general', tx('일반 고객지원에서는 쉬운 문의 유형부터 차례로 맡깁니다. 지민은 단순 조회와 안내 문의로 시작해, 익숙해지면 변경이나 불만 문의로 범위를 넓힙니다.', 'In general support, inquiry types are handed over from the easiest up. Jimin starts with simple lookups and information requests, then widens to changes and complaints as she gets comfortable.'),
      walk, ['nest'], 'nest'),
    trackStep('tech', tx('기술지원에서는 1차 지원 범위의 쉬운 티켓부터 맡깁니다. 그리고 언제 상위 단계로 넘길지, 에스컬레이션 기준을 익히게 합니다. 기준은 보통 들인 시간, 문제의 난이도, 고객이 받는 영향으로 정합니다.', 'In tech support, she starts with easy tickets within Tier 1 scope. She also learns the escalation criteria: when to pass a ticket to a higher tier. The criteria are usually set by time spent, difficulty of the problem, and impact on the customer.'),
      walk, ['nest'], 'nest'),
    step(tx('목표치도 완화합니다. 초기에는 평균 처리 시간(AHT) 같은 생산성 지표보다 정확한 안내와 적응에 초점을 맞춥니다.', 'Targets are relaxed too. Early on, the focus is on accurate information and settling in, not on productivity metrics such as average handle time (AHT).'),
      all, ['target', 'target-nest'], 'nest'),
    step(tx('지민의 통화는 선배들보다 깁니다. 이때 "왜 이렇게 오래 걸려요?"라는 말을 들으면, 지민은 정확히 안내하는 법보다 빨리 끊는 법을 먼저 배웁니다.', 'Jimin’s calls run longer than her seniors’ calls. If she hears “Why is this taking so long?” now, she learns to end calls quickly before she learns to get them right.'),
      all, ['target'], 'nest'),
    step(tx('네스팅을 마친 지민이 정식 팀으로 옵니다. 이제 팀장인 당신의 팀원입니다.', 'Nesting ends and Jimin joins a regular team. She is now on your team.'),
      [...all, 'nest-team', 'team'], ['team', 'nest-team'], 'team'),
  ],
  checkpoint: [{
    id: 'nesting-q1',
    prompt: tx('네스팅 셋째 날, 지민의 평균 처리 시간(AHT)이 팀 평균의 두 배쯤 됩니다. 안내 내용은 정확합니다. 어떻게 할까요?', 'On day three of nesting, Jimin’s average handle time (AHT) is about twice the team average. Her information is accurate. What do you do?'),
    options: [
      option('a', tx('정식 상담사와 같은 AHT 목표를 바로 적용한다.', 'Apply the same AHT target as regular agents right away.')),
      option('b', tx('정확한 안내를 칭찬하고, 속도는 적응한 뒤에 다루겠다고 알려 준다.', 'Praise the accuracy and tell her that speed can wait until she has settled in.')),
      option('c', tx('통화가 길어질 때마다 콜을 넘겨받아 대신 마무리한다.', 'Take over and finish the call whenever it runs long.')),
    ],
    answer: 'b',
    explanation: tx('네스팅 기간의 기준은 속도가 아니라 정확성과 적응입니다. 지금 시간을 압박하면 지민은 덜 해결하고 끊는 습관을 들이게 됩니다. 콜을 대신 받아 주면 스스로 끝내 본 경험이 쌓이지 않습니다.', 'During nesting the standard is accuracy and adjustment, not speed. Press on time now and Jimin builds a habit of ending calls with less resolved. Take calls over for her and she never gets the experience of finishing one herself.'),
  }, trackQuestion('general', {
    id: 'nesting-general',
    prompt: tx('네스팅 중인 지민에게 아직 맡기지 않은 유형인 복잡한 불만 문의가 연결됐습니다. 어떻게 할까요?', 'During nesting, Jimin is connected to a complex complaint, a type not yet assigned to her. What do you do?'),
    options: [
      option('a', tx('좋은 경험이니 끝까지 혼자 하게 둔다.', 'It is good experience, so leave her to finish it alone.')),
      option('b', tx('멘토가 옆에서 함께 처리하고, 그 유형은 준비된 뒤에 맡긴다.', 'Have the mentor handle it with her, and assign that type once she is ready.')),
      option('c', tx('제대로 못 하면 지민의 실수로 기록한다.', 'If it goes badly, record it as Jimin’s mistake.')),
    ],
    answer: 'b',
    explanation: tx('문의 유형을 차례로 넓히는 것은 지민이 감당할 수 있는 범위에서 성공 경험을 쌓게 하려는 것입니다. 준비되지 않은 유형이 들어오면 멘토가 함께 처리합니다. 그 콜은 나중에 좋은 교육 자료가 됩니다.', 'Widening inquiry types in order lets Jimin build successes within what she can handle. When an unprepared type comes in, the mentor handles it together with her. That call later becomes good training material.'),
  }), trackQuestion('tech', {
    id: 'nesting-tech',
    prompt: tx('네스팅 중인 지민이 한 티켓을 오래 붙잡고 있습니다. 원인을 찾지 못했지만 넘기기를 망설입니다. 어떻게 할까요?', 'During nesting, Jimin has been holding one ticket for a long time. She has not found the cause but hesitates to pass it on. What do you do?'),
    options: [
      option('a', tx('스스로 해결할 때까지 기다린다.', 'Wait until she solves it herself.')),
      option('b', tx('에스컬레이션 기준을 다시 짚어 주고, 확인한 내용을 기록해 상위 단계로 넘기게 한다.', 'Go over the escalation criteria again, and have her document what she checked and escalate.')),
      option('c', tx('대신 받아서 조용히 처리한다.', 'Take it over and resolve it quietly.')),
    ],
    answer: 'b',
    explanation: tx('넘기는 것은 실패가 아니라 정해진 절차입니다. 기준 없이 붙잡고 있으면 고객이 기다리는 시간만 길어집니다. 확인한 내용을 티켓에 남겨 넘기면 상위 단계가 처음부터 다시 묻지 않아도 됩니다.', 'Escalating is not a failure but a defined procedure. Holding on without criteria only lengthens the customer’s wait. If she documents what she checked in the ticket, the higher tier does not have to start the questions over.'),
  })],
  connection: {
    to: 'coaching',
    text: tx('네스팅에서는 일부러 지표를 느슨하게 뒀습니다. 정식 팀에 안착한 뒤에는 품질과 지표를 꾸준히 보고 끌어올려야 합니다. 다음 단계는 성과 관리와 코칭입니다.', 'In nesting you kept the metrics loose on purpose. Once she has settled into a regular team, quality and metrics need steady attention and steady improvement. The next stage is performance management and coaching.'),
  },
};
