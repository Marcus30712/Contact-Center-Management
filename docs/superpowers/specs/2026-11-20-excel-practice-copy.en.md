# Miso's Excel Practice — English copy

Translation of `2026-11-20-excel-practice-copy.md` (Korean confirmed 2026-11-20). Same ids, same structure. On the English screen the example table's text values are in English, so formula cards and text results use the English values; numbers are identical.

How to read: the formula line starts with `=` already in place; the learner picks only the cards after it. Cards are separated by `·`. Steps marked `[any order]` may be placed in either order. Menu names follow English Excel (Microsoft 365).

## Example table — Miso's team, one day of calls (example)

| Row | A Agent ID | B Name | C Team | D Calls | E Total handle time (s) | F Answered within 30 s | G Target calls |
|---|---|---|---|---|---|---|---|
| 2 | S01 | Kim Haneul | Team A | 52 | 15600 | 44 | 55 |
| 3 | S02 | Lee Doyun | Team B | 47 | 13160 | 38 | 45 |
| 4 | S03 | Park Seoyeon | Team A | 61 | 17080 | 55 | 55 |
| 5 | S04 | Choi Jiho | Team B | 39 | 12480 | 30 | 45 |
| 6 | S05 | Jung Minseo | Team A | 55 | 14850 | 47 | 55 |
| 7 | S06 | Kang Yejun | Team B | 44 | 14520 | 35 | 45 |
| 8 | S07 | Jo Sua | Team A | 58 | 15080 | 51 | 55 |
| 9 | S08 | Yoon Siwoo | Team A | 50 | 16000 | 42 | 55 |

- Short headers on screen: ID · Name · Team · Calls · Handle (s) · ≤30 s · Target
- Table title: Miso's team, one day of calls (example)
- All names are made up.

## Screen wording

| key | English |
|---|---|
| title | Miso's Excel Practice |
| intro | Learn the 11 Excel skills a team leader needs, using one example table of Miso's team's calls. No typing: just tap. |
| lessonOf | Lesson {i} of {n} |
| questionOf | Question {i} of {n} |
| start | Start |
| continue | Continue |
| locked | Opens when you finish the lesson before |
| score | {n} of 6 |
| check | Check |
| clear | Start over |
| buildHint | Tap cards to build the formula. Tap a card in the line to take it out. |
| cellHint | Tap a cell in the table. For a range, tap the first cell, then the last. |
| stepsHint | Tap the steps in order. Tap a placed step to take it out. |
| correct | That's right! |
| wrong | Not quite. |
| result | Result: {v} |
| usedCells | The cells used in the calculation are marked in the table. |
| retry | Try again |
| next | Next question → |
| summaryTitle | What you learned |
| lessonDone | Lesson {i} done! |
| nextLesson | Next lesson → |
| backToList | All lessons |
| allDone | You've finished all 11 lessons. Now try them on your real team reports. |
| homeCard | Miso's Excel Practice |
| homeCardLine | The 11 Excel skills team leaders use most, learned by tapping. |

## Lesson 1 · Cell addresses and ranges

### Cards
1. An Excel sheet is made of cells. Columns are letters (A, B, C) and rows are numbers (1, 2, 3). So the cell in column C, row 3 is C3.
2. To point at several cells at once, use a range. D2:D9 means D2 through D9: the call counts of all 8 agents.
3. This practice uses one example table of Miso's team's calls throughout. Row 1 holds the headers; rows 2 to 9 are the 8 agents.

### Questions
#### 1-1 · choice
- Question: What is in cell B4?
- Options: Park Seoyeon · S03 · 61
- Answer: Park Seoyeon
- Explanation: Column B is the name, and row 4 is the third agent. S03 is in A4 and 61 is in D4.

#### 1-2 · choice
- Question: How many cells are in D2:D9?
- Options: 8 cells · 9 cells · 2 cells
- Answer: 8 cells
- Explanation: Rows 2 to 9 make 8 rows, so 8 cells. The header in row 1 isn't included.

