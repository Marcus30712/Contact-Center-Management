// Strings and settings that belong to the agent course "상담사 SOP 라이브러리" (2026-11-27).
// Korean: docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md §1 (and .en.md).
import { AGENT_UI, AGENT_FIGURE } from '../agent/ui.js';

export const AS_PROGRESS_KEY = 'agent-sop:v1';

// Same figures as Agent First Steps: counts and times carry an "example" label.
export const AS_FIGURE = AGENT_FIGURE;

export const AS_UI = {
  courseTitle: { ko: '상담사 SOP 라이브러리', en: 'Agent SOP Library' },
  courseTagline: { ko: '상담사가 매일 마주치는 표준 절차 8개를 순서대로 배웁니다. 같은 절차를 직무전문가와 팀장이 어떻게 이어받는지도 함께 봅니다.', en: 'Learn the eight standard procedures an agent meets every day, in order. See how the SME and the Team Leader pick up each one, too.' },
  listNote: { ko: '숫자가 붙은 시간과 횟수는 예시이며, 실제 값은 센터마다 정합니다.', en: 'Times and counts with numbers are examples; each center sets its own values.' },
  // The same line as the agent home card (role-home HOME_COPY.agentSop); a test keeps them equal.
  homeCard: { ko: '에스컬레이션부터 시스템 장애까지, 상담사가 따르는 표준 절차 8개.', en: 'From escalations to system outages: the eight standard procedures an agent follows.' },
  rolesLabel: { ko: '누가', en: 'Who' },
  // Lesson-screen labels: as Agent First Steps, but the next lesson is the next SOP.
  home: { ko: '목록', en: 'All SOPs' },
  checkpoint: AGENT_UI.checkpoint,
  connection: AGENT_UI.connection,
  nextLesson: { ko: '다음 SOP', en: 'Next SOP' },
  toList: AGENT_UI.toList,
  done: AGENT_UI.done,
};
