# 직군 트랙 + 보완 2건 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 상담사 라이프사이클 강의에 "일반 고객지원 / 기술지원" 트랙 전환과 보완 2건(스킬 검증, 캘리브레이션)을 더해 한국어/영어로 배포한다.

**Architecture:** 스텝과 체크포인트 문항에 선택 필드 `track`을 두고, 순수 함수가 "공통 + 현재 트랙"만 걸러 렌더러에 넘긴다. 트랙 선택은 언어와 같은 방식으로 저장한다. 주소 형식은 그대로이고 숫자는 현재 트랙에서 보이는 스텝 순서다.

**Tech Stack:** 기존과 동일 — 바닐라 JS ES 모듈, `node --test` + jsdom, Python Playwright(시스템 Chrome). 모든 경로는 `agent-lifecycle/` 기준이며 명령도 그 폴더에서 실행한다.

**Spec:** `docs/superpowers/specs/2026-11-18-tracks-and-verification-design.md` (기존 강의 설계: `docs/superpowers/specs/2026-11-18-agent-lifecycle-course-design.md`)

## Global Constraints

- 트랙 값은 `'general' | 'tech'`. 기본값 `'general'`. 화면 이름: 한국어 `일반 고객지원` / `기술지원`, 영어 `General support` / `Tech support`.
- 트랙별로 보이는 스텝 6–12개, 모든 레슨에 트랙마다 전용 스텝 1개 이상, 트랙별로 보이는 문항은 공통 1 + 전용 1 = 2개 (spec 3.3, 3.7).
- 기존 확정 문안은 레슨 2의 마지막 스텝과 연결 문구만 고친다 (spec 3.7). 공통 스텝은 공통으로 둔다.
- 기술지원 전용 스텝은 "티켓" 단위로 쓴다: 전화·채팅·이메일 어느 채널이든 티켓으로 기록·해결·인계. 채널별 분리는 하지 않는다 (spec 3.8).
- COPC 문서의 문장·요건·배점 사용 금지. 수치 금지. 센터에 따라 다른 것은 "센터마다" 표기. "진상" 금지. 한 직군이 낫다는 서술 금지 (spec 2).
- 지민은 두 트랙 공통, 결말 QA 담당 (spec 3.5).
- 순서: 한국어 → 비공개 아티팩트로 사용자 검토 → 확정 후 영어 → Pull Request. `main`에는 영어까지 끝난 뒤 합친다 (spec 3.7).
- 전체 테스트: `npm test` (70개에서 시작, 전부 유지). 브라우저 점검: `python3 scripts/browser_check.py`.
- 아티팩트: slug `b7a60298-8a64-4184-b445-4315623b0d59` (비공개). 게시 전 `get_artifact`로 현재 version 확인.

## Review Focus

1. 저장된 트랙 값이 깨졌거나 저장소가 막힘 → `general`로 시작, 강의 정상 동작. 테스트: Task 1 `loadTrack`.
2. 트랙을 바꾼 뒤 주소의 스텝 번호가 새 트랙의 스텝 수를 넘음 → 마지막 스텝으로 고정. 테스트: Task 3 DOM + Task 5 브라우저 (m).
3. 트랙 전용 스텝에서 트랙 전환 → 가장 가까운 앞쪽 공통 스텝으로, 첫 스텝이면 그대로. 테스트: Task 1 `switchIndex`.
4. 체크포인트에서 트랙 전환 → 새 트랙 문항으로 다시 표시, 답 초기화, 오류 없음. 테스트: Task 3 DOM.
5. 320px 화면에서 언어 버튼 + 트랙 버튼이 함께 있어도 가로 스크롤 없음, 영어 라벨 포함. 테스트: Task 5 브라우저 (a)(k) 확장.

---

### Task 1: 트랙 엔진

**Files:**
- Create: `js/engine/track.js`
- Test: `tests/track.test.js`

