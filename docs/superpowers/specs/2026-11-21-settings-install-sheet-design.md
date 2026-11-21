# 설정: 홈 화면에 추가 안내 창, 튜토리얼 구역 — 설계

- 날짜: 2026-11-21
- 상태: 설계·한국어 문구 승인 (2026-11-21)
- 크기: 작은 변경 (짧은 설계)
- 본보기: "리아와 파이썬" (Fullcharge13/Learning-Python) `src/ui/installsheet.js`, `src/ui/settings.js`

## 의도

1. 설정의 "홈 화면에 추가"를 한 줄 안내에서 **자세한 단계 안내 창**으로 바꾼다. 아이폰·안드로이드별 3단계(그림 포함), 추가한 뒤 할 일, 기록이 지워질 수 있는 경우를 알려 준다.
2. "튜토리얼 다시 보기"를 "홈 화면에 추가" 구역에서 빼서 **자기 구역**(제목·설명·[보기])으로 둔다.

- 하지 않을 것: 카카오톡 같은 앱 안 브라우저 안내, 홈 화면에서의 설치 안내, 설치 버튼 자동 표시.
- 실패로 볼 것: 창을 닫을 수 없거나 키보드로 쓸 수 없는 것, 작은 화면에서 [알겠어요]가 안 보이는 것, 다크 모드에서 글이나 그림이 안 보이는 것.

## 방법

| 방법 | 결정 |
|---|---|
| 리아와 파이썬의 안내 창을 큐크래프트 화면 규칙(`h()`, `{ko,en}`, CSS 변수)으로 옮김 | **선택** — 사용자가 본보기로 지정 |
| 설정 페이지 안에 펼쳐지는 안내(창 없이) | 본보기와 달라서 뺌 |

## 동작 (승인됨)

- **설정 순서:** 언어 → 튜토리얼 → 화면 → 기록 백업 → 홈 화면에 추가.
- **튜토리얼 구역:** 제목 "튜토리얼", 줄 이름 "튜토리얼 다시 보기", 설명, [보기] 버튼(`../?tour=1`로 이동, 지금과 같음).
- **홈 화면에 추가 구역:** 안내 한 줄 + [홈 화면에 추가 방법] 버튼. 누르면 안내 창이 열린다.
- **안내 창:** 김미소(`assets/miso/wink.webp`) + 말풍선, 제목, 탭 두 개(아이폰 / 안드로이드), 탭마다 그림이 붙은 3단계, "다음 안내"(초록), "주의"(노랑), [알겠어요].
- **처음 열리는 탭:** 안드로이드 기기면 안드로이드, 그 밖에는 아이폰 (제가 정한 부분, 승인됨).
- **닫기:** [알겠어요], Esc, 창 바깥 누르기. 닫으면 [홈 화면에 추가 방법] 버튼으로 초점이 돌아간다. 열리면 초점은 [알겠어요]로.
- **탭:** 탭 목록·탭·탭 패널 역할. 좌우 화살표로 탭을 바꾼다.
- **그림:** 단계 그림은 코드로 그린 작은 그림(공유, 추가, 「추가」 글자, ⋮ 메뉴, 「설치」 글자). 그림 속 「추가」「설치」 글자도 언어를 따른다.

## 문구

### 한국어 (승인됨, 2026-11-21) / 영어 (한국어를 따름)

| 키 | 한국어 | English |
|---|---|---|
| tutorialHeading | 튜토리얼 | Tutorial |
| tutorialRow | 튜토리얼 다시 보기 | Replay the tutorial |
| tutorialNote | 아래 메뉴 다섯 칸을 김미소가 다시 소개해요. 기록은 그대로예요. | Miso introduces the five bottom-menu items again. Your progress stays as it is. |
| tutorialButton | 보기 | View |
| installNote | 아이폰 사파리나 안드로이드 크롬에서 홈 화면에 추가해 두면 앱처럼 바로 열려요. 아이폰은 기록도 더 안전해요. | Add it to your Home Screen in iPhone Safari or Android Chrome and it opens like an app. On iPhone, your progress is safer too. |
| installButton | 홈 화면에 추가 방법 | How to add to Home Screen |
| sheetBubble | 홈 화면에 저를 데려가 주세요. 앱처럼 바로 열 수 있어요. | Take me to your Home Screen. Then you can open me right away, like an app. |
| sheetTitle | 홈 화면에 추가하기 | Add to Home Screen |
| sheetTabs | 휴대폰 종류 | Phone type |
| tabIos | 아이폰 (사파리) | iPhone (Safari) |
| tabAndroid | 안드로이드 (크롬) | Android (Chrome) |
| ios1 | 공유 버튼(안 보이면 ··· 메뉴 안)을 눌러요 | Tap the Share button (if you can't see it, look in the ··· menu) |
| ios2 | 「홈 화면에 추가」를 골라요 | Choose “Add to Home Screen” |
| ios3 | 오른쪽 위 「추가」를 눌러요 | Tap “Add” in the top-right corner |
| iosAfter | 추가한 뒤, 인터넷이 될 때 아이콘으로 한 번 열어 주세요. 그래야 비행기 모드에서도 열려요. | After adding it, open it once from the icon while you're online. Then it will open in airplane mode too. |
| iosWhy | 사파리에서는 7일 동안 열지 않으면 기록이 지워질 수 있어요. 홈 화면에 추가하면 더 안전하게 남아요. | In Safari, your progress may be erased if you don't open the app for 7 days. Adding it to your Home Screen keeps it safer. |
| android1 | 크롬 오른쪽 위 ⋮ 메뉴를 눌러요 | Tap the ⋮ menu at the top right of Chrome |
| android2 | 「홈 화면에 추가」 또는 「앱 설치」를 골라요 | Choose “Add to Home screen” or “Install app” |
| android3 | 「설치」 또는 「추가」를 눌러요 | Tap “Install” or “Add” |
| androidAfter | 크롬과 홈 화면 앱은 같은 기록을 써요. 설정에 「오프라인 준비 완료」가 보이면 비행기 모드에서도 열려요. | Chrome and the Home Screen app share the same progress. Once Settings shows “Ready for offline use”, it opens in airplane mode too. |
| androidWhy | 크롬에서 「인터넷 사용 기록 삭제」로 쿠키·사이트 데이터를 지우면 기록도 함께 지워져요. 가끔 설정의 「기록 내보내기」로 백업해 두세요. | If you clear cookies and site data in Chrome (“Delete browsing data”), your progress is deleted too. Back it up now and then with “Export progress” in Settings. |
| ok | 알겠어요 | Got it |
| iconAdd | 추가 | Add |
| iconInstall | 설치 | Install |

- 영어는 리아와 파이썬의 영어를 따르되, 큐크래프트 버튼 이름("Ready for offline use", "Export progress")에 맞췄다. `sheetTabs`, `iconAdd`, `iconInstall`은 화면 읽기용 이름과 그림 속 글자다.

## 만드는 사람에게 맡기는 것

- 파일 배치(예: `settings/install-data.js`, `settings/install-sheet.js`)와 CSS.
- 문구는 이 표와 대조하는 테스트로 묶는다. `HOME_UI.install`은 설정에서 더 쓰지 않는다(홈 문구 파일에는 남김).
- 브라우저 확인: 320·390 폭에서 창이 화면 안에 있고 [알겠어요]가 보이는지, 다크 모드 스크린샷.
