// 상담사 커리어 라이프사이클's lessons, bottom to top of the operations-team ladder
// (2026-11-26): getting ready for SME, the SME role, getting ready for team leader,
// the team leader role. The last one leads back to the list ('home').
// The QA and trainer lessons (hidden-qa.js, hidden-trainer.js) are kept but hidden
// at the user's request; progress already saved for them stays untouched.

import ready from './01-ready.js';
import sme from './02-sme.js';
import tlprep from './03-tlprep.js';
import tl from './04-tl.js';

export const AC_LESSONS = [ready, sme, tlprep, tl];
