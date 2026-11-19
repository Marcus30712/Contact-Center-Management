import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Main steps run down one column; `wide` gives them room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['plan', 'staff', 'setup', 'golive'];
const flow = [...procedure, 'plan-staff', 'staff-setup', 'setup-golive'];
const branch = ['review', 'golive-review'];

export default {
  id: 'launch',
  order: 7,
  group: 'cross',
  title: tx('신규 프로젝트 론칭', 'New Project Launch'),
  short: tx('론칭', 'Launch'),
  subtitle: tx('새 프로젝트를 빠짐없이 준비해 안정적으로 시작합니다.', 'Prepare a new project with nothing missed and get it off to a stable start.'),
  roles: tx('OM · TA · T&D · WFM · HR', 'OM · TA · T&D · WFM · HR'),
  procedure,
  diagram: {
    nodes: [
      wide(node('plan', '계획 및 설계', 84, 30, 'Planning and design')),
      wide(node('staff', '인력 확보 및 교육', 84, 90, 'Recruitment and training')),
      wide(node('setup', '시스템 및 환경 구축', 84, 150, 'System and environment setup')),
      wide(node('golive', '론칭 및 안정화', 84, 210, 'Go-live and stabilization')),
      node('review', '첫 비즈니스 리뷰', 270, 210, 'First business review'),
    ],
    edges: [
      edge('plan', 'staff'), edge('staff', 'setup'), edge('setup', 'golive'),
      edge('golive', 'review'),
    ],
  },
  steps: [
    step(tx('이 절차의 목적은 신규 클라이언트 프로젝트를 시작할 때 모든 단계를 표준화된 절차에 따라 빠짐없이 진행해 안정적인 출발을 보장하는 것입니다. OM, TA, T&D, WFM, HR이 함께 따릅니다. 네 단계로 진행합니다.', 'This procedure exists to guarantee a steady start for a new client project by taking every stage through a standard procedure with nothing missed. The OM, TA, T&D, WFM, and HR follow it together. It runs in four steps.'),
      flow, procedure, null),
    step(tx('첫 단계는 계획 및 설계입니다(예시: 론칭 8주 전). OM이 클라이언트와 킥오프 미팅을 열고 주요 KPI와 서비스 범위(SOW)를 확정합니다.', 'The first step is planning and design (Example: 8 weeks before launch). The OM holds a kickoff meeting with the client and confirms the main KPIs and the scope of work (SOW).'),
      flow, ['plan'], null),
    step(tx('WFM은 클라이언트가 준 데이터로 초기 인입량을 예측하고 필요한 상담 인력(FTE) 규모를 산정합니다. 이 숫자에 따라 OM, TA, HR이 채용 계획과 일정을 세우고, T&D는 교육 커리큘럼 초안과 교육 일정을 준비합니다.', 'WFM forecasts the initial contact volume from the client\'s data and works out the number of agents (FTE) needed. From that number, the OM, TA, and HR set the hiring plan and timeline, and T&D prepares a draft curriculum and a training schedule.'),
      flow, ['plan'], null),
    step(tx('둘째 단계는 인력 확보 및 교육입니다(예시: 론칭 6주 전). TA가 채용 공고, 서류 심사, 면접으로 필요한 인력을 확보하고, HR이 합격자와 근로 계약을 맺고 입사 절차를 안내합니다.', 'The second step is recruitment and training (Example: 6 weeks before launch). TA secures the people needed through job postings, application screening, and interviews, and HR signs employment contracts with those selected and guides them through joining.'),
      flow, ['staff'], null),
    step(tx('T&D가 신규 입사자에게 제품, 시스템, 업무 프로세스를 집중 교육합니다.', 'T&D gives the new hires intensive training on the product, the systems, and the work processes.'),
      flow, ['staff'], null),
    step(tx('셋째 단계는 시스템 및 환경 구축입니다(예시: 론칭 2주 전). OM이 IT팀과 협력해 상담 시스템(CRM)과 전화 시스템 같은 인프라를 구축하고 테스트합니다.', 'The third step is system and environment setup (Example: 2 weeks before launch). The OM works with the IT team to build and test the infrastructure needed, such as the contact system (CRM) and the phone system.'),
      flow, ['setup'], null),
    step(tx('OM과 T&D는 업무 처리 절차와 보고 체계 같은 프로젝트의 핵심 SOP 작성을 마칩니다. WFM은 교육을 마친 상담사의 초기 근무 스케줄을 편성해 배포합니다.', 'The OM and T&D finish writing the project\'s core SOPs, such as how work is handled and how reporting runs. WFM builds and publishes the first work schedules for the agents who have completed training.'),
      flow, ['setup'], null),
    step(tx('넷째 단계는 론칭 및 안정화입니다(예시: 론칭일부터 4주). 프로젝트 운영을 공식적으로 시작합니다. OM과 당신은 론칭 초기 집중 관리 기간(Hyper-care)을 운영하며 현장을 밀착 지원합니다.', 'The fourth step is go-live and stabilization (Example: launch day through week 4). The project officially goes into operation. The OM and you run an early period of intensive support (hyper-care) and support the floor closely.'),
      flow, ['golive'], null),
    step(tx('QA인 지민과 T&D는 초기 상담 품질을 집중적으로 모니터링하고, 추가 교육이 필요한 부분을 찾아 빠르게 보충 교육을 진행합니다.', 'Jimin, now in QA, and T&D closely monitor the quality of the first contacts, find where more training is needed, and run follow-up training quickly.'),
      flow, ['golive'], 'golive'),
    step(tx('OM은 론칭 첫 달의 성과 데이터를 분석해 클라이언트와 첫 공식 비즈니스 리뷰 미팅을 열고, 운영 안정화 계획을 논의합니다.', 'The OM analyzes the performance data from the first month, holds the first formal business review with the client, and discusses the plan for stabilizing operations.'),
      [...flow, ...branch], ['golive', ...branch], null),
  ],
  checkpoint: [
    {
      id: 'launch-q1',
      prompt: tx('채용 규모를 정하려면 무엇이 먼저 있어야 할까요?', 'What has to be in place before you can decide how many people to hire?'),
      options: [
        option('a', tx('초기 인입량 예측과 필요한 인력(FTE) 규모 산정.', 'A forecast of the initial contact volume and the number of agents (FTE) needed.')),
        option('b', tx('완성된 교육 커리큘럼.', 'A finished training curriculum.')),
        option('c', tx('구축을 마친 상담 시스템.', 'A contact system that is fully built.')),
      ],
      answer: 'a',
      explanation: tx('WFM이 인입량을 예측해 필요한 인력 규모를 산정해야, 그 숫자에 맞춰 채용 계획과 일정을 세울 수 있습니다.', 'WFM has to forecast the volume and work out the staff needed first. The hiring plan and timeline are then built to that number.'),
    },
    {
      id: 'launch-q2',
      prompt: tx('론칭 직후 팀장인 당신의 역할은 무엇일까요?', 'Right after go-live, what is your role as the team leader?'),
      options: [
        option('a', tx('첫 달 성과 데이터가 나올 때까지 기다린다.', 'Wait until the first month\'s performance data comes in.')),
        option('b', tx('클라이언트와의 비즈니스 리뷰 미팅을 주관한다.', 'Lead the business review meeting with the client.')),
        option('c', tx('OM과 함께 초기 집중 관리 기간을 운영하며 현장을 밀착 지원한다.', 'Run the hyper-care period with the OM and support the floor closely.')),
      ],
      answer: 'c',
      explanation: tx('론칭 초기에는 예상하지 못한 문제가 현장에서 먼저 드러납니다. 그래서 팀장이 현장 가까이에서 지원합니다.', 'In the first days after launch, unexpected problems show up on the floor first. That is why the team leader supports the floor at close range.'),
    },
  ],
  connection: { to: 'home', text: tx('여기까지가 Codex의 SOP 일곱 가지입니다. 절차는 한 번 정하면 끝나는 것이 아니라, 회고할 때마다 고쳐 가는 문서입니다.', 'These are the seven SOPs in the Codex. A procedure is not finished once it is written; it is a document you revise at every retrospective.') },
};
