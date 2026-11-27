# 상담사 SOP 라이브러리 — 정답 단서 없애기 제안

작성: 2026-11-27 · 상태: 승인 (2026-11-27) · 대상: `docs/superpowers/specs/2026-11-27-agent-sop-copy-ko.md`, `.en.md`

최종 검토에서 나온 지적 두 가지를 고칩니다. 질문·정답·피드백·해설과 id는 그대로 두고, 보기 문장만 바꿉니다.

1. **"~니" 단서.** 지금은 "~니"(이유)가 붙은 보기 10개가 모두 오답입니다. 바꾸면 정답 3개, 오답 4개에 붙습니다.
2. **길이 단서.** 정답이 가장 짧거나 가장 긴 문항이 10개입니다. 바꾸면 1개(kbreport-q1, 가장 긺)만 남습니다.

기존 가드는 그대로 통과합니다.
- 정답이 혼자 가장 긴 문항: 1/16
- 정답 이유 비율 31%, 오답 13%
- 두 오답에만 이유가 붙은 문항: 0개

## 바꿀 보기 (18개)

| 문항 · 보기 | 지금 | 바꿀 한국어 | 바꿀 영어 |
|---|---|---|---|
| request-q1 c (오답) | 고객이 화가 났으니, 하린에게 통화를 바로 돌려 처음부터 직접 받게 한다. | 화가 난 고객의 통화를 하린에게 바로 돌려, 처음부터 하린이 직접 받게 한다. | Transfer the angry customer's call straight to Harin so she takes it from the start. |
| abuse-q1 a (오답) | 욕설을 들었으니, 승인을 받아 바로 통화를 끝낸다. | 승인을 받아 그 자리에서 바로 통화를 끝낸다. | Get approval and end the call on the spot. |
| abuse-q1 b (정답) | 센터가 정한 문구로 경고한다. | 욕설이 처음이니, 센터가 정한 문구로 경고한다. | Since it's the first time, warn using the center's set wording. |
| absence-q1 c (정답) | 근무 1~2시간 전(예시)에 수진 팀장에게 직접 알린다. | 근무 1~2시간 전(예시)에 정한 방법으로 수진 팀장에게 직접 알린다. | Tell Sujin directly, the way the team has set, 1 to 2 hours before her shift (Example). |
| absence-q2 a (정답) | 직무전문가 하린 | 팀장이 없으니, 직무전문가 하린에게 알린다. | Since the team leader is out, tell Harin, the SME. |
| absence-q2 c (오답) | 같은 팀 동료 아무에게나 | 같은 팀 동료 아무에게나 알린다. | Tell any colleague on the same team. |
| huddle-q1 a (정답) | 허들에서 바로 묻는다. | 헷갈린 채로 안내하면 틀리기 쉬우니, 허들에서 바로 묻는다. | Guiding while unsure is easy to get wrong, so ask right there in the huddle. |
| huddle-q1 b (오답) | 다른 사람도 다 알아들은 것 같으니, 고객 응대 중에 짐작해서 안내한다. | 응대 중에 짐작해서 안내하고, 틀리면 나중에 고친다. | Guess during the contact, and fix it later if it was wrong. |
| huddle-q2 b (정답) | 바뀐 대로 안내할 수 있게, 팀 채팅방의 허들 내용을 먼저 읽는다. | 바뀐 안내를 놓치지 않게, 팀 채팅방의 허들 내용부터 읽는다. | So she doesn't miss the change, read the huddle notes in the team chat first. |
| kbreport-q1 c (오답) | 바른 내용이라고 생각하는 문장만 정리해서 보낸다. | 바른 내용이라고 생각하는 문장만 정리한 글 | A note with only the sentences she thinks are right |
| kbreport-q2 b (오답) | 확인한 내용이 맞다고 보고, 내 메모대로 계속 안내한다. | 내가 확인한 내용이 맞다고 보고 계속 안내한다. | Treat what she checked as right and keep guiding that way. |
| kbreport-q2 c (정답) | 하린이 팀 채팅방에 올린 임시 안내대로 응대한다. | 팀 채팅방에 올라온 하린의 임시 안내대로 응대한다. | Handle contacts with Harin's interim guidance from the team chat. |
| scrubfb-q2 a (정답) | 잊지 않게, 그 단계를 체크리스트에 적고 다음 몇 건은 꼭 확인한다. | 그 단계를 체크리스트에 적고, 다음 몇 건은 꼭 확인한다. | Write the step on a checklist, and be sure to check it for the next few contacts. |
| scrubfb-q2 c (오답) | 바쁠 때 실수가 나오니, 바쁜 시간에는 확인 단계를 짧게 줄인다. | 바쁜 시간에는 확인 단계를 줄이고, 한가할 때 몰아서 확인한다. | Shorten the verification step in busy hours, and catch up on checks when it's quiet. |
| dispute-q1 a (오답) | QA에게 메시지를 보내 왜 감점했는지 바로 따진다. | QA에게 바로 메시지를 보내 왜 감점했는지 따져 묻는다. | Message QA right away and demand to know why points were taken. |
| dispute-q2 a (오답) | 납득이 안 되니, 같은 건으로 다시 이의를 제기한다. | 납득될 때까지 같은 건으로 다시 이의를 제기한다. | Dispute the same case again until it makes sense. |
| dispute-q2 c (정답) | 다음부터 같은 기준으로 안내하도록, 결과의 이유를 듣는다. | 결과의 이유를 듣고, 다음부터 그 기준으로 안내한다. | Hear the reason for the result, and guide by that standard from now on. |
| outage-q1 a (오답) | 내 컴퓨터 문제일 수 있으니, 재부팅하고 프로그램을 다시 설치하며 계속 고쳐 본다. | 내 컴퓨터 문제라고 보고, 재부팅하고 프로그램을 다시 설치하며 계속 고쳐 본다. | Assume it's her computer, and keep rebooting and reinstalling the program to fix it. |

## 함께 고칠 작은 지적 (검토 Minor)

- **request-q1 a 영어 수정:** "can I approve it?"을 "can it be approved?"로 바꿉니다. 한국어는 "승인 되나요?"입니다.
- **outage 스텝 7 영어 용어:** "major incident response"를 "large-scale issue response"로 (팀장 SOP 영어 제목 "Large-Scale Issue Response") 바꿔 팀장 SOP 제목과 맞춥니다.
- **새 가드 테스트 (agent-sop만):**
  - 정답이 혼자 가장 짧은 문항은 4분의 1 이하여야 합니다.
  - "~니"가 붙은 보기 가운데 정답이 3분의 1 이상이어야 합니다.

## 다른 강의에도 같은 단서가 있습니다 (이번 범위 밖)

"~니" 보기가 거의 오답에만 붙은 강의가 있습니다.

| 강의 | "~니" 정답 | "~니" 오답 |
|---|---|---|
| 상담사 라이프사이클 | 3 | 17 |
| 상담사 첫걸음 | 1 | 7 |
| 상담사 커리어 | 0 | 3 |

정답이 혼자 가장 짧은 문항은 상담사 첫걸음 5/16, 상담사 커리어 4/8입니다. 나중에 사이트 전체 검수 4단계로 따로 다루기를 제안합니다.
