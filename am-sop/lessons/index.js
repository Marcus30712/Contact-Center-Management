// 부매니저 SOP 라이브러리's procedures, in the order they are taught. The last one
// leads back to the list ('home').

import weekly from './01-weekly.js';
import instructions from './02-instructions.js';
import escalation from './03-escalation.js';
import risk from './04-risk.js';
import review from './05-review.js';
import requests from './06-requests.js';
import backup from './07-backup.js';
import cover from './08-cover.js';

export const AMS_LESSONS = [weekly, instructions, escalation, risk, review, requests, backup, cover];
