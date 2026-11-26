import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Main steps run down one column; `wide` gives them room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['detect', 'analyze', 'execute', 'report'];
const flow = [...procedure, 'detect-analyze', 'analyze-execute', 'execute-report'];
const branch = ['update', 'report-update'];

export default {
  id: 'incident',
  order: 8,
  group: 'cross',
  title: tx('대규모 이슈 대응', 'Large-Scale Issue Response'),
  short: tx('이슈 대응', 'Issue response'),
  subtitle: tx('불만이 폭주할 때 여러 팀이 함께 움직이는 순서.', 'The order several teams move in when complaints surge.'),
  roles: tx('운영 · QA · WFM · T&D', 'Operations · QA · WFM · T&D'),
  procedure,
  diagram: {
    nodes: [
      wide(node('detect', '감지 및 상황 공유', 84, 30, 'Detection and sharing')),
      wide(node('analyze', '원인 분석 및 자원 계획', 84, 90, 'Analysis and planning')),
      wide(node('execute', '실행 및 모니터링', 84, 150, 'Execution and monitoring')),
      wide(node('report', '결과 보고 및 후속 조치', 84, 210, 'Review and follow-up')),
      node('update', 'SOP 업데이트', 270, 210, 'SOP update'),
    ],
    edges: [
      edge('detect', 'analyze'), edge('analyze', 'execute'), edge('execute', 'report'),
      edge('report', 'update'),
    ],
  },
  steps: [
    step(tx('이 절차의 목적은 특정 제품이나 서비스에 대한 고객 불만이 폭주할 때 운영, QA, WFM, T&D가 빠르고 체계적으로 협력해 대응하는 것입니다. 네 단계로 진행합니다.', 'This procedure exists so that Operations, QA, WFM, and T&D work together quickly and in an organized way when complaints about a particular product or service surge. It runs in four steps.'),
      flow, procedure, null),
    step(tx('첫 단계는 감지 및 상황 공유입니다. 특정 유형의 문의가 급증하거나 같은 불만이 반복되는 것을 가장 먼저 알아차리는 사람은 현장의 팀장과 직무전문가입니다. 당신은 즉시 부매니저나 매니저에게 구두와 메신저로 보고합니다.', 'The first step is detection and sharing. The first to notice that one type of contact is spiking or that the same complaint keeps coming back are the team leaders and SMEs on the floor. You report it to the assistant manager (AM) or operation manager (OM) at once, verbally and by chat.'),
      flow, ['detect'], null),
    step(tx('매니저와 부매니저는 상황의 심각성을 판단해 QA, WFM, T&D 부서장에게 \'대규모 이슈 발생\'을 공식적으로 알리고 긴급 대응팀을 소집합니다.', 'The OM and AM judge how serious the situation is, formally announce a large-scale issue to the heads of QA, WFM, and T&D, and call together an emergency response team.'),
      flow, ['detect'], null),
    step(tx('둘째 단계는 원인 분석 및 자원 계획입니다. QA인 지민이 관련 녹취와 티켓을 집중 분석해 핵심 원인을 찾고 분석 리포트를 공유합니다. 잘못된 정보 안내인지, 시스템 오류인지, 정책 문제인지를 가립니다.', 'The second step is analysis and planning. Jimin, now in QA, closely reviews the related recordings and tickets, finds the core cause, and shares an analysis report. She works out whether it is wrong information being given, a system error, or a policy problem.'),
      flow, ['analyze'], 'analyze'),
    step(tx('WFM은 실시간 인입량을 분석해 추가로 필요한 인력을 예측합니다. 필요하면 스케줄 조정이나 추가 근무 편성 같은 인력 운영 계획을 세웁니다.', 'WFM analyzes the real-time contact volume and forecasts the extra staff needed. If necessary, it draws up a staffing plan such as schedule changes or overtime.'),
      flow, ['analyze'], null),
    step(tx('매니저와 부매니저는 QA의 분석과 WFM의 계획을 바탕으로 종합 대응 전략을 세우고 각 팀의 역할을 정합니다.', 'Based on the QA analysis and the WFM plan, the OM and AM set an overall response strategy and define each team\'s role.'),
      flow, ['analyze'], null),
    step(tx('셋째 단계는 실행 및 모니터링입니다. T&D가 QA의 분석을 바탕으로 긴급 공지, FAQ, 예상 질문 답변 스크립트를 빠르게 만들어 상담사를 교육합니다.', 'The third step is execution and monitoring. Working from the QA analysis, T&D quickly writes an urgent notice, an FAQ, and answer scripts for expected questions, and trains the agents.'),
      flow, ['execute'], null),
    step(tx('당신과 직무전문가는 교육받은 내용을 바탕으로 현장에서 상담사를 실시간으로 지원하고, 특이사항이 생기면 즉시 보고합니다.', 'You and the SMEs use that training to support agents on the floor in real time, and report anything unusual at once.'),
      flow, ['execute'], null),
    step(tx('WFM은 서비스 레벨과 상담사 업무 현황을 실시간으로 지켜보며 계획에 따라 인력을 유연하게 재배치합니다.', 'WFM watches the service level and agent activity in real time and moves staff flexibly according to the plan.'),
      flow, ['execute'], null),
    step(tx('넷째 단계는 결과 보고 및 후속 조치입니다. 이슈가 해결되면 매니저가 발생 원인, 대응 과정, 결과, 재발 방지 대책을 담은 최종 보고서를 작성해 경영진과 고객사에게 보고합니다.', 'The fourth step is review and follow-up. Once the issue is resolved, the OM writes a final report covering the cause, the response, the outcome, and how to prevent a repeat, and presents it to senior management and the client.'),
      flow, ['report'], null),
    step(tx('모든 팀이 모여 잘된 점과 개선점을 이야기하는 회고 미팅을 엽니다. 그 결과로 SOP를 업데이트해 다음에 더 잘 대응할 준비를 합니다.', 'All teams meet for a retrospective on what went well and what to improve. The SOP is updated with the result, ready for a better response next time.'),
      [...flow, ...branch], ['report', ...branch], null),
  ],
  checkpoint: [
    {
      id: 'incident-q1',
      prompt: tx('같은 불만이 반복되는 것을 알아차렸습니다. 당신이 가장 먼저 할 일은 무엇일까요?', 'You notice the same complaint coming back again and again. What do you do first?'),
      options: [
        option('a', tx('원인을 직접 찾아낸 뒤에 보고한다.', 'Find the cause yourself, then report it.'), tx('원인을 직접 찾는 동안 보고가 늦어지면, 그사이 같은 불만이 쌓이고 다른 팀은 움직이지 못합니다.', 'Delaying the report while you hunt for the cause lets the same complaints pile up while the other teams cannot move.')),
        option('b', tx('팀 상담사들에게 임시 답변을 만들어 나눠 준다.', 'Write a stopgap answer and hand it out to your agents.'), tx('임시 답변은 원인 분석 뒤 T&D가 만드는 것이라, 지금 나눠 주면 팀마다 다른 안내가 나가 이슈가 커질 수 있습니다.', 'Interim answers are written by T&D after the cause is analyzed; handing out your own now sends different answers from different teams and can make the issue bigger.')),
        option('c', tx('즉시 부매니저나 매니저에게 구두와 메신저로 보고한다.', 'Report it to the AM or OM at once, verbally and by chat.')),
      ],
      answer: 'c',
      explanation: tx('현장이 가장 먼저 알아차립니다. 빨리 알려야 QA, WFM, T&D가 함께 움직일 수 있습니다. 원인 분석은 그다음 단계에서 QA가 맡습니다.', 'The floor notices first. QA, WFM, and T&D can only move together if they are told quickly. Finding the cause is QA\'s job in the next step.'),
    },
    {
      id: 'incident-q2',
      prompt: tx('이슈가 해결된 뒤 마지막으로 하는 일은 무엇일까요?', 'What is the last thing done after the issue is resolved?'),
      options: [
        option('a', tx('회고 미팅을 열고 SOP를 업데이트한다.', 'Hold a retrospective and update the SOP.')),
        option('b', tx('대응에 참여한 인력을 원래대로 돌려보내고 마친다.', 'Send the people who helped back to their usual work and finish there.'), tx('인력만 돌려보내고 마치면 이번에 배운 것이 남지 않아, 다음에도 같은 혼란을 겪습니다.', 'Just sending people back leaves nothing of what was learned, so the next incident brings the same confusion.')),
        option('c', tx('실수가 가장 많았던 팀을 찾는다.', 'Find the team that made the most mistakes.'), tx('실수한 팀을 찾는 회고는 사람들이 문제를 숨기게 만들어, 다음 대응을 오히려 어렵게 합니다.', 'A review that hunts for the team at fault teaches people to hide problems, which makes the next response harder.')),
      ],
      answer: 'a',
      explanation: tx('잘된 점과 개선점을 함께 돌아보고 SOP에 반영해야 다음에 더 잘 대응할 수 있습니다.', 'Looking back together at what went well and what to improve, and writing it into the SOP, is what makes the next response better.'),
    },
  ],
  connection: { to: 'nurture', text: tx('이슈는 지나가도 사람은 남습니다. 다음은 지금 함께 일하는 상담사를 키우는 절차, 기존 상담사 육성입니다.', 'An issue passes, but the people stay. Next is the procedure for growing the agents who work with you now: developing existing agents.') },
};
