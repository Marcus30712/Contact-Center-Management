import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// Main steps run down one column; `wide` gives them room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['prep', 'score', 'session', 'consensus', 'followup'];
const flow = [...procedure, 'prep-score', 'score-session', 'session-consensus', 'consensus-followup'];
const branch = ['training', 'followup-training'];

export default {
  id: 'calibration',
  order: 4,
  group: 'leader',
  title: tx('캘리브레이션', 'Calibration'),
  short: tx('캘리브레이션', 'Calibration'),
  subtitle: tx('평가자끼리 기준의 눈높이를 맞춥니다.', 'Evaluators align on a shared standard.'),
  roles: tx('QA · SME · 팀장', 'QA · SME · Team leader'),
  procedure,
  diagram: {
    nodes: [
      wide(node('prep', '사전 준비', 84, 24, 'Preparation')),
      wide(node('score', '독립 평가', 84, 72, 'Individual scoring')),
      wide(node('session', '교정 세션', 84, 120, 'Calibration session')),
      wide(node('consensus', '합의 및 결정', 84, 168, 'Consensus and decision')),
      wide(node('followup', '후속 조치 및 공유', 84, 216, 'Follow-up and sharing')),
      node('training', '추가 교육·공지', 270, 216, 'Training or notice'),
    ],
    edges: [
      edge('prep', 'score'), edge('score', 'session'), edge('session', 'consensus'), edge('consensus', 'followup'),
      edge('followup', 'training'),
    ],
  },
  steps: [
    step(tx('이 절차의 목적은 상담 품질 평가의 일관성과 공정성을 지키는 것입니다. QA, SME, 팀장이 정기적으로 모여 평가 기준의 눈높이를 맞춥니다. 다섯 단계로 진행합니다.', 'This procedure exists to keep quality evaluation consistent and fair. QA, SMEs, and team leaders meet regularly to align on the evaluation standard. It runs in five steps.'),
      flow, procedure, null),
    step(tx('지민은 이제 QA입니다. 이번 세션은 지민이 진행하고, 당신은 참석자입니다.', 'Jimin is in QA now. She runs this session, and you take part.'),
      flow, [], null),
    step(tx('첫 단계는 사전 준비입니다. 지민은 세션 2~3일 전에 논의할 만한 녹취나 티켓을 몇 건 고릅니다. 점수 차이가 클 것 같은 건이나 최근 이슈와 관련된 건이 좋습니다.', 'The first step is preparation. Two or three days before the session, Jimin picks a few recordings or tickets worth discussing. Good choices are ones where scores are likely to differ widely or that relate to a recent issue.'),
      flow, ['prep'], 'prep'),
    step(tx('지민은 고른 케이스와 평가 양식을 참석자 모두에게 보내고, 세션 전까지 각자 따로 평가를 마쳐 달라고 요청합니다.', 'Jimin sends the chosen cases and the evaluation form to everyone taking part, and asks each of them to finish scoring on their own before the session.'),
      flow, ['prep'], 'prep'),
    step(tx('둘째 단계는 독립 평가입니다. 당신은 케이스를 직접 듣고, 품질 평가 기준표(Scorecard)에 따라 점수를 매기고 이유를 자세히 적습니다. 다른 사람의 점수를 보기 전에 합니다.', 'The second step is individual scoring. You listen to each case yourself, score it against the quality scorecard, and write down your reasons in detail. You do this before seeing anyone else\'s scores.'),
      flow, ['score'], 'score'),
    step(tx('셋째 단계는 교정 세션입니다. 첫 케이스부터 각자 매긴 총점과 이유를 공유합니다. 점수가 갈린 항목을 두고 왜 차이가 났는지 깊이 토론합니다.', 'The third step is the calibration session. Starting with the first case, everyone shares their total score and their reasons. You discuss in depth why the scores differed on the items where they split.'),
      flow, ['session'], 'session'),
    step(tx('토론은 이런 질문으로 엽니다. "이 부분에서 \'공감\' 항목에 만점을 주신 이유는 무엇인가요?" 누가 맞았는지가 아니라 기준을 어떻게 읽었는지를 묻는 것입니다.', 'The discussion opens with a question like this. "What led you to give a perfect score for \'empathy\' here?" The question is about how each person read the standard, not about who was right.'),
      flow, ['session'], 'session'),
    step(tx('넷째 단계는 합의 및 결정입니다. 충분히 토론한 뒤 항목별 최종 점수에 합의합니다. 합의한 점수가 그 케이스의 공식 점수가 됩니다.', 'The fourth step is consensus and decision. After enough discussion, you agree on a final score for each item. The agreed score becomes the official score for that case.'),
      flow, ['consensus'], 'consensus'),
    step(tx('지민은 왜 그 점수로 합의했는지 근거와 논의 내용을 자세히 기록합니다. 이 기록이 앞으로 비슷한 케이스를 평가할 때 기준이 됩니다.', 'Jimin records in detail why that score was agreed and what was discussed. This record becomes the reference for evaluating similar cases later.'),
      flow, ['consensus'], 'consensus'),
    step(tx('다섯째 단계는 후속 조치 및 공유입니다. 지민은 세션이 끝나고 하루 안에 케이스별 최종 점수, 주요 논의 내용, 합의한 기준을 정리해 참석자와 관련자에게 공유합니다.', 'The fifth step is follow-up and sharing. Within a day of the session, Jimin writes up the final score for each case, the main points discussed, and the agreed standard, and shares it with those who took part and others concerned.'),
      flow, ['followup'], 'followup'),
    step(tx('세션에서 드러난 공통적인 실수나 오해는 교육 담당과 팀장이 전체 상담사 대상 추가 교육이나 공지로 이어 갑니다. 맞춘 기준이 현장에 닿아야 캘리브레이션이 끝납니다.', 'Common mistakes or misunderstandings that surfaced in the session are carried on by the training team and the team leaders, as extra training or a notice for all agents. Calibration is finished only when the aligned standard reaches the floor.'),
      [...flow, ...branch], ['followup', ...branch], 'followup'),
  ],
  checkpoint: [
    {
      id: 'calibration-q1',
      prompt: tx('왜 모이기 전에 각자 따로 채점할까요?', 'Why does everyone score separately before meeting?'),
      options: [
        option('a', tx('세션 시간을 줄이기 위해서.', 'To make the session shorter.'), tx('시간을 줄이려고 함께 채점하면 점수가 서로 닮아 가, 정작 맞춰야 할 기준의 차이가 가려집니다.', 'Scoring together to save time makes the scores drift toward each other and hides the very differences in standards you need to align.')),
        option('b', tx('다른 사람의 점수에 영향받지 않은 각자의 기준이 드러나야 차이를 이야기할 수 있어서.', 'Because the gaps can only be discussed once each person\'s own standard shows, unaffected by anyone else\'s score.')),
        option('c', tx('평가자들의 순위를 매기기 위해서.', 'To rank the evaluators.'), tx('평가자를 줄 세우는 자리가 되면 솔직한 점수가 나오지 않아, 기준을 맞출 수 없습니다.', 'If the session ranks the evaluators, people stop giving honest scores, and the standards cannot be aligned.')),
      ],
      answer: 'b',
      explanation: tx('함께 들으며 채점하면 점수가 서로 비슷해져 기준의 차이가 보이지 않습니다. 따로 매긴 점수의 차이가 토론의 재료입니다.', 'When people score while listening together, the scores drift toward each other and the differences in standard cannot be seen. The gaps between separate scores are the material for the discussion.'),
    },
    {
      id: 'calibration-q2',
      prompt: tx('세션에서 합의한 점수는 어떻게 쓰일까요?', 'What happens to the score agreed in the session?'),
      options: [
        option('a', tx('참고용으로만 남긴다.', 'It is kept for reference only.'), tx('참고용으로만 남기면 다음 평가에서 각자 원래 기준으로 돌아가 같은 차이가 다시 생깁니다.', 'Keeping it only for reference sends everyone back to their own standard at the next evaluation, and the same gap returns.')),
        option('b', tx('그 케이스의 공식 점수가 되고, 합의한 근거는 기록해 다음 평가의 기준으로 삼는다.', 'It becomes the official score for the case, and the reasoning is recorded as the reference for later evaluations.')),
        option('c', tx('직급이 가장 높은 참석자의 점수로 바꾼다.', 'It is replaced by the score of the most senior person present.'), tx('직급으로 점수를 정하면 토론한 근거가 사라지고, 다음 세션에서 아무도 의견을 내지 않게 됩니다.', 'Settling the score by rank throws away the reasons discussed, and at the next session nobody speaks up.')),
      ],
      answer: 'b',
      explanation: tx('합의한 점수와 그 근거가 기록으로 남아야 다음에 비슷한 케이스를 같은 눈높이로 평가할 수 있습니다.', 'Only when the agreed score and its reasoning are on record can similar cases be evaluated to the same standard next time.'),
    },
  ],
  connection: { to: 'onboarding', text: tx('여기까지가 팀장이 직접 하는 네 가지 절차입니다. 다음부터는 여러 팀이 함께 움직이는 절차입니다. 첫 번째는 신규 입사자 온보딩입니다.', 'These are the four procedures a team leader runs directly. From here on, the procedures are ones several teams run together. The first is new hire onboarding.') },
};
