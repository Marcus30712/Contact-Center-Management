# 상담사 라이프사이클 인터랙티브 강의 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 신입 팀장이 6단계 상담사 라이프사이클을 애니메이션 다이어그램으로 한 스텝씩 배우는 한국어/영어 정적 웹 강의를 만들어 비공개 Claude 아티팩트로 게시한다.

**Architecture:** 빌드 없는 정적 사이트(ES 모듈). 레슨은 데이터 파일(`js/lessons/*.js`)이고, 순수 로직 엔진(`js/engine/`)과 DOM 렌더러(`js/render/`)가 이를 재생한다. 해시 라우팅(`#/`, `#/lesson/<id>/<step>`)으로 페이지 이동 없이 동작해 아티팩트와 GitHub Pages/Vercel 양쪽에서 그대로 돈다.

**Tech Stack:** HTML/CSS/바닐라 JS(ES2022 모듈), 인라인 SVG + CSS transition. 테스트: `node --test`(Node 22), `jsdom`(devDependency), 브라우저 확인은 Python Playwright(Chromium).

**Spec:** `docs/superpowers/specs/2026-11-18-agent-lifecycle-course-design.md`

## Global Constraints

- 한국어/영어 두 언어. 모든 사용자 노출 텍스트는 `{ ko: string, en?: string }` 형태. 영어 인물명 "Jimin Han", 영어 수치 표시는 "Example" (spec 4.6).
- COPC 등 외부 표준 내용 넣지 않음 (spec 3 비목표).
- 외부 CDN·폰트·서비스·아티팩트 전용 기능 의존 금지 (spec 4.4). 런타임 의존성 0개.
- 같은 파일을 그대로 GitHub Pages/Vercel에 올려 동작해야 한다 — 상대 경로만 사용.
- 레슨 6개, 각 6–10 스텝. 스텝 캡션 2–3문장 이내 (spec 3).
- "진상" 단어 금지 → "불만 고객/악성 민원" (spec 3).
- 퍼센트·수치가 들어간 캡션은 "예시"를 포함 (spec 3).
- Shrinkage = 결근·휴식·교육·회의 등 콜을 받을 수 없는 모든 시간의 비율. "결근율"로 정의 금지 (spec 4.3).
- 공통 인물 "한지민"이 6개 레슨 모두에 등장. 6단계에서 QA 담당으로 성장, 동료의 퇴사 면담이 1단계 채용으로 순환 (spec 4.5).
- 원문에 없는 세부 기준은 단정하지 말고 "센터마다 다름"으로 표기 (spec 4.5).
- 진행 상황 저장 실패 시에도 정상 동작 (spec 4.2).
- 전체 테스트 명령: `npm test` (= `node --test tests/`).

## Review Focus

1. 잘못된 주소(`#/lesson/없는id`, 스텝 번호 범위 밖, 문자) → 홈으로 가거나 스텝을 범위 안으로 맞춘다. 테스트: Task 1 `parseRoute` 케이스.
2. localStorage가 없거나 예외를 던지거나 JSON이 깨짐 → 진행 상황 빈 상태로 강의 정상 동작. 테스트: Task 2 `progress` 케이스.
3. 320px 폭 화면 → 가로 스크롤 없음, 다이어그램이 화면에 맞게 축소. 테스트: Task 6 Playwright 320/390/1280 폭 점검.
4. 첫/마지막 스텝에서 이전/다음 연타, 키보드 ←/→ → 범위 고정, 마지막 스텝 다음에 체크포인트 표시, 오류 없음. 테스트: Task 1 player 경계 + Task 5 DOM 테스트.
5. 영어 번역 전 English 선택 / 저장된 언어 값이 깨짐 → 한국어 문안 + "Translation coming soon" 안내, 오류 없음. 테스트: Task 2 `t`·`loadLang` 케이스 + Task 5 DOM 테스트.

(체크포인트 답 바꾸기는 Task 5 테스트 `re-answering replaces explanation`에서 다룸.)

---

### Task 1: 프로젝트 골격 + 플레이어·라우터

**Files:**
- Create: `package.json` (`"type":"module"`, `"scripts":{"test":"node --test tests/"}`, devDependency `jsdom`), `.gitignore` (`node_modules/`)
- Create: `js/engine/player.js`, `js/engine/router.js`
- Test: `tests/player.test.js`, `tests/router.test.js`

