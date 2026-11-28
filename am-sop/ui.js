// Strings and settings that belong to the AM course "부매니저 SOP 라이브러리" (2026-11-28).
// Korean: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md §1 (and .en.md).
import { AM_UI, AM_FIGURE } from '../am/ui.js';

export const AMS_PROGRESS_KEY = 'am-sop:v1';

// Same figures as AM First Steps: counts and times carry an "example" label.
export const AMS_FIGURE = AM_FIGURE;

export const AMS_UI = {
  courseTitle: { ko: "부매니저 SOP 라이브러리", en: "AM SOP Library" },
  courseTagline: { ko: "부매니저가 매주·매달 되풀이하는 표준 절차 8개를 순서대로 배웁니다. 팀장에게서 받고 매니저에게 넘기는 길을 함께 봅니다.", en: "Learn the eight standard procedures an assistant manager repeats every week and month, in order. See the path from team leaders up to the manager, too." },
  listNote: { ko: "숫자가 붙은 시간, 기한, 횟수는 예시이며, 실제 값은 센터마다 정합니다.", en: "Times, deadlines and counts with numbers are examples; each center sets its own values." },
  // The same line as the AM home card (role-home HOME_COPY.amSop); a test keeps them equal.
  homeCard: { ko: "주간 성과 미팅부터 매니저 대행까지, 부매니저가 따르는 표준 절차 8개.", en: "From the weekly performance meeting to covering for the manager: the eight standard procedures an AM follows." },
  rolesLabel: { ko: '누가', en: 'Who' },
  // Lesson-screen labels: as AM First Steps, but the next lesson is the next SOP.
  home: { ko: '목록', en: 'All SOPs' },
  checkpoint: AM_UI.checkpoint,
  connection: AM_UI.connection,
  nextLesson: { ko: '다음 SOP', en: 'Next SOP' },
  toList: AM_UI.toList,
  done: AM_UI.done,
};