**Interfaces:**
- Produces:
  - `TRACKS = ['general', 'tech']`, `TRACK_KEY = 'agent-lifecycle-course:track'`
  - `loadTrack(storage: Storage|null) -> 'general'|'tech'` — 저장값이 TRACKS에 있으면 그 값, 아니면(없음·예외·엉뚱한 값) `'general'`.
  - `saveTrack(storage: Storage|null, track) -> void` — 예외 삼킴.
  - `visibleSteps(lesson, track) -> Step[]` — `step.track`이 없거나 `track`과 같은 스텝만, 원래 순서.
  - `visibleQuestions(lesson, track) -> Question[]` — 같은 규칙.
  - `switchIndex(lesson, fromTrack, fromIndex, toTrack) -> number` — `fromTrack`에서 보이는 `fromIndex`번째 스텝에서 출발해, 그 스텝이 공통이면 그 스텝, 전용이면 앞쪽으로 가장 가까운 공통 스텝을 찾아 `toTrack`에서 보이는 순서의 번호를 돌려준다. 앞에 공통 스텝이 없으면 0. `fromIndex`는 범위로 고정.

- [ ] **Step 1: 실패하는 테스트 작성** — 픽스처: 스텝 `[c0, g1(general), t1(tech), c1, t2(tech), c2]`.
  - `visibleSteps`: general → `[c0,g1,c1,c2]`, tech → `[c0,t1,c1,t2,c2]`; track 필드 없는 레슨은 두 트랙 모두 전체.
  - `visibleQuestions`: 공통 1 + general 1 + tech 1 → 각 트랙 2개.
  - `switchIndex`: (general,0→tech)=0; (general,1[g1]→tech)=0; (general,2[c1]→tech)=2; (tech,3[t2]→general)=2; (tech,4[c2]→general)=3; (tech,99→general)=3; (general,1→general)=1 (같은 트랙이면 그대로).
  - `loadTrack`: 저장값 `'tech'` → tech; 없음·`'x'`·getItem throw·null → general. `saveTrack` 후 `loadTrack` 왕복; setItem throw·null 예외 없음.
- [ ] **Step 2: `npm test` → FAIL (모듈 없음)**
- [ ] **Step 3: 구현**
- [ ] **Step 4: `npm test` → PASS**
- [ ] **Step 5: Commit** `feat: add track engine`

### Task 2: 점검 규칙 + 화면 문구

**Files:**
- Modify: `js/engine/lessonSchema.js`, `js/i18n/ui.js`
- Test: `tests/lessonSchema.test.js`, `tests/i18n.test.js`, `tests/fixtures.js`

**Interfaces:**
- Consumes: Task 1 `TRACKS`, `visibleSteps`, `visibleQuestions`.
- Produces:
  - `validateLesson(lesson, { requireEnglish = false, requireTracks = false } = {})`, `validateCourse(lessons, 같은 옵션)`. 변경: `track`이 있으면 TRACKS 중 하나여야 함; 스텝 수 검사를 "트랙별로 보이는 스텝 6–12개"로; 체크포인트 수 검사를 "트랙별로 보이는 문항 1–2개"로; `requireTracks`면 트랙마다 전용 스텝 1개 이상 + 트랙마다 전용 문항 1개 이상. 문장 수·수치·금지어·영어 규칙은 그대로 전체 스텝에 적용. 페르소나 규칙은 트랙별로 보이는 텍스트 기준.
  - `tests/fixtures.js`: `makeTrackLesson()` — `makeLesson()`에 general 전용 스텝 1개(인덱스 1 뒤), tech 전용 스텝 2개(인덱스 2 뒤, 마지막 앞), general·tech 전용 문항 각 1개(`id: 'qg'`, `'qt'`, 옵션 `x`/`y`, 정답 `x`)를 더한 레슨. 전용 스텝 캡션은 서로 다른 한국어 문장.
  - `UI` 추가 키(각 ko/en): `trackGeneral` (`일반 고객지원`/`General support`), `trackTech` (`기술지원`/`Tech support`), `trackLabel` (`직군`/`Team type`), `trackHint` (ko: `팀의 직군을 고르면 그 직군에 맞는 내용이 더해집니다.` en: `Pick your team type to add content for that kind of support.`).