**Interfaces:**
- Produces:
  - `createPlayer(stepCount: number, startIndex = 0) -> { index: number, atStart: boolean, atEnd: boolean, next(): void, prev(): void, goTo(i: number): void }` — index는 항상 `[0, stepCount-1]`로 고정(clamp).
  - `parseRoute(hash: string, lessonIds: string[]) -> {view:'home'} | {view:'lesson', id: string, step: number}` — step은 0 기반, 파싱 불가/음수는 0. 상한 clamp는 호출자 몫.
  - `lessonHref(id: string, step = 0) -> string` — `#/lesson/<id>/<step>`.

- [ ] **Step 1: 실패하는 테스트 작성**
  - `player clamps at both ends`: `createPlayer(3)`; `prev()` 후 index 0, atStart true; `next()`×5 후 index 2, atEnd true.
  - `player goTo clamps`: `goTo(99)` → 2, `goTo(-4)` → 0, `createPlayer(3, 7).index` → 2.
  - `parseRoute`: `''`, `'#/'`, `'#/foo'` → home; `'#/lesson/hiring'` → `{view:'lesson',id:'hiring',step:0}`; `'#/lesson/hiring/4'` → step 4; `'#/lesson/hiring/abc'`·`'/-2'` → step 0; `'#/lesson/nope/1'` (ids에 없음) → home.
  - `lessonHref('career', 3) === '#/lesson/career/3'`.
- [ ] **Step 2: `npm install && npm test` → FAIL (모듈 없음)**
- [ ] **Step 3: `player.js`, `router.js` 구현**
- [ ] **Step 4: `npm test` → 전부 PASS**
- [ ] **Step 5: Commit** `feat: scaffold project with player and router`

### Task 2: 진행 상황·언어 저장 + 체크포인트 채점

**Files:**
- Create: `js/engine/progress.js`, `js/engine/quiz.js`, `js/engine/i18n.js`, `js/i18n/ui.js`
- Test: `tests/progress.test.js`, `tests/quiz.test.js`, `tests/i18n.test.js`

**Interfaces:**
- Produces:
  - `PROGRESS_KEY = 'agent-lifecycle-course:v1'`
  - `loadProgress(storage: Storage|null) -> { completed: string[] }` — 저장소 없음/예외/깨진 JSON/형식 불일치 → `{completed: []}`.
  - `markComplete(storage: Storage|null, lessonId: string) -> { completed: string[] }` — 중복 없이 추가, 저장 예외는 삼키고 갱신된 객체 반환.
  - `gradeAnswer(question: {options:{id,text}[], answer: string}, optionId: string) -> { correct: boolean }` — 없는 optionId → `correct:false`. (해설 텍스트는 렌더러가 `t()`로 꺼냄)
  - `LANG_KEY = 'agent-lifecycle-course:lang'`
  - `loadLang(storage: Storage|null, navigatorLanguage: string) -> 'ko'|'en'` — 저장값이 `'ko'|'en'`이면 그 값, 아니면(없음/예외/엉뚱한 값) `navigatorLanguage`가 `ko`로 시작하면 `'ko'`, 그 외 `'en'`.
  - `saveLang(storage: Storage|null, lang: 'ko'|'en') -> void` — 예외 삼킴.
  - `t(text: {ko: string, en?: string}, lang: 'ko'|'en') -> { text: string, fallback: boolean }` — en 요청인데 en 없거나 빈 문자열 → `{text: ko, fallback: true}`.
  - `UI` (`js/i18n/ui.js`): `{ prev, next, home, stepCounter, checkpoint, nextLesson, done, translationComing, langKo, langEn }` 각 `{ko, en}`. `translationComing.en === 'Translation coming soon'`.

