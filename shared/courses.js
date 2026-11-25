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

export const COURSE_INFO = {
  lifecycle: { key: PROGRESS_KEY, lessons: LESSONS, dir: 'agent-lifecycle/' },
  sop: { key: SOP_PROGRESS_KEY, lessons: SOP_LESSONS, dir: 'sop-library/' },
  sme: { key: SME_PROGRESS_KEY, lessons: SME_LESSONS, dir: 'sme/' },
  'sme-lifecycle': { key: SL_PROGRESS_KEY, lessons: SL_LESSONS, dir: 'sme-lifecycle/' },
  'sme-sop': { key: SS_PROGRESS_KEY, lessons: SS_LESSONS, dir: 'sme-sop/' },
};
