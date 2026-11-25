// SME SOP 라이브러리's procedures, in the order they are taught. The last one
// leads back to the list ('home').

import approval from './01-approval.js';
import scrubbing from './02-scrubbing.js';
import trend from './03-trend.js';
import attendance from './04-attendance.js';
import huddle from './05-huddle.js';
import calibration from './06-calibration.js';
import voc from './07-voc.js';
import kbrequest from './08-kbrequest.js';

export const SS_LESSONS = [approval, scrubbing, trend, attendance, huddle, calibration, voc, kbrequest];
