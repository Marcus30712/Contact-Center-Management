# 서비스 이름 변경: CX 2회차 / CX Replay (2026-11-26) — 짧은 설계

## 왜
2018년 상담사로 시작해 2026년 매니저가 되기까지 배운 것을 나누는 사이트입니다(사용자). "그때 그렇게 할걸!", "이제 와서 보니 그렇게 하면 됐었네!"를 컨셉으로 삼아, 게임에서 기억을 가진 채 다시 하는 "2회차"를 이름으로 씁니다. "CS" 대신 "CX"를 쓰는 이유는 두 가지입니다. "CS"는 컴퓨터 과학이나 Counter-Strike로도 읽히고, "CS Replay"는 검색하면 Counter-Strike 경기 다시보기가 먼저 나오기 때문입니다.

## 정한 것 (사용자 승인)
- 한국어 이름은 **CX 2회차**, 영어 이름은 **CX Replay**입니다.
- 화면에 보이는 이름은 모두 바꿉니다.
- 안에서 쓰는 이름은 그대로 둡니다. 저장 이름(`queuecraft:` 진도·설정), 백업 파일 표시(`app: 'queuecraft'`), 저장소와 사이트 주소가 여기에 해당합니다. 바꾸면 학습자의 진도와 예전 백업 파일을 잃습니다.

## 바뀌는 문구 (사용자 확인 필요: 부제 2개)
| 곳 | 한국어 | English |
|---|---|---|
| 홈 큰 제목, 탭 제목 | CX 2회차 | CX Replay |
| 홈 부제 (새 문구) | 그때 알았더라면 좋았을 컨택센터 이야기를, 상담사부터 매니저까지 자리별로 모았습니다. | The contact center lessons I wish I'd known back then, gathered role by role from agent to manager. |
| 시작 화면 로고 | CX 2회차 | CX Replay |
| 시작 화면 부제 (새 문구) | 상담사부터 매니저까지, 그때 알았더라면 좋았을 것들 | From agent to manager: what I wish I'd known back then |
| 홈 화면 앱 이름 (manifest) | name "CX 2회차 · CX Replay", short_name "CX 2회차" | (한 언어만 쓸 수 있어 한국어 우선) |
| 본문 속 "큐크래프트" / "Queuecraft" | CX 2회차 (조사는 그대로: 둘 다 모음으로 끝남) | CX Replay |
| 강의·용어집·참고자료의 "← Queuecraft" 돌아가기 | ← CX 2회차 | ← CX Replay |
| 설정의 버전 줄 | CX 2회차 v… | CX Replay v… |
| README, LICENSE-CONTENT 저작자 표기 | "Marcus Shim, CX 2회차 (CX Replay)" | "Marcus Shim, CX Replay" |

## 만드는 방식 (제 판단)
- 강의 페이지 9개의 "← Queuecraft" 돌아가기 링크는 HTML에 영어로 고정되어 있습니다. 하단 메뉴 코드(`shared/appbar.js`)가 페이지 언어에 맞춰 이 글자를 "CX 2회차" / "CX Replay"로 바꿔 그리게 합니다. 영어 모드에는 한글이 보이지 않아야 한다는 기존 규칙을 지키기 위해서입니다.
- 이름은 한곳(`shared/brand.js`의 `BRAND`)에 두고, 코드에서는 그것을 씁니다. 승인된 문안 문서와 대조하는 문구는 문서와 같은 글자로 둡니다.
- 문안 문서는 테스트가 읽는 행만 새 이름으로 고칩니다. 예전 기록 문서와 LOG의 지난 항목은 그대로 둡니다.

## 범위 밖
- 개인정보처리방침의 "컨택센터 팀장을 위한 학습 자료"(지금은 모든 직급 대상)는 이번에 고치지 않고, 따로 제안합니다.

## 확인
- 테스트
  - 화면 문자열과 HTML에 "Queuecraft"/"큐크래프트"가 남지 않음
  - 홈·시작 화면·manifest 이름
  - 영어 모드 돌아가기 링크
  - 저장 이름과 백업 표시는 그대로
- 브라우저 점검
  - 홈 제목과 부제
  - 강의 페이지 돌아가기 링크(한국어/영어)
  - 예전 백업 파일 복원
