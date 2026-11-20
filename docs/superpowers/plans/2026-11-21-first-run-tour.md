# 처음 사용자 튜토리얼 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈을 처음 열면 아래 메뉴 다섯 칸을 한 칸씩 밝혀 김미소 말풍선으로 한 줄씩 소개하고, 건너뛰기·다시 보기를 지원한다.

**Architecture:** 공용 모듈 `shared/tour.js`(동작)와 `shared/tour-data.js`(문구·저장 키)를 새로 만든다. 홈(`home/app.js`)이 아래 메뉴가 그려진 뒤 필요할 때 투어를 띄우고, 설정 페이지에 `../?tour=1`로 가는 "튜토리얼 다시 보기" 링크를 둔다. 저장 값 1개 추가에 맞춰 개인정보처리방침 문구와 테스트를 고친다.

**Tech Stack:** vanilla ES modules, `node --test` + jsdom, Playwright 브라우저 확인(`browser_check.py`).

**Spec:** `docs/superpowers/specs/2026-11-21-first-run-tour-design.md`

## Global Constraints

- 모든 문구는 `{ ko, en }`. 한국어는 설계 문서 표와 글자 하나까지 같아야 한다(테스트로 대조). 영어에 한글 금지.
- 저장 키: `queuecraft:tour`, 값 `"done"`. 모든 저장소 접근은 try/catch. 기록 백업(`BACKUP_KEYS`)에는 넣지 않는다.
- `setItem` 호출은 앱 전체 8개가 된다(현재 7 + 1). sessionStorage 등 다른 저장소 금지.
- 개인정보처리방침 `s2.item1`: ko "고른 언어, 직군, 화면 모드(밝게·어둡게), 튜토리얼을 봤는지 여부" / en "Your chosen language, job track, display mode (light or dark), and whether you've seen the tutorial"
- 런타임 파일을 바꾸면 `python3 tools/sw_list.py`를 다시 돌린다.
- 전체 확인: `cd agent-lifecycle && npm test` (0 fail), `python3 agent-lifecycle/scripts/browser_check.py > /tmp/bc.txt 2>&1; tail -1 /tmp/bc.txt` → `ALL CHECKS PASSED`.

## Review Focus

1. **저장이 막힌 브라우저:** 투어가 뜨고, 건너뛰기·시작하기가 오류 없이 닫혀야 한다. → Task 1 `tourSeen/markTourSeen survive blocked storage`, Task 2 `closing works with blocked storage`.
2. **좁은 화면(320px)과 넓은 화면(1280px):** 말풍선이 화면 안에 있고 메뉴 칸을 가리지 않아야 한다. → Task 1 `bubbleLeft keeps the bubble on screen`, Task 3 browser check (w).
3. **영어 화면:** 말풍선·버튼·대화상자 이름이 모두 영어. → Task 2 `English tour reads in English`.
4. **다시 보기 후 새로고침:** `?tour=1`이 주소에서 지워져 새로고침해도 다시 뜨지 않아야 한다. → Task 3 browser check (w).
5. **아래 메뉴보다 홈 스크립트가 먼저 실행됨:** 메뉴가 아직 없을 때도 투어가 메뉴를 기다려야 한다. → Task 2 `whenAppBar waits for the menu`.

---

### Task 1: 문구, 저장 값, 위치 계산

**Files:**
- Create: `shared/tour-data.js`, `shared/tour.js`
- Test: `agent-lifecycle/tests/tour.test.js`

**Interfaces:**
- Produces (`shared/tour-data.js`):
  - `TOUR_KEY = 'queuecraft:tour'`
  - `TOUR_STEPS: Array<{ id: 'home'|'learn'|'guide'|'browse'|'settings', text: {ko,en} }>` (순서 고정)
  - `TOUR_UI = { skip, next, start, replay }` 각 `{ko,en}`
- Produces (`shared/tour.js`):
  - `tourSeen(storage) -> boolean`
  - `markTourSeen(storage) -> void`
  - `shouldStartTour(storage, href) -> boolean` — 안 봤거나 주소에 `tour=1`이 있으면 true
  - `bubbleLeft(itemCenter, bubbleWidth, viewportWidth, margin = 12) -> number`

