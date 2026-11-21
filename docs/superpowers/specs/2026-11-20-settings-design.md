# 설정 페이지 설계 (짧은 설계)

작성일: 2026-11-20 · 설계·한국어 문안 승인: 2026-11-20 (사용자 "승인")

## 1. 목적
- 리아와 파이썬(Fullcharge13/Learning-Python)의 설정 화면을 참고해, 큐크래프트에 설정 페이지를 만든다.
- 범위(사용자 선택: 추천 다섯 가지): 언어, 화면(시스템 따라가기·밝게·어둡게), 기록 백업(내보내기·가져오기, 오프라인 준비 상태), 홈 화면에 추가 안내(첫 화면에서 옮김), 맨 아래 버전·개인정보처리방침·참고 자료 링크.
- 비목표: 소리, 하루 목표, 부를 이름, 사용법 다시 보기, 개발자 모드, 기록 지우기, 직군 선택.

## 2. 접근 방식
- **A. 아래 메뉴 다섯 번째 칸 "설정" + 별도 페이지 `settings/` (사용자 선택)**
- B. 각 페이지 위쪽 톱니바퀴 아이콘 — 메뉴는 네 칸 유지.

## 3. 결정
- 아래 메뉴: 홈 · 배우기 · 길잡이 · 찾아보기 · 설정. `settings/`에서는 "설정"이 현재 칸.
- 화면 색: `queuecraft:theme`에 `system`·`light`·`dark` 저장. 모든 페이지 머리의 `shared/theme-boot.js`가 그리기 전에 `<html data-theme>`를 맞춘다(깜빡임 없음). `system`이면 속성을 두지 않는다.
- 기록 백업: 파일 `queuecraft-backup-YYYY-MM-DD.json` = `{ app: "queuecraft", format: 1, exported: 날짜, data: { 키: 값 } }`. 키: 언어, 직군, 화면, 라이프사이클 진도, SOP 진도, 엑셀 진도, 오늘의 연습. 가져오기는 확인 뒤 이 키들을 파일 내용으로 바꾼다(파일에 없는 키는 지움). 큐크래프트 파일이 아니면 거절.
- 오프라인 상태: 오프라인 작업자가 이 페이지를 맡고 있으면 "준비 완료", 아니면 "준비 중".
- 첫 화면의 설치 안내는 설정으로 옮긴다(첫 화면의 개인정보처리방침 링크는 유지).
- 버전: v0.1.0부터, 배포 때 올린다(`settings/data.js`의 `APP_VERSION`). 옆에 오프라인 저장소 이름에서 읽은 빌드 번호를 괄호로 붙여, 배포마다 자동으로 구별된다.
- 선택 버튼(언어·화면)은 하나의 묶음으로 Tab 한 번에 들어가고 화살표·Home·End로 옮기며 바로 고른다.
- 오프라인 상태는 작업자가 준비되면(첫 방문 포함) 바로 "준비 완료"로 바뀐다.
- 개인정보처리방침: 저장 항목 첫 줄과 백업 파일 문장을 고친다(아래 §5).

## 4. 문안 (테스트가 화면 문구와 이 표가 같은지 확인한다)

