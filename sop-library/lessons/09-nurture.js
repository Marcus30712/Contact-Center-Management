import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Developing existing agents (added 2026-11-21; copy: docs/superpowers/specs/2026-11-21-sop-nurture-design.md).
// The five steps run down one column; the growth review splits into two tracks.
const wide = (n) => ({ ...n, hw: 76 });
const side = (n) => ({ ...n, hw: 62 });

const procedure = ['diagnose', 'place', 'plan', 'share', 'review'];
const flow = [...procedure, 'diagnose-place', 'place-plan', 'plan-share', 'share-review'];
const tracks = ['manager', 'specialist', 'review-manager', 'review-specialist'];

export default {
  id: 'nurture',
  order: 9,
  group: 'cross',
  title: tx('기존 상담사 육성', 'Developing Existing Agents'),
  short: tx('기존 상담사 육성', 'Developing agents'),
  subtitle: tx("강점을 데이터로 찾아, 맞는 자리와 길로.", 'Find strengths in the data, then the right work and path.'),
  roles: tx("팀장 · QA · WFM · T&D · HR", 'Team leader · QA · WFM · T&D · HR'),
  procedure,
  diagram: {
    nodes: [
      wide(node('diagnose', '강점 데이터 진단', 84, 24, 'Diagnose strengths')),
      wide(node('place', '강점 자리 배치', 84, 72, 'Place by strength')),
      wide(node('plan', '육성 계획 수립', 84, 120, 'Development plan')),
      wide(node('share', '지식 공유·멘토링', 84, 168, 'Share and mentor')),
      wide(node('review', '성장 리뷰 및 추천', 84, 216, 'Review and recommend')),
      side(node('manager', '관리자 트랙', 284, 176, 'Manager track')),
      side(node('specialist', '전문가 트랙', 284, 216, 'Specialist track')),
    ],
    edges: [
      edge('diagnose', 'place'), edge('place', 'plan'), edge('plan', 'share'), edge('share', 'review'),
      edge('review', 'manager'), edge('review', 'specialist'),
    ],
  },
  steps: [
    step(tx("이 절차의 목적은 이미 현장에서 일하는 상담사의 강점을 데이터로 찾아, 그 강점이 가장 잘 쓰이는 자리와 성장 경로로 이끄는 것입니다. 근속 연수나 콜 수만으로 줄 세우지 않고, 고객 문제를 실제로 해결한 기록과 팀에 보탠 기여를 함께 봅니다. 다섯 단계로 진행하며 여러 팀이 함께 움직입니다.",
      "The purpose of this procedure is to find, from data, the strengths of agents already on the floor, and lead them to the work and the career path where those strengths are used best. Agents are not ranked by tenure or call counts alone; their record of actually solving customers' problems is looked at together with what they add to the team. It runs in five steps, with several teams moving together."),
      flow, procedure, null),
    step(tx("입사 1년 차가 된 지민이 이번 이야기의 주인공입니다. 지민은 스크러빙과 1:1 코칭을 거치며 처리 시간을 줄였고, 이제 다음 단계를 고민하고 있습니다.",
      "Jimin, now in her first full year, is at the center of this story. Through scrubbing and one-on-one coaching she has cut her handle time, and she is now thinking about her next step."),
      flow, [], null),
    step(tx("첫 단계는 강점 데이터 진단입니다. QA는 품질 점수와 CSAT, 스크러빙 기록을, WFM은 처리 시간과 근태 자료를 모아 당신에게 건넵니다. 당신은 최초 해결률(FCR), 고객 만족, 지식 공유 기여를 함께 놓고 지민의 강점을 찾습니다.",
      "The first step is diagnosing strengths from data. QA gathers quality scores, CSAT and scrubbing records, and WFM gathers handle time and attendance, and both hand them to you. You look at first contact resolution (FCR), customer satisfaction and knowledge-sharing contributions together to find Jimin's strengths."),
      flow, ['diagnose'], 'diagnose'),
    step(tx("자료를 보니 지민은 한 번에 해결하는 비율이 높고, 지식 문서에 해결 방법을 자주 남겼습니다. 반면 화가 난 고객을 응대할 때는 시간이 오래 걸렸습니다.",
      "The data shows that Jimin resolves a high share of contacts first time and often writes up solutions in knowledge articles. On the other hand, she takes a long time with angry customers."),
      flow, ['diagnose'], 'diagnose'),
    step(tx("둘째 단계는 강점 자리 배치입니다. 당신은 WFM과 협의해 지민을 강점이 사는 업무에 더 많이 배치합니다. 예를 들어 복합 문의나 채팅처럼 정확한 해결이 중요한 업무입니다.",
      "The second step is placing her where her strengths count. You agree with WFM to give Jimin more of the work where her strengths show. For example, complex inquiries or chat, where an accurate resolution matters."),
      flow, ['place'], 'place'),
    step(tx("셋째 단계는 육성 계획 수립입니다. 당신과 T&D가 지민과 함께 분기 목표 한두 가지를 정하고, 필요한 교육 일정을 잡습니다. 계획은 지민이 직접 고른 방향이어야 오래 갑니다.",
      "The third step is the development plan. You and T&D set one or two goals for the quarter with Jimin and schedule the training she needs. A plan lasts when it follows a direction Jimin chose herself."),
      flow, ['plan'], 'plan'),
    step(tx("넷째 단계는 지식 공유·멘토링입니다. 직무전문가와 T&D가 지민에게 신입 멘토 역할과 지식 문서 검토를 맡깁니다. 자기 노하우를 나누는 경험이 다음 역할의 준비가 됩니다.",
      "The fourth step is knowledge sharing and mentoring. The SME and T&D give Jimin a mentor role for new hires and the review of knowledge articles. Sharing her know-how prepares her for the next role."),
      flow, ['share'], 'share'),
    step(tx("이 시간은 콜을 받지 않는 시간이 아니라 팀 전체의 해결률을 올리는 시간입니다. 그래서 일정에 미리 넣고, 평가에도 팀 기여로 반영합니다.",
      "This time is not time away from contacts; it is time that raises the whole team's resolution rate. So it goes into the schedule in advance and counts as a team contribution in evaluations."),
      flow, ['share'], 'share'),
    step(tx("다섯째 단계는 성장 리뷰 및 추천입니다. 분기마다 당신과 운영 관리자가 데이터와 육성 계획의 결과를 함께 검토합니다. 요건을 채우면 HR에 승진이나 역할 변경을 추천합니다.",
      "The fifth step is the growth review and recommendation. Every quarter, you and the operations manager review the data and the results of the development plan together. When the requirements are met, you recommend a promotion or a change of role to HR."),
      flow, ['review'], 'review'),
    step(tx("성장 경로는 두 갈래일 수 있습니다. 사람을 이끄는 데 강점이 있으면 직무전문가와 팀장으로 가는 관리자 트랙, 고난도 응대나 분석에 강점이 있으면 그 일을 깊게 하는 전문가 트랙입니다. 전문가 트랙을 두는지, 어떤 조건인지는 센터마다 다릅니다.",
      "The path can split in two. Someone whose strength is leading people takes the manager track, toward SME and team leader; someone whose strength is difficult contacts or analysis takes the specialist track, going deeper into that work. Whether a center has a specialist track, and on what terms, differs from center to center."),
      [...flow, ...tracks], ['review', 'manager', 'specialist', 'review-manager', 'review-specialist'], 'review'),
    step(tx("지민은 멘토 경험을 살려 다음 분기 직무전문가 후보로 추천되었습니다. 직급별 조건은 Codex 커리어 매트릭스에서, 다른 길로 떠나는 경우는 상담사 라이프사이클 6단계에서 볼 수 있습니다.",
      "Building on her mentoring, Jimin was recommended as an SME candidate for next quarter. The requirements for each role are in the Codex career matrix, and leaving for another path is covered in stage 6 of the Agent Lifecycle."),
      [...flow, ...tracks], procedure, null),
  ],
  checkpoint: [
    {
      id: 'nurture-q1',
      prompt: tx("지민의 강점을 진단할 때 함께 봐야 할 자료로 가장 알맞은 것은 무엇일까요?", "When diagnosing Jimin's strengths, which data should you look at together?"),
      options: [
        option('a', tx("근속 연수와 하루 콜 수.", "Tenure and calls per day."), tx("근속 연수와 콜 수는 얼마나 오래, 많이 일했는지만 보여 줄 뿐, 고객 문제를 실제로 해결했는지는 알려 주지 않습니다.", "Tenure and call counts only show how long and how much someone has worked; they say nothing about whether customers’ problems were actually solved.")),
        option('b', tx("최초 해결률(FCR), 고객 만족, 지식 공유 기여.", "First contact resolution (FCR), customer satisfaction and knowledge-sharing contributions.")),
        option('c', tx("인사말과 말투 점검 결과.", "Checks on her greetings and tone."), tx("인사말과 말투는 형식을 지켰는지만 보여 줄 뿐, 문제를 해결했는지와 팀에 무엇을 보탰는지는 드러나지 않습니다.", "Greetings and tone only show whether the format was followed; they do not show whether problems were solved or what she added to the team.")),
      ],
      answer: 'b',
      explanation: tx("강점은 고객 문제를 끝까지 해결한 기록과 팀에 보탠 기여에서 보입니다. 여러 팀이 모은 자료를 함께 놓고 봐야 한 가지 숫자에 치우치지 않습니다.", "Strengths show in the record of solving customers' problems to the end and in what someone adds to the team. Looking at data gathered by several teams together keeps you from leaning on a single number."),
    },
    {
      id: 'nurture-q2',
      prompt: tx("지민이 신입 멘토와 지식 문서 검토를 맡는 시간은 어떻게 다뤄야 할까요?", "How should the time Jimin spends mentoring new hires and reviewing knowledge articles be handled?"),
      options: [
        option('a', tx("콜을 받지 않는 시간이니 줄이도록 지도한다.", "Coach her to cut it down, since it is time away from contacts."), tx("이 시간을 줄이면 지민의 노하우가 팀에 퍼지지 않고, 다음 역할을 준비할 기회도 사라집니다.", "Cutting this time keeps Jimin’s know-how from spreading through the team, and takes away her chance to prepare for the next role.")),
        option('b', tx("일정에 미리 넣고, 평가에도 팀 기여로 반영한다.", "Put it in the schedule in advance, and count it as a team contribution in evaluations.")),
        option('c', tx("근무 시간 밖에서 자율로 하게 한다.", "Leave it to her to do on her own time."), tx("근무 시간 밖으로 밀어내면 지민의 부담만 커지고, 기여가 기록에 남지 않아 성장 리뷰의 근거가 되지 못합니다.", "Pushing it outside working hours only adds to Jimin’s load, and her contribution is never recorded, so it cannot support the growth review.")),
      ],
      answer: 'b',
      explanation: tx("지식 공유와 멘토링은 팀 전체의 해결률을 올리는 일입니다. 일정과 평가에 담아야 꾸준히 이어집니다.", "Knowledge sharing and mentoring raise the whole team's resolution rate. They only keep going when they are built into the schedule and the evaluation."),
    },
  ],
  connection: { to: 'launch', text: tx("지금 함께 일하는 상담사가 자라야, 새 프로젝트를 맡길 사람도 생깁니다. 마지막은 신규 프로젝트 론칭입니다.", "The agents working with you now have to grow before there is anyone to hand a new project to. The last one is new project launch.") },
};