- [ ] **Step 1: 실패하는 테스트 작성**
  - 가짜 저장소(Map 기반) 왕복: `markComplete(s,'hiring')` 두 번 → `completed` `['hiring']`.
  - `loadProgress(null)`, getItem이 throw하는 저장소, `'{broken'` 값, `'{"completed":"x"}'` 값 → 모두 `{completed: []}`.
  - setItem이 throw해도 `markComplete`가 throw하지 않고 `['hiring']` 반환.
  - `gradeAnswer`: 정답 → `{correct:true}`, 오답 → false, 없는 id → false.
  - `loadLang`: 저장값 `'en'` + 브라우저 `'ko-KR'` → `'en'`; 저장값 없음 + `'ko-KR'` → `'ko'`; 저장값 없음 + `'en-US'` → `'en'`; 저장값 `'fr'` 또는 getItem throw + `'en-US'` → `'en'`; `saveLang` setItem throw → 예외 없음.
  - `t`: `({ko:'가',en:'A'},'en')` → `{text:'A',fallback:false}`; `({ko:'가'},'en')`·`({ko:'가',en:''},'en')` → `{text:'가',fallback:true}`; `({ko:'가',en:'A'},'ko')` → `'가'`, false.
  - `UI` 모든 값이 ko·en 둘 다 비어있지 않음.
- [ ] **Step 2: `npm test` → 새 테스트 FAIL**
- [ ] **Step 3: 구현**
- [ ] **Step 4: `npm test` → 전부 PASS**
- [ ] **Step 5: Commit** `feat: add progress/language storage, i18n, and quiz grading`

### Task 3: 레슨 스키마 검증기

**Files:**
- Create: `js/engine/lessonSchema.js`, `js/lessons/index.js` (빈 배열 `LESSONS` 내보내기로 시작)
- Test: `tests/lessonSchema.test.js`

**Interfaces:**
- Produces: 레슨 객체 형태 (Task 4·5가 사용)
  ```js
  // Text = { ko: string, en?: string }
  {
    id: 'hiring', order: 1, title: Text, subtitle: Text,
    diagram: { nodes: [{ id, label: Text, x, y }], edges: [{ id, from, to }] }, // viewBox 0 0 360 240 좌표
    steps: [{ caption: Text, show: string[], highlight: string[], persona: string|null }], // persona = 지민이 서 있을 node id
    checkpoint: [{ id, prompt: Text, options: [{ id, text: Text }], answer, explanation: Text }],
    connection: { to: string, text: Text } // to = 다음 레슨 id (6단계는 'hiring')
  }
  ```
  - `validateLesson(lesson, { requireEnglish = false } = {}) -> string[]` — 오류 메시지 목록(빈 배열이면 통과). 구조 검사: 필수 필드; 스텝 6–10개; `show`/`highlight`/`persona`가 존재하는 node id; edge from/to 존재; 체크포인트 1–2개, options ≥ 2, `answer`가 options에 존재; connection.to 존재. 텍스트 검사(언어별 규칙 `RULES = { ko: {example:'예시', persona:'지민'}, en: {example:'Example', persona:'Jimin'} }`): 모든 Text에 `ko` 필수, `requireEnglish`면 `en`도 필수; 존재하는 각 언어마다 캡션 문장 수 ≤ 3(`.`, `?`, `!` 기준), `%` 또는 숫자+단위(`분|명|주|일|초|min|people|week|day|sec`) 캡션은 해당 언어 example 단어 포함, 캡션·체크포인트 어딘가에 persona 단어 포함, explanation 비어있지 않음; ko 텍스트에 "진상" 없음.
  - `validateCourse(lessons, { requireEnglish = false } = {}) -> string[]` — 각 레슨 오류 + 정확히 6개, order 1–6, id 고유, connection.to가 order상 다음 레슨(6번은 1번).
- [ ] **Step 1: 실패하는 테스트 작성** — 유효한 최소 레슨 픽스처 1개(`tests/fixtures.js`, ko만)로 `[]`를 확인하고, 한 군데씩 깨뜨린 케이스마다 해당 오류 확인: 스텝 5개, ko 4문장 캡션, 없는 node id, answer 불일치, "진상" 포함, "30%" 캡션에 예시 없음, 지민 없음. 영어: ko만인 픽스처 + `requireEnglish:true` → en 누락 오류; en이 있는데 "30%"에 Example 없음 → 오류(기본 옵션에서도). `validateCourse`: 5개 → 오류, connection 순서 틀림 → 오류.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 구현**
- [ ] **Step 4: `npm test` → PASS**
- [ ] **Step 5: Commit** `feat: add lesson schema validation`

### Task 4: 레슨 콘텐츠 6개

