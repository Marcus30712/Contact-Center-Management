// Miso's Excel practice: why a wrong pick falls short. Korean approved 2026-11-21;
// tests check it against docs/superpowers/specs/2026-11-21-excel-wrong-feedback.md.
// Keys are option/chip indexes in the data's own order (before on-screen shuffling).
export const EXCEL_FEEDBACK_UI = {
  builtResult: { ko: "만든 수식의 결과는 {v}이에요.", en: "Your formula gives {v}." },
  pickedCell: { ko: "고른 칸은 {c}이에요.", en: "You picked {c}." },
};

import { ADVANCED_FEEDBACK } from './advanced.js';

export const EXCEL_FEEDBACK = {
  "1-1": {
    1: { ko: "S03은 상담사 번호라 A열, A4 칸에 있어요. B열은 이름이에요.", en: "S03 is the agent ID, so it's in column A, cell A4. Column B is the name." },
    2: { ko: "61은 콜 수라 D열, D4 칸에 있어요. 열 글자부터 확인해 보세요.", en: "61 is the call count, so it's in column D, cell D4. Check the column letter first." },
  },
  "1-2": {
    1: { ko: "9는 끝 행 번호예요. 2행부터 세면 2, 3, …, 9로 8개예요.", en: "9 is the last row number. Counting from row 2, that's 2, 3, …, 9: eight rows." },
    2: { ko: "D2와 D9는 범위의 처음과 끝이고, 그 사이 칸도 모두 들어가요.", en: "D2 and D9 are the first and last cells; every cell between them is included too." },
  },
  "1-3": {
    1: { ko: "1행은 머리글 \"팀\"이라, C1부터 잡으면 상담사가 아닌 칸까지 들어가요.", en: "Row 1 is the \"Team\" header, so starting at C1 takes in a cell that isn't an agent." },
    2: { ko: "C3부터 잡으면 2행에 있는 첫 번째 상담사가 빠져요.", en: "Starting at C3 leaves out the first agent, who is in row 2." },
  },
  "1-4": {
    1: { ko: "E열은 총 처리 시간이에요. 콜 수는 그 왼쪽 D열이에요.", en: "Column E is total handle time. Calls are in column D, just to its left." },
    2: { ko: "C열은 팀이에요. 콜 수는 그 오른쪽 D열이에요.", en: "Column C is the team. Calls are in column D, just to its right." },
  },
  "2-1": {
    1: { ko: "AVERAGE는 평균이라, 팀 전체가 아니라 한 사람당 콜 수(50.75)가 나와요.", en: "AVERAGE gives the average, so you get calls per agent (50.75), not the team total." },
    2: { ko: "MAX는 가장 큰 값 하나(61)만 골라요. 모두 더하려면 SUM이에요.", en: "MAX picks only the single largest value (61). To add them all up, use SUM." },
  },
  "2-2": {
    1: { ko: "39는 가장 작은 값이라 MIN의 결과예요. MAX는 가장 큰 값을 찾아요.", en: "39 is the smallest value, so it's what MIN returns. MAX finds the largest." },
    2: { ko: "406은 모두 더한 SUM의 결과예요. MAX는 그중 가장 큰 값 하나만 보여 줘요.", en: "406 is the total, which is what SUM returns. MAX shows only the single largest value." },
  },
  "2-3": {
    1: { ko: "SUM은 모두 더해 406이 나와요. 한 명당 평균은 AVERAGE예요.", en: "SUM adds everything up to 406. The average per agent is AVERAGE." },
    2: { ko: "MIN은 가장 적은 39만 보여 줘요. 평균은 AVERAGE예요.", en: "MIN shows only the smallest, 39. For the average, use AVERAGE." },
  },
  "2-4": {
    1: { ko: "D열은 콜 수라, 가장 적은 콜 수 39가 나와요. 처리 시간은 E열이에요.", en: "Column D is calls, so you get the fewest calls, 39. Handle time is in column E." },
    2: { ko: "F열은 30초 안에 받은 콜이에요. 처리 시간은 E열이에요.", en: "Column F is calls answered within 30 seconds. Handle time is in column E." },
  },
  "3-1": {
    1: { ko: "거꾸로 나누면 1보다 큰 값이 나와 비율이 되지 않아요. 부분을 전체로 나눠요.", en: "Dividing the other way gives a number above 1, which isn't a rate. Divide the part by the whole." },
    2: { ko: "빼면 30초를 넘긴 콜 수가 나와요. 비율은 나눠야 해요.", en: "Subtracting gives the number of calls that took longer than 30 seconds. A rate needs division." },
  },
  "3-2": {
    1: { ko: "셋째 자리 6은 5 이상이라 올려요. 버리면 0.84가 돼요.", en: "The third decimal, 6, is 5 or more, so it rounds up. Dropping it gives 0.84." },
    2: { ko: "ROUND는 정한 자릿수로 줄이는 함수라, 원래 값이 그대로 남지 않아요.", en: "ROUND trims the value to the digits you set, so the original value doesn't stay as it is." },
  },
  "3-3": {
    1: { ko: "G4는 목표 콜 수라, 실제 받은 콜이 아닌 목표로 나눈 값이 돼요. 전체 콜은 D열이에요.", en: "G4 is the target, so you'd be dividing by the target, not the calls actually handled. All calls are in column D." },
    2: { ko: "F4로 나누면 자기 자신으로 나눠서 늘 1이 나와요.", en: "Dividing by F4 divides the value by itself, so you always get 1." },
  },
  "3-4": {
    1: { ko: "자릿수 1은 소수 첫째 자리까지만 남겨 0.8이 돼요.", en: "1 keeps only the first decimal place, giving 0.8." },
    2: { ko: "자릿수 0은 정수로 반올림해 1이 돼요.", en: "0 rounds to a whole number, giving 1." },
  },
  "4-1": {
    1: { ko: "5는 A팀 인원이에요. 조건에 \"B팀\"을 넣었으니 B팀만 세요.", en: "5 is the headcount of Team A. The condition is \"Team B\", so only Team B is counted." },
    2: { ko: "8은 전체 인원이에요. COUNTIF는 조건에 맞는 칸만 세요.", en: "8 is everyone. COUNTIF counts only the cells that match the condition." },
  },
  "4-2": {
    1: { ko: "하나라도 맞으면 세는 것은 \"또는\"이에요. COUNTIFS는 모든 조건이 맞아야 세요.", en: "Counting when any one condition matches is \"or\". COUNTIFS counts a row only when every condition matches." },
    2: { ko: "COUNTIFS는 조건에 맞는 행을 세요. 맞지 않는 행은 세지 않아요.", en: "COUNTIFS counts rows that match. Rows that don't match aren't counted." },
  },
  "4-3": {
    1: { ko: "\">50\"은 50을 빼서 4명만 세요. \"이상\"은 50도 넣는 >=예요.", en: "\">50\" leaves out 50 and counts only 4. \"50 or more\" includes 50, which is >=." },
    2: { ko: "\"50\"은 딱 50인 칸만 세서 1명이에요. 50 이상은 \">=50\"이에요.", en: "\"50\" counts only cells that are exactly 50, which is 1. 50 or more is \">=50\"." },
  },
  "4-4": {
    1: { ko: "E열은 처리 시간이라 A팀 5명이 모두 55 이상으로 세어져요. 콜 수는 D열이에요.", en: "Column E is handle time, so all 5 Team A agents count as 55 or more. Calls are in column D." },
    2: { ko: "G열은 목표라 A팀 목표 55가 모두 세어져 5명이 돼요. 콜 수는 D열이에요.", en: "Column G is the target, and every Team A target is 55, so all 5 are counted. Calls are in column D." },
  },
  "5-1": {
    1: { ko: "조건 범위는 더할 범위 다음에 와요. SUMIFS는 \"무엇을 더할지\"부터 써요.", en: "The condition range comes after the range to add. SUMIFS starts with what to add." },
    2: { ko: "결과를 적을 칸은 수식을 입력하는 칸이라, 수식 안에는 들어가지 않아요.", en: "The result cell is where you type the formula, so it doesn't go inside the formula." },
  },
  "5-2": {
    1: { ko: "인원으로 나누면 한 사람당 처리 시간이 돼요. AHT는 콜 한 건당이라 콜 수로 나눠요.", en: "Dividing by headcount gives handle time per person. AHT is per call, so divide by calls." },
    2: { ko: "상담사별 총 처리 시간을 평균 내면 한 사람당 시간이 돼요. AHT는 전체 시간을 콜 수로 나눠요.", en: "Averaging each agent's total handle time gives time per person. AHT divides the total time by calls." },
  },
  "5-3": {
    1: { ko: "D열을 더하면 A팀 콜 수 합계 276이 나와요. 처리 시간은 E열이에요.", en: "Adding column D gives Team A's total calls, 276. Handle time is in column E." },
    2: { ko: "C열은 \"A팀\" 같은 글자라 더할 값이 없어 0이 나와요. 더할 값은 E열이에요.", en: "Column C holds text like \"Team A\", so there's nothing to add and you get 0. The values to add are in column E." },
  },
  "5-4": {
    1: { ko: "\"A팀\"을 넣으면 A팀의 평균 콜 수(55.2)가 나와요. B팀만 보려면 \"B팀\"이에요.", en: "\"Team A\" gives Team A's average calls (55.2). For Team B only, use \"Team B\"." },
    2: { ko: "팀 칸은 글자라 \">=45\"에 맞는 행이 없어서 평균을 낼 수 없어요.", en: "The team cells hold text, so no row matches \">=45\" and there's nothing to average." },
  },
  "6-1": {
    1: { ko: "61건은 목표 55건보다 많아 조건이 맞아요. 맞을 때 값은 \"달성\"이에요.", en: "61 calls is more than the target of 55, so the condition is true. The value for true is \"Met\"." },
    2: { ko: "IF는 조건에 따라 정한 글자를 보여 줘요. 61은 D4에 있는 값일 뿐이에요.", en: "IF shows the text you set for each outcome. 61 is just the value in D4." },
  },
  "6-2": {
    1: { ko: "틀릴 때 값은 세 번째 칸이에요. 차례는 조건, 맞을 때, 틀릴 때예요.", en: "The value for false is the third part. The order is condition, if true, if false." },
    2: { ko: "조건은 첫 번째 칸이에요. 두 번째 칸에는 맞을 때 보여 줄 값을 써요.", en: "The condition is the first part. The second part is the value to show if it's true." },
  },
  "6-3": {
    1: { ko: "<=는 \"이하\"라서, 47건이 목표 45건보다 많은데도 \"미달\"이 나와요.", en: "<= means \"at most\", so 47 calls shows \"Missed\" even though it beats the target of 45." },
    2: { ko: "=는 목표와 딱 같을 때만 맞아서, 47건이면 \"미달\"이 나와요.", en: "= is true only when it equals the target exactly, so 47 calls shows \"Missed\"." },
  },
  "6-4": {
    1: { ko: "비율은 0~1 사이 값이라 80보다 늘 작아서, 언제나 \"점검\"이 나와요.", en: "A rate is between 0 and 1, so it's always below 80 and you always get \"Check\"." },
    2: { ko: "8도 비율보다 늘 커서 언제나 \"점검\"이 나와요. 80%는 0.8이에요.", en: "8 is also always bigger than the rate, so you always get \"Check\". 80% is 0.8." },
  },
  "7-1": {
    1: { ko: "강예준은 B열의 이름이에요. 가져올 범위가 D열이라 콜 수가 나와요.", en: "Kang Yejun is the name in column B. The return range is column D, so you get calls." },
    2: { ko: "6은 ID 속 숫자일 뿐이에요. XLOOKUP은 찾은 행에서 D열 값을 가져와요.", en: "6 is just the number inside the ID. XLOOKUP returns the column D value from the matching row." },
  },
  "7-2": {
    1: { ko: "비슷한 값까지 찾는 것은 TRUE예요. 그러면 엉뚱한 행을 가져올 수 있어요.", en: "Finding close matches is TRUE, which can return the wrong row." },
    2: { ko: "FALSE는 찾는 방식을 정할 뿐이에요. 못 찾으면 0이 아니라 #N/A가 나와요.", en: "FALSE only sets how to search. If nothing matches, you get #N/A, not 0." },
  },
  "7-3": {
    1: { ko: "C열을 넣으면 이름 대신 팀(A팀)이 나와요. 이름은 B열이에요.", en: "Column C gives the team (Team A) instead of the name. Names are in column B." },
    2: { ko: "D열을 넣으면 콜 수 58이 나와요. 이름은 B열이에요.", en: "Column D gives the call count, 58. Names are in column B." },
  },
  "7-4": {
    1: { ko: "2번째 열은 이름이라 \"이도윤\"이 나와요. 팀은 3번째 열이에요.", en: "Column 2 is the name, so you get \"Lee Doyun\". The team is column 3." },
    2: { ko: "4번째 열은 콜 수라 47이 나와요. 팀은 3번째 열이에요.", en: "Column 4 is calls, so you get 47. The team is column 3." },
  },
  "8-1": {
    1: { ko: "5.5는 그냥 나눈 값이에요. INT는 소수점 아래를 버려요.", en: "5.5 is the plain division result. INT drops everything after the decimal point." },
    2: { ko: "30은 나누고 남은 초라 MOD(330, 60)의 결과예요.", en: "30 is the seconds left over, which is what MOD(330, 60) returns." },
  },
  "8-2": {
    1: { ko: "3600은 한 시간의 초예요. 엑셀의 1은 하루라 86400으로 나눠요.", en: "3600 is the seconds in an hour. In Excel, 1 is a day, so divide by 86400." },
    2: { ko: "60으로 나누면 분이 될 뿐이에요. 엑셀 시간 값은 하루를 1로 봐요.", en: "Dividing by 60 just gives minutes. An Excel time value counts a day as 1." },
  },
  "8-3": {
    1: { ko: "G7은 목표 콜 수라 콜 한 건당 시간이 되지 않아요. 실제 콜 수 D7로 나눠요.", en: "G7 is the target, so it doesn't give time per call. Divide by the actual calls in D7." },
    2: { ko: "F7은 30초 안에 받은 콜만이라, 전체 콜로 나눈 것보다 큰 값이 나와요.", en: "F7 is only the calls answered within 30 seconds, so the result is larger than dividing by all calls." },
  },
  "8-4": {
    1: { ko: "INT는 몫(4분)을 구하는 쪽이에요. 남은 초는 MOD로 구해요.", en: "INT is for the whole part (4 minutes). For the seconds left over, use MOD." },
    2: { ko: "ROUND는 반올림하는 함수라 남은 초를 구하지 못해요.", en: "ROUND rounds a number, so it can't give the seconds left over." },
  },
  "9-1": {
    1: { ko: "오름차순이면 적게 받은 사람부터 나와요. 많이 받은 사람부터는 내림차순이에요.", en: "Smallest to Largest starts with whoever took the fewest calls. Most calls first is Largest to Smallest." },
    2: { ko: "이름순은 가나다 차례라 콜 수와 상관없이 정렬돼요.", en: "Sorting by name follows the alphabet, regardless of calls." },
  },
  "9-2": {
    1: { ko: "필터는 행을 지우지 않아요. 풀면 A팀 행이 그대로 다시 보여요.", en: "A filter doesn't delete rows. Clear it and the Team A rows come back as they were." },
    2: { ko: "자리를 옮기는 것은 정렬이에요. 필터는 조건에 맞지 않는 행을 숨겨요.", en: "Moving rows is sorting. A filter hides the rows that don't match." },
  },
  "9-3": {
    1: { ko: "삽입 탭에는 피벗 테이블이 있어요. 정렬과 필터는 데이터 탭이에요.", en: "The Insert tab has PivotTable. Sort and Filter are on the Data tab." },
    2: { ko: "홈 탭에도 간단한 정렬 단추가 있지만, 정렬과 필터의 자세한 설정은 데이터 탭에 모여 있어요.", en: "The Home tab has a quick sort button too, but the full Sort and Filter settings are on the Data tab." },
  },
  "9-4": {
    1: { ko: "내림차순이면 처리 시간이 긴 사람부터 나와요.", en: "Largest to Smallest starts with the longest handle time." },
    2: { ko: "사용자 지정 목록은 요일처럼 정한 차례로 정렬할 때 써요. 작은 값부터는 오름차순이에요.", en: "A custom list sorts in an order you define, like days of the week. Smallest first is Smallest to Largest." },
  },
  "10-1": {
    1: { ko: "팀을 값에 놓으면 팀 개수만 세어져요. 값에는 더할 숫자인 콜 수를 놓아요.", en: "Putting Team in Values just counts the teams. Values is for the numbers to add up, the calls." },
    2: { ko: "필터에 놓으면 팀을 골라 볼 수는 있지만, 팀마다 한 줄씩 나오지 않아요.", en: "In Filters you can pick a team to view, but you don't get one row per team." },
  },
  "10-2": {
    1: { ko: "피벗 테이블은 원본이 바뀌어도 새로 고침 전까지 예전 숫자를 보여 줘요.", en: "A PivotTable keeps showing the old numbers until you refresh, even after the source changes." },
    2: { ko: "지우고 다시 만들 필요 없이 새로 고침만 누르면 돼요.", en: "There's no need to delete and rebuild it; just refresh." },
  },
  "10-3": {
    1: { ko: "데이터 탭에는 정렬과 필터가 있어요. 피벗 테이블은 새로 끼워 넣는 것이라 삽입 탭이에요.", en: "The Data tab has Sort and Filter. A PivotTable is something you insert, so it's on the Insert tab." },
    2: { ko: "홈 탭은 글꼴과 색처럼 모양을 바꾸는 곳이에요.", en: "The Home tab is for changing how things look, such as fonts and colors." },
  },
  "10-4": {
    1: { ko: "합계는 처음 설정이라 팀별 콜 수를 모두 더한 값이 나와요.", en: "Sum is the default, so you get each team's total calls." },
    2: { ko: "개수로 바꾸면 팀별 인원(A팀 5, B팀 3)이 나와요.", en: "Count gives the headcount per team (Team A 5, Team B 3)." },
  },
  "11-1": {
    1: { ko: "조건부 서식은 값이 바뀔 때마다 조건을 다시 확인해서, 처음 색에 머물지 않아요.", en: "Conditional formatting rechecks the rule whenever the value changes, so it doesn't stay at its first color." },
    2: { ko: "값이 바뀌어도 규칙은 그대로 남아 새 값에 맞춰 칠해요.", en: "The rule stays when the value changes and colors the cell to match the new value." },
  },
  "11-2": {
    1: { ko: "47은 45보다 커서 칠해지지 않아요. 45보다 작은 값은 39와 44예요.", en: "47 is more than 45, so it isn't colored. The values below 45 are 39 and 44." },
    2: { ko: "가장 작은 39만 세면 1칸이지만, 44도 45보다 작아요.", en: "Counting only the smallest, 39, gives 1, but 44 is also below 45." },
  },
  "11-3": {
    1: { ko: "데이터 탭에는 정렬과 필터가 있어요. 칸의 색을 바꾸는 메뉴는 홈 탭이에요.", en: "The Data tab has Sort and Filter. Menus that change a cell's color are on the Home tab." },
    2: { ko: "삽입 탭은 표나 차트를 새로 넣는 곳이에요. 조건부 서식은 홈 탭이에요.", en: "The Insert tab is for adding tables or charts. Conditional formatting is on the Home tab." },
  },
  "11-4": {
    1: { ko: ">는 목표보다 많은 칸을 칠해요. 미달은 목표보다 작은 <예요.", en: "> colors cells above the target. Missing the target means below it, which is <." },
    2: { ko: "=는 목표와 딱 같은 칸만 칠해서, 못 미친 칸은 칠해지지 않아요.", en: "= colors only cells exactly equal to the target, so cells below it stay uncolored." },
  },
  // The advanced lessons' feedback, kept with their copy in excel/advanced.js.
  ...ADVANCED_FEEDBACK,
};
