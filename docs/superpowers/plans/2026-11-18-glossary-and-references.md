# 용어집과 참고 자료 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Knowledge Base 첫 화면에 한국어/영어 용어집(43개 용어, 검색·분류)과 참고 자료 페이지를 더하고, 강의에서 첫 화면으로 돌아오는 링크를 넣는다.

**Architecture:** 정적 페이지 두 개(`glossary/`, `references/`). 용어는 `glossary/terms.js` 데이터 파일에, 검색·분류·검증은 순수 함수(`glossary/filter.js`, `glossary/schema.js`)에, 화면은 `glossary/render.js`에 둔다. 언어 선택·버튼·색 토큰은 강의의 모듈과 스타일시트를 상대 경로로 불러 쓴다.

**Tech Stack:** 바닐라 JS ES 모듈, `node --test` + jsdom(강의의 `agent-lifecycle/` 테스트 묶음에 추가), Python Playwright(시스템 Chrome).

**Spec:** `docs/superpowers/specs/2026-11-18-glossary-and-references-design.md`

> 실행 중 변경: 한국어 검토에서 사용자가 OJT를 추가해 용어는 44개(절차 12개)가 되었다. 아래 본문의 "43개"와 "process 11"은 계획 시점의 수치다.

## Global Constraints

- 경로는 저장소 루트 기준. 테스트 명령은 `agent-lifecycle/`에서 `npm test`, `python3 scripts/browser_check.py`.
- 모든 링크와 import는 상대 경로 (GitHub Pages의 `/Contact-Center-Management/` 아래에서 동작해야 함). 폴더 링크는 끝에 `/`를 붙인다.
- 용어 43개, 분류 4개: `metric` 14, `role` 11, `process` 11, `tool` 7 (spec 3.4의 목록과 순서 그대로).
- 정의는 3문장 이내, 수치 금지, "진상" 금지, 조직마다 다른 것은 "센터마다" 표기 (spec 2, 3.5).
- Shrinkage 세 항목과 채널별 기록 세 항목은 spec 3.1의 사용자 정의를 따른다. Unplanned의 예시에 결근, 지각, 병가, 입원, 장례식을 모두 넣는다.
- RTA = Real-Time Analyst, WFM = Workforce Management, FTE = 상담 인력 규모의 단위 (spec 3.6). 직급 표기는 Agent(상담사), SME, Team Lead(팀장), Assistant Manager(부매니저), Operation Manager(매니저).
- 참고 자료 페이지에 외부 표준(ISO 18295, COPC, HDI, ICMI)과 특정 국가 법령을 싣지 않는다. 개인정보는 이름 "Marcus Shim"만.
- Codex 소개 문장은 spec 3.7 그대로. PDF는 `references/BPO_Contact_Center_Operation_Codex_2.0.pdf`.
- 언어 저장 키는 강의와 같다 (`loadLang`/`saveLang` 재사용). 처음 방문은 한국어.
- **커밋과 푸시는 사용자 승인 후에만 한다.** 각 작업은 작업 트리에 변경만 남기고, Task 5 끝에서 한 번에 승인을 받아 커밋한다. 병합은 따로 승인받는다.
- 순서: 한국어 정의 → 사용자 검토·확정 → 영어.

## Review Focus

1. 검색어에 정규식 문자(`(`, `[`, `*`), 앞뒤 공백, 대소문자 섞임 → 오류 없이 글자 그대로, 공백 제거, 대소문자 무시로 찾는다. 테스트: Task 1 `filterTerms`.
2. 주소의 용어 id가 없거나 엉뚱함(`#nope`, `#home`) → 오류 없이 전체 목록. 테스트: Task 2 DOM + Task 3 브라우저.
3. 브라우저 저장소가 막힘 → 한국어로 열리고 언어 전환은 방문 중 동작. 테스트: Task 3 브라우저.
4. 320px 화면에서 긴 영어 이름·검색창·분류 버튼이 가로 스크롤을 만들지 않음. 테스트: Task 3 브라우저 (Task 5에서 영어로 재확인).
5. GitHub Pages 하위 경로에서 `../agent-lifecycle/...` 불러오기와 페이지 간 링크가 동작. 테스트: Task 3 브라우저 점검을 하위 경로(`/kb/`)로 서빙해 확인.