**Files:**
- Create: `js/lessons/01-hiring.js`, `02-onboarding.js`, `03-nesting.js`, `04-coaching.js`, `05-retention.js`, `06-career.js` (각각 `export default` 레슨 객체)
- Modify: `js/lessons/index.js` — 6개를 order 순서로 `LESSONS`에 담기
- Test: `tests/lessons.test.js`, `tests/helpers.js`

**Interfaces:**
- Consumes: Task 3의 레슨 형태, `validateCourse`.
- Produces (테스트용): `lessonText(lesson, lang: 'ko'|'en') -> string` — 레슨의 모든 Text에서 해당 언어 값을 공백으로 이어붙임.
- Produces: `LESSONS: Lesson[]` (id: `hiring`, `onboarding`, `nesting`, `coaching`, `retention`, `career`).

이 작업은 **한국어(`ko`)만** 쓴다. 영어는 Task 8. 내용 근거는 spec 부록 B 원문. 각 레슨은 원문 불릿을 모두 다루고, 지민이 그 단계를 겪는 장면 + 팀장이 할 일을 보여준다. 결말 복선: `coaching`에서 지민의 QA 적성 발견, `career`에서 지민 QA 전환 + 동료 퇴사 면담 → 채용 개선.

- [ ] **Step 1: 실패하는 테스트 작성**
  - `course is valid`: `validateCourse(LESSONS)` → `[]`.
  - 아래 텍스트 검사는 모두 각 Text의 `.ko`를 이어붙인 문자열 기준. 테스트 헬퍼 `lessonText(lesson, lang)`을 `tests/helpers.js`에 두고 Task 8도 재사용.
  - `shrinkage defined correctly`: `coaching` 레슨 텍스트 전체에 "Shrinkage"가 있고, 같은 캡션에 "휴식"과 "교육" 포함, "결근율(Shrinkage)" 문자열 없음.
  - `RJP links to early attrition`: `hiring` 텍스트에 "RJP"와 "조기 퇴사" 포함.
  - `nesting marked highest attrition`: `nesting` 텍스트에 "이직" 포함.
  - `career closes the loop`: `career` 텍스트에 "QA"와 "퇴사 면담" 포함, `connection.to === 'hiring'`.
  - `hang-up authority hedged`: "선끊기"가 나오는 캡션에 "센터마다" 포함.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 레슨 1–3 작성 → `npm test`로 해당 레슨 오류만 남지 않음 확인**
- [ ] **Step 4: 레슨 4–6 작성**
- [ ] **Step 5: `npm test` → 전부 PASS**
- [ ] **Step 6: Commit** `feat: add six lifecycle lessons`

### Task 5: 렌더러 (홈 · 레슨 · 다이어그램 · 체크포인트)

**Files:**
- Create: `js/render/diagram.js`, `js/render/home.js`, `js/render/lesson.js`
- Test: `tests/render.test.js` (jsdom)

**Interfaces:**
- Consumes: Task 1 `createPlayer`, `lessonHref`; Task 2 `gradeAnswer`, `t`, `UI`; Task 3 레슨 형태; Task 4 `LESSONS`.
- Produces (모든 렌더러는 `lang: 'ko'|'en'`를 받고 텍스트는 `t()`로 꺼낸다. `fallback:true`인 텍스트가 화면에 하나라도 있으면 `[data-translation-note]`에 `UI.translationComing` 표시. 문서 `lang` 속성도 갱신):
  - `renderLangToggle(root: HTMLElement, lang, onChange(lang)) -> void` — 버튼 2개 `[data-lang="ko"]`, `[data-lang="en"]`, 현재 언어에 `aria-pressed="true"`.
  - `renderDiagram(svg: SVGSVGElement, diagram, step, lang) -> void` — 최초 호출 시 노드(`g[data-node=<id>]`)·엣지(`[data-edge=<id>]`)·지민 마커(`[data-persona]`)를 만들고, 이후 호출은 클래스만 바꾼다: `show`에 없는 요소 `is-hidden`, `highlight` 요소 `is-active`, 지민 마커는 persona 노드 좌표로 transform(null이면 숨김). 애니메이션은 CSS transition.
  - `renderHome(root: HTMLElement, lessons, progress, lang) -> void` — 원형 라이프사이클 SVG에 6개 단계 링크(`a[href="#/lesson/<id>/0"]`), 6→1 순환 화살표(`[data-edge="loop"]`), 완료 레슨 `is-done`.
  - `renderLesson(root: HTMLElement, lesson, stepIndex: number, lang, { onNavigate(href), onComplete(id) }) -> { destroy(): void }` — 다이어그램 + 캡션 + 진행 표시(`n / 총`) + 이전/다음 버튼 + ←/→ 키. 마지막 스텝에서 "다음" → 체크포인트 화면; 체크포인트 답을 고르면 해설 1개 표시(다시 고르면 교체); 모든 문항에 답하면 연결 카드 + "다음 레슨" 링크 표시하고 `onComplete(id)` 호출. 스텝 이동 시 `onNavigate(lessonHref(id, i))`.
