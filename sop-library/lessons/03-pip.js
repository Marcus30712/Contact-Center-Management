import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Main steps run down one column; `wide` gives them room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['review', 'goal', 'checkin', 'evaluate'];
const flow = [...procedure, 'review-goal', 'goal-checkin', 'checkin-evaluate'];
const branch = ['end', 'more', 'evaluate-end', 'evaluate-more'];
// Woojin meets the goal, so only the closing branch is lit; the other stays in view.
const met = ['end', 'evaluate-end'];

export default {
  id: 'pip',
  order: 4,
  group: 'leader',
  title: tx('성과 개선 계획 (PIP)', 'Performance Improvement Plan (PIP)'),
  short: tx('PIP', 'PIP'),
  subtitle: tx('코칭만으로 부족할 때 쓰는 공식 절차.', 'The formal procedure for when coaching alone is not enough.'),
  roles: tx('팀장', 'Team leader'),
  personaName: tx('우진', 'Woojin'),
  procedure,
  diagram: {
    nodes: [
      wide(node('review', '데이터 기반 면담', 84, 30, 'Data-based meeting')),
      wide(node('goal', '공동 목표 설정', 84, 90, 'Set a shared goal')),
      wide(node('checkin', '지원 약속 및 주간 점검', 84, 150, 'Support and weekly check-ins')),
      wide(node('evaluate', '결과 평가', 84, 210, 'Evaluate the result')),
      node('end', 'PIP 종료', 270, 168, 'PIP closed'),
      node('more', '추가 계획', 270, 216, 'Further plan'),
    ],
    edges: [
      edge('review', 'goal'), edge('goal', 'checkin'), edge('checkin', 'evaluate'),
      edge('evaluate', 'end'), edge('evaluate', 'more'),
    ],
  },
  steps: [
    step(tx('성과 개선 계획(PIP, Performance Improvement Plan)은 1:1 코칭으로도 개선이 어려운 팀원을 위한 공식적인 성과 개선 프로그램입니다. 네 단계로 진행합니다.', 'A PIP (Performance Improvement Plan) is a formal program for a team member whose performance has not improved through one-on-one coaching alone. It runs in four steps.'),
      flow, procedure, null),
    step(tx('목적은 징계가 아니라 성장 지원입니다. 분명한 데이터와 구체적인 목표로 개선의 기회를 주는 것이 핵심입니다.', 'Its purpose is to support growth, not to discipline. The heart of it is giving a real chance to improve, with clear data and a specific goal.'),
      flow, [], null),
    step(tx('당신 팀의 박우진 상담사는 여러 주 코칭을 받았지만 고객 만족도(CSAT)가 오르지 않습니다. 당신은 PIP를 시작하기로 합니다.', 'Woojin Park, an agent on your team, has been coached for several weeks, but his customer satisfaction (CSAT) has not gone up. You decide to start a PIP.'),
      flow, [], null),
    step(tx('첫 단계는 데이터 기반 면담입니다. 인상이 아니라 구체적인 데이터로 면담을 시작합니다. 예시: "최근 4주간 우진 님의 CSAT 점수가 팀 평균보다 10점 낮게 나오고 있습니다."', 'The first step is the data-based meeting. You open with specific data, not impressions. Example: "Over the last 4 weeks, Woojin, your CSAT score has been 10 points below the team average."'),
      flow, ['review'], 'review'),
    step(tx('둘째 단계는 공동 목표 설정입니다. 측정할 수 있고 구체적인 목표를 함께 정합니다. 예시: "앞으로 4주 동안 CSAT 점수를 5점 올리는 것을 목표로 합시다."', 'The second step is setting a shared goal. Together you set a goal that is specific and can be measured. Example: "Let\'s aim to raise your CSAT score by 5 points over the next 4 weeks."'),
      flow, ['goal'], 'goal'),
    step(tx('목표와 함께 집중할 항목도 정합니다. 우진과 당신은 \'고객의 문제 정확히 파악하기\' 항목에 집중하기로 합니다.', 'Along with the goal, you choose what to focus on. Woojin and you agree to focus on the item \'Identifying the customer\'s problem accurately\'.'),
      flow, ['goal'], 'goal'),
    step(tx('셋째 단계는 지원 약속 및 주간 점검입니다. 매주 정해진 시간에 진행 상황을 함께 점검하고(예시: 매주 월요일 15분), 어려운 점이 있으면 바로 돕겠다고 약속합니다.', 'The third step is promising support and weekly check-ins. You promise to review progress together at a set time every week (Example: 15 min every Monday) and to step in right away when something is hard.'),
      flow, ['checkin'], 'checkin'),
    step(tx('PIP는 지켜보는 기간이 아니라 함께 가는 기간입니다. 주간 점검이 빠지면 목표만 남고 지원은 사라집니다.', 'A PIP is a period of working alongside someone, not of watching them. Without the weekly check-ins, only the goal is left and the support is gone.'),
      flow, ['checkin'], 'checkin'),
    step(tx('넷째 단계는 결과 평가입니다. 4주 뒤, 정한 목표를 달성했는지 우진과 함께 평가합니다.', 'The fourth step is evaluating the result. After 4 weeks, you and Woojin evaluate together whether the goal was met.'),
      flow, ['evaluate'], 'evaluate'),
    step(tx('우진은 목표를 달성했습니다. 긍정적인 피드백과 함께 PIP를 종료합니다. 목표에 미치지 못했다면 추가 계획을 논의합니다.', 'Woojin met the goal. You close the PIP with positive feedback. Had he fallen short, you would discuss a further plan.'),
      [...flow, ...branch], ['evaluate', ...met], 'evaluate'),
    step(tx('인사 절차와 관련 법·제도는 국가와 회사마다 다를 수 있습니다. PIP를 시작하기 전에 인사 담당자와 확인하고, 목표에 미치지 못하면 어떤 절차로 이어지는지 첫 면담에서 우진에게 분명히 알립니다.', 'HR procedures and the laws around them can differ by country and by company. Check with HR before you start a PIP, and tell Woojin clearly at the first meeting what follows if the goal is not met.'),
      [...flow, ...branch], [], null),
  ],
  checkpoint: [
    {
      id: 'pip-q1',
      prompt: tx('PIP의 목적으로 알맞은 것은 무엇일까요?', 'What is the purpose of a PIP?'),
      options: [
        option('a', tx('징계의 근거를 남기는 것.', 'To leave a record that justifies discipline.'), tx('징계 근거를 남기려는 PIP로 받아들여지면, 우진은 개선보다 방어에 힘을 쓰게 됩니다.', 'If the PIP comes across as building a case for discipline, Woojin will put his energy into defending himself rather than improving.')),
        option('b', tx('데이터와 구체적인 목표로 개선 기회를 주는 것.', 'To give a chance to improve, with data and a specific goal.')),
        option('c', tx('같은 문제가 번지지 않도록, 다른 팀원에게 경각심을 주는 것.', 'To send a warning to the rest of the team so the same problem does not spread.'), tx('다른 팀원에게 보여 주려는 PIP는 우진을 본보기로 만들 뿐, 개선을 돕지 못합니다.', 'A PIP meant as a message to others only makes an example of Woojin; it does not help him improve.')),
      ],
      answer: 'b',
      explanation: tx('PIP의 목적은 징계가 아니라 성장 지원입니다. 그래서 목표만 주지 않고 정기적인 점검과 지원을 함께 약속합니다.', 'The purpose of a PIP is to support growth, not to discipline. That is why it comes with regular check-ins and a promise of support, not a goal alone.'),
    },
    {
      id: 'pip-q2',
      prompt: tx('우진과 정할 목표로 가장 알맞은 것은 무엇일까요?', 'Which goal fits best for Woojin?'),
      options: [
        option('a', tx('"고객에게 더 친절하게, 공감 표현을 늘려 응대하기."', '"Be friendlier with customers and show more empathy."'), tx('"더 친절하게"는 잴 수 없어서, 기간이 끝나도 달성했는지 함께 판단할 수 없습니다.', '“Be friendlier” cannot be measured, so when the period ends there is no shared way to judge whether it was met.')),
        option('b', tx('예시: "4주 동안 CSAT 5점 올리기."', 'Example: "Raise CSAT by 5 points in 4 weeks."')),
        option('c', tx('"다음 달까지 팀에서 가장 좋은 CSAT 점수 받기."', '"Get the best CSAT score on the team by next month."'), tx('팀 1등은 다른 사람의 결과에 달려 있어서, 우진이 스스로 이룰 수 있는 공정한 목표가 되지 못합니다.', 'Being the best on the team depends on other people’s results, so it is not a fair goal Woojin can reach on his own.')),
      ],
      answer: 'b',
      explanation: tx('목표는 측정할 수 있고 구체적이어야 합니다. 그래야 기간이 끝났을 때 달성했는지 함께 평가할 수 있습니다.', 'A goal has to be specific and measurable. Only then can you evaluate together, at the end of the period, whether it was met.'),
    },
  ],
  connection: { to: 'calibration', text: tx('코칭과 PIP는 모두 평가 점수를 근거로 삼습니다. 그 점수가 평가자마다 다르면 근거가 흔들립니다. 다음은 평가 기준을 맞추는 캘리브레이션입니다.', 'Coaching and the PIP both rest on evaluation scores. If those scores differ from one evaluator to the next, the ground under them shifts. Next comes calibration, which aligns the evaluation standard.') },
};