---

### Task 1: 용어 검증과 검색 (순수 함수)

**Files:**
- Create: `glossary/schema.js`, `glossary/filter.js`, `glossary/terms.js` (빈 배열 `TERMS`로 시작)
- Test: `agent-lifecycle/tests/glossary.test.js`

**Interfaces:**
- Produces:
  - `CATEGORIES = ['metric', 'role', 'process', 'tool']`
  - 용어 형태: `{ id, category, term, name: {ko, en?}, definition: {ko, en?}, seen: string[] }`
  - `validateTerms(terms, { requireEnglish = false, lessonIds = [] } = {}) -> string[]` — 오류 목록. 검사: id가 `^[a-z0-9-]+$`이고 고유, `home` 등 예약어(`home`, `settings`, `sidebar`, `customize`, `upgrade`, `downloads`) 아님; category가 CATEGORIES 중 하나; `term`·`name.ko`·`definition.ko` 비어 있지 않음; `requireEnglish`면 `name.en`·`definition.en`도; 각 언어 정의 문장 수 ≤ 3(`.`, `?`, `!` 뒤 공백/끝 기준); 정의에 `%` 또는 숫자+단위(`분|명|초|주|일|min|people|sec|week|day`) 없음; ko 텍스트에 "진상" 없음; `seen`의 값이 모두 `lessonIds`에 있음.
  - `filterTerms(terms, { query = '', category = 'all', lang = 'ko' }) -> Term[]` — category가 `'all'`이 아니면 그 분류만; query는 앞뒤 공백 제거 후 대소문자 무시 부분 일치로 `term`, `name.ko`, `name.en`, 현재 언어 정의(없으면 ko)에서 찾음; 빈 query는 전체. 원래 순서 유지.
  - `findTerm(terms, hash: string) -> Term | null` — `#aht` 또는 `aht`를 받아 id가 일치하는 용어, 없으면 null.

- [ ] **Step 1: 실패하는 테스트 작성** — 픽스처 용어 3개(`aht` metric, `sme` role, `call-recording` tool; ko·en 모두 있음).
  - `validateTerms(fixture, {requireEnglish:true, lessonIds:['coaching']})` → `[]`.
  - 하나씩 깨뜨려 오류 확인: 중복 id, id `AHT`, id `home`, category `x`, `name.ko` 없음, `requireEnglish`에서 `definition.en` 없음, 4문장 정의, 정의에 `30%`, 정의에 "진상", `seen: ['nope']`.
  - `filterTerms`: query `'aht'`·`' AHT '` → aht만; `'평균'`(ko 이름) → aht; `'recording'` → call-recording; category `'role'` → sme만; query `'('`·`'[a'`·`'*'` → 예외 없이 `[]`; 빈 query + `'all'` → 3개, 순서 유지; lang `'en'`일 때 영어 정의 속 단어로 찾음.
  - `findTerm`: `'#aht'`·`'aht'` → aht; `'#nope'`·`''`·`'#home'` → null.
- [ ] **Step 2: `npm test` → FAIL (모듈 없음)**
- [ ] **Step 3: 구현**
- [ ] **Step 4: `npm test` → PASS**

### Task 2: 용어집 화면

**Files:**
- Create: `glossary/render.js`, `glossary/glossary.js`, `glossary/index.html`, `glossary/glossary.css`
- Test: `agent-lifecycle/tests/glossary.test.js` (jsdom, 기존 `tests/dom.js` 사용)

