// Strings and settings that belong to the SOP Library course. Buttons such
// as Back/Next come from the shared interface strings.
export const SOP_PROGRESS_KEY = 'sop-library:v1';

// Figures that need an "example" label in this course: the shared units plus
// scores (점 / points).
// A number right after a letter (L2, Q1) is a name, not a figure.
export const SOP_FIGURE = /%|(?<![A-Za-z])\d\s*(분|명|초|점|min|people|sec|points?)/;

export const SOP_UI = {
  courseTitle: { ko: 'SOP 라이브러리', en: 'SOP Library' },
  courseTagline: { ko: '팀장이 알아야 할 절차를 순서대로.', en: 'The procedures a team leader needs to know, in order.' },
  listNote: {
    ko: '팀장이 알아야 할 표준 운영 절차(SOP)를 한 단계씩 따라가 봅니다. 숫자가 붙은 시간과 건수는 예시이며, 실제 값은 센터마다 정합니다.',
    en: 'Walk through the standard operating procedures (SOPs) a team leader needs to know, one step at a time. Times and counts given as numbers are examples; each center sets its own.',
  },
  home: { ko: '목록', en: 'All SOPs' },
  checkpoint: { ko: '팀장 체크포인트', en: 'Team leader checkpoint' },
  connection: { ko: '다음으로', en: 'Up next' },
  nextLesson: { ko: '다음 SOP', en: 'Next SOP' },
  toList: { ko: '목록으로', en: 'Back to the list' },
  done: { ko: '완료', en: 'Done' },
  rolesLabel: { ko: '누가', en: 'Who' },
  groupLeader: { ko: '팀장이 직접 하는 절차', en: 'Procedures the team leader runs' },
  groupCross: { ko: '여러 팀이 함께 하는 절차', en: 'Procedures several teams run together' },
};
