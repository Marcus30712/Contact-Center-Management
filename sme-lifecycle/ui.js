// Strings and settings that belong to the SME course "직무전문가 서포트 라이프사이클" (2026-11-25).
// Korean: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md §1.
import { SME_UI, SME_FIGURE } from '../sme/ui.js';

export const SL_PROGRESS_KEY = 'sme-lifecycle:v1';

// Same figures as SME First Steps: counts and times carry an "example" label.
export const SL_FIGURE = SME_FIGURE;

export const SL_UI = {
  courseTitle: { ko: '직무전문가 서포트 라이프사이클', en: 'SME Support Lifecycle' },
  courseTagline: { ko: '교육 중인 상담사가 정식 상담사, 선임으로 자라는 단계마다 직무전문가가 따르는 지원 절차를 배웁니다. 마지막은 팀장 지원입니다.', en: 'Learn the support procedure an SME follows at each stage as agents grow from training to regular and senior. The last stage is supporting the Team Leader.' },
  listNote: { ko: '레슨에 나오는 기간, 건수, 시간은 예시이며 센터마다 다를 수 있습니다.', en: 'Periods, counts and times in the lessons are examples and may differ from center to center.' },
  // The same line as the SME home card (role-home copy §3); a test keeps them equal.
  homeCard: { ko: '교육 중인 상담사부터 선임, 팀장까지, 단계마다 직무전문가가 따르는 지원 절차.', en: 'The support procedure an SME follows at each stage, from agents in training to seniors and the Team Leader.' },
  // The ring's centre and the note under it.
  personaName: { ko: '서준', en: 'Seojun' },
  loop: { ko: '새 교육 기수가 오면 다시 1단계부터', en: 'When a new training class arrives, start again at stage 1' },
  // Lesson-screen labels: the same as SME First Steps.
  home: SME_UI.home,
  checkpoint: SME_UI.checkpoint,
  connection: SME_UI.connection,
  nextLesson: SME_UI.nextLesson,
  toList: SME_UI.toList,
  done: SME_UI.done,
};
