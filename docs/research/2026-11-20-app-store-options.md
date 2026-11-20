# 앱 스토어 배포 방법 조사

작성일: 2026-11-20 · 대상: Queuecraft (큐크래프트). 2026-11-20 KIPRIS·USPTO 상표 검색 결과 같은 이름 0건

지금 사이트는 이미 PWA(홈 화면에 추가하면 앱처럼 쓰고 오프라인에서도 열리는 웹앱)입니다. 이 웹앱을 그대로 감싸서 스토어에 올리는 방법을 비교했습니다. 비용과 규정은 2026년 11월 조사 시점 기준이며 바뀔 수 있습니다.

## 한눈에 보기

| | A. 구글 플레이 (TWA) | B. 애플 앱 스토어 (Capacitor 등) | C. 지금처럼 웹앱 설치 |
|---|---|---|---|
| 방식 | 사이트를 안드로이드 앱 껍데기(Trusted Web Activity)로 감쌈. 도구: Bubblewrap 또는 PWABuilder | 사이트를 iOS 앱 껍데기(WebView)로 감쌈. 도구: Capacitor 또는 PWABuilder iOS 패키지 | 사파리/크롬에서 "홈 화면에 추가" |
| 비용 | 등록비 25달러 1회 | 연 99달러 (안 내면 앱이 내려감) | 없음 |
| 필요한 것 | 구글 계정, 신분증 확인, 사이트에 연결 확인 파일(assetlinks.json) | 맥(Mac)과 Xcode, 애플 개발자 계정 | 없음 |
| 심사 위험 | 낮음 | **높음**: 웹사이트를 감싼 앱은 "최소 기능(가이드라인 4.2)" 위반으로 자주 거절됨 | 없음 |
| 내용 업데이트 | 사이트를 고치면 앱에도 바로 반영 | 감싸는 방식에 따라 다름. 앱 안에 파일을 넣으면 다시 심사 필요 | 사이트를 고치면 바로 반영 |
| 특이 사항 | 2023-11-13 이후 만든 **개인** 계정은 출시 전 **테스터 12명이 14일 연속** 비공개 테스트에 참여해야 함 (조직 계정은 면제) | 거절되면 이유를 보고 고쳐 다시 제출 가능 | 스토어 검색에는 안 나옴 |

## A. 구글 플레이 (추천: 먼저)

- 순서
  1. 구글 플레이 개발자 계정을 만듭니다(25달러, 신분증 확인).
  2. PWABuilder(pwabuilder.com)에 사이트 주소를 넣으면 안드로이드 패키지를 만들어 줍니다. 명령어가 익숙하면 Bubblewrap으로도 같은 것을 만들 수 있습니다.
  3. 사이트에 연결 확인 파일을 올립니다.
  4. 비공개 테스트(12명 × 14일)를 거친 뒤 출시를 신청합니다.
- **주의: 연결 확인 파일 위치.** 이 파일은 도메인 맨 위(`https://marcus30712.github.io/.well-known/assetlinks.json`)에 있어야 합니다. 지금 사이트는 저장소 이름 아래(`/Contact-Center-Management/`)에 있어서, 다음 중 하나가 필요합니다.
  - `Marcus30712.github.io`라는 이름의 저장소를 하나 더 만들어 이 파일만 올리기
  - 개인 도메인(예: misoacademy.com)을 연결하기
  
  이 파일이 없으면 앱 위에 주소창이 보입니다.
- 스토어 등록에 필요한 것: 개인정보처리방침 페이지(수집하는 정보가 없다는 내용이어도 필요), 데이터 보안 양식, 콘텐츠 등급 설문, 스크린샷, 앱 설명.

## B. 애플 앱 스토어 (나중에, 앱만의 기능을 더한 뒤)

- 애플은 웹사이트를 감싸기만 한 앱을 "모바일 웹 브라우징과 충분히 다르지 않다"는 이유로 자주 거절합니다(가이드라인 4.2 최소 기능). 푸시 알림이나 위치 같은 기능을 몇 개 더해도 거절된 사례가 많습니다.
- 통과 가능성을 높이려면 앱에서만 되는 쓸모가 있어야 합니다. 예를 들면 다음과 같은 것입니다.
  - **"오늘의 연습" 알림**: 평일 정해진 시간에 미소가 알려 줌
  - **진도 백업**: 휴대폰을 바꿔도 이어서 하기
- 필요한 것: 맥(Mac), Xcode, 연 99달러. Capacitor는 지금 사이트 코드를 거의 그대로 쓰면서 iOS·안드로이드 프로젝트를 만들어 줍니다.
- 그때까지 아이폰 사용자는 사파리에서 "공유 → 홈 화면에 추가"로 지금처럼 쓸 수 있습니다(C).

## 추천 순서

1. **이름 확정**(상표 확인) → 스토어 이름과 앱 아이디를 정하기 위해 먼저 필요합니다.
2. **개인정보처리방침 페이지** 추가: 두 스토어 모두 필요합니다.
3. **구글 플레이(A)**: 연결 확인 파일 위치를 정하고(새 저장소 또는 도메인), 테스터 12명을 모읍니다. 지금 사이트의 팀장 지인이나 동료가 테스터가 되기 좋습니다.
4. **애플(B)**: 알림 같은 앱 전용 기능을 설계해 더한 뒤 제출합니다.

## 참고한 자료

- Chrome 개발자 문서, Trusted Web Activity 빠른 시작: https://developer.chrome.com/docs/android/trusted-web-activity/quick-start
- Google Codelab, PWA를 Google Play에 올리기: https://developers.google.com/codelabs/pwa-in-play
- Google Play 고객센터, 신규 개인 개발자 계정의 앱 테스트 요건: https://support.google.com/googleplay/android-developer/answer/14151465
- Apple, 멤버십 비교(연 99달러): https://developer.apple.com/support/compare-memberships
- Apple 개발자 포럼, 가이드라인 4.2 거절 사례: https://developer.apple.com/forums/thread/108931
- MobiLoud, 웹뷰 앱과 App Store 가이드라인: https://www.mobiloud.com/blog/app-store-review-guidelines-webview-wrapper
- Capacitor: https://capacitorjs.com/
