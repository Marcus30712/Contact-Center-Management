// Settings: the tutorial section and the "Add to Home Screen" sheet. The
// Korean is the confirmed table in
// docs/superpowers/specs/2026-11-21-settings-install-sheet-design.md; the test
// agent-lifecycle/tests/install-sheet.test.js keeps the two identical.
export const INSTALL_UI = {
  tutorialHeading: { ko: "튜토리얼", en: "Tutorial" },
  tutorialRow: { ko: "튜토리얼 다시 보기", en: "Replay the tutorial" },
  tutorialNote: { ko: "아래 메뉴 다섯 칸을 김미소가 다시 소개해요. 기록은 그대로예요.", en: "Miso introduces the five bottom-menu items again. Your progress stays as it is." },
  tutorialButton: { ko: "보기", en: "View" },
  installNote: { ko: "아이폰 사파리나 안드로이드 크롬에서 홈 화면에 추가해 두면 앱처럼 바로 열려요. 아이폰은 기록도 더 안전해요.", en: "Add it to your Home Screen in iPhone Safari or Android Chrome and it opens like an app. On iPhone, your progress is safer too." },
  installButton: { ko: "홈 화면에 추가 방법", en: "How to add to Home Screen" },
  sheetBubble: { ko: "홈 화면에 저를 데려가 주세요. 앱처럼 바로 열 수 있어요.", en: "Take me to your Home Screen. Then you can open me right away, like an app." },
  sheetTitle: { ko: "홈 화면에 추가하기", en: "Add to Home Screen" },
  sheetTabs: { ko: "휴대폰 종류", en: "Phone type" },
  tabIos: { ko: "아이폰 (사파리)", en: "iPhone (Safari)" },
  tabAndroid: { ko: "안드로이드 (크롬)", en: "Android (Chrome)" },
  ios1: { ko: "공유 버튼(안 보이면 ··· 메뉴 안)을 눌러요", en: "Tap the Share button (if you can't see it, look in the ··· menu)" },
  ios2: { ko: "「홈 화면에 추가」를 골라요", en: "Choose “Add to Home Screen”" },
  ios3: { ko: "오른쪽 위 「추가」를 눌러요", en: "Tap “Add” in the top-right corner" },
  iosAfter: { ko: "추가한 뒤, 인터넷이 될 때 아이콘으로 한 번 열어 주세요. 그래야 비행기 모드에서도 열려요.", en: "After adding it, open it once from the icon while you're online. Then it will open in airplane mode too." },
  iosWhy: { ko: "사파리에서는 7일 동안 열지 않으면 기록이 지워질 수 있어요. 홈 화면에 추가하면 더 안전하게 남아요.", en: "In Safari, your progress may be erased if you don't open the app for 7 days. Adding it to your Home Screen keeps it safer." },
  android1: { ko: "크롬 오른쪽 위 ⋮ 메뉴를 눌러요", en: "Tap the ⋮ menu at the top right of Chrome" },
  android2: { ko: "「홈 화면에 추가」 또는 「앱 설치」를 골라요", en: "Choose “Add to Home screen” or “Install app”" },
  android3: { ko: "「설치」 또는 「추가」를 눌러요", en: "Tap “Install” or “Add”" },
  androidAfter: { ko: "크롬과 홈 화면 앱은 같은 기록을 써요. 설정에 「오프라인 준비 완료」가 보이면 비행기 모드에서도 열려요.", en: "Chrome and the Home Screen app share the same progress. Once Settings shows “Ready for offline use”, it opens in airplane mode too." },
  androidWhy: { ko: "크롬에서 「인터넷 사용 기록 삭제」로 쿠키·사이트 데이터를 지우면 기록도 함께 지워져요. 가끔 설정의 「기록 내보내기」로 백업해 두세요.", en: "If you clear cookies and site data in Chrome (“Delete browsing data”), your progress is deleted too. Back it up now and then with “Export progress” in Settings." },
  ok: { ko: "알겠어요", en: "Got it" },
  iconAdd: { ko: "추가", en: "Add" },
  iconInstall: { ko: "설치", en: "Install" },
};
