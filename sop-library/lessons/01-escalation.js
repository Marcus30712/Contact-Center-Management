import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Main steps run down one column; `wide` gives them room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['received', 'attempt', 'inform', 'notify', 'handover'];
const flow = [...procedure, 'received-attempt', 'attempt-inform', 'inform-notify', 'notify-handover'];
const branch = ['closed', 'attempt-closed'];

export default {
  id: 'escalation',
  order: 1,
  group: 'leader',
  title: tx('고객 불만 에스컬레이션', 'Customer Complaint Escalation'),
  short: tx('에스컬레이션', 'Escalation'),
  subtitle: tx('혼자 풀 수 없는 불만을 제대로 넘기는 순서.', 'How to properly hand over a complaint you cannot solve alone.'),
  roles: tx('상담사 → 팀장', 'Agent → Team leader'),
  procedure,
  diagram: {
    nodes: [
      wide(node('received', '불만 접수', 84, 24, 'Complaint received')),
      wide(node('attempt', '1차 해결 시도', 84, 72, 'First resolution attempt')),
      wide(node('inform', '에스컬레이션 안내', 84, 120, 'Informing escalation')),
      wide(node('notify', '즉시 알림', 84, 168, 'Immediate notification')),
      wide(node('handover', '기록 및 인계', 84, 216, 'Recording and handover')),
      node('closed', '종결', 270, 72, 'Closed'),
    ],
    edges: [
      edge('received', 'attempt'), edge('attempt', 'inform'), edge('inform', 'notify'), edge('notify', 'handover'),
      edge('attempt', 'closed'),
    ],
  },
  steps: [
    step(tx('이 절차의 목적은 고객 불만을 빠르고 정확하게 상급자(SME나 팀장)에게 전달해 문제를 일찍 해결하는 것입니다. 고객을 응대하는 모든 상담사가 따릅니다. 팀장인 당신은 이 순서를 알아야 넘겨받을 준비를 할 수 있습니다.', 'This procedure exists to get a customer complaint to someone senior (an SME or the team leader) quickly and accurately, so the problem is solved early. Every agent who handles customers follows it. As the team leader, you need to know the order so you are ready to take the case over.'),
      flow, procedure, null),
    step(tx('지민이 화가 난 고객의 전화를 받습니다. 첫 단계는 불만 접수입니다. 고객의 말을 중간에 끊지 않고 끝까지 듣습니다.', 'Jimin takes a call from an angry customer. The first step is receiving the complaint. She listens to the end without cutting the customer off.'),
      flow, ['received'], 'received'),
    step(tx('끝까지 듣는 데에는 이유가 있습니다. 말이 끊긴 고객은 같은 이야기를 처음부터 다시 하게 되고, 그만큼 감정도 올라갑니다.', 'There is a reason to listen to the end. A customer who is interrupted starts the story over from the beginning, and the frustration rises with it.'),
      flow, ['received'], 'received'),
    step(tx('둘째 단계는 1차 해결 시도입니다. 지민은 표준 응대 절차와 자기 권한 안에서 문제를 풀기 위해 최선을 다합니다.', 'The second step is the first resolution attempt. Jimin does everything she can to solve the problem within the standard procedure and her own authority.'),
      flow, ['attempt'], 'attempt'),
    step(tx('여기서 해결되면 처리 내용을 티켓에 자세히 기록하고 종결합니다. 모든 불만이 에스컬레이션으로 가는 것은 아닙니다.', 'If that solves it, she records what was done in the ticket in detail and closes it. Not every complaint ends in an escalation.'),
      [...flow, ...branch], ['attempt', ...branch], 'attempt'),
    step(tx('이번 건은 지민의 권한으로 풀 수 없습니다. 셋째 단계는 에스컬레이션 안내입니다. 고객과 논쟁하는 대신, 상급자에게 전달하겠다고 정중하게 알립니다.', 'This one is beyond Jimin\'s authority. The third step is informing the customer about the escalation. Instead of arguing, she politely says she will pass the case to someone senior.'),
      [...flow, ...branch], ['inform'], 'inform'),
    step(tx('지민은 이렇게 말합니다. "고객님, 더 나은 해결을 위해 상급 책임자에게 전달해 드리겠습니다. 잠시만 기다려 주시겠어요?"', 'Jimin says: "To find a better resolution, I will pass this to a senior colleague. Could you hold for a moment?"'),
      [...flow, ...branch], ['inform'], 'inform'),
    step(tx('넷째 단계는 즉시 알림입니다. 지민이 메신저나 구두로 당신에게 상황을 바로 알리고 도움을 요청합니다.', 'The fourth step is immediate notification. Jimin tells you what is happening right away, by chat or verbally, and asks for help.'),
      [...flow, ...branch], ['notify'], 'notify'),
    step(tx('다섯째 단계는 기록 및 인계입니다. 지민은 티켓에 \'Escalation\' 태그를 달고, 고객의 감정 표현까지 포함해 모든 과정을 사실대로 자세히 기록합니다.', 'The fifth step is recording and handover. Jimin adds the \'Escalation\' tag to the ticket and records the whole exchange factually and in detail, including how the customer expressed their feelings.'),
      [...flow, ...branch], ['handover'], 'handover'),
    step(tx('이제 케이스는 당신에게 넘어왔습니다. 기록이 충실하면 고객에게 같은 질문을 되풀이하지 않고 바로 이어서 처리할 수 있습니다.', 'The case is now yours. With a thorough record you can pick it up at once, without asking the customer the same questions again.'),
      [...flow, ...branch], ['handover'], 'handover'),
  ],
  checkpoint: [
    {
      id: 'escalation-q1',
      prompt: tx('지민이 1차 해결이 어렵다고 판단했습니다. 다음으로 할 일은 무엇일까요?', 'Jimin decides she cannot resolve this at the first attempt. What should she do next?'),
      options: [
        option('a', tx('규정을 근거로 고객의 요구가 왜 안 되는지 끝까지 설명한다.', 'Keep explaining, rule by rule, why the customer cannot have what they ask for.'), tx('권한 밖의 요구를 두고 규정만 설명하면, 고객은 해결이 아니라 논쟁을 하고 있다고 느껴 감정이 더 올라갑니다.', 'Explaining the rules about a request beyond her authority makes the customer feel they are in an argument, not getting help, and emotions rise.')),
        option('b', tx('상급자에게 전달하겠다고 정중하게 안내한다.', 'Politely tell the customer she will pass the case to someone senior.')),
        option('c', tx('나중에 다시 연락해 달라고 하고 상담을 마친다.', 'Ask the customer to get in touch again later and end the contact.'), tx('다음 처리 없이 상담을 마치면 고객은 같은 불만을 처음부터 다시 말해야 하고, 불만은 더 커집니다.', 'Ending the call with no next step means the customer must repeat the whole complaint from the start, and the complaint grows.')),
      ],
      answer: 'b',
      explanation: tx('권한 밖의 문제를 두고 고객과 논쟁하면 감정만 올라갑니다. 정중하게 안내하고 바로 상급자에게 알리는 것이 순서입니다.', 'Arguing over something outside her authority only raises the temperature. The order is to inform the customer politely and notify someone senior right away.'),
    },
    {
      id: 'escalation-q2',
      prompt: tx('넘기는 티켓에는 무엇을 기록해야 할까요?', 'What should go into the ticket that is handed over?'),
      options: [
        option('a', tx('문제가 해결된 뒤에 결과만 적는다.', 'Only the outcome, written once the problem is solved.'), tx('결과만 적으면 넘겨받는 사람이 그동안 무슨 일이 있었는지 몰라, 고객에게 같은 질문을 다시 하게 됩니다.', 'Recording only the outcome leaves the next person unaware of what happened, so they ask the customer the same questions again.')),
        option('b', tx('고객의 감정 표현을 포함해 모든 과정을 사실대로 적는다.', 'The whole exchange as fact, including how the customer expressed their feelings.')),
        option('c', tx('지민이 느낀 점과 추측을 중심으로 적는다.', 'Mostly Jimin\'s own impressions and guesses.'), tx('느낌과 추측은 다음 담당자의 판단을 흐리고, 사실과 섞이면 실제로 무슨 일이 있었는지 알 수 없게 됩니다.', 'Feelings and guesses cloud the next person’s judgment, and mixed with facts they hide what actually happened.')),
      ],
      answer: 'b',
      explanation: tx('넘겨받는 사람은 기록만 보고 이어서 처리합니다. 사실에 기반한 자세한 기록이 있어야 고객이 같은 말을 반복하지 않습니다.', 'Whoever takes over works from the record alone. A detailed, factual record means the customer does not have to say everything twice.'),
    },
  ],
  connection: { to: 'coaching', text: tx('넘겨받은 케이스를 처리하고 나면, 팀원과 마주 앉아 돌아볼 차례입니다. 다음은 1:1 코칭입니다.', 'Once you have dealt with the case you took over, it is time to sit down with your team member and look back. Next comes one-on-one coaching.') },
};
