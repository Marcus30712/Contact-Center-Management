// Strings and settings that belong to the course "팀장 서포트 라이프사이클" (2026-11-25).
// Copy: docs/superpowers/specs/2026-11-25-tl-support-copy-ko.md §1 (and .en.md).
import { TL_UI, TL_FIGURE } from '../tl/ui.js';

export const TS_PROGRESS_KEY = 'tl-support:v1';

export const TS_FIGURE = TL_FIGURE;

export const TS_UI = {
  courseTitle: { ko: '팀장 서포트 라이프사이클', en: 'TL Support Lifecycle' },
  courseTagline: { ko: '팀장이 함께 일하는 상담사, 직무전문가, QA, 트레이너를 각각 어떻게 지원하는지 배웁니다. 역할마다 무엇을 맡기고, 무엇을 받고, 언제 개입하는지 봅니다.', en: 'Learn how a team leader supports each role they work with: agents, SMEs, QA and trainers. For each role, see what to hand over, what to get back and when to step in.' },
  listNote: { ko: '레슨에 나오는 기간, 건수, 횟수는 예시이며 센터마다 다를 수 있습니다.', en: 'Periods, counts and frequencies in the lessons are examples and may differ from center to center.' },
  homeCard: { ko: '상담사부터 직무전문가, QA, 트레이너까지, 팀장이 역할마다 따르는 지원 절차.', en: 'The support procedure a team leader follows for each role, from agents to SMEs, QA and trainers.' },
  // The ring's centre and the note under it.
  personaName: { ko: '팀장', en: 'Team leader' },
  loop: { ko: '팀 전체를 본 뒤 다시 한 사람씩', en: 'After the whole team, back to one person at a time' },
  // Lesson-screen labels: the same as TL First Steps.
  home: TL_UI.home,
  checkpoint: TL_UI.checkpoint,
  connection: TL_UI.connection,
  nextLesson: TL_UI.nextLesson,
  toList: TL_UI.toList,
  done: TL_UI.done,
};
