# 상담사 라이프사이클 강의 / The Agent Lifecycle

신입 팀장을 위한 인터랙티브 강의. 채용부터 경력 개발까지 여섯 단계를 애니메이션 다이어그램으로 한 스텝씩 넘겨 봅니다. 한국어/영어.

- 비공개 미리보기 (Claude 아티팩트): https://claude.ai/artifact/PgJmo8k2gmRWJrfLNQHQQQ
- 설계 문서: 저장소 루트의 `docs/superpowers/specs/2026-11-18-agent-lifecycle-course-design.md`

## 직군 트랙

상단의 `일반 고객지원 | 기술지원` 버튼으로 직군을 고르면, 공통 내용에 그 직군 전용 스텝과 문제가 더해집니다. 레슨 파일에서 `trackStep('general' | 'tech', …)`, `trackQuestion(…)`으로 쓴 항목이 직군 전용이고, 나머지는 공통입니다. 선택한 직군은 언어처럼 브라우저에 기억됩니다.

## 내용 고치기

레슨 문안은 `js/lessons/01-hiring.js` … `06-career.js`에 있습니다. 고친 뒤 `npm test`를 돌리면 스텝 수, 문장 길이, 금지어, 수치의 "예시" 표시를 자동으로 점검합니다.

## 점검

```
npm install
npm test                         # 로직·내용·화면 단위 테스트
python3 scripts/browser_check.py # 실제 브라우저에서 화면 폭·언어 전환·주소 점검
```

## 배포

저장소 루트의 `README.md`를 참고하세요. 이 강의는 저장소의 `agent-lifecycle/` 경로에서 열립니다.
