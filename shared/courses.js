// The courses a role learns, in one place: where each keeps its progress,
// its lessons and its folder. Home and the review quiz both read this list;
// which role each course belongs to comes from ROLE_COURSES (shared/role.js).
import { PROGRESS_KEY } from '../agent-lifecycle/js/engine/progress.js';
import { LESSONS } from '../agent-lifecycle/js/lessons/index.js';
import { SOP_LESSONS } from '../sop-library/lessons/index.js';
import { SOP_PROGRESS_KEY } from '../sop-library/ui.js';
import { SME_LESSONS } from '../sme/lessons/index.js';
import { SME_PROGRESS_KEY } from '../sme/ui.js';
import { SL_LESSONS } from '../sme-lifecycle/lessons/index.js';
import { SL_PROGRESS_KEY } from '../sme-lifecycle/ui.js';
import { SS_LESSONS } from '../sme-sop/lessons/index.js';
import { SS_PROGRESS_KEY } from '../sme-sop/ui.js';
import { TL_LESSONS } from '../tl/lessons/index.js';
import { TL_PROGRESS_KEY } from '../tl/ui.js';
import { TS_LESSONS } from '../tl-support/lessons/index.js';
import { TS_PROGRESS_KEY } from '../tl-support/ui.js';
import { AGENT_LESSONS } from '../agent/lessons/index.js';
import { AGENT_PROGRESS_KEY } from '../agent/ui.js';
import { AC_LESSONS } from '../agent-career/lessons/index.js';
import { AC_PROGRESS_KEY } from '../agent-career/ui.js';

export const COURSE_INFO = {
  agent: { key: AGENT_PROGRESS_KEY, lessons: AGENT_LESSONS, dir: 'agent/' },
  'agent-career': { key: AC_PROGRESS_KEY, lessons: AC_LESSONS, dir: 'agent-career/' },
  tl: { key: TL_PROGRESS_KEY, lessons: TL_LESSONS, dir: 'tl/' },
  lifecycle: { key: PROGRESS_KEY, lessons: LESSONS, dir: 'agent-lifecycle/' },
  'tl-support': { key: TS_PROGRESS_KEY, lessons: TS_LESSONS, dir: 'tl-support/' },
  sop: { key: SOP_PROGRESS_KEY, lessons: SOP_LESSONS, dir: 'sop-library/' },
  sme: { key: SME_PROGRESS_KEY, lessons: SME_LESSONS, dir: 'sme/' },
  'sme-lifecycle': { key: SL_PROGRESS_KEY, lessons: SL_LESSONS, dir: 'sme-lifecycle/' },
  'sme-sop': { key: SS_PROGRESS_KEY, lessons: SS_LESSONS, dir: 'sme-sop/' },
};