**Interfaces:**
- Consumes: Task 1 전부; 강의의 `t`, `loadLang`, `saveLang`(`agent-lifecycle/js/engine/i18n.js`), `renderLangToggle`(`agent-lifecycle/js/render/langToggle.js`), `h`(`agent-lifecycle/js/render/dom.js`), `lessonHref`(`agent-lifecycle/js/engine/router.js`).
- Produces:
  - `GLOSSARY_UI` (`glossary/render.js` 안): `title`(용어집/Glossary), `back`(Knowledge Base), `searchLabel`(용어 검색/Search terms), `all`(전체/All), `categories: {metric: 지표/Metrics, role: 사람과 역할/People and roles, process: 절차/Processes, tool: 도구와 기록/Tools and records}`, `empty`(찾는 용어가 없습니다./No matching terms.), `seen`(강의에서 보기/See it in the course), `count`(개/terms), `translationComing` — 각 `{ko, en}`.
  - `renderGlossary(root, terms, { query, category, focusId }, lang, { onQuery(q), onCategory(c), lessons }) -> void` — 구조: `[data-back]` 링크(`../`), `h1`, `input[data-search]`(값 = query, `aria-label`), 분류 버튼 `[data-category="all|metric|role|process|tool"]`(`aria-pressed`), `[data-count]`, 카드 목록 `[data-term="<id>"]`(안에 `[data-term-name]`, `[data-term-alt]`, `[data-definition]`, 레슨 링크 `a[data-seen]` → `../agent-lifecycle/#<lessonId>-0`, 링크 글자는 그 레슨의 제목), 결과 없으면 `[data-empty]`. `focusId`인 카드에 `is-focus`. 영어인데 en이 빠진 용어가 보이면 `[data-translation-note]` 표시. 입력 중 검색창이 다시 만들어져 초점을 잃지 않도록 목록 부분만 다시 그린다. `lessons`는 `[{id, title}]`.
  - `glossary.js`: 상태(query, category) 보관, 언어 버튼, 시작 시와 `hashchange`마다 `findTerm`으로 용어를 찾으면 category `'all'`·query `''`로 되돌리고 그 카드로 스크롤·강조.

- [ ] **Step 1: 실패하는 테스트 작성** (픽스처 3개 용어)
  - 처음 렌더: 카드 3개, `[data-count]`에 `3`, 분류 버튼 5개, `all`이 `aria-pressed="true"`.
  - 검색창에 `sme` 입력(input 이벤트) → `onQuery('sme')` 호출; `{query:'sme'}`로 다시 그리면 카드 1개이고 검색창 요소는 같은 객체.
  - `[data-category="tool"]` 클릭 → `onCategory('tool')`.
  - 결과 0개 → `[data-empty]` 보임, 카드 없음.
  - `focusId: 'aht'` → 그 카드에만 `is-focus`.
  - `seen: ['coaching']`인 용어 → `a[data-seen]`의 href가 `../agent-lifecycle/#coaching-0`, 글자가 레슨 제목.
  - 영어: 이름·정의가 en, 버튼 글자 `All`; en이 없는 용어가 있으면 ko로 보이고 번역 안내 표시.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 구현** — `index.html`은 강의 스타일시트(`../agent-lifecycle/css/styles.css`)와 `glossary.css`를 불러오고, 빈 파비콘, `<title>용어집</title>`.
- [ ] **Step 4: `npm test` → PASS**

### Task 3: 참고 자료 페이지, 첫 화면 카드, 강의의 돌아가기 링크, 브라우저 점검

**Files:**
- Create: `references/index.html`, `references/references.js`, `references/BPO_Contact_Center_Operation_Codex_2.0.pdf` (사용자가 제공한 PDF 복사)
- Modify: `index.html`(카드 2장), `agent-lifecycle/index.html`·`agent-lifecycle/js/app.js`·`agent-lifecycle/css/styles.css`(돌아가기 링크), `agent-lifecycle/scripts/browser_check.py`, `README.md`(주제 표에 두 줄)
- Test: `agent-lifecycle/tests/render.test.js`(참고 자료 문구), `scripts/browser_check.py`

