// Miso's Excel practice: wording, the example table and the 11 lessons.
// Generated from docs/superpowers/specs/2026-11-20-excel-practice-copy.md (Korean, confirmed)
// and its English translation (.en.md); tests check every field against both files.

export const EXCEL_UI = {
  "title": {
    "ko": "미소의 엑셀 연습",
    "en": "Miso's Excel Practice"
  },
  "intro": {
    "ko": "미소 팀 하루 콜 기록(예시) 하나로 팀장에게 꼭 필요한 엑셀 11가지를 익혀요. 타자 없이 눌러서만 풀어요.",
    "en": "Learn the 11 Excel skills a Team Leader needs, using one example table of Miso's team's calls. No typing: just tap."
  },
  "lessonOf": {
    "ko": "레슨 {i} / {n}",
    "en": "Lesson {i} of {n}"
  },
  "questionOf": {
    "ko": "문제 {i} / {n}",
    "en": "Question {i} of {n}"
  },
  "start": {
    "ko": "시작하기",
    "en": "Start"
  },
  "continue": {
    "ko": "이어서 하기",
    "en": "Continue"
  },
  "locked": {
    "ko": "앞 레슨을 마치면 열려요",
    "en": "Opens when you finish the lesson before"
  },
  "score": {
    "ko": "6개 중 {n}개",
    "en": "{n} of 6"
  },
  "check": {
    "ko": "확인",
    "en": "Check"
  },
  "clear": {
    "ko": "다시 놓기",
    "en": "Start over"
  },
  "buildHint": {
    "ko": "카드를 눌러 수식을 만드세요. 줄에 놓인 카드를 누르면 빠져요.",
    "en": "Tap cards to build the formula. Tap a card in the line to take it out."
  },
  "cellHint": {
    "ko": "표에서 칸을 누르세요. 범위는 첫 칸과 끝 칸을 차례로 누르세요.",
    "en": "Tap a cell in the table. For a range, tap the first cell, then the last."
  },
  "stepsHint": {
    "ko": "순서대로 눌러 보세요. 놓인 단계를 누르면 빠져요.",
    "en": "Tap the steps in order. Tap a placed step to take it out."
  },
  "correct": {
    "ko": "맞아요!",
    "en": "That's right!"
  },
  "wrong": {
    "ko": "아쉬워요.",
    "en": "Not quite."
  },
  "result": {
    "ko": "결과: {v}",
    "en": "Result: {v}"
  },
  "usedCells": {
    "ko": "계산에 쓰인 칸을 표에 표시했어요.",
    "en": "The cells used in the calculation are marked in the table."
  },
  "retry": {
    "ko": "다시 해 보기",
    "en": "Try again"
  },
  "next": {
    "ko": "다음 문제 →",
    "en": "Next question →"
  },
  "summaryTitle": {
    "ko": "오늘 배운 것",
    "en": "What you learned"
  },
  "lessonDone": {
    "ko": "레슨 {i} 마침!",
    "en": "Lesson {i} done!"
  },
  "nextLesson": {
    "ko": "다음 레슨 →",
    "en": "Next lesson →"
  },
  "backToList": {
    "ko": "레슨 목록",
    "en": "All lessons"
  },
  "allDone": {
    "ko": "11개 레슨을 모두 마쳤어요. 이제 실제 팀 보고서에 써 보세요.",
    "en": "You've finished all 11 lessons. Now try them on your real team reports."
  },
  "homeCard": {
    "ko": "미소의 엑셀 연습",
    "en": "Miso's Excel Practice"
  },
  "homeCardLine": {
    "ko": "팀장이 꼭 쓰는 엑셀 11가지를 눌러서 익힙니다.",
    "en": "The 11 Excel skills Team Leaders use most, learned by tapping."
  }
};

export const SHEETS = {
  "ko": {
    "title": "미소 팀 하루 콜 기록 (예시)",
    "headers": [
      "ID",
      "이름",
      "팀",
      "콜",
      "처리(초)",
      "30초 내",
      "목표"
    ],
    "cells": {
      "A1": "ID",
      "B1": "이름",
      "C1": "팀",
      "D1": "콜",
      "E1": "처리(초)",
      "F1": "30초 내",
      "G1": "목표",
      "A2": "S01",
      "B2": "김하늘",
      "C2": "A팀",
      "D2": 52,
      "E2": 15600,
      "F2": 44,
      "G2": 55,
      "A3": "S02",
      "B3": "이도윤",
      "C3": "B팀",
      "D3": 47,
      "E3": 13160,
      "F3": 38,
      "G3": 45,
      "A4": "S03",
      "B4": "박서연",
      "C4": "A팀",
      "D4": 61,
      "E4": 17080,
      "F4": 55,
      "G4": 55,
      "A5": "S04",
      "B5": "최지호",
      "C5": "B팀",
      "D5": 39,
      "E5": 12480,
      "F5": 30,
      "G5": 45,
      "A6": "S05",
      "B6": "정민서",
      "C6": "A팀",
      "D6": 55,
      "E6": 14850,
      "F6": 47,
      "G6": 55,
      "A7": "S06",
      "B7": "강예준",
      "C7": "B팀",
      "D7": 44,
      "E7": 14520,
      "F7": 35,
      "G7": 45,
      "A8": "S07",
      "B8": "조수아",
      "C8": "A팀",
      "D8": 58,
      "E8": 15080,
      "F8": 51,
      "G8": 55,
      "A9": "S08",
      "B9": "윤시우",
      "C9": "A팀",
      "D9": 50,
      "E9": 16000,
      "F9": 42,
      "G9": 55
    }
  },
  "en": {
    "title": "Miso's team, one day of calls (example)",
    "headers": [
      "ID",
      "Name",
      "Team",
      "Calls",
      "Handle (s)",
      "≤30 s",
      "Target"
    ],
    "cells": {
      "A1": "ID",
      "B1": "Name",
      "C1": "Team",
      "D1": "Calls",
      "E1": "Handle (s)",
      "F1": "≤30 s",
      "G1": "Target",
      "A2": "S01",
      "B2": "Kim Haneul",
      "C2": "Team A",
      "D2": 52,
      "E2": 15600,
      "F2": 44,
      "G2": 55,
      "A3": "S02",
      "B3": "Lee Doyun",
      "C3": "Team B",
      "D3": 47,
      "E3": 13160,
      "F3": 38,
      "G3": 45,
      "A4": "S03",
      "B4": "Park Seoyeon",
      "C4": "Team A",
      "D4": 61,
      "E4": 17080,
      "F4": 55,
      "G4": 55,
      "A5": "S04",
      "B5": "Choi Jiho",
      "C5": "Team B",
      "D5": 39,
      "E5": 12480,
      "F5": 30,
      "G5": 45,
      "A6": "S05",
      "B6": "Jung Minseo",
      "C6": "Team A",
      "D6": 55,
      "E6": 14850,
      "F6": 47,
      "G6": 55,
      "A7": "S06",
      "B7": "Kang Yejun",
      "C7": "Team B",
      "D7": 44,
      "E7": 14520,
      "F7": 35,
      "G7": 45,
      "A8": "S07",
      "B8": "Jo Sua",
      "C8": "Team A",
      "D8": 58,
      "E8": 15080,
      "F8": 51,
      "G8": 55,
      "A9": "S08",
      "B9": "Yoon Siwoo",
      "C9": "Team A",
      "D9": 50,
      "E9": 16000,
      "F9": 42,
      "G9": 55
    }
  }
};

