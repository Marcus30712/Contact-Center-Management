// Generated from docs/superpowers/specs/2026-11-19-codex-one-pagers-copy-ko.md
// (confirmed Korean) with English added. Edit both together; agent-lifecycle/tests/codex.test.js
// checks the Korean against the copy file.
export const TEAMS = {
  "intro": {
    "ko": "우리 생태계를 움직이는 5개의 엔진",
    "en": "The five engines that run our ecosystem"
  },
  "yours": "operation",
  "items": [
    {
      "id": "ta",
      "name": {
        "ko": "인재영입팀 (Talent Acquisition)",
        "en": "Talent Acquisition"
      },
      "mission": {
        "ko": "우리 생태계의 가치에 부합하고, 함께 성장할 최고의 인재를 발굴하여 영입합니다.",
        "en": "Find and bring in the best people, who fit the values of our ecosystem and will grow with us."
      },
      "roles": [
        "Recruiter",
        "Sourcer",
        "Coordinator"
      ],
      "kpis": [
        {
          "name": "Time to Fill",
          "def": {
            "ko": "채용 요청부터 최종 합격까지 걸리는 시간.",
            "en": "Time from a hiring request to the final hire decision."
          },
          "why": {
            "ko": "운영팀의 인력 공백 최소화",
            "en": "Keeps staffing gaps in operations to a minimum"
          }
        },
        {
          "name": "Cost per Hire",
          "def": {
            "ko": "한 사람을 채용하는 데 드는 총비용.",
            "en": "Total cost of hiring one person."
          },
          "why": {
            "ko": "효율적인 예산 사용",
            "en": "Efficient use of budget"
          }
        },
        {
          "name": "New Hire Quality",
          "def": {
            "ko": "신규 입사자의 90일 내 성과 및 잔존율.",
            "en": "New hires' performance and retention within their first 90 days."
          },
          "why": {
            "ko": "채용의 질적 성공 측정",
            "en": "Measures the quality of hiring"
          }
        }
      ],
      "flow": [
        {
          "ko": "채용 계획 수립",
          "en": "Hiring plan"
        },
        {
          "ko": "인재 발굴(Sourcing)",
          "en": "Sourcing"
        },
        {
          "ko": "서류 심사(Screening)",
          "en": "Screening"
        },
        {
          "ko": "인터뷰 진행",
          "en": "Interviews"
        },
        {
          "ko": "최종 합격 및 처우 협의",
          "en": "Offer and terms"
        },
        {
          "ko": "사전 온보딩(Pre-onboarding)",
          "en": "Pre-onboarding"
        }
      ]
    },
    {
      "id": "td",
      "name": {
        "ko": "교육개발팀 (Training & Development)",
        "en": "Training & Development"
      },
      "mission": {
        "ko": "모든 구성원의 잠재력을 최대로 끌어올려, 개인의 성장과 조직의 성공을 함께 이룹니다.",
        "en": "Bring out the full potential of every member, so personal growth and organizational success happen together."
      },
      "roles": [
        "Trainer",
        "Quality Analyst (QA)",
        "Instructional Designer"
      ],
      "kpis": [
        {
          "name": "Nesting Success Rate",
          "def": {
            "ko": "교육 후 실전 투입 성공률.",
            "en": "Share of trainees who succeed once they start live work."
          },
          "why": {
            "ko": "교육 효과성",
            "en": "Training effectiveness"
          }
        },
        {
          "name": "Quality Score Improvement",
          "def": {
            "ko": "코칭 전후 품질 점수 향상률.",
            "en": "How much quality scores improve after coaching."
          },
          "why": {
            "ko": "품질 개선 기여도",
            "en": "Contribution to quality improvement"
          }
        },
        {
          "name": "Time to Proficiency",
          "def": {
            "ko": "신규 입사자가 목표 성과에 도달하는 시간.",
            "en": "Time for a new hire to reach target performance."
          },
          "why": {
            "ko": "교육 효율성",
            "en": "Training efficiency"
          }
        }
      ],
      "flow": [
        {
          "ko": "신입사원 교육",
          "en": "New hire training"
        },
        {
          "ko": "제품/프로세스 심화 교육",
          "en": "Product and process training"
        },
        {
          "ko": "품질 감사(Auditing) 및 분석",
          "en": "Quality auditing and analysis"
        },
        {
          "ko": "1:1 코칭 및 피드백",
          "en": "1:1 coaching and feedback"
        },
        {
          "ko": "리더십 개발 프로그램",
          "en": "Leadership development"
        }
      ]
    },
    {
      "id": "operation",
      "name": {
        "ko": "운영팀 (Operation)",
        "en": "Operation"
      },
      "mission": {
        "ko": "최고의 고객 경험을 제공하여 비즈니스 목표를 달성하고, 지속 가능한 성장을 이끌어냅니다.",
        "en": "Deliver the best customer experience to meet business goals and drive sustainable growth."
      },
      "roles": [
        "Agent",
        "Subject Matter Expert (SME)",
        "Team Lead (TL)",
        "Assistant Manager (AM)",
        "Operation Manager (OM)"
      ],
      "kpis": [
        {
          "name": "CSAT (Customer Satisfaction)",
          "def": {
            "ko": "고객 만족도.",
            "en": "Customer satisfaction."
          },
          "why": {
            "ko": "서비스 품질의 최종 척도",
            "en": "The final measure of service quality"
          },
          "glossary": "csat"
        },
        {
          "name": "Quality Score (QS)",
          "def": {
            "ko": "상담 품질 점수.",
            "en": "Quality score for contacts."
          },
          "why": {
            "ko": "프로세스 준수 및 응대 태도",
            "en": "Process compliance and manner"
          },
          "glossary": "quality-score"
        },
        {
          "name": "AHT (Average Handle Time)",
          "def": {
            "ko": "평균 처리 시간.",
            "en": "Average handle time."
          },
          "why": {
            "ko": "업무 효율성",
            "en": "Work efficiency"
          },
          "glossary": "aht"
        },
        {
          "name": "SLA (Service Level Agreement)",
          "def": {
            "ko": "서비스 수준 협약.",
            "en": "Service level agreement."
          },
          "why": {
            "ko": "응답성 및 신속성",
            "en": "Responsiveness and speed"
          },
          "glossary": "sla"
        }
      ],
      "flow": [
        {
          "ko": "고객 문의 처리",
          "en": "Handle customer contacts"
        },
        {
          "ko": "이슈 에스컬레이션",
          "en": "Escalate issues"
        },
        {
          "ko": "팀 허들 및 성과 공유",
          "en": "Team huddles and sharing results"
        },
        {
          "ko": "성과 분석 및 리뷰",
          "en": "Performance analysis and review"
        },
        {
          "ko": "클라이언트 보고",
          "en": "Client reporting"
        }
      ]
    },
    {
      "id": "wfm",
      "name": {
        "ko": "인력관리팀 (Workforce Management)",
        "en": "Workforce Management"
      },
      "mission": {
        "ko": "정확한 데이터 예측을 통해 최적의 인력을 필요한 시간과 장소에 배치하여, 효율성과 생산성을 극대화합니다.",
        "en": "Use accurate forecasts to put the right number of people where and when they are needed, maximizing efficiency and productivity."
      },
      "roles": [
        "Forecaster",
        "Scheduler",
        "Real-Time Analyst (RTA)"
      ],
      "kpis": [
        {
          "name": "Forecast Accuracy",
          "def": {
            "ko": "인입량 예측 정확도.",
            "en": "Accuracy of the contact volume forecast."
          },
          "why": {
            "ko": "모든 계획의 기초",
            "en": "The basis of every plan"
          },
          "glossary": "forecast-accuracy"
        },
        {
          "name": "Schedule Adherence",
          "def": {
            "ko": "스케줄 준수율.",
            "en": "Schedule adherence rate."
          },
          "why": {
            "ko": "운영 안정성",
            "en": "Operational stability"
          },
          "glossary": "schedule-adherence"
        },
        {
          "name": "Shrinkage",
          "def": {
            "ko": "결근뿐 아니라 휴식, 교육, 회의처럼 콜을 받을 수 없는 모든 시간의 비율.",
            "en": "The share of all time when agents cannot take calls: not only absence but also breaks, training and meetings."
          },
          "why": {
            "ko": "생산성 손실 관리",
            "en": "Managing lost productivity"
          },
          "glossary": "shrinkage"
        },
        {
          "name": "Occupancy",
          "def": {
            "ko": "상담사의 실제 업무 시간 비율.",
            "en": "The share of agents' time spent actually working."
          },
          "why": {
            "ko": "인력 활용 효율성",
            "en": "How efficiently staff are used"
          },
          "glossary": "occupancy"
        }
      ],
      "flow": [
        {
          "ko": "인입량 예측",
          "en": "Volume forecast"
        },
        {
          "ko": "필요 인력 산출(Capacity Planning)",
          "en": "Capacity planning"
        },
        {
          "ko": "근무 스케줄 생성",
          "en": "Build schedules"
        },
        {
          "ko": "실시간 모니터링 및 조정",
          "en": "Real-time monitoring and adjustment"
        },
        {
          "ko": "운영 효율성 보고",
          "en": "Efficiency reporting"
        }
      ]
    },
    {
      "id": "hr",
      "name": {
        "ko": "인사팀 (Human Resources)",
        "en": "Human Resources"
      },
      "mission": {
        "ko": "모든 구성원이 존중받고 공정하게 대우받는 건강한 조직 문화를 만들고, 신뢰 기반의 노사 관계를 구축합니다.",
        "en": "Build a healthy culture where everyone is respected and treated fairly, and labor relations based on trust."
      },
      "roles": [
        "HR Generalist",
        "Payroll Specialist",
        "Employee Relations Specialist"
      ],
      "kpis": [
        {
          "name": "Employee Engagement",
          "def": {
            "ko": "직원 몰입도 점수.",
            "en": "Employee engagement score."
          },
          "why": {
            "ko": "조직 문화 건강도",
            "en": "Health of the culture"
          }
        },
        {
          "name": "Attrition Rate",
          "def": {
            "ko": "퇴사율.",
            "en": "Attrition rate."
          },
          "why": {
            "ko": "인재 유지 능력",
            "en": "Ability to keep people"
          },
          "glossary": "attrition"
        },
        {
          "name": "HR Case Resolution Time",
          "def": {
            "ko": "인사 관련 문제 해결 소요 시간.",
            "en": "Time taken to resolve HR issues."
          },
          "why": {
            "ko": "직원 만족도 및 신뢰",
            "en": "Employee satisfaction and trust"
          }
        }
      ],
      "flow": [
        {
          "ko": "신규 입사자 온보딩",
          "en": "New hire onboarding"
        },
        {
          "ko": "급여 및 복리후생 관리",
          "en": "Payroll and benefits"
        },
        {
          "ko": "직원 고충 처리",
          "en": "Employee grievances"
        },
        {
          "ko": "성과 평가 및 보상",
          "en": "Performance review and rewards"
        },
        {
          "ko": "징계 및 퇴사 절차 관리",
          "en": "Disciplinary and exit procedures"
        }
      ]
    }
  ]
};
