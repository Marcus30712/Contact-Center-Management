# 용어집과 참고 자료 페이지 — 설계 문서

작성일: 2026-11-18 · 상태: 승인됨 (2026-11-18)

## 1. 의도와 이유

Knowledge Base 첫 화면에 독립 페이지 두 개를 더한다.

- **용어집**: 강의와 BPO Operation Codex 2.0에 나오는 용어를 한국어·영어로 찾아볼 수 있게 한다. 강의를 보다가, 또는 현업에서 낯선 용어를 만났을 때 여는 곳이다.
- **참고 자료**: 이 Knowledge Base가 무엇을 바탕으로 만들어졌는지, 어떤 외부 자료를 참고했는지 밝힌다.

용어는 데이터 파일 하나에 모은다. 나중에 강의 안에서 용어를 누르면 뜻이 뜨게 하거나, 저장소 전체를 학습 앱 구조로 다시 짤 때 그대로 쓸 수 있게 하기 위해서다.

## 2. 목표 · 비목표 · 반목표

**목표**
- 첫 화면에서 용어집과 참고 자료로 갈 수 있고, 각 페이지와 강의에서 첫 화면으로 돌아올 수 있다.
- 용어집에서 용어를 검색하고 분류로 걸러 볼 수 있다. 한국어/영어 전환은 강의와 같은 선택을 공유한다.
- 용어마다 주소가 있어 링크로 바로 열 수 있다 (예: `glossary/#aht`).
- 휴대폰과 PC, 밝은/어두운 화면에서 강의와 같은 모습으로 보인다.

**비목표**
- 강의 설명 속 용어를 누르면 뜻이 뜨는 기능 (B안, 나중에).
- 인력 산정 계산기와 인력관리 주제 (다음 작업).
- 용어 편집 화면, 사용자 제안 기능.

**반목표**
- 외부 표준(ISO 18295, COPC, HDI, ICMI)을 참고 자료 페이지에 싣는 것 — 사용자 결정으로 제외.
- 특정 국가의 법령 인용. 국가마다 다를 수 있다는 안내만 한다.
- 출처 없는 수치, "진상" 표현, 3문장을 넘는 정의.
- 이력서의 연락처 등 개인정보 노출. 작성자 표기는 이름 "Marcus Shim"만 쓴다.

## 3. 결정된 사항

### 3.1 사용자 결정
- 방식: **독립 페이지 2개** (A안).
- 용어 목록: 3.4의 목록 승인.
- 참고 자료 페이지 내용: (1) pyworkforce 출처 표기, (2) "법과 제도는 국가마다 다를 수 있다"는 안내, (3) BPO Operation Codex 2.0을 바탕 자료로 표기하고 작성자 "Marcus Shim" 표기. 외부 표준 4종은 싣지 않는다.
- Shrinkage: 콜을 받을 수 없는 모든 시간의 비율. Planned(휴식, 교육, 회의 등 사전에 계획된 시간)와 Unplanned(결근, 지각, 병가, 입원, 장례식 등 계획되지 않은 시간)로 나눈다.
- 채널별 기록: 전화는 녹취(Call Recording), 채팅은 채팅 로그(Chat Log), 이메일은 이메일 로그(Email Log).
- 저장소 라이선스는 MIT. 커밋과 푸시는 승인 후 진행.

### 3.2 화면 (제작자 제안)
- **첫 화면** (`index.html`): 지금의 강의 카드 아래에 "용어집 · Glossary", "참고 자료 · References" 카드 2장 추가.
- **용어집** (`glossary/`):
  - 상단: 첫 화면으로 가는 링크, 제목, 언어 버튼.
  - 검색창 하나 (약어, 한국어 이름, 영어 이름, 정의에서 찾음. 대소문자 무시) + 분류 버튼 5개 (전체, 지표, 사람과 역할, 절차, 도구와 기록).
  - 용어 카드: 용어(예: AHT), 풀어 쓴 이름(현재 언어), 다른 언어 이름(작게), 정의, "강의에서 보기" 링크(그 용어가 나오는 레슨들).
  - 결과가 없으면 "찾는 용어가 없습니다" 안내.
  - 주소에 용어 id가 있으면(`#aht`) 그 카드로 이동하고 강조한다.
- **참고 자료** (`references/`): 상단은 같고, 본문은 세 부분 — 바탕 자료(Codex, 작성자), 참고한 공개 자료(pyworkforce: 링크, MIT 라이선스, 앞으로 추가할 인력 산정 계산기에서 계산 방식을 참고하고 결과를 대조한다는 설명), 안내(국가별 차이).
- **강의** (`agent-lifecycle/`): 상단 제목 옆에 Knowledge Base 첫 화면으로 가는 링크를 추가한다.

### 3.3 만드는 방법 (제작자 선택)
- 정적 파일. 새 폴더 `glossary/`(index.html, glossary.js, terms.js, glossary.css)와 `references/`(index.html, references.js).
- 언어 선택·저장과 언어 버튼, 색·글꼴 토큰은 강의의 것을 그대로 불러 쓴다 (`../agent-lifecycle/js/engine/i18n.js`, `../agent-lifecycle/js/render/langToggle.js`, `../agent-lifecycle/css/styles.css`). 같은 저장 키를 쓰므로 언어 선택이 세 화면에서 공유된다. 공용 폴더로 옮기는 정리는 저장소를 앱 구조로 다시 짤 때 한다.
- 용어 데이터 형태:
  ```js
  { id: 'aht', category: 'metric' | 'role' | 'process' | 'tool',
    term: 'AHT',                                  // 화면에 크게 보이는 표기 (언어 공통)
    name: { ko: '평균 처리 시간', en: 'Average Handle Time' },
    definition: { ko: '…', en: '…' },             // 3문장 이내
    seen: ['nesting', 'coaching'] }               // 이 용어가 나오는 레슨 id (없으면 빈 배열)
  ```