export const EXCEL_LESSONS = [
  {
    "id": "1",
    "title": {
      "ko": "셀 주소와 범위",
      "en": "Cell addresses and ranges"
    },
    "cards": [
      {
        "ko": "엑셀 표는 칸(셀)으로 되어 있어요. 열은 A, B, C 같은 글자, 행은 1, 2, 3 같은 숫자예요. 그래서 C열 3행 칸의 주소는 C3이에요.",
        "en": "An Excel sheet is made of cells. Columns are letters (A, B, C) and rows are numbers (1, 2, 3). So the cell in column C, row 3 is C3."
      },
      {
        "ko": "여러 칸을 한 번에 가리킬 때는 범위를 써요. D2:D9는 D2부터 D9까지, 상담사 8명의 콜 수 칸이에요.",
        "en": "To point at several cells at once, use a range. D2:D9 means D2 through D9: the call counts of all 8 agents."
      },
      {
        "ko": "이 연습에서는 미소 팀 하루 콜 기록(예시)을 계속 써요. 1행은 머리글이고, 2~9행이 상담사 8명이에요.",
        "en": "This practice uses one example table of Miso's team's calls throughout. Row 1 holds the headers; rows 2 to 9 are the 8 agents."
      }
    ],
    "summary": [
      {
        "ko": "칸 주소 = 열 글자 + 행 숫자 (C3)",
        "en": "Cell address = column letter + row number (C3)"
      },
      {
        "ko": "범위 = 첫 칸:끝 칸 (D2:D9)",
        "en": "Range = first cell:last cell (D2:D9)"
      },
      {
        "ko": "1행 머리글은 범위에서 빼요",
        "en": "Leave the row 1 header out of ranges"
      }
    ],
    "questions": [
      {
        "id": "1-1",
        "type": "choice",
        "prompt": {
          "ko": "B4 칸에는 무엇이 들어 있을까요?",
          "en": "What is in cell B4?"
        },
        "explanation": {
          "ko": "B열은 이름, 4행은 세 번째 상담사예요. S03은 A4, 61은 D4에 있어요.",
          "en": "Column B is the name, and row 4 is the third agent. S03 is in A4 and 61 is in D4."
        },
        "options": [
          {
            "ko": "박서연",
            "en": "Park Seoyeon"
          },
          {
            "ko": "S03",
            "en": "S03"
          },
          {
            "ko": "61",
            "en": "61"
          }
        ],
        "answer": 0
      },
      {
        "id": "1-2",
        "type": "choice",
        "prompt": {
          "ko": "D2:D9는 몇 칸일까요?",
          "en": "How many cells are in D2:D9?"
        },
        "explanation": {
          "ko": "2행부터 9행까지 8개 행이라 8칸이에요. 1행 머리글은 들어가지 않아요.",
          "en": "Rows 2 to 9 make 8 rows, so 8 cells. The header in row 1 isn't included."
        },
        "options": [
          {
            "ko": "8칸",
            "en": "8 cells"
          },
          {
            "ko": "9칸",
            "en": "9 cells"
          },
          {
            "ko": "2칸",
            "en": "2 cells"
          }
        ],
        "answer": 0
      },
      {
        "id": "1-3",
        "type": "blank",
        "prompt": {
          "ko": "상담사 8명의 팀 칸을 모두 가리키는 범위를 완성하세요.",
          "en": "Complete the range that covers the team cells of all 8 agents."
        },
        "explanation": {
          "ko": "1행은 머리글 \"팀\"이에요. 상담사는 2행부터라 C2:C9예요.",
          "en": "Row 1 is the \"Team\" header. The agents start in row 2, so the range is C2:C9."
        },
        "template": {
          "ko": "C___:C9",
          "en": "C___:C9"
        },
        "chips": [
          {
            "ko": "2",
            "en": "2"
          },
          {
            "ko": "1",
            "en": "1"
          },
          {
            "ko": "3",
            "en": "3"
          }
        ],
        "answer": 0
      },
      {
        "id": "1-4",
        "type": "blank",
        "prompt": {
          "ko": "최지호 상담사의 콜 수 칸 주소를 완성하세요.",
          "en": "Complete the address of Choi Jiho's call count."
        },
        "explanation": {
          "ko": "최지호는 5행, 콜 수는 D열이라 D5예요.",
          "en": "Choi Jiho is in row 5 and calls are in column D, so it's D5."
        },
        "template": {
          "ko": "___5",
          "en": "___5"
        },
        "chips": [
          {
            "ko": "D",
            "en": "D"
          },
          {
            "ko": "E",
            "en": "E"
          },
          {
            "ko": "C",
            "en": "C"
          }
        ],
        "answer": 0
      },
      {
        "id": "1-5",
        "type": "cell",
        "prompt": {
          "ko": "윤시우 상담사의 총 처리 시간 칸을 눌러 보세요.",
          "en": "Tap Yoon Siwoo's total handle time cell."
        },
        "explanation": {
          "ko": "윤시우는 9행, 총 처리 시간은 E열이라 E9예요.",
          "en": "Yoon Siwoo is in row 9 and total handle time is column E, so it's E9."
        },
        "answer": "E9"
      },
      {
        "id": "1-6",
        "type": "cell",
        "prompt": {
          "ko": "상담사 8명의 팀이 적힌 칸 전체를 범위로 골라 보세요.",
          "en": "Select all 8 agents' team cells as a range."
        },
        "explanation": {
          "ko": "첫 칸 C2와 끝 칸 C9를 누르면 C2:C9 범위가 돼요. C1은 머리글이라 빼요.",
          "en": "Tap the first cell C2 and the last cell C9 to make the range C2:C9. C1 is the header, so leave it out."
        },
        "answer": "C2:C9"
      }
    ]
  },
  {
    "id": "2",
    "title": {
      "ko": "SUM · AVERAGE · MIN · MAX",
      "en": "SUM · AVERAGE · MIN · MAX"
    },
    "cards": [
      {
        "ko": "SUM은 범위의 숫자를 모두 더해요. =SUM(D2:D9)는 팀 전체 콜 수, 406이에요(예시).",
        "en": "SUM adds up every number in a range. =SUM(D2:D9) is the team's total calls: 406 (example)."
      },
      {
        "ko": "AVERAGE는 평균, MIN은 가장 작은 값, MAX는 가장 큰 값이에요. 콜 수가 가장 적은 상담사를 찾을 때는 MIN을 써요.",
        "en": "AVERAGE gives the mean, MIN the smallest value and MAX the largest. To find the fewest calls an agent took, use MIN."
      }
    ],
    "summary": [
      {
        "ko": "SUM 합계 · AVERAGE 평균",
        "en": "SUM total · AVERAGE mean"
      },
      {
        "ko": "MIN 가장 작은 값 · MAX 가장 큰 값",
        "en": "MIN smallest · MAX largest"
      },
      {
        "ko": "범위는 머리글을 빼고 2행부터",
        "en": "Ranges skip the header and start at row 2"
      }
    ],
    "questions": [
      {
        "id": "2-1",
        "type": "choice",
        "prompt": {
          "ko": "팀 전체 콜 수를 구하려면 어떤 함수를 쓸까요?",
          "en": "Which function gives the team's total calls?"
        },
        "explanation": {
          "ko": "모두 더한 값이 필요하니 SUM이에요. AVERAGE는 평균, MAX는 가장 큰 값이에요.",
          "en": "You need everything added up, so SUM. AVERAGE is the mean and MAX is the largest value."
        },
        "options": [
          {
            "ko": "SUM",
            "en": "SUM"
          },
          {
            "ko": "AVERAGE",
            "en": "AVERAGE"
          },
          {
            "ko": "MAX",
            "en": "MAX"
          }
        ],
        "answer": 0
      },
      {
        "id": "2-2",
        "type": "choice",
        "prompt": {
          "ko": "=MAX(D2:D9)의 결과는 무엇일까요?",
          "en": "What does =MAX(D2:D9) return?"
        },
        "explanation": {
          "ko": "MAX는 가장 큰 값이라 박서연의 61이에요. 39는 MIN, 406은 SUM의 결과예요.",
          "en": "MAX is the largest value: Park Seoyeon's 61. 39 is MIN and 406 is SUM."
        },
        "options": [
          {
            "ko": "61",
            "en": "61"
          },
          {
            "ko": "39",
            "en": "39"
          },
          {
            "ko": "406",
            "en": "406"
          }
        ],
        "answer": 0
      },
      {
        "id": "2-3",
        "type": "blank",
        "prompt": {
          "ko": "상담사 한 명당 평균 콜 수를 구하세요.",
          "en": "Find the average number of calls per agent."
        },
        "explanation": {
          "ko": "평균은 AVERAGE예요. 406건을 8명으로 나눈 50.75예요.",
          "en": "The mean is AVERAGE: 406 calls divided by 8 agents is 50.75."
        },
        "template": {
          "ko": "=___(D2:D9)",
          "en": "=___(D2:D9)"
        },
        "chips": [
          {
            "ko": "AVERAGE",
            "en": "AVERAGE"
          },
          {
            "ko": "SUM",
            "en": "SUM"
          },
          {
            "ko": "MIN",
            "en": "MIN"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 50.75,
          "en": 50.75
        }
      },
      {
        "id": "2-4",
        "type": "blank",
        "prompt": {
          "ko": "총 처리 시간이 가장 짧은 상담사의 값을 구하세요.",
          "en": "Find the shortest total handle time."
        },
        "explanation": {
          "ko": "총 처리 시간은 E열이에요. D열은 콜 수, F열은 30초 안에 받은 콜이에요.",
          "en": "Total handle time is column E. Column D is calls and column F is calls answered within 30 seconds."
        },
        "template": {
          "ko": "=MIN(___)",
          "en": "=MIN(___)"
        },
        "chips": [
          {
            "ko": "E2:E9",
            "en": "E2:E9"
          },
          {
            "ko": "D2:D9",
            "en": "D2:D9"
          },
          {
            "ko": "F2:F9",
            "en": "F2:F9"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 12480,
          "en": 12480
        }
      },
      {
        "id": "2-5",
        "type": "build",
        "prompt": {
          "ko": "팀 전체의 총 처리 시간을 구하는 수식을 만드세요.",
          "en": "Build the formula for the team's total handle time."
        },
        "explanation": {
          "ko": "합계는 SUM, 처리 시간은 E2:E9예요.",
          "en": "A total is SUM, and handle time is E2:E9."
        },
        "cards": {
          "ko": [
            "SUM(",
            "E2:E9",
            ")"
          ],
          "en": [
            "SUM(",
            "E2:E9",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "AVERAGE(",
            "D2:D9"
          ],
          "en": [
            "AVERAGE(",
            "D2:D9"
          ]
        },
        "result": {
          "ko": 118770,
          "en": 118770
        }
      },
      {
        "id": "2-6",
        "type": "build",
        "prompt": {
          "ko": "콜을 가장 많이 받은 상담사의 콜 수를 구하세요.",
          "en": "Find the call count of the agent who took the most calls."
        },
        "explanation": {
          "ko": "가장 큰 값은 MAX, 콜 수는 D2:D9예요.",
          "en": "The largest value is MAX, and calls are D2:D9."
        },
        "cards": {
          "ko": [
            "MAX(",
            "D2:D9",
            ")"
          ],
          "en": [
            "MAX(",
            "D2:D9",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "MIN(",
            "E2:E9"
          ],
          "en": [
            "MIN(",
            "E2:E9"
          ]
        },
        "result": {
          "ko": 61,
          "en": 61
        }
      }
    ]
  },
  {
    "id": "3",
    "title": {
      "ko": "비율과 ROUND",
      "en": "Ratios and ROUND"
    },
    "cards": [
      {
        "ko": "비율은 나누기로 구해요. 김하늘의 30초 안 응답 비율은 =F2/D2, 44÷52라서 0.846…이에요.",
        "en": "A ratio is a division. Kim Haneul's share of calls answered within 30 seconds is =F2/D2: 44 ÷ 52 = 0.846…"
      },
      {
        "ko": "ROUND(값, 자릿수)는 반올림이에요. =ROUND(F2/D2, 2)는 0.85예요. 셀 서식을 백분율로 바꾸면 85%로 보여요.",
        "en": "ROUND(value, digits) rounds a number. =ROUND(F2/D2, 2) is 0.85. Format the cell as a percentage and it shows 85%."
      },
      {
        "ko": "팀 전체 서비스 레벨은 합계끼리 나눠요: =SUM(F2:F9)/SUM(D2:D9). 사람별 비율의 평균과는 값이 달라요(예시에서 84.2%와 83.7%). 콜이 많은 사람과 적은 사람이 같은 무게로 섞이기 때문이에요.",
        "en": "The team's service level divides total by total: =SUM(F2:F9)/SUM(D2:D9). It differs from the average of each agent's ratio (84.2% versus 83.7% in the example), because that average weighs busy and quiet agents the same."
      }
    ],
    "summary": [
      {
        "ko": "비율 = 부분 ÷ 전체 (F2/D2)",
        "en": "Ratio = part ÷ whole (F2/D2)"
      },
      {
        "ko": "ROUND(값, 자릿수)로 반올림",
        "en": "ROUND(value, digits) rounds"
      },
      {
        "ko": "팀 전체 비율은 합계 ÷ 합계",
        "en": "A team-wide ratio is total ÷ total"
      }
    ],
    "questions": [
      {
        "id": "3-1",
        "type": "choice",
        "prompt": {
          "ko": "서비스 레벨(30초 안에 받은 콜의 비율)을 구하는 식은 무엇일까요? 목표 시간은 센터마다 정해요.",
          "en": "Which gives the service level (the share of calls answered within 30 seconds)? Each center sets its own target time."
        },
        "explanation": {
          "ko": "비율은 부분을 전체로 나눠요. 거꾸로 나누면 1보다 큰 값이 나와요.",
          "en": "A ratio is the part divided by the whole. Dividing the other way gives a value above 1."
        },
        "options": [
          {
            "ko": "30초 안에 받은 콜 ÷ 전체 콜",
            "en": "Calls answered within 30 s ÷ all calls"
          },
          {
            "ko": "전체 콜 ÷ 30초 안에 받은 콜",
            "en": "All calls ÷ calls answered within 30 s"
          },
          {
            "ko": "전체 콜 − 30초 안에 받은 콜",
            "en": "All calls − calls answered within 30 s"
          }
        ],
        "answer": 0
      },
      {
        "id": "3-2",
        "type": "choice",
        "prompt": {
          "ko": "=ROUND(0.8461, 2)의 결과는 무엇일까요?",
          "en": "What does =ROUND(0.8461, 2) return?"
        },
        "explanation": {
          "ko": "소수 둘째 자리까지 남기고 셋째 자리 6에서 반올림해 0.85가 돼요.",
          "en": "It keeps two decimal places and rounds on the third digit, 6, giving 0.85."
        },
        "options": [
          {
            "ko": "0.85",
            "en": "0.85"
          },
          {
            "ko": "0.84",
            "en": "0.84"
          },
          {
            "ko": "0.8461",
            "en": "0.8461"
          }
        ],
        "answer": 0
      },
      {
        "id": "3-3",
        "type": "blank",
        "prompt": {
          "ko": "박서연(4행)의 30초 안 응답 비율을 구하세요.",
          "en": "Find Park Seoyeon's (row 4) share of calls answered within 30 seconds."
        },
        "explanation": {
          "ko": "전체 콜은 D열이에요. G4는 목표 콜 수라 비율이 달라져요.",
          "en": "All calls are in column D. G4 is the target, which gives a different ratio."
        },
        "template": {
          "ko": "=F4/___",
          "en": "=F4/___"
        },
        "chips": [
          {
            "ko": "D4",
            "en": "D4"
          },
          {
            "ko": "G4",
            "en": "G4"
          },
          {
            "ko": "F4",
            "en": "F4"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 0.9016393442622951,
          "en": 0.9016393442622951
        }
      },
      {
        "id": "3-4",
        "type": "blank",
        "prompt": {
          "ko": "김하늘의 비율을 소수 둘째 자리까지 반올림하세요.",
          "en": "Round Kim Haneul's ratio to two decimal places."
        },
        "explanation": {
          "ko": "자릿수 2는 소수 둘째 자리까지 남겨요. 1이면 0.8, 0이면 1이 돼요.",
          "en": "2 keeps two decimal places. 1 gives 0.8 and 0 gives 1."
        },
        "template": {
          "ko": "=ROUND(F2/D2, ___)",
          "en": "=ROUND(F2/D2, ___)"
        },
        "chips": [
          {
            "ko": "2",
            "en": "2"
          },
          {
            "ko": "1",
            "en": "1"
          },
          {
            "ko": "0",
            "en": "0"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 0.85,
          "en": 0.85
        }
      },
      {
        "id": "3-5",
        "type": "build",
        "prompt": {
          "ko": "팀 전체 서비스 레벨을 구하세요.",
          "en": "Find the team's service level."
        },
        "explanation": {
          "ko": "30초 안에 받은 콜 합계를 전체 콜 합계로 나눠요. 약 84.2%예요.",
          "en": "Divide the total answered within 30 seconds by total calls. That's about 84.2%."
        },
        "cards": {
          "ko": [
            "SUM(",
            "F2:F9",
            ")",
            "/",
            "SUM(",
            "D2:D9",
            ")"
          ],
          "en": [
            "SUM(",
            "F2:F9",
            ")",
            "/",
            "SUM(",
            "D2:D9",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "AVERAGE(",
            "G2:G9"
          ],
          "en": [
            "AVERAGE(",
            "G2:G9"
          ]
        },
        "result": {
          "ko": 0.8423645320197044,
          "en": 0.8423645320197044
        }
      },
      {
        "id": "3-6",
        "type": "build",
        "prompt": {
          "ko": "김하늘(2행)의 30초 안 응답 비율을 소수 둘째 자리까지 반올림하세요.",
          "en": "Round Kim Haneul's (row 2) share of calls answered within 30 seconds to two decimal places."
        },
        "explanation": {
          "ko": "먼저 F2/D2로 비율을 내고, ROUND의 두 번째 칸에 자릿수 2를 넣어요.",
          "en": "First get the ratio with F2/D2, then put 2 digits in ROUND's second slot."
        },
        "cards": {
          "ko": [
            "ROUND(",
            "F2",
            "/",
            "D2",
            ",",
            "2",
            ")"
          ],
          "en": [
            "ROUND(",
            "F2",
            "/",
            "D2",
            ",",
            "2",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "G2",
            "1"
          ],
          "en": [
            "G2",
            "1"
          ]
        },
        "result": {
          "ko": 0.85,
          "en": 0.85
        }
      }
    ]
  },
  {
    "id": "4",
    "title": {
      "ko": "COUNTIF · COUNTIFS",
      "en": "COUNTIF · COUNTIFS"
    },
    "cards": [
      {
        "ko": "COUNTIF(범위, 조건)는 조건에 맞는 칸의 개수를 세요. =COUNTIF(C2:C9, \"A팀\")은 A팀 상담사 수라서 5예요.",
        "en": "COUNTIF(range, criteria) counts the cells that meet a condition. =COUNTIF(C2:C9, \"Team A\") counts Team A's agents: 5."
      },
      {
        "ko": "숫자 조건은 따옴표 안에 기호와 함께 써요. =COUNTIF(D2:D9, \">=50\")은 콜을 50건 이상 받은 상담사 수예요.",
        "en": "Number conditions go inside quotes with their sign. =COUNTIF(D2:D9, \">=50\") counts agents who took 50 calls or more."
      },
      {
        "ko": "조건이 둘 이상이면 COUNTIFS(범위1, 조건1, 범위2, 조건2)를 써요. 모든 조건을 동시에 만족하는 행만 세요.",
        "en": "For more than one condition use COUNTIFS(range1, criteria1, range2, criteria2). It counts only rows that meet every condition at once."
      }
    ],
    "summary": [
      {
        "ko": "COUNTIF(범위, 조건) = 조건에 맞는 칸 수",
        "en": "COUNTIF(range, criteria) = how many cells meet it"
      },
      {
        "ko": "숫자 조건은 \">=50\"처럼 따옴표 안에",
        "en": "Number conditions go in quotes, like \">=50\""
      },
      {
        "ko": "COUNTIFS는 모든 조건을 동시에 만족하는 행만",
        "en": "COUNTIFS counts only rows that meet every condition"
      }
    ],
    "questions": [
      {
        "id": "4-1",
        "type": "choice",
        "prompt": {
          "ko": "=COUNTIF(C2:C9, \"B팀\")의 결과는 무엇일까요?",
          "en": "What does =COUNTIF(C2:C9, \"Team B\") return?"
        },
        "explanation": {
          "ko": "B팀은 이도윤, 최지호, 강예준 3명이에요. 5는 A팀, 8은 전체 인원이에요.",
          "en": "Team B is Lee Doyun, Choi Jiho and Kang Yejun: 3 agents. 5 is Team A and 8 is everyone."
        },
        "options": [
          {
            "ko": "3",
            "en": "3"
          },
          {
            "ko": "5",
            "en": "5"
          },
          {
            "ko": "8",
            "en": "8"
          }
        ],
        "answer": 0
      },
      {
        "id": "4-2",
        "type": "choice",
        "prompt": {
          "ko": "COUNTIFS가 세는 행은 어느 것일까요?",
          "en": "Which rows does COUNTIFS count?"
        },
        "explanation": {
          "ko": "COUNTIFS는 \"그리고\"로 이어요. 하나만 맞는 행은 세지 않아요.",
          "en": "COUNTIFS joins conditions with \"and\". A row that meets only one isn't counted."
        },
        "options": [
          {
            "ko": "모든 조건을 동시에 만족하는 행",
            "en": "Rows that meet every condition at once"
          },
          {
            "ko": "조건 중 하나라도 만족하는 행",
            "en": "Rows that meet at least one condition"
          },
          {
            "ko": "조건을 하나도 만족하지 않는 행",
            "en": "Rows that meet no condition"
          }
        ],
        "answer": 0
      },
      {
        "id": "4-3",
        "type": "blank",
        "prompt": {
          "ko": "콜을 50건 이상 받은 상담사 수를 세세요.",
          "en": "Count the agents who took 50 calls or more."
        },
        "explanation": {
          "ko": "\"이상\"은 >=예요. \">50\"은 50을 빼서 4, \"50\"은 딱 50인 칸만 세서 1이에요.",
          "en": "\"Or more\" is >=. \">50\" leaves out 50 and gives 4; \"50\" counts only exactly 50 and gives 1."
        },
        "template": {
          "ko": "=COUNTIF(D2:D9, ___)",
          "en": "=COUNTIF(D2:D9, ___)"
        },
        "chips": [
          {
            "ko": "\">=50\"",
            "en": "\">=50\""
          },
          {
            "ko": "\">50\"",
            "en": "\">50\""
          },
          {
            "ko": "\"50\"",
            "en": "\"50\""
          }
        ],
        "answer": 0,
        "result": {
          "ko": 5,
          "en": 5
        }
      },
      {
        "id": "4-4",
        "type": "blank",
        "prompt": {
          "ko": "A팀이면서 콜을 55건 이상 받은 상담사 수를 세세요.",
          "en": "Count the Team A agents who took 55 calls or more."
        },
        "explanation": {
          "ko": "콜 수는 D열이에요. 박서연, 정민서, 조수아 3명이에요.",
          "en": "Calls are column D. That's Park Seoyeon, Jung Minseo and Jo Sua: 3 agents."
        },
        "template": {
          "ko": "=COUNTIFS(C2:C9, \"A팀\", ___, \">=55\")",
          "en": "=COUNTIFS(C2:C9, \"Team A\", ___, \">=55\")"
        },
        "chips": [
          {
            "ko": "D2:D9",
            "en": "D2:D9"
          },
          {
            "ko": "E2:E9",
            "en": "E2:E9"
          },
          {
            "ko": "G2:G9",
            "en": "G2:G9"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 3,
          "en": 3
        }
      },
      {
        "id": "4-5",
        "type": "build",
        "prompt": {
          "ko": "A팀 상담사 수를 세세요.",
          "en": "Count Team A's agents."
        },
        "explanation": {
          "ko": "팀 칸 C2:C9에서 \"A팀\"인 칸을 세요.",
          "en": "Count the cells in the team column C2:C9 that say \"Team A\"."
        },
        "cards": {
          "ko": [
            "COUNTIF(",
            "C2:C9",
            ",",
            "\"A팀\"",
            ")"
          ],
          "en": [
            "COUNTIF(",
            "C2:C9",
            ",",
            "\"Team A\"",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "\"B팀\"",
            "SUMIF("
          ],
          "en": [
            "\"Team B\"",
            "SUMIF("
          ]
        },
        "result": {
          "ko": 5,
          "en": 5
        }
      },
      {
        "id": "4-6",
        "type": "build",
        "prompt": {
          "ko": "B팀이면서 콜을 45건 이상 받은 상담사 수를 세세요.",
          "en": "Count the Team B agents who took 45 calls or more."
        },
        "explanation": {
          "ko": "두 조건을 모두 만족하는 사람은 이도윤(47건) 한 명이에요.",
          "en": "Only Lee Doyun (47 calls) meets both conditions."
        },
        "cards": {
          "ko": [
            "COUNTIFS(",
            "C2:C9",
            ",",
            "\"B팀\"",
            ",",
            "D2:D9",
            ",",
            "\">=45\"",
            ")"
          ],
          "en": [
            "COUNTIFS(",
            "C2:C9",
            ",",
            "\"Team B\"",
            ",",
            "D2:D9",
            ",",
            "\">=45\"",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "\"A팀\""
          ],
          "en": [
            "\"Team A\""
          ]
        },
        "result": {
          "ko": 1,
          "en": 1
        }
      }
    ]
  },
  {
    "id": "5",
    "title": {
      "ko": "SUMIFS · AVERAGEIFS",
      "en": "SUMIFS · AVERAGEIFS"
    },
    "cards": [
      {
        "ko": "SUMIFS(더할 범위, 조건 범위, 조건)는 조건에 맞는 행의 값만 더해요. =SUMIFS(D2:D9, C2:C9, \"A팀\")은 A팀 콜 수 합계라서 276이에요(예시).",
        "en": "SUMIFS(sum range, criteria range, criteria) adds only the values in rows that meet a condition. =SUMIFS(D2:D9, C2:C9, \"Team A\") is Team A's total calls: 276 (example)."
      },
      {
        "ko": "AVERAGEIFS는 같은 순서로 평균을 내요. 더하거나 평균 낼 범위가 맨 앞에 온다는 점이 COUNTIF와 달라요.",
        "en": "AVERAGEIFS takes the same order and gives the mean. Unlike COUNTIF, the range to add or average comes first."
      },
      {
        "ko": "팀 평균 처리 시간(AHT)은 팀 총 처리 시간 ÷ 팀 콜 수예요. 상담사별 처리 시간을 평균 내면 콜 한 건당 시간이 아니게 돼요.",
        "en": "A team's average handle time (AHT) is the team's total handle time ÷ the team's calls. Averaging each agent's handle time doesn't give time per call."
      }
    ],
    "summary": [
      {
        "ko": "SUMIFS(더할 범위, 조건 범위, 조건)",
        "en": "SUMIFS(sum range, criteria range, criteria)"
      },
      {
        "ko": "AVERAGEIFS도 평균 낼 범위가 맨 앞",
        "en": "AVERAGEIFS also puts the range to average first"
      },
      {
        "ko": "팀 AHT = 팀 총 처리 시간 ÷ 팀 콜 수",
        "en": "Team AHT = team total handle time ÷ team calls"
      }
    ],
    "questions": [
      {
        "id": "5-1",
        "type": "choice",
        "prompt": {
          "ko": "SUMIFS에서 맨 앞에 오는 범위는 무엇일까요?",
          "en": "Which range comes first in SUMIFS?"
        },
        "explanation": {
          "ko": "SUMIFS는 \"무엇을 더할지\"를 먼저 쓰고, 그다음에 조건 범위와 조건을 짝지어 써요.",
          "en": "SUMIFS starts with what to add, then pairs each criteria range with its condition."
        },
        "options": [
          {
            "ko": "더할 값이 있는 범위",
            "en": "The range with the values to add"
          },
          {
            "ko": "조건을 볼 범위",
            "en": "The range to check the condition in"
          },
          {
            "ko": "결과를 적을 칸",
            "en": "The cell for the result"
          }
        ],
        "answer": 0
      },
      {
        "id": "5-2",
        "type": "choice",
        "prompt": {
          "ko": "A팀 평균 처리 시간(AHT)을 바르게 구하는 식은 무엇일까요?",
          "en": "Which correctly gives Team A's average handle time (AHT)?"
        },
        "explanation": {
          "ko": "AHT는 콜 한 건당 시간이라 콜 수로 나눠요. 인원으로 나누거나 사람별로 평균 내면 한 사람당 시간이 돼요.",
          "en": "AHT is time per call, so divide by calls. Dividing by headcount or averaging per agent gives time per agent."
        },
        "options": [
          {
            "ko": "A팀 총 처리 시간 ÷ A팀 콜 수",
            "en": "Team A's total handle time ÷ Team A's calls"
          },
          {
            "ko": "A팀 총 처리 시간 ÷ A팀 인원",
            "en": "Team A's total handle time ÷ Team A's headcount"
          },
          {
            "ko": "A팀 상담사별 총 처리 시간의 평균",
            "en": "The average of each Team A agent's total handle time"
          }
        ],
        "answer": 0
      },
      {
        "id": "5-3",
        "type": "blank",
        "prompt": {
          "ko": "A팀의 총 처리 시간 합계를 구하세요.",
          "en": "Find Team A's total handle time."
        },
        "explanation": {
          "ko": "더할 값은 처리 시간이 있는 E열이에요. D열을 넣으면 콜 수 합계 276이 나와요.",
          "en": "The values to add are the handle times in column E. Column D would give Team A's calls, 276."
        },
        "template": {
          "ko": "=SUMIFS(___, C2:C9, \"A팀\")",
          "en": "=SUMIFS(___, C2:C9, \"Team A\")"
        },
        "chips": [
          {
            "ko": "E2:E9",
            "en": "E2:E9"
          },
          {
            "ko": "D2:D9",
            "en": "D2:D9"
          },
          {
            "ko": "C2:C9",
            "en": "C2:C9"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 78610,
          "en": 78610
        }
      },
      {
        "id": "5-4",
        "type": "blank",
        "prompt": {
          "ko": "B팀 상담사의 평균 콜 수를 구하세요.",
          "en": "Find Team B's average calls per agent."
        },
        "explanation": {
          "ko": "팀 칸에서 \"B팀\"인 행만 평균 내요. 47, 39, 44의 평균은 약 43.3이에요.",
          "en": "Average only the rows whose team is \"Team B\". The mean of 47, 39 and 44 is about 43.3."
        },
        "template": {
          "ko": "=AVERAGEIFS(D2:D9, C2:C9, ___)",
          "en": "=AVERAGEIFS(D2:D9, C2:C9, ___)"
        },
        "chips": [
          {
            "ko": "\"B팀\"",
            "en": "\"Team B\""
          },
          {
            "ko": "\"A팀\"",
            "en": "\"Team A\""
          },
          {
            "ko": "\">=45\"",
            "en": "\">=45\""
          }
        ],
        "answer": 0,
        "result": {
          "ko": 43.333333333333336,
          "en": 43.333333333333336
        }
      },
      {
        "id": "5-5",
        "type": "build",
        "prompt": {
          "ko": "B팀의 총 처리 시간 합계를 구하세요.",
          "en": "Find Team B's total handle time."
        },
        "explanation": {
          "ko": "더할 범위 E2:E9를 먼저, 그다음 팀 칸 C2:C9와 조건 \"B팀\"을 써요.",
          "en": "The sum range E2:E9 comes first, then the team column C2:C9 and the condition \"Team B\"."
        },
        "cards": {
          "ko": [
            "SUMIFS(",
            "E2:E9",
            ",",
            "C2:C9",
            ",",
            "\"B팀\"",
            ")"
          ],
          "en": [
            "SUMIFS(",
            "E2:E9",
            ",",
            "C2:C9",
            ",",
            "\"Team B\"",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "D2:D9",
            "\"A팀\""
          ],
          "en": [
            "D2:D9",
            "\"Team A\""
          ]
        },
        "result": {
          "ko": 40160,
          "en": 40160
        }
      },
      {
        "id": "5-6",
        "type": "build",
        "prompt": {
          "ko": "A팀 상담사 한 명당 평균 총 처리 시간을 구하세요.",
          "en": "Find the average total handle time per Team A agent."
        },
        "explanation": {
          "ko": "AVERAGEIFS도 평균 낼 범위가 맨 앞이에요. 이 값은 한 사람당 시간이라 AHT와는 달라요.",
          "en": "AVERAGEIFS also puts the range to average first. This is time per agent, not AHT."
        },
        "cards": {
          "ko": [
            "AVERAGEIFS(",
            "E2:E9",
            ",",
            "C2:C9",
            ",",
            "\"A팀\"",
            ")"
          ],
          "en": [
            "AVERAGEIFS(",
            "E2:E9",
            ",",
            "C2:C9",
            ",",
            "\"Team A\"",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "SUMIFS(",
            "\"B팀\""
          ],
          "en": [
            "SUMIFS(",
            "\"Team B\""
          ]
        },
        "result": {
          "ko": 15722,
          "en": 15722
        }
      }
    ]
  },
  {
    "id": "6",
    "title": {
      "ko": "IF",
      "en": "IF"
    },
    "cards": [
      {
        "ko": "IF(조건, 맞을 때, 틀릴 때)는 조건에 따라 다른 값을 보여 줘요. =IF(D2>=G2, \"달성\", \"미달\")은 김하늘이 목표를 채웠는지 보여 줘요.",
        "en": "IF(condition, if true, if false) shows a different value depending on a condition. =IF(D2>=G2, \"Met\", \"Missed\") shows whether Kim Haneul reached the target."
      },
      {
        "ko": "김하늘은 52건, 목표는 55건이라 \"미달\"이에요. 이 수식을 아래로 채우면 행 번호가 바뀌어 8명 모두 판정돼요. 아무것도 안 보이게 하려면 \"\"(빈 글자)를 써요.",
        "en": "Kim Haneul took 52 calls against a target of 55, so it shows \"Missed\". Fill the formula down and the row numbers change, so all 8 agents are checked. To show nothing, use \"\" (empty text)."
      }
    ],
    "summary": [
      {
        "ko": "IF(조건, 맞을 때, 틀릴 때)",
        "en": "IF(condition, if true, if false)"
      },
      {
        "ko": "비율은 0.8처럼 0~1 사이 값과 견줘요",
        "en": "Compare ratios with values between 0 and 1, like 0.8"
      },
      {
        "ko": "\"\"는 아무것도 안 보이는 빈 글자",
        "en": "\"\" is empty text that shows nothing"
      }
    ],
    "questions": [
      {
        "id": "6-1",
        "type": "choice",
        "prompt": {
          "ko": "=IF(D4>=G4, \"달성\", \"미달\")의 결과는 무엇일까요?",
          "en": "What does =IF(D4>=G4, \"Met\", \"Missed\") return?"
        },
        "explanation": {
          "ko": "박서연은 61건, 목표는 55건이라 조건이 맞아요. 그래서 두 번째 칸의 \"달성\"이 보여요.",
          "en": "Park Seoyeon took 61 calls against a target of 55, so the condition is true and the second slot, \"Met\", shows."
        },
        "options": [
          {
            "ko": "달성",
            "en": "Met"
          },
          {
            "ko": "미달",
            "en": "Missed"
          },
          {
            "ko": "61",
            "en": "61"
          }
        ],
        "answer": 0
      },
      {
        "id": "6-2",
        "type": "choice",
        "prompt": {
          "ko": "IF의 세 칸 가운데 두 번째 칸은 무엇일까요?",
          "en": "What is the second of IF's three slots?"
        },
        "explanation": {
          "ko": "차례는 조건, 맞을 때, 틀릴 때예요.",
          "en": "The order is condition, if true, if false."
        },
        "options": [
          {
            "ko": "조건이 맞을 때 보여 줄 값",
            "en": "The value to show if the condition is true"
          },
          {
            "ko": "조건이 틀릴 때 보여 줄 값",
            "en": "The value to show if the condition is false"
          },
          {
            "ko": "검사할 조건",
            "en": "The condition to check"
          }
        ],
        "answer": 0
      },
      {
        "id": "6-3",
        "type": "blank",
        "prompt": {
          "ko": "이도윤(3행)이 목표를 채웠는지 표시하세요.",
          "en": "Show whether Lee Doyun (row 3) reached the target."
        },
        "explanation": {
          "ko": "목표 \"이상\"이면 달성이라 >=예요. 이도윤은 47건, 목표는 45건이에요.",
          "en": "Reaching the target means \"at least\", so >=. Lee Doyun took 47 calls against a target of 45."
        },
        "template": {
          "ko": "=IF(D3___G3, \"달성\", \"미달\")",
          "en": "=IF(D3___G3, \"Met\", \"Missed\")"
        },
        "chips": [
          {
            "ko": ">=",
            "en": ">="
          },
          {
            "ko": "<=",
            "en": "<="
          },
          {
            "ko": "=",
            "en": "="
          }
        ],
        "answer": 0,
        "result": {
          "ko": "달성",
          "en": "Met"
        }
      },
      {
        "id": "6-4",
        "type": "blank",
        "prompt": {
          "ko": "김하늘의 30초 안 응답 비율이 80% 이상이면 \"좋음\", 아니면 \"점검\"을 보여 주세요.",
          "en": "Show \"Good\" if Kim Haneul's share answered within 30 seconds is 80% or more, otherwise \"Check\"."
        },
        "explanation": {
          "ko": "나누기로 낸 비율은 0~1 사이 값이라 80%는 0.8이에요. 80과 견주면 언제나 \"점검\"이 돼요.",
          "en": "A ratio from a division is between 0 and 1, so 80% is 0.8. Comparing with 80 always gives \"Check\"."
        },
        "template": {
          "ko": "=IF(F2/D2>=___, \"좋음\", \"점검\")",
          "en": "=IF(F2/D2>=___, \"Good\", \"Check\")"
        },
        "chips": [
          {
            "ko": "0.8",
            "en": "0.8"
          },
          {
            "ko": "80",
            "en": "80"
          },
          {
            "ko": "8",
            "en": "8"
          }
        ],
        "answer": 0,
        "result": {
          "ko": "좋음",
          "en": "Good"
        }
      },
      {
        "id": "6-5",
        "type": "build",
        "prompt": {
          "ko": "조수아(8행)가 목표를 채웠으면 \"달성\", 아니면 \"미달\"을 보여 주세요.",
          "en": "Show \"Met\" if Jo Sua (row 8) reached the target, otherwise \"Missed\"."
        },
        "explanation": {
          "ko": "조건 D8>=G8 다음에 맞을 때 \"달성\", 틀릴 때 \"미달\" 차례예요.",
          "en": "After the condition D8>=G8 come \"Met\" if true, then \"Missed\" if false."
        },
        "cards": {
          "ko": [
            "IF(",
            "D8",
            ">=",
            "G8",
            ",",
            "\"달성\"",
            ",",
            "\"미달\"",
            ")"
          ],
          "en": [
            "IF(",
            "D8",
            ">=",
            "G8",
            ",",
            "\"Met\"",
            ",",
            "\"Missed\"",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "<"
          ],
          "en": [
            "<"
          ]
        },
        "result": {
          "ko": "달성",
          "en": "Met"
        }
      },
      {
        "id": "6-6",
        "type": "build",
        "prompt": {
          "ko": "윤시우(9행)의 총 처리 시간이 15000초를 넘으면 \"확인\", 아니면 빈칸을 보여 주세요.",
          "en": "Show \"Review\" if Yoon Siwoo's (row 9) total handle time is over 15000 seconds, otherwise nothing."
        },
        "explanation": {
          "ko": "윤시우는 16000초라 \"확인\"이 보여요. 조건이 틀리면 \"\"이라 칸이 비어 보여요.",
          "en": "Yoon Siwoo has 16000 seconds, so \"Review\" shows. If the condition were false, \"\" would leave the cell looking empty."
        },
        "cards": {
          "ko": [
            "IF(",
            "E9",
            ">",
            "15000",
            ",",
            "\"확인\"",
            ",",
            "\"\"",
            ")"
          ],
          "en": [
            "IF(",
            "E9",
            ">",
            "15000",
            ",",
            "\"Review\"",
            ",",
            "\"\"",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "<"
          ],
          "en": [
            "<"
          ]
        },
        "result": {
          "ko": "확인",
          "en": "Review"
        }
      }
    ]
  },
  {
    "id": "7",
    "title": {
      "ko": "XLOOKUP · VLOOKUP",
      "en": "XLOOKUP · VLOOKUP"
    },
    "cards": [
      {
        "ko": "XLOOKUP(찾을 값, 찾을 범위, 가져올 범위)는 값을 찾아 같은 행의 다른 칸을 가져와요. =XLOOKUP(\"S04\", A2:A9, B2:B9)는 최지호예요.",
        "en": "XLOOKUP(lookup value, lookup range, return range) finds a value and returns another cell from the same row. =XLOOKUP(\"S04\", A2:A9, B2:B9) returns Choi Jiho."
      },
      {
        "ko": "옛 엑셀에는 XLOOKUP이 없어서 VLOOKUP을 써요. =VLOOKUP(\"S04\", A2:G9, 2, FALSE)는 A열에서 S04를 찾아 범위의 2번째 열(이름)을 가져와요. 끝의 FALSE는 정확히 같은 값만 찾으라는 뜻이에요.",
        "en": "Older Excel has no XLOOKUP, so people use VLOOKUP. =VLOOKUP(\"S04\", A2:G9, 2, FALSE) finds S04 in column A and returns the 2nd column of the range (the name). FALSE at the end means \"exact match only\"."
      },
      {
        "ko": "VLOOKUP은 찾을 값이 범위의 맨 왼쪽 열에 있어야 해요. XLOOKUP은 그런 제약이 없어서 쓸 수 있으면 XLOOKUP이 편해요.",
        "en": "VLOOKUP needs the lookup value in the leftmost column of the range. XLOOKUP has no such limit, so use it when you can."
      }
    ],
    "summary": [
      {
        "ko": "XLOOKUP(찾을 값, 찾을 범위, 가져올 범위)",
        "en": "XLOOKUP(lookup value, lookup range, return range)"
      },
      {
        "ko": "VLOOKUP(찾을 값, 표, 열 번호, FALSE)",
        "en": "VLOOKUP(lookup value, table, column number, FALSE)"
      },
      {
        "ko": "VLOOKUP은 찾을 값이 맨 왼쪽 열에",
        "en": "VLOOKUP needs the lookup value in the leftmost column"
      }
    ],
    "questions": [
      {
        "id": "7-1",
        "type": "choice",
        "prompt": {
          "ko": "=XLOOKUP(\"S06\", A2:A9, D2:D9)의 결과는 무엇일까요?",
          "en": "What does =XLOOKUP(\"S06\", A2:A9, D2:D9) return?"
        },
        "explanation": {
          "ko": "S06은 강예준이고, 가져올 범위가 콜 수 D열이라 44예요.",
          "en": "S06 is Kang Yejun, and the return range is the calls in column D, so 44."
        },
        "options": [
          {
            "ko": "44",
            "en": "44"
          },
          {
            "ko": "강예준",
            "en": "Kang Yejun"
          },
          {
            "ko": "6",
            "en": "6"
          }
        ],
        "answer": 0
      },
      {
        "id": "7-2",
        "type": "choice",
        "prompt": {
          "ko": "VLOOKUP의 마지막 칸에 쓰는 FALSE는 무슨 뜻일까요?",
          "en": "What does FALSE mean in VLOOKUP's last slot?"
        },
        "explanation": {
          "ko": "상담사 ID처럼 딱 맞아야 하는 값을 찾을 때는 FALSE를 써요. 빼먹으면 엉뚱한 행을 가져올 수 있어요.",
          "en": "Use FALSE for values that must match exactly, like agent IDs. Leave it out and you may get the wrong row."
        },
        "options": [
          {
            "ko": "정확히 같은 값만 찾기",
            "en": "Exact match only"
          },
          {
            "ko": "비슷한 값도 찾기",
            "en": "Close matches too"
          },
          {
            "ko": "못 찾으면 0 보여 주기",
            "en": "Show 0 if not found"
          }
        ],
        "answer": 0
      },
      {
        "id": "7-3",
        "type": "blank",
        "prompt": {
          "ko": "S07 상담사의 이름을 찾으세요.",
          "en": "Find the name of agent S07."
        },
        "explanation": {
          "ko": "이름은 B열이에요. C열이면 팀, D열이면 콜 수가 나와요.",
          "en": "Names are in column B. Column C gives the team and column D the calls."
        },
        "template": {
          "ko": "=XLOOKUP(\"S07\", A2:A9, ___)",
          "en": "=XLOOKUP(\"S07\", A2:A9, ___)"
        },
        "chips": [
          {
            "ko": "B2:B9",
            "en": "B2:B9"
          },
          {
            "ko": "C2:C9",
            "en": "C2:C9"
          },
          {
            "ko": "D2:D9",
            "en": "D2:D9"
          }
        ],
        "answer": 0,
        "result": {
          "ko": "조수아",
          "en": "Jo Sua"
        }
      },
      {
        "id": "7-4",
        "type": "blank",
        "prompt": {
          "ko": "VLOOKUP으로 S02 상담사의 팀을 찾으세요.",
          "en": "Use VLOOKUP to find agent S02's team."
        },
        "explanation": {
          "ko": "범위 A2:G9에서 팀은 A부터 세어 3번째 열이에요. 2는 이름, 4는 콜 수예요.",
          "en": "In A2:G9 the team is the 3rd column counting from A. 2 is the name and 4 is calls."
        },
        "template": {
          "ko": "=VLOOKUP(\"S02\", A2:G9, ___, FALSE)",
          "en": "=VLOOKUP(\"S02\", A2:G9, ___, FALSE)"
        },
        "chips": [
          {
            "ko": "3",
            "en": "3"
          },
          {
            "ko": "2",
            "en": "2"
          },
          {
            "ko": "4",
            "en": "4"
          }
        ],
        "answer": 0,
        "result": {
          "ko": "B팀",
          "en": "Team B"
        }
      },
      {
        "id": "7-5",
        "type": "build",
        "prompt": {
          "ko": "S05 상담사의 총 처리 시간을 XLOOKUP으로 찾으세요.",
          "en": "Use XLOOKUP to find agent S05's total handle time."
        },
        "explanation": {
          "ko": "찾을 값 \"S05\", ID가 있는 A2:A9, 가져올 처리 시간 E2:E9 차례예요.",
          "en": "The order is the value \"S05\", the ID range A2:A9, then the handle time range E2:E9."
        },
        "cards": {
          "ko": [
            "XLOOKUP(",
            "\"S05\"",
            ",",
            "A2:A9",
            ",",
            "E2:E9",
            ")"
          ],
          "en": [
            "XLOOKUP(",
            "\"S05\"",
            ",",
            "A2:A9",
            ",",
            "E2:E9",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "D2:D9",
            "\"S06\""
          ],
          "en": [
            "D2:D9",
            "\"S06\""
          ]
        },
        "result": {
          "ko": 14850,
          "en": 14850
        }
      },
      {
        "id": "7-6",
        "type": "build",
        "prompt": {
          "ko": "VLOOKUP으로 S08 상담사의 콜 수를 찾으세요.",
          "en": "Use VLOOKUP to find agent S08's calls."
        },
        "explanation": {
          "ko": "콜 수는 A부터 세어 4번째 열이에요. 5를 넣으면 총 처리 시간 16000이 나와요.",
          "en": "Calls are the 4th column counting from A. 5 would return the total handle time, 16000."
        },
        "cards": {
          "ko": [
            "VLOOKUP(",
            "\"S08\"",
            ",",
            "A2:G9",
            ",",
            "4",
            ",",
            "FALSE",
            ")"
          ],
          "en": [
            "VLOOKUP(",
            "\"S08\"",
            ",",
            "A2:G9",
            ",",
            "4",
            ",",
            "FALSE",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "5"
          ],
          "en": [
            "5"
          ]
        },
        "result": {
          "ko": 50,
          "en": 50
        }
      }
    ]
  },
  {
    "id": "8",
    "title": {
      "ko": "시간 계산 (초 → 분:초)",
      "en": "Time (seconds → m:ss)"
    },
    "cards": [
      {
        "ko": "처리 시간은 보통 초로 쌓여요. 김하늘의 평균 처리 시간은 =E2/D2, 15600÷52라서 300초예요.",
        "en": "Handle time usually builds up in seconds. Kim Haneul's average handle time is =E2/D2: 15600 ÷ 52 = 300 seconds."
      },
      {
        "ko": "분은 =INT(초/60), 남은 초는 =MOD(초, 60)으로 구해요. 280초는 4분 40초예요.",
        "en": "Minutes are =INT(seconds/60) and the seconds left over are =MOD(seconds, 60). 280 seconds is 4 minutes 40 seconds."
      },
      {
        "ko": "엑셀은 하루를 1로 세요. 그래서 초를 86400(하루의 초)으로 나누면 시간 값이 되고, =TEXT(E3/D3/86400, \"m:ss\")는 4:40으로 보여 줘요.",
        "en": "Excel counts one day as 1, so seconds divided by 86400 (seconds in a day) become a time value. =TEXT(E3/D3/86400, \"m:ss\") shows 4:40."
      }
    ],
    "summary": [
      {
        "ko": "분 = INT(초/60), 남은 초 = MOD(초, 60)",
        "en": "Minutes = INT(seconds/60), seconds left = MOD(seconds, 60)"
      },
      {
        "ko": "시간 값 = 초 ÷ 86400",
        "en": "Time value = seconds ÷ 86400"
      },
      {
        "ko": "TEXT(시간 값, \"m:ss\")로 4:40처럼",
        "en": "TEXT(time value, \"m:ss\") shows it like 4:40"
      }
    ],
    "questions": [
      {
        "id": "8-1",
        "type": "choice",
        "prompt": {
          "ko": "=INT(330/60)의 결과는 무엇일까요?",
          "en": "What does =INT(330/60) return?"
        },
        "explanation": {
          "ko": "INT는 소수점 아래를 버려요. 330÷60은 5.5라서 5분이에요. 30은 MOD(330, 60)의 결과예요.",
          "en": "INT drops everything after the decimal point. 330 ÷ 60 is 5.5, so 5 minutes. 30 is what MOD(330, 60) returns."
        },
        "options": [
          {
            "ko": "5",
            "en": "5"
          },
          {
            "ko": "5.5",
            "en": "5.5"
          },
          {
            "ko": "30",
            "en": "30"
          }
        ],
        "answer": 0
      },
      {
        "id": "8-2",
        "type": "choice",
        "prompt": {
          "ko": "초를 엑셀 시간 값으로 바꾸려면 무엇으로 나눌까요?",
          "en": "What do you divide seconds by to get an Excel time value?"
        },
        "explanation": {
          "ko": "엑셀의 1은 하루예요. 하루는 24×60×60 = 86400초예요.",
          "en": "In Excel, 1 is one day, and a day is 24 × 60 × 60 = 86400 seconds."
        },
        "options": [
          {
            "ko": "86400",
            "en": "86400"
          },
          {
            "ko": "3600",
            "en": "3600"
          },
          {
            "ko": "60",
            "en": "60"
          }
        ],
        "answer": 0
      },
      {
        "id": "8-3",
        "type": "blank",
        "prompt": {
          "ko": "강예준(7행)의 평균 처리 시간(초)을 구하세요.",
          "en": "Find Kang Yejun's (row 7) average handle time in seconds."
        },
        "explanation": {
          "ko": "콜 한 건당 시간이라 콜 수 D7로 나눠요. 14520÷44 = 330초예요.",
          "en": "It's time per call, so divide by calls, D7: 14520 ÷ 44 = 330 seconds."
        },
        "template": {
          "ko": "=E7/___",
          "en": "=E7/___"
        },
        "chips": [
          {
            "ko": "D7",
            "en": "D7"
          },
          {
            "ko": "G7",
            "en": "G7"
          },
          {
            "ko": "F7",
            "en": "F7"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 330,
          "en": 330
        }
      },
      {
        "id": "8-4",
        "type": "blank",
        "prompt": {
          "ko": "280초에서 분을 빼고 남은 초를 구하세요.",
          "en": "Find the seconds left after taking the whole minutes out of 280 seconds."
        },
        "explanation": {
          "ko": "MOD는 나누고 남은 값이에요. 280초는 4분 40초라 40이 남아요.",
          "en": "MOD is the remainder after dividing. 280 seconds is 4 minutes 40 seconds, so 40 is left."
        },
        "template": {
          "ko": "=___(280, 60)",
          "en": "=___(280, 60)"
        },
        "chips": [
          {
            "ko": "MOD",
            "en": "MOD"
          },
          {
            "ko": "INT",
            "en": "INT"
          },
          {
            "ko": "ROUND",
            "en": "ROUND"
          }
        ],
        "answer": 0,
        "result": {
          "ko": 40,
          "en": 40
        }
      },
      {
        "id": "8-5",
        "type": "build",
        "prompt": {
          "ko": "최지호(5행)의 평균 처리 시간을 분으로 구하세요. 소수점 아래는 버려요.",
          "en": "Find Choi Jiho's (row 5) average handle time in whole minutes, dropping the decimals."
        },
        "explanation": {
          "ko": "12480÷39 = 320초, 다시 60으로 나누면 5.33분이라 INT로 5분이에요.",
          "en": "12480 ÷ 39 = 320 seconds; divided by 60 that's 5.33 minutes, and INT makes it 5."
        },
        "cards": {
          "ko": [
            "INT(",
            "E5",
            "/",
            "D5",
            "/",
            "60",
            ")"
          ],
          "en": [
            "INT(",
            "E5",
            "/",
            "D5",
            "/",
            "60",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "MOD(",
            "3600"
          ],
          "en": [
            "MOD(",
            "3600"
          ]
        },
        "result": {
          "ko": 5,
          "en": 5
        }
      },
      {
        "id": "8-6",
        "type": "build",
        "prompt": {
          "ko": "김하늘(2행)의 평균 처리 시간을 m:ss 모양으로 보여 주세요.",
          "en": "Show Kim Haneul's (row 2) average handle time as m:ss."
        },
        "explanation": {
          "ko": "300초를 86400으로 나눠 시간 값으로 바꾼 뒤 \"m:ss\" 모양으로 보여 줘요.",
          "en": "Divide 300 seconds by 86400 to get a time value, then show it in the \"m:ss\" shape."
        },
        "cards": {
          "ko": [
            "TEXT(",
            "E2",
            "/",
            "D2",
            "/",
            "86400",
            ",",
            "\"m:ss\"",
            ")"
          ],
          "en": [
            "TEXT(",
            "E2",
            "/",
            "D2",
            "/",
            "86400",
            ",",
            "\"m:ss\"",
            ")"
          ]
        },
        "decoys": {
          "ko": [
            "3600"
          ],
          "en": [
            "3600"
          ]
        },
        "result": {
          "ko": "5:00",
          "en": "5:00"
        }
      }
    ]
  },
  {
    "id": "9",
    "title": {
      "ko": "정렬과 필터",
      "en": "Sort and filter"
    },
    "cards": [
      {
        "ko": "정렬은 행의 순서를 바꿔요. 콜 수가 많은 순으로 보려면 콜 수 열을 내림차순으로 정렬해요. 행 전체가 함께 움직여서 이름과 숫자가 어긋나지 않아요.",
        "en": "Sorting changes the order of rows. To see who took the most calls first, sort the calls column largest to smallest. Whole rows move together, so names and numbers stay matched."
      },
      {
        "ko": "필터는 조건에 맞는 행만 보이게 하고 나머지는 숨겨요. 지우는 게 아니라 숨기는 거라 필터를 풀면 다시 보여요.",
        "en": "A filter shows only the rows that meet a condition and hides the rest. It hides rather than deletes, so clearing the filter brings them back."
      },
      {
        "ko": "정렬하기 전에 표 안의 칸 하나를 눌러 두면 엑셀이 표 전체를 알아서 잡아요. 한 열만 골라 정렬하면 다른 열과 짝이 어긋날 수 있어요.",
        "en": "Before sorting, tap one cell inside the table and Excel picks up the whole table. Sorting a single selected column can pull it out of line with the others."
      }
    ],
    "summary": [
      {
        "ko": "정렬 = 행의 순서 바꾸기 (데이터 › 정렬)",
        "en": "Sort = change the order of rows (Data › Sort)"
      },
      {
        "ko": "필터 = 조건에 맞는 행만 보이기 (지우지 않고 숨김)",
        "en": "Filter = show only matching rows (hidden, not deleted)"
      },
      {
        "ko": "정렬 전에 표 안의 칸 하나를 눌러 두기",
        "en": "Tap a cell inside the table before sorting"
      }
    ],
    "questions": [
      {
        "id": "9-1",
        "type": "choice",
        "prompt": {
          "ko": "콜을 많이 받은 상담사부터 보려면 콜 수를 어떻게 정렬할까요?",
          "en": "To see the agents who took the most calls first, how do you sort calls?"
        },
        "explanation": {
          "ko": "큰 값에서 작은 값으로 가는 것이 내림차순이에요. 오름차순이면 적게 받은 사람부터 나와요.",
          "en": "Going from big values to small is \"Largest to Smallest\". The other way shows the fewest calls first."
        },
        "options": [
          {
            "ko": "내림차순",
            "en": "Largest to Smallest"
          },
          {
            "ko": "오름차순",
            "en": "Smallest to Largest"
          },
          {
            "ko": "이름순",
            "en": "By name"
          }
        ],
        "answer": 0
      },
      {
        "id": "9-2",
        "type": "choice",
        "prompt": {
          "ko": "필터로 B팀만 보이게 하면 A팀 행은 어떻게 될까요?",
          "en": "If you filter to show only Team B, what happens to Team A's rows?"
        },
        "explanation": {
          "ko": "필터는 행을 숨길 뿐이에요. 필터를 풀면 A팀 행이 그대로 다시 보여요.",
          "en": "A filter only hides rows. Clear it and Team A's rows show again, unchanged."
        },
        "options": [
          {
            "ko": "숨겨진다",
            "en": "They're hidden"
          },
          {
            "ko": "지워진다",
            "en": "They're deleted"
          },
          {
            "ko": "맨 아래로 옮겨진다",
            "en": "They move to the bottom"
          }
        ],
        "answer": 0
      },
      {
        "id": "9-3",
        "type": "blank",
        "prompt": {
          "ko": "정렬과 필터는 어느 탭에 있을까요?",
          "en": "Which tab has Sort and Filter?"
        },
        "explanation": {
          "ko": "정렬과 필터는 데이터 탭에 있어요. 피벗 테이블은 삽입, 조건부 서식은 홈 탭이에요.",
          "en": "Sort and Filter are on the Data tab. PivotTable is on Insert and Conditional Formatting is on Home."
        },
        "template": {
          "ko": "___ › 정렬",
          "en": "___ › Sort"
        },
        "chips": [
          {
            "ko": "데이터",
            "en": "Data"
          },
          {
            "ko": "삽입",
            "en": "Insert"
          },
          {
            "ko": "홈",
            "en": "Home"
          }
        ],
        "answer": 0
      },
      {
        "id": "9-4",
        "type": "blank",
        "prompt": {
          "ko": "처리 시간이 짧은 상담사부터 보려면 E열을 어떻게 정렬할까요?",
          "en": "To see the shortest handle times first, how do you sort column E?"
        },
        "explanation": {
          "ko": "짧은 시간(작은 값)부터 보려면 오름차순이에요.",
          "en": "To see short times (small values) first, sort Smallest to Largest."
        },
        "template": {
          "ko": "정렬: ___",
          "en": "Order: ___"
        },
        "chips": [
          {
            "ko": "오름차순",
            "en": "Smallest to Largest"
          },
          {
            "ko": "내림차순",
            "en": "Largest to Smallest"
          },
          {
            "ko": "사용자 지정 목록",
            "en": "Custom List"
          }
        ],
        "answer": 0
      },
      {
        "id": "9-5",
        "type": "steps",
        "prompt": {
          "ko": "콜 수가 많은 순으로 표를 정렬하세요.",
          "en": "Sort the table by calls, most first."
        },
        "explanation": {
          "ko": "표 안을 누르고 데이터 › 정렬에서 기준 열과 차례를 고른 뒤 확인을 눌러요.",
          "en": "Tap inside the table, choose the column and order in Data › Sort, then press OK."
        },
        "steps": {
          "ko": [
            "표 안의 칸 하나 누르기",
            "데이터 › 정렬",
            "정렬 기준: 콜",
            "정렬: 내림차순",
            "확인"
          ],
          "en": [
            "Tap a cell inside the table",
            "Data › Sort",
            "Sort by: Calls",
            "Order: Largest to Smallest",
            "OK"
          ]
        },
        "anyOrder": [],
        "decoys": {
          "ko": [
            "삽입 › 피벗 테이블",
            "정렬: 오름차순"
          ],
          "en": [
            "Insert › PivotTable",
            "Order: Smallest to Largest"
          ]
        },
        "after": {
          "sort": "D",
          "desc": true
        }
      },
      {
        "id": "9-6",
        "type": "steps",
        "prompt": {
          "ko": "B팀 상담사만 보이게 필터를 거세요.",
          "en": "Filter the table to show only Team B's agents."
        },
        "explanation": {
          "ko": "필터를 켜면 머리글에 ▼가 생겨요. 보고 싶지 않은 \"A팀\"의 체크를 풀어요.",
          "en": "Turning on the filter adds a ▼ to each header. Untick \"Team A\", which you don't want to see."
        },
        "steps": {
          "ko": [
            "표 안의 칸 하나 누르기",
            "데이터 › 필터",
            "팀 머리글의 ▼ 누르기",
            "\"A팀\" 체크 해제",
            "확인"
          ],
          "en": [
            "Tap a cell inside the table",
            "Data › Filter",
            "Tap the ▼ on the Team header",
            "Untick \"Team A\"",
            "OK"
          ]
        },
        "anyOrder": [],
        "decoys": {
          "ko": [
            "홈 › 조건부 서식",
            "\"B팀\" 체크 해제"
          ],
          "en": [
            "Home › Conditional Formatting",
            "Untick \"Team B\""
          ]
        },
        "after": {
          "filter": {
            "col": "C",
            "keep": {
              "ko": "B팀",
              "en": "Team B"
            }
          }
        }
      }
    ]
  },
  {
    "id": "10",
    "title": {
      "ko": "피벗 테이블",
      "en": "PivotTables"
    },
    "cards": [
      {
        "ko": "피벗 테이블은 긴 표를 팀별, 사유별로 한 번에 요약해 줘요. 수식을 쓰지 않고도 SUMIFS 같은 합계를 만들 수 있어요.",
        "en": "A PivotTable summarizes a long table by team, reason and so on, all at once. It makes totals like SUMIFS without writing formulas."
      },
      {
        "ko": "필드를 \"행\"에 놓으면 그 값마다 줄이 생기고, \"값\"에 놓으면 합계가 계산돼요. 팀을 행에, 콜 수를 값에 놓으면 A팀 276, B팀 130이 나와요(예시).",
        "en": "Put a field in \"Rows\" and you get a row for each of its values; put one in \"Values\" and it's totaled. Team in Rows and Calls in Values gives Team A 276 and Team B 130 (example)."
      },
      {
        "ko": "원본 표가 바뀌어도 피벗 테이블은 저절로 바뀌지 않아요. 피벗 테이블 안을 누르고 \"새로 고침\"을 해야 숫자가 바뀌어요.",
        "en": "A PivotTable doesn't update by itself when the source table changes. Tap inside it and choose Refresh to update the numbers."
      }
    ],
    "summary": [
      {
        "ko": "피벗 테이블 = 수식 없이 만드는 요약표 (삽입 › 피벗 테이블)",
        "en": "PivotTable = a summary without formulas (Insert › PivotTable)"
      },
      {
        "ko": "행에는 나눌 기준, 값에는 셀 숫자",
        "en": "Rows hold what to split by; Values hold what to total"
      },
      {
        "ko": "원본이 바뀌면 새로 고침",
        "en": "When the source changes, Refresh"
      }
    ],
    "questions": [
      {
        "id": "10-1",
        "type": "choice",
        "prompt": {
          "ko": "팀별 콜 수 합계 피벗 테이블에서 \"팀\" 필드는 어디에 놓을까요?",
          "en": "In a PivotTable of calls by team, where does the \"Team\" field go?"
        },
        "explanation": {
          "ko": "팀마다 한 줄씩 보려면 행이에요. 값에는 더할 숫자인 콜 수를 놓아요.",
          "en": "To get one row per team, use Rows. Values holds the numbers to add up: Calls."
        },
        "options": [
          {
            "ko": "행",
            "en": "Rows"
          },
          {
            "ko": "값",
            "en": "Values"
          },
          {
            "ko": "필터",
            "en": "Filters"
          }
        ],
        "answer": 0
      },
      {
        "id": "10-2",
        "type": "choice",
        "prompt": {
          "ko": "원본 표에서 콜 수를 고쳤어요. 피벗 테이블 숫자를 바꾸려면 어떻게 할까요?",
          "en": "You changed a call count in the source table. How do you update the PivotTable?"
        },
        "explanation": {
          "ko": "피벗 테이블은 새로 고침을 눌러야 원본을 다시 읽어요. 다시 만들 필요는 없어요.",
          "en": "A PivotTable reads the source again only when you refresh it. No need to rebuild it."
        },
        "options": [
          {
            "ko": "피벗 테이블 안에서 새로 고침",
            "en": "Refresh inside the PivotTable"
          },
          {
            "ko": "할 일 없음, 저절로 바뀜",
            "en": "Nothing; it updates itself"
          },
          {
            "ko": "피벗 테이블을 지우고 다시 만들어야만 함",
            "en": "Delete it and build it again"
          }
        ],
        "answer": 0
      },
      {
        "id": "10-3",
        "type": "blank",
        "prompt": {
          "ko": "피벗 테이블은 어느 탭에서 만들까요?",
          "en": "Which tab do you make a PivotTable from?"
        },
        "explanation": {
          "ko": "피벗 테이블은 새로 끼워 넣는 것이라 삽입 탭에 있어요.",
          "en": "A PivotTable is something you insert, so it's on the Insert tab."
        },
        "template": {
          "ko": "___ › 피벗 테이블",
          "en": "___ › PivotTable"
        },
        "chips": [
          {
            "ko": "삽입",
            "en": "Insert"
          },
          {
            "ko": "데이터",
            "en": "Data"
          },
          {
            "ko": "홈",
            "en": "Home"
          }
        ],
        "answer": 0
      },
      {
        "id": "10-4",
        "type": "blank",
        "prompt": {
          "ko": "팀별 평균 콜 수를 보려면 값 필드 설정을 무엇으로 바꿀까요?",
          "en": "To see each team's average calls, what do you change the value field setting to?"
        },
        "explanation": {
          "ko": "숫자 필드는 처음에 합계로 나와요. 평균으로 바꾸면 A팀 55.2, B팀 약 43.3이 돼요.",
          "en": "A number field starts as Sum. Change it to Average and you get Team A 55.2 and Team B about 43.3."
        },
        "template": {
          "ko": "값 요약 기준: ___",
          "en": "Summarize value field by: ___"
        },
        "chips": [
          {
            "ko": "평균",
            "en": "Average"
          },
          {
            "ko": "합계",
            "en": "Sum"
          },
          {
            "ko": "개수",
            "en": "Count"
          }
        ],
        "answer": 0
      },
      {
        "id": "10-5",
        "type": "steps",
        "prompt": {
          "ko": "팀별 콜 수 합계 피벗 테이블을 만드세요.",
          "en": "Make a PivotTable of total calls by team."
        },
        "explanation": {
          "ko": "범위를 확인해 피벗 테이블을 만든 뒤, 팀은 행에, 콜은 값에 놓아요. 두 필드는 어느 쪽을 먼저 놓아도 돼요.",
          "en": "Check the range to create the PivotTable, then put Team in Rows and Calls in Values. Either field can go first."
        },
        "steps": {
          "ko": [
            "표 안의 칸 하나 누르기",
            "삽입 › 피벗 테이블",
            "범위 확인 후 확인",
            "\"팀\"을 행으로",
            "\"콜\"을 값으로"
          ],
          "en": [
            "Tap a cell inside the table",
            "Insert › PivotTable",
            "Check the range, then OK",
            "Put \"Team\" in Rows",
            "Put \"Calls\" in Values"
          ]
        },
        "anyOrder": [
          [
            3,
            4
          ]
        ],
        "decoys": {
          "ko": [
            "\"팀\"을 값으로",
            "데이터 › 정렬"
          ],
          "en": [
            "Put \"Team\" in Values",
            "Data › Sort"
          ]
        },
        "after": {
          "pivot": {
            "rows": "C",
            "value": "D",
            "fn": "sum",
            "head": {
              "ko": [
                "팀",
                "합계: 콜"
              ],
              "en": [
                "Team",
                "Sum of Calls"
              ]
            },
            "total": {
              "ko": "총합계",
              "en": "Grand Total"
            }
          }
        }
      },
      {
        "id": "10-6",
        "type": "steps",
        "prompt": {
          "ko": "팀별 상담사 수를 세는 피벗 테이블을 만드세요.",
          "en": "Make a PivotTable that counts agents by team."
        },
        "explanation": {
          "ko": "글자 필드를 값에 놓으면 개수로 세요. 콜을 값에 놓으면 합계가 나와 사람 수가 아니게 돼요.",
          "en": "A text field in Values is counted. Calls in Values would be summed, which isn't a headcount."
        },
        "steps": {
          "ko": [
            "표 안의 칸 하나 누르기",
            "삽입 › 피벗 테이블",
            "범위 확인 후 확인",
            "\"팀\"을 행으로",
            "\"이름\"을 값으로"
          ],
          "en": [
            "Tap a cell inside the table",
            "Insert › PivotTable",
            "Check the range, then OK",
            "Put \"Team\" in Rows",
            "Put \"Name\" in Values"
          ]
        },
        "anyOrder": [
          [
            3,
            4
          ]
        ],
        "decoys": {
          "ko": [
            "\"콜\"을 값으로",
            "홈 › 조건부 서식"
          ],
          "en": [
            "Put \"Calls\" in Values",
            "Home › Conditional Formatting"
          ]
        },
        "after": {
          "pivot": {
            "rows": "C",
            "value": "B",
            "fn": "count",
            "head": {
              "ko": [
                "팀",
                "개수: 이름"
              ],
              "en": [
                "Team",
                "Count of Name"
              ]
            },
            "total": {
              "ko": "총합계",
              "en": "Grand Total"
            }
          }
        }
      }
    ]
  },
  {
    "id": "11",
    "title": {
      "ko": "조건부 서식",
      "en": "Conditional formatting"
    },
    "cards": [
      {
        "ko": "조건부 서식은 조건에 맞는 칸에 색을 칠해 줘요. 목표에 못 미친 콜 수를 빨갛게 칠하면 한눈에 보여요.",
        "en": "Conditional formatting colors the cells that meet a condition. Color call counts below target red and they stand out at a glance."
      },
      {
        "ko": "홈 › 조건부 서식 › 셀 강조 규칙에서 \"보다 작음\", \"보다 큼\" 같은 규칙을 골라요. 값이 바뀌면 색도 저절로 바뀌어요.",
        "en": "In Home › Conditional Formatting › Highlight Cells Rules, pick a rule such as \"Less Than\" or \"Greater Than\". When the values change, the colors change by themselves."
      },
      {
        "ko": "사람마다 목표가 다르면 수식으로 규칙을 만들어요. 콜 수 칸을 고르고 수식 =D2<G2를 쓰면 행마다 자기 목표와 견줘요.",
        "en": "When each agent has a different target, use a formula rule. Select the call cells and use =D2<G2, and each row is compared with its own target."
      }
    ],
    "summary": [
      {
        "ko": "조건부 서식 = 조건에 맞는 칸에 색 (홈 › 조건부 서식)",
        "en": "Conditional formatting = color cells that meet a condition (Home › Conditional Formatting)"
      },
      {
        "ko": "값이 바뀌면 색도 저절로 바뀜",
        "en": "When values change, colors follow"
      },
      {
        "ko": "목표가 사람마다 다르면 수식 규칙 =D2<G2",
        "en": "Different targets per person: formula rule =D2<G2"
      }
    ],
    "questions": [
      {
        "id": "11-1",
        "type": "choice",
        "prompt": {
          "ko": "조건부 서식을 쓴 칸의 값이 바뀌면 색은 어떻게 될까요?",
          "en": "When a cell with conditional formatting changes value, what happens to its color?"
        },
        "explanation": {
          "ko": "조건부 서식은 값을 볼 때마다 조건을 다시 확인해요. 그래서 매일 바뀌는 보고서에 쓰기 좋아요.",
          "en": "Conditional formatting checks the condition again every time. That's why it suits reports that change daily."
        },
        "options": [
          {
            "ko": "새 값에 맞게 저절로 바뀐다",
            "en": "It updates to match the new value"
          },
          {
            "ko": "처음 색이 그대로 남는다",
            "en": "It keeps its first color"
          },
          {
            "ko": "서식이 지워진다",
            "en": "The formatting is removed"
          }
        ],
        "answer": 0
      },
      {
        "id": "11-2",
        "type": "choice",
        "prompt": {
          "ko": "콜 수가 45보다 작은 칸을 칠하면 몇 칸이 칠해질까요?",
          "en": "If you color call counts less than 45, how many cells get colored?"
        },
        "explanation": {
          "ko": "최지호(39)와 강예준(44) 두 칸이에요. 45는 \"보다 작음\"에 들어가지 않아요.",
          "en": "Choi Jiho (39) and Kang Yejun (44). 45 itself isn't \"less than\" 45."
        },
        "options": [
          {
            "ko": "2칸",
            "en": "2 cells"
          },
          {
            "ko": "3칸",
            "en": "3 cells"
          },
          {
            "ko": "1칸",
            "en": "1 cell"
          }
        ],
        "answer": 0
      },
      {
        "id": "11-3",
        "type": "blank",
        "prompt": {
          "ko": "조건부 서식은 어느 탭에 있을까요?",
          "en": "Which tab has Conditional Formatting?"
        },
        "explanation": {
          "ko": "글꼴, 색과 같은 모양을 바꾸는 메뉴라 홈 탭에 있어요.",
          "en": "It changes how cells look, like fonts and colors, so it's on the Home tab."
        },
        "template": {
          "ko": "___ › 조건부 서식",
          "en": "___ › Conditional Formatting"
        },
        "chips": [
          {
            "ko": "홈",
            "en": "Home"
          },
          {
            "ko": "데이터",
            "en": "Data"
          },
          {
            "ko": "삽입",
            "en": "Insert"
          }
        ],
        "answer": 0
      },
      {
        "id": "11-4",
        "type": "blank",
        "prompt": {
          "ko": "자기 목표에 못 미친 콜 수 칸을 칠하는 수식 규칙을 완성하세요. (2행 김하늘 기준)",
          "en": "Complete the formula rule that colors call counts below each agent's own target (for Kim Haneul in row 2)."
        },
        "explanation": {
          "ko": "미달은 목표보다 작다는 뜻이라 <예요. 김하늘은 52 < 55라서 TRUE, 이 칸이 칠해져요.",
          "en": "Below target means less than the target, so <. Kim Haneul has 52 < 55, which is TRUE, so this cell is colored."
        },
        "template": {
          "ko": "=D2___G2",
          "en": "=D2___G2"
        },
        "chips": [
          {
            "ko": "<",
            "en": "<"
          },
          {
            "ko": ">",
            "en": ">"
          },
          {
            "ko": "=",
            "en": "="
          }
        ],
        "answer": 0,
        "result": {
          "ko": true,
          "en": true
        }
      },
      {
        "id": "11-5",
        "type": "steps",
        "prompt": {
          "ko": "콜 수가 45보다 작은 칸을 빨갛게 칠하세요.",
          "en": "Color call counts less than 45 red."
        },
        "explanation": {
          "ko": "칠할 칸을 먼저 고르고, 규칙과 기준 값, 색을 차례로 정해요.",
          "en": "Select the cells first, then choose the rule, the value and the color in turn."
        },
        "steps": {
          "ko": [
            "D2:D9 고르기",
            "홈 › 조건부 서식",
            "셀 강조 규칙 › 보다 작음",
            "값에 45",
            "빨강 서식 고르고 확인"
          ],
          "en": [
            "Select D2:D9",
            "Home › Conditional Formatting",
            "Highlight Cells Rules › Less Than",
            "Enter 45",
            "Pick red formatting, then OK"
          ]
        },
        "anyOrder": [],
        "decoys": {
          "ko": [
            "셀 강조 규칙 › 보다 큼",
            "데이터 › 필터"
          ],
          "en": [
            "Highlight Cells Rules › Greater Than",
            "Data › Filter"
          ]
        },
        "after": {
          "highlight": {
            "col": "D",
            "lt": 45
          }
        }
      },
      {
        "id": "11-6",
        "type": "steps",
        "prompt": {
          "ko": "자기 목표에 못 미친 콜 수 칸을 칠하세요. 사람마다 목표가 달라요.",
          "en": "Color call counts below each agent's own target. Each agent has a different target."
        },
        "explanation": {
          "ko": "첫 칸 D2 기준으로 =D2<G2를 쓰면 행마다 자기 목표와 견줘요. G9로 고정하면 모두 윤시우의 목표와만 견줘요.",
          "en": "Written for the first cell, =D2<G2 compares each row with its own target. Locking it to G9 compares everyone with Yoon Siwoo's target."
        },
        "steps": {
          "ko": [
            "D2:D9 고르기",
            "홈 › 조건부 서식",
            "새 규칙",
            "수식을 사용하여 서식을 지정할 셀 결정",
            "수식 =D2<G2 넣고 서식 고르기",
            "확인"
          ],
          "en": [
            "Select D2:D9",
            "Home › Conditional Formatting",
            "New Rule",
            "Use a formula to determine which cells to format",
            "Enter =D2<G2 and pick a format",
            "OK"
          ]
        },
        "anyOrder": [],
        "decoys": {
          "ko": [
            "수식 =D2<G9 넣고 서식 고르기",
            "셀 강조 규칙 › 보다 작음"
          ],
          "en": [
            "Enter =D2<G9 and pick a format",
            "Highlight Cells Rules › Less Than"
          ]
        },
        "after": {
          "highlight": {
            "col": "D",
            "ltCol": "G"
          }
        }
      }
    ]
  }
];
