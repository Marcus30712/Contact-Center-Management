// Strings and settings that belong to the course "상담사 첫걸음" (2026-11-26).
// Copy: docs/superpowers/specs/2026-11-26-agent-course-copy-ko.md §1 (and .en.md).
import { SME_FIGURE } from '../sme/ui.js';

export const AGENT_PROGRESS_KEY = 'agent-course:v1';

// Same figures rule as the other role courses: counts and times carry an "example" label.
export const AGENT_FIGURE = SME_FIGURE;

export const AGENT_UI = {
  courseTitle: { ko: '상담사 첫걸음', en: 'Agent First Steps' },
  courseTagline: { ko: '막 상담사가 된 사람을 위한 8개 레슨입니다. 첫 출근부터 업무에 익숙해지는 반년까지, 지민의 자리에서 함께 따라갑니다.', en: 'Eight lessons for people who have just become agents. Follow Jimin from the first day at work to feeling at home in the job half a year later.' },
  listNote: { ko: '레슨에 나오는 인원, 건수, 기간은 예시이며 센터마다 다를 수 있습니다.', en: 'Headcounts, counts and periods in the lessons are examples and may differ from center to center.' },
  homeCard: { ko: '막 상담사가 된 사람을 위한 8개 레슨: 첫 출근부터 익숙해지기까지.', en: 'Eight lessons for new agents, from the first day at work to feeling at home in the job.' },
  // Home's first-visit line for an agent.
  startNote: { ko: '처음이라면 상담사 첫걸음 레슨 1부터 시작해 보세요.', en: 'New here? Start with Agent First Steps lesson 1.' },
  // Lesson-screen labels.
  home: { ko: '목록', en: 'All lessons' },
  checkpoint: { ko: '상담사 체크포인트', en: 'Agent checkpoint' },
  connection: { ko: '다음으로', en: 'Up next' },
  nextLesson: { ko: '다음 레슨', en: 'Next lesson' },
  toList: { ko: '목록으로', en: 'Back to the list' },
  done: { ko: '완료', en: 'Done' },
};
