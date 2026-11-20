# 학습 앱 2단계 — 오늘의 연습 설계

작성일: 2026-11-20 · 상태: 확정 (2026-11-20)

## 1. 목적

신입 팀장이 혼자, 휴대폰으로 틈틈이 배운 것을 복습하게 한다. 하루 몇 분, 이미 마친 레슨의 문제 3개와 용어 카드 몇 장을 보고, 연속 학습과 배지로 다시 오게 만든다. 미소가 표정으로 반응한다.

- 1단계(앱 껍데기, PR #14)에 이어지는 단계. 3단계는 미소의 엑셀 연습.

## 2. 목표 / 하지 않을 것 / 실패로 볼 것

**목표**
- 마친 레슨의 문제로 오늘의 문제 3개, 용어 카드, 연속 학습, 배지 9개.
- 첫 화면에서 한 번 눌러 들어간다.
- 오프라인, 아래 메뉴, 한국어/영어가 다른 주제와 똑같이 된다.

**하지 않을 것 (이번 단계)**
- 새 문제 쓰기 (사용자 결정: 기존 26문제로 시작하고 나중에 추가 — 옵션 C).
- 알림, 계정, 서버 저장, 순위.
- 엑셀 연습 (3단계).

**실패로 볼 것**
- 배우지 않은 내용을 시험처럼 묻는 것.
- 하루 쉬었다고 죄책감이 들게 하는 것.
- 첫 화면이 길고 복잡해지는 것.
- 기록이 휴대폰 밖으로 나가는 것.

## 3. 사용자가 정한 것

- 문제 출처: 기존 체크포인트 문제만 (라이프사이클 18, SOP 14 → 한 사람에게 26). 새 문제는 나중에.
- 마친 레슨의 문제만 낸다.
- 연속 학습: **월~금 평일 출석만 센다. 토·일은 쉬는 날이라 빠져도 끊기지 않고 일수에도 넣지 않는다. 평일에 하루 빠지면 끊긴다 (A).** (처음 정한 "한 주에 하루 쉼"을 대신함)
- 배지 9개: 첫걸음, 3일 연속, 일주일 연속(평일 5일), 한 달 연속(평일 20일), 만점, 다시 잡기, 용어 박사, 라이프사이클 완주, SOP 완주 (조건은 §5.4).
- 만드는 방식: **새 연습 페이지 `practice/` (A).** 첫 화면에는 카드 한 장. 아래 메뉴는 4칸 그대로.
- 질문은 한글로. 한국어 문안을 먼저 확정한 뒤 영어.

## 4. 방법 비교 (선택: A)

| | 방법 | 얻는 것 | 잃는 것 |
|---|---|---|---|
| **A** | 새 페이지 `practice/`, 기존 레슨·용어 데이터 재사용 | 기존 화면을 거의 안 건드림. 오프라인·메뉴·언어 그대로. 3단계도 옆에 붙임 | 폴더 하나 늘어남 |
| B | 첫 화면 안에서 풀기 | 한 번 덜 누름 | 첫 화면이 길어짐 |
| C | 강의마다 연습 | — | 연속 학습·배지가 나뉨, 용어 카드 둘 곳 없음, 같은 기능 두 번 |

## 5. 동작

### 5.1 문제가 열리는 조건
- 라이프사이클 문제: 그 레슨을 마쳤고(`agent-lifecycle-course:v1`), 문제의 직군이 없거나 지금 고른 직군(`agent-lifecycle-course:track`, 없으면 일반)과 같을 때.
- SOP 문제: 그 레슨을 마쳤을 때(`sop-library:v1`).
- 문제 이름은 강의를 붙여 구분한다: `lifecycle:coaching-q1`, `sop:coaching-q1` (두 강의에 같은 레슨 id `coaching`, `onboarding`이 있다).

### 5.2 오늘의 문제
- 그날 처음 열 때 고르고 저장한다. 같은 날 다시 열면 같은 문제, 이미 고른 답도 그대로.
- 고르는 순서: ① 전에 틀리고 아직 다시 맞히지 않은 문제 ② 한 번도 안 푼 문제 ③ 가장 오래전에 푼 문제. 같은 순위 안에서는 날짜로 정해지는 순서로 섞는다(같은 날 같은 결과).
- 열린 문제가 3개보다 적으면 있는 만큼(1~2개) 낸다.
- 한 문제는 한 번만 답한다. 답하면 맞음/틀림, 해설, 미소 표정이 바로 나온다. 틀리면 "레슨 다시 보기" 링크(그 레슨 처음).
- 오늘의 문제를 다 풀면(맞든 틀리든) 그날은 "연습한 날"이다.
- 날짜는 휴대폰 시간 기준 `YYYY-MM-DD`.
- 직군을 바꿨거나 그날 중간에 레슨을 더 마쳐도 그날 고른 문제는 바꾸지 않는다 (제작자 결정: 같은 날 같은 문제).

### 5.3 연속 학습 (평일 출석)
- 평일(월~금)에 오늘의 문제를 다 푼 날만 센다. 토·일은 건너뛴다(끊지도, 세지도 않음).
- 가장 최근 평일부터 거꾸로 평일을 하루씩 센다. 오늘이 평일이고 아직 안 했으면 이전 평일부터 센다. 오늘이 주말이면 금요일부터 센다.
- 평일에 연습하지 않은 날을 만나면 끊긴다. 연습한 평일이 없으면 0.
- 주말에 연습해도 문제·카드·"첫걸음"·"만점"·"다시 잡기"는 그대로 된다. 연속 일수에만 넣지 않는다.
- 화면: "🔥 N일째". 오늘이 평일이고 아직이면 "오늘 하면 N+1일째". 주말이면 "주말은 쉬는 날이에요".

### 5.4 배지 (받으면 영원히 유지)
| id | 이름 | 조건 |
|---|---|---|
| first | 첫걸음 | 오늘의 문제를 처음 다 풂 (주말 포함) |
| streak3 | 3일 연속 | 연속 3 |
| week | 일주일 연속 | 연속 5 (평일 5일) |
| month | 한 달 연속 | 연속 20 (평일 20일) |
| perfect | 만점 | 그날 문제를 모두 맞힘 (문제가 3개 미만인 날은 제외) |
| comeback | 다시 잡기 | 전에 틀린 문제를 다시 맞힘 |
| terms | 용어 박사 | 열린 용어 카드가 10장 이상이고 모두 "알아요" |
| lifecycle | 라이프사이클 완주 | 라이프사이클 6개 레슨 마침 |
| sop | SOP 완주 | SOP 7개 레슨 마침 |

- 새 배지를 받으면 미소(자랑스러움)가 축하한다. 연습 화면 맨 아래에 9개 모두 보이고, 못 받은 것은 흐리게 + 조건.
- 완주 배지는 연습 화면을 열 때 확인해서 준다.

### 5.5 용어 카드
- 열리는 조건: 용어의 `seen`에 있는 라이프사이클 레슨 중 하나를 마쳤을 때. `seen`이 빈 용어 17개는 아무 레슨이나 하나 마치면 열린다 (제작자 결정).
- 오늘의 카드: 최대 5장. "다시 볼래요" 카드 → 처음 보는 카드 → "알아요" 중 가장 오래전 것 순.
- 앞면 용어, 누르면 뒷면 이름과 뜻. "알아요 / 다시 볼래요".
- 오늘의 카드는 연습한 날 계산에 넣지 않는다 (문제만).

### 5.6 미소 표정
생각(문제 볼 때), 기쁨(맞음), 걱정(틀림), 응원(오늘 다 풂), 자랑스러움(배지), 윙크(주말 안내). 시작 전 화면은 생각.

### 5.7 시작 전
마친 레슨이 하나도 없으면 문제·카드 대신 미소(생각)와 안내, 라이프사이클 레슨 1 링크.

### 5.8 첫 화면 카드
미소 인사 상자 바로 아래, 길잡이 카드 위. "오늘의 연습 · 🔥 N일째 · 오늘 x/3" 또는 다 했으면 "오늘 연습 완료". 시작 전이면 "레슨 하나를 마치면 열려요".

### 5.9 저장
`kb-practice:v1` 한 칸 (try/catch, 깨지면 빈 기록).
```
{ days: ['2026-11-20', …],            // 연습한 날
  today: { date, ids: [...], answers: { id: 'a' } },
  questions: { id: { last: date, missed: bool } },
  cards: { termId: { known: bool, last: date } },
  badges: { id: date } }
```

### 5.10 화면 (휴대폰)
```
┌ ← Contact Center KB ──── 한국어|English ┐
│ 오늘의 연습                  🔥 4일째    │
│ [미소 생각] 문제 2 / 3                   │
│ 지민이 "야간 교대가 잦나요?"…            │
│ [ 가볍게 넘긴다 ]                        │
│ [ 있는 그대로 설명한다 ] ✓               │
│ [미소 기쁨] 맞습니다. …   [다음 문제 →]  │
│ ── 용어 카드 · 오늘 5장 ──               │
│ ── 배지 9개 ──                           │
├──────────────────────────────────────────┤
│   홈      배우기      길잡이      찾아보기│
└──────────────────────────────────────────┘
```
아래 메뉴에서 `practice/`는 "배우기"로 표시.

## 6. 문안 (한국어 확정 2026-11-20, 영어는 번역)

테스트가 화면 문구와 아래 두 표가 같은지 확인한다.

| 키 | 한국어 | English |
|---|---|---|
| title | 오늘의 연습 | Today's practice |
| intro | 마친 레슨에서 문제 3개를 골랐어요. 틈틈이 풀어 보세요. | Three questions from lessons you've finished. Try them when you have a moment. |
| streak | 🔥 {n}일째 | 🔥 Day {n} |
| streakPending | 오늘 하면 {n}일째 | Practice today for day {n} |
| weekend | 주말은 쉬는 날이에요. 풀어도 좋지만 연속 일수에는 넣지 않아요. | Weekends are days off. You can still practice, but it won't add to your streak. |
| questionCount | 문제 {i} / {n} | Question {i} of {n} |
| correct | 맞아요! | That's right! |
| wrong | 아쉬워요. 해설을 보고 다음에 다시 만나요. | Not quite. Read the explanation, and we'll meet this one again. |
| reviewLesson | 레슨 다시 보기 → | Review the lesson → |
| next | 다음 문제 → | Next question → |
| doneTitle | 오늘 연습 끝! | Done for today! |
| doneLine | 내일도 3문제만 같이 해요. | Just three questions again tomorrow. |
| locked | 레슨 하나를 마치면 연습이 열려요. | Practice opens once you finish a lesson. |
| lockedLink | 라이프사이클 레슨 1 시작하기 → | Start Lifecycle lesson 1 → |
| cardsTitle | 용어 카드 | Term cards |
| cardsToday | 오늘 {n}장 | {n} today |
| cardFlip | 눌러서 뜻 보기 | Tap to see the meaning |
| cardKnow | 알아요 | I know it |
| cardAgain | 다시 볼래요 | Show me again |
| cardsDone | 오늘 카드 끝! | That's all the cards for today! |
| badgesTitle | 배지 | Badges |
| badgeNew | 새 배지: {name} | New badge: {name} |
| homeCard | 오늘의 연습 | Today's practice |
| homeToday | 오늘 {x}/{n} | Today {x}/{n} |
| homeDone | 오늘 연습 완료 | Today's practice done |
| homeLocked | 레슨 하나를 마치면 열려요 | Opens once you finish a lesson |

**배지**

| id | 이름 | Name | 조건 | Condition |
|---|---|---|---|---|
| first | 첫걸음 | First step | 오늘의 문제를 처음 다 풂 (주말 포함) | Finish today's questions for the first time (weekends count) |
| streak3 | 3일 연속 | 3-day streak | 평일 연속 3일 | 3 weekdays in a row |
| week | 일주일 연속 | Week streak | 평일 연속 5일 | 5 weekdays in a row |
| month | 한 달 연속 | Month streak | 평일 연속 20일 | 20 weekdays in a row |
| perfect | 만점 | Perfect score | 그날 문제를 모두 맞힘 (문제가 3개 미만인 날은 제외) | Get all of a day's questions right (days with fewer than 3 questions don't count) |
| comeback | 다시 잡기 | Comeback | 전에 틀린 문제를 다시 맞힘 | Get a question right that you missed before |
| terms | 용어 박사 | Term expert | 열린 용어 카드가 10장 이상이고 모두 "알아요" | 10 or more term cards open, all marked "I know it" |
| lifecycle | 라이프사이클 완주 | Lifecycle finished | 라이프사이클 6개 레슨을 모두 마침 | Finish all 6 Lifecycle lessons |
| sop | SOP 완주 | SOP Library finished | SOP 7개 레슨을 모두 마침 | Finish all 7 SOP lessons |

## 7. 제작자에게 맡기는 것
- 파일 나누기, 섞는 방법(날짜 기반 의사난수), 스타일 세부.
- 접근성: 맞음/틀림·배지 안내는 화면 낭독기가 읽도록 고정 상태 줄 하나.

## 8. 고치는 곳과 확인
- 새 폴더 `practice/` (index.html, 데이터·계산·그리기·앱). 고치는 곳: `home/` 카드, `shared/appbar.js`(practice → 배우기), `sw.js` 재생성, README, LOG 17.
- 테스트: 문제 열림(직군·강의 구분·id 충돌), 오늘의 문제 고르기(순위·같은 날 같음·3개 미만), 연속 학습(평일만 셈, 주말 건너뜀, 평일 하루 빠지면 끊김, 오늘 아직, 오늘이 주말, 주말 연습은 안 셈), 배지 9개 조건, 용어 카드 열림·순서, 저장소 막힘/깨짐, 한국어 문안 = 이 문서 §6, 영어에 한글 없음.
- 브라우저 점검: 320/390px, 어두운 화면, 오프라인에서 열림, 메뉴 표시, 레슨 하나 마친 뒤 문제 풀기 흐름.
