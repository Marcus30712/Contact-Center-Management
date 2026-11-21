import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// The two weeks sit side by side, each under its own heading box. `wide`
// gives the boxes room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['contract', 'equipment', 'culture', 'buddy', 'product', 'systems', 'schedule', 'oneonone'];
// The first task of each week; no arrow runs from one column to the other.
const columnStarts = ['contract', 'product'];
const flow = [...procedure, 'week1', 'week2', 'week1-contract', 'contract-equipment', 'equipment-culture', 'culture-buddy',
  'week2-product', 'product-systems', 'systems-schedule', 'schedule-oneonone'];

export default {
  id: 'onboarding',
  order: 6,
  group: 'cross',
  title: tx('신규 입사자 온보딩', 'New Hire Onboarding'),
  short: tx('온보딩', 'Onboarding'),
  subtitle: tx('첫 2주, 어느 팀이 무엇을 맡는지.', 'The first two weeks, and which team does what.'),
  roles: tx('HR · T&D · 운영 · WFM', 'HR · T&D · Operations · WFM'),
  personaName: tx('서아', 'Seoa'),
  procedure,
  columnStarts,
  diagram: {
    nodes: [
      wide(node('contract', '계약 및 서류 처리', 84, 72, 'Contract and paperwork')),
      wide(node('equipment', '장비 지급 및 계정 생성', 84, 120, 'Equipment and accounts')),
      wide(node('culture', '비전·문화 교육', 84, 168, 'Vision and culture')),
      wide(node('buddy', '버디 지정 및 팀 소개', 84, 216, 'Buddy and team intro')),
      wide(node('product', '제품·서비스 심화 교육', 268, 72, 'Product training')),
      wide(node('systems', '시스템 실습 교육', 268, 120, 'Hands-on systems training')),
      wide(node('schedule', '실전 투입 스케줄 배정', 268, 168, 'First live schedule')),
      wide(node('oneonone', '첫 주 1:1 미팅', 268, 216, 'First-week 1:1')),
      node('week1', '1주차', 84, 24, 'Week 1'),
      node('week2', '2주차', 268, 24, 'Week 2'),
    ],
    edges: [
      edge('week1', 'contract'), edge('contract', 'equipment'), edge('equipment', 'culture'), edge('culture', 'buddy'),
      edge('week2', 'product'), edge('product', 'systems'), edge('systems', 'schedule'), edge('schedule', 'oneonone'),
    ],
  },
  steps: [
    step(tx('이 절차의 목적은 신규 입사자가 첫 2주 동안 소속감과 자신감을 느끼고 팀에 성공적으로 안착하도록 모든 부서가 유기적으로 지원하는 것입니다. HR, T&D, 운영, WFM 등 온보딩에 관여하는 모든 팀이 따릅니다.', 'This procedure exists so that every department works together to help a new hire feel they belong, gain confidence, and settle into the team in their first two weeks. Every team involved in onboarding follows it, including HR, T&D, Operations, and WFM.'),
      flow, procedure, null),
    step(tx('당신 팀에 신입 상담사 최서아가 들어옵니다. 서아의 첫 2주를 따라가며 어느 팀이 무엇을 맡는지 봅니다.', 'Seoa Choi, a new agent, is joining your team. Follow her first two weeks and see which team takes care of what.'),
      flow, [], null),
    step(tx('1주차는 환영과 기초 교육입니다. HR이 서아와 근로 계약서를 작성하고 필요한 서류를 처리합니다.', 'Week one is for welcome and basic training. HR completes the employment contract with Seoa and handles the paperwork she needs.'),
      flow, ['week1', 'contract'], 'contract'),
    step(tx('HR이 업무에 필요한 장비를 지급하고 시스템 계정을 만듭니다. 첫날 자리에 앉았는데 로그인할 수 없다면 환영받는다는 느낌부터 사라집니다.', 'HR hands over the equipment she needs for work and creates her system accounts. If she sits down on day one and cannot log in, the feeling of being welcome is the first thing to go.'),
      flow, ['equipment'], 'equipment'),
    step(tx('T&D가 회사의 비전, 문화, 핵심 가치를 교육합니다.', 'T&D teaches the company\'s vision, culture, and core values.'),
      flow, ['culture'], 'culture'),
    step(tx('이제 당신 차례입니다. 서아에게 버디(Buddy)를 지정하고, 팀원들에게 공식적으로 소개해 유대감을 만듭니다.', 'Now it is your turn. You assign Seoa a buddy and introduce her formally to the team, so that she starts to form bonds.'),
      flow, ['buddy'], 'buddy'),
    step(tx('2주차는 직무와 시스템 교육입니다. T&D가 서아가 맡게 될 제품과 서비스를 깊이 있게 교육합니다.', 'Week two is for job and systems training. T&D gives Seoa in-depth training on the products and services she will support.'),
      flow, ['week2', 'product'], 'product'),
    step(tx('T&D가 상담 시스템(CRM)과 업무 도구 사용법을 실습으로 교육합니다.', 'T&D runs hands-on training on the contact system (CRM) and the other work tools.'),
      flow, ['systems'], 'systems'),
    step(tx('WFM이 교육을 마친 뒤의 첫 실전 투입을 위한 근무 스케줄을 배정하고 서아에게 안내합니다.', 'WFM assigns the work schedule for her first live contacts after training, and walks Seoa through it.'),
      flow, ['schedule'], 'schedule'),
    step(tx('다시 당신 차례입니다. 서아와 1:1로 만나 첫 주의 경험과 어려움을 듣고, 필요한 지원을 약속합니다. 심리적 안정을 돕는 자리입니다.', 'It is your turn again. You meet Seoa one-on-one, listen to how her first week went and what was hard, and promise the support she needs. This meeting is there to help her feel secure.'),
      flow, ['oneonone'], 'oneonone'),
    step(tx('각 일에는 실무 담당자(R, Responsible)가 정해져 있습니다. RACI는 여기에 최종 책임자(A), 사전 협의 대상(C), 결과 공유 대상(I)을 더해 누가 무엇을 하는지 분명히 하는 표기입니다.', 'Each task has someone who does the work (R, Responsible). RACI adds who is ultimately accountable (A), who is consulted beforehand (C), and who is informed of the result (I), so it is clear who does what.'),
      flow, [], null),
  ],
  checkpoint: [
    {
      id: 'onboarding-q1',
      prompt: tx('서아의 첫 2주 동안 팀장인 당신이 직접 맡는 일은 무엇일까요?', 'During Seoa\'s first two weeks, which work is yours as the team leader?'),
      options: [
        option('a', tx('버디를 지정해 팀에 소개하고, 1:1 미팅으로 첫 주의 어려움을 듣는다.', 'Assign a buddy, introduce her to the team, and hear what was hard in her first week in a one-on-one.')),
        option('b', tx('근로 계약서를 작성하고 장비를 지급한다.', 'Complete the employment contract and hand over equipment.'), tx('근로 계약과 장비 지급은 HR이 맡는 일이라, 팀장이 붙잡으면 팀장만 할 수 있는 일이 비게 됩니다.', 'Contracts and equipment are HR’s job; if the team leader takes them on, the work only the team leader can do is left undone.')),
        option('c', tx('실전 투입을 위한 근무 스케줄을 배정한다.', 'Assign the work schedule for her first live contacts.'), tx('근무 스케줄은 WFM이 맡고, 첫 2주의 서아에게 먼저 필요한 것은 팀에 속해 있다는 느낌입니다.', 'Schedules belong to WFM, and what Seoa needs first in her first two weeks is a sense that she belongs on the team.')),
      ],
      answer: 'a',
      explanation: tx('계약과 장비는 HR이, 스케줄은 WFM이 맡습니다. 팀장은 신규 입사자가 팀에 속해 있다고 느끼게 하는 일을 맡습니다.', 'HR handles the contract and equipment, and WFM handles the schedule. The team leader\'s part is making the new hire feel they belong to the team.'),
    },
    {
      id: 'onboarding-q2',
      prompt: tx('RACI에서 R은 누구일까요?', 'In RACI, who is the R?'),
      options: [
        option('a', tx('일이 끝난 뒤 결과를 공유받는 사람.', 'The person told the result once the work is done.'), tx('결과를 공유받는 사람은 I(Informed)이며, 그 일을 직접 하지는 않습니다.', 'The person told about the result afterward is I (Informed), who does not do the work.')),
        option('b', tx('일을 시작하기 전에 협의하는 사람.', 'The person consulted before the work starts.'), tx('시작 전에 협의하는 사람은 C(Consulted)이며, 의견을 주지만 실무를 맡지는 않습니다.', 'The person consulted beforehand is C (Consulted), who gives input but does not do the work.')),
        option('c', tx('그 일을 실제로 하는 실무 담당자.', 'The person who actually does the work.')),
      ],
      answer: 'c',
      explanation: tx('R(Responsible)은 실무 담당자입니다. 담당이 분명해야 여러 팀이 함께 하는 일에서 빠지는 것이 없습니다.', 'R (Responsible) is the person who does the work. When that is clear, nothing falls through the gaps in work that several teams share.'),
    },
  ],
  connection: { to: 'incident', text: tx('온보딩은 미리 계획한 협업입니다. 다음은 계획에 없던 일이 터졌을 때의 협업, 대규모 이슈 대응입니다.', 'Onboarding is teamwork that is planned in advance. Next comes teamwork for when something unplanned breaks out: large-scale issue response.') },
};