- 검색·분류 걸러내기는 화면과 분리된 순수 함수로 만들어 단위 테스트한다.
- 테스트는 지금의 `agent-lifecycle/` 테스트 묶음에 추가한다. 브라우저 점검은 저장소 루트를 기준으로 열도록 바꿔 첫 화면·용어집·참고 자료까지 함께 확인한다.
- 내용 순서: 한국어 정의 초안 → 사용자 검토(채팅으로 전달하는 목록 문서) → 확정 → 영어 → 커밋 승인 요청 → PR.

### 3.4 용어 목록 (사용자 승인) — 44개 (OJT는 한국어 검토 때 사용자가 추가)
- **지표 (14)**: AHT, FCR, CSAT, DSAT, Quality Score, SLA, KPI, Shrinkage, Planned Shrinkage, Unplanned Shrinkage, Occupancy, Schedule Adherence, Forecast Accuracy, Attrition
- **사람과 역할 (11)**: Agent, SME, Team Lead, Assistant Manager, Operation Manager, QA, Trainer, WFM, RTA, FTE, Buddy
- **절차 (12)**: RJP, OJT, Nesting, Floor Walking, Calibration, Escalation, 1:1 Coaching, GROW, PIP, SOP, VOC, EAP
- **도구와 기록 (7)**: CRM, CTI, Ticket, Knowledge Base, 녹취(Call Recording), 채팅 로그(Chat Log), 이메일 로그(Email Log)

### 3.5 정의 작성 원칙 (제작자 제안)
- 기준 순서: 사용자가 직접 정한 정의(Shrinkage, 채널별 기록) → BPO Operation Codex 2.0의 정의 → 강의에서 확정된 표현 → 일반적인 실무 정의.
- Codex와 강의가 다르게 쓴 곳은 강의에서 사용자가 확정한 쪽을 따른다 (Shrinkage가 그 예).
- 정의에 수치를 넣지 않는다. 조직마다 다른 것은 "센터마다 다르다"고 쓴다.
- 직급 이름은 Codex 표기를 따른다: Agent(상담사), SME, Team Lead(팀장), Assistant Manager(부매니저), Operation Manager(매니저).

### 3.6 검토 후 정리한 것
- **Codex 원문의 위치.** Codex는 사용자가 이 작업 세션에 PDF로 제공했다(36쪽, 최종 수정 2025-10-16 표기). 정의 초안은 그 PDF를 보고 쓴다. 저장소에도 올린다 (3.7).
- **RTA, WFM, FTE의 뜻 (Codex 기준).** RTA는 Real-Time Analyst(실시간 서비스 레벨과 스케줄 준수를 모니터링하는 직무), WFM은 Workforce Management(인력관리팀과 그 기능), FTE는 상담 인력의 규모를 세는 단위다. 셋 다 "사람과 역할" 분류에 둔다.
- **용어 주소와 분류 버튼 (제작자 판단).** 주소로 용어를 열면 분류를 "전체"로 되돌리고 검색어를 비운 뒤 그 카드로 이동한다.

### 3.7 참고 자료 페이지의 Codex 소개 (사용자 결정, 2026-11-18)
- 문장: "BPO Contact Center Operation Codex 2.0 — BPO 고객센터 운영의 원칙, 관리 프로토콜, 성장 로드맵, 팀별 청사진, 표준 운영 절차(SOP)를 정리한 운영 지침서. 작성: Marcus Shim."
- Codex PDF를 저장소에 올린다 (`references/BPO_Contact_Center_Operation_Codex_2.0.pdf`). 참고 자료 페이지에서 이 파일로 링크한다.
- 올리기 전 PDF를 확인했다: 실제 이메일·전화번호·주소·회사명·대외비 표시 없음 (예시용 주소 `teamlead@example.com`만 있음).

## 4. 검토한 접근법

| 접근 | 장점 | 단점 | 결과 |
|---|---|---|---|
| **A. 독립 페이지 2개** | 강의 코드를 거의 건드리지 않음, 용어 데이터를 나중에 재사용 | 강의를 보다가 페이지를 옮겨야 함 | **선택 (사용자)** |
| B. A + 강의 안에서 용어 누르면 뜻 보기 | 학습 흐름이 끊기지 않음 | 강의 화면 코드 수정, 작업이 큼 | 나중에 (A의 데이터로 가능) |
| C. 저장소 문서로만 정리 | 가장 빠름 | 사이트에서 보기 불편, 언어 전환 없음 | 선택 안 함 |

## 5. 제작자에게 맡기는 것
- 카드와 검색창의 모양, 분류 버튼의 배치.
- 각 용어의 정의 문안 (3.5 원칙 안에서, 사용자 검토 전제), `seen`에 넣을 레슨.
- 파일 안의 코드 구성, 테스트 구성.
