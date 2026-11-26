# 개인정보처리방침 페이지 설계 (짧은 설계)

작성일: 2026-11-20 · 한국어 문안 확정: 2026-11-20 (사용자 "확정"; 검토 뒤 s2.item3·s3·s5 수정 승인; 설정 추가로 s2.item1·s2.backup 수정 승인; 2026-11-21 튜토리얼 추가로 s2.item1 수정 승인)

## 1. 목적과 범위
- 구글 플레이·앱스토어에 무료 앱으로 내기 위해, 공개 주소가 있는 개인정보처리방침이 필요하다.
- 사실: 앱은 개인정보를 받거나 보내지 않는다. 회원가입·로그인·분석 도구·광고·외부 글꼴이 없다. 브라우저 저장공간에 언어·직군, 레슨 진도, 오늘의 연습 기록·배지, 오프라인용 화면 파일만 둔다. 사이트는 GitHub Pages에서 운영된다.
- 비목표: 특정 국가의 법 이름 인용, 개인 연락처 기재(문의는 GitHub Issues), 쿠키 배너.

## 2. 접근 방식
- **A. 별도 페이지 `privacy/` (선택)** — 스토어에 줄 고정 주소가 생긴다.
- B. 참고 자료 페이지 안의 한 칸 — 스토어용 주소가 따로 없다.
- C. README에 쓰기 — 일반 사용자가 읽기 어렵다.

## 3. 결정
- 주소: `https://marcus30712.github.io/Contact-Center-Management/privacy/`
- 구조는 참고 자료 페이지와 같다(상단 이름·언어 전환, 돌아가기 링크, 섹션, 공통 메뉴, 오프라인).
- 링크: 첫 화면 맨 아래 설치 안내 밑, 참고 자료 페이지 "안내" 칸. 링크 글자는 아래 `link`.
- 외부 링크: GitHub 개인정보 처리방침 `https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement`, 문의 게시판 `https://github.com/Marcus30712/Contact-Center-Management/issues`.

## 4. 문안 (테스트가 화면 문구와 이 표가 같은지 확인한다)

| 키 | 한국어 | English |
|---|---|---|
| title | 개인정보처리방침 | Privacy Policy |
| intro | CX 2회차는 개인정보를 수집하지 않습니다. 이 페이지는 앱이 어떤 정보를 어디에 두는지 밝힙니다. | CX Replay does not collect personal information. This page explains what the app keeps and where. |
| meta | 시행일: 2026년 11월 20일 · 운영: Marcus Shim | Effective date: November 20, 2026 · Operated by Marcus Shim |
| link | 개인정보처리방침 | Privacy Policy |
| s1.heading | 1. 수집하는 정보 | 1. Information we collect |
| s1.body | CX 2회차는 이름, 이메일, 전화번호, 위치 같은 개인정보를 받지 않습니다. 회원가입과 로그인이 없고, 광고나 이용 분석 도구도 쓰지 않습니다. | CX Replay does not ask for personal information such as your name, email, phone number or location. There is no sign-up or login, and no advertising or usage analytics tools. |
| s2.heading | 2. 기기에만 저장하는 정보 | 2. Information kept only on your device |
| s2.body | 학습을 이어 갈 수 있도록 아래 내용을 사용하는 기기의 브라우저 저장공간에만 저장합니다. 이 정보는 어디로도 보내지 않으며 운영자도 볼 수 없습니다. | So you can pick up where you left off, the items below are stored only in your browser's storage on the device you use. They are never sent anywhere, and the operator cannot see them. |
| s2.item1 | 고른 언어, 직군, 화면 모드(밝게·어둡게), 튜토리얼을 봤는지 여부 | Your chosen language, job track, display mode (light or dark), and whether you've seen the tutorial |
| s2.item2 | 레슨 진도 (라이프사이클, SOP, 엑셀) | Lesson progress (Lifecycle, SOP, Excel) |
| s2.item3 | 오늘의 연습 기록(연습한 날짜, 푼 문제와 카드)과 배지 | Today's Practice records (days practised, questions and cards) and badges |
| s2.item4 | 오프라인에서 보기 위한 화면 파일 | Page files for offline use |
| s2.backup | 설정에서 기록을 내보내면 그 파일은 사용하는 기기에 저장되며, 이 역시 어디로도 보내지 않습니다. | If you export your progress in Settings, the file is saved on the device you use; it is not sent anywhere either. |
| s3.heading | 3. 지우는 방법 | 3. How to delete it |
| s3.body | 브라우저 설정에서 이 사이트의 데이터를 지우면 모두 지워집니다. 앱을 삭제할 때 함께 지워지는지는 기기와 브라우저에 따라 다릅니다. | Clearing this site's data in your browser settings removes all of it. Whether deleting the app also removes it depends on your device and browser. |
| s4.heading | 4. 사이트 운영 | 4. Hosting |
| s4.body | CX 2회차는 GitHub Pages에서 운영됩니다. GitHub는 서비스 운영과 보안을 위해 접속 기록(IP 주소 등)을 남길 수 있으며, 이 기록은 GitHub의 개인정보 처리방침을 따릅니다. | CX Replay is hosted on GitHub Pages. GitHub may keep access logs (such as IP addresses) to run and secure its service; these follow GitHub's privacy statement. |
| s4.link | GitHub 개인정보 처리방침 보기 → | View GitHub's privacy statement → |
| s5.heading | 5. 다른 사이트로 가는 링크 | 5. Links to other sites |
| s5.body | 참고 자료의 링크처럼 다른 사이트로 가는 링크를 누르면, 그 사이트의 방침을 따릅니다. | When you follow a link to another site, such as the links in References, that site's policy applies. |
| s6.heading | 6. 이용 대상 | 6. Who it is for |
| s6.body | CX 2회차는 컨택센터 팀장을 위한 학습 자료이며 어린이를 대상으로 하지 않습니다. | CX Replay is learning material for contact center team leads and is not directed at children. |
| s7.heading | 7. 방침이 바뀔 때 | 7. Changes to this policy |
| s7.body | 이 방침이 바뀌면 이 페이지에 바뀐 날짜와 함께 알립니다. | If this policy changes, this page will show the change along with its date. |
| s8.heading | 8. 문의 | 8. Contact |
| s8.body | 궁금한 점은 GitHub 문의 게시판(Issues)에 남겨 주세요. 문의 글은 누구나 볼 수 있으니 개인정보는 적지 마세요. | Please leave questions on the GitHub Issues board. Anyone can read issues, so please don't include personal information. |
| s8.link | 문의 게시판 열기 → | Open the Issues board → |

## 5. 확인
- 테스트: 문안 = 이 표, 영어에 한글 없음, 저장 항목이 실제 저장 키와 맞음(언어·직군·진도 3종·연습), 개인 연락처(@, 전화번호) 없음, 페이지가 문안·링크를 그림, 첫 화면과 참고 자료에 링크, 오프라인 목록에 포함.
- 브라우저 점검: 320·390px 가로 넘침 없음, 첫 화면 링크로 이동하면 제목이 보임.
