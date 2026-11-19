// The SOP Library's lessons, in the order they are taught. To add an SOP,
// add a file here and to this list; the last lesson's connection leads to
// 'home' (the list).
import escalation from './01-escalation.js';
import coaching from './02-coaching.js';
import pip from './03-pip.js';
import calibration from './04-calibration.js';
import onboarding from './05-onboarding.js';
import incident from './06-incident.js';
import launch from './07-launch.js';

// group: 'leader' = the team leader runs it; 'cross' = several teams run it together.
export const SOP_LESSONS = [escalation, coaching, pip, calibration, onboarding, incident, launch];
