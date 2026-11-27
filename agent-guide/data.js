// Agent Situation Guide (2026-11-27): situations and where they lead. The Korean is
// the approved table in docs/superpowers/specs/2026-11-27-agent-guide-design.md §5;
// agent-lifecycle/tests/agent-guide.test.js keeps the two identical. The screen's
// other words are the team-lead guide's.
import { GUIDE_UI } from '../guide/data.js';

export const AGENT_GUIDE_UI = { ...GUIDE_UI, ...{
  "title": {
    "ko": "상담사 상황별 길잡이",
    "en": "Agent Situation Guide"
  },
  "intro": {
    "ko": "지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다.",
    "en": "What's happening right now? Tap a situation to see where to look first and where to go next."
  }
} };

export const AGENT_GROUPS = [
  {
    "id": "start",
    "chip": {
      "ko": "첫 출근·교육",
      "en": "First days and training"
    },
    "heading": {
      "ko": "첫 출근과 교육",
      "en": "Your first days and training"
    },
    "situations": [
      {
        "id": "a1",
        "text": {
          "ko": "오늘 첫 출근이다",
          "en": "It's your first day at work"
        },
        "first": {
          "title": {
            "ko": "상담사 첫걸음 레슨 1 · 첫 출근",
            "en": "Agent First Steps lesson 1 · Your First Day at Work"
          },
          "href": "../agent/#start-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ④ 상담사의 하루",
            "en": "Codex one-pager ④ An agent's day"
          },
          "href": "../codex/#daily-agent"
        }
      },
      {
        "id": "a2",
        "text": {
          "ko": "교육 내용이 너무 많아 무엇부터 잡을지 모르겠다",
          "en": "Training throws too much at you at once, and you don't know where to start"
        },
        "first": {
          "title": {
            "ko": "상담사 첫걸음 레슨 2 · 교육을 버티는 법",
            "en": "Agent First Steps lesson 2 · Getting Through Training"
          },
          "href": "../agent/#training-0"
        },
        "then": {
          "title": {
            "ko": "상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법",
            "en": "Agent First Steps lesson 3 · OJT and Nesting: How to Ask"
          },
          "href": "../agent/#nesting-0"
        }
      },
      {
        "id": "a3",
        "text": {
          "ko": "OJT·네스팅 중 막혔는데 누구에게 물을지 모르겠다",
          "en": "You're stuck during OJT or nesting and don't know whom to ask"
        },
        "first": {
          "title": {
            "ko": "상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법",
            "en": "Agent First Steps lesson 3 · OJT and Nesting: How to Ask"
          },
          "href": "../agent/#nesting-0"
        },
        "then": {
          "title": {
            "ko": "상담사 SOP · 에스컬레이션 요청하기",
            "en": "Agent SOP · Requesting an Escalation"
          },
          "href": "../agent-sop/#request-0"
        }
      }
    ]
  },
  {
    "id": "customers",
    "chip": {
      "ko": "고객 응대",
      "en": "Handling customers"
    },
    "heading": {
      "ko": "고객 응대",
      "en": "Handling customers"
    },
    "situations": [
      {
        "id": "a4",
        "text": {
          "ko": "실전 배치 뒤 혼자 받는 첫 콜이 겁난다",
          "en": "You've gone live and your first solo call scares you"
        },
        "first": {
          "title": {
            "ko": "상담사 첫걸음 레슨 4 · 실전 배치와 첫 콜",
            "en": "Agent First Steps lesson 4 · Go Live and the First Call"
          },
          "href": "../agent/#golive-0"
        },
        "then": {
          "title": {
            "ko": "상담사 첫걸음 레슨 5 · 어려운 고객",
            "en": "Agent First Steps lesson 5 · Difficult Customers"
          },
          "href": "../agent/#customers-0"
        }
      },
      {
        "id": "a5",
        "text": {
          "ko": "고객이 화가 나서 언성을 높인다",
          "en": "A customer is angry and raising their voice"
        },
        "first": {
          "title": {
            "ko": "상담사 첫걸음 레슨 5 · 어려운 고객",
            "en": "Agent First Steps lesson 5 · Difficult Customers"
          },
          "href": "../agent/#customers-0"
        },
        "then": {
          "title": {
            "ko": "상담사 SOP · 욕설·폭언 고객 응대와 통화 종료",
            "en": "Agent SOP · Handling Abusive Callers and Ending the Call"
          },
          "href": "../agent-sop/#abuse-0"
        }
      },
      {
        "id": "a6",
        "text": {
          "ko": "고객이 욕설을 계속한다",
          "en": "A customer keeps swearing at you"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 욕설·폭언 고객 응대와 통화 종료",
            "en": "Agent SOP · Handling Abusive Callers and Ending the Call"
          },
          "href": "../agent-sop/#abuse-0"
        },
        "then": {
          "title": {
            "ko": "상담사 첫걸음 레슨 5 · 어려운 고객",
            "en": "Agent First Steps lesson 5 · Difficult Customers"
          },
          "href": "../agent/#customers-0"
        }
      },
      {
        "id": "a7",
        "text": {
          "ko": "내 권한으로 해결할 수 없는 요청이다",
          "en": "A customer asks for something you aren't authorized to do"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 에스컬레이션 요청하기",
            "en": "Agent SOP · Requesting an Escalation"
          },
          "href": "../agent-sop/#request-0"
        },
        "then": {
          "title": {
            "ko": "상담사 첫걸음 레슨 3 · OJT와 네스팅: 묻는 법",
            "en": "Agent First Steps lesson 3 · OJT and Nesting: How to Ask"
          },
          "href": "../agent/#nesting-0"
        }
      }
    ]
  },
  {
    "id": "system",
    "chip": {
      "ko": "시스템·지식",
      "en": "Systems and knowledge"
    },
    "heading": {
      "ko": "시스템과 지식",
      "en": "Systems and knowledge"
    },
    "situations": [
      {
        "id": "a8",
        "text": {
          "ko": "시스템이 계속 오류를 낸다",
          "en": "The system keeps throwing errors"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 시스템 장애 때 대응",
            "en": "Agent SOP · Responding to a System Outage"
          },
          "href": "../agent-sop/#outage-0"
        },
        "then": {
          "title": {
            "ko": "상담사 SOP · 에스컬레이션 요청하기",
            "en": "Agent SOP · Requesting an Escalation"
          },
          "href": "../agent-sop/#request-0"
        }
      },
      {
        "id": "a9",
        "text": {
          "ko": "지식 베이스 내용이 허들에서 들은 것과 다르다",
          "en": "The knowledge base says something different from what you heard in the huddle"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 지식 베이스 오류 알리기",
            "en": "Agent SOP · Reporting a Knowledge Base Error"
          },
          "href": "../agent-sop/#kbreport-0"
        },
        "then": {
          "title": {
            "ko": "상담사 SOP · 고객사 업데이트 허들 듣고 적용하기",
            "en": "Agent SOP · Applying a Client Update from the Huddle"
          },
          "href": "../agent-sop/#huddle-0"
        }
      },
      {
        "id": "a10",
        "text": {
          "ko": "쉬는 날 고객사 업데이트 허들이 있었다",
          "en": "There was a client update huddle on your day off"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 고객사 업데이트 허들 듣고 적용하기",
            "en": "Agent SOP · Applying a Client Update from the Huddle"
          },
          "href": "../agent-sop/#huddle-0"
        },
        "then": {
          "title": {
            "ko": "상담사 SOP · 지식 베이스 오류 알리기",
            "en": "Agent SOP · Reporting a Knowledge Base Error"
          },
          "href": "../agent-sop/#kbreport-0"
        }
      }
    ]
  },
  {
    "id": "score",
    "chip": {
      "ko": "평가·피드백",
      "en": "Scores and feedback"
    },
    "heading": {
      "ko": "평가와 피드백",
      "en": "Scores and feedback"
    },
    "situations": [
      {
        "id": "a11",
        "text": {
          "ko": "이번 주 평가 점수가 낮게 나왔다",
          "en": "Your quality score was low this week"
        },
        "first": {
          "title": {
            "ko": "상담사 첫걸음 레슨 6 · 매주 평가 리뷰",
            "en": "Agent First Steps lesson 6 · The Weekly Score Review"
          },
          "href": "../agent/#review-0"
        },
        "then": {
          "title": {
            "ko": "상담사 SOP · 스크러빙 피드백 받고 고치기",
            "en": "Agent SOP · Taking Scrubbing Feedback and Fixing It"
          },
          "href": "../agent-sop/#scrubfb-0"
        }
      },
      {
        "id": "a12",
        "text": {
          "ko": "직무전문가에게 스크러빙 피드백을 받았다",
          "en": "An SME gave you scrubbing feedback"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 스크러빙 피드백 받고 고치기",
            "en": "Agent SOP · Taking Scrubbing Feedback and Fixing It"
          },
          "href": "../agent-sop/#scrubfb-0"
        },
        "then": {
          "title": {
            "ko": "상담사 첫걸음 레슨 6 · 매주 평가 리뷰",
            "en": "Agent First Steps lesson 6 · The Weekly Score Review"
          },
          "href": "../agent/#review-0"
        }
      },
      {
        "id": "a13",
        "text": {
          "ko": "감점이 부당하다고 생각한다",
          "en": "You think you lost points unfairly"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 평가 결과 이의 제기",
            "en": "Agent SOP · Disputing a Quality Score"
          },
          "href": "../agent-sop/#dispute-0"
        },
        "then": {
          "title": {
            "ko": "상담사 첫걸음 레슨 6 · 매주 평가 리뷰",
            "en": "Agent First Steps lesson 6 · The Weekly Score Review"
          },
          "href": "../agent/#review-0"
        }
      }
    ]
  },
  {
    "id": "growth",
    "chip": {
      "ko": "근태·성장",
      "en": "Attendance and growth"
    },
    "heading": {
      "ko": "근태와 성장",
      "en": "Attendance and growth"
    },
    "situations": [
      {
        "id": "a14",
        "text": {
          "ko": "아파서 내일 출근하기 어렵다",
          "en": "You're sick and may not make it in tomorrow"
        },
        "first": {
          "title": {
            "ko": "상담사 SOP · 결근·병가 알리기",
            "en": "Agent SOP · Reporting an Absence or Sick Day"
          },
          "href": "../agent-sop/#absence-0"
        },
        "then": {
          "title": {
            "ko": "상담사 첫걸음 레슨 7 · 근태와 스케줄",
            "en": "Agent First Steps lesson 7 · Attendance and Schedules"
          },
          "href": "../agent/#attendance-0"
        }
      },
      {
        "id": "a15",
        "text": {
          "ko": "직무전문가가 되고 싶다",
          "en": "You want to become an SME"
        },
        "first": {
          "title": {
            "ko": "상담사 커리어 라이프사이클 레슨 1 · 직무전문가 준비",
            "en": "Agent Career Lifecycle lesson 1 · Getting Ready to Be an SME"
          },
          "href": "../agent-career/#ready-0"
        },
        "then": {
          "title": {
            "ko": "상담사 커리어 라이프사이클 레슨 2 · 직무전문가",
            "en": "Agent Career Lifecycle lesson 2 · SME"
          },
          "href": "../agent-career/#sme-0"
        }
      },
      {
        "id": "a16",
        "text": {
          "ko": "언젠가 팀장이 되고 싶다",
          "en": "You want to become a team leader someday"
        },
        "first": {
          "title": {
            "ko": "상담사 커리어 라이프사이클 레슨 3 · 팀장 준비",
            "en": "Agent Career Lifecycle lesson 3 · Getting Ready to Be a Team Leader"
          },
          "href": "../agent-career/#tlprep-0"
        },
        "then": {
          "title": {
            "ko": "상담사 커리어 라이프사이클 레슨 4 · 팀장",
            "en": "Agent Career Lifecycle lesson 4 · Team Leader"
          },
          "href": "../agent-career/#tl-0"
        }
      }
    ]
  }
];