- [ ] **Step 1: 실패하는 테스트 작성** (jsdom `window`/`document` 주입)
  - `home lists six stages and loop`: 링크 6개, href 순서 일치, `[data-edge="loop"]` 존재; progress `{completed:['hiring']}` → 첫 단계 `is-done`.
  - `diagram classes follow step`: 스텝 A → B 렌더 시 숨김/활성 클래스가 바뀌고 노드 요소 수는 그대로(재생성 안 함).
  - `lesson shows first caption and counter`: 캡션 텍스트 = `steps[0].caption`, 카운터 `1 / N`.
  - `next/prev clamp and navigate`: 첫 스텝 이전 클릭 → `onNavigate` 미호출 또는 같은 href; 다음 → `#/lesson/<id>/1`; ArrowRight 키도 동일.
  - `last step leads to checkpoint`: 마지막 스텝에서 다음 → 체크포인트 prompt 표시.
  - `re-answering replaces explanation`: 오답 클릭 후 정답 클릭 → 해설 요소 1개, 정답 표시.
  - `answering all completes lesson`: 전 문항 답 → `onComplete('hiring')` 1회, 연결 카드 텍스트 = `connection.text.ko`.
  - `english with translation`: en이 채워진 픽스처를 `'en'`으로 렌더 → 캡션 = en 문자열, 이전/다음 버튼 = `UI.prev.en`/`UI.next.en`, `[data-translation-note]` 비어 있음.
  - `english fallback note`: ko만인 픽스처를 `'en'`으로 렌더 → 캡션 = ko 문자열, `[data-translation-note]` = `'Translation coming soon'`, 버튼은 영어.
  - `lang toggle`: `renderLangToggle` 후 `[data-lang="en"]` 클릭 → `onChange('en')` 1회, 현재 언어 버튼 `aria-pressed="true"`.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 세 렌더러 구현**
- [ ] **Step 4: `npm test` → 전부 PASS**
- [ ] **Step 5: Commit** `feat: add home, lesson, and diagram renderers`

### Task 6: 앱 셸, 스타일, 브라우저 점검

**Files:**
- Create: `index.html` (`<main id="app">`, `<script type="module" src="./js/app.js">`), `js/app.js`, `css/styles.css`
- Create: `scripts/browser_check.py`
- Test: `scripts/browser_check.py` (Playwright)

**Interfaces:**
- Consumes: Task 1 `parseRoute`, Task 2 `loadProgress`/`markComplete`/`loadLang`/`saveLang`, Task 4 `LESSONS`, Task 5 렌더러.
- Produces: `js/app.js` — 시작 시 `loadLang(storage, navigator.language)`; 상단에 언어 전환 버튼(언어 바꾸면 `saveLang` 후 현재 화면 다시 렌더, 스텝 유지); `hashchange`마다 `parseRoute` → 홈 또는 레슨 렌더(스텝은 레슨 길이로 clamp); `localStorage` 접근은 try/catch로 감싸 실패 시 `null` 전달.

스타일: 모바일 우선(다이어그램 위·캡션 아래), 768px 이상에서 넓게. SVG `width:100%; height:auto`. `prefers-reduced-motion`이면 transition 끔. 색·글꼴은 시스템 글꼴, 제작자 재량.