#### 1-3 · blank
- Question: Complete the range that covers the team cells of all 8 agents.
- Range: `C___:C9`
- Chips: 2 · 1 · 3
- Answer: 2
- Explanation: Row 1 is the "Team" header. The agents start in row 2, so the range is C2:C9.

#### 1-4 · blank
- Question: Complete the address of Choi Jiho's call count.
- Address: `___5`
- Chips: D · E · C
- Answer: D
- Explanation: Choi Jiho is in row 5 and calls are in column D, so it's D5.

#### 1-5 · cell
- Question: Tap Yoon Siwoo's total handle time cell.
- Answer: E9
- Explanation: Yoon Siwoo is in row 9 and total handle time is column E, so it's E9.

#### 1-6 · cell
- Question: Select all 8 agents' team cells as a range.
- Answer: C2:C9
- Explanation: Tap the first cell C2 and the last cell C9 to make the range C2:C9. C1 is the header, so leave it out.

### Summary
- Cell address = column letter + row number (C3)
- Range = first cell:last cell (D2:D9)
- Leave the row 1 header out of ranges

## Lesson 2 · SUM · AVERAGE · MIN · MAX

### Cards
1. SUM adds up every number in a range. =SUM(D2:D9) is the team's total calls: 406 (example).
2. AVERAGE gives the mean, MIN the smallest value and MAX the largest. To find the fewest calls an agent took, use MIN.

### Questions
#### 2-1 · choice
- Question: Which function gives the team's total calls?
- Options: SUM · AVERAGE · MAX
- Answer: SUM
- Explanation: You need everything added up, so SUM. AVERAGE is the mean and MAX is the largest value.

#### 2-2 · choice
- Question: What does =MAX(D2:D9) return?
- Options: 61 · 39 · 406
- Answer: 61
- Explanation: MAX is the largest value: Park Seoyeon's 61. 39 is MIN and 406 is SUM.

#### 2-3 · blank
- Question: Find the average number of calls per agent.
- Formula: `=___(D2:D9)`
- Chips: AVERAGE · SUM · MIN
- Answer: AVERAGE
- Result: 50.75
- Explanation: The mean is AVERAGE: 406 calls divided by 8 agents is 50.75.

#### 2-4 · blank
- Question: Find the shortest total handle time.
- Formula: `=MIN(___)`
- Chips: E2:E9 · D2:D9 · F2:F9
- Answer: E2:E9
- Result: 12480
- Explanation: Total handle time is column E. Column D is calls and column F is calls answered within 30 seconds.

#### 2-5 · build
- Question: Build the formula for the team's total handle time.
- Cards (answer order): `SUM(` · `E2:E9` · `)`
- Decoy cards: `AVERAGE(` · `D2:D9`
- Result: 118770
- Explanation: A total is SUM, and handle time is E2:E9.

#### 2-6 · build
- Question: Find the call count of the agent who took the most calls.
- Cards (answer order): `MAX(` · `D2:D9` · `)`
- Decoy cards: `MIN(` · `E2:E9`
- Result: 61
- Explanation: The largest value is MAX, and calls are D2:D9.

### Summary
- SUM total · AVERAGE mean
- MIN smallest · MAX largest
- Ranges skip the header and start at row 2

## Lesson 3 · Ratios and ROUND

### Cards
1. A ratio is a division. Kim Haneul's share of calls answered within 30 seconds is =F2/D2: 44 ÷ 52 = 0.846…
2. ROUND(value, digits) rounds a number. =ROUND(F2/D2, 2) is 0.85. Format the cell as a percentage and it shows 85%.
3. The team's service level divides total by total: =SUM(F2:F9)/SUM(D2:D9). It differs from the average of each agent's ratio (84.2% versus 83.7% in the example), because that average weighs busy and quiet agents the same.

### Questions
#### 3-1 · choice
- Question: Which gives the service level (the share of calls answered within 30 seconds)? Each center sets its own target time.
- Options: Calls answered within 30 s ÷ all calls · All calls ÷ calls answered within 30 s · All calls − calls answered within 30 s
- Answer: Calls answered within 30 s ÷ all calls
- Explanation: A ratio is the part divided by the whole. Dividing the other way gives a value above 1.

