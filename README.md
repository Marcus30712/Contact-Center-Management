# Queuecraft (큐크래프트)

**👉 [서비스 바로가기 / Open the app](https://marcus30712.github.io/Contact-Center-Management/)**

신입 팀장을 위한 컨택센터 운영 관리 학습 앱입니다. 컨택센터 운영 관리를 주제별로 다루는 인터랙티브 학습 자료 모음입니다. 휴대폰 홈 화면에 추가하면 앱처럼 쓰고, 한 번 연 뒤에는 오프라인에서도 볼 수 있습니다. 선배 매니저 김미소가 첫 화면에서 내 학습을 이어 가도록 안내합니다.

| 주제 | 폴더 | 설명 |
|---|---|---|
| 팀장 상황별 길잡이 / Situation Guide | [`guide/`](guide/) | 상황 17개를 고르면 먼저 볼 강의·SOP·원페이저로 안내 (한국어/영어) |
| 오늘의 연습 / Today's Practice | [`practice/`](practice/) | 마친 레슨(라이프사이클·SOP·엑셀)에서 하루 3문제, 용어 카드, 평일 연속 학습과 배지 10개. 김미소가 표정으로 반응 (한국어/영어). 기록은 휴대폰에만 저장 |
| 미소의 엑셀 연습 / Miso's Excel Practice | [`excel/`](excel/) | 팀장이 꼭 쓰는 엑셀 11가지(셀 주소부터 SUMIFS·XLOOKUP·피벗·조건부 서식까지). 타자 없이 카드와 칸을 눌러 수식을 만들고, 미소 팀 콜 기록(예시)으로 실제 계산해 채점 (한국어/영어) |
| 상담사 라이프사이클 / The Agent Lifecycle | [`agent-lifecycle/`](agent-lifecycle/) | 신입 팀장을 위한 6단계 강의 (한국어/영어) |
| SOP 라이브러리 / SOP Library | [`sop-library/`](sop-library/) | 팀장이 알아야 할 SOP 7개를 순서대로 배우는 강의 (한국어/영어) |
| Codex 원페이저 / Codex One-Pagers | [`codex/`](codex/) | Codex의 네 장(운영 최적화 원칙, 5대 핵심팀, 커리어 매트릭스, 직무별 일일 업무)을 한 장씩, 누르면 자세히 (한국어/영어) |
| 인력 산정 실험실 / Staffing Lab | [`staffing-calculator/`](staffing-calculator/) | 슬라이더로 필요한 인원을 익히는 연습 화면. 계산은 `staffing-calculator/erlang.js`에 있습니다 |
| 용어집 / Glossary | [`glossary/`](glossary/) | 운영 용어 46개를 검색·분류해 보는 페이지. 용어는 `glossary/terms.js`에 있습니다 |
| 참고 자료 / References | [`references/`](references/) | 바탕 자료(BPO Contact Center Operation Codex 2.0)와 참고한 공개 자료 |
| 개인정보처리방침 / Privacy Policy | [`privacy/`](privacy/) | 앱이 개인정보를 수집하지 않고 기록은 기기에만 둔다는 안내. 스토어 등록용 주소 (한국어/영어) |
| 설정 / Settings | [`settings/`](settings/) | 언어, 화면(시스템·밝게·어둡게), 기록 백업(파일로 내보내기·가져오기), 오프라인 준비 상태, 홈 화면 추가 안내, 버전. 아래 메뉴 다섯 번째 칸 (한국어/영어) |

- 첫 화면: `index.html` (김미소 인사, 내 학습, 배우기·찾아보기 카드). 모든 페이지 아래에 공통 메뉴(홈·배우기·길잡이·찾아보기·설정)가 있습니다 (`shared/`)
- 앱 설치·오프라인: `manifest.webmanifest`, `sw.js`. 화면 파일을 바꾸면 `python3 tools/sw_list.py`로 `sw.js`를 다시 만듭니다
- 캐릭터 김미소 이미지: Marcus Shim이 Google Gemini로 생성. CC BY-NC-ND 4.0을 따릅니다 (`assets/miso/`, 원본 `art/miso/`)
- 설계 문서와 계획: `docs/superpowers/`
- 업데이트 내역: [`LOG.md`](LOG.md)
- 새 주제는 폴더를 하나 추가하고 `home/data.js`의 목록에 카드 한 장을 더하면 됩니다.

빌드가 필요 없는 정적 사이트입니다. GitHub Pages로 배포하려면 저장소 Settings → Pages에서 기본 브랜치의 루트 폴더(`/`)를 선택합니다.

## 라이선스

| 무엇 | 라이선스 | 파일 |
|---|---|---|
| 코드 (화면을 그리는 코드, 계산기, 테스트, 도구) | MIT | [`LICENSE`](LICENSE) |
| 강의 내용과 문안, 데이터 (`agent-lifecycle/js/lessons/`, `sop-library/lessons/`, `codex/data/`, `glossary/terms.js`, `guide/data.js`, `practice/data.js`, `excel/data.js` 등), 설계·문안 문서 (`docs/`), 김미소 그림 (`assets/miso/`, `art/miso/`, `icons/`) | CC BY-NC-ND 4.0 | [`LICENSE-CONTENT`](LICENSE-CONTENT) |

- CC BY-NC-ND 4.0: 출처("Marcus Shim, Queuecraft")를 밝히고, 바꾸지 않고, 비상업적으로만 공유할 수 있습니다. 자세한 범위는 `LICENSE-CONTENT`에 있습니다.
- 2026년 11월 20일 이전에 MIT로 공개된 판은 그대로 MIT입니다.
