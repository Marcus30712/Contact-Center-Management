// Strings and settings that belong to the agent course "상담사 커리어 라이프사이클" (2026-11-26).
// Korean: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md §1.
import { AGENT_UI, AGENT_FIGURE } from '../agent/ui.js';

export const AC_PROGRESS_KEY = 'agent-career:v1';

// Same figures as Agent First Steps: counts and periods carry an "example" label.
export const AC_FIGURE = AGENT_FIGURE;

export const AC_UI = {
  courseTitle: { ko: '상담사 커리어 라이프사이클', en: 'Agent Career Lifecycle' },
  courseTagline: { ko: '실전 배치 뒤 1년쯤 지난 지민과 함께 직무전문가, QA, 트레이너, 팀장의 일을 들여다봅니다. 네 자리는 순서대로 거치는 길이 아니라 서로 다른 길입니다. 마지막은 어느 자리든 공통으로 보는 준비입니다.', en: 'With Jimin, about a year after Go Live, look into the work of an SME, a QA, a trainer and a team leader. The four roles are separate paths, not steps to climb in order. The last lesson is what every role looks for.' },
  listNote: { ko: '레슨에 나오는 기간, 인원, 점수 기준은 예시이며 센터마다 다를 수 있습니다.', en: 'Periods, headcounts and score windows in the lessons are examples and may differ from center to center.' },
  homeCard: { ko: '직무전문가 · QA · 트레이너 · 팀장: 상담사가 지향할 수 있는 다음 자리 미리 보기.', en: 'SME · QA · Trainer · Team leader: a look at the next roles an agent can aim for.' },
  // The ring's centre and the note under it.
  personaName: { ko: '지민', en: 'Jimin' },
  loop: { ko: '어느 길이든 지금의 상담사 자리에서 시작합니다', en: 'Every path starts from where you are now, as an agent' },
  // Lesson-screen labels: the same as Agent First Steps.
  home: AGENT_UI.home,
  checkpoint: AGENT_UI.checkpoint,
  connection: AGENT_UI.connection,
  nextLesson: AGENT_UI.nextLesson,
  toList: AGENT_UI.toList,
  done: AGENT_UI.done,
};
