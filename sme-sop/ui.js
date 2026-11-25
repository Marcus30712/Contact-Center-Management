// Strings and settings that belong to the SME course "SME SOP 라이브러리" (2026-11-25).
// Korean: docs/superpowers/specs/2026-11-25-sme-sop-copy-ko.md §1.
import { SME_UI, SME_FIGURE } from '../sme/ui.js';

export const SS_PROGRESS_KEY = 'sme-sop:v1';

// Same figures as the other SME courses: counts and times carry an "example" label.
export const SS_FIGURE = SME_FIGURE;

export const SS_UI = {
  courseTitle: { ko: 'SME SOP 라이브러리', en: 'SME SOP Library' },
  courseTagline: { ko: 'SME가 맡는 표준 절차 8개를 순서대로 배웁니다. 팀장 SOP와 같은 절차는 SME가 맡는 부분만 다룹니다.', en: "Learn the eight standard procedures an SME runs, in order. Where a procedure is also in the team leader's SOP Library, only the SME's part is covered." },
  listNote: { ko: '숫자가 붙은 시간과 건수는 예시이며, 실제 값은 센터마다 정합니다.', en: 'Times and counts with numbers are examples; each center sets its own values.' },
  // The same line as the SME home card (role-home copy §3); a test keeps them equal.
  homeCard: { ko: 'SME가 따르는 표준 절차 8개를 순서대로 배웁니다.', en: 'Learn the eight standard procedures an SME follows, in order.' },
  rolesLabel: { ko: '누가', en: 'Who' },
  // Lesson-screen labels: as SME First Steps, but the next lesson is the next SOP.
  home: SME_UI.home,
  checkpoint: SME_UI.checkpoint,
  connection: SME_UI.connection,
  nextLesson: { ko: '다음 SOP', en: 'Next SOP' },
  toList: SME_UI.toList,
  done: SME_UI.done,
};
