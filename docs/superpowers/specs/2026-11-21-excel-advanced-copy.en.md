# Miso's Excel Practice: Advanced — English copy

Written 2026-11-21. Follows the approved Korean (`2026-11-21-excel-advanced-copy.md`), in the same format as `2026-11-20-excel-practice-copy.en.md`. A "Wrong:" line is the feedback for picking that option or chip.

## Screen wording

| Key | English |
|---|---|
| advancedHeading | Advanced: mixing functions |
| advancedNote | Use the functions you've learned together in one formula. |
| lockedAfter | Opens when you finish {list} |
| advancedDone | You've finished the advanced lessons too. |
| advancedNext | You've finished all 11 basic lessons. Now mix functions in the advanced lessons below. |
| orderHint | The result is right, but the formula isn't in the shape this question practises. Check the order of the cards. |

## Lesson 12 · Judging from a conditional count

### Cards
1. You can put one function inside another. =COUNTIFS(C2:C9, "Team A", D2:D9, ">=55") counts the Team A agents who took 55 calls or more: 3.
2. Put that count in IF's condition and the judgment happens in one go. =IF(COUNTIFS(C2:C9, "Team A", D2:D9, ">=55")>=3, "OK", "Check") shows "OK" because there are 3.

### Questions
#### 12-1 · choice
- Question: What does =IF(COUNTIFS(C2:C9, "Team B", D2:D9, ">=45")>=2, "OK", "Check") return?
- Options: OK · Check · 1
- Answer: Check
- Wrong: OK → On Team B only Lee Doyun took 45 calls or more, so the condition 1>=2 is false.
- Wrong: 1 → 1 is the count from the inner COUNTIFS. What IF finally shows is "OK" or "Check".
- Explanation: On Team B only Lee Doyun (47 calls) took 45 or more, so the count is 1. 1 is less than 2, so it shows "Check".

#### 12-2 · choice
- Question: When one function sits inside another, which is worked out first?
- Options: The inner function · The outer function · Whichever is written further left
- Answer: The inner function
- Wrong: The outer function → IF can only judge once it has its condition, so it takes the inner COUNTIFS's result first.
- Wrong: Whichever is written further left → It goes from the innermost brackets out, not in the order things are written.
- Explanation: The inner COUNTIFS counts first, and the outer IF takes that result and judges it.

#### 12-3 · blank
- Question: Show "OK" if 3 or more Team A agents took 55 calls or more.
- Formula: `=IF(COUNTIFS(C2:C9, "Team A", D2:D9, ">=55")___3, "OK", "Check")`
- Chips: >= · < · <>
- Answer: >=
- Wrong: < → < means "fewer than 3", so the judgment comes out the wrong way round.
- Wrong: <> → <> means "not 3", so with exactly 3 agents it shows "Check".
- Result: OK
- Explanation: "3 or more" is >=. On Team A, Park Seoyeon, Jung Minseo and Jo Sua took 55 or more: 3 agents.

#### 12-4 · blank
- Question: Show "Yes" if any Team A agent answered 50 or more calls within 30 seconds, otherwise "None".
- Formula: `=IF(COUNTIFS(C2:C9, "Team A", F2:F9, ___)>0, "Yes", "None")`
- Chips: ">=50" · >=50 · "50"
- Answer: ">=50"
- Wrong: >=50 → Without quotes it isn't read as a condition, so the formula gives an error.
- Wrong: "50" → "50" counts only agents with exactly 50. To count 50 or more, use ">=50".
- Result: Yes
- Explanation: A COUNTIFS condition goes inside quotes with its sign, like ">=50". Park Seoyeon (55) and Jo Sua (51) qualify.

#### 12-5 · build
- Question: Show "OK" if 2 or more Team B agents reached the call target (45), otherwise "Check".
- Cards (answer order): `IF(` · `COUNTIFS(` · `C2:C9` · `,` · `"Team B"` · `,` · `D2:D9` · `,` · `">=45"` · `)` · `>=` · `2` · `,` · `"OK"` · `,` · `"Check"` · `)`
- Decoy cards: `"Team A"`
- Result: Check
- Explanation: Put >=2 after the bracket that closes the inner COUNTIFS. On Team B only Lee Doyun took 45 or more, so it shows "Check".

