// Start screen wording. Korean is the approved copy in
// docs/superpowers/specs/2026-11-22-start-screen-design.md §5; English follows
// …-start-screen-copy.en.md. Tests compare both, row for row.
export const START_UI = {
  logo: { ko: "큐크래프트", en: "Queuecraft" },
  tagline: { ko: "신입 팀장을 위한 컨택센터 운영 배우기", en: "Learning contact center operations, for new team leaders" },
  start: { ko: "시작하기", en: "Start" },
  offlineWait: { ko: "오프라인 준비 중…", en: "Getting ready for offline use…" },
  offlineReady: { ko: "오프라인에서도 볼 수 있어요", en: "You can use it offline too" },
  dialog: { ko: "큐크래프트 시작 화면", en: "Queuecraft start screen" },
  misoAlt: { ko: "김미소", en: "Miso Kim" },
};

// Each group has one Miso face (assets/miso/<face>.webp) and its lines.
export const GREETINGS = {
  smallHours: {
    face: 'smile',
    lines: [
      { ko: "새벽까지 깨어 있네요. 야간 근무 중이라면 틈틈이 쉬어 가며 해요.", en: "Still up at this hour? If you are on a night shift, take breaks as you go." },
      { ko: "이 시간에도 공부라니 대단해요. 오늘은 짧게 하나만 보고 쉬어요.", en: "Studying even now is impressive. Just look at one short thing today, then rest." },
    ],
  },
  morning: {
    face: 'sparkle',
    lines: [
      { ko: "좋은 아침이에요! 오늘 첫 콜 받기 전에 레슨 하나 어때요?", en: "Good morning! How about a lesson before your first call today?" },
      { ko: "상쾌한 아침이에요. 오늘 팀 허들에서 나눌 이야기를 하나 챙겨 가요.", en: "A fresh morning. Pick up one thing to share at today's team huddle." },
      { ko: "아침 일찍 왔네요. 커피 한 잔과 함께 가볍게 시작해요.", en: "You're up early. Start light, with a cup of coffee." },
    ],
  },
  lunch: {
    face: 'joy',
    lines: [
      { ko: "점심은 챙겨 드셨어요? 식사 뒤 남는 몇 분이면 충분해요.", en: "Have you had lunch? A few spare minutes after eating are plenty." },
      { ko: "오전 근무 고생 많았어요. 잠깐 숨 돌리면서 하나만 보고 가요.", en: "Well done on the morning shift. Catch your breath and look at just one thing." },
    ],
  },
  afternoon: {
    face: 'cheer',
    lines: [
      { ko: "오후에 졸릴 때쯤이죠. 퀴즈 하나로 머리를 깨워 볼까요?", en: "Feeling the afternoon slump? How about a quiz to wake your mind up?" },
      { ko: "오후도 힘내요! 오늘 코칭할 팀원이 있다면 SOP를 먼저 훑어봐요.", en: "Keep going this afternoon! If you are coaching someone today, skim the SOP first." },
    ],
  },
  evening: {
    face: 'wink',
    lines: [
      { ko: "오늘 하루도 수고 많았어요. 배운 걸 하나만 정리하고 쉬어요.", en: "Thanks for all your work today. Sum up one thing you learned, then rest." },
      { ko: "퇴근길인가요? 오늘의 연습으로 가볍게 마무리해요.", en: "On your way home? Wrap up lightly with today's practice." },
    ],
  },
  night: {
    face: 'smile',
    lines: [
      { ko: "늦은 시간까지 공부하네요. 무리하지 말고 하나만 보고 자요.", en: "Studying this late? Take it easy, look at one thing, then get some sleep." },
      { ko: "야간 근무를 시작하나요? 오늘 밤도 천천히, 안전하게 가요.", en: "Starting a night shift? Go slowly and safely tonight." },
    ],
  },
  monday: {
    face: 'cheer',
    lines: [
      { ko: "한 주의 시작이에요! 이번 주에 코칭할 팀원부터 떠올려 볼까요?", en: "It's the start of the week! Why not think first of whom you will coach this week?" },
      { ko: "월요일 아침은 문의가 몰리기 쉬워요. 출근 전에 마음의 준비를 해 둬요.", en: "Contacts tend to pile up on Monday mornings. Get ready before you start." },
    ],
  },
  friday: {
    face: 'proud',
    lines: [
      { ko: "한 주 마무리 잘하고 있죠? 이번 주에 잘한 팀원에게 칭찬 한마디 어때요?", en: "Wrapping up the week well? How about a word of praise for someone who did well this week?" },
      { ko: "금요일이에요! 이번 주에 배운 것 하나만 돌아보고 가벼운 마음으로 주말 맞아요.", en: "It's Friday! Look back on one thing you learned this week and head into the weekend lighter." },
    ],
  },
  weekend: {
    face: 'joy',
    lines: [
      { ko: "주말에도 와 줬네요. 근무 중이라면 응원하고, 쉬는 날이라면 가볍게만 봐요.", en: "Thanks for stopping by on the weekend. If you're working, I'm cheering you on; if it's your day off, keep it light." },
      { ko: "여유로운 주말이에요. 평소 미뤄 둔 레슨 하나 어때요?", en: "A relaxed weekend. How about a lesson you have been putting off?" },
    ],
  },
};
