import { tx, node, edge, step, option, trackStep, trackQuestion } from './build.js';

const qa = ['calls', 'calls-qa', 'qa'];
const cal = [...qa, 'calibration', 'calibration-qa'];
const kpi = [...cal, 'calls-kpi', 'kpi'];
const all = [...kpi, 'qa-coach', 'kpi-coach', 'coach'];

export default {
  id: 'coaching',
  order: 4,
  title: tx('성과 관리 및 코칭', 'Performance Management and Coaching'),
  short: tx('코칭', 'Coaching'),
  subtitle: tx('품질을 유지하고 역량을 끌어올립니다.', 'Keeping quality steady and building skill.'),
  diagram: {
    nodes: [
      node('calls', '상담', 58, 150, 'Calls'),
      node('qa', 'QA 평가', 180, 96, 'QA review'),
      node('kpi', 'KPI', 180, 204, 'KPIs'),
      node('coach', '1:1 코칭', 302, 150, '1:1 coaching'),
      node('calibration', '캘리브레이션', 180, 24, 'Calibration'),
    ],
    edges: [
      edge('calls', 'qa'), edge('calls', 'kpi'),
      edge('qa', 'coach'), edge('kpi', 'coach'), edge('coach', 'calls'),
      edge('calibration', 'qa'),
    ],
  },
  steps: [
    step(tx('지민은 이제 정식 상담사입니다. 이 단계에서는 품질을 꾸준히 유지하고 역량을 끌어올립니다. 팀장이 쓸 재료는 두 가지입니다.', 'Jimin is now a regular agent. At this stage you keep quality steady and build up skill. A team leader has two kinds of material to work with.'),
      ['calls'], ['calls'], 'calls'),
    step(tx('첫째는 QA(품질 보증) 평가입니다. 상담 녹취를 무작위로 뽑아 스크립트 준수 여부, 친절도, 문제 해결의 정확도를 평가합니다.', 'The first is QA (quality assurance) evaluation. Recorded calls are sampled at random and scored on script adherence, courtesy, and how accurately the problem was solved.'),
      qa, ['qa', 'calls-qa'], 'calls'),
    step(tx('무작위로 뽑는 데에는 이유가 있습니다. 잘된 콜만 골라 들으면 평소의 응대를 알 수 없습니다.', 'There is a reason for random sampling. Listen only to the good calls and you never learn what an ordinary one sounds like.'),
      qa, ['qa'], 'calls'),
    step(tx('평가자끼리 기준도 맞춰야 합니다. 캘리브레이션은 팀장과 QA 담당이 같은 콜을 각자 채점한 뒤 모여서 점수 차이를 이야기하고 기준을 맞추는 자리입니다. 얼마나 자주 할지는 센터마다 다릅니다.', 'Evaluators also need to agree on the standard. In a calibration session, the team leader and QA staff each score the same call separately, then meet to discuss the gaps and align on the standard. How often to hold one varies by center.'),
      cal, ['calibration', 'calibration-qa'], 'calls'),
    step(tx('둘째는 KPI입니다. 평균 처리 시간(AHT), 최초 통화 해결률(FCR), 고객 만족도(CSAT)를 추적합니다.', 'The second is KPIs. You track average handle time (AHT), first contact resolution (FCR), and customer satisfaction (CSAT).'),
      kpi, ['kpi', 'calls-kpi'], 'calls'),
    step(tx('Shrinkage도 함께 봅니다. 상담사가 콜을 받을 수 없는 모든 시간의 비율입니다. 휴식·교육·회의처럼 사전에 계획된 시간(Planned Shrinkage)과 결근·지각·병가처럼 계획되지 않은 시간(Unplanned Shrinkage)으로 나눕니다.', 'You also watch Shrinkage. It is the share of all time an agent cannot take calls. It splits into planned shrinkage, such as breaks, training, and meetings, and unplanned shrinkage, such as absence, lateness, and sick leave.'),
      kpi, ['kpi'], 'calls'),
    step(tx('상품이나 정책이 바뀌면 지식도 다시 확인합니다. 한 번 검증을 통과했다고 계속 맞게 안내한다는 보장은 없기 때문입니다.', 'When products or policies change, knowledge is checked again. Passing verification once is no guarantee that an agent keeps giving correct information.'),
      kpi, ['qa'], 'calls'),
    trackStep('general', tx('일반 고객지원은 문의 유형이 다양합니다. 그래서 QA에서 정책을 정확히 안내했는지와 공감 표현을 함께 봅니다.', 'General support sees many kinds of inquiries. So QA looks at whether policy was explained accurately, along with expressions of empathy.'),
      kpi, ['qa'], 'calls'),
    trackStep('tech', tx('기술지원은 티켓 단위로 봅니다. 해결까지 걸린 시간, 에스컬레이션 비율, 티켓 기록의 품질을 추적합니다. QA에서는 진단 과정이 맞았는지를 확인합니다.', 'Tech support is tracked by ticket. You follow time to resolution, escalation rate, and the quality of ticket documentation. QA checks whether the diagnostic process was sound.'),
      kpi, ['kpi', 'qa'], 'calls'),
    step(tx('지민의 숫자를 봅니다. AHT는 긴 편이고, FCR과 QA 정확도는 높습니다. 숫자 하나만 보면 느린 상담사이지만, 함께 보면 한 번에 해결하는 상담사입니다.', 'Look at Jimin’s numbers. Her AHT is on the long side, while her FCR and QA accuracy are high. One number alone says slow agent, but together they say an agent who solves it the first time.'),
      kpi, ['qa', 'kpi'], 'calls'),
    step(tx('이제 1:1 맞춤 코칭입니다. QA 결과와 KPI 데이터를 근거로 부족한 부분을 피드백합니다.', 'Now the one-on-one coaching. You give feedback on weak points, grounded in the QA results and KPI data.'),
      all, ['coach', 'qa-coach', 'kpi-coach'], 'coach'),
    step(tx('지적만 해서는 코칭이 아닙니다. 잘한 점을 칭찬하고, 바꿔 말할 구체적인 화법을 제시하는 것이 핵심입니다. 코칭을 받은 지민은 다시 상담으로 돌아가 그 화법을 써 봅니다.', 'Pointing out faults is not coaching. The key is to praise what went well and offer specific wording to use instead. After coaching, Jimin goes back to her calls and tries that wording.'),
      [...all, 'coach-calls'], ['coach', 'coach-calls'], 'coach'),
    step(tx('코칭 자리에서 지민이 다른 콜의 녹취를 듣고 빠진 안내를 정확히 짚어 냅니다. 당신은 메모해 둡니다. 이 사람은 QA 일에 맞을 수 있습니다.', 'In the session, Jimin listens to another call recording and spots exactly which piece of information was missed. You make a note. This person may be a good fit for QA work.'),
      [...all, 'coach-calls'], ['qa'], 'coach'),
  ],
  checkpoint: [{
    id: 'coaching-q1',
    prompt: tx('지민에게 긴 통화 시간에 대해 피드백하려 합니다. 어느 쪽이 좋은 코칭일까요?', 'You want to give Jimin feedback on her long handle time. Which is the better coaching?'),
    options: [
      option('a', tx('"통화가 너무 깁니다. 다음 달까지 줄이세요."', '“Your calls are too long. Bring them down by next month.”'), tx('숫자와 기한만 주면 지민은 무엇을 어떻게 바꿔야 할지 알 수 없습니다.', 'A number and a deadline alone leave Jimin with no idea what to change or how.')),
      option('b', tx('"한 번에 해결하는 비율이 높은 게 강점이에요. 본인 확인 단계에서 이 문장으로 바꿔 말하면 시간을 줄일 수 있어요."', '“Solving things on the first contact is your strength. Try this sentence at the identity check and you will save time.”')),
      option('c', tx('"다른 분들은 다 목표를 맞추고 있어요."', '“Everyone else is hitting the target.”'), tx('남과 비교하면 방어적으로 되기 쉽고, 지민의 강점인 높은 해결률은 묻힙니다.', 'Comparing her with others tends to make her defensive, and buries her strength, a high resolution rate.')),
    ],
    answer: 'b',
    explanation: tx('좋은 코칭은 잘한 점을 먼저 짚고, 무엇을 어떻게 바꿔 말할지 구체적으로 보여 줍니다. 숫자만 던지거나 남과 비교하면 지민은 무엇을 바꿔야 할지 알 수 없습니다.', 'Good coaching names what went well first, then shows exactly what to say differently. If you only throw out a number or compare her with others, Jimin cannot tell what to change.'),
  }, trackQuestion('general', {
    id: 'coaching-general',
    prompt: tx('일반 고객지원 QA에서 지민의 콜은 친절도가 높았지만 정책 안내에 틀린 부분이 있었습니다. 어떻게 피드백할까요?', 'In general support QA, Jimin’s call scored high on courtesy but part of the policy information was wrong. How do you give feedback?'),
    options: [
      option('a', tx('친절했으니 넘어간다.', 'She was courteous, so let it pass.'), tx('친절했어도 틀린 안내는 고객이 다시 문의하게 만들기 때문에 넘어갈 수 없습니다.', 'However courteous, wrong information makes the customer call back, so it cannot be let go.')),
      option('b', tx('공감 표현을 칭찬하고, 틀린 안내는 맞는 내용과 말할 문장까지 짚어 준다.', 'Praise the empathy, then go over the wrong information with the correct content and the sentence to say.')),
      option('c', tx('틀린 부분만 지적한다.', 'Point out only what was wrong.'), tx('틀린 점만 지적하면 지민이 잘하는 공감 표현까지 줄어들 수 있습니다.', 'Pointing out only the mistake can make Jimin cut back on the empathy she does well.')),
    ],
    answer: 'b',
    explanation: tx('친절해도 안내가 틀리면 고객은 다시 문의해야 합니다. 잘한 점을 먼저 짚고, 틀린 부분은 무엇이 맞는지와 어떻게 말할지를 함께 알려 줍니다. 그래야 지민이 다음 콜에서 바로 쓸 수 있습니다.', 'However courteous the call, wrong information means the customer has to contact you again. Name what went well first, then give the correct content and how to say it. That way Jimin can use it on her very next call.'),
  }), trackQuestion('tech', {
    id: 'coaching-tech',
    prompt: tx('지민의 티켓은 빨리 닫히지만 같은 고객의 문의가 다시 들어오는 일이 잦습니다. 무엇을 볼까요?', 'Jimin’s tickets close quickly, but the same customers often come back with the same issue. What do you look at?'),
    options: [
      option('a', tx('해결 시간이 짧으니 문제없다고 본다.', 'Resolution time is short, so there is no problem.'), tx('해결 시간이 짧아도 같은 문의가 다시 들어온다면, 해결되지 않은 채 닫힌 것입니다.', 'If the same issue comes back, a short resolution time means the ticket was closed without being solved.')),
      option('b', tx('진단 과정을 녹취, 채팅 로그, 이메일 로그와 티켓 기록으로 확인하고, 건너뛴 확인 단계를 코칭한다.', 'Review the diagnostic process through call recordings, chat logs, email logs, and ticket notes, and coach the checks she skipped.')),
      option('c', tx('에스컬레이션을 더 많이 하라고 한다.', 'Tell her to escalate more often.'), tx('원인을 모른 채 에스컬레이션만 늘리면 상위 단계의 부담만 커지고 지민의 진단 능력은 그대로입니다.', 'Escalating more without knowing the cause only adds to the load on higher tiers, and Jimin’s diagnosis skills stay where they are.')),
    ],
    answer: 'b',
    explanation: tx('빨리 닫힌 티켓이 해결된 티켓은 아닙니다. 지표 하나만 보지 말고 진단 과정이 맞았는지 함께 봐야 합니다. 건너뛴 단계를 구체적으로 짚어 주는 것이 코칭입니다.', 'A ticket closed quickly is not a ticket resolved. Do not look at one metric alone but check whether the diagnosis was sound. Naming the skipped step specifically is what makes it coaching.'),
  }), trackQuestion('general', {
    id: 'coaching-general-2',
    prompt: tx('같은 콜을 두고 팀장은 공감 표현이 좋았다고, QA 담당은 정책 안내 순서를 지키지 않았다고 서로 다른 점수를 매겼습니다. 어떻게 할까요?', 'On the same call, the team leader scored the empathy highly, while the QA staff member marked it down for not explaining the policy in the set order. Their scores differ. What do you do?'),
    options: [
      option('a', tx('팀장 점수를 따른다.', 'Go with the team leader’s score.'), tx('한쪽 점수를 따르면 기준은 맞춰지지 않고, 다음 평가에서도 같은 차이가 생깁니다.', 'Going with one score leaves the standards unaligned, and the same gap appears in the next evaluation.')),
      option('b', tx('두 점수의 평균을 낸다.', 'Average the two scores.'), tx('평균을 내면 숫자는 하나가 되지만, 무엇을 고쳐야 하는지는 여전히 알 수 없습니다.', 'Averaging gives you one number, but it still does not say what needs to change.')),
      option('c', tx('캘리브레이션에서 공감과 정책 안내를 각각 어떻게 볼지 기준을 맞춘다.', 'In calibration, agree how to score empathy and policy information separately.')),
    ],
    answer: 'c',
    explanation: tx('평가자마다 기준이 다르면 상담사는 무엇을 고쳐야 할지 알 수 없습니다. 일반 고객지원은 정책 정확도와 공감을 함께 보므로, 두 항목의 채점 기준을 캘리브레이션으로 맞춥니다.', 'If each evaluator uses a different standard, agents cannot tell what to fix. General support looks at both policy accuracy and empathy, so calibration aligns how each is scored.'),
  }), trackQuestion('tech', {
    id: 'coaching-tech-2',
    prompt: tx('지민의 에스컬레이션 비율이 팀에서 가장 높습니다. 코칭에서 무엇부터 할까요?', 'Jimin’s escalation rate is the highest on the team. What do you start with in coaching?'),
    options: [
      option('a', tx('비율을 낮추라고만 말한다.', 'Just tell her to bring the rate down.'), tx('비율만 낮추라고 하면 넘겨야 할 티켓까지 붙잡게 될 수 있습니다.', 'Telling her only to lower the rate can make her hold on to tickets she should pass on.')),
      option('b', tx('넘긴 티켓 몇 건을 함께 보며 진단 과정의 어디에서 멈췄는지 찾는다.', 'Go through a few of the tickets she passed on and find where her diagnosis stopped.')),
      option('c', tx('다른 팀원과의 비율을 공개해 비교한다.', 'Publish everyone’s rate so she can compare.'), tx('비율을 공개해 비교하면 원인은 찾지 못한 채 부담만 커집니다.', 'Publishing and comparing rates adds pressure without finding the cause.')),
    ],
    answer: 'b',
    explanation: tx('숫자는 무엇이 문제인지가 아니라 어디를 봐야 하는지를 알려 줍니다. 실제 티켓으로 진단 과정을 짚어야 구체적인 개선 방법이 나옵니다.', 'A number tells you where to look, not what the problem is. Walking through real tickets is what turns up a specific way to improve.'),
  })],
  connection: {
    to: 'retention',
    text: tx('코칭은 실력을 올려 줍니다. 하지만 실력이 오른 사람이 계속 남아 있을지는 다른 문제입니다. 다음 단계는 지치지 않고 오래 일하게 하는 일입니다.', 'Coaching raises skill. Whether the skilled person stays is a separate question. The next stage is about helping people keep working without burning out.'),
  },
};