#### 12-6 · build
- Question: Show "Review" if any Team A agent's total handle time is over 16000 seconds, otherwise nothing.
- Cards (answer order): `IF(` · `COUNTIFS(` · `C2:C9` · `,` · `"Team A"` · `,` · `E2:E9` · `,` · `">16000"` · `)` · `>` · `0` · `,` · `"Review"` · `,` · `""` · `)`
- Decoy cards: `"Team B"`
- Result: Review
- Explanation: Only Park Seoyeon (17080 seconds) is over 16000, so the count is 1, and 1>0 shows "Review".

### Summary
- A function inside a function is worked out from the inside
- Put the count from COUNTIFS in IF's condition
- COUNTIFS conditions go inside quotes, like ">=55"

## Lesson 13 · Rounding a ratio before judging

### Cards
1. Reports show ratios rounded, like 85%. Judge with the same value, so the number people see and the result agree.
2. Kim Haneul's share answered within 30 seconds is 44 ÷ 52 = 0.846…. =IF(ROUND(F2/D2, 2)>=0.85, "Met", "Missed") shows "Met" because it is 0.85; without rounding it shows "Missed" (the 85% target is an example).

### Questions
#### 13-1 · choice
- Question: What does =IF(ROUND(F6/D6, 2)>=0.85, "Met", "Missed") return?
- Options: Met · Missed · 0.85
- Answer: Met
- Wrong: Missed → Rounded, it is 0.85, the same as the target, and >= means "equal or more", so it is met.
- Wrong: 0.85 → 0.85 is the result of the inner ROUND. What IF shows is "Met" or "Missed".
- Explanation: Jung Minseo is 47 ÷ 55 = 0.854…, which rounds to 0.85, equal to the target, so it shows "Met".

#### 13-2 · choice
- Question: If Kim Haneul (row 2) is judged without rounding, =IF(F2/D2>=0.85, "Met", "Missed"), what is the result?
- Options: Missed · Met · Error
- Answer: Missed
- Wrong: Met → Unrounded, the value is 0.846…, which is less than 0.85.
- Wrong: Error → The formula compares a ratio with a number, so there is no error.
- Explanation: 0.846… is less than 0.85, so it shows "Missed". The report shows 85%, so round with ROUND before judging.

#### 13-3 · blank
- Question: Round Kim Haneul's (row 2) ratio to two decimal places, then judge it.
- Formula: `=IF(ROUND(F2/D2, ___)>=0.85, "Met", "Missed")`
- Chips: 2 · 1 · 3
- Answer: 2
- Wrong: 1 → Rounding to one decimal place gives 0.8, which doesn't reach the target.
- Wrong: 3 → Keeping three places leaves 0.846, so the judgment disagrees with the 85% in the report.
- Result: Met
- Explanation: To show two decimal places, as in 85%, use 2 digits.

#### 13-4 · blank
- Question: Show "Met" if Jo Sua's (row 8) rounded ratio is 85% or more.
- Formula: `=IF(ROUND(F8/D8, 2)>=___, "Met", "Missed")`
- Chips: 0.85 · 85 · 8.5
- Answer: 0.85
- Wrong: 85 → Comparing a ratio between 0 and 1 with 85 always gives "Missed".
- Wrong: 8.5 → 8.5 is 850%. 85% is 0.85.
- Result: Met
- Explanation: A ratio is between 0 and 1, so 85% is 0.85. Jo Sua is 51 ÷ 58 = 0.879…, which rounds to 0.88.

#### 13-5 · build
- Question: Round Choi Jiho's (row 5) ratio to two decimal places; show "Met" if it is 0.85 or more, otherwise "Missed".
- Cards (answer order): `IF(` · `ROUND(` · `F5` · `/` · `D5` · `,` · `2` · `)` · `>=` · `0.85` · `,` · `"Met"` · `,` · `"Missed"` · `)`
- Decoy cards: `*`
- Result: Missed
- Explanation: Put >=0.85 after the bracket that closes ROUND. 30 ÷ 39 = 0.769…, which rounds to 0.77, so it shows "Missed".