#### 3-2 · choice
- Question: What does =ROUND(0.8461, 2) return?
- Options: 0.85 · 0.84 · 0.8461
- Answer: 0.85
- Explanation: It keeps two decimal places and rounds on the third digit, 6, giving 0.85.

#### 3-3 · blank
- Question: Find Park Seoyeon's (row 4) share of calls answered within 30 seconds.
- Formula: `=F4/___`
- Chips: D4 · G4 · F4
- Answer: D4
- Result: 0.9016393442622951
- Explanation: All calls are in column D. G4 is the target, which gives a different ratio.

#### 3-4 · blank
- Question: Round Kim Haneul's ratio to two decimal places.
- Formula: `=ROUND(F2/D2, ___)`
- Chips: 2 · 1 · 0
- Answer: 2
- Result: 0.85
- Explanation: 2 keeps two decimal places. 1 gives 0.8 and 0 gives 1.

#### 3-5 · build
- Question: Find the team's service level.
- Cards (answer order): `SUM(` · `F2:F9` · `)` · `/` · `SUM(` · `D2:D9` · `)`
- Decoy cards: `AVERAGE(` · `G2:G9`
- Result: 0.8423645320197044
- Explanation: Divide the total answered within 30 seconds by total calls. That's about 84.2%.

#### 3-6 · build
- Question: Round Kim Haneul's (row 2) share of calls answered within 30 seconds to two decimal places.
- Cards (answer order): `ROUND(` · `F2` · `/` · `D2` · `,` · `2` · `)`
- Decoy cards: `G2` · `1`
- Result: 0.85
- Explanation: First get the ratio with F2/D2, then put 2 digits in ROUND's second slot.

### Summary
- Ratio = part ÷ whole (F2/D2)
- ROUND(value, digits) rounds
- A team-wide ratio is total ÷ total

## Lesson 4 · COUNTIF · COUNTIFS

### Cards
1. COUNTIF(range, criteria) counts the cells that meet a condition. =COUNTIF(C2:C9, "Team A") counts Team A's agents: 5.
2. Number conditions go inside quotes with their sign. =COUNTIF(D2:D9, ">=50") counts agents who took 50 calls or more.
3. For more than one condition use COUNTIFS(range1, criteria1, range2, criteria2). It counts only rows that meet every condition at once.

### Questions
#### 4-1 · choice
- Question: What does =COUNTIF(C2:C9, "Team B") return?
- Options: 3 · 5 · 8
- Answer: 3
- Explanation: Team B is Lee Doyun, Choi Jiho and Kang Yejun: 3 agents. 5 is Team A and 8 is everyone.

#### 4-2 · choice
- Question: Which rows does COUNTIFS count?
- Options: Rows that meet every condition at once · Rows that meet at least one condition · Rows that meet no condition
- Answer: Rows that meet every condition at once
- Explanation: COUNTIFS joins conditions with "and". A row that meets only one isn't counted.

#### 4-3 · blank
- Question: Count the agents who took 50 calls or more.
- Formula: `=COUNTIF(D2:D9, ___)`
- Chips: ">=50" · ">50" · "50"
- Answer: ">=50"
- Result: 5
- Explanation: "Or more" is >=. ">50" leaves out 50 and gives 4; "50" counts only exactly 50 and gives 1.

#### 4-4 · blank
- Question: Count the Team A agents who took 55 calls or more.
- Formula: `=COUNTIFS(C2:C9, "Team A", ___, ">=55")`
- Chips: D2:D9 · E2:E9 · G2:G9
- Answer: D2:D9
- Result: 3
- Explanation: Calls are column D. That's Park Seoyeon, Jung Minseo and Jo Sua: 3 agents.

#### 4-5 · build
- Question: Count Team A's agents.
- Cards (answer order): `COUNTIF(` · `C2:C9` · `,` · `"Team A"` · `)`
- Decoy cards: `"Team B"` · `SUMIF(`
- Result: 5
- Explanation: Count the cells in the team column C2:C9 that say "Team A".

