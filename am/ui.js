// Strings and settings that belong to the course "부매니저 첫걸음" (2026-11-28).
// Copy: docs/superpowers/specs/2026-11-28-am-course-copy-ko.md §1 (and .en.md).
import { SME_FIGURE } from '../sme/ui.js';

export const AM_PROGRESS_KEY = 'am-course:v1';

// Same figures rule as the other role courses: counts and times carry an "example" label.
export const AM_FIGURE = SME_FIGURE;

export const AM_UI = {
  courseTitle: { ko: '부매니저 첫걸음', en: 'AM First Steps' },
  courseTagline: { ko: '막 부매니저가 된 사람을 위한 8개 레슨입니다. 여러 마켓의 팀장을 이끌고, 매니저의 일을 나눠 맡으며 다음 자리를 준비하는 길을 민석의 자리에서 따라갑니다.', en: 'Eight lessons for people who have just become assistant managers. Follow Minseok as he leads Team Leaders across several markets, takes on part of the manager\'s work and gets ready for the next role.' },
  listNote: { ko: '레슨에 나오는 인원, 건수, 기간, 지표는 예시이며 센터마다 다를 수 있습니다.', en: 'Headcounts, counts, periods and metrics in the lessons are examples and may differ from center to center.' },
  homeCard: { ko: '막 부매니저가 된 사람을 위한 8개 레슨: 팀장들을 이끌고 매니저를 돕기까지.', en: 'Eight lessons for new assistant managers, from leading Team Leaders to backing up the manager.' },
  // Home's first-visit line for an AM.
  startNote: { ko: '처음이라면 부매니저 첫걸음 레슨 1부터 시작해 보세요.', en: 'New here? Start with AM First Steps lesson 1.' },
  // Lesson-screen labels.
  home: { ko: '목록', en: 'All lessons' },
  checkpoint: { ko: '부매니저 체크포인트', en: 'AM checkpoint' },
  connection: { ko: '다음으로', en: 'Up next' },
  nextLesson: { ko: '다음 레슨', en: 'Next lesson' },
  toList: { ko: '목록으로', en: 'Back to the list' },
  done: { ko: '완료', en: 'Done' },
};
