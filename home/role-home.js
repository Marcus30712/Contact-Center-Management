// What home shows for each role (2026-11-25): one guide card and the Learn
// cards. A card without href is "coming soon". Wording: docs/superpowers/specs/2026-11-25-role-home-copy.md.
import { ROLE_SHORT } from '../shared/role-data.js';
import { EXCEL_UI } from '../excel/data.js';
import { SME_UI } from '../sme/ui.js';
import { AS_UI } from '../agent-sop/ui.js';
import { GUIDE_CARD, LEARN } from './data.js';

export const HOME_COPY = {
  soonMark: { ko: '준비 중', en: 'Coming soon' },
  soonText: { ko: '준비 중이에요. 그동안 Codex에서 {직급}의 역할과 하루를 먼저 볼 수 있어요.', en: 'Coming soon. Meanwhile, the Codex shows the {role} role and a day in it.' },
  soonCareer: { ko: '커리어 매트릭스 →', en: 'Career matrix →' },
  soonDaily: { ko: '직무별 하루 →', en: 'Day by role →' },
  guideTitle: { ko: '어디서부터 볼까요? · {직급} 상황별 길잡이', en: 'Where to start? · {role} Situation Guide' },
  firstSteps: { ko: '{직급} 첫걸음', en: '{role} First Steps' },
  sopLibrary: { ko: '{직급} SOP 라이브러리', en: '{role} SOP Library' },
  supportLifecycle: {
    title: { ko: '직무전문가 서포트 라이프사이클', en: 'SME Support Lifecycle' },
    text: { ko: '교육 중인 상담사부터 선임, 팀장까지, 단계마다 직무전문가가 따르는 지원 절차.', en: 'The support procedure an SME follows at each stage, from agents in training to seniors and the team leader.' },
  },
  smeSop: {
    title: { ko: '직무전문가 SOP 라이브러리', en: 'SME SOP Library' },
    text: { ko: '직무전문가가 따르는 표준 절차 8개를 순서대로 배웁니다.', en: 'Learn the eight standard procedures an SME follows, in order.' },
  },
  // The agent SOP card reads the course's own words; a test keeps them equal to the copy doc.
  agentSop: { title: AS_UI.courseTitle, text: AS_UI.homeCard },
  excelSme: { ko: '직무전문가가 꼭 쓰는 엑셀 11가지를 눌러서 익힙니다.', en: 'The 11 Excel skills SMEs use most, learned by tapping.' },
  excelShared: { ko: '컨택센터에서 꼭 쓰는 엑셀 11가지를 눌러서 익힙니다.', en: 'The 11 Excel skills used most in a contact center, learned by tapping.' },
  startExcel: { ko: '처음이라면 미소의 엑셀 연습 레슨 1부터 시작해 보세요.', en: "New here? Start with lesson 1 of Miso's Excel Practice." },
};

// "{직급}" in Korean and "{role}" in English become the role's short name.
export function withRole(text, role) {
  return { ko: text.ko.replace('{직급}', ROLE_SHORT[role].ko), en: text.en.replace('{role}', ROLE_SHORT[role].en) };
}

const byHref = (href) => LEARN.find((c) => c.href === href);
const excel = (text) => ({ id: 'excel', href: './excel/', title: EXCEL_UI.homeCard, text });
// A card not built yet: its own text, or the shared "see the Codex" line with links.
const soon = (id, title, text = null) => ({ id, href: null, title, text, codex: !text });

export function homeFor(role) {
  if (role === 'tl') {
    return {
      guide: { id: 'guide', ...GUIDE_CARD },
      learn: [
        { id: 'tl', ...byHref('./tl/') },
        { id: 'lifecycle', ...byHref('./agent-lifecycle/') },
        { id: 'tl-support', ...byHref('./tl-support/') },
        { id: 'sop', ...byHref('./sop-library/') },
        excel(EXCEL_UI.homeCardLine),
      ],
    };
  }
  const guide = soon('guide', withRole(HOME_COPY.guideTitle, role));
  if (role === 'sme') {
    // The SME guide is built (2026-11-25): same card line as TL's.
    const smeGuide = { id: 'guide', href: './sme-guide/', title: withRole(HOME_COPY.guideTitle, role), text: GUIDE_CARD.text };
    return {
      guide: smeGuide,
      learn: [
        { id: 'sme', ...byHref('./sme/') },
        { id: 'sme-lifecycle', ...byHref('./sme-lifecycle/') },
        { id: 'sme-sop', ...byHref('./sme-sop/') },
        excel(HOME_COPY.excelSme),
      ],
    };
  }
  if (role === 'agent') {
    // Agent First Steps and Agent Career Lifecycle (2026-11-26), the Agent SOP Library and the agent guide (2026-11-27) are built.
    const agentGuide = { id: 'guide', href: './agent-guide/', title: withRole(HOME_COPY.guideTitle, role), text: GUIDE_CARD.text };
    return {
      guide: agentGuide,
      learn: [{ id: 'agent', ...byHref('./agent/') }, { id: 'agent-career', ...byHref('./agent-career/') }, { id: 'agent-sop', ...byHref('./agent-sop/') }, excel(HOME_COPY.excelShared)],
    };
  }
  if (role === 'am') {
    // AM First Steps is built (2026-11-28); the AM SOP library and guide are still coming.
    return {
      guide,
      learn: [{ id: 'am', ...byHref('./am/') }, soon('sop', withRole(HOME_COPY.sopLibrary, role)), excel(HOME_COPY.excelShared)],
    };
  }
  return {
    guide,
    learn: [soon('first-steps', withRole(HOME_COPY.firstSteps, role)), soon('sop', withRole(HOME_COPY.sopLibrary, role)), excel(HOME_COPY.excelShared)],
  };
}