#### 4-6 · build
- Question: Count the Team B agents who took 45 calls or more.
- Cards (answer order): `COUNTIFS(` · `C2:C9` · `,` · `"Team B"` · `,` · `D2:D9` · `,` · `">=45"` · `)`
- Decoy cards: `"Team A"`
- Result: 1
- Explanation: Only Lee Doyun (47 calls) meets both conditions.

### Summary
- COUNTIF(range, criteria) = how many cells meet it
- Number conditions go in quotes, like ">=50"
- COUNTIFS counts only rows that meet every condition

## Lesson 5 · SUMIFS · AVERAGEIFS

### Cards
1. SUMIFS(sum range, criteria range, criteria) adds only the values in rows that meet a condition. =SUMIFS(D2:D9, C2:C9, "Team A") is Team A's total calls: 276 (example).
2. AVERAGEIFS takes the same order and gives the mean. Unlike COUNTIF, the range to add or average comes first.
3. A team's average handle time (AHT) is the team's total handle time ÷ the team's calls. Averaging each agent's handle time doesn't give time per call.

### Questions
#### 5-1 · choice
- Question: Which range comes first in SUMIFS?
- Options: The range with the values to add · The range to check the condition in · The cell for the result
- Answer: The range with the values to add
- Explanation: SUMIFS starts with what to add, then pairs each criteria range with its condition.

#### 5-2 · choice
- Question: Which correctly gives Team A's average handle time (AHT)?
- Options: Team A's total handle time ÷ Team A's calls · Team A's total handle time ÷ Team A's headcount · The average of each Team A agent's total handle time
- Answer: Team A's total handle time ÷ Team A's calls
- Explanation: AHT is time per call, so divide by calls. Dividing by headcount or averaging per agent gives time per agent.

#### 5-3 · blank
- Question: Find Team A's total handle time.
- Formula: `=SUMIFS(___, C2:C9, "Team A")`
- Chips: E2:E9 · D2:D9 · C2:C9
- Answer: E2:E9
- Result: 78610
- Explanation: The values to add are the handle times in column E. Column D would give Team A's calls, 276.

#### 5-4 · blank
- Question: Find Team B's average calls per agent.
- Formula: `=AVERAGEIFS(D2:D9, C2:C9, ___)`
- Chips: "Team B" · "Team A" · ">=45"
- Answer: "Team B"
- Result: 43.333333333333336
- Explanation: Average only the rows whose team is "Team B". The mean of 47, 39 and 44 is about 43.3.

#### 5-5 · build
- Question: Find Team B's total handle time.
- Cards (answer order): `SUMIFS(` · `E2:E9` · `,` · `C2:C9` · `,` · `"Team B"` · `)`
- Decoy cards: `D2:D9` · `"Team A"`
- Result: 40160
- Explanation: The sum range E2:E9 comes first, then the team column C2:C9 and the condition "Team B".

#### 5-6 · build
- Question: Find the average total handle time per Team A agent.
- Cards (answer order): `AVERAGEIFS(` · `E2:E9` · `,` · `C2:C9` · `,` · `"Team A"` · `)`
- Decoy cards: `SUMIFS(` · `"Team B"`
- Result: 15722
- Explanation: AVERAGEIFS also puts the range to average first. This is time per agent, not AHT.

### Summary
- SUMIFS(sum range, criteria range, criteria)
- AVERAGEIFS also puts the range to average first
- Team AHT = team total handle time ÷ team calls

## Lesson 6 · IF

### Cards
1. IF(condition, if true, if false) shows a different value depending on a condition. =IF(D2>=G2, "Met", "Missed") shows whether Kim Haneul reached the target.
2. Kim Haneul took 52 calls against a target of 55, so it shows "Missed". Fill the formula down and the row numbers change, so all 8 agents are checked. To show nothing, use "" (empty text).

### Questions
#### 6-1 · choice
- Question: What does =IF(D4>=G4, "Met", "Missed") return?
- Options: Met · Missed · 61
- Answer: Met
- Explanation: Park Seoyeon took 61 calls against a target of 55, so the condition is true and the second slot, "Met", shows.

