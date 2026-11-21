# Staffing Lab: Channel comparison — English copy

Written 2026-11-21. Follows the approved Korean (`2026-11-21-staffing-channels-copy.md`), key for key, in the same format. `{name}` is a number filled in from the calculation. "(reused)" marks existing Staffing Lab wording used as is.

## Tabs

| Key | English |
|---|---|
| tabsLabel | Lab screens |
| tabPractice | 30-minute practice |
| tabChannels | Channel comparison |

## Channel comparison: top

| Key | English |
|---|---|
| channelsIntro | A practice screen: set phone, chat and email side by side and work out the staff, working hours and overtime the whole center needs. |
| exampleNote | (reused) The values below are example values for practice. Change them to your own center's values. |
| commonHeading | Center-wide values |
| pickHeading | Channels to compare |
| pickNote | Turn on only the channels your center runs. At least one channel stays on. |
| editHeading | Channel to edit |
| phone | Phone |
| chat | Chat |
| email | Email |

## Inputs

| Key | Label | One-line hint |
|---|---|---|
| planned | (reused) Planned Shrinkage | (reused) Time planned in advance, such as breaks, training and meetings. |
| unplanned | (reused) Unplanned Shrinkage | (reused) Time that is not planned, such as absence, lateness and sick leave. |
| weeklyHours | Weekly hours per agent | The contracted hours one agent works in a week. |
| dailyVolume | Daily contact volume | Contacts arriving in one day. |
| aht (phone) | (reused) Average handle time (AHT) | (reused) The average time it takes to handle one contact. |
| aht (chat) | (reused) Average handle time (AHT) | The average time one chat takes from start to finish. |
| aht (email) | (reused) Average handle time (AHT) | The average time it takes to read and answer one email. |
| concurrency | Concurrent chats | The number of chats one agent handles at once. |
| target (phone) | (reused) Target answer time | (reused) The aim is to answer within this time. |
| target (chat) | (reused) Target answer time | The aim is to answer the customer's first message within this time. |
| hoursOpen | Hours open per day | The hours each day this channel takes contacts. |
| daysOpen | Days open per week | The days each week this channel runs. |
| current | Current rostered staff | Agents assigned to this channel. |

Units: hours → " h", days → " days", concurrent chats → " chats". The rest are as in the 30-minute practice (contacts, min, people, %, sec).

## Results table

| Key | Row name | One-line hint |
|---|---|---|
| resultsHeading | Results by channel (example) | |
| total | Total | |
| seats | Agents at desks at once | The agents who need to be at their desks at the same time while the channel is open. |
| needed | Staff needed | Working hours with Shrinkage allowed for, divided by the weekly hours per agent. |
| currentRow | Current staff | |
| diff | Difference | |
| weekly | Weekly working hours | Desk hours plus Shrinkage, over one week. |
| monthly | Monthly working hours | Weekly working hours × 52 ÷ 12. |
| otWeekly | Expected overtime (weekly) | The hours needed that current staff cannot cover. |
| otMonthly | Expected overtime (monthly) | |
| otPerPerson | Overtime per agent (weekly) | |

| Key | English |
|---|---|
| gapShort | (reused) {n} short |
| gapExact | (reused) Exactly enough |
| gapSpare | (reused) {n} to spare |
| totalBoth | {short} short · {spare} to spare |
| totalShort | {n} short |
| totalSpare | {n} to spare |
| noStaff | No staff rostered |
| otNote | If overtime per agent is high, think about adding staff before adding overtime. |
| summary | Total for {n} channels on: {needed} staff needed, {weekly} hours a week, {ot} hours of overtime a week. |
| summaryOne | Total for 1 channel on: {needed} staff needed, {weekly} hours a week, {ot} hours of overtime a week. |

## Try this

| Key | English |
|---|---|
| tryHeading | (reused) Try this |
| tryC1 | Lower chat's concurrent chats to 1. How many more staff do you need? |
| tryC2 | Raise unplanned Shrinkage by 5 points. Which channel's overtime grows the most? |
| tryC3 | Turn email off. The total drops, so why are phone and chat still short? |

## Limits of this calculation

| Key | English |
|---|---|
| limitsHeading | (reused) Limits of this calculation |
| channelsLimits | Daily volume is spread evenly over opening hours, so shortfalls at busy times do not show. Chat divides handle time by concurrent chats as an approximation, and email uses an occupancy of 85% (example). Each channel is treated as having its own staff; this is for practice, so check real staffing plans with your WFM team. |
| countryNote | (reused) Laws and regulations on working hours and breaks can differ from country to country. |
