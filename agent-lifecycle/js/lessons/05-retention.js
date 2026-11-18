import { tx, node, edge, step, option } from './build.js';

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
    step(tx('첫째는 보상과 인센티브입니다. 우수 상담사 포상, 성과급, 프로모션 이벤트로 성취감을 줍니다.', 'The first lever is rewards and incentives. Awards for top agents, performance bonuses, and promotional events give a sense of achievement.'),
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
    step(tx('보상, 케어, 문화는 서로를 대신하지 못합니다. 셋이 함께 있을 때 지민에게는 계속 일할 이유가 생깁니다.', 'Rewards, care, and culture cannot stand in for one another. When all three are present, Jimin has a reason to keep working here.'),
      all, ['reward', 'care', 'culture', 'stay'], 'stay'),
  ],
  checkpoint: [{
    id: 'retention-q1',
    prompt: tx('지민이 폭언 콜을 끊은 직후 자리에서 굳어 있습니다. 대기 콜은 밀려 있습니다. 먼저 무엇을 할까요?', 'Right after ending an abusive call, Jimin sits frozen at her desk. Calls are queuing up. What do you do first?'),
    options: [
      option('a', tx('대기 콜이 많으니 바로 다음 콜을 받게 한다.', 'The queue is long, so have her take the next call right away.')),
      option('b', tx('잠시 자리를 벗어나 쉬게 하고, 끊은 판단이 맞았다고 말해 준다.', 'Let her step away for a short break and tell her that ending the call was the right decision.')),
      option('c', tx('왜 조금 더 참지 못했는지 묻는다.', 'Ask why she could not hold on a little longer.')),
    ],
    answer: 'b',
    explanation: tx('감정노동 케어는 제도가 있는 것만으로 끝나지 않고, 팀장이 그 순간에 어떻게 반응하는지로 완성됩니다. 바로 다음 콜을 받게 하거나 판단을 따져 물으면, 지민은 다음부터 보호 조치를 쓰지 못하게 됩니다.', 'Care for emotional labor is not finished by having a policy. It is completed by how the team leader responds in the moment. Send her straight to the next call or question her judgment, and Jimin will not use the protection next time.'),
  }],
  connection: {
    to: 'career',
    text: tx('오래 일한 사람에게는 다음 질문이 생깁니다. "여기서 나는 어디로 갈 수 있을까?" 마지막 단계는 그 길을 보여 주는 일, 그리고 떠나는 사람에게서 배우는 일입니다.', 'People who stay for a long time start asking a new question: “Where can I go from here?” The last stage is about showing that path, and about learning from those who leave.'),
  },
};