#### 6-2 · choice
- Question: What is the second of IF's three slots?
- Options: The value to show if the condition is true · The value to show if the condition is false · The condition to check
- Answer: The value to show if the condition is true
- Explanation: The order is condition, if true, if false.

#### 6-3 · blank
- Question: Show whether Lee Doyun (row 3) reached the target.
- Formula: `=IF(D3___G3, "Met", "Missed")`
- Chips: >= · <= · =
- Answer: >=
- Result: Met
- Explanation: Reaching the target means "at least", so >=. Lee Doyun took 47 calls against a target of 45.

#### 6-4 · blank
- Question: Show "Good" if Kim Haneul's share answered within 30 seconds is 80% or more, otherwise "Check".
- Formula: `=IF(F2/D2>=___, "Good", "Check")`
- Chips: 0.8 · 80 · 8
- Answer: 0.8
- Result: Good
- Explanation: A ratio from a division is between 0 and 1, so 80% is 0.8. Comparing with 80 always gives "Check".

#### 6-5 · build
- Question: Show "Met" if Jo Sua (row 8) reached the target, otherwise "Missed".
- Cards (answer order): `IF(` · `D8` · `>=` · `G8` · `,` · `"Met"` · `,` · `"Missed"` · `)`
- Decoy cards: `<`
- Result: Met
- Explanation: After the condition D8>=G8 come "Met" if true, then "Missed" if false.

#### 6-6 · build
- Question: Show "Review" if Yoon Siwoo's (row 9) total handle time is over 15000 seconds, otherwise nothing.
- Cards (answer order): `IF(` · `E9` · `>` · `15000` · `,` · `"Review"` · `,` · `""` · `)`
- Decoy cards: `<`
- Result: Review
- Explanation: Yoon Siwoo has 16000 seconds, so "Review" shows. If the condition were false, "" would leave the cell looking empty.

### Summary
- IF(condition, if true, if false)
- Compare ratios with values between 0 and 1, like 0.8
- "" is empty text that shows nothing

## Lesson 7 · XLOOKUP · VLOOKUP

### Cards
1. XLOOKUP(lookup value, lookup range, return range) finds a value and returns another cell from the same row. =XLOOKUP("S04", A2:A9, B2:B9) returns Choi Jiho.
2. Older Excel has no XLOOKUP, so people use VLOOKUP. =VLOOKUP("S04", A2:G9, 2, FALSE) finds S04 in column A and returns the 2nd column of the range (the name). FALSE at the end means "exact match only".
3. VLOOKUP needs the lookup value in the leftmost column of the range. XLOOKUP has no such limit, so use it when you can.

### Questions
#### 7-1 · choice
- Question: What does =XLOOKUP("S06", A2:A9, D2:D9) return?
- Options: 44 · Kang Yejun · 6
- Answer: 44
- Explanation: S06 is Kang Yejun, and the return range is the calls in column D, so 44.

#### 7-2 · choice
- Question: What does FALSE mean in VLOOKUP's last slot?
- Options: Exact match only · Close matches too · Show 0 if not found
- Answer: Exact match only
- Explanation: Use FALSE for values that must match exactly, like agent IDs. Leave it out and you may get the wrong row.

#### 7-3 · blank
- Question: Find the name of agent S07.
- Formula: `=XLOOKUP("S07", A2:A9, ___)`
- Chips: B2:B9 · C2:C9 · D2:D9
- Answer: B2:B9
- Result: Jo Sua
- Explanation: Names are in column B. Column C gives the team and column D the calls.

#### 7-4 · blank
- Question: Use VLOOKUP to find agent S02's team.
- Formula: `=VLOOKUP("S02", A2:G9, ___, FALSE)`
- Chips: 3 · 2 · 4
- Answer: 3
- Result: Team B
- Explanation: In A2:G9 the team is the 3rd column counting from A. 2 is the name and 4 is calls.

