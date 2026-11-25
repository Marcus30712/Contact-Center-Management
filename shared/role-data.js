// Words for choosing a role. Korean is the approved copy in
// docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md §2; English follows
// …-sme-course-copy.en.md.
export const ROLE_NAMES = {
  agent: { ko: '상담사 (Agent)', en: 'Agent' },
  sme: { ko: 'SME', en: 'SME' },
  tl: { ko: '팀장 (Team Lead)', en: 'Team Lead' },
  am: { ko: '부매니저 (Assistant Manager)', en: 'Assistant Manager' },
  om: { ko: '매니저 (Operation Manager)', en: 'Operation Manager' },
};

export const ROLE_UI = {
  sheetTitle: { ko: '어떤 자리를 준비하나요?' },
  sheetNote: { ko: '고른 자리에 맞는 강의를 먼저 보여 드려요. 설정에서 언제든 바꿀 수 있어요.' },
  later: { ko: '나중에 고를게요' },
  settingsHeading: { ko: '내 직급' },
  settingsNote: { ko: '고른 직급의 강의가 홈에서 먼저 보여요. 바꿔도 학습 기록은 그대로예요.' },
  preparing: { ko: '{role} 강의는 준비 중이에요. 그동안 Codex에서 이 자리의 역할과 하루를 먼저 볼 수 있어요.' },
  preparingCareer: { ko: '커리어 매트릭스에서 보기 →' },
  preparingDaily: { ko: '직무별 하루 보기 →' },
};
