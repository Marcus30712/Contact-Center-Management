# Contact Center Management Knowledge Base

컨택센터 운영 관리를 주제별로 다루는 인터랙티브 학습 자료 모음입니다. 휴대폰 홈 화면에 추가하면 앱처럼 쓰고, 한 번 연 뒤에는 오프라인에서도 볼 수 있습니다. 선배 매니저 김미소가 첫 화면에서 내 학습을 이어 가도록 안내합니다.

| 주제 | 폴더 | 설명 |
|---|---|---|
| 팀장 상황별 길잡이 / Situation Guide | [`guide/`](guide/) | 상황 17개를 고르면 먼저 볼 강의·SOP·원페이저로 안내 (한국어/영어) |
| 오늘의 연습 / Today's Practice | [`practice/`](practice/) | 마친 레슨에서 하루 3문제, 용어 카드, 평일 연속 학습과 배지 9개. 김미소가 표정으로 반응 (한국어/영어). 기록은 휴대폰에만 저장 |
| 상담사 라이프사이클 / The Agent Lifecycle | [`agent-lifecycle/`](agent-lifecycle/) | 신입 팀장을 위한 6단계 강의 (한국어/영어) |
| SOP 라이브러리 / SOP Library | [`sop-library/`](sop-library/) | 팀장이 알아야 할 SOP 7개를 순서대로 배우는 강의 (한국어/영어) |
| Codex 원페이저 / Codex One-Pagers | [`codex/`](codex/) | Codex의 네 장(운영 최적화 원칙, 5대 핵심팀, 커리어 매트릭스, 직무별 일일 업무)을 한 장씩, 누르면 자세히 (한국어/영어) |
| 인력 산정 실험실 / Staffing Lab | [`staffing-calculator/`](staffing-calculator/) | 슬라이더로 필요한 인원을 익히는 연습 화면. 계산은 `staffing-calculator/erlang.js`에 있습니다 |
| 용어집 / Glossary | [`glossary/`](glossary/) | 운영 용어 46개를 검색·분류해 보는 페이지. 용어는 `glossary/terms.js`에 있습니다 |
| 참고 자료 / References | [`references/`](references/) | 바탕 자료(BPO Contact Center Operation Codex 2.0)와 참고한 공개 자료 |

- 첫 화면: `index.html` (김미소 인사, 내 학습, 배우기·찾아보기 카드). 모든 페이지 아래에 공통 메뉴(홈·배우기·길잡이·찾아보기)가 있습니다 (`shared/`)
- 앱 설치·오프라인: `manifest.webmanifest`, `sw.js`. 화면 파일을 바꾸면 `python3 tools/sw_list.py`로 `sw.js`를 다시 만듭니다
- 캐릭터 김미소 이미지: Marcus Shim이 Google Gemini로 생성. 저장소의 MIT 라이선스를 따릅니다 (`assets/miso/`, 원본 `art/miso/`)
- 설계 문서와 계획: `docs/superpowers/`
- 업데이트 내역: [`LOG.md`](LOG.md)
- 새 주제는 폴더를 하나 추가하고 `home/data.js`의 목록에 카드 한 장을 더하면 됩니다.

빌드가 필요 없는 정적 사이트입니다. GitHub Pages로 배포하려면 저장소 Settings → Pages에서 기본 브랜치의 루트 폴더(`/`)를 선택합니다.
