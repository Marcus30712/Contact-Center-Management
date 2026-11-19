// Generated from docs/superpowers/specs/2026-11-19-codex-one-pagers-copy-ko.md
// (confirmed Korean) with English added. Edit both together; agent-lifecycle/tests/codex.test.js
// checks the Korean against the copy file.
export const DAILY = {
  "intro": {
    "ko": "BPO 운영팀의 각 포지션별 핵심 업무를 우선순위, 빈도, 권장 시간 배분, 그리고 핵심 결과물을 기준으로 안내합니다. 이를 통해 자신의 역할을 명확히 이해하고 시간 관리를 최적화할 수 있습니다.",
    "en": "This guide sets out the core tasks of each position in a BPO operations team by priority, frequency, recommended share of time, and key outputs. It helps you understand your role clearly and manage your time well."
  },
  "notes": [
    {
      "ko": "시각과 시간 비중은 예시이며, 센터마다 다를 수 있습니다.",
      "en": "Times of day and time shares are examples and may differ from center to center."
    },
    {
      "ko": "시간 비중은 한 주 전체 기준이라 하루 일정과 다를 수 있습니다.",
      "en": "Time shares are for the whole week, so they can differ from a single day's schedule."
    }
  ],
  "defaultRole": "tl",
  "roles": [
    {
      "id": "agent",
      "name": {
        "ko": "상담사 (Agent)",
        "en": "Agent"
      },
      "tasks": [
        {
          "n": 1,
          "tag": {
            "ko": "핵심",
            "en": "Core"
          },
          "name": {
            "ko": "고객 상호작용",
            "en": "Customer interactions"
          },
          "freq": {
            "ko": "일간",
            "en": "Daily"
          },
          "share": {
            "ko": "약 70%",
            "en": "about 70%"
          },
          "outputs": {
            "ko": "해결된 고객 문의 티켓, 정확한 상담 내용 기록",
            "en": "Resolved customer tickets, accurate contact records"
          }
        },
        {
          "n": 2,
          "tag": {
            "ko": "성장",
            "en": "Growth"
          },
          "name": {
            "ko": "코칭 또는 자기 학습",
            "en": "Coaching or self-study"
          },
          "freq": {
            "ko": "주간",
            "en": "Weekly"
          },
          "share": {
            "ko": "약 10%",
            "en": "about 10%"
          },
          "outputs": {
            "ko": "코칭 세션 로그, 개인 역량 개발 계획서(IDP)",
            "en": "Coaching session log, individual development plan (IDP)"
          }
        },
        {
          "n": 3,
          "tag": {
            "ko": "준비",
            "en": "Prep"
          },
          "name": {
            "ko": "팀 허들 및 업무 준비",
            "en": "Team huddle and getting ready"
          },
          "freq": {
            "ko": "일간",
            "en": "Daily"
          },
          "share": {
            "ko": "약 10%",
            "en": "about 10%"
          },
          "outputs": {
            "ko": "일일 목표 및 주요 공지사항 숙지",
            "en": "Knowing the day's goals and key notices"
          }
        },
        {
          "n": 4,
          "tag": {
            "ko": "마무리",
            "en": "Wrap-up"
          },
          "name": {
            "ko": "업무 정리 및 리포팅",
            "en": "Wrapping up and reporting"
          },
          "freq": {
            "ko": "일간",
            "en": "Daily"
          },
          "share": {
            "ko": "약 10%",
            "en": "about 10%"
          },
          "outputs": {
            "ko": "개인 일일 성과 보고서 제출",
            "en": "Personal daily performance report submitted"
          }
        }
      ],
      "schedule": [
        {
          "from": "09:00",
          "to": "09:30",
          "task": 3,
          "text": {
            "ko": "팀 허들 및 업무 준비",
            "en": "Team huddle and getting ready"
          }
        },
        {
          "from": "09:30",
          "to": "12:30",
          "task": 1,
          "text": {
            "ko": "고객 상호작용 (오전)",
            "en": "Customer interactions (morning)"
          }
        },
        {
          "from": "12:30",
          "to": "13:30",
          "task": "lunch",
          "text": {
            "ko": "점심시간",
            "en": "Lunch"
          }
        },
        {
          "from": "13:30",
          "to": "16:30",
          "task": 1,
          "text": {
            "ko": "고객 상호작용 (오후)",
            "en": "Customer interactions (afternoon)"
          }
        },
        {
          "from": "16:30",
          "to": "17:15",
          "task": 2,
          "text": {
            "ko": "1:1 코칭 또는 자기 학습 (주간 활동)",
            "en": "1:1 coaching or self-study (weekly)"
          }
        },
        {
          "from": "17:15",
          "to": "18:00",
          "task": 4,
          "text": {
            "ko": "업무 정리 및 리포팅",
            "en": "Wrapping up and reporting"
          }
        }
      ]
    },
    {
      "id": "sme",
      "name": {
        "ko": "SME",
        "en": "SME"
      },
      "tasks": [
        {
          "n": 1,
          "tag": {
            "ko": "핵심",
            "en": "Core"
          },
          "name": {
            "ko": "에스컬레이션 지원 및 복잡 케이스 처리",
            "en": "Escalation support and complex cases"
          },
          "freq": {
            "ko": "일간",
            "en": "Daily"
          },
          "share": {
            "ko": "약 40%",
            "en": "about 40%"
          },
          "outputs": {
            "ko": "해결된 고난도 케이스 보고서, 신규 이슈에 대한 Knowledge Base 문서 초안",
            "en": "Reports on resolved difficult cases, draft knowledge base articles on new issues"
          }
        },
        {
          "n": 2,
          "tag": {
            "ko": "성장",
            "en": "Growth"
          },
          "name": {
            "ko": "상담사 멘토링",
            "en": "Mentoring agents"
          },
          "freq": {
            "ko": "일간 (상시) / 주간 (정기)",
            "en": "Daily (ongoing) / weekly (scheduled)"
          },
          "share": {
            "ko": "약 30%",
            "en": "about 30%"
          },
          "outputs": {
            "ko": "멘토링 일지, 멘티의 성과 개선 추적 데이터",
            "en": "Mentoring log, data tracking the mentee's improvement"
          }
        },
        {
          "n": 3,
          "tag": {
            "ko": "분석",
            "en": "Analysis"
          },
          "name": {
            "ko": "VOC 분석 및 리포팅",
            "en": "VOC analysis and reporting"
          },
          "freq": {
            "ko": "주간",
            "en": "Weekly"
          },
          "share": {
            "ko": "약 20%",
            "en": "about 20%"
          },
          "outputs": {
            "ko": "주간 VOC 트렌드 분석 보고서, 프로세스 또는 정책 개선 제안",
            "en": "Weekly VOC trend report, proposals to improve processes or policies"
          }
        },
        {
          "n": 4,
          "tag": {
            "ko": "협업",
            "en": "Collaboration"
          },
          "name": {
            "ko": "QA팀과 품질 교정 미팅",
            "en": "Calibration meetings with QA"
          },
          "freq": {
            "ko": "주간 또는 격주",
            "en": "Weekly or every two weeks"
          },
          "share": {
            "ko": "약 10%",
            "en": "about 10%"
          },
          "outputs": {
            "ko": "교정 세션 회의록, 합의된 평가 기준 가이드라인",
            "en": "Calibration session minutes, guideline on the agreed criteria"
          }
        }
      ],
      "schedule": [
        {
          "from": "09:00",
          "to": "11:00",
          "task": 1,
          "text": {
            "ko": "에스컬레이션 실시간 지원",
            "en": "Real-time escalation support"
          }
        },
        {
          "from": "11:00",
          "to": "12:30",
          "task": 2,
          "text": {
            "ko": "신입/성과 부진 상담사 멘토링",
            "en": "Mentoring new and struggling agents"
          }
        },
        {
          "from": "12:30",
          "to": "13:30",
          "task": "lunch",
          "text": {
            "ko": "점심시간",
            "en": "Lunch"
          }
        },
        {
          "from": "13:30",
          "to": "15:00",
          "task": 3,
          "text": {
            "ko": "주간 VOC 데이터 분석 및 리포팅",
            "en": "Weekly VOC analysis and reporting"
          }
        },
        {
          "from": "15:00",
          "to": "16:00",
          "task": 4,
          "text": {
            "ko": "QA팀과 주간 품질 교정 미팅",
            "en": "Weekly calibration meeting with QA"
          }
        },
        {
          "from": "16:00",
          "to": "18:00",
          "task": 1,
          "text": {
            "ko": "복잡 케이스 집중 처리 및 문서화",
            "en": "Focused work on complex cases and documentation"
          }
        }
      ]
    },
    {
      "id": "tl",
      "name": {
        "ko": "팀장 (Team Lead)",
        "en": "Team Lead"
      },
      "tasks": [
        {
          "n": 1,
          "tag": {
            "ko": "핵심",
            "en": "Core"
          },
          "name": {
            "ko": "1:1 코칭 세션 및 현장 관리",
            "en": "1:1 coaching and floor management"
          },
          "freq": {
            "ko": "주간 (1:1) / 일간 (현장 관리)",
            "en": "Weekly (1:1s) / daily (floor management)"
          },
          "share": {
            "ko": "약 40%",
            "en": "about 40%"
          },
          "outputs": {
            "ko": "팀원별 1:1 코칭 로그, 팀 성과 개선 액션 플랜",
            "en": "1:1 coaching log for each team member, team improvement action plan"
          }
        },
        {
          "n": 2,
          "tag": {
            "ko": "분석",
            "en": "Analysis"
          },
          "name": {
            "ko": "성과 대시보드 리뷰",
            "en": "Performance dashboard review"
          },
          "freq": {
            "ko": "일간",
            "en": "Daily"
          },
          "share": {
            "ko": "약 20%",
            "en": "about 20%"
          },
          "outputs": {
            "ko": "일일 팀 성과 요약, 지원이 필요한 팀원 명단",
            "en": "Daily team performance summary, list of team members who need support"
          }
        },
        {
          "n": 3,
          "tag": {
            "ko": "준비",
            "en": "Prep"
          },
          "name": {
            "ko": "팀 허들 주관 및 코칭 계획 수립",
            "en": "Running the huddle and planning coaching"
          },
          "freq": {
            "ko": "일간 (허들) / 주간 (계획)",
            "en": "Daily (huddle) / weekly (plan)"
          },
          "share": {
            "ko": "약 20%",
            "en": "about 20%"
          },
          "outputs": {
            "ko": "일일 팀 허들 안건, 데이터 기반의 주간 코칭 계획서",
            "en": "Daily huddle agenda, data-based weekly coaching plan"
          }
        },
        {
          "n": 4,
          "tag": {
            "ko": "보고",
            "en": "Reporting"
          },
          "name": {
            "ko": "부매니저와 주간 미팅 및 성과 보고서 작성",
            "en": "Weekly meeting with the AM and writing the performance report"
          },
          "freq": {
            "ko": "주간",
            "en": "Weekly"
          },
          "share": {
            "ko": "약 20%",
            "en": "about 20%"
          },
          "outputs": {
            "ko": "주간 팀 성과 보고서, 주간 미팅 회의록 및 실행 과제 목록",
            "en": "Weekly team performance report, weekly meeting minutes and action items"
          }
        }
      ],
      "schedule": [
        {
          "from": "09:00",
          "to": "09:30",
          "task": 3,
          "text": {
            "ko": "팀 허들 주관",
            "en": "Run the team huddle"
          }
        },
        {
          "from": "09:30",
          "to": "10:30",
          "task": 2,
          "text": {
            "ko": "팀 성과 대시보드 리뷰 및 이슈 파악",
            "en": "Review the team dashboard and spot issues"
          }
        },
        {
          "from": "10:30",
          "to": "12:30",
          "task": 1,
          "text": {
            "ko": "팀원 1:1 코칭 세션 (예시: 2~3명)",
            "en": "1:1 coaching sessions (Example: 2–3 people)"
          }
        },
        {
          "from": "12:30",
          "to": "13:30",
          "task": "lunch",
          "text": {
            "ko": "점심시간",
            "en": "Lunch"
          }
        },
        {
          "from": "13:30",
          "to": "14:30",
          "task": 1,
          "text": {
            "ko": "현장 관리 및 실시간 지원",
            "en": "Floor management and real-time support"
          }
        },
        {
          "from": "14:30",
          "to": "15:30",
          "task": 4,
          "text": {
            "ko": "부매니저와 주간 성과 미팅",
            "en": "Weekly performance meeting with the AM"
          }
        },
        {
          "from": "15:30",
          "to": "17:00",
          "task": 3,
          "text": {
            "ko": "다음 코칭 세션 데이터 준비 및 계획 수립",
            "en": "Prepare data and plan the next coaching sessions"
          }
        },
        {
          "from": "17:00",
          "to": "18:00",
          "task": 4,
          "text": {
            "ko": "주간 팀 성과 보고서 작성",
            "en": "Write the weekly team performance report"
          }
        }
      ]
    },
    {
      "id": "am",
      "name": {
        "ko": "부매니저 (AM)",
        "en": "Assistant Manager (AM)"
      },
      "tasks": [
        {
          "n": 1,
          "tag": {
            "ko": "핵심",
            "en": "Core"
          },
          "name": {
            "ko": "팀장들과 주간 성과 미팅 및 프로세스 개선 계획",
            "en": "Weekly performance meetings with team leads and process improvement planning"
          },
          "freq": {
            "ko": "주간",
            "en": "Weekly"
          },
          "share": {
            "ko": "약 40%",
            "en": "about 40%"
          },
          "outputs": {
            "ko": "팀장 주간 미팅 회의록, 구체적인 프로세스 개선 제안서 (기대효과 포함)",
            "en": "Minutes of weekly team lead meetings, concrete process improvement proposals (with expected impact)"
          }
        },
        {
          "n": 2,
          "tag": {
            "ko": "분석",
            "en": "Analysis"
          },
          "name": {
            "ko": "프로젝트 KPI 분석",
            "en": "Project KPI analysis"
          },
          "freq": {
            "ko": "일간 (상시) / 주간 (정기)",
            "en": "Daily (ongoing) / weekly (scheduled)"
          },
          "share": {
            "ko": "약 25%",
            "en": "about 25%"
          },
          "outputs": {
            "ko": "다수 팀의 성과 비교 분석 리포트, 잠재적 리스크 식별 및 관리 대장",
            "en": "Report comparing several teams' performance, register of potential risks"
          }
        },
        {
          "n": 3,
          "tag": {
            "ko": "보고",
            "en": "Reporting"
          },
          "name": {
            "ko": "클라이언트 보고서 준비 및 운영 매니저와 1:1 미팅",
            "en": "Client reports and 1:1 with the Operation Manager"
          },
          "freq": {
            "ko": "주간 / 월간 (보고서) / 주간 (1:1)",
            "en": "Weekly / monthly (reports) / weekly (1:1)"
          },
          "share": {
            "ko": "약 25%",
            "en": "about 25%"
          },
          "outputs": {
            "ko": "클라이언트 비즈니스 리뷰(WBR/MBR) 보고서 초안, 매니저 주간 보고 자료",
            "en": "Draft client business review (WBR/MBR) reports, weekly briefing for the manager"
          }
        },
        {
          "n": 4,
          "tag": {
            "ko": "지원",
            "en": "Support"
          },
          "name": {
            "ko": "클라이언트 에스컬레이션 처리",
            "en": "Handling client escalations"
          },
          "freq": {
            "ko": "비정기",
            "en": "As needed"
          },
          "share": {
            "ko": "약 10%",
            "en": "about 10%"
          },
          "outputs": {
            "ko": "중요 클라이언트 이슈 해결 보고서, 근본 원인 분석(RCA) 및 재발 방지 대책",
            "en": "Report on major client issues resolved, root cause analysis (RCA) and prevention"
          }
        }
      ],
      "schedule": [
        {
          "from": "09:00",
          "to": "10:00",
          "task": 2,
          "text": {
            "ko": "전체 프로젝트 KPI 대시보드 분석",
            "en": "Analyze the project-wide KPI dashboard"
          }
        },
        {
          "from": "10:00",
          "to": "11:30",
          "task": 1,
          "text": {
            "ko": "팀장들과 주간 성과 미팅",
            "en": "Weekly performance meeting with team leads"
          }
        },
        {
          "from": "11:30",
          "to": "12:30",
          "task": 3,
          "text": {
            "ko": "클라이언트 주간 보고서(WBR) 초안 작성",
            "en": "Draft the weekly client report (WBR)"
          }
        },
        {
          "from": "12:30",
          "to": "13:30",
          "task": "lunch",
          "text": {
            "ko": "점심시간",
            "en": "Lunch"
          }
        },
        {
          "from": "13:30",
          "to": "14:30",
          "task": 3,
          "text": {
            "ko": "운영 매니저와 1:1 미팅 (현황 보고)",
            "en": "1:1 with the Operation Manager (status update)"
          }
        },
        {
          "from": "14:30",
          "to": "16:30",
          "task": 1,
          "text": {
            "ko": "프로세스 개선 계획 수립 (QA/SME와 협업)",
            "en": "Plan process improvements (with QA and SMEs)"
          }
        },
        {
          "from": "16:30",
          "to": "17:30",
          "task": 4,
          "text": {
            "ko": "클라이언트 에스컬레이션 처리 (비정기)",
            "en": "Handle client escalations (as needed)"
          }
        },
        {
          "from": "17:30",
          "to": "18:00",
          "task": "other",
          "text": {
            "ko": "주요 이메일 회신 및 실행 계획 점검",
            "en": "Reply to key emails and check action plans"
          }
        }
      ]
    },
    {
      "id": "om",
      "name": {
        "ko": "매니저 (OM)",
        "en": "Operation Manager (OM)"
      },
      "tasks": [
        {
          "n": 1,
          "tag": {
            "ko": "핵심",
            "en": "Core"
          },
          "name": {
            "ko": "클라이언트 전략 미팅 및 비즈니스 현황 리뷰",
            "en": "Client strategy meetings and business review"
          },
          "freq": {
            "ko": "주간 / 월간 / 분기별",
            "en": "Weekly / monthly / quarterly"
          },
          "share": {
            "ko": "약 40%",
            "en": "about 40%"
          },
          "outputs": {
            "ko": "클라이언트 미팅 회의록(전략적 실행 과제 포함), 프로젝트 손익(P&L) 분석 보고서",
            "en": "Client meeting minutes (with strategic actions), project P&L analysis"
          }
        },
        {
          "n": 2,
          "tag": {
            "ko": "성장",
            "en": "Growth"
          },
          "name": {
            "ko": "리더십 개발",
            "en": "Leadership development"
          },
          "freq": {
            "ko": "주간",
            "en": "Weekly"
          },
          "share": {
            "ko": "약 25%",
            "en": "about 25%"
          },
          "outputs": {
            "ko": "중간 관리자(AM, TL) 1:1 미팅 로그, 리더십 개발 및 승계 계획",
            "en": "Log of 1:1s with middle managers (AM, TL), leadership development and succession plan"
          }
        },
        {
          "n": 3,
          "tag": {
            "ko": "전략",
            "en": "Strategy"
          },
          "name": {
            "ko": "예산 및 인력 계획 검토, MBR/QBR 자료 준비",
            "en": "Budget and staffing review, MBR/QBR preparation"
          },
          "freq": {
            "ko": "월간 / 분기별",
            "en": "Monthly / quarterly"
          },
          "share": {
            "ko": "약 25%",
            "en": "about 25%"
          },
          "outputs": {
            "ko": "월간/분기별 비즈니스 리뷰(MBR/QBR) 최종 발표 자료, 차기 분기 예산 및 인력 산정(Headcount) 계획안",
            "en": "Final monthly/quarterly business review (MBR/QBR) deck, next quarter's budget and headcount plan"
          }
        },
        {
          "n": 4,
          "tag": {
            "ko": "협업",
            "en": "Collaboration"
          },
          "name": {
            "ko": "유관부서장 미팅",
            "en": "Meetings with other department heads"
          },
          "freq": {
            "ko": "주간 또는 격주",
            "en": "Weekly or every two weeks"
          },
          "share": {
            "ko": "약 10%",
            "en": "about 10%"
          },
          "outputs": {
            "ko": "부서 간 협업 과제 관리 시트, 미팅 회의록",
            "en": "Cross-department action tracker, meeting minutes"
          }
        }
      ],
      "schedule": [
        {
          "from": "09:00",
          "to": "10:00",
          "task": 1,
          "text": {
            "ko": "비즈니스 현황 리뷰 (P&L, Headcount 등)",
            "en": "Business review (P&L, headcount and more)"
          }
        },
        {
          "from": "10:00",
          "to": "11:00",
          "task": 1,
          "text": {
            "ko": "클라이언트와 주간 전략 미팅",
            "en": "Weekly strategy meeting with the client"
          }
        },
        {
          "from": "11:00",
          "to": "12:30",
          "task": 4,
          "text": {
            "ko": "유관부서장(TA, T&D, WFM 등) 미팅",
            "en": "Meet other department heads (TA, T&D, WFM and others)"
          }
        },
        {
          "from": "12:30",
          "to": "13:30",
          "task": "lunch",
          "text": {
            "ko": "점심시간",
            "en": "Lunch"
          }
        },
        {
          "from": "13:30",
          "to": "15:00",
          "task": 2,
          "text": {
            "ko": "리더십 개발 (AM, TL과 1:1 미팅)",
            "en": "Leadership development (1:1s with AMs and TLs)"
          }
        },
        {
          "from": "15:00",
          "to": "16:30",
          "task": 3,
          "text": {
            "ko": "월간/분기별 비즈니스 리뷰(MBR/QBR) 자료 검토",
            "en": "Review monthly/quarterly business review (MBR/QBR) material"
          }
        },
        {
          "from": "16:30",
          "to": "17:30",
          "task": 3,
          "text": {
            "ko": "WFM팀과 차기 분기 예산 및 인력 계획 검토",
            "en": "Review next quarter's budget and staffing with WFM"
          }
        },
        {
          "from": "17:30",
          "to": "18:00",
          "task": "other",
          "text": {
            "ko": "장기 전략 구상 및 하루 업무 마무리",
            "en": "Long-term strategy thinking and wrapping up the day"
          }
        }
      ]
    }
  ]
};
