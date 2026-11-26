# 미소의 엑셀 연습: 직급별 안내문, 상담사 심화 숨김 (2026-11-26) — 짧은 설계

## 왜
엑셀 페이지의 안내문은 직급과 상관없이 "팀장에게 꼭 필요한 엑셀 11가지"라고 합니다. 상담사·직무전문가·부매니저·매니저에게는 맞지 않습니다(사용자). 상담사에게는 심화 레슨("심화: 함수 섞어 쓰기")도 필요 없습니다.

## 정한 것 (사용자 승인)
- 안내문은 직급마다 다르게 씁니다. 앞뒤 문장은 지금과 같습니다.
- 11개를 모두 마쳤을 때 나오는 문구도 직급마다 다르게 씁니다.
- 상담사도 직무전문가처럼 심화 레슨을 보지 않습니다. 오늘의 연습에도 심화 문제가 나오지 않습니다. 이미 풀어 둔 기록은 그대로 둡니다.

## 문구 (이 표가 원본이며, 테스트가 한 글자씩 대조합니다)

### 안내문
| 직급 | 한국어 | English |
|---|---|---|
| agent | 미소 팀 하루 콜 기록(예시) 하나로 내 실적을 직접 확인할 때 쓰는 엑셀 11가지를 익혀요. 타자 없이 눌러서만 풀어요. | Learn the 11 Excel skills for checking your own numbers, using one example table of Miso's team's calls. No typing: just tap. |
| sme | 미소 팀 하루 콜 기록(예시) 하나로 문의 유형과 흐름을 정리할 때 쓰는 엑셀 11가지를 익혀요. 타자 없이 눌러서만 풀어요. | Learn the 11 Excel skills for sorting contact types and trends, using one example table of Miso's team's calls. No typing: just tap. |
| tl | 미소 팀 하루 콜 기록(예시) 하나로 팀장에게 꼭 필요한 엑셀 11가지를 익혀요. 타자 없이 눌러서만 풀어요. | Learn the 11 Excel skills a team leader needs, using one example table of Miso's team's calls. No typing: just tap. |
| am | 미소 팀 하루 콜 기록(예시) 하나로 여러 팀의 실적을 비교할 때 쓰는 엑셀 11가지를 익혀요. 타자 없이 눌러서만 풀어요. | Learn the 11 Excel skills for comparing several teams, using one example table of Miso's team's calls. No typing: just tap. |
| om | 미소 팀 하루 콜 기록(예시) 하나로 프로젝트 실적을 한눈에 볼 때 쓰는 엑셀 11가지를 익혀요. 타자 없이 눌러서만 풀어요. | Learn the 11 Excel skills for seeing the whole project at a glance, using one example table of Miso's team's calls. No typing: just tap. |

### 11개를 모두 마쳤을 때
심화 레슨을 보는 직급(팀장·부매니저·매니저)에게는 지금처럼 "이제 아래 심화 레슨에서…" 문구가 대신 나옵니다.

| 직급 | 한국어 | English |
|---|---|---|
| agent | 11개 레슨을 모두 마쳤어요. 이제 내 실적 자료에 써 보세요. | You've finished all 11 lessons. Now try them on your own numbers. |
| sme | 11개 레슨을 모두 마쳤어요. 이제 실제 문의 유형 정리에 써 보세요. | You've finished all 11 lessons. Now try them when you sort real contact types. |
| tl | 11개 레슨을 모두 마쳤어요. 이제 실제 팀 보고서에 써 보세요. | You've finished all 11 lessons. Now try them on your real team reports. |
| am | 11개 레슨을 모두 마쳤어요. 이제 실제 팀별 실적 비교에 써 보세요. | You've finished all 11 lessons. Now try them when you compare your real teams. |
| om | 11개 레슨을 모두 마쳤어요. 이제 실제 프로젝트 보고서에 써 보세요. | You've finished all 11 lessons. Now try them on your real project reports. |

## 만드는 방식
- 직급별 문구는 `excel/role-copy.js`에 둡니다. 엑셀 페이지는 저장된 직급을 받아 그 문구를 씁니다. 직급을 알 수 없으면 지금 문구(팀장용)를 씁니다.
- 심화 표시 조건은 `showsAdvancedExcel(role)`입니다. 상담사와 직무전문가는 false입니다.

## 확인
- 테스트
  - 직급별 안내문과 마친 뒤 문구가 이 표와 같음
  - 상담사는 심화가 보이지 않음
  - 직급을 모르면 지금 문구
- 브라우저 점검
  - 상담사로 엑셀을 열면 상담사 안내문이 나오고 심화가 없음
