// Start screen wording. Korean is the approved copy in
// docs/superpowers/specs/2026-11-22-start-screen-design.md §5; English follows
// …-start-screen-copy.en.md. Tests compare both, row for row.
import { BRAND } from '../shared/brand.js';
export const START_UI = {
  logo: BRAND,
  tagline: { ko: "상담사부터 매니저까지, 그때 알았더라면 좋았을 것들", en: "From agent to manager: what I wish I'd known back then" },
  start: { ko: "시작하기", en: "Start" },
  offlineWait: { ko: "오프라인 준비 중…", en: "Getting ready for offline use…" },
  offlineReady: { ko: "오프라인에서도 볼 수 있어요", en: "You can use it offline too" },
  dialog: { ko: "CX 2회차 시작 화면", en: "CX Replay start screen" },
  misoAlt: { ko: "김미소", en: "Miso Kim" },
};

// Each group has one Miso face (assets/miso/<face>.webp) and its lines.
export const GREETINGS = {
  smallHours: {
    face: 'smile',
    lines: [
      { ko: "새벽까지 깨어 있네요. 저도 야간 근무 때 틈틈이 쉬는 법을 늦게 배웠어요. 오늘은 쉬어 가며 해요.", en: "Still up at this hour? I learned to take breaks on night shifts far too late. Go easy tonight." },
      { ko: "이 시간엔 하나만 보고 자요. 저도 그때 잠을 아꼈던 게 제일 후회돼요.", en: "At this hour, look at just one thing and sleep. Skimping on sleep is what I regret most from back then." },
    ],
  },
  morning: {
    face: 'sparkle',
    lines: [
      { ko: "좋은 아침이에요! 저도 그때 첫 콜 전에 잠깐만 준비했으면 하루가 달랐을 거예요.", en: "Good morning! Back then, a little preparation before my first call would have changed my whole day." },
      { ko: "상쾌한 아침이에요. 오늘 하루를 다시 산다면 무엇부터 할지, 레슨 하나로 떠올려 봐요.", en: "A fresh morning. Use one lesson to think about what you'd do first if you could replay today." },
      { ko: "아침 일찍 왔네요. 커피 한 잔과 함께, 제가 늦게 깨달은 것 하나부터 볼까요?", en: "You're up early. With a cup of coffee, shall we start with one thing I learned too late?" },
    ],
  },
  lunch: {
    face: 'joy',
    lines: [
      { ko: "점심은 챙겨 드셨어요? 저도 바쁘다고 거르다 오후에 늘 지쳤어요.", en: "Have you had lunch? I used to skip it when busy and was always worn out by afternoon." },
      { ko: "오전 근무 고생 많았어요. 잠깐 숨 돌리면서, 그때 알았더라면 좋았을 것 하나만 보고 가요.", en: "Well done on the morning shift. Catch your breath and look at one thing I wish I'd known back then." },
    ],
  },
  afternoon: {
    face: 'cheer',
    lines: [
      { ko: "오후가 제일 길죠. 저도 상담사 때 이 시간이 제일 힘들었어요. 퀴즈 하나로 머리를 깨워요.", en: "The afternoon feels longest. It was the hardest stretch for me as an agent too. Wake your mind up with a quiz." },
      { ko: "오후도 힘내요! 오늘 막혔던 일이 있다면, 다음엔 어떻게 할지 레슨에서 미리 찾아봐요.", en: "Keep going this afternoon! If something got stuck today, look in the lessons for what to do next time." },
    ],
  },
  evening: {
    face: 'wink',
    lines: [
      { ko: "오늘 하루도 수고 많았어요. '그때 이렇게 할걸' 싶은 순간 하나만 정리하고 쉬어요.", en: "Thanks for all your work today. Note down one moment you'd replay differently, then rest." },
      { ko: "퇴근길인가요? 오늘의 연습으로 가볍게 마무리해요. 내일의 나는 조금 더 알고 출근할 거예요.", en: "On your way home? Wrap up lightly with today's practice. Tomorrow you'll start a little wiser." },
    ],
  },
  night: {
    face: 'smile',
    lines: [
      { ko: "늦은 시간까지 공부하네요. 오늘 배운 하나가 내일의 같은 실수를 막아 줄 거예요. 무리하지 말고 자요.", en: "Studying this late? The one thing you learn tonight can stop tomorrow's repeat mistake. Don't overdo it; get some sleep." },
      { ko: "야간 근무를 시작하나요? 저도 야간 때 몰랐던 게 많았어요. 오늘 밤도 천천히, 안전하게 가요.", en: "Starting a night shift? There was a lot I didn't know on nights too. Go slowly and safely tonight." },
    ],
  },
  monday: {
    face: 'cheer',
    lines: [
      { ko: "한 주의 시작이에요! 지난주에 다시 하고 싶은 장면이 있다면, 이번 주에 바꿔 봐요.", en: "It's the start of the week! If there's a moment from last week you'd replay, change it this week." },
      { ko: "월요일 아침은 문의가 몰리기 쉬워요. 저도 그걸 알고 나서야 월요일이 덜 무서워졌어요.", en: "Contacts tend to pile up on Monday mornings. Mondays only got less scary for me once I knew that." },
    ],
  },
  friday: {
    face: 'proud',
    lines: [
      { ko: "한 주 마무리 잘하고 있죠? 이번 주에 고마웠던 동료에게 한마디 건네 봐요. 저는 그 말을 늘 미뤘던 게 아쉬워요.", en: "Wrapping up the week well? Say a word of thanks to a colleague who helped this week. I always put that off, and I regret it." },
      { ko: "금요일이에요! 이번 주를 다시 산다면 바꿀 것 하나만 적고, 가벼운 마음으로 주말 맞아요.", en: "It's Friday! Write down one thing you'd change if you replayed this week, then head into the weekend lightly." },
    ],
  },
  weekend: {
    face: 'joy',
    lines: [
      { ko: "주말에도 와 줬네요. 근무 중이라면 응원하고, 쉬는 날이라면 가볍게만 봐요.", en: "Thanks for stopping by on the weekend. If you're working, I'm cheering you on; if it's your day off, keep it light." },
      { ko: "여유로운 주말이에요. 저도 그때 주말에 하나씩만 봐 뒀으면 좋았을 거예요.", en: "A relaxed weekend. I wish I'd looked at just one thing each weekend back then." },
    ],
  },
};