#### 7-5 · build
- Question: Use XLOOKUP to find agent S05's total handle time.
- Cards (answer order): `XLOOKUP(` · `"S05"` · `,` · `A2:A9` · `,` · `E2:E9` · `)`
- Decoy cards: `D2:D9` · `"S06"`
- Result: 14850
- Explanation: The order is the value "S05", the ID range A2:A9, then the handle time range E2:E9.

#### 7-6 · build
- Question: Use VLOOKUP to find agent S08's calls.
- Cards (answer order): `VLOOKUP(` · `"S08"` · `,` · `A2:G9` · `,` · `4` · `,` · `FALSE` · `)`
- Decoy cards: `5`
- Result: 50
- Explanation: Calls are the 4th column counting from A. 5 would return the total handle time, 16000.

### Summary
- XLOOKUP(lookup value, lookup range, return range)
- VLOOKUP(lookup value, table, column number, FALSE)
- VLOOKUP needs the lookup value in the leftmost column

## Lesson 8 · Time (seconds → m:ss)

### Cards
1. Handle time usually builds up in seconds. Kim Haneul's average handle time is =E2/D2: 15600 ÷ 52 = 300 seconds.
2. Minutes are =INT(seconds/60) and the seconds left over are =MOD(seconds, 60). 280 seconds is 4 minutes 40 seconds.
3. Excel counts one day as 1, so seconds divided by 86400 (seconds in a day) become a time value. =TEXT(E3/D3/86400, "m:ss") shows 4:40.

### Questions
#### 8-1 · choice
- Question: What does =INT(330/60) return?
- Options: 5 · 5.5 · 30
- Answer: 5
- Explanation: INT drops everything after the decimal point. 330 ÷ 60 is 5.5, so 5 minutes. 30 is what MOD(330, 60) returns.

#### 8-2 · choice
- Question: What do you divide seconds by to get an Excel time value?
- Options: 86400 · 3600 · 60
- Answer: 86400
- Explanation: In Excel, 1 is one day, and a day is 24 × 60 × 60 = 86400 seconds.

#### 8-3 · blank
- Question: Find Kang Yejun's (row 7) average handle time in seconds.
- Formula: `=E7/___`
- Chips: D7 · G7 · F7
- Answer: D7
- Result: 330
- Explanation: It's time per call, so divide by calls, D7: 14520 ÷ 44 = 330 seconds.

#### 8-4 · blank
- Question: Find the seconds left after taking the whole minutes out of 280 seconds.
- Formula: `=___(280, 60)`
- Chips: MOD · INT · ROUND
- Answer: MOD
- Result: 40
- Explanation: MOD is the remainder after dividing. 280 seconds is 4 minutes 40 seconds, so 40 is left.

#### 8-5 · build
- Question: Find Choi Jiho's (row 5) average handle time in whole minutes, dropping the decimals.
- Cards (answer order): `INT(` · `E5` · `/` · `D5` · `/` · `60` · `)`
- Decoy cards: `MOD(` · `3600`
- Result: 5
- Explanation: 12480 ÷ 39 = 320 seconds; divided by 60 that's 5.33 minutes, and INT makes it 5.

#### 8-6 · build
- Question: Show Kim Haneul's (row 2) average handle time as m:ss.
- Cards (answer order): `TEXT(` · `E2` · `/` · `D2` · `/` · `86400` · `,` · `"m:ss"` · `)`
- Decoy cards: `3600`
- Result: 5:00
- Explanation: Divide 300 seconds by 86400 to get a time value, then show it in the "m:ss" shape.

### Summary
- Minutes = INT(seconds/60), seconds left = MOD(seconds, 60)
- Time value = seconds ÷ 86400
- TEXT(time value, "m:ss") shows it like 4:40

## Lesson 9 · Sort and filter

### Cards
1. Sorting changes the order of rows. To see who took the most calls first, sort the calls column largest to smallest. Whole rows move together, so names and numbers stay matched.
2. A filter shows only the rows that meet a condition and hides the rest. It hides rather than deletes, so clearing the filter brings them back.
3. Before sorting, tap one cell inside the table and Excel picks up the whole table. Sorting a single selected column can pull it out of line with the others.

