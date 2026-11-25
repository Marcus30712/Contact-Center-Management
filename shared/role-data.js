// Words for choosing a role. Korean is the approved copy in
// docs/superpowers/specs/2026-11-25-sme-course-copy-ko.md §2; English follows
// …-sme-course-copy.en.md.
export const ROLE_NAMES = {
  agent: { ko: '상담사 (Agent)', en: 'Agent' },
  sme: { ko: 'SME', en: 'SME' },
  tl: { ko: 'TL · 팀장', en: 'TL · Team Lead' },
  am: { ko: 'AM · 부매니저', en: 'AM · Assistant Manager' },
  om: { ko: 'OM · 매니저', en: 'OM · Operation Manager' },
};

// Short names for labels and titles (2026-11-25, role-home-copy).
export const ROLE_SHORT = {
  agent: { ko: '상담사', en: 'Agent' },
  sme: { ko: 'SME', en: 'SME' },
  tl: { ko: 'TL', en: 'TL' },
  am: { ko: 'AM', en: 'AM' },
  om: { ko: 'OM', en: 'OM' },
};

export const ROLE_UI = {
  sheetTitle: { ko: '어떤 자리를 준비하나요?', en: 'Which role are you preparing for?' },
  sheetNote: { ko: '고른 자리에 맞는 강의를 먼저 보여 드려요. 설정에서 언제든 바꿀 수 있어요.', en: "We'll show the course for that role first. You can change it in Settings any time." },
  later: { ko: '나중에 고를게요', en: "I'll choose later" },
  settingsHeading: { ko: '내 직급', en: 'My role' },
  settingsNote: { ko: '고른 직급의 강의가 홈에서 먼저 보여요. 바꿔도 학습 기록은 그대로예요.', en: "Your role's course shows first on the home screen. Changing it keeps your learning records." },
  preparing: { ko: '{role} 강의는 준비 중이에요. 그동안 Codex에서 이 자리의 역할과 하루를 먼저 볼 수 있어요.', en: "The {role} course is coming soon. Meanwhile, you can see this role's work and day in the Codex." },
  preparingCareer: { ko: '커리어 매트릭스에서 보기 →', en: 'See it in the career matrix →' },
  preparingDaily: { ko: '직무별 하루 보기 →', en: 'See the day by role →' },
};