**Interfaces:**
- Consumes: 강의의 i18n·언어 버튼.
- Produces:
  - `references/references.js`의 `REFERENCES_TEXT`(내보내기): `title`(참고 자료/References), `back`, `basisHeading`(바탕 자료/Foundation), `codex`(ko: spec 3.7 문장 그대로, en: "BPO Contact Center Operation Codex 2.0 — an operations guide covering the principles, management protocols, growth roadmap, team blueprints, and standard operating procedures (SOPs) of BPO contact center operations. Author: Marcus Shim."), `codexLink`(PDF 열기 (한국어)/Open the PDF (Korean)), `openHeading`(참고한 공개 자료/Open resources we draw on), `pyworkforce`(ko: "pyworkforce — 인력 산정과 스케줄링을 위한 오픈소스 도구(MIT 라이선스). 앞으로 추가할 인력 산정 계산기에서 계산 방식을 참고하고 결과를 대조합니다." en 대응), `noteHeading`(안내/Note), `countryNote`(ko: "법과 제도는 국가마다 다를 수 있습니다. 이 Knowledge Base의 내용은 일반적인 운영 원칙이며, 실제 적용 전에 해당 국가와 조직의 규정을 확인하세요." en 대응), `licenseNote`(ko: "이 저장소는 MIT 라이선스로 공개합니다." en 대응).
  - pyworkforce 링크: `https://github.com/rodrigo-arenas/pyworkforce`.
  - 강의 상단: `a[data-kb-link]`(href `../`, 글자 `Knowledge Base`)를 제목 앞에 둔다. 좁은 화면 상단은 두 줄을 유지한다.

- [ ] **Step 1: 실패하는 테스트·점검 작성**
  - 단위: `REFERENCES_TEXT`의 모든 값이 ko·en 비어 있지 않음; `codex.ko`가 spec 문장과 일치; 전체 텍스트에 `ISO`, `COPC`, `HDI`, `ICMI`, `@`, 전화번호 모양 숫자 없음; `Marcus Shim` 포함.
  - 브라우저 점검을 저장소 루트를 `/kb/` 하위 경로로 서빙하도록 바꾸고(강의 주소는 `/kb/agent-lifecycle/index.html`) 추가: (r) 첫 화면에 카드 3장, 각 카드 링크로 이동하면 해당 페이지의 `h1`이 보임; (s) 용어집·참고 자료·강의의 돌아가기 링크 → 첫 화면; (t) 용어집 `#nope` → 오류 없이 목록, 용어가 생긴 뒤에는 `#aht` → 그 카드 `is-focus`; (u) 용어집·참고 자료 320·390·1280px 가로 스크롤 없음, 콘솔 오류 없음; (v) 저장소 차단 상태에서 용어집·참고 자료가 한국어로 열리고 언어 전환 동작; (w) 강의에서 영어로 바꾼 뒤 용어집을 열면 영어; (x) PDF 링크가 200으로 응답; (p) 강의 상단이 320px에서 두 줄 이내 유지.
- [ ] **Step 2: `npm test` FAIL, `python3 scripts/browser_check.py` FAIL 확인**
- [ ] **Step 3: 구현** (PDF는 `/mnt/user-data/uploads/7c51a9bc-BPO_Ops_Basic_Manual_KOR_-_Edition_1.pdf`를 복사)
- [ ] **Step 4: `npm test` PASS, `python3 scripts/browser_check.py` → `ALL CHECKS PASSED`. 390폭 용어집(용어 없음 상태)·참고 자료 스크린샷 1장씩 확인**

### Task 4: 한국어 용어 43개 + 사용자 검토

**Files:**
- Modify: `glossary/terms.js`
- Create (저장소 밖 검토용): 한국어 정의 목록 문서 `/home/claude/glossary-ko-review.md`
- Test: `agent-lifecycle/tests/glossary.test.js`

