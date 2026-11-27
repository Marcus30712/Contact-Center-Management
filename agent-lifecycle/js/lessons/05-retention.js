import { tx, node, edge, step, option, trackStep, trackQuestion } from './build.js';

const reward = ['stay', 'reward', 'reward-stay'];
const care = [...reward, 'care', 'care-stay'];
const all = [...care, 'culture', 'culture-stay'];

export default {
  id: 'retention',
  order: 5,
  title: tx('동기부여 및 유지', 'Engagement and Retention'),
  short: tx('유지', 'Retention'),
  subtitle: tx('번아웃을 막고 오래 일할 수 있게 합니다.', 'Preventing burnout and helping people stay.'),
  diagram: {
    nodes: [
      node('reward', '보상·인센티브', 64, 52, 'Rewards'),
      node('care', '감정노동 케어', 296, 52, 'Emotional care'),
      node('stay', '장기 근속', 180, 124, 'Long tenure'),
      node('culture', '조직 문화', 180, 200, 'Team culture'),
    ],
    edges: [edge('reward', 'stay'), edge('care', 'stay'), edge('culture', 'stay')],
  },
  steps: [
    step(tx('시간이 흘러 지민은 팀에서 믿고 맡기는 상담사가 되었습니다. 그런데 요즘 말수가 줄었습니다. 이 단계의 일은 번아웃을 예방하고 장기 근속을 이끄는 것입니다.', 'Time has passed, and Jimin is an agent the team relies on. Lately, though, she has grown quiet. The work at this stage is to prevent burnout and encourage long tenure.'),
      ['stay'], ['stay'], 'stay'),
    step(tx('첫째는 보상과 인센티브입니다. 우수 상담사 포상, 성과급, 프로모션 이벤트로 성취감을 줍니다.', 'The first lever is rewards and incentives. Awards for top agents, performance bonuses, and incentive contests give a sense of achievement.'),
      reward, ['reward', 'reward-stay'], 'stay'),
    step(tx('지민이 이달의 우수 상담사로 뽑힙니다. 기쁜 일입니다. 하지만 포상만으로 지친 마음까지 풀리지는 않습니다.', 'Jimin is named agent of the month. That is good news. But an award alone does not ease a tired mind.'),
      reward, ['reward'], 'stay'),
    step(tx('둘째는 감정노동 케어입니다. 심리 상담 프로그램(EAP) 지원, 휴게 공간 개선, 악성 민원에 대한 회사의 적극적인 보호 조치가 여기에 듭니다.', 'The second is care for emotional labor. It covers an employee assistance program (EAP) for counseling, better break spaces, and active company protection against abusive callers.'),
      care, ['care', 'care-stay'], 'stay'),
    step(tx('보호 조치의 한 예가 선끊기 권한입니다. 악성 민원 통화를 상담사가 먼저 끝낼 수 있게 하는 것으로, 구체적인 기준과 절차는 센터마다 다릅니다.', 'One example of protection is the authority to hang up first. It lets an agent end a call with an abusive caller, and how it works in detail varies by center.'),
      care, ['care'], 'stay'),
    step(tx('지민이 폭언이 이어지는 콜을 받고, 기준에 따라 통화를 끝냅니다. 당신은 잘 끊었다고 말해 주고 잠시 쉬게 합니다. 제도는 팀장이 써도 된다고 확인해 줄 때 비로소 쓰입니다.', 'Jimin gets a call where the verbal abuse will not stop, and she ends it according to the criteria. You tell her she was right to end it and give her a short break. A policy only gets used once the team leader confirms it is fine to use.'),
      care, ['care', 'stay'], 'stay'),
    step(tx('셋째는 조직 문화입니다. 팀 빌딩 활동과 자유로운 피드백 창구로 고립감을 풀어 줍니다. 헤드셋을 쓰고 일하면 옆자리 동료와도 멀어지기 쉽습니다.', 'The third is team culture. Team-building activities and open feedback channels ease the sense of isolation. Working under a headset, it is easy to drift apart even from the person at the next desk.'),
      all, ['culture', 'culture-stay'], 'stay'),
    trackStep('general', tx('일반 고객지원에서는 비슷한 문의의 반복과 감정노동이 쌓여 지치기 쉽습니다. 맡는 문의 유형을 바꿔 주는 것도 한 방법입니다.', 'In general support, repeated similar inquiries and emotional labor build up and wear people down. Changing the inquiry types someone handles is one option.'),
      all, ['stay'], 'stay'),
    trackStep('tech', tx('기술지원에서는 어려운 티켓이 이어질 때의 인지 부담이 큽니다. 새 제품을 익힐 학습 시간을 근무 안에서 보장하고, 기술적으로 성장할 기회를 보여 주는 것이 중요합니다.', 'In tech support, a run of difficult tickets carries a heavy cognitive load. It matters to protect learning time for new products within working hours and to show chances to grow technically.'),
      all, ['stay'], 'stay'),
    step(tx('보상, 케어, 문화는 서로를 대신하지 못합니다. 셋이 함께 있을 때 지민에게는 계속 일할 이유가 생깁니다.', 'Rewards, care, and culture cannot stand in for one another. When all three are present, Jimin has a reason to keep working here.'),
      all, ['reward', 'care', 'culture', 'stay'], 'stay'),
  ],
  checkpoint: [{
    id: 'retention-q1',
    prompt: tx('지민이 폭언 콜을 끊은 직후 자리에서 굳어 있습니다. 대기 콜은 밀려 있습니다. 먼저 무엇을 할까요?', 'Right after ending an abusive call, Jimin sits frozen at her desk. Calls are queuing up. What do you do first?'),
    options: [
      option('a', tx('다음 콜을 받게 하고, 대기 콜이 줄어든 뒤에 이야기한다.', 'Have her take the next call, and talk once the queue goes down.'), tx('바로 다음 콜을 받게 하면 충격이 그대로 다음 고객에게 이어지고, 지민은 보호받지 못했다고 느낍니다.', 'Sending her straight to the next call carries the shock over to the next customer, and Jimin feels unprotected.')),
      option('b', tx('충격이 가라앉도록, 잠시 쉬게 하고 끊은 판단이 맞았다고 말해 준다.', 'So the shock can settle, give her a short break and tell her ending the call was the right decision.')),
      option('c', tx('왜 조금 더 참지 못했는지 묻는다.', 'Ask why she could not hold on a little longer.'), tx('판단을 따져 물으면 지민은 다음에 선끊기 권한을 쓰기를 망설이게 됩니다.', 'Questioning her judgment makes Jimin hesitate to use her authority to hang up first next time.')),
    ],
    answer: 'b',
    explanation: tx('감정노동 케어는 제도가 있는 것만으로 끝나지 않고, 팀장이 그 순간에 어떻게 반응하는지로 완성됩니다. 바로 다음 콜을 받게 하거나 판단을 따져 물으면, 지민은 다음부터 보호 조치를 쓰지 못하게 됩니다.', 'Care for emotional labor is not finished by having a policy. It is completed by how the team leader responds in the moment. Send her straight to the next call or question her judgment, and Jimin will not use the protection next time.'),
  }, trackQuestion('general', {
    id: 'retention-general',
    prompt: tx('지민이 요즘 같은 문의만 반복해서 지친다고 말합니다. 어떻게 할까요?', 'Jimin says she is worn out from handling the same inquiries over and over. What do you do?'),
    options: [
      option('a', tx('누구나 겪는 일이라며 다독이고 넘긴다.', 'Reassure her that everyone goes through it, and move on.'), tx('누구나 겪는다며 넘기면 지민은 다시 말을 꺼내지 않게 되고, 피로는 번아웃으로 커집니다.', 'Brushing it off as something everyone goes through means Jimin will not raise it again, and the fatigue grows into burnout.')),
      option('b', tx('듣고, 문의 유형을 넓히거나 바꿀 방법을 함께 찾는다.', 'Listen, and look together for ways to widen or change her inquiry types.')),
      option('c', tx('성과급과 포상 기준을 다시 설명해 준다.', 'Explain the bonus and award criteria again.'), tx('성과급은 성취감을 줄 수 있지만, 반복에서 오는 피로를 풀어 주지는 못합니다.', 'A performance bonus can give a sense of achievement, but it does not relieve the fatigue that comes from repetition.')),
    ],
    answer: 'b',
    explanation: tx('반복에서 오는 피로는 보상만으로 풀리지 않습니다. 먼저 듣고, 일의 내용을 바꿀 수 있는 부분을 찾습니다. 지민이 말을 꺼냈을 때가 번아웃을 막을 수 있는 때입니다.', 'Fatigue from repetition is not eased by rewards alone. Listen first, then look for parts of the work itself that can change. The moment Jimin raises it is the moment burnout can still be prevented.'),
  }), trackQuestion('tech', {
    id: 'retention-tech',
    prompt: tx('기술지원 팀에 새 제품이 출시됩니다. 대기 티켓이 많아 학습 시간을 빼기 어렵습니다. 어떻게 할까요?', 'A new product is launching for the tech support team. The ticket queue is long, and it is hard to free up learning time. What do you do?'),
    options: [
      option('a', tx('각자 퇴근 후에 공부하게 한다.', 'Have everyone study after work.'), tx('학습을 퇴근 뒤로 미루면 새 제품을 익히는 부담이 상담사 개인에게 넘어갑니다.', 'Pushing learning to after hours shifts the burden of learning the new product onto each agent.')),
      option('b', tx('출시 전에 익히도록, 근무 안에 학습 시간을 잡고 그 시간을 지켜 준다.', 'So everyone learns it before launch, schedule learning time within working hours, and protect it.')),
      option('c', tx('실제 티켓으로 배우는 게 가장 빠르니, 출시 후 티켓을 받으며 익히게 한다.', 'Real tickets teach fastest, so let them learn by taking tickets after launch.'), tx('모르는 제품의 티켓을 받으며 익히게 하면 응대 품질과 상담사의 자신감이 함께 떨어집니다.', 'Learning on live tickets for an unfamiliar product lowers both service quality and the agents’ confidence.')),
    ],
    answer: 'b',
    explanation: tx('모르는 제품의 티켓을 받는 것은 지민 같은 상담사에게 큰 부담입니다. 학습을 근무 밖으로 미루면 그 부담이 개인에게 넘어갑니다. 팀장이 일정 안에서 시간을 확보해 주는 것이 유지의 일부입니다.', 'Taking tickets for a product you do not know is a heavy burden for an agent like Jimin. Pushing learning outside working hours shifts that burden onto the individual. Securing the time within the schedule is part of retention.'),
  }), trackQuestion('general', {
    id: 'retention-general-2',
    prompt: tx('악성 민원 콜이 이어진 날, 일반 고객지원 팀원 여럿이 지쳐 보입니다. 어떻게 할까요?', 'After a day of abusive calls, several people on the general support team look worn out. What do you do?'),
    options: [
      option('a', tx('근무 중 짧게 모여 힘든 콜을 나누고, 심리 상담(EAP)을 안내한다.', 'Gather briefly during work to talk through the hard calls, and point people to the EAP.')),
      option('b', tx('따로 이야기 없이, 내일 새로 시작하자고 한다.', 'Skip any talk and say you will start fresh tomorrow.'), tx('다들 겪는 일이라며 넘기면 그날의 피로가 다음 날로 쌓입니다.', 'Brushing it off as something everyone goes through lets the day’s fatigue pile into the next.')),
      option('c', tx('가장 지친 사람을 따로 불러, 오늘 실적이 떨어진 이유를 함께 짚어 본다.', 'Call in the most exhausted person and go over why their numbers dropped today.'), tx('지친 날 실적 이야기를 꺼내면 케어가 아니라 압박으로 받아들여집니다.', 'Raising performance on an exhausting day lands as pressure, not care.')),
    ],
    answer: 'a',
    explanation: tx('감정노동은 쌓이면 번아웃이 됩니다. 힘든 날을 함께 정리하는 자리를 만들고 회사의 케어 제도를 팀장이 직접 연결해 줄 때, 제도가 실제로 쓰입니다.', 'Emotional labor turns into burnout when it builds up. Care programs actually get used when the team leader makes room to process hard days together and connects people to them directly.'),
  }), trackQuestion('tech', {
    id: 'retention-tech-2',
    prompt: tx('기술지원 상담사 한 명이 몇 주째 어려운 티켓만 맡아 지쳐 보입니다. 어떻게 할까요?', 'A tech support agent has handled only hard tickets for weeks and looks worn out. What do you do?'),
    options: [
      option('a', tx('어려운 티켓은 실력 있는 사람에게 계속 맡기고, 지금 배정을 그대로 둔다.', 'Keep hard tickets with the skilled person, and leave the current assignments as they are.'), tx('실력이 좋을수록 어려운 티켓이 몰리기 쉬운데, 그대로 두면 그 사람이 먼저 지칩니다.', 'The more skilled someone is, the more hard tickets flow their way, and left alone they burn out first.')),
      option('b', tx('쉬운 티켓을 섞어 주고, 해결 사례를 지식 자료로 정리하게 한다.', 'Mix in easier tickets, and have them write up solved cases for the knowledge base.')),
      option('c', tx('회복될 때까지 당분간 쉬운 티켓만 맡겨 부담을 덜어 준다.', 'Give them only easy tickets until they recover, to lighten the load.'), tx('쉬운 티켓만 맡기면 부담은 줄지만, 성장할 기회까지 멈추게 됩니다.', 'Only easy tickets lightens the load but also stops their chance to grow.')),
    ],
    answer: 'b',
    explanation: tx('어려운 티켓이 이어지면 인지 부담이 쌓입니다. 부담은 나누고 해결 경험을 지식 자료로 남기게 하면, 지친 경험이 기술적인 성장으로 이어집니다.', 'A run of hard tickets builds cognitive load. Spreading the load and having them record what they solved in the knowledge base turns a draining stretch into technical growth.'),
  })],
  connection: {
    to: 'career',
    text: tx('오래 일한 사람에게는 다음 질문이 생깁니다. "여기서 나는 어디로 갈 수 있을까?" 마지막 단계는 그 길을 보여 주는 일, 그리고 떠나는 사람에게서 배우는 일입니다.', 'People who stay for a long time start asking a new question: “Where can I go from here?” The last stage is about showing that path, and about learning from those who leave.'),
  },
};
