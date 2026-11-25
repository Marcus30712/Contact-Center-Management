// Generated from docs/superpowers/specs/2026-11-19-codex-one-pagers-copy-ko.md
// (confirmed Korean) with English added. Edit both together; agent-lifecycle/tests/codex.test.js
// checks the Korean against the copy file.
export const CAREER = {
  "definition": {
    "ko": "현재 직급의 핵심 역할, 주요 역량과 다음 직급으로 나아가기 위한 명확한 조건을 안내하는 투명한 가이드입니다.",
    "en": "A transparent guide to each level's core role, key skills, and the clear conditions for moving to the next level."
  },
  "uses": [
    {
      "label": {
        "ko": "학습 단계",
        "en": "Learn"
      },
      "text": {
        "ko": "현재 직급에서 요구하는 핵심 역량을 파악하고 학습 목표를 설정하는 데 사용합니다.",
        "en": "Use it to see the key skills your current level needs and to set learning goals."
      }
    },
    {
      "label": {
        "ko": "실행 단계",
        "en": "Act"
      },
      "text": {
        "ko": "성공 지표(KPI)를 명확히 인지하고 성과를 달성하기 위한 기준으로 삼습니다.",
        "en": "Know your success measures (KPIs) clearly and use them as the bar for your results."
      }
    },
    {
      "label": {
        "ko": "성장 단계",
        "en": "Grow"
      },
      "text": {
        "ko": "다음 단계로 나아가기 위한 조건을 확인하고, 경력 개발 계획을 구체적으로 세울 수 있습니다.",
        "en": "Check the conditions for the next step and make a concrete career plan."
      }
    }
  ],
  "note": {
    "ko": "다음 단계로 가는 조건의 기간과 인원은 Codex의 예시 기준이며, 센터마다 다를 수 있습니다.",
    "en": "The periods and headcounts in the next-step conditions are example criteria from the Codex and may differ from center to center."
  },
  "you": {
    "team": "operation",
    "level": "tl"
  },
  "teams": [
    {
      "id": "operation",
      "name": {
        "ko": "운영팀 (Operation Team)",
        "en": "Operation Team"
      },
      "levels": [
        {
          "id": "agent",
          "name": {
            "ko": "Agent",
            "en": "Agent"
          },
          "role": {
            "ko": "고객 문제 해결 및 신뢰 구축",
            "en": "Solve customers' problems and build trust"
          },
          "skills": {
            "work": {
              "ko": "제품 지식, CRM 활용",
              "en": "Product knowledge, using the CRM"
            },
            "soft": {
              "ko": "경청, 공감, 스트레스 관리",
              "en": "Listening, empathy, managing stress"
            }
          },
          "next": {
            "ko": "6개월 이상 KPI 달성, 긍정적 영향력, 심화 교육 이수",
            "en": "Met KPIs for 6 months or more, a positive influence on others, advanced training completed"
          }
        },
        {
          "id": "sme",
          "name": {
            "ko": "직무전문가 (SME)",
            "en": "SME (Subject Matter Expert)"
          },
          "role": {
            "ko": "팀의 지식 허브, 동료 성장 지원",
            "en": "The team's knowledge hub; helps peers grow"
          },
          "skills": {
            "work": {
              "ko": "VOC 분석, 보고서 작성",
              "en": "VOC analysis, report writing"
            },
            "soft": {
              "ko": "문제 해결, 코칭, 분석적 사고",
              "en": "Problem solving, coaching, analytical thinking"
            }
          },
          "next": {
            "ko": "1년 이상 직무전문가 경험, 팀장 백업 역할 수행, 리더십 교육 이수",
            "en": "1 year or more as an SME, served as team lead backup, leadership training completed"
          }
        },
        {
          "id": "tl",
          "name": {
            "ko": "Team Lead (팀장)",
            "en": "Team Lead"
          },
          "role": {
            "ko": "팀 성과 관리 및 동기 부여, 목표 달성 견인",
            "en": "Manage and motivate the team, drive it to its goals"
          },
          "skills": {
            "work": {
              "ko": "성과 데이터 분석, 인력 관리",
              "en": "Performance data analysis, people management"
            },
            "soft": {
              "ko": "리더십, 동기 부여, 피드백",
              "en": "Leadership, motivation, feedback"
            }
          },
          "next": {
            "ko": "2개 이상 프로젝트 또는 15명 이상 팀 관리, 프로세스 개선 성공, 중급 리더십 교육 이수",
            "en": "Managed 2 or more projects or a team of 15 or more, a successful process improvement, intermediate leadership training completed"
          }
        },
        {
          "id": "am",
          "name": {
            "ko": "Assistant Manager (부매니저)",
            "en": "Assistant Manager"
          },
          "role": {
            "ko": "프로젝트 안정적 운영 책임, 중간 관리자",
            "en": "Responsible for stable project operations; middle manager"
          },
          "skills": {
            "work": {
              "ko": "프로젝트 관리, 클라이언트 소통",
              "en": "Project management, client communication"
            },
            "soft": {
              "ko": "전략적 사고, 대인 관계 기술",
              "en": "Strategic thinking, interpersonal skills"
            }
          },
          "next": {
            "ko": "프로젝트 핵심 영역 1년 이상 책임, 신규 프로젝트 셋업 경험",
            "en": "Owned a core area of a project for 1 year or more, experience setting up a new project"
          }
        },
        {
          "id": "om",
          "name": {
            "ko": "Operation Manager (매니저)",
            "en": "Operation Manager"
          },
          "role": {
            "ko": "프로젝트의 비즈니스 오너, 지속적 성장 책임",
            "en": "Business owner of the project; responsible for sustained growth"
          },
          "skills": {
            "work": {
              "ko": "P&L 관리, 비즈니스 전략 수립",
              "en": "P&L management, business strategy"
            },
            "soft": {
              "ko": "비전 제시, 리더십, 협상",
              "en": "Setting a vision, leadership, negotiation"
            }
          }
        }
      ]
    },
    {
      "id": "td",
      "name": {
        "ko": "교육개발팀 (Training & Development)",
        "en": "Training & Development"
      },
      "levels": [
        {
          "id": "trainer",
          "name": {
            "ko": "Trainer / QA",
            "en": "Trainer / QA"
          },
          "role": {
            "ko": "신입 교육, 품질 감사, 고품질 서비스 지원",
            "en": "New hire training, quality audits, supporting high-quality service"
          },
          "skills": {
            "work": {
              "ko": "프레젠테이션, 품질 평가 기준 이해, 데이터 분석 기초",
              "en": "Presenting, understanding the quality criteria, basic data analysis"
            }
          },
          "next": {
            "ko": "2개 이상 프로젝트 경험, Calibration 세션 주도, 과정 개발 참여",
            "en": "Experience on 2 or more projects, led calibration sessions, took part in course development"
          }
        },
        {
          "id": "senior",
          "name": {
            "ko": "Senior T&D",
            "en": "Senior T&D"
          },
          "role": {
            "ko": "교육 커리큘럼 개발, 품질 데이터 심층 분석 및 인사이트 제공",
            "en": "Develop training curricula; analyze quality data in depth and provide insight"
          },
          "skills": {
            "work": {
              "ko": "교육 과정 설계, 데이터 시각화, 통계 분석, 컨설팅",
              "en": "Course design, data visualization, statistical analysis, consulting"
            }
          },
          "next": {
            "ko": "T&D 팀원 멘토링/리딩 경험, 클라이언트 대상 전략 발표 경험",
            "en": "Experience mentoring or leading T&D team members, experience presenting strategy to clients"
          }
        },
        {
          "id": "manager",
          "name": {
            "ko": "T&D Manager",
            "en": "T&D Manager"
          },
          "role": {
            "ko": "조직의 교육 및 품질 전략 전체 수립 및 책임",
            "en": "Sets and owns the organization's whole training and quality strategy"
          },
          "skills": {
            "work": {
              "ko": "인재 개발 전략, 성과 컨설팅, 예산 관리, 리더십",
              "en": "Talent development strategy, performance consulting, budget management, leadership"
            }
          }
        }
      ]
    },
    {
      "id": "wfm",
      "name": {
        "ko": "인력관리팀 (Workforce Management)",
        "en": "Workforce Management"
      },
      "levels": [
        {
          "id": "rta",
          "name": {
            "ko": "RTA (Real-Time Analyst)",
            "en": "RTA (Real-Time Analyst)"
          },
          "role": {
            "ko": "실시간 서비스 레벨 및 스케줄 준수 여부 모니터링 및 신속 대응",
            "en": "Monitor service level and schedule adherence in real time and respond quickly"
          },
          "skills": {
            "work": {
              "ko": "데이터 모니터링, 빠른 상황 판단, WFM 소프트웨어 활용",
              "en": "Data monitoring, quick judgment, using WFM software"
            }
          },
          "next": {
            "ko": "1년 이상 RTA 경험, 기초 데이터 분석 능력, WFM 원리 교육 이수",
            "en": "1 year or more as an RTA, basic data analysis skills, WFM principles training completed"
          }
        },
        {
          "id": "scheduler",
          "name": {
            "ko": "Scheduler / Forecaster",
            "en": "Scheduler / Forecaster"
          },
          "role": {
            "ko": "데이터 분석 기반 미래 인입량 예측 및 효율적 스케줄 설계",
            "en": "Forecast future volume from data and design efficient schedules"
          },
          "skills": {
            "work": {
              "ko": "통계 분석, 예측 모델링, 엑셀 고급 활용, 수용인원 계획",
              "en": "Statistical analysis, forecasting models, advanced Excel, capacity planning"
            }
          },
          "next": {
            "ko": "2년 이상 경험, 복수 프로젝트 관리, WFM 자격증 취득",
            "en": "2 years or more of experience, managing several projects, a WFM certification"
          }
        },
        {
          "id": "manager",
          "name": {
            "ko": "WFM Manager",
            "en": "WFM Manager"
          },
          "role": {
            "ko": "전사적 인력 운영 전략 수립 및 최적의 인력 효율성 보장",
            "en": "Set the company-wide workforce strategy and ensure the best staffing efficiency"
          },
          "skills": {
            "work": {
              "ko": "리더십, 재무 분석, 전략 기획, 클라이언트 협상",
              "en": "Leadership, financial analysis, strategic planning, client negotiation"
            }
          }
        }
      ]
    },
    {
      "id": "ta",
      "name": {
        "ko": "인재영입팀 (Talent Acquisition)",
        "en": "Talent Acquisition"
      },
      "levels": [
        {
          "id": "coordinator",
          "name": {
            "ko": "Coordinator / Sourcer",
            "en": "Coordinator / Sourcer"
          },
          "role": {
            "ko": "채용 프로세스 지원 (소싱, 일정 조율, 데이터 관리)",
            "en": "Support the hiring process (sourcing, scheduling, data management)"
          },
          "skills": {
            "work": {
              "ko": "꼼꼼함, 커뮤니케이션, 일정 관리, 소싱 기술",
              "en": "Attention to detail, communication, scheduling, sourcing skills"
            }
          },
          "next": {
            "ko": "1년 이상 지원 경험, 채용 프로세스 이해, 기초 인터뷰 스킬 교육 이수",
            "en": "1 year or more in a support role, understanding of the hiring process, basic interview training completed"
          }
        },
        {
          "id": "recruiter",
          "name": {
            "ko": "Recruiter",
            "en": "Recruiter"
          },
          "role": {
            "ko": "채용 전 과정 책임, 회사에 가장 적합한 인재 발굴",
            "en": "Own the whole hiring process and find the people who fit the company best"
          },
          "skills": {
            "work": {
              "ko": "인터뷰 기술, 후보자 평가, 협상, 고용 브랜딩 이해",
              "en": "Interviewing, assessing candidates, negotiation, understanding employer branding"
            }
          },
          "next": {
            "ko": "2년 이상 경험, Hard-to-fill 포지션 채용 성공, 데이터 기반 전략 실행",
            "en": "2 years or more of experience, filled hard-to-fill positions, carried out a data-based strategy"
          }
        },
        {
          "id": "manager",
          "name": {
            "ko": "TA Manager",
            "en": "TA Manager"
          },
          "role": {
            "ko": "채용 전략 수립, 강력한 고용 브랜드 구축, 최고의 인재 지속 유치",
            "en": "Set hiring strategy, build a strong employer brand, keep attracting the best people"
          },
          "skills": {
            "work": {
              "ko": "리더십, 채용 전략 기획, 예산 관리, 고용 브랜딩",
              "en": "Leadership, hiring strategy, budget management, employer branding"
            }
          }
        }
      ]
    },
    {
      "id": "hr",
      "name": {
        "ko": "인사팀 (Human Resources)",
        "en": "Human Resources"
      },
      "levels": [
        {
          "id": "admin",
          "name": {
            "ko": "HR Administrator",
            "en": "HR Administrator"
          },
          "role": {
            "ko": "인사 행정 업무(계약, 급여, 복리후생, 온보딩) 처리 및 지원",
            "en": "Handle and support HR administration (contracts, payroll, benefits, onboarding)"
          },
          "skills": {
            "work": {
              "ko": "꼼꼼함, 노동 관련 법·제도 이해, HRIS 활용, 문서 관리",
              "en": "Attention to detail, understanding labor laws and regulations, using the HRIS, records management"
            }
          },
          "next": {
            "ko": "1년 이상 경험, 노동 관련 법·제도에 대한 깊은 이해, 직원 고충 처리 지원 경험",
            "en": "1 year or more of experience, deep understanding of labor laws and regulations, experience supporting employee grievances"
          }
        },
        {
          "id": "generalist",
          "name": {
            "ko": "HR Generalist",
            "en": "HR Generalist"
          },
          "role": {
            "ko": "직원 생애주기 전반의 인사 이슈 담당, 현업 부서 인사 파트너",
            "en": "Handles HR issues across the employee life cycle; HR partner to the business"
          },
          "skills": {
            "work": {
              "ko": "직원 관계, 성과 관리, 보상, 노동 관련 법·제도 적용",
              "en": "Employee relations, performance management, rewards, applying labor laws and regulations"
            }
          },
          "next": {
            "ko": "3년 이상 경험, 특정 HR 분야 프로젝트 리딩, 비즈니스 이해 증명",
            "en": "3 years or more of experience, led a project in one HR area, proven business understanding"
          }
        },
        {
          "id": "manager",
          "name": {
            "ko": "HR Manager",
            "en": "HR Manager"
          },
          "role": {
            "ko": "인사팀 총괄, 인사 철학/제도/문화 수립, 경영진의 전략적 파트너",
            "en": "Leads HR, sets HR philosophy, policies and culture; strategic partner to leadership"
          },
          "skills": {
            "work": {
              "ko": "리더십, 조직 개발, 노사 관계 전략, HR 예산 관리, 비전 제시",
              "en": "Leadership, organizational development, labor relations strategy, HR budget, setting a vision"
            }
          }
        }
      ]
    }
  ]
};