| 키 | 한국어 | English |
|---|---|---|
| nav | 설정 | Settings |
| title | 설정 | Settings |
| langHeading | 언어 | Language |
| themeHeading | 화면 | Display |
| themeSystem | 시스템 따라가기 | Match system |
| themeLight | 밝게 | Light |
| themeDark | 어둡게 | Dark |
| themeNote | 밤에는 어두운 화면이 눈이 편해요. | A dark screen is easier on the eyes at night. |
| backupHeading | 기록 백업 | Progress backup |
| backupNote | 진행 기록은 이 기기에만 저장돼요. 기기를 바꾸거나 기록이 지워질까 걱정되면 파일로 내보내 두세요. | Your progress is saved only on this device. If you're changing devices or worried it might be erased, export it to a file. |
| export | 기록 내보내기 | Export progress |
| import | 기록 가져오기 | Import progress |
| importAsk | 이 파일의 기록으로 바꿀까요? | Replace your progress with this file? |
| importAskNote | 지금 이 기기의 기록은 파일 내용으로 바뀌어요. | Your progress on this device will be replaced by the file's contents. |
| cancel | 그만두기 | Cancel |
| replace | 바꾸기 | Replace |
| exported | 기록 파일을 내보냈어요. | Progress file exported. |
| imported | 기록을 가져왔어요. | Progress imported. |
| importBad | 기록 파일을 읽지 못했어요. 큐크래프트에서 내보낸 파일인지 확인해 주세요. | Couldn't read the progress file. Check that it was exported from Queuecraft. |
| reset | 학습 초기화 | Reset learning |
| resetAsk | 학습 기록을 모두 지울까요? | Erase all your learning records? |
| resetAskNote | 레슨 진도와 오늘의 연습 기록, 배지가 지워지고 되돌릴 수 없어요. 먼저 '기록 내보내기'로 백업해 두면 나중에 다시 가져올 수 있어요. | Lesson progress, Today’s Practice records and badges will be erased, and this can’t be undone. Back up first with “Export progress” and you can bring them back later. |
| resetConfirm | 지우기 | Erase |
| resetDone | 학습 기록을 지웠어요. | Learning records erased. |
| resetNone | 지울 학습 기록이 없어요. | There are no learning records to erase. |
| offlineReady | 오프라인 준비 완료 | Ready for offline use |
| offlineWait | 오프라인 준비 중이에요. 인터넷이 될 때 앱을 한 번 다시 열어 주세요. | Getting ready for offline use. Open the app again once you're online. |
| installHeading | 홈 화면에 추가 | Add to home screen |

- 설치 안내 문장은 첫 화면의 `HOME_UI.install`을 그대로 쓴다. 맨 아래 링크 글자는 개인정보처리방침의 `link`, 참고 자료의 `title`을 쓴다. 언어 버튼은 "한국어" / "English".

## 5. 개인정보처리방침 변경 (승인 2026-11-20)
- s2.item1: "고른 언어와 직군" → "고른 언어, 직군, 화면 모드(밝게·어둡게)" / "Your chosen language, job track and display mode (light or dark)" (검토 뒤 "화면 밝기"에서 수정, 승인)
- s2.backup(새 줄, 목록 아래): "설정에서 기록을 내보내면 그 파일은 사용하는 기기에 저장되며, 이 역시 어디로도 보내지 않습니다." / "If you export your progress in Settings, the file is saved on the device you use; it is not sent anywhere either."

## 6. 확인
- 테스트: 문안 = 표, 메뉴 다섯 칸과 현재 칸, 화면 값 저장·적용·잘못된 값, 모든 페이지 머리의 화면 스크립트, 백업 만들기·읽기(다른 앱 파일·깨진 파일 거절)·되돌리기, 가져오기 확인·취소, 첫 화면에 설치 안내 없음, 개인정보처리방침 문안, 저장 호출 수.
- 브라우저 점검: 320·390px 넘침 없음, 어둡게를 고르면 다른 페이지도 어둡게 열림, 메뉴 다섯 칸, 오프라인에서 설정 열림.

## 2026-11-21 추가: 학습 초기화 (승인)

- 기록 백업 구역에 [학습 초기화]. 학습 기록 4개(라이프사이클·SOP·엑셀 진도, 오늘의 연습 기록과 배지)만 지우고 언어·직군·화면 모드·튜토리얼 여부는 남긴다.
- 누르면 확인 질문(초점은 [그만두기])을 거쳐 [지우기]로 지운다. 지울 기록이 없으면 "지울 학습 기록이 없어요."만 알린다.
- 지우기는 저장이 아니라 삭제라서 개인정보처리방침은 바뀌지 않는다. 문구는 위 표의 reset… 6줄.