- [ ] **Step 1: 실패하는 테스트 작성**
  - `makeTrackLesson()` + `{requireTracks:true}` → `[]`.
  - `makeLesson()` + `{requireTracks:true}` → "track" 포함 오류; 기본 옵션 → `[]` (기존 테스트 유지).
  - `track: 'vip'` → 오류.
  - 공통 스텝 11개 + general 2개 → general 13개로 오류, tech 11개는 통과(오류 메시지에 `general` 포함).
  - 공통 5개 + tech 1개 → general 5개 오류.
  - 한 트랙 문항이 3개 보이면 오류.
  - `UI` 새 키 4개가 ko·en 모두 비어 있지 않고 위 값과 일치.
- [ ] **Step 2: `npm test` → 새 테스트 FAIL**
- [ ] **Step 3: 구현** (기존 "steps must number 6-10" 테스트 기대값을 6–12에 맞게 갱신: 11개는 통과, 13개는 오류)
- [ ] **Step 4: `npm test` → PASS**
- [ ] **Step 5: Commit** `feat: validate track rules and add track UI strings`

### Task 3: 화면 — 트랙 버튼, 트랙별 레슨, 직군 라벨

**Files:**
- Create: `js/render/trackToggle.js`
- Modify: `js/render/lesson.js`, `js/render/home.js`, `js/app.js`, `index.html`, `css/styles.css`
- Test: `tests/render.test.js`

**Interfaces:**
- Consumes: Task 1 전부, Task 2 `UI` 키, `makeTrackLesson`.
- Produces:
  - `renderTrackToggle(root, track, lang, onChange(track)) -> void` — 버튼 `[data-track="general"]`, `[data-track="tech"]`, 현재 트랙 `aria-pressed="true"`, 그룹 `aria-label` = `UI.trackLabel`.
  - `renderLesson(root, lesson, stepIndex, lang, { onNavigate, onComplete, restore, track = 'general' })` — 스텝·문항은 `visibleSteps`/`visibleQuestions(lesson, track)`. 카운터·점·clamp·체크포인트 진입 모두 보이는 목록 기준. 현재 스텝에 `track`이 있으면 `[data-track-badge]`에 해당 직군 이름을 보이고, 공통이면 숨긴다. `snapshot()`은 `{ step, inCheckpoint, answers, track }`을 돌려주고, `restore.track`이 현재 `track`과 다르면 `answers`는 복원하지 않는다(체크포인트는 다시 연다).
  - `renderHome(root, lessons, progress, lang)` — 머리말 아래 `[data-track-hint]`에 `UI.trackHint`.
  - `index.html`: 상단에 `<div id="track"></div>` (언어 버튼 앞). `app.js`: `loadTrack`/`saveTrack`; 트랙 변경 시 — 레슨 화면이면 `switchIndex(lesson, 이전 트랙, 현재 스텝, 새 트랙)`으로 새 번호를 구해 다시 그리고 주소를 그 번호로 바꾼다(체크포인트가 열려 있었으면 열린 채로, 답은 초기화); 홈이면 버튼만 갱신.

