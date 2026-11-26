import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Scrubbing (added 2026-11-21; copy: docs/superpowers/specs/2026-11-21-sop-scrubbing-design.md).
// The five steps run down one column; the last one splits three ways by what is scrubbed.
// The three outcome boxes step to the right as they go up, so no arrow crosses a box.
const wide = (n) => ({ ...n, hw: 76 });
const side = (n, hw) => ({ ...n, hw });

const procedure = ['pick', 'rca', 'classify', 'discuss', 'report'];
const flow = [...procedure, 'pick-rca', 'rca-classify', 'classify-discuss', 'discuss-report'];
const branches = ['improve', 'insight', 'resolve', 'report-improve', 'report-insight', 'report-resolve'];

export default {
  id: 'scrubbing',
  order: 2,
  group: 'leader',
  title: tx('스크러빙', 'Scrubbing'),
  short: tx('스크러빙', 'Scrubbing'),
  subtitle: tx("티켓을 다시 읽고, 원인을 찾아 고객사와 나눕니다.", 'Reread tickets, find the causes and share them with the client.'),
  roles: tx("팀장 · 직무전문가", 'Team leader · SME'),
  procedure,
  diagram: {
    nodes: [
      wide(node('pick', '대상 고르기', 84, 24, 'Choose the tickets')),
      wide(node('rca', '원인 분석(RCA)', 84, 72, 'Root cause analysis')),
      wide(node('classify', 'L1·L2 분류', 84, 120, 'Classify L1 and L2')),
      wide(node('discuss', '내부 토의', 84, 168, 'Internal discussion')),
      wide(node('report', '보고 및 건의', 84, 216, 'Report and propose')),
      side(node('improve', '개선점 보고', 300, 136, 'Improvements'), 52),
      side(node('insight', '인사이트 공유', 292, 176, 'Insights'), 52),
      side(node('resolve', '해결 또는 건의', 292, 216, 'Fix or propose'), 56),
    ],
    edges: [
      edge('pick', 'rca'), edge('rca', 'classify'), edge('classify', 'discuss'), edge('discuss', 'report'),
      edge('report', 'improve'), edge('report', 'insight'), edge('report', 'resolve'),
    ],
  },
  steps: [
    step(tx("이 절차의 목적은 처리된 티켓과 쌓여 있는 티켓을 다시 읽고 원인을 찾아, BPO와 고객사가 함께 개선하게 하는 것입니다. QA의 품질 평가와 별개로, 팀장이 상담사들이 매일 케이스를 어떻게 처리하는지 흐름을 읽는 자료가 됩니다. 다섯 단계로 진행합니다.",
      "The purpose of this procedure is to reread both handled tickets and tickets that have piled up, find the causes, and let the BPO and the client improve together. Separate from QA's quality evaluation, it gives the team leader a way to read how agents handle cases every day. It runs in five steps."),
      flow, procedure, null),
    step(tx("첫 단계는 대상 고르기입니다. 당신은 직무전문가와 함께 매일 티켓을 몇 건씩 고릅니다(예시: 하루 3~4건). 우선순위는 DSAT, CSAT, 미해결·방치 케이스 순입니다.",
      "The first step is choosing the tickets. With your SME, you pick a few tickets every day (Example: 3 to 4 a day). The order of priority is DSAT, then CSAT, then unresolved and neglected cases."),
      flow, ['pick'], 'pick'),
    step(tx("DSAT가 먼저인 이유는 불만을 그대로 두면 재문의와 고객 이탈로 이어지기 때문입니다. 오늘 고른 첫 티켓은 지민이 처리한 DSAT 건입니다.",
      "DSAT comes first because a complaint left alone turns into repeat contacts and lost customers. The first ticket you pick today is a DSAT case Jimin handled."),
      flow, ['pick'], 'pick'),
    step(tx("둘째 단계는 원인 분석(RCA, Root Cause Analysis)입니다. 팀장과 직무전문가가 티켓을 자세히 조사해 겉으로 보인 문제 뒤의 진짜 원인을 찾고, 그 원인을 한두 문장으로 요약합니다. 이 DSAT는 상담사들이 반품 절차를 서로 다르게 알고 안내해서 생긴 불만이었고, 지난달 바뀐 절차가 일부 상담사에게 전달되지 않은 것이 원인이었습니다.",
      "The second step is root cause analysis (RCA). The team leader and the SME look into the tickets closely, find the real cause behind the visible problem, and sum it up in a sentence or two. This DSAT came from agents knowing the returns process differently and explaining it differently, and the cause was that last month's change to the process had not reached some agents."),
      flow, ['rca'], 'rca'),
    step(tx("셋째 단계는 L1·L2 분류입니다. 요약한 원인을 정해진 분류로 나눠 두면, 나중에 데이터를 추적하거나 필터로 필요한 티켓을 빨리 찾을 수 있습니다. L1은 원인이 어디에 있는지로 나누며 제품(Product), 절차(Process), 지원(Support), 고객(Customer), 기타(Others)가 있고, L2는 BPO가 통제할 수 있는 원인인지, 통제할 수 없는 원인인지로 나눕니다.",
      "The third step is the L1 and L2 classification. Sorting the summarized cause into set categories lets you track the data later and filter quickly for the tickets you need. L1 sorts by where the cause lies, with Product, Process, Support, Customer and Others, and L2 sorts by whether the BPO can control the cause or not."),
      flow, ['classify'], 'classify'),
    step(tx("지원(Support)은 상담사의 응대 태도(Soft Skill)나 제품·절차 지식의 차이를 가리킵니다. 이번 원인은 상담사의 절차 지식 차이이므로 L1은 Support, L2는 통제 가능입니다. 비고(Remark)에는 어느 안내가 어떻게 달랐는지 적습니다.",
      "Support means a gap in an agent's soft skills or product and process knowledge. This cause is a gap in the agents' process knowledge, so L1 is Support and L2 is controllable. In the Remark, you note which explanation differed and how."),
      flow, ['classify'], 'classify'),
    step(tx("넷째 단계는 내부 토의입니다. 팀장, 직무전문가, QA, 매니저가 모여 원인과 개선안을 이야기합니다. 통제 가능한 원인은 BPO가 무엇을 바꿀지, 통제 불가한 원인은 고객사에 무엇을 요청할지 정합니다.",
      "The fourth step is the internal discussion. The team leader, SME, QA and operation manager (OM) meet to talk through the causes and the improvements. For controllable causes they decide what the BPO will change; for uncontrollable ones, what to ask of the client."),
      flow, ['discuss'], 'discuss'),
    step(tx("다섯째 단계는 보고 및 건의입니다. DSAT는 원인에 BPO가 정한 개선점을 붙여 고객사에 보고합니다. 이번 건은 바뀐 절차를 팀 전체에 다시 교육하고 이해도를 확인했다고 보고합니다.",
      "The fifth step is reporting and proposing. For a DSAT, you report the cause to the client together with the improvement the BPO has decided on. For this case, you report that the whole team was retrained on the changed process and their understanding was checked."),
      [...flow, ...branches], ['report', 'improve', 'report-improve'], 'report'),
    step(tx("CSAT도 같은 다섯 단계를 거칩니다. 고객이 왜 만족했는지를 모아, 고객사의 제품과 서비스가 잘하고 있는 점을 알려 주는 인사이트로 공유합니다.",
      "CSAT goes through the same five steps. You gather why customers were satisfied and share it as insight into what the client's products and services are doing well."),
      [...flow, ...branches], ['report', 'insight', 'report-insight'], 'report'),
    step(tx("미해결·방치 케이스는 티켓 상태를 같은 L1·L2로 나누고, SLA와 품질(Quality)에 미치는 영향을 함께 봅니다. 해결책이 없는 케이스가 쌓이면 상담사들이 비슷한 문의에 잘못 안내해 DSAT가 늘고 처리도 늦어지기 때문입니다. BPO 안에서 풀 수 있으면 직접 해결하고, 고객사의 허락이 필요하면 프로세스를 만들어 건의합니다.",
      "For unresolved and neglected cases, you sort the ticket status with the same L1 and L2 and look at the effect on SLA and quality. When cases without a solution pile up, agents give wrong answers to similar contacts, so DSAT rises and handling slows down. If the BPO can fix it internally, it does; if the client's approval is needed, you build a process and propose it."),
      [...flow, ...branches], ['report', 'resolve', 'report-resolve'], 'report'),
    step(tx("지민의 티켓 몇 건에서는 고객에게 확인 질문을 여러 번 되풀이하는 흐름도 보였습니다. 이런 흐름은 QA 점수만으로는 잘 보이지 않습니다. 다음 1:1 코칭의 근거가 되고, 코칭으로도 나아지지 않을 때는 PIP의 근거가 됩니다.",
      "A few of Jimin's tickets also showed a pattern of asking the customer the same confirming questions several times. A pattern like this is hard to see in QA scores alone. It becomes evidence for the next one-on-one coaching, and for a PIP only if coaching does not help."),
      [...flow, ...branches], procedure, null),
  ],
  checkpoint: [
    {
      id: 'scrubbing-q1',
      prompt: tx("상담사들이 반품 절차를 서로 다르게 알고 안내해서 생긴 DSAT입니다. L1·L2는 어떻게 분류할까요?", "This DSAT came from agents knowing the returns process differently and explaining it differently. How do you classify L1 and L2?"),
      options: [
        option('a', tx("L1 Customer, L2 통제 불가.", "L1 Customer, L2 uncontrollable."), tx("고객이 아니라 상담사마다 다른 안내가 원인입니다. 고객 탓으로 분류하면 BPO가 고칠 수 있는 원인이 보고서에서 사라집니다.", "The cause is the agents’ differing explanations, not the customer. Classifying it as the customer’s doing drops a cause the BPO can fix from the report.")),
        option('b', tx("L1 Support, L2 통제 가능.", "L1 Support, L2 controllable.")),
        option('c', tx("L1 Process, L2 통제 불가.", "L1 Process, L2 uncontrollable."), tx("절차는 이미 정해져 있었고, 상담사들이 그것을 다르게 알고 있었던 것이 원인입니다. 절차 탓으로 분류하면 다시 교육해야 할 지식의 차이가 보이지 않습니다.", "The process was already set; the cause was that agents knew it differently. Classifying it as a process issue hides the knowledge gap that needs retraining.")),
      ],
      answer: 'b',
      explanation: tx("상담사의 응대 태도나 제품·절차 지식의 차이는 L1 Support입니다. 교육으로 BPO가 직접 메울 수 있으니 L2는 통제 가능입니다.", "A gap in an agent's soft skills or product and process knowledge is L1 Support. The BPO can close it directly through training, so L2 is controllable."),
    },
    {
      id: 'scrubbing-q2',
      prompt: tx("고객 답변을 기다리며 2주째 열려 있는 티켓들이 SLA를 끌어내리고 있습니다. 이 티켓들을 종료하려면 고객사의 허락이 필요합니다. 어떻게 할까요?", "Tickets left open for two weeks while waiting for the customer's reply are dragging SLA down. Closing them needs the client's approval. What do you do?"),
      options: [
        option('a', tx("팀에서 바로 모두 종료한다.", "Close them all right away within the team."), tx("고객사의 허락 없이 종료하면 합의한 처리 기준을 어기게 되고, 고객이 다시 문의할 때 신뢰를 잃습니다.", "Closing them without the client’s approval breaks the agreed handling standard, and trust is lost when the customer contacts you again.")),
        option('b', tx("그대로 두고 SLA가 떨어졌다고 보고만 한다.", "Leave them and only report that SLA has dropped."), tx("원인을 알면서 그대로 두면 같은 티켓이 계속 쌓이고, 보고서는 같은 문제를 매주 되풀이합니다.", "Leaving them while knowing the cause lets the same tickets keep piling up, and the report repeats the same problem every week.")),
        option('c', tx("팔로업을 정해진 횟수만큼 한 뒤 종료하는 프로세스를 만들어 고객사에 건의한다.", "Build a process that closes them after a set number of follow-ups, and propose it to the client.")),
      ],
      answer: 'c',
      explanation: tx("고객사의 허락이 필요한 해결은 BPO가 프로세스를 만들어 건의합니다. 승인되면 기준이 생겨, 같은 티켓이 다시 쌓이지 않습니다.", "When a fix needs the client's approval, the BPO builds a process and proposes it. Once approved, there is a standard, and the same tickets stop piling up."),
    },
  ],
  connection: { to: 'coaching', text: tx("스크러빙에서 보인 흐름은 팀원과 마주 앉을 근거가 됩니다. 다음은 1:1 코칭입니다.", "The patterns seen in scrubbing give you grounds to sit down with your team members. Next is one-on-one coaching.") },
};
