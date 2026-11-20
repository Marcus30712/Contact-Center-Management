// Wording for the Staffing Lab, in both languages. Korean is the approved
// source text; edit it here and run `npm test` in agent-lifecycle/.
// {name} marks a number filled in from the calculation.

export const STAFFING_TEXT = {
  title: { ko: '인력 산정 실험실', en: 'Staffing Lab' },
  back: { ko: 'Queuecraft', en: 'Queuecraft' },
  intro: {
    ko: '문의량, 처리 시간, 인원, Shrinkage를 움직여 보며 필요한 인원이 어떻게 정해지는지 익히는 연습 화면입니다.',
    en: 'A practice screen: move volume, handle time, headcount and Shrinkage to see how the staff you need is worked out.',
  },
  exampleNote: {
    ko: '아래 값은 연습을 위한 예시 값입니다. 우리 센터의 값으로 바꿔 보세요.',
    en: 'The values below are example values for practice. Change them to your own center\'s values.',
  },
  inputsHeading: { ko: '움직여 보는 값', en: 'Values to move' },
  resultsHeading: { ko: '결과', en: 'Results' },
  label: {
    volume: { ko: '문의량', en: 'Contact volume' },
    aht: { ko: '평균 처리 시간 (AHT)', en: 'Average handle time (AHT)' },
    rostered: { ko: '편성 인원', en: 'Rostered staff' },
    planned: { ko: '계획된 Shrinkage', en: 'Planned Shrinkage' },
    unplanned: { ko: '계획되지 않은 Shrinkage', en: 'Unplanned Shrinkage' },
    target: { ko: '목표 응답 시간', en: 'Target answer time' },
  },
  hint: {
    volume: { ko: '30분 동안 들어오는 문의 수입니다.', en: 'Contacts arriving in 30 minutes.' },
    aht: { ko: '문의 한 건을 처리하는 데 걸리는 평균 시간입니다.', en: 'The average time it takes to handle one contact.' },
    rostered: { ko: '이 시간대 근무표에 있는 상담사 수입니다.', en: 'Agents on the schedule for this time slot.' },
    planned: { ko: '휴식, 교육, 회의처럼 미리 계획된 시간입니다.', en: 'Time planned in advance, such as breaks, training and meetings.' },
    unplanned: { ko: '결근, 지각, 병가처럼 계획되지 않은 시간입니다.', en: 'Time that is not planned, such as absence, lateness and sick leave.' },
    target: { ko: '이 시간 안에 응답하는 것을 목표로 합니다.', en: 'The aim is to answer within this time.' },
  },
  unit: {
    count: { ko: '건', en: ' contacts' },
    min: { ko: '분', en: ' min' },
    people: { ko: '명', en: ' people' },
    percent: { ko: '%', en: '%' },
    sec: { ko: '초', en: ' sec' },
  },
  seated: { ko: '자리에 있는 인원', en: 'Staff at their desks' },
  seatedHint: {
    ko: '편성 인원에서 Shrinkage만큼을 뺀, 실제로 문의를 받을 수 있는 인원입니다.',
    en: 'Rostered staff less Shrinkage: the people who can actually take contacts.',
  },
  seatedLine: {
    ko: '편성 {rostered}명 중 {seated}명이 실제로 문의를 받습니다.',
    en: '{seated} of the {rostered} rostered actually take contacts.',
  },
  serviceLevel: { ko: '서비스 레벨', en: 'Service level' },
  serviceLevelHint: {
    ko: '목표 시간 안에 응답한 문의의 비율입니다.',
    en: 'The share of contacts answered within the target time.',
  },
  wait: { ko: '평균 대기 시간', en: 'Average wait' },
  waitHint: {
    ko: '문의 한 건이 응답을 받을 때까지 기다리는 평균 시간입니다.',
    en: 'The average time a contact waits before it is answered.',
  },
  occupancy: { ko: '점유율 (Occupancy)', en: 'Occupancy' },
  occupancyHint: {
    ko: '자리에 있는 시간 가운데 문의를 응대하는 데 쓰는 비율입니다. 너무 높으면 숨 돌릴 틈이 없습니다.',
    en: 'The share of desk time spent handling contacts. When it runs too high, there is no breathing room.',
  },
  occupancyShort: { ko: '점유율', en: 'Occupancy' },
  required: { ko: '필요한 인원', en: 'Staff needed' },
  requiredLine: {
    ko: '서비스 레벨 80%(예시 목표)를 맞추려면 자리에 {seated}명, Shrinkage를 반영해 편성은 {rostered}명이 필요합니다.',
    en: 'To reach a service level of 80% (example target) you need {seated} at their desks, which means rostering {rostered} once Shrinkage is allowed for.',
  },
  gapShort: { ko: '{n}명 부족', en: '{n} short' },
  gapExact: { ko: '딱 맞음', en: 'Exactly enough' },
  gapSpare: { ko: '{n}명 여유', en: '{n} to spare' },
  overload: {
    ko: '대기가 계속 쌓입니다. 인원을 늘리거나 문의량·처리 시간을 줄여 보세요.',
    en: 'The queue keeps growing. Add staff, or lower the volume or the handle time.',
  },
  legendBusy: { ko: '응대 중', en: 'Handling contacts' },
  legendIdle: { ko: '대기 중', en: 'Ready and waiting' },
  legendPlanned: { ko: '계획된 Shrinkage', en: 'Planned Shrinkage' },
  legendUnplanned: { ko: '계획되지 않은 Shrinkage', en: 'Unplanned Shrinkage' },
  pictureSummary: {
    ko: '편성 {rostered}명 가운데 {seated}명이 자리에 있고, 그중 {busy}명쯤이 응대 중입니다.',
    en: 'Of {rostered} rostered, {seated} are at their desks and about {busy} of them are handling contacts.',
  },
  tryHeading: { ko: '이렇게 해 보세요', en: 'Try this' },
  try1: {
    ko: '편성 인원을 1명씩 줄여 보세요. 서비스 레벨이 어디서 급하게 떨어지나요?',
    en: 'Lower the rostered staff one person at a time. Where does the service level drop sharply?',
  },
  try2: {
    ko: '계획되지 않은 Shrinkage를 10%p 올려 보세요. 필요한 편성 인원이 몇 명 늘어나나요?',
    en: 'Raise unplanned Shrinkage by 10 points. How many more people do you need to roster?',
  },
  try3: {
    ko: '평균 처리 시간을 30초 늘려 보세요. 통화가 조금 길어졌을 뿐인데 무엇이 달라지나요?',
    en: 'Add 30 seconds to the average handle time. Contacts are only a little longer, so what changes?',
  },
  limitsHeading: { ko: '이 계산의 한계', en: 'Limits of this calculation' },
  limits: {
    ko: '이 화면은 Erlang C라는 계산 방식을 씁니다. 고객이 끊지 않고 끝까지 기다린다고 가정하므로 실제보다 대기를 길게 볼 수 있습니다. 연습용이며, 실제 인원 계획은 WFM 담당자와 확인하세요.',
    en: 'This screen uses a method called Erlang C. It assumes customers never hang up while waiting, so it can show longer waits than you would really see. It is for practice; check real staffing plans with your WFM team.',
  },
  countryNote: {
    ko: '근무 시간과 휴식에 관한 법과 제도는 국가마다 다를 수 있습니다.',
    en: 'Laws and regulations on working hours and breaks can differ from country to country.',
  },
  credit: {
    ko: '계산 방식은 pyworkforce(MIT 라이선스, © Rodrigo Arenas)를 참고했고 결과를 그것과 대조했습니다.',
    en: 'The calculation follows pyworkforce (MIT license, © Rodrigo Arenas), and the results are checked against it.',
  },
  creditLink: { ko: '참고 자료 보기', en: 'See references' },
  glossaryLink: { ko: '용어집에서 보기', en: 'In the glossary' },
};

// Which glossary card each number or slider links to.
export const GLOSSARY_LINKS = {
  seated: 'shrinkage',
  serviceLevel: 'service-level',
  wait: 'asa',
  occupancy: 'occupancy',
  required: 'fte',
  aht: 'aht',
  planned: 'planned-shrinkage',
  unplanned: 'unplanned-shrinkage',
  limits: 'wfm',
};

export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));
}