#### 13-6 · build
- Question: Round the team's share answered within 30 seconds to two decimal places; show "Met" if it is 0.85 or more, otherwise "Missed".
- Cards (answer order): `IF(` · `ROUND(` · `SUM(` · `F2:F9` · `)` · `/` · `SUM(` · `D2:D9` · `)` · `,` · `2` · `)` · `>=` · `0.85` · `,` · `"Met"` · `,` · `"Missed"` · `)`
- Decoy cards: `AVERAGE(`
- Result: Missed
- Explanation: A team ratio divides total by total (lesson 3). 342 ÷ 406 = 0.842…, which rounds to 0.84, so it shows "Missed".

### Summary
- Round with ROUND before judging, to match the value the report shows
- Compare ratios with values between 0 and 1, like 0.85
- When functions are nested, check that every bracket has its pair

## Lesson 14 · Judging on two conditions

### Cards
1. AND(condition1, condition2) is TRUE only when both are true; OR(condition1, condition2) is TRUE when at least one is.
2. =IF(AND(D4>=G4, F4/D4>=0.85), "Excellent", "") shows "Excellent" because Park Seoyeon cleared both the call target (61 calls against 55) and the 85% bar for answering within 30 seconds (0.90) (the 85% target is an example).

### Questions
#### 14-1 · choice
- Question: What does =IF(AND(D2>=G2, F2/D2>=0.8), "Excellent", "Average") return?
- Options: Average · Excellent · FALSE
- Answer: Average
- Wrong: Excellent → AND needs both to be true. Kim Haneul's 52 calls fall short of the 55 target.
- Wrong: FALSE → FALSE is the result of the inner AND. What IF shows is "Excellent" or "Average".
- Explanation: The share answered within 30 seconds, 0.846…, is above 0.8, but the calls fall short of the target, so AND is FALSE and it shows "Average".

#### 14-2 · choice
- Question: If AND in the 14-1 formula is changed to OR, what is Kim Haneul's result?
- Options: Excellent · Average · Error
- Answer: Excellent
- Wrong: Average → OR is TRUE when just one is true. The within-30-seconds condition is true.
- Wrong: Error → OR takes the same slots as AND, so changing it causes no error.
- Explanation: OR is TRUE when at least one condition is true, so it shows "Excellent".

#### 14-3 · blank
- Question: Show "Check" if Kim Haneul (row 2) fell short of the call target or answered less than 80% within 30 seconds.
- Formula: `=IF(___(D2<G2, F2/D2<0.8), "Check", "")`
- Chips: OR · AND · IF
- Answer: OR
- Wrong: AND → AND needs both to be true. Only Kim Haneul's calls fall short, so nothing shows.
- Wrong: IF → IF returns the value it judged, so it can't join two conditions into one.
- Result: Check
- Explanation: "Or" means one is enough, so it's OR. Kim Haneul took 52 calls, short of the 55 target.

#### 14-4 · blank
- Question: Show "Excellent" if Jo Sua (row 8) reached the call target and answered 85% or more within 30 seconds.
- Formula: `=IF(AND(D8>=G8, F8/D8___0.85), "Excellent", "Average")`
- Chips: >= · < · =
- Answer: >=
- Wrong: < → < means "below 85%", so the judgment comes out the wrong way round.
- Wrong: = → It is true only when the ratio is exactly 0.85, so Jo Sua at 0.879… shows "Average".
- Result: Excellent
- Explanation: "85% or more" is >=. Jo Sua took 58 calls (target 55) at 0.879….

#### 14-5 · build
- Question: Show "Excellent" if Park Seoyeon (row 4) reached the call target and answered 85% or more within 30 seconds, otherwise "Average".
- Cards (answer order): `IF(` · `AND(` · `D4` · `>=` · `G4` · `,` · `F4` · `/` · `D4` · `>=` · `0.85` · `)` · `,` · `"Excellent"` · `,` · `"Average"` · `)`
- Decoy cards: `OR(`
- Result: Excellent
- Explanation: Put the two conditions inside AND, split by a comma, then close AND and fill IF's other slots. Park Seoyeon has 61 calls at 0.90, so it shows "Excellent".

