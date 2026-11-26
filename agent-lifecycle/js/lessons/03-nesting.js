import { tx, node, edge, step, option, trackStep, trackQuestion } from './build.js';

const ojt = ['verified', 'verified-ojt', 'ojt'];
const base = [...ojt, 'ojt-nest', 'nest'];
const walk = [...base, 'mentor', 'mentor-nest'];
const all = [...walk, 'target', 'target-nest'];

export default {
  id: 'nesting',
  order: 3,
  title: tx('OJT 및 네스팅', 'OJT and Nesting'),
  short: tx('네스팅', 'Nesting'),
  subtitle: tx('처음 실제 문의를 받는 적응기. 가장 많이 떠나는 시기입니다.', 'The first weeks on real contacts, when people are most likely to leave.'),
  diagram: {
    nodes: [
      node('verified', '스킬 검증', 58, 62, 'Verified'),
      node('ojt', 'OJT', 58, 170, 'OJT'),
      node('mentor', '플로어 서포트', 180, 48, 'Floor support'),
      node('nest', '네스팅 그룹', 180, 120, 'Nesting group'),
      node('target', '목표치 완화', 180, 192, 'Relaxed targets'),
      node('grad', '수료', 302, 120, 'Graduation'),
      node('team', '실전 배치', 302, 196, 'Go Live'),
    ],
    edges: [edge('verified', 'ojt'), edge('ojt', 'nest'), edge('mentor', 'nest'), edge('target', 'nest'), edge('nest', 'grad'), edge('grad', 'team')],
  },
  steps: [
    step(tx('스킬 검증을 통과한 지민이 처음으로 실제 고객의 문의를 받습니다. 이 적응기는 컨택센터에서 퇴사율이 가장 높은 시기입니다. 그래서 집중 관리가 필요합니다.', 'Jimin has passed skills verification and handles real customer contacts for the first time. This adjustment period has the highest attrition in a contact center. That is why it needs close attention.'),
      ['verified'], ['verified'], 'verified'),
    step(tx('첫 단계는 OJT(직무교육)입니다. 트레이너와 직무전문가가 참관하는 가운데 실제 문의를 채널별로 경험해 봅니다.', 'The first step is OJT (on-the-job training). With a trainer and an SME observing, she handles real contacts in each channel.'),
      ojt, ['ojt', 'verified-ojt'], 'ojt'),
    step(tx('OJT를 마쳐도 곧바로 정식 팀에 넣지 않습니다. 별도의 집중 케어 그룹에서 먼저 문의를 받게 하는데, 이것이 네스팅입니다. 운영 기간은 센터마다 다릅니다(예시: 1~2주).', 'Even after OJT, she does not go straight into a regular team. She first takes contacts in a separate, closely supported group, which is called nesting. How long it runs varies by center (Example: 1 to 2 weeks).'),
      base, ['nest', 'ojt-nest'], 'nest'),
    step(tx('네스팅에서 받은 콜입니다. 고객이 교육에서 다루지 않은 것을 묻습니다. 지민의 말이 멈춥니다.', 'A call during nesting. The customer asks about something training did not cover. Jimin goes silent.'),
      base, ['nest'], 'nest'),
    step(tx('여기서 밀착 지원인 플로어 서포트가 움직입니다. 직무전문가나 선임이 옆에서 콜을 실시간으로 듣다가, 막히는 순간 채팅이나 귓속말 기능으로 바로 도와줍니다.', 'This is where floor support comes in. An SME or a senior agent listens to the call live from close by and helps at once through chat or the whisper function when she gets stuck.'),
      walk, ['mentor', 'mentor-nest'], 'nest'),
    step(tx('직무전문가의 귓속말을 듣고 지민은 콜을 끝까지 마칩니다. 혼자 무너진 첫 콜과 도움을 받아 끝낸 첫 콜은 전혀 다른 기억으로 남습니다.', 'With the SME’s whisper in her ear, Jimin finishes the call. A first call that fell apart alone and a first call finished with help leave very different memories.'),
      walk, ['mentor', 'nest'], 'nest'),
    step(tx('혼자 해결하기 어려운 불만 문의도 만납니다. 이때 따르는 순서가 에스컬레이션입니다. 끝까지 듣고, 자기 권한 안에서 먼저 해결을 시도합니다.', 'She will also meet complaints she cannot resolve alone. The sequence to follow then is escalation. Listen to the end, and first try to resolve it within your own authority.'),
      walk, ['nest'], 'nest'),
    step(tx('어렵다고 판단되면 고객과 논쟁하지 않고 상급자에게 전달하겠다고 정중히 안내합니다. 팀장에게 바로 알리고, 있었던 일을 사실대로 기록해 넘깁니다. 네스팅 기간에 이 순서를 몸에 익히게 합니다.', 'If that will not work, do not argue with the customer; tell them politely that you will pass it to someone more senior. Notify the team leader right away, and record what happened factually before handing it over. Nesting is when this sequence becomes habit.'),
      walk, ['mentor', 'nest'], 'nest'),
    trackStep('general', tx('일반 고객지원에서는 쉬운 문의 유형부터 차례로 맡깁니다. 지민은 단순 조회와 안내 문의로 시작해, 익숙해지면 변경이나 불만 문의로 범위를 넓힙니다.', 'In general support, inquiry types are handed over from the easiest up. Jimin starts with simple lookups and information requests, then widens to changes and complaints as she gets comfortable.'),
      walk, ['nest'], 'nest'),
    trackStep('tech', tx('기술지원에서는 1차 지원 범위의 쉬운 티켓부터 맡깁니다. 그리고 언제 상위 단계로 넘길지, 에스컬레이션 기준을 익히게 합니다. 기준은 보통 들인 시간, 문제의 난이도, 고객이 받는 영향으로 정합니다.', 'In tech support, she starts with easy tickets within Tier 1 scope. She also learns the escalation criteria: when to pass a ticket to a higher tier. The criteria are usually set by time spent, difficulty of the problem, and impact on the customer.'),
      walk, ['nest'], 'nest'),
    step(tx('목표치도 완화합니다. 초기에는 평균 처리 시간(AHT) 같은 생산성 지표보다 정확한 안내와 적응에 초점을 맞춥니다.', 'Targets are relaxed too. Early on, the focus is on accurate information and settling in, not on productivity metrics such as average handle time (AHT).'),
      all, ['target', 'target-nest'], 'nest'),
    step(tx('지민의 통화는 선배들보다 깁니다. 이때 "왜 이렇게 오래 걸려요?"라는 말을 들으면, 지민은 정확히 안내하는 법보다 빨리 끊는 법을 먼저 배웁니다.', 'Jimin’s calls run longer than her seniors’ calls. If she hears “Why is this taking so long?” now, she learns to end calls quickly before she learns to get them right.'),
      all, ['target'], 'nest'),
    step(tx('네스팅이 끝나면 트레이너와 팀장이 함께 수료를 정합니다. 수료한 지민은 정식 팀에 실전 배치되어, 이제 다른 팀원들과 같은 기준으로 일합니다.', 'When nesting ends, the trainer and the team leader decide together on graduation. Having graduated, Jimin goes live on a regular team and from now on works to the same standard as everyone else.'),
      [...all, 'nest-grad', 'grad', 'grad-team', 'team'], ['grad', 'nest-grad', 'team', 'grad-team'], 'team'),
  ],
  checkpoint: [{
    id: 'nesting-q1',
    prompt: tx('네스팅 셋째 날, 지민의 평균 처리 시간(AHT)이 팀 평균의 두 배쯤 됩니다. 안내 내용은 정확합니다. 어떻게 할까요?', 'On day three of nesting, Jimin’s average handle time (AHT) is about twice the team average. Her information is accurate. What do you do?'),
    options: [
      option('a', tx('팀 평균과 차이가 크니, 정식 상담사와 같은 AHT 목표를 바로 적용한다.', 'The gap from the team average is large, so apply the regular agents\' AHT target right away.'), tx('적응 기간에 바로 같은 목표를 적용하면, 지민은 정확하게 안내하기보다 빨리 끊는 법을 먼저 배웁니다.', 'Applying the full target while she is still settling in teaches Jimin to end calls fast before she learns to inform customers accurately.')),
      option('b', tx('안내가 정확하니, 그 점을 칭찬하고 속도는 적응한 뒤에 다루자고 한다.', 'Her information is accurate, so praise that and say speed can wait until she settles in.')),
      option('c', tx('통화가 길어질 때마다 콜을 넘겨받아 대신 마무리한다.', 'Take over and finish the call whenever it runs long.'), tx('콜을 대신 마무리해 주면 지민은 스스로 끝까지 해낸 경험을 쌓지 못합니다.', 'Finishing her calls for her keeps Jimin from building the experience of seeing a call through herself.')),
    ],
    answer: 'b',
    explanation: tx('네스팅 기간의 기준은 속도가 아니라 정확성과 적응입니다. 지금 시간을 압박하면 지민은 덜 해결하고 끊는 습관을 들이게 됩니다. 콜을 대신 받아 주면 스스로 끝내 본 경험이 쌓이지 않습니다.', 'During nesting the standard is accuracy and adjustment, not speed. Press on time now and Jimin builds a habit of ending calls with less resolved. Take calls over for her and she never gets the experience of finishing one herself.'),
  }, trackQuestion('general', {
    id: 'nesting-general',
    prompt: tx('네스팅 중인 지민에게 아직 맡기지 않은 유형인 복잡한 불만 문의가 연결됐습니다. 어떻게 할까요?', 'During nesting, Jimin is connected to a complex complaint, a type not yet assigned to her. What do you do?'),
    options: [
      option('a', tx('끝까지 혼자 처리하게 두고, 부딪히며 배우게 한다.', 'Leave her to finish it alone and learn by facing it.'), tx('준비되지 않은 유형을 혼자 맡기면 고객도 지민도 실패한 콜을 겪게 됩니다.', 'Leaving her alone with a type she is not ready for gives both the customer and Jimin a failed call.')),
      option('b', tx('직무전문가가 함께 처리하고, 그 유형은 준비된 뒤 맡긴다.', 'Have the SME handle it with her, and assign that type once she is ready.')),
      option('c', tx('어디서 막혔는지 알 수 있게, 처리 결과를 지민의 평가 기록에 남긴다.', 'Record the outcome in Jimin\'s performance record so you can see where she got stuck.'), tx('아직 맡기지 않은 유형에서 생긴 일은 지민의 실수가 아니라 배정의 문제라, 평가에 남길 일이 아닙니다.', 'What happens on a type she has not been assigned yet is an assignment problem, not Jimin\'s mistake, so it does not belong in her evaluation.')),
    ],
    answer: 'b',
    explanation: tx('문의 유형을 차례로 넓히는 것은 지민이 감당할 수 있는 범위에서 성공 경험을 쌓게 하려는 것입니다. 준비되지 않은 유형이 들어오면 직무전문가가 함께 처리합니다. 그 콜은 나중에 좋은 교육 자료가 됩니다.', 'Widening inquiry types in order lets Jimin build successes within what she can handle. When an unprepared type comes in, the SME handles it together with her. That call later becomes good training material.'),
  }), trackQuestion('tech', {
    id: 'nesting-tech',
    prompt: tx('네스팅 중인 지민이 한 티켓을 오래 붙잡고 있습니다. 원인을 찾지 못했지만 넘기기를 망설입니다. 어떻게 할까요?', 'During nesting, Jimin has been holding one ticket for a long time. She has not found the cause but hesitates to pass it on. What do you do?'),
    options: [
      option('a', tx('해결할 때까지 기다려 주며, 스스로 원인을 찾게 한다.', 'Wait until she solves it, and let her find the cause herself.'), tx('기다리는 동안 고객의 대기 시간만 길어지고, 지민은 넘기는 기준을 배우지 못합니다.', 'Waiting only makes the customer wait longer, and Jimin never learns when to escalate.')),
      option('b', tx('넘기는 기준을 짚어 주고, 확인한 내용을 적어 넘기게 한다.', 'Go over the escalation criteria, and have her note what she checked and escalate.')),
      option('c', tx('고객을 더 기다리게 할 수 없으니, 대신 받아서 조용히 처리한다.', 'The customer cannot wait any longer, so take it over and resolve it quietly.'), tx('조용히 대신 처리하면 지민은 무엇을 확인하고 언제 넘겨야 하는지 배우지 못합니다.', 'Quietly handling it yourself means Jimin never learns what to check and when to pass a ticket on.')),
    ],
    answer: 'b',
    explanation: tx('넘기는 것은 실패가 아니라 정해진 절차입니다. 기준 없이 붙잡고 있으면 고객이 기다리는 시간만 길어집니다. 확인한 내용을 티켓에 남겨 넘기면 상위 단계가 처음부터 다시 묻지 않아도 됩니다.', 'Escalating is not a failure but a defined procedure. Holding on without criteria only lengthens the customer’s wait. If she documents what she checked in the ticket, the higher tier does not have to start the questions over.'),
  }), trackQuestion('general', {
    id: 'nesting-general-2',
    prompt: tx('네스팅 둘째 주, 지민은 단순 조회와 안내 문의를 실수 없이 처리합니다. 다음은 어떻게 할까요?', 'In the second week of nesting, Jimin handles simple lookups and information requests without mistakes. What next?'),
    options: [
      option('a', tx('바로 모든 유형의 문의를 맡긴다.', 'Give her every type of inquiry at once.'), tx('한 번에 모든 유형을 맡기면 막히는 순간이 몰려, 쌓아 온 자신감이 쉽게 무너집니다.', 'Handing over every type at once piles up the moments she gets stuck, and the confidence she has built can collapse.')),
      option('b', tx('변경 문의로 범위를 넓히고, 직무전문가가 계속 들으며 돕는다.', 'Widen her range to change requests, with the SME still listening in to help.')),
      option('c', tx('자신감을 지키도록, 실수 없는 지금 유형만 당분간 계속 맡긴다.', 'To protect her confidence, keep her on the types she handles without mistakes for now.'), tx('실수가 없을 때가 범위를 넓힐 때이며, 같은 유형에만 머물면 정식 팀에 갈 준비가 늦어집니다.', 'No mistakes is the signal to widen her range; staying on the same types delays her readiness for the regular team.')),
    ],
    answer: 'b',
    explanation: tx('일반 고객지원은 쉬운 유형부터 차례로 넓힙니다. 한 번에 모든 유형을 맡기면 막히는 순간이 몰립니다. 범위를 넓힐 때도 플로어 서포트는 이어 갑니다.', 'General support widens from easy types in order. Handing over every type at once piles up the moments she gets stuck. Floor support continues as the range widens.'),
  }), trackQuestion('tech', {
    id: 'nesting-tech-2',
    prompt: tx('기술지원 네스팅 중인 지민이 원인을 찾아보기도 전에 티켓을 곧바로 상위 단계로 넘기는 일이 잦습니다. 어떻게 할까요?', 'During tech support nesting, Jimin often passes tickets straight to a higher tier before looking for the cause. What do you do?'),
    options: [
      option('a', tx('습관이 되지 않도록, 넘기기 전 확인 단계와 기준을 다시 짚어 준다.', 'So it does not become a habit, go over the checks to try before passing a ticket on, and the criteria for passing it.')),
      option('b', tx('혼자 푸는 힘을 기르도록, 넘기는 것을 금지하고 혼자 해결하게 한다.', 'Ban passing tickets on so she builds the ability to solve them alone.'), tx('넘기는 것을 금지하면 지민은 풀지 못한 티켓을 붙잡고, 고객은 더 오래 기다리게 됩니다.', 'Banning escalation leaves Jimin holding tickets she cannot solve while customers wait longer.')),
      option('c', tx('신입에게는 넘기는 쪽이 안전하니, 익숙해질 때까지 그대로 둔다.', 'Passing tickets on is the safe choice for someone new, so leave it until she gets used to the work.'), tx('지금 바로잡지 않으면 확인 없이 넘기는 습관이 정식 팀까지 이어집니다.', 'Unless it is corrected now, the habit of passing tickets on without checking follows her into the regular team.')),
    ],
    answer: 'a',
    explanation: tx('너무 늦게 넘기는 것도, 너무 빨리 넘기는 것도 문제입니다. 1차 지원에서 할 수 있는 확인을 마치고 정해진 기준에 따라 넘기는 습관을 네스팅에서 들여야 상위 단계의 부담이 줄어듭니다.', 'Passing too late and passing too early are both problems. Building the habit in nesting of finishing the Tier 1 checks and escalating by the agreed criteria eases the load on higher tiers.'),
  })],
  connection: {
    to: 'coaching',
    text: tx('네스팅에서는 일부러 지표를 느슨하게 뒀습니다. 정식 팀에 안착한 뒤에는 품질과 지표를 꾸준히 보고 끌어올려야 합니다. 다음 단계는 성과 관리와 코칭입니다.', 'In nesting you kept the metrics loose on purpose. Once she has settled into a regular team, quality and metrics need steady attention and steady improvement. The next stage is performance management and coaching.'),
  },
};