### Questions
#### 9-1 · choice
- Question: To see the agents who took the most calls first, how do you sort calls?
- Options: Largest to Smallest · Smallest to Largest · By name
- Answer: Largest to Smallest
- Explanation: Going from big values to small is "Largest to Smallest". The other way shows the fewest calls first.

#### 9-2 · choice
- Question: If you filter to show only Team B, what happens to Team A's rows?
- Options: They're hidden · They're deleted · They move to the bottom
- Answer: They're hidden
- Explanation: A filter only hides rows. Clear it and Team A's rows show again, unchanged.

#### 9-3 · blank
- Question: Which tab has Sort and Filter?
- Menu: `___ › Sort`
- Chips: Data · Insert · Home
- Answer: Data
- Explanation: Sort and Filter are on the Data tab. PivotTable is on Insert and Conditional Formatting is on Home.

#### 9-4 · blank
- Question: To see the shortest handle times first, how do you sort column E?
- Menu: `Order: ___`
- Chips: Smallest to Largest · Largest to Smallest · Custom List
- Answer: Smallest to Largest
- Explanation: To see short times (small values) first, sort Smallest to Largest.

#### 9-5 · steps
- Question: Sort the table by calls, most first.
- Steps (answer order): Tap a cell inside the table · Data › Sort · Sort by: Calls · Order: Largest to Smallest · OK
- Decoy steps: Insert › PivotTable · Order: Smallest to Largest
- Table after: calls largest to smallest (Park Seoyeon 61, Jo Sua 58, Jung Minseo 55, Kim Haneul 52, Yoon Siwoo 50, Lee Doyun 47, Kang Yejun 44, Choi Jiho 39)
- Explanation: Tap inside the table, choose the column and order in Data › Sort, then press OK.

#### 9-6 · steps
- Question: Filter the table to show only Team B's agents.
- Steps (answer order): Tap a cell inside the table · Data › Filter · Tap the ▼ on the Team header · Untick "Team A" · OK
- Decoy steps: Home › Conditional Formatting · Untick "Team B"
- Table after: Team B's 3 rows only (Lee Doyun, Choi Jiho, Kang Yejun)
- Explanation: Turning on the filter adds a ▼ to each header. Untick "Team A", which you don't want to see.

### Summary
- Sort = change the order of rows (Data › Sort)
- Filter = show only matching rows (hidden, not deleted)
- Tap a cell inside the table before sorting

## Lesson 10 · PivotTables

### Cards
1. A PivotTable summarizes a long table by team, reason and so on, all at once. It makes totals like SUMIFS without writing formulas.
2. Put a field in "Rows" and you get a row for each of its values; put one in "Values" and it's totaled. Team in Rows and Calls in Values gives Team A 276 and Team B 130 (example).
3. A PivotTable doesn't update by itself when the source table changes. Tap inside it and choose Refresh to update the numbers.

### Questions
#### 10-1 · choice
- Question: In a PivotTable of calls by team, where does the "Team" field go?
- Options: Rows · Values · Filters
- Answer: Rows
- Explanation: To get one row per team, use Rows. Values holds the numbers to add up: Calls.

#### 10-2 · choice
- Question: You changed a call count in the source table. How do you update the PivotTable?
- Options: Refresh inside the PivotTable · Nothing; it updates itself · Delete it and build it again
- Answer: Refresh inside the PivotTable
- Explanation: A PivotTable reads the source again only when you refresh it. No need to rebuild it.

#### 10-3 · blank
- Question: Which tab do you make a PivotTable from?
- Menu: `___ › PivotTable`
- Chips: Insert · Data · Home
- Answer: Insert
- Explanation: A PivotTable is something you insert, so it's on the Insert tab.

#### 10-4 · blank
- Question: To see each team's average calls, what do you change the value field setting to?
- Menu: `Summarize value field by: ___`
- Chips: Average · Sum · Count
- Answer: Average
- Explanation: A number field starts as Sum. Change it to Average and you get Team A 55.2 and Team B about 43.3.

