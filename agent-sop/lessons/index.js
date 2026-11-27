// 상담사 SOP 라이브러리's procedures, in the order they are taught. The last one
// leads back to the list ('home').

import request from './01-request.js';
import abuse from './02-abuse.js';
import absence from './03-absence.js';
import huddle from './04-huddle.js';
import kbreport from './05-kbreport.js';
import scrubfb from './06-scrubfb.js';
import dispute from './07-dispute.js';
import outage from './08-outage.js';

export const AS_LESSONS = [request, abuse, absence, huddle, kbreport, scrubfb, dispute, outage];
