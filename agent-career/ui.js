// Strings and settings that belong to the agent course "상담사 커리어 라이프사이클" (2026-11-26).
// Korean: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md §1.
import { AGENT_UI, AGENT_FIGURE } from '../agent/ui.js';

export const AC_PROGRESS_KEY = 'agent-career:v1';

// Same figures as Agent First Steps: counts and periods carry an "example" label.
export const AC_FIGURE = AGENT_FIGURE;

export const AC_UI = {
  courseTitle: { ko: '상담사 커리어 라이프사이클', en: 'Agent Career Lifecycle' },
  courseTagline: { ko: '실전 배치 뒤 1년쯤(예시) 지난 지민과 함께 운영팀에서 한 단계씩 오르는 길을 봅니다. 직무전문가와 팀장은 하는 일도, 그 자리로 가기 전에 필요한 준비도 다릅니다.', en: 'With Jimin, about a year after Go Live (Example), look at the path up the operations team, one step at a time. An SME and a Team Leader do different work, and each role takes different preparation to reach.' },
  listNote: { ko: '레슨에 나오는 기간, 인원, 점수 기준은 예시이며 센터마다 다를 수 있습니다.', en: 'Periods, headcounts and score windows in the lessons are examples and may differ from center to center.' },
  homeCard: { ko: '상담사 → 직무전문가 → 팀장: 운영팀에서 한 단계씩 오르는 길과 단계마다 다른 준비.', en: 'Agent → SME → Team Leader: the path up the operations team, with different preparation at each step.' },
  personaName: { ko: '지민', en: 'Jimin' },
  // 2026-11-26: the first screen is an operations-team ladder instead of the ring.
  // Rungs bottom to top: the agent's place now, then each prep step beside the climb to the next role.
  ladder: {
    team: { ko: '운영팀', en: 'Operations team' },
    here: { ko: '상담사 · 지민 (지금)', en: 'Agent · Jimin (now)' },
    roles: ['sme', 'tl'],
    prep: { sme: 'ready', tl: 'tlprep' },
  },
  // Lesson-screen labels: the same as Agent First Steps.
  home: AGENT_UI.home,
  checkpoint: AGENT_UI.checkpoint,
  connection: AGENT_UI.connection,
  nextLesson: AGENT_UI.nextLesson,
  toList: AGENT_UI.toList,
  done: AGENT_UI.done,
};