- [ ] **Step 1: 실패하는 테스트 작성** (`tour.test.js`)
  - `tour wording is the confirmed table`: 설계 문서의 `| 순서 | 메뉴 | 말풍선 |` 표 5줄을 읽어 `TOUR_STEPS.map(s => s.text.ko)`와 같고, `TOUR_STEPS.map(s => s.id)`가 `['home','learn','guide','browse','settings']`. 영어 표 `| 순서 | 말풍선 |` 5줄과 `text.en`이 같다. 문구 표에서 건너뛰기/다음/시작하기/튜토리얼 다시 보기가 `TOUR_UI.*.ko`와 같고, en은 `Skip`, `Next`, `Get started`, `Replay the tutorial`. 영어에 한글 없음.
  - `tourSeen/markTourSeen use queuecraft:tour`: `fakeStorage()` → false; mark 후 `getItem('queuecraft:tour') === 'done'`, `tourSeen` true.
  - `tourSeen/markTourSeen survive blocked storage`: `throwingStorage`와 `null`에서 `tourSeen` false, `markTourSeen` 예외 없음.
  - `shouldStartTour`: 안 봤으면 true; 봤으면 `https://x/` false, `https://x/?tour=1` true.
  - `bubbleLeft keeps the bubble on screen`: `(30, 280, 320)` → 12; `(300, 280, 320)` → 28; `(640, 280, 1280)` → 500.
- [ ] **Step 2: 실패 확인** — Run: `cd agent-lifecycle && node --test tests/tour.test.js` / Expected: 모듈 없음으로 FAIL
- [ ] **Step 3: `shared/tour-data.js`, `shared/tour.js`의 위 함수 구현** — `bubbleLeft`는 `itemCenter - bubbleWidth/2`를 `[margin, viewportWidth - margin - bubbleWidth]`로 자른다.
- [ ] **Step 4: 통과 확인** — 같은 명령 / Expected: PASS
- [ ] **Step 5: 전체 확인** — `npm test` / Expected: 0 fail

### Task 2: 투어 화면 (대화상자)

**Files:**
- Modify: `shared/tour.js`
- Create: `shared/tour.css`
- Test: `agent-lifecycle/tests/tour.test.js`

**Interfaces:**
- Consumes: Task 1 전부; 아래 메뉴 `nav.appbar a[data-item]` (shared/appbar.js), `APPBAR_UI` (메뉴 이름)
- Produces:
  - `whenAppBar(doc) -> Promise<HTMLElement>` — `nav.appbar`가 있으면 바로, 없으면 생길 때 resolve
  - `startTour(doc, lang, storage, opts = {}) -> { close(): void }` — `opts.onClose?()`; 이미 열려 있으면 새로 열지 않음
- DOM 약속: 덮개 `[data-tour]`, 대화상자 `[data-tour] [role=dialog][aria-modal=true]`(aria-label = 해당 메뉴 이름), 말풍선 문구 `[data-tour-text]`, 진행 `[data-tour-count]`("1/5"), 버튼 `[data-tour-skip]`, `[data-tour-next]`; 밝힌 칸 `a[data-item].tour-lit`; 투어 중 `nav.appbar.tour-on`. 미소 그림 `assets/miso/smile.webp`, alt "".

- [ ] **Step 1: 실패하는 테스트 작성** (jsdom, `setupDom` + 문서에 `renderAppBar`로 만든 nav를 붙여 사용)
  - `the tour opens on Home with the first line`: count "1/5", 텍스트 = `TOUR_STEPS[0].text.ko`, `.tour-lit`의 `data-item` = home, 초점이 대화상자 안의 버튼.
  - `Next walks the five items in order and the last button says 시작하기`: 다음 4번 → lit 순서 home→learn→guide→browse→settings, 마지막 next 버튼 글자 `시작하기`, count "5/5".
  - `Skip, Get started and Esc all close and remember`: 세 경우 각각 `[data-tour]` 없음, `tour-on`/`tour-lit` 제거, `queuecraft:tour === 'done'`, `onClose` 1회 호출, 초점이 열기 전 요소로.
  - `Tab stays inside the bubble`: 마지막 버튼에서 Tab → 첫 버튼 (Shift+Tab 반대).
  - `English tour reads in English`: lang 'en' → `Skip`/`Next`, 텍스트 = `text.en`, aria-label = `Home`.
  - `closing works with blocked storage`: `throwingStorage`로 건너뛰기 → 예외 없이 닫힘.
  - `whenAppBar waits for the menu`: nav 없을 때 호출 → nav를 붙이면 resolve.
- [ ] **Step 2: 실패 확인** — `node --test tests/tour.test.js` / Expected: 새 테스트 FAIL
- [ ] **Step 3: `startTour`, `whenAppBar` 구현 + `shared/tour.css`** — 덮개는 화면 전체를 어둡게(z-index 30), 투어 중 `nav.appbar.tour-on`은 z-index 40·`pointer-events: none`, 밝히지 않은 칸은 흐리게, 밝힌 칸은 테두리 강조. 말풍선은 `position: fixed`, 아래 메뉴 바로 위(메뉴 높이 + 12px), `left = bubbleLeft(...)`, 폭 `min(280px, 100vw - 24px)`, 칸을 가리키는 꼬리. `@media (prefers-reduced-motion: reduce)`에서 transition 없음. CSS는 `startTour`가 `link[data-tour-css]`로 한 번만 붙인다. 창 크기 바뀌면 위치 다시 계산.
- [ ] **Step 4: 통과 확인** — 같은 명령 / Expected: PASS
- [ ] **Step 5: 전체 확인** — `npm test` / Expected: 0 fail

