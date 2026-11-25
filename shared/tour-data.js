// First-run tour wording. The Korean is the confirmed table in
// docs/superpowers/specs/2026-11-21-first-run-tour-design.md; the test
// agent-lifecycle/tests/tour.test.js keeps the two identical.
export const TOUR_KEY = 'queuecraft:tour';

export const TOUR_STEPS = [
  { id: 'home', text: { ko: '홈이에요. 이어서 할 레슨과 내 학습을 여기서 볼 수 있어요.', en: 'This is Home. See the lesson to pick up next and your learning here.' } },
  { id: 'learn', text: { ko: '배우기에는 내 직급 강의와 오늘의 연습, 엑셀 레슨이 있어요.', en: "Learn has your role's courses, Today's Practice and the Excel lessons." } },
  { id: 'guide', text: { ko: '길잡이에서 지금 상황을 고르면 먼저 볼 곳을 알려 드려요.', en: "In Guide, choose your situation and I'll show you where to look first." } },
  { id: 'browse', text: { ko: '찾아보기에는 Codex 원페이저, 인력 산정 실험실, 용어집, 참고 자료가 있어요.', en: 'Browse has the Codex One-Pagers, Staffing Lab, Glossary and References.' } },
  { id: 'settings', text: { ko: '설정에서 언어, 화면 모드, 기록 백업을 바꿀 수 있어요.', en: 'In Settings you can change the language, display mode and progress backup.' } },
];

export const TOUR_UI = {
  skip: { ko: '건너뛰기', en: 'Skip' },
  next: { ko: '다음', en: 'Next' },
  start: { ko: '시작하기', en: 'Get started' },
  replay: { ko: '튜토리얼 다시 보기', en: 'Replay the tutorial' },
};
