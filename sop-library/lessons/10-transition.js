import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// From colleague to team leader: the first 90 days. Not from the Codex; approved
// copy in docs/superpowers/specs/2026-11-22-team-leader-self-copy.md (2026-11-22).
// Main steps run down one column; `wide` gives them room for their names.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ['listen', 'agree', 'act'];
const flow = [...procedure, 'listen-agree', 'agree-act'];
const side = ['review', 'act-review'];

export default {
  id: 'transition',
  order: 6,
  group: 'leader',
  title: tx('동료에서 팀장으로', 'From Colleague to Team Leader'),
  short: tx('첫 90일', 'First 90 days'),
  subtitle: tx("함께 일하던 동료들의 팀장이 된 첫 90일.", "Your first 90 days leading the colleagues you used to work beside."),
  roles: tx('새 팀장, 부매니저', 'New team leader, assistant manager'),
  personaName: tx('하은', 'Haeun'),
  procedure,
  diagram: {
    nodes: [
      wide(node('listen', '듣기', 84, 48, 'Listen')),
      wide(node('agree', '기준 합의', 84, 120, 'Agree on standards')),
      wide(node('act', '실행과 점검', 84, 192, 'Act and check')),
      { ...node('review', '90일 돌아보기', 272, 192, '90-day review'), hw: 62 },
    ],
    edges: [
      edge('listen', 'agree'), edge('agree', 'act'),
      edge('act', 'review'),
    ],
  },
  steps: [
    step(tx("이 절차의 목적은 함께 일하던 동료들의 팀장이 되었을 때, 신뢰를 잃지 않고 팀을 이끄는 자리로 옮겨 가는 것입니다. 새 팀장과 그를 맡은 부매니저가 따릅니다. 세 단계로 진행합니다.", "This procedure exists to move you, once you lead the colleagues you used to work beside, into the role of leading the team without losing their trust. The new team leader and the assistant manager responsible for them follow it. It runs in three steps."),
      flow, procedure, null),
    step(tx("오늘부터 당신은 같은 팀에서 함께 상담하던 동료들의 팀장입니다. 어제까지 점심을 같이 먹던 사이라, 모두가 당신이 어떻게 달라질지 지켜보고 있습니다.", "From today you lead the colleagues you used to take contacts beside on the same team. Until yesterday you had lunch together, so everyone is watching how you will change."),
      flow, [], null),
    step(tx("첫 단계는 듣기입니다(예시: 첫 30일). 바로 바꾸지 말고 팀원마다 1:1로 만나, 지금 무엇이 잘 되고 무엇이 힘든지 묻습니다.", "The first step is listening (Example: first 30 days). Do not change things right away; meet each team member one on one and ask what is going well now and what is hard."),
      flow, ['listen'], null),
    step(tx("물려받은 규칙과 지시도 먼저 지켜보며 왜 그렇게 하는지 이해합니다. 이유를 모르고 바꾸면 팀원들은 새 팀장이 현장을 모른다고 느낍니다.", "Watch the rules and instructions you inherited first, and understand why they are done that way. Change them without knowing why, and the team feels the new leader does not know the floor."),
      flow, ['listen'], null),
    step(tx("부매니저와는 팀장에게 무엇을 기대하는지, 어디까지 혼자 정해도 되는지를 먼저 맞춥니다.", "With your assistant manager, agree first on what they expect of a team leader and how far you can decide on your own."),
      flow, ['listen'], null),
    step(tx("둘째 단계는 기준 합의입니다(예시: 31~60일). 근태, 품질, 도움을 요청하는 방법처럼 팀이 함께 지킬 기준을 팀원들과 이야기해 정하고, 모두에게 똑같이 적용한다고 분명히 말합니다.", "The second step is agreeing on standards (Example: days 31 to 60). Talk with the team to set the standards it will keep together, such as attendance, quality and how to ask for help, and say clearly that they apply to everyone the same way."),
      flow, ['agree'], null),
    step(tx("가까웠던 동료일수록 더 조심합니다. 가장 친했던 하은을 감싸거나, 반대로 일부러 더 엄하게 대하면 팀 전체가 공정하지 않다고 느낍니다.", "The closer the colleague, the more care it takes. Shield Haeun, your closest colleague, or treat her harder on purpose, and the whole team feels things are not fair."),
      flow, ['agree'], 'agree'),
    step(tx("셋째 단계는 실행과 점검입니다(예시: 61~90일). 1:1 코칭과 팀 허들을 정해진 리듬으로 돌리고, 바꾸고 싶은 절차는 팀원과 상의한 뒤 하나씩 바꿉니다.", "The third step is acting and checking (Example: days 61 to 90). Run one-on-one coaching and team huddles on a set rhythm, and change the procedures you want to change one at a time, after talking them over with the team."),
      flow, ['act'], null),
    step(tx("실수를 하면 먼저 인정합니다. 새 팀장이 실수를 감추면 팀원들도 실수를 숨기기 시작합니다.", "When you make a mistake, own it first. When a new team leader hides mistakes, the team starts hiding theirs too."),
      flow, ['act'], null),
    step(tx("90일이 되면 부매니저와 함께 돌아봅니다. 팀원들의 이야기와 팀 지표를 같이 보고, 다음 90일에 무엇을 할지 정합니다.", "At 90 days, look back together with your assistant manager. Review what the team members say and the team's metrics side by side, and decide what to do in the next 90 days."),
      [...flow, ...side], ['act', 'review', 'act-review'], null),
  ],
  checkpoint: [
    {
      id: 'transition-q1',
      prompt: tx("팀장이 된 첫 주, 물려받은 절차 하나가 비효율적으로 보입니다. 먼저 할 일은 무엇일까요?", "In your first week as team leader, one inherited procedure looks inefficient. What should you do first?"),
      options: [
        option('a', tx("오늘 바로 새 방식으로 바꾼다.", "Switch to a new way today."), tx("이유를 모른 채 바꾸면 팀원들은 상의 없이 정했다고 느끼고, 원래 그 절차가 막던 문제가 다시 생길 수 있습니다.", "Changing it without knowing why makes the team feel it was decided without them, and the problem the procedure was preventing can come back.")),
        option('b', tx("팀원들과 이야기하며 왜 그렇게 해 왔는지 먼저 이해한다.", "Talk with the team and first understand why it has been done that way.")),
        option('c', tx("문제를 알지만 90일이 지날 때까지 아무 말도 하지 않는다.", "Know the problem but say nothing until 90 days have passed."), tx("듣는 기간은 묻고 이해하는 기간입니다. 알게 된 문제를 덮어 두면 팀원들은 말해도 소용없다고 여깁니다.", "The listening period is for asking and understanding. Bury a problem you have found, and the team decides that speaking up is pointless.")),
      ],
      answer: 'b',
      explanation: tx("첫 단계에서는 바꾸기보다 듣고 이해합니다. 이유를 알고 팀원과 상의한 변경이어야 받아들여집니다.", "In the first step you listen and understand rather than change. A change is accepted when you know the reason and have talked it over with the team."),
    },
    {
      id: 'transition-q2',
      prompt: tx("가장 친했던 하은이 지각을 되풀이합니다. 어떻게 하는 것이 좋을까요?", "Haeun, your closest colleague, keeps arriving late. What is the best way to handle it?"),
      options: [
        option('a', tx("친한 사이니 이번에는 넘어간다.", "You are close, so let it go this time."), tx("한 사람에게만 기준이 느슨하면 다른 팀원들은 기준이 사람에 따라 다르다고 느낍니다.", "When the standard is looser for one person, the rest of the team feels the standard depends on who you are.")),
        option('b', tx("다른 팀원과 같은 기준으로, 1:1에서 차분히 이야기한다.", "Talk with her calmly in a one-on-one, by the same standard as everyone else.")),
        option('c', tx("다른 팀원들 앞에서 엄하게 지적해 본보기로 삼는다.", "Call her out sternly in front of the team to make an example of her."), tx("공개적으로 지적하면 당사자는 상처를 받고, 팀은 친했던 사이를 일부러 끊는다고 읽습니다.", "Calling her out in public hurts her, and the team reads it as you cutting off the friendship on purpose.")),
      ],
      answer: 'b',
      explanation: tx("합의한 기준은 누구에게나 똑같이, 그러나 존중하는 방식으로 적용합니다.", "Apply the agreed standards the same way to everyone, but in a way that shows respect."),
    },
  ],
  connection: { to: 'onboarding', text: tx("여기까지가 팀장이 직접 하는 여섯 가지 절차입니다. 다음부터는 여러 팀이 함께 움직이는 절차입니다. 첫 번째는 신규 입사자 온보딩입니다.", "These are the six procedures a team leader runs directly. From here on, the procedures are ones several teams run together. The first is new hire onboarding.") },
};
