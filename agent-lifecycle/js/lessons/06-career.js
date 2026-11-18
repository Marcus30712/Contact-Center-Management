import { tx, node, edge, step, option } from './build.js';

const paths = ['agent', 'agent-qa', 'qa', 'agent-trainer', 'trainer', 'agent-lead', 'lead', 'agent-wfm', 'wfm'];
const exit = [...paths, 'agent-exit', 'exit'];
const all = [...exit, 'exit-improve', 'improve'];

export default {
  id: 'career',
  order: 6,
  title: tx('경력 개발 및 전환·퇴사', 'Career Development and Offboarding'),
  short: tx('경력', 'Career'),
  subtitle: tx('경력을 넓히거나, 잘 마무리합니다.', 'Growing a career, or ending it well.'),
  diagram: {
    nodes: [
      node('agent', '상담사', 58, 96, 'Agent'),
      node('qa', 'QA', 196, 26, 'QA'),
      node('trainer', '교육 강사', 196, 72, 'Trainer'),
      node('lead', '팀 리더', 196, 118, 'Team leader'),
      node('wfm', 'WFM', 196, 164, 'WFM'),
      node('exit', '퇴사 면담', 58, 212, 'Exit interview'),
      node('improve', '채용·관리 개선', 250, 212, 'Hiring fixes'),
    ],
    edges: [
      edge('agent', 'qa'), edge('agent', 'trainer'), edge('agent', 'lead'), edge('agent', 'wfm'),
      edge('agent', 'exit'), edge('exit', 'improve'),
    ],
  },
  steps: [
    step(tx('마지막 단계에는 두 갈래가 있습니다. 상담사로서의 경력을 넓히는 길과, 잘 마무리하고 떠나는 길입니다.', 'The last stage has two branches. One is growing a career beyond taking calls, and the other is leaving on good terms.'),
      ['agent'], ['agent'], 'agent'),
    step(tx('먼저 경력 경로입니다. 상담 업무에서 QA(품질 관리자), 교육 강사, 팀 리더, WFM(인력 관리자)으로 승진하거나 직무를 바꿀 기회를 줍니다.', 'Start with career paths. Agents get the chance to be promoted or to move into roles such as QA (quality analyst), trainer, team leader, or WFM (workforce management).'),
      paths, ['qa', 'trainer', 'lead', 'wfm'], 'agent'),
    step(tx('이런 길이 있다는 것을 상담사가 스스로 알기는 어렵습니다. 경로를 보여 주고 연결해 주는 것이 팀장의 몫입니다.', 'Agents rarely find out on their own that these paths exist. Showing the paths and making the connection is the team leader’s part.'),
      paths, ['agent'], 'agent'),
    step(tx('당신은 코칭 때 적어 둔 메모를 꺼냅니다. 지민에게 QA 직무를 제안하고, 지민은 QA 담당으로 자리를 옮깁니다.', 'You pull out the note you made during coaching. You suggest the QA role to Jimin, and she moves over as a QA analyst.'),
      paths, ['qa', 'agent-qa'], 'qa'),
    step(tx('같은 시기에 지민의 입사 동기 한 사람은 퇴사를 결정합니다. 모든 사람이 남지는 않습니다. 이때 할 일이 퇴사 면담입니다.', 'Around the same time, someone who joined with Jimin decides to resign. Not everyone stays. What you do then is the exit interview.'),
      exit, ['exit', 'agent-exit'], 'qa'),
    step(tx('퇴사 면담에서는 떠나는 사람과 깊이 이야기합니다. 조직의 문제점, 급여, 업무 환경에서 고칠 점을 찾아냅니다.', 'In an exit interview you talk in depth with the person who is leaving. You look for what should be fixed in the organization, in pay, and in working conditions.'),
      exit, ['exit'], 'qa'),
    step(tx('동기는 입사 전에 교대 근무가 이렇게 잦은 줄 몰랐다고 말합니다. 이것은 첫 단계의 현실적 직무 안내(RJP)가 고쳐야 할 내용입니다.', 'The colleague says they did not know before joining that shift work would be this frequent. That is something the realistic job preview (RJP) in the first stage needs to fix.'),
      all, ['exit', 'exit-improve', 'improve'], 'qa'),
    step(tx('면담에서 나온 개선점은 다음 채용과 관리 과정에 반영합니다. 라이프사이클은 여기서 끝나지 않고 처음으로 돌아갑니다. QA가 된 지민은 이제 다음 신입의 콜을 듣습니다.', 'The improvements found in the interview go into the next round of hiring and management. The lifecycle does not end here but returns to the start. Jimin, now in QA, listens to the next new hire’s calls.'),
      all, ['improve', 'qa'], 'qa'),
  ],
  checkpoint: [{
    id: 'career-q1',
    prompt: tx('퇴사 면담에서 "입사 전에 들은 설명과 실제 근무가 달랐다"는 말이 나왔습니다. 무엇을 할까요?', 'In an exit interview you hear, “What I was told before joining was different from the actual job.” What do you do?'),
    options: [
      option('a', tx('어차피 떠나는 사람이니 기록만 남겨 둔다.', 'The person is leaving anyway, so just file a record.')),
      option('b', tx('채용 담당자에게 전달해 직무 안내 내용을 고치게 한다.', 'Pass it to the recruiter so the job preview gets corrected.')),
      option('c', tx('남은 팀원들을 불러 같은 불만이 있는지 따져 묻는다.', 'Call in the remaining team members and press them on whether they feel the same.')),
    ],
    answer: 'b',
    explanation: tx('퇴사 면담의 목적은 개선점을 찾아 다음 채용과 관리에 반영하는 것입니다. 기록만 남기면 다음 신입도 같은 이유로 떠납니다. 지민의 동기가 남긴 말이 다음 지원자가 듣는 직무 안내를 바꿉니다.', 'The purpose of an exit interview is to find improvements and feed them into the next hiring and management cycle. If you only file a record, the next new hire leaves for the same reason. What Jimin’s colleague said changes the job preview the next applicant hears.'),
  }],
  connection: {
    to: 'hiring',
    text: tx('퇴사 면담의 교훈은 채용 공고와 직무 안내를 바꿉니다. 그렇게 뽑힌 다음 신입이 다시 첫 단계에서 출발합니다. 여섯 단계는 한 줄이 아니라 하나의 원입니다.', 'Lessons from exit interviews change the job posting and the job preview. The next new hire, chosen that way, starts again at the first stage. The six stages are not a line but a circle.'),
  },
};
