# 설정: 홈 화면에 추가 안내 창·튜토리얼 구역 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 설정에 튜토리얼 구역을 따로 두고, "홈 화면에 추가"를 아이폰·안드로이드 단계 안내 창으로 바꾼다.

**Architecture:** 문구는 `settings/install-data.js`(`INSTALL_UI`)에, 안내 창은 `settings/install-sheet.js`(`openInstallSheet`)에 둔다. `settings/render.js`가 구역 순서를 바꾸고 두 구역을 그린다. 스타일은 `settings/settings.css`(기존 파일)에 더한다.

**Tech Stack:** vanilla ES modules, `node --test` + jsdom, Playwright `browser_check.py`.

**Spec:** `docs/superpowers/specs/2026-11-21-settings-install-sheet-design.md`

## Global Constraints

- 문구는 설계 문서의 `| 키 | 한국어 | English |` 표와 글자 하나까지 같다(테스트로 대조). 영어에 한글 금지.
- 저장 값 추가 없음(`setItem` 8개 그대로).
- 설정 구역 순서: 언어 → 튜토리얼 → 화면 → 기록 백업 → 홈 화면에 추가.
- 튜토리얼 [보기]는 `../?tour=1`로 가는 링크(`[data-tour-replay]`, 지금과 같은 이름).
- 런타임 파일을 바꾸면 `python3 tools/sw_list.py`.
- 확인: `cd agent-lifecycle && npm test` 0 fail, `browser_check.py` → `ALL CHECKS PASSED`.

## Review Focus

1. **좁은 화면(320×568):** 창 안이 길어 스크롤돼도 [알겠어요]가 보인다. → Task 3 browser check.
2. **다크 모드:** 단계 그림(흰 바탕)과 주의 상자 글씨가 보인다. → Task 3 다크 스크린샷 + 대비 확인.
3. **영어:** 창 안 모든 글, 그림 속 글자까지 영어. → Task 2 `English sheet reads in English`.
4. **창을 연 채 언어를 바꿀 수 없음 / 닫은 뒤 다시 열기:** 두 번 열어도 창이 하나. → Task 2 `opening twice keeps one sheet`.
5. **키보드:** Esc, 탭 화살표, 초점 복귀. → Task 2.

---

### Task 1: 문구와 설정 구역

**Files:** Create `settings/install-data.js`; Modify `settings/render.js`, `agent-lifecycle/tests/settings.test.js`; Test `agent-lifecycle/tests/install-sheet.test.js`

**Interfaces:**
- Produces: `INSTALL_UI` — 표의 키 23개, 각 `{ko,en}`, 표 순서대로.

- [ ] **Step 1: 실패하는 테스트**
  - install-sheet.test.js `install wording is the confirmed table`: 표를 읽어 `Object.keys(INSTALL_UI)`가 표 키 순서와 같고 각 값이 `{ko,en}`과 같음, 영어에 한글 없음.
  - settings.test.js 구역 순서 테스트의 h2 목록을 `[langHeading, INSTALL_UI.tutorialHeading, themeHeading, backupHeading, installHeading]`로, `[data-install]` 글자 = `INSTALL_UI.installNote`로 바꿈. 새 테스트 `the tutorial has its own section with a View link`: 튜토리얼 구역 안에 줄 이름·설명 글자, `a[data-tour-replay]` href `../?tour=1`, 글자 = `tutorialButton`, `aria-labelledby`가 줄 이름과 링크를 함께 가리킴. 기존 `the settings page offers to replay the tutorial` 테스트는 이 테스트로 바꿈. `[data-install-open]` 버튼 글자 = `installButton`.
- [ ] **Step 2:** `npm test` → 위 테스트 FAIL
- [ ] **Step 3:** `install-data.js` 작성, `render.js`에서 구역 순서·튜토리얼 구역·홈 화면 구역(안내 + `button[data-install-open]`) 그리기. 버튼 클릭은 Task 2의 `openInstallSheet`를 부른다(이 단계에선 import만 준비하지 말고 Task 2에서 연결).
- [ ] **Step 4:** `npm test` → 0 fail

