// Words on the Settings page. Korean approved 2026-11-20; tests check them
// against docs/superpowers/specs/2026-11-20-settings-design.md.
export const APP_VERSION = '0.1.0';

export const SETTINGS_UI = {
  nav: { ko: "설정", en: "Settings" },
  title: { ko: "설정", en: "Settings" },
  langHeading: { ko: "언어", en: "Language" },
  themeHeading: { ko: "화면", en: "Display" },
  themeSystem: { ko: "시스템 따라가기", en: "Match system" },
  themeLight: { ko: "밝게", en: "Light" },
  themeDark: { ko: "어둡게", en: "Dark" },
  themeNote: { ko: "밤에는 어두운 화면이 눈이 편해요.", en: "A dark screen is easier on the eyes at night." },
  backupHeading: { ko: "기록 백업", en: "Progress backup" },
  backupNote: { ko: "진행 기록은 이 기기에만 저장돼요. 기기를 바꾸거나 기록이 지워질까 걱정되면 파일로 내보내 두세요.", en: "Your progress is saved only on this device. If you're changing devices or worried it might be erased, export it to a file." },
  export: { ko: "기록 내보내기", en: "Export progress" },
  import: { ko: "기록 가져오기", en: "Import progress" },
  importAsk: { ko: "이 파일의 기록으로 바꿀까요?", en: "Replace your progress with this file?" },
  importAskNote: { ko: "지금 이 기기의 기록은 파일 내용으로 바뀌어요.", en: "Your progress on this device will be replaced by the file's contents." },
  cancel: { ko: "그만두기", en: "Cancel" },
  replace: { ko: "바꾸기", en: "Replace" },
  exported: { ko: "기록 파일을 내보냈어요.", en: "Progress file exported." },
  imported: { ko: "기록을 가져왔어요.", en: "Progress imported." },
  importBad: { ko: "기록 파일을 읽지 못했어요. 큐크래프트에서 내보낸 파일인지 확인해 주세요.", en: "Couldn't read the progress file. Check that it was exported from Queuecraft." },
  reset: { ko: "학습 초기화", en: "Reset learning" },
  resetAsk: { ko: "학습 기록을 모두 지울까요?", en: "Erase all your learning records?" },
  resetAskNote: { ko: "레슨 진도와 오늘의 연습 기록, 배지가 지워지고 되돌릴 수 없어요. 먼저 '기록 내보내기'로 백업해 두면 나중에 다시 가져올 수 있어요.", en: "Lesson progress, Today’s Practice records and badges will be erased, and this can’t be undone. Back up first with “Export progress” and you can bring them back later." },
  resetConfirm: { ko: "지우기", en: "Erase" },
  resetDone: { ko: "학습 기록을 지웠어요.", en: "Learning records erased." },
  resetNone: { ko: "지울 학습 기록이 없어요.", en: "There are no learning records to erase." },
  offlineReady: { ko: "오프라인 준비 완료", en: "Ready for offline use" },
  offlineWait: { ko: "오프라인 준비 중이에요. 인터넷이 될 때 앱을 한 번 다시 열어 주세요.", en: "Getting ready for offline use. Open the app again once you're online." },
  installHeading: { ko: "홈 화면에 추가", en: "Add to home screen" },
};
