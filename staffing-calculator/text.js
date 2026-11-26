// Wording for the Staffing Lab, in both languages. Korean is the approved
// source text; edit it here and run `npm test` in agent-lifecycle/.
// {name} marks a number filled in from the calculation.
import { BRAND } from '../shared/brand.js';

export const STAFFING_TEXT = {
  title: { ko: '인력 산정 실험실', en: 'Staffing Lab' },
  back: BRAND,
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

// Channel comparison wording. Korean is the approved copy
// (docs/superpowers/specs/2026-11-21-staffing-channels-copy.md), English follows
// the .en.md doc; tests compare both. Wording shared with the 30-minute practice
// (Shrinkage, AHT, target, gaps, notes) is read from STAFFING_TEXT, not copied.
export const CHANNEL_TEXT = {
  tabsLabel: { ko: "실험실 화면", en: "Lab screens" },
  tabPractice: { ko: "30분 연습", en: "30-minute practice" },
  tabChannels: { ko: "채널 비교", en: "Channel comparison" },
  channelsIntro: { ko: "전화·채팅·이메일을 나란히 놓고, 센터 전체로 필요한 인원과 근무 시간, 추가근무를 계산해 보는 연습 화면입니다.", en: "A practice screen: set phone, chat and email side by side and work out the staff, working hours and overtime the whole center needs." },
  commonHeading: { ko: "센터 공통 값", en: "Center-wide values" },
  pickHeading: { ko: "비교할 채널", en: "Channels to compare" },
  pickNote: { ko: "센터에서 운영하는 채널만 켜세요. 한 채널은 남겨 두어야 합니다.", en: "Turn on only the channels your center runs. At least one channel stays on." },
  editHeading: { ko: "값을 고칠 채널", en: "Channel to edit" },
  channel: {
    phone: { ko: "전화", en: "Phone" },
    chat: { ko: "채팅", en: "Chat" },
    email: { ko: "이메일", en: "Email" },
  },
  label: {
    weeklyHours: { ko: "1인 주간 근무 시간", en: "Weekly hours per agent" },
    dailyVolume: { ko: "하루 문의량", en: "Daily contact volume" },
    concurrency: { ko: "동시 처리 수", en: "Concurrent chats" },
    hoursOpen: { ko: "하루 운영 시간", en: "Hours open per day" },
    daysOpen: { ko: "주 운영 일수", en: "Days open per week" },
    current: { ko: "지금 편성 인원", en: "Current rostered staff" },
  },
  hint: {
    weeklyHours: { ko: "상담사 한 명이 일주일에 근무하는 계약 시간입니다.", en: "The contracted hours one agent works in a week." },
    dailyVolume: { ko: "하루 동안 들어오는 문의 수입니다.", en: "Contacts arriving in one day." },
    ahtChat: { ko: "대화 한 건이 시작부터 끝날 때까지 걸리는 평균 시간입니다.", en: "The average time one chat takes from start to finish." },
    ahtEmail: { ko: "이메일 한 건을 읽고 답장하는 데 걸리는 평균 시간입니다.", en: "The average time it takes to read and answer one email." },
    concurrency: { ko: "상담사 한 명이 한 번에 맡는 채팅 수입니다.", en: "The number of chats one agent handles at once." },
    targetChat: { ko: "고객의 첫 메시지에 이 시간 안에 응답하는 것을 목표로 합니다.", en: "The aim is to answer the customer's first message within this time." },
    hoursOpen: { ko: "이 채널에서 문의를 받는 하루 시간입니다.", en: "The hours each day this channel takes contacts." },
    daysOpen: { ko: "일주일에 이 채널을 운영하는 날 수입니다.", en: "The days each week this channel runs." },
    current: { ko: "이 채널을 맡은 상담사 수입니다.", en: "Agents assigned to this channel." },
  },
  resultsHeading: { ko: "채널별 결과 (예시)", en: "Results by channel (example)" },
  total: { ko: "합계", en: "Total" },
  row: {
    seats: { ko: "동시 자리 인원", en: "Agents at desks at once" },
    needed: { ko: "필요 인원", en: "Staff needed" },
    current: { ko: "지금 인원", en: "Current staff" },
    diff: { ko: "차이", en: "Difference" },
    weekly: { ko: "주간 근무 시간", en: "Weekly working hours" },
    monthly: { ko: "월간 근무 시간", en: "Monthly working hours" },
    otWeekly: { ko: "추가근무 예상 (주간)", en: "Expected overtime (weekly)" },
    otMonthly: { ko: "추가근무 예상 (월간)", en: "Expected overtime (monthly)" },
    otPerPerson: { ko: "1인당 추가근무 (주간)", en: "Overtime per agent (weekly)" },
  },
  rowHint: {
    seats: { ko: "운영 시간 동안 동시에 자리에 있어야 하는 인원입니다.", en: "The agents who need to be at their desks at the same time while the channel is open." },
    needed: { ko: "Shrinkage를 반영한 근무 시간을 1인 주간 근무 시간으로 나눈 편성 인원입니다.", en: "Working hours with Shrinkage allowed for, divided by the weekly hours per agent." },
    weekly: { ko: "자리에 필요한 시간에 Shrinkage를 더한 일주일 근무 시간입니다.", en: "Desk hours plus Shrinkage, over one week." },
    monthly: { ko: "주간 근무 시간 × 52 ÷ 12로 계산합니다.", en: "Weekly working hours × 52 ÷ 12." },
    otWeekly: { ko: "필요한 근무 시간 가운데 지금 인원으로 채우지 못하는 시간입니다.", en: "The hours needed that current staff cannot cover." },
  },
  totalBoth: { ko: "부족 {short}명 · 여유 {spare}명", en: "{short} short · {spare} to spare" },
  totalShort: { ko: "부족 {n}명", en: "{n} short" },
  totalSpare: { ko: "여유 {n}명", en: "{n} to spare" },
  noStaff: { ko: "편성 인원 없음", en: "No staff rostered" },
  otNote: { ko: "1인당 추가근무가 많다면 추가근무보다 인원 보강을 먼저 생각해 보세요.", en: "If overtime per agent is high, think about adding staff before adding overtime." },
  seatNote: { ko: "이 채널은 운영 시간이 짧아 동시 자리 수가 필요 인원을 정합니다. 추가근무로는 같은 시간에 비는 자리를 채우기 어렵습니다.", en: "This channel opens for so few hours that the seats it must fill at once set the staff needed. Overtime can hardly fill seats that are empty at the same time." },
  summaryOne: { ko: "켠 채널 {n}개 합계: 필요 인원 {needed}명, 주간 {weekly}시간, 주간 추가근무 {ot}시간입니다.", en: "Total for 1 channel on: {needed} staff needed, {weekly} hours a week, {ot} hours of overtime a week." },
  summary: { ko: "켠 채널 {n}개 합계: 필요 인원 {needed}명, 주간 {weekly}시간, 주간 추가근무 {ot}시간입니다.", en: "Total for {n} channels on: {needed} staff needed, {weekly} hours a week, {ot} hours of overtime a week." },
  tryC1: { ko: "채팅의 동시 처리 수를 1로 내려 보세요. 필요한 인원이 얼마나 늘어나나요?", en: "Lower chat's concurrent chats to 1. How many more staff do you need?" },
  tryC2: { ko: "계획되지 않은 Shrinkage를 5%p 올려 보세요. 어느 채널의 추가근무가 가장 크게 늘어나나요?", en: "Raise unplanned Shrinkage by 5 points. Which channel's overtime grows the most?" },
  tryC3: { ko: "이메일 채널을 꺼 보세요. 합계는 줄어도 전화·채팅의 부족이 그대로인 이유는 무엇일까요?", en: "Turn email off. The total drops, so why are phone and chat still short?" },
  channelsLimits: { ko: "하루 문의량을 운영 시간에 고르게 나누므로 바쁜 시간대의 부족은 드러나지 않습니다. 채팅은 처리 시간을 동시 처리 수로 나눈 근사이고, 이메일은 점유율 85%(예시)로 계산합니다. 채널마다 전담 인원으로 보는 연습용 계산이니, 실제 인원 계획은 WFM 담당자와 확인하세요.", en: "Daily volume is spread evenly over opening hours, so shortfalls at busy times do not show. Chat divides handle time by concurrent chats as an approximation, and email uses an occupancy of 85% (example). Each channel is treated as having its own staff; this is for practice, so check real staffing plans with your WFM team." },
  unit: {
    hours: { ko: "시간", en: " h" },
    days: { ko: "일", en: " days" },
    chats: { ko: "건", en: " chats" },
  },
};

// Which glossary card each result row links to.
export const CHANNEL_GLOSSARY = { seats: 'occupancy', needed: 'fte', weekly: 'shrinkage' };

export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));
}