- [ ] **Step 1: 실패하는 테스트 작성** (jsdom, `makeTrackLesson()`)
  - `general track hides tech steps`: track general → 카운터 `1 / 7`; tech → `1 / 8`.
  - `track badge on track-only steps`: general, 전용 스텝으로 이동 → `[data-track-badge]` 보임·텍스트 `일반 고객지원`; 공통 스텝 → 숨김. 영어 → `General support`.
  - `step index clamps to the track's count`: tech에서 stepIndex 99 → `8 / 8`; general → `7 / 7`.
  - `checkpoint shows common plus track question`: general → 문항 `q1`,`qg`만; tech → `q1`,`qt`만. 두 문항 모두 답해야 `onComplete` 1회.
  - `snapshot carries the track; restoring into another track reopens the checkpoint without answers`: general 체크포인트에서 `q1` 답 → snapshot → tech로 restore → 체크포인트 보임, `.is-correct` 없음, 연결 카드 숨김. 같은 트랙으로 restore하면 답 유지(기존 테스트 유지).
  - `track toggle reports the choice`: `[data-track="tech"]` 클릭 → `onChange('tech')` 1회, `aria-pressed` 확인, 영어일 때 버튼 글자 `Tech support`.
  - `home shows the track hint`: `[data-track-hint]` 텍스트 = `UI.trackHint.ko`.
  - 기존 렌더 테스트(트랙 인자 없이 호출)는 그대로 통과해야 한다.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 구현** — 스타일: 상단 바는 좁은 화면에서 줄바꿈(`flex-wrap`), 트랙 버튼은 언어 버튼과 같은 모양, 직군 라벨은 신호색(`--signal`) 작은 알약 모양.
- [ ] **Step 4: `npm test` → PASS**
- [ ] **Step 5: Commit** `feat: add track toggle and track-aware lesson view`

### Task 4: 한국어 내용 — 보완 2건 + 트랙 스텝·문항

**Files:**
- Modify: `js/lessons/01-hiring.js` … `06-career.js`, `js/lessons/build.js` (트랙 스텝·문항 헬퍼)
- Test: `tests/lessons.test.js`

**Interfaces:**
- Consumes: Task 2 `validateCourse(LESSONS, {requireTracks:true})`, Task 1 `visibleSteps`.
- Produces: `build.js`에 `trackStep(track, caption, show, highlight, persona)`와 `trackQuestion(track, question)` — 각각 `{...step, track}`, `{...question, track}`.

이 작업은 **한국어만** 쓴다(새 텍스트에 `en` 없음). 내용 범위는 spec 3.4(보완), 3.5 표(트랙), 3.7(일반 전용 스텝의 구체 내용), 3.8(티켓 단위).

- 레슨 2: 노드 `스킬 검증` 추가(`hard`/`soft`/`listen` → `verify` → `ready`로 엣지 재구성). 공통 스텝 2개 추가(검증의 뜻, 미달 시 보충 후 재평가·기준은 센터마다 다름). 기존 마지막 스텝과 연결 문구를 "검증 통과 후 실전"으로 수정. 트랙 스텝 각 1개.
- 레슨 4: 노드 `캘리브레이션` 추가(`qa`에 연결). 공통 스텝 2개 추가(캘리브레이션 1, 상품·정책 변경 시 지식 재확인 1). 트랙 스텝 각 1개 → 트랙별 12개.
- 레슨 1·3·5·6: 트랙 스텝 각 1–2개(필요하면 전용 노드 추가).
- 모든 레슨: 트랙 전용 문항 각 1개(옵션 3개, 해설 포함).

- [ ] **Step 1: 실패하는 테스트 작성** (`lessonText`는 한국어 기준)
  - `course is valid with tracks`: `validateCourse(LESSONS, {requireTracks:true})` → `[]`. (기존 `requireEnglish:true` 테스트는 Task 6까지 `test.todo`로 표시하고 Task 6에서 되살린다.)
  - `skills verification gates go-live`: `onboarding`에 노드 id `verify`, 공통 캡션에 "스킬 검증"과 "재평가", "센터마다" 포함.
  - `calibration added to coaching`: `coaching`에 노드 id `calibration`, 공통 캡션에 "캘리브레이션"과 "각자" 포함; 다른 공통 캡션에 "다시 확인" 포함.
  - `tech track speaks in tickets`: 6개 레슨의 tech 전용 캡션을 합친 글에 "티켓" 포함, `nesting` tech 캡션에 "에스컬레이션", `career` tech 캡션에 "2차".
  - `general track adds what common steps lack`: `coaching` general 캡션에 "정책", `career` general 캡션에 "전문 상담".
  - `no COPC wording`: 전체 텍스트에 "COPC" 없음.
  - `Jimin ends in QA on both tracks`: `career`의 두 트랙 각각 보이는 텍스트에 "QA"와 "지민" 포함.
  - 기존 한국어 내용 테스트 전부 유지.
