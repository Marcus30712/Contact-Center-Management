// Strings and settings that belong to the SME course "SME 첫걸음" (2026-11-25).
// Korean: docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md §3.
import { SOP_FIGURE } from '../sop-library/ui.js';

export const SME_PROGRESS_KEY = 'sme-course:v1';

// Same figures as the SOP Library: counts and minutes carry an "example" label.
export const SME_FIGURE = SOP_FIGURE;

export const SME_UI = {
  courseTitle: { ko: 'SME 첫걸음', en: 'SME First Steps' },
  courseTagline: { ko: '상담사에서 SME가 된 사람을 위한 7개 레슨입니다. 첫날부터 팀에 지식을 돌려주는 일까지 순서대로 배웁니다.', en: 'Seven lessons for agents who have just become SMEs, in order from the first day to giving knowledge back to the team.' },
  listNote: { ko: '레슨에 나오는 인원, 건수, 시간은 예시이며 센터마다 다를 수 있습니다.', en: 'Headcounts, counts and times in the lessons are examples and may differ from center to center.' },
  homeCard: { ko: '막 SME가 된 사람을 위한 7개 레슨: 첫날부터 팀에 지식 돌려주기까지.', en: 'Seven lessons for new SMEs, from the first day to giving knowledge back to the team.' },
  // Lesson-screen labels, matched to the SOP Library's (copy §3 'Lesson screen'; owner to confirm).
  home: { ko: '목록', en: 'All lessons' },
  checkpoint: { ko: 'SME 체크포인트', en: 'SME checkpoint' },
  connection: { ko: '다음으로', en: 'Up next' },
  nextLesson: { ko: '다음 레슨', en: 'Next lesson' },
  toList: { ko: '목록으로', en: 'Back to the list' },
  done: { ko: '완료', en: 'Done' },
};