### Task 3: 홈 연결, 설정 다시 보기, 개인정보, 브라우저 확인

**Files:**
- Modify: `home/app.js`, `settings/render.js`, `privacy/text.js`, `docs/superpowers/specs/2026-11-20-privacy-design.md` (s2.item1 줄 + 머리말 변경 기록), `agent-lifecycle/tests/privacy.test.js`, `agent-lifecycle/tests/settings.test.js`, `agent-lifecycle/scripts/browser_check.py`, `sw.js`(생성)
- Test: 위 테스트 파일들

**Interfaces:**
- Consumes: Task 1 `shouldStartTour`, `markTourSeen`, `TOUR_UI`, `TOUR_KEY`; Task 2 `whenAppBar`, `startTour`

- [ ] **Step 1: 실패하는 테스트 작성**
  - privacy.test.js: setItem 개수 기대값을 8로, 설명 주석에 튜토리얼 추가; 저장 키 확인 목록에 `'queuecraft:tour'`(소스에 `shared/tour-data.js` 추가); 문구 표 대조는 설계 문서의 s2.item1을 새 문구로 바꾼 뒤 `privacy/text.js`가 따라가야 FAIL→PASS.
  - settings.test.js `the settings page offers to replay the tutorial`: `[data-tour-replay]` 링크 href가 `../?tour=1`, 글자 = `TOUR_UI.replay[lang]` (ko/en).
  - settings.test.js 백업 테스트에 `queuecraft:tour`가 `BACKUP_KEYS`에 없음을 추가.
- [ ] **Step 2: 실패 확인** — `npm test` / Expected: 위 테스트 FAIL
- [ ] **Step 3: 구현**
  - `privacy/text.js` s2.item1 = Global Constraints 문구.
  - `settings/render.js`: "홈 화면에 추가" 구역의 안내 아래에 `a.btn[data-tour-replay]` (href `../?tour=1`).
  - `home/app.js`: 첫 `draw()` 뒤 `whenAppBar(document)` → `shouldStartTour(storage, location.href)`이면 주소에서 `tour` 파라미터를 `history.replaceState`로 지우고 `startTour(document, lang, storage)`.
  - `python3 tools/sw_list.py`.
- [ ] **Step 4: 통과 확인** — `npm test` / Expected: 0 fail
- [ ] **Step 5: 브라우저 확인 추가** (`browser_check.py`)
  - `new_page`에 `tour=False` 인자: 기본은 init 맨 앞에 `try { localStorage.setItem('queuecraft:tour','done') } catch (e) {}`를 넣어 기존 확인이 투어에 막히지 않게 한다. `tour=True`면 넣지 않는다.
  - (w) 새 구역: 폭 320·390·1280 각각 홈을 열어 대화상자가 뜨고 count "1/5", 말풍선이 화면 안(left ≥ 0, right ≤ 폭)이고 말풍선 아래 끝 ≤ 아래 메뉴 위 끝, 밝힌 칸이 home. 390에서 다음×4 → 마지막 버튼 "시작하기" → 누르면 닫히고 `localStorage['queuecraft:tour'] === 'done'`, 새로고침 시 안 뜸. 새 페이지에서 Esc로 닫힘. 본 상태에서 설정의 `[data-tour-replay]` 클릭 → 홈에서 "1/5"로 다시 뜨고 주소에 `tour=` 없음 → 닫고 새로고침하면 안 뜸. 390 스크린샷 `tour-390.png`.
  - Run: `python3 agent-lifecycle/scripts/browser_check.py > /tmp/bc.txt 2>&1; tail -1 /tmp/bc.txt` / Expected: `ALL CHECKS PASSED`

### Task 4: 변경 기록

**Files:** Modify: `LOG.md`

- [ ] **Step 1:** "## 알려진 한계" 앞에 `### 36. 처음 사용자 튜토리얼(아래 메뉴 짚어 주기) — 상태: 검토 중` 항목 추가 (무엇이 바뀌었는지, 저장 값 1개 추가와 개인정보처리방침 변경, 문구 승인일 2026-11-21).
- [ ] **Step 2:** `npm test` 0 fail, browser check `ALL CHECKS PASSED` 다시 확인.