- [ ] **Step 2: `npm test` → 새 테스트 FAIL**
- [ ] **Step 3: 레슨 1–3 작성, 중간 `npm test`로 해당 레슨 오류 없음 확인**
- [ ] **Step 4: 레슨 4–6 작성**
- [ ] **Step 5: `npm test` → PASS (todo 1개 제외)**
- [ ] **Step 6: Commit** `feat: add verification, calibration, and track content (Korean)`

### Task 5: 브라우저 점검 + 비공개 미리보기 + 한국어 검토

**Files:**
- Modify: `scripts/browser_check.py`

- [ ] **Step 1: 점검 추가 후 실행 → 새 항목이 실제로 검사되는지 확인** — (a)(k) 폭 점검을 두 트랙 모두로 확장하고 영어+기술지원 320px 포함; (l) 트랙 선택이 새로고침 후 유지; (m) tech로 `#coaching-11` 연 뒤 general 전환 → 카운터가 범위 안이고 오류 없음; (n) 체크포인트에서 트랙 전환 → 체크포인트 유지·답 초기화; (g) 영어 화면의 번역 안내 기대값을 일시적으로 True(새 한국어 스텝이 있으므로). 고의로 깨뜨린 값(예: 기대 카운터)을 넣어 FAIL을 한 번 본 뒤 되돌린다.
- [ ] **Step 2: `python3 scripts/browser_check.py` → `ALL CHECKS PASSED`, `npm test` PASS. 390폭 기술지원 레슨 스크린샷 1장 확인**
- [ ] **Step 3: Commit** `test: extend browser checks for tracks`
- [ ] **Step 4: 아티팩트 재게시**(변경 파일 + 새 파일 `js/engine/track.js`, `js/render/trackToggle.js`) — 비공개 유지
- [ ] **Step 5: 사용자에게 한국어 문안 검토 요청** — 새로 쓴 스텝·문항과 수정한 기존 문장 2곳을 목록으로 제시. **사용자가 확정할 때까지 Task 6 시작 금지.**

### Task 6: 영어 번역 + Pull Request

**Files:**
- Modify: `js/lessons/*.js` (새 텍스트에 `en`), `scripts/browser_check.py`, `tests/lessons.test.js`, `agent-lifecycle/README.md`

- [ ] **Step 1: 실패하는 테스트** — `requireEnglish` todo를 되살려 `validateCourse(LESSONS, {requireEnglish:true, requireTracks:true})` → `[]`; 영어 내용: `onboarding` en에 "skills verification", `coaching` en에 "calibration", tech 캡션 합친 글에 "ticket", `nesting` tech en에 "escalat", 전체 en에 "COPC" 없음.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 번역 추가** (용어: skills verification, calibration, ticket, escalation, Tier 2/Tier 3, knowledge base; 지민은 she)
- [ ] **Step 4: `npm test` PASS; browser_check (g) 기대값을 False로 되돌리고 `ALL CHECKS PASSED`; 영어 기술지원 390폭 스크린샷 확인**
- [ ] **Step 5: README에 트랙 설명 3줄, Commit** `feat: add English for tracks and additions`
- [ ] **Step 6: 아티팩트 재게시, 브랜치 push, Pull Request 생성, 사용자에게 영어 검토와 병합 요청**
