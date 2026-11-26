// Wording for the home screen. Korean is the approved copy in
// docs/superpowers/specs/2026-11-20-app-shell-design.md (§4.3); card texts
// are the ones the hub already used.
export const HOME_UI = {
  brand: BRAND,
  title: BRAND,
  tagline: {
    ko: '그때 알았더라면 좋았을 컨택센터 이야기를, 상담사부터 매니저까지 자리별로 모았습니다.',
    en: "The contact center lessons I wish I'd known back then, gathered role by role from agent to manager.",
  },
  greeting: { ko: '안녕하세요, 김미소예요. 오늘도 조금씩 같이 가 봐요.', en: "Hi, I'm Miso Kim. Let's take another small step together today." },
  misoRole: { ko: '새 자리를 준비하는 사람을 돕는 선배 매니저', en: 'A senior manager who helps people get ready for a new role' },
  misoAlt: { ko: '김미소, 활짝 웃는 얼굴', en: 'Miso Kim, smiling broadly' },
  myLearning: { ko: '내 학습', en: 'My learning' },
  continue: { ko: '이어서:', en: 'Next:' },
  allDone: { ko: '다 마쳤어요. 필요한 레슨은 언제든 다시 볼 수 있어요.', en: "You've finished everything. Come back to any lesson whenever you need it." },
  courseDone: { ko: '다 마침', en: 'Done' },
  review: { ko: '다시 보기', en: 'Review' },
  learn: { ko: '배우기', en: 'Learn' },
  browse: { ko: '찾아보기', en: 'Browse' },
  install: {
    ko: '휴대폰 홈 화면에 추가하면 앱처럼 쓰고 오프라인에서도 볼 수 있어요. (아이폰: 공유 → 홈 화면에 추가)',
    en: 'Add this to your phone\'s home screen to use it like an app, even offline. (iPhone: Share → Add to Home Screen)',
  },
  privacy: { ko: '개인정보처리방침', en: 'Privacy Policy' },
  lifecycle: { ko: '상담사 라이프사이클', en: 'The Agent Lifecycle' },
  sop: { ko: '팀장 SOP 라이브러리', en: 'TL SOP Library' },
  lessonWord: { ko: '레슨', en: 'Lesson' },
};

import { EXCEL_UI } from '../excel/data.js';
import { SME_UI } from '../sme/ui.js';
import { SL_UI } from '../sme-lifecycle/ui.js';
import { SS_UI } from '../sme-sop/ui.js';
import { TL_UI } from '../tl/ui.js';
import { TS_UI } from '../tl-support/ui.js';
import { roleOf } from '../shared/role.js';
import { BRAND } from '../shared/brand.js';

// A course card can name the role it is written for; home puts that role's cards first.
const forRole = (role, c) => ({ ...c, role });
const card = (href, ko, en, textKo, textEn) => ({ href, title: { ko, en }, text: { ko: textKo, en: textEn } });

export const GUIDE_CARD = card('./guide/', '어디서부터 볼까요? · 팀장 상황별 길잡이', 'Where to start? · TL Situation Guide',
  '지금 겪는 상황을 고르면 먼저 볼 곳을 알려 드립니다.', "Pick the situation you're in and see where to look first.");

export const LEARN = [
  forRole(roleOf('tl'), { href: './tl/', title: TL_UI.courseTitle, text: TL_UI.homeCard }),
  forRole(roleOf('lifecycle'), card('./agent-lifecycle/', '상담사 라이프사이클', 'The Agent Lifecycle',
    '신입 팀장을 위한 6단계 강의: 채용부터 경력 개발까지.', 'A six-stage course for new team leaders, from hiring to career growth.')),
  forRole(roleOf('tl-support'), { href: './tl-support/', title: TS_UI.courseTitle, text: TS_UI.homeCard }),
  forRole(roleOf('sop'), card('./sop-library/', '팀장 SOP 라이브러리', 'TL SOP Library',
    "팀장이 알아야 할 절차 10개를 순서대로 배웁니다: 에스컬레이션, 스크러빙, 1:1 코칭, PIP, 캘리브레이션, 동료에서 팀장으로, 온보딩, 대규모 이슈 대응, 기존 상담사 육성, 신규 프로젝트 론칭.",
    "Learn ten procedures a team leader needs to know, step by step: escalation, scrubbing, 1:1 coaching, PIP, calibration, from colleague to team leader, onboarding, large-scale issue response, developing existing agents, new project launch.")),
  { href: './excel/', title: EXCEL_UI.homeCard, text: EXCEL_UI.homeCardLine },
  forRole(roleOf('sme'), { href: './sme/', title: SME_UI.courseTitle, text: SME_UI.homeCard }),
  forRole(roleOf('sme-lifecycle'), { href: './sme-lifecycle/', title: SL_UI.courseTitle, text: SL_UI.homeCard }),
  forRole(roleOf('sme-sop'), { href: './sme-sop/', title: SS_UI.courseTitle, text: SS_UI.homeCard }),
];

export const BROWSE = [
  card('./codex/', 'Codex 원페이저', 'Codex One-Pagers',
    '운영 최적화 원칙, 5대 핵심팀, 커리어 매트릭스, 직무별 하루를 한 장씩 봅니다.', 'The optimization principles, five core teams, career matrix and a day in each role, one page each.'),
  card('./staffing-calculator/', '인력 산정 실험실', 'Staffing Lab',
    '문의량, 처리 시간, 인원, Shrinkage를 움직여 보며 필요한 인원을 익힙니다.', 'Move volume, handle time, headcount and Shrinkage to see how required staff is worked out.'),
  card('./glossary/', '용어집', 'Glossary',
    'AHT, Shrinkage, 직무전문가 같은 운영 용어를 한국어와 영어로 찾아봅니다.', 'Look up operations terms in Korean and English.'),
  card('./references/', '참고 자료', 'References',
    'CX 2회차의 바탕 자료와 참고한 공개 자료.', 'What CX Replay is built on.'),
];