**Interfaces:**
- Consumes: Task 1 `validateTerms`; 강의 `LESSONS`의 id.
- Produces: `TERMS` 43개 (ko만; `term`은 언어 공통 표기).

정의는 spec 3.5의 기준 순서로 쓴다. Codex PDF의 해당 부분: Ⅴ(팀별 KPI 정의), Ⅳ(커리어 매트릭스, PIP, 멘토십), Ⅵ(에스컬레이션·코칭·캘리브레이션 SOP), Ⅲ(성장 로드맵). `seen`은 그 용어가 실제로 나오는 레슨만 넣는다(레슨 텍스트에서 확인).

- [ ] **Step 1: 실패하는 테스트 작성**
  - `TERMS.length === 43`; 분류별 개수 metric 14, role 11, process 11, tool 7; id 목록이 spec 3.4 순서와 같음 (`aht, fcr, csat, dsat, quality-score, sla, kpi, shrinkage, planned-shrinkage, unplanned-shrinkage, occupancy, schedule-adherence, forecast-accuracy, attrition, agent, sme, team-lead, assistant-manager, operation-manager, qa, trainer, wfm, rta, fte, buddy, rjp, nesting, floor-walking, calibration, escalation, one-on-one-coaching, grow, pip, sop, voc, eap, crm, cti, ticket, knowledge-base, call-recording, chat-log, email-log`).
  - `validateTerms(TERMS, {lessonIds})` → `[]`.
  - `shrinkage` 정의에 "모든 시간"; `planned-shrinkage`에 휴식·교육·회의; `unplanned-shrinkage`에 결근·지각·병가·입원·장례식.
  - `call-recording`의 `name.ko`가 "녹취", `chat-log`가 "채팅 로그", `email-log`가 "이메일 로그"; 각 정의에 해당 채널(전화/채팅/이메일).
  - `rta` 이름에 "Real-Time Analyst", `wfm`에 "Workforce Management", `aht` 이름 "평균 처리 시간".
  - `seen`이 있는 용어마다, 그 레슨의 한국어 텍스트에 용어 표기나 한국어 이름이 실제로 들어 있음.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 43개 작성**
- [ ] **Step 4: `npm test` PASS, 브라우저 점검 PASS(`#aht` 강조 포함), 390폭 용어집 스크린샷 확인**
- [ ] **Step 5: 검토용 목록 문서를 만들어 사용자에게 보내고 한국어 확정 요청. 확정 전 Task 5 시작 금지.**

### Task 5: 영어 + 마무리

**Files:**
- Modify: `glossary/terms.js`(en 추가), `agent-lifecycle/tests/glossary.test.js`, `agent-lifecycle/scripts/browser_check.py`, `LOG.md`

- [ ] **Step 1: 실패하는 테스트** — `validateTerms(TERMS, {requireEnglish:true, lessonIds})` → `[]`; `shrinkage` en에 "all time", `unplanned-shrinkage` en에 absence·lateness·sick leave·hospitali·funeral; `call-recording` `name.en === 'Call Recording'`, `chat-log` `'Chat Log'`, `email-log` `'Email Log'`; 영어 텍스트에 한글 없음.
- [ ] **Step 2: `npm test` → FAIL**
- [ ] **Step 3: 영어 추가**
- [ ] **Step 4: `npm test` PASS; 브라우저 점검에 영어 320px 용어집 가로 스크롤·번역 안내 없음 확인을 넣고 `ALL CHECKS PASSED`; 영어 390폭 스크린샷 확인**
- [ ] **Step 5: `LOG.md`에 항목 추가**
- [ ] **Step 6: 전체 변경에 대한 검토(별도 검토자) → 중요한 지적 수정**
- [ ] **Step 7: 사용자에게 영어 정의 목록을 보여 주고 커밋·푸시·PR 승인을, 이어서 병합 승인을 요청**
