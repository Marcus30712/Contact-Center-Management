// Strings and settings that belong to the course "팀장 첫걸음" (2026-11-25).
// Copy: docs/superpowers/specs/2026-11-25-tl-course-copy-ko.md §1 (and .en.md).
import { SME_FIGURE } from '../sme/ui.js';

export const TL_PROGRESS_KEY = 'tl-course:v1';

// Same figures rule as the SME courses: counts and times carry an "example" label.
export const TL_FIGURE = SME_FIGURE;

export const TL_UI = {
  courseTitle: { ko: '팀장 첫걸음', en: 'TL First Steps' },
  courseTagline: { ko: '막 팀장이 된 사람을 위한 7개 레슨입니다. 팀을 운영하기 전에 팀원과 팀을 하나부터 열까지 파악하고, 첫 계획을 세우는 순서를 배웁니다.', en: 'Seven lessons for people who have just become Team Leaders. Learn, in order, how to get to know your team members and team inside out before running it, and how to make your first plan.' },
  listNote: { ko: '레슨에 나오는 인원, 건수, 기간은 예시이며 센터마다 다를 수 있습니다.', en: 'Headcounts, counts and periods in the lessons are examples and may differ from center to center.' },
  homeCard: { ko: '막 팀장이 된 사람을 위한 7개 레슨: 팀 파악부터 첫 운영 계획까지.', en: 'Seven lessons for new Team Leaders, from getting to know the team to the first operating plan.' },
  // Home's first-visit line for a team leader.
  startNote: { ko: '처음이라면 팀장 첫걸음 레슨 1부터 시작해 보세요.', en: 'New here? Start with TL First Steps lesson 1.' },
  // Lesson-screen labels.
  home: { ko: '목록', en: 'All lessons' },
  checkpoint: { ko: '팀장 체크포인트', en: 'Team Leader checkpoint' },
  connection: { ko: '다음으로', en: 'Up next' },
  nextLesson: { ko: '다음 레슨', en: 'Next lesson' },
  toList: { ko: '목록으로', en: 'Back to the list' },
  done: { ko: '완료', en: 'Done' },
};