#### 14-6 · build
- Question: Show "Check" if Choi Jiho (row 5) fell short of the call target or answered less than 80% within 30 seconds, otherwise nothing.
- Cards (answer order): `IF(` · `OR(` · `D5` · `<` · `G5` · `,` · `F5` · `/` · `D5` · `<` · `0.8` · `)` · `,` · `"Check"` · `,` · `""` · `)`
- Decoy cards: `AND(`
- Result: Check
- Explanation: "Or" is OR. Choi Jiho took 39 calls (target 45), so the first condition alone shows "Check".

### Summary
- AND is TRUE when all are true; OR when at least one is
- "And" is AND, "or" is OR
- Split the conditions inside AND or OR with commas

## Lesson 15 · Planning for a value that isn't there

### Cards
1. If the ID you look for isn't in the table, XLOOKUP shows an error (#N/A). An error left in a report is hard to read, and any formula that uses that cell gives an error too.
2. IFERROR(value, if error) sets what to show instead, only when there is an error. =IFERROR(XLOOKUP("S10", A2:A9, D2:D9), "None") shows "None" because there is no S10.

### Questions
#### 15-1 · choice
- Question: What does =IFERROR(XLOOKUP("S03", A2:A9, D2:D9), "None") return?
- Options: 61 · None · #N/A
- Answer: 61
- Wrong: None → "None" shows only when there is an error. S03 is in the table.
- Wrong: #N/A → IFERROR wraps the lookup, so no error shows. Besides, S03 can be found.
- Explanation: S03 (Park Seoyeon) is in the table, so her call count, 61, shows as it is.

#### 15-2 · choice
- Question: When does IFERROR show its second value?
- Options: When the first value gives an error · When the first value is 0 · Always
- Answer: When the first value gives an error
- Wrong: When the first value is 0 → 0 is a normal value, not an error, so it shows as it is.
- Wrong: Always → With no error, it shows the first value as it is.
- Explanation: No error: the first value. An error: the second value.

#### 15-3 · blank
- Question: Look up ID S09's call count, and show "None" if it isn't there.
- Formula: `=___(XLOOKUP("S09", A2:A9, D2:D9), "None")`
- Chips: IFERROR · IF · ROUND
- Answer: IFERROR
- Wrong: IF → IF checks a condition; it can't catch an error, so the error still shows.
- Wrong: ROUND → ROUND only rounds. The inner error still shows.
- Result: None
- Explanation: The table runs only to S08, so there is no S09. IFERROR shows "None" instead of the error.

#### 15-4 · blank
- Question: Look up S06's name, and show "Check needed" if it isn't there.
- Formula: `=IFERROR(XLOOKUP("S06", A2:A9, ___), "Check needed")`
- Chips: B2:B9 · C2:C9 · A2:A9
- Answer: B2:B9
- Wrong: C2:C9 → Column C is the team, so you get "Team B". Names are in column B.
- Wrong: A2:A9 → Returning the same column you searched, A, just gives back the ID "S06".
- Result: Kang Yejun
- Explanation: The range to return is column B, where the names are. S06 is Kang Yejun.

#### 15-5 · build
- Question: Look up S04's total handle time, and show 0 if it isn't there.
- Cards (answer order): `IFERROR(` · `XLOOKUP(` · `"S04"` · `,` · `A2:A9` · `,` · `E2:E9` · `)` · `,` · `0` · `)`
- Decoy cards: `D2:D9`
- Result: 12480
- Explanation: Close XLOOKUP, then a comma, then the 0 to show if there is an error. Choi Jiho (S04) has 12480 seconds.

#### 15-6 · build
- Question: Look up S12's team, and show "None" if it isn't there.
- Cards (answer order): `IFERROR(` · `XLOOKUP(` · `"S12"` · `,` · `A2:A9` · `,` · `C2:C9` · `)` · `,` · `"None"` · `)`
- Decoy cards: `IF(`
- Result: None
- Explanation: S12 isn't in the table, so XLOOKUP gives an error, and IFERROR shows "None" instead.

### Summary
- When the value isn't there, XLOOKUP gives an error
- IFERROR(value, if error)
- With no error, the first value shows as it is

## Lesson 16 · A team's average handle time

