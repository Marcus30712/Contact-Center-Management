// Situations and where they lead. The Korean is the confirmed table in
// docs/superpowers/specs/2026-11-19-situation-guide-design.md; the test
// agent-lifecycle/tests/guide.test.js keeps the two identical.
export const GUIDE_UI = {
  "title": {
    "ko": "팀장 상황별 길잡이",
    "en": "Team Lead Situation Guide"
  },
  "intro": {
    "ko": "지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다.",
    "en": "What's happening right now? Tap a situation to see where to look first and where to go next."
  },
  "all": {
    "ko": "전체",
    "en": "All"
  },
  "first": {
    "ko": "먼저 볼 곳",
    "en": "Look here first"
  },
  "then": {
    "ko": "이어서 볼 곳",
    "en": "Then go here"
  },
  "chips": {
    "ko": "묶음 고르기",
    "en": "Choose a group"
  }
};

export const GROUPS = [
  {
    "id": "member",
    "chip": {
      "ko": "팀원 한 명",
      "en": "One team member"
    },
    "heading": {
      "ko": "팀원 한 명의 성과와 마음",
      "en": "One team member: performance and morale"
    },
    "situations": [
      {
        "id": "s1",
        "text": {
          "ko": "팀원 한 명의 숫자(AHT, CSAT 등)가 몇 주째 떨어진다",
          "en": "One team member's numbers (AHT, CSAT and so on) have been slipping for weeks"
        },
        "first": {
          "title": {
            "ko": "SOP · 1:1 코칭",
            "en": "SOP · One-on-One Coaching"
          },
          "href": "../sop-library/#coaching-0"
        },
        "then": {
          "title": {
            "ko": "라이프사이클 레슨 4 · 성과 관리 및 코칭",
            "en": "Lifecycle lesson 4 · Performance Management and Coaching"
          },
          "href": "../agent-lifecycle/#coaching-0"
        }
      },
      {
        "id": "s2",
        "text": {
          "ko": "코칭을 여러 번 했는데도 나아지지 않는다",
          "en": "Several rounds of coaching have not helped"
        },
        "first": {
          "title": {
            "ko": "SOP · 성과 개선 계획 (PIP)",
            "en": "SOP · Performance Improvement Plan (PIP)"
          },
          "href": "../sop-library/#pip-0"
        },
        "then": {
          "title": {
            "ko": "라이프사이클 레슨 4 · 성과 관리 및 코칭",
            "en": "Lifecycle lesson 4 · Performance Management and Coaching"
          },
          "href": "../agent-lifecycle/#coaching-0"
        }
      },
      {
        "id": "s3",
        "text": {
          "ko": "열심히 하던 팀원이 갑자기 의욕이 없어 보인다",
          "en": "A hard-working team member suddenly seems to have lost motivation"
        },
        "first": {
          "title": {
            "ko": "라이프사이클 레슨 5 · 동기부여 및 유지",
            "en": "Lifecycle lesson 5 · Engagement and Retention"
          },
          "href": "../agent-lifecycle/#retention-0"
        },
        "then": {
          "title": {
            "ko": "SOP · 1:1 코칭",
            "en": "SOP · One-on-One Coaching"
          },
          "href": "../sop-library/#coaching-0"
        }
      },
      {
        "id": "s4",
        "text": {
          "ko": "팀원이 SME나 팀장으로 성장하고 싶다고 한다",
          "en": "A team member says they want to grow into an SME or team lead"
        },
        "first": {
          "title": {
            "ko": "Codex 원페이저 ③ 커리어 매트릭스",
            "en": "Codex one-pager ③ Career Matrix"
          },
          "href": "../codex/#career"
        },
        "then": {
          "title": {
            "ko": "라이프사이클 레슨 6 · 경력 개발 및 전환·퇴사",
            "en": "Lifecycle lesson 6 · Career Development and Offboarding"
          },
          "href": "../agent-lifecycle/#career-0"
        }
      },
      {
        "id": "s5",
        "text": {
          "ko": "팀원이 퇴사하겠다고 한다",
          "en": "A team member says they want to leave"
        },
        "first": {
          "title": {
            "ko": "라이프사이클 레슨 6 · 경력 개발 및 전환·퇴사",
            "en": "Lifecycle lesson 6 · Career Development and Offboarding"
          },
          "href": "../agent-lifecycle/#career-0"
        },
        "then": {
          "title": {
            "ko": "라이프사이클 레슨 5 · 동기부여 및 유지",
            "en": "Lifecycle lesson 5 · Engagement and Retention"
          },
          "href": "../agent-lifecycle/#retention-0"
        }
      }
    ]
  },
  {
    "id": "newcomer",
    "chip": {
      "ko": "새로 오는 사람",
      "en": "People joining"
    },
    "heading": {
      "ko": "새로 들어오는 사람",
      "en": "People joining"
    },
    "situations": [
      {
        "id": "s6",
        "text": {
          "ko": "다음 주에 신입이 우리 팀에 들어온다",
          "en": "A new hire joins your team next week"
        },
        "first": {
          "title": {
            "ko": "SOP · 신규 입사자 온보딩",
            "en": "SOP · New Hire Onboarding"
          },
          "href": "../sop-library/#onboarding-0"
        },
        "then": {
          "title": {
            "ko": "라이프사이클 레슨 2 · 온보딩 및 초기 교육",
            "en": "Lifecycle lesson 2 · Onboarding and Initial Training"
          },
          "href": "../agent-lifecycle/#onboarding-0"
        }
      },
      {
        "id": "s7",
        "text": {
          "ko": "교육을 마친 신입이 처음 실제 문의를 받는다",
          "en": "A new hire who finished training takes live contacts for the first time"
        },
        "first": {
          "title": {
            "ko": "라이프사이클 레슨 3 · 실전 배치 및 네스팅",
            "en": "Lifecycle lesson 3 · Go-Live and Nesting"
          },
          "href": "../agent-lifecycle/#nesting-0"
        },
        "then": {
          "title": {
            "ko": "SOP · 고객 불만 에스컬레이션",
            "en": "SOP · Customer Complaint Escalation"
          },
          "href": "../sop-library/#escalation-0"
        }
      },
      {
        "id": "s8",
        "text": {
          "ko": "채용 면접관으로 들어가게 됐다",
          "en": "You have been asked to sit in on hiring interviews"
        },
        "first": {
          "title": {
            "ko": "라이프사이클 레슨 1 · 채용 및 선발",
            "en": "Lifecycle lesson 1 · Recruitment and Hiring"
          },
          "href": "../agent-lifecycle/#hiring-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ② 인재영입팀",
            "en": "Codex one-pager ② Talent Acquisition"
          },
          "href": "../codex/#teams-ta"
        }
      }
    ]
  },
  {
    "id": "customer",
    "chip": {
      "ko": "고객·문의",
      "en": "Customers"
    },
    "heading": {
      "ko": "고객과 문의",
      "en": "Customers and contacts"
    },
    "situations": [
      {
        "id": "s9",
        "text": {
          "ko": "팀원이 해결하지 못한 불만 고객을 넘겨 왔다",
          "en": "A team member has handed you an upset customer they couldn't resolve"
        },
        "first": {
          "title": {
            "ko": "SOP · 고객 불만 에스컬레이션",
            "en": "SOP · Customer Complaint Escalation"
          },
          "href": "../sop-library/#escalation-0"
        },
        "then": {
          "title": {
            "ko": "SOP · 1:1 코칭",
            "en": "SOP · One-on-One Coaching"
          },
          "href": "../sop-library/#coaching-0"
        }
      },
      {
        "id": "s10",
        "text": {
          "ko": "같은 불만이 갑자기 쏟아진다",
          "en": "The same complaint is suddenly pouring in"
        },
        "first": {
          "title": {
            "ko": "SOP · 대규모 이슈 대응",
            "en": "SOP · Large-Scale Issue Response"
          },
          "href": "../sop-library/#incident-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ① 원칙 3 · 조기 경보 시스템",
            "en": "Codex one-pager ① Principle 3 · Early warning"
          },
          "href": "../codex/#principles-p3"
        }
      },
      {
        "id": "s11",
        "text": {
          "ko": "평가자마다 품질 점수가 다르다는 말이 나온다",
          "en": "People say quality scores depend on who does the scoring"
        },
        "first": {
          "title": {
            "ko": "SOP · 캘리브레이션",
            "en": "SOP · Calibration"
          },
          "href": "../sop-library/#calibration-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ② 교육개발팀",
            "en": "Codex one-pager ② Training & Development"
          },
          "href": "../codex/#teams-td"
        }
      }
    ]
  },
  {
    "id": "staffing",
    "chip": {
      "ko": "인원·시간",
      "en": "Staffing and time"
    },
    "heading": {
      "ko": "인원과 시간",
      "en": "Staffing and time"
    },
    "situations": [
      {
        "id": "s12",
        "text": {
          "ko": "대기 고객이 늘고 서비스 레벨이 떨어진다",
          "en": "More customers are waiting and the service level is dropping"
        },
        "first": {
          "title": {
            "ko": "인력 산정 실험실",
            "en": "Staffing Lab"
          },
          "href": "../staffing-calculator/"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ② 인력관리팀",
            "en": "Codex one-pager ② Workforce Management"
          },
          "href": "../codex/#teams-wfm"
        }
      },
      {
        "id": "s13",
        "text": {
          "ko": "결근과 휴식 때문에 계획한 인원이 자리에 없다",
          "en": "Because of absence and breaks, the people you planned for aren't at their desks"
        },
        "first": {
          "title": {
            "ko": "용어집 · Shrinkage",
            "en": "Glossary · Shrinkage"
          },
          "href": "../glossary/#shrinkage"
        },
        "then": {
          "title": {
            "ko": "인력 산정 실험실",
            "en": "Staffing Lab"
          },
          "href": "../staffing-calculator/"
        }
      },
      {
        "id": "s14",
        "text": {
          "ko": "회의와 보고로 하루가 지나가 코칭할 시간이 없다",
          "en": "Meetings and reports eat the day and leave no time for coaching"
        },
        "first": {
          "title": {
            "ko": "Codex 원페이저 ④ 팀장의 하루",
            "en": "Codex one-pager ④ A team lead's day"
          },
          "href": "../codex/#daily-tl"
        },
        "then": {
          "title": {
            "ko": "SOP · 1:1 코칭",
            "en": "SOP · One-on-One Coaching"
          },
          "href": "../sop-library/#coaching-0"
        }
      }
    ]
  },
  {
    "id": "org",
    "chip": {
      "ko": "조직·새 일",
      "en": "Organization and new work"
    },
    "heading": {
      "ko": "조직과 새 일",
      "en": "The organization and new work"
    },
    "situations": [
      {
        "id": "s15",
        "text": {
          "ko": "새 프로젝트를 맡게 됐다",
          "en": "You have been given a new project"
        },
        "first": {
          "title": {
            "ko": "SOP · 신규 프로젝트 론칭",
            "en": "SOP · New Project Launch"
          },
          "href": "../sop-library/#launch-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ② 5대 핵심팀 청사진",
            "en": "Codex one-pager ② Five Core Teams"
          },
          "href": "../codex/#teams"
        }
      },
      {
        "id": "s16",
        "text": {
          "ko": "다른 팀(WFM, QA, T&D, HR)에 무엇을 요청할지 모르겠다",
          "en": "You're not sure what to ask other teams (WFM, QA, T&D, HR) for"
        },
        "first": {
          "title": {
            "ko": "Codex 원페이저 ② 5대 핵심팀 청사진",
            "en": "Codex one-pager ② Five Core Teams"
          },
          "href": "../codex/#teams"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ① 운영 최적화 4대 원칙",
            "en": "Codex one-pager ① Four Optimization Principles"
          },
          "href": "../codex/#principles"
        }
      },
      {
        "id": "s17",
        "text": {
          "ko": "같은 문제를 매번 임시방편으로 해결하고 있다",
          "en": "You keep solving the same problem with a stopgap every time"
        },
        "first": {
          "title": {
            "ko": "Codex 원페이저 ① 원칙 1 · Master SOP",
            "en": "Codex one-pager ① Principle 1 · Master SOP"
          },
          "href": "../codex/#principles-p1"
        },
        "then": {
          "title": {
            "ko": "SOP 라이브러리",
            "en": "SOP Library"
          },
          "href": "../sop-library/#home"
        }
      }
    ]
  }
];