### Task 2: 안내 창

**Files:** Create `settings/install-sheet.js`; Modify `settings/render.js`, `settings/settings.css`; Test `agent-lifecycle/tests/install-sheet.test.js`

**Interfaces:**
- Consumes: Task 1 `INSTALL_UI`
- Produces: `installPlatform(ua: string) -> 'ios'|'android'`; `openInstallSheet(doc, lang, opts = { platform }) -> { close(): void }` — 이미 열려 있으면 그 창을 돌려줌.
- DOM: 바깥 `[data-install-sheet]`, 창 `[role=dialog][aria-modal=true][aria-labelledby]`, 탭 `[role=tab][data-p=ios|android]`, 패널 `[role=tabpanel][data-p]`, 단계 `ol li`, 닫기 `[data-install-ok]`.

- [ ] **Step 1: 실패하는 테스트** (install-sheet.test.js)
  - `installPlatform picks Android only for Android`: Android UA → android, iPhone UA·빈 값 → ios.
  - `the sheet opens with Miso, the title and the chosen tab`: platform ios → ios 탭 `aria-selected=true`, ios 패널 보임·android 패널 hidden, 단계 3개 글자 = ios1..3, 말풍선 = sheetBubble, 초점 = [알겠어요].
  - `tabs switch by tap and by arrow keys`: android 탭 클릭 → android 패널 보임, 오른쪽 화살표 → 다시 ios, 탭 `tabindex` 0/-1.
  - `Got it, Esc and a tap outside close it and focus returns`: 세 경우 창 없음, 초점 = 연 버튼.
  - `opening twice keeps one sheet`.
  - `English sheet reads in English`: 모든 글자에 한글 없음, 그림 속 글자 Add/Install.
- [ ] **Step 2:** `node --test tests/install-sheet.test.js` → FAIL
- [ ] **Step 3:** 구현. 단계 그림은 리아와 파이썬의 SVG 다섯 개를 옮기고 글자(`iconAdd`, `iconInstall`)만 언어 따라. CSS: 바깥은 화면 전체 어둡게, 창은 아래쪽에 붙고 `max-height: 85dvh; overflow-y: auto`, [알겠어요]는 `position: sticky; bottom: 0`. 다음 안내는 `--accent-soft` 계열, 주의는 노란 바탕(다크 모드 대비 확인). `render.js` 버튼에 `openInstallSheet(document, lang, { platform: installPlatform(navigator.userAgent) })` 연결.
- [ ] **Step 4:** `npm test` → 0 fail

### Task 3: 브라우저 확인, 오프라인 목록, 기록

**Files:** Modify `agent-lifecycle/scripts/browser_check.py`, `sw.js`(생성), `LOG.md`

- [ ] **Step 1:** browser_check (x) 구역: 320×568과 390 폭에서 설정 → [홈 화면에 추가 방법] → 창이 화면 안, [알겠어요]가 화면 안에 보임, 안드로이드 탭 클릭 시 패널 바뀜, Esc로 닫히고 초점이 버튼으로. 튜토리얼 [보기] → 홈에서 튜토리얼 1/5 (기존 (w)의 replay 확인이 `[data-tour-replay]`를 그대로 씀). 다크 모드 390 스크린샷 `install-sheet-dark.png`, 밝은 모드 `install-sheet-390.png`.
- [ ] **Step 2:** `python3 tools/sw_list.py`, `npm test` 0 fail, browser check `ALL CHECKS PASSED`, 스크린샷 눈으로 확인.
- [ ] **Step 3:** LOG에 `### 37. 설정: 홈 화면에 추가 안내 창, 튜토리얼 구역 — 상태: 검토 중`.
