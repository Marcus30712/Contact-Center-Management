// SME 서포트 라이프사이클's lessons, in the order an agent grows. The last one
// leads back to the list ('home').

import trainee from './01-trainee.js';
import graduate from './02-graduate.js';
import regular from './03-regular.js';
import senior from './04-senior.js';
import leadsupport from './05-leadsupport.js';

export const SL_LESSONS = [trainee, graduate, regular, senior, leadsupport];