#### 10-5 · steps
- Question: Make a PivotTable of total calls by team.
- Steps (answer order): Tap a cell inside the table · Insert › PivotTable · Check the range, then OK · [any order] Put "Team" in Rows · Put "Calls" in Values [/any order]
- Decoy steps: Put "Team" in Values · Data › Sort
- Table after: Team | Sum of Calls — Team A 276, Team B 130, Grand Total 406
- Explanation: Check the range to create the PivotTable, then put Team in Rows and Calls in Values. Either field can go first.

#### 10-6 · steps
- Question: Make a PivotTable that counts agents by team.
- Steps (answer order): Tap a cell inside the table · Insert › PivotTable · Check the range, then OK · [any order] Put "Team" in Rows · Put "Name" in Values [/any order]
- Decoy steps: Put "Calls" in Values · Home › Conditional Formatting
- Table after: Team | Count of Name — Team A 5, Team B 3, Grand Total 8
- Explanation: A text field in Values is counted. Calls in Values would be summed, which isn't a headcount.

### Summary
- PivotTable = a summary without formulas (Insert › PivotTable)
- Rows hold what to split by; Values hold what to total
- When the source changes, Refresh

## Lesson 11 · Conditional formatting

### Cards
1. Conditional formatting colors the cells that meet a condition. Color call counts below target red and they stand out at a glance.
2. In Home › Conditional Formatting › Highlight Cells Rules, pick a rule such as "Less Than" or "Greater Than". When the values change, the colors change by themselves.
3. When each agent has a different target, use a formula rule. Select the call cells and use =D2<G2, and each row is compared with its own target.

### Questions
#### 11-1 · choice
- Question: When a cell with conditional formatting changes value, what happens to its color?
- Options: It updates to match the new value · It keeps its first color · The formatting is removed
- Answer: It updates to match the new value
- Explanation: Conditional formatting checks the condition again every time. That's why it suits reports that change daily.

#### 11-2 · choice
- Question: If you color call counts less than 45, how many cells get colored?
- Options: 2 cells · 3 cells · 1 cell
- Answer: 2 cells
- Explanation: Choi Jiho (39) and Kang Yejun (44). 45 itself isn't "less than" 45.

#### 11-3 · blank
- Question: Which tab has Conditional Formatting?
- Menu: `___ › Conditional Formatting`
- Chips: Home · Data · Insert
- Answer: Home
- Explanation: It changes how cells look, like fonts and colors, so it's on the Home tab.

#### 11-4 · blank
- Question: Complete the formula rule that colors call counts below each agent's own target (for Kim Haneul in row 2).
- Formula: `=D2___G2`
- Chips: < · > · =
- Answer: <
- Result: TRUE
- Explanation: Below target means less than the target, so <. Kim Haneul has 52 < 55, which is TRUE, so this cell is colored.

#### 11-5 · steps
- Question: Color call counts less than 45 red.
- Steps (answer order): Select D2:D9 · Home › Conditional Formatting · Highlight Cells Rules › Less Than · Enter 45 · Pick red formatting, then OK
- Decoy steps: Highlight Cells Rules › Greater Than · Data › Filter
- Table after: D5 (39) and D7 (44) red
- Explanation: Select the cells first, then choose the rule, the value and the color in turn.

#### 11-6 · steps
- Question: Color call counts below each agent's own target. Each agent has a different target.
- Steps (answer order): Select D2:D9 · Home › Conditional Formatting · New Rule · Use a formula to determine which cells to format · Enter =D2<G2 and pick a format · OK
- Decoy steps: Enter =D2<G9 and pick a format · Highlight Cells Rules › Less Than
- Table after: D2 (52), D5 (39), D7 (44) and D9 (50) red
- Explanation: Written for the first cell, =D2<G2 compares each row with its own target. Locking it to G9 compares everyone with Yoon Siwoo's target.

### Summary
- Conditional formatting = color cells that meet a condition (Home › Conditional Formatting)
- When values change, colors follow
- Different targets per person: formula rule =D2<G2
