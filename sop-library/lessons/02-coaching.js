import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Main steps run down one column; `wide` gives them room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['prepare', 'rapport', 'analyze', 'plan', 'close'];
const flow = [...procedure, 'prepare-rapport', 'rapport-analyze', 'analyze-plan', 'plan-close'];
const grow = ['goal', 'reality', 'options', 'will', 'analyze-goal', 'goal-reality', 'reality-options', 'options-will'];
// After the session: someone watches the coach (added 2026-11-22, not from the Codex).
const observe = ['observe', 'close-observe'];

export default {
  id: 'coaching',
  order: 3,
  group: 'leader',
  title: tx('1:1 코칭', 'One-on-One Coaching'),
  short: tx('1:1 코칭', 'Coaching'),
  subtitle: tx('지적 대신 질문으로 이끄는 다섯 단계.', 'Five steps that lead with questions instead of criticism.'),
  roles: tx('팀장', 'Team leader'),
  procedure,
  diagram: {
    nodes: [
      wide(node('prepare', '데이터 준비', 84, 24, 'Prepare the data')),
      wide(node('rapport', '분위기 조성', 84, 72, 'Set the tone')),
      wide(node('analyze', '원인 분석', 84, 120, 'Find the cause')),
      wide(node('plan', '해결책 수립', 84, 168, 'Agree on a solution')),
      wide(node('close', '마무리 및 격려', 84, 216, 'Wrap up and encourage')),
      { ...node('goal', '목표', 214, 96, 'Goal'), hw: 42 },
      { ...node('reality', '현실', 310, 96, 'Reality'), hw: 42 },
      { ...node('options', '대안', 310, 144, 'Options'), hw: 42 },
      { ...node('will', '실행 의지', 214, 144, 'Will'), hw: 42 },
      { ...node('observe', '코치 관찰', 270, 216, 'Coach observation'), hw: 60 },
    ],
    edges: [
      edge('prepare', 'rapport'), edge('rapport', 'analyze'), edge('analyze', 'plan'), edge('plan', 'close'),
      edge('analyze', 'goal'), edge('goal', 'reality'), edge('reality', 'options'), edge('options', 'will'),
      edge('close', 'observe'),
    ],
  },
  steps: [
    step(tx('이 절차의 목적은 데이터에 기반해 팀원의 성과가 부진한 원인을 찾고, 분명한 개선 계획을 함께 세워 성장을 돕는 것입니다. 팀장과 그 이상 직급이 따릅니다. 다섯 단계로 진행합니다.', 'This procedure exists to find, from data, why a team member\'s performance is falling short, and to agree on a clear improvement plan together so they can grow. Team leaders and those above them follow it. It runs in five steps.'),
      flow, procedure, null),
    step(tx('오늘 코칭 상대는 지민입니다. 지민은 한 번에 해결하는 비율은 높지만 평균 처리 시간(AHT)이 긴 편입니다.', 'Today you are coaching Jimin. She resolves a high share of contacts the first time, but her average handle time (AHT) runs long.'),
      flow, [], null),
    step(tx('첫 단계는 데이터 준비입니다(예시: 5분). 세션 전에 대시보드에서 지민의 KPI를 확인하고, 실제 녹취나 티켓을 몇 건 미리 봅니다. 코칭의 근거를 준비하는 단계입니다.', 'The first step is preparing the data (Example: 5 min). Before the session, check Jimin\'s KPIs on the dashboard and review a few of her actual call recordings or tickets. This step prepares the evidence for the coaching.'),
      flow, ['prepare'], 'prepare'),
    step(tx('둘째 단계는 분위기 조성입니다(예시: 5분). 지난주에 가장 잘한 점 같은 긍정적인 이야기로 시작하고, 이 자리가 질책이 아니라 성장 지원임을 분명히 말합니다. "오늘 대화는 지민 님을 돕기 위한 시간이에요."', 'The second step is setting the tone (Example: 5 min). Open with something positive, such as what she did best last week, and make it clear that this session is for supporting her growth, not for a reprimand. "Today\'s conversation is here to help you, Jimin."'),
      flow, ['rapport'], 'rapport'),
    step(tx('셋째 단계는 원인 분석입니다(예시: 15분). 가장 긴 시간을 씁니다. 당신이 문제를 짚어 주는 대신, 지민이 스스로 문제를 알아차리고 원인을 말하도록 질문합니다.', 'The third step is finding the cause (Example: 15 min). It takes the most time. Instead of pointing out the problem yourself, you ask questions so that Jimin notices it and names the cause herself.'),
      flow, ['analyze'], 'analyze'),
    step(tx('이때 GROW 모델을 씁니다. 목표(Goal), 현실(Reality), 대안(Options), 실행 의지(Will)의 순서로 묻는 대화의 틀입니다.', 'This is where you use the GROW model. It is a framework for the conversation that asks, in order, about the Goal, the Reality, the Options, and the Will to act.'),
      [...flow, ...grow], ['analyze', ...grow], 'analyze'),
    step(tx('질문은 이렇게 합니다. "데이터를 보니 이 부분에서 시간이 길어지는데, 왜 그렇다고 생각해요?" "어떤 상황에서 가장 힘든가요?"', 'The questions sound like this. "Looking at the data, the time gets longer at this point, so why do you think that is?" "Which situations are the hardest for you?"'),
      [...flow, ...grow], ['analyze', ...grow], 'analyze'),
    step(tx('지민이 답합니다. 고객 정보를 확인하느라 화면을 여러 번 오가는 데 시간이 걸린다고 합니다. 당신이 먼저 짚었다면 나오지 않았을 구체적인 원인입니다.', 'Jimin answers. She says she loses time going back and forth between screens to check customer details. It is a specific cause that would not have come out if you had named the problem first.'),
      [...flow, ...grow], ['analyze'], 'analyze'),
    step(tx('넷째 단계는 해결책 수립입니다(예시: 10분). 해결책도 지민이 직접 내놓도록 묻습니다. "이 문제를 해결하기 위해 당장 시도해 볼 수 있는 건 뭐가 있을까요?"', 'The fourth step is agreeing on a solution (Example: 10 min). Ask so that the solution comes from Jimin as well. "What could you try right away to fix this?"'),
      [...flow, ...grow], ['plan'], 'plan'),
    step(tx('다음 주까지 실천할 수 있는 구체적인 행동 계획을 한두 가지만 함께 정합니다. 많이 정할수록 지키기 어렵습니다.', 'Together you settle on just one or two specific actions she can carry out by next week. The more you set, the harder they are to keep.'),
      [...flow, ...grow], ['plan'], 'plan'),
    step(tx('다섯째 단계는 마무리 및 격려입니다(예시: 5분). 합의한 내용을 다시 요약하고, 할 수 있다는 믿음과 지지를 표현하며 끝냅니다. "제가 지켜보고 도울게요. 잘할 수 있을 거예요."', 'The fifth step is wrapping up and encouraging (Example: 5 min). Summarize what you agreed once more, and close by showing that you believe in her and will back her. "I will be right here to help. You can do this."'),
      [...flow, ...grow], ['close'], 'close'),
    step(tx("세션이 끝난 뒤에도 할 일이 있습니다(예시: 한 달에 한 번). 부매니저나 선배 팀장이 당신의 코칭을 지켜보고, 질문으로 이끌었는지와 행동 계획이 구체적이었는지 피드백합니다. 코치도 코칭을 받아야 늡니다.", "There is still work after the session (Example: once a month). Your assistant manager or a senior team leader watches you coach and tells you whether you led with questions and whether the action plan was specific. Coaches get better by being coached too."),
      [...flow, ...grow, ...observe], ['close', ...observe], 'close'),
  ],
  checkpoint: [
    {
      id: 'coaching-q1',
      prompt: tx('원인 분석 단계에서 지민에게 건넬 말로 알맞은 것은 무엇일까요?', 'Which is the right thing to say to Jimin in the find-the-cause step?'),
      options: [
        option('a', tx('"통화가 긴 이유는 확인 절차가 느려서예요. 고치세요."', '"Your calls are long because your checks are slow. Fix that."'), tx('원인을 먼저 정해 주면 지민은 이유를 스스로 생각해 볼 기회를 잃고, 해결책도 남의 것이 됩니다.', 'Naming the cause for her takes away Jimin’s chance to think it through, and the fix becomes someone else’s.')),
        option('b', tx('"데이터를 보니 이 부분에서 시간이 길어지는데, 왜 그렇다고 생각해요?"', '"Looking at the data, the time gets longer at this point, so why do you think that is?"')),
        option('c', tx('"다른 팀원들은 이만큼 걸리지 않아요."', '"The rest of the team does not take this long."'), tx('다른 팀원과 비교하면 방어적으로 되기 쉽고, 시간이 길어지는 진짜 이유는 이야기되지 않습니다.', 'Comparing her with teammates tends to make her defensive, and the real reason the time runs long never comes up.')),
      ],
      answer: 'b',
      explanation: tx('원인 분석은 직접 지적하는 대신 질문으로 스스로 답을 찾게 돕는 단계입니다. 스스로 찾은 원인이어야 해결책도 자기 것이 됩니다.', 'Finding the cause means helping her reach the answer through questions instead of pointing it out directly. A cause she finds herself makes the solution her own.'),
    },
    {
      id: 'coaching-q2',
      prompt: tx('행동 계획은 어떻게 정하는 것이 좋을까요?', 'How should you set the action plan?'),
      options: [
        option('a', tx('고칠 점을 빠짐없이 모두 적는다.', 'Write down every single thing that needs fixing.'), tx('고칠 점을 모두 적으면 무엇부터 할지 흐려지고, 다음 코칭 때 지켰는지 확인하기도 어렵습니다.', 'Listing every point to fix blurs what comes first, and makes it hard to check at the next session whether it was done.')),
        option('b', tx('다음 주까지 실천할 수 있는 구체적인 것으로 한두 가지를 함께 정한다.', 'Agree together on one or two specific actions she can carry out by next week.')),
        option('c', tx('따로 정하지 않고 다음 달 숫자를 지켜본다.', 'Set nothing and watch next month\'s numbers.'), tx('계획 없이 숫자만 지켜보면 지민은 무엇을 해야 할지 모른 채 한 달을 보냅니다.', 'Watching the numbers without a plan leaves Jimin spending a month not knowing what to do.')),
      ],
      answer: 'b',
      explanation: tx('행동 계획은 다음 코칭 때 지켰는지 확인할 수 있을 만큼 구체적이어야 합니다. 팀원이 직접 제시한 것일수록 좋습니다.', 'An action plan has to be specific enough that you can check at the next session whether it was kept. The more it comes from the team member, the better.'),
    },
    {
      id: 'coaching-q3',
      prompt: tx("지민의 AHT가 팀 평균보다 깁니다. 코칭을 준비할 때 알맞은 것은 무엇일까요?", "Jimin's AHT is longer than the team average. What is the right way to prepare for coaching?"),
      options: [
        option('a', tx("AHT를 팀 평균까지 줄이는 것을 목표로 정해 둔다.", "Set the goal of cutting her AHT to the team average."), tx("시간만 겨냥하면 지민이 잘하고 있는 한 번에 해결하는 비율까지 흔들릴 수 있습니다.", "Aiming only at time can shake what Jimin already does well: resolving contacts the first time.")),
        option('b', tx("AHT와 한 번에 해결하는 비율, 녹취 몇 건을 함께 본다.", "Look at her AHT, her first-time resolution and a few recordings together.")),
        option('c', tx("팀원별 AHT 순위표를 준비해 보여 준다.", "Prepare a ranking of AHT by team member and show it to her."), tx("순위표는 비교로 읽혀 방어적으로 만들기 쉽고, 시간이 길어지는 이유는 알려 주지 않습니다.", "A ranking reads as a comparison and tends to make her defensive, and it says nothing about why her time runs long.")),
      ],
      answer: 'b',
      explanation: tx("한 지표만 보면 다른 지표를 희생시키는 코칭이 되기 쉽습니다. 여러 지표와 실제 상담을 함께 봐야 진짜 원인에 닿습니다.", "Looking at one metric alone easily turns coaching into trading one metric for another. Several metrics and real contacts together lead to the real cause."),
    },
  ],
  connection: { to: 'pip', text: tx('코칭을 거듭해도 나아지지 않는 경우가 있습니다. 그때 쓰는 공식 절차가 다음 레슨의 성과 개선 계획(PIP)입니다.', 'Sometimes repeated coaching does not bring improvement. The formal procedure for that case is the Performance Improvement Plan (PIP) in the next lesson.') },
};