### Cards
1. A team's average handle time is its total handle time divided by its total calls. =SUMIFS(E2:E9, C2:C9, "Team A")/SUMIFS(D2:D9, C2:C9, "Team A") is 78610 ÷ 276, about 284.8 seconds.
2. Wrap that value as =TEXT(…/86400, "m:ss") and it shows as minutes and seconds, like "4:45". 86400 is the number of seconds in a day.

### Questions
#### 16-1 · choice
- Question: To get Team A's average handle time, what do you divide SUMIFS(E2:E9, C2:C9, "Team A") by?
- Options: SUMIFS(D2:D9, C2:C9, "Team A") · COUNTIFS(C2:C9, "Team A") · 60
- Answer: SUMIFS(D2:D9, C2:C9, "Team A")
- Wrong: COUNTIFS(C2:C9, "Team A") → Dividing by the number of agents (5) gives total handle time per agent. Time per call divides by the number of calls.
- Wrong: 60 → Dividing by 60 only turns the total handle time into minutes.
- Explanation: Average handle time is the time per call, so divide the team's total handle time by its total calls.

#### 16-2 · choice
- Question: What does =TEXT(300/86400, "m:ss") return?
- Options: 5:00 · 3:00 · 300
- Answer: 5:00
- Wrong: 3:00 → 300 seconds is five lots of 60 seconds: 5 minutes.
- Wrong: 300 → TEXT turns it into minutes and seconds, so 300 doesn't show as it is.
- Explanation: Divide 300 seconds by a day (86400 seconds) to make a time value, and TEXT shows it as "5:00".

#### 16-3 · blank
- Question: Find Team B's average handle time in seconds, with no decimals.
- Formula: `=ROUND(SUMIFS(E2:E9, C2:C9, "Team B")/SUMIFS(___, C2:C9, "Team B"), 0)`
- Chips: D2:D9 · E2:E9 · F2:F9
- Answer: D2:D9
- Wrong: E2:E9 → Dividing a column by itself always gives 1.
- Wrong: F2:F9 → Column F counts only calls answered within 30 seconds, not all calls.
- Result: 309
- Explanation: You divide by Team B's total calls (column D). 40160 ÷ 130 is 308.9…, which rounds to 309 seconds.

#### 16-4 · blank
- Question: Show Team A's average handle time as minutes and seconds.
- Formula: `=TEXT(SUMIFS(E2:E9, C2:C9, "Team A")/SUMIFS(D2:D9, C2:C9, "Team A")/___, "m:ss")`
- Chips: 86400 · 60 · 3600
- Answer: 86400
- Wrong: 60 → Dividing by 60 only gives a number of minutes, not a time value, so TEXT shows the wrong time.
- Wrong: 3600 → 3600 is the seconds in an hour. To make a time value, divide by the seconds in a day, 86400.
- Result: 4:45
- Explanation: Divide the seconds by 86400 to make a time value, then wrap it in TEXT. Team A is about 284.8 seconds: 4:45.

#### 16-5 · build
- Question: Find Team A's average handle time in seconds.
- Cards (answer order): `SUMIFS(` · `E2:E9` · `,` · `C2:C9` · `,` · `"Team A"` · `)` · `/` · `SUMIFS(` · `D2:D9` · `,` · `C2:C9` · `,` · `"Team A"` · `)`
- Decoy cards: `"Team B"`
- Result: 284.8…
- Explanation: Both totals need the same condition, "Team A". 78610 ÷ 276 is about 284.8 seconds.

#### 16-6 · build
- Question: Show Team B's average handle time as minutes and seconds.
- Cards (answer order): `TEXT(` · `SUMIFS(` · `E2:E9` · `,` · `C2:C9` · `,` · `"Team B"` · `)` · `/` · `SUMIFS(` · `D2:D9` · `,` · `C2:C9` · `,` · `"Team B"` · `)` · `/` · `86400` · `,` · `"m:ss"` · `)`
- Decoy cards: `3600`
- Result: 5:09
- Explanation: Divide the average in seconds by 86400 to make a time value, then wrap it in TEXT. Team B is about 308.9 seconds: 5:09.

### Summary
- Team average handle time = team total handle time ÷ team total calls
- Give both SUMIFS the same condition
- Seconds → minutes:seconds is TEXT(seconds/86400, "m:ss")