- [ ] **Step 1: `scripts/browser_check.py` 작성** — `python3 -m http.server`로 서빙 후 Chromium으로 확인: (a) 320·390·1280 폭에서 홈과 각 레슨 0번 스텝 `document.documentElement.scrollWidth <= innerWidth`; (b) 콘솔 오류 0개; (c) `#/lesson/nope/3` → 홈 링크 6개 표시; (d) `#/lesson/hiring/99` → 마지막 스텝 카운터; (e) localStorage를 throw하도록 막은 컨텍스트에서 홈 렌더 정상; (g) `ko-KR` 컨텍스트 첫 방문 → 한국어, `en-US` 컨텍스트 → 영어 버튼 문구 + "Translation coming soon"; (h) 레슨 3번째 스텝에서 English 클릭 → 같은 스텝 유지, 새로고침 후에도 English 유지; (f) 390폭 홈·레슨 스크린샷을 `scripts/out/`에 저장. 실패 항목 이름을 출력하고 exit 1.
- [ ] **Step 2: 실행 → FAIL (index.html 없음)** `python3 scripts/browser_check.py` (Chromium 없으면 `python3 -m playwright install chromium`)
- [ ] **Step 3: `index.html`, `app.js`, `styles.css` 구현**
- [ ] **Step 4: `python3 scripts/browser_check.py` → `ALL CHECKS PASSED`, `npm test` → PASS. 스크린샷을 직접 열어 겹침·잘림 없는지 확인**
- [ ] **Step 5: Commit** `feat: wire app shell and responsive styles` (`scripts/out/`는 .gitignore)

### Task 7: 아티팩트 게시 + 사용자 문안 검토

**Files:**
- 게시 대상: `index.html`, `css/styles.css`, `js/**/*.js` (tests·scripts·package 파일 제외)
- Create: `README.md`

- [ ] **Step 1: `npm test`와 `python3 scripts/browser_check.py` 전체 통과 출력 확인**
- [ ] **Step 2: 아티팩트 guide(pages) 확인 후 `publish_files`로 비공개 게시** (제목 "상담사 라이프사이클 — 신입 팀장 강의"), 게시된 페이지에서 홈→레슨 1 이동이 되는지 확인
- [ ] **Step 3: 사용자에게 링크 전달 + 한국어 레슨 문안 검토 요청** (spec 4.5: 비공개 상태로 검토받고, 수정 사항은 레슨 데이터만 고쳐 재게시). **사용자가 한국어 문안 확정을 말할 때까지 Task 8 시작 금지.**
- [ ] **Step 4: Commit** `chore: record published artifact` (README에 아티팩트 링크와 GitHub 배포 방법 3줄)

### Task 8: 영어 번역 (한국어 확정 후)

**Files:**
- Modify: `js/lessons/01-hiring.js` … `06-career.js` — 모든 Text에 `en` 추가
- Modify: `tests/lessons.test.js`

**Interfaces:**
- Consumes: Task 3 `validateCourse(lessons, {requireEnglish:true})`, Task 4 `lessonText(lesson, lang)`.

번역 원칙: 확정된 한국어의 의미를 그대로 옮기되 자연스러운 업계 영어(AHT, FCR, CSAT, Shrinkage, nesting, floor walking, RJP, exit interview). "불만 고객/악성 민원" → "frustrated customers / abusive callers". 인물명 "Jimin Han".

- [ ] **Step 1: 실패하는 테스트 추가**
  - `course is valid in English`: `validateCourse(LESSONS, {requireEnglish:true})` → `[]`.
  - Task 4의 내용 테스트를 en으로도: `coaching` en에 "Shrinkage"·"break"·"training" 포함, "absenteeism (Shrinkage)" 없음; `hiring` en에 "RJP"·"early attrition"; `nesting` en에 "attrition"; `career` en에 "QA"·"exit interview"; "hang up" 캡션에 "varies by center".
- [ ] **Step 2: `npm test` → FAIL (en 누락)**
- [ ] **Step 3: 레슨 6개 번역 추가**
- [ ] **Step 4: `npm test` PASS + `python3 scripts/browser_check.py` PASS ((g)의 "Translation coming soon" 기대값을 "안내 없음"으로 갱신) + 영어 화면 390폭 스크린샷 확인 (긴 영어 단어 넘침 없음)**
- [ ] **Step 5: 아티팩트 재게시, 사용자에게 영어 검토 요청**
- [ ] **Step 6: Commit** `feat: add English translation`
