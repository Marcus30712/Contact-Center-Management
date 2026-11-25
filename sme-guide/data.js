// SME Situation Guide (2026-11-25): situations and where they lead. The Korean is
// the approved table in docs/superpowers/specs/2026-11-25-sme-guide-design.md §5;
// agent-lifecycle/tests/sme-guide.test.js keeps the two identical. The screen's
// other words are the team-lead guide's.
import { GUIDE_UI } from '../guide/data.js';

export const SME_GUIDE_UI = { ...GUIDE_UI, ...{
  "title": {
    "ko": "SME 상황별 길잡이",
    "en": "SME Situation Guide"
  },
  "intro": {
    "ko": "지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다.",
    "en": "What's happening right now? Tap a situation to see where to look first and where to go next."
  }
} };

export const SME_GROUPS = [
  {
    "id": "week",
    "chip": {
      "ko": "SME 첫 주",
      "en": "First week"
    },
    "heading": {
      "ko": "SME가 된 첫 주",
      "en": "Your first week as an SME"
    },
    "situations": [
      {
        "id": "m1",
        "text": {
          "ko": "SME가 된 첫날이다",
          "en": "It's your first day as an SME"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 1 · SME가 된 첫날",
            "en": "SME First Steps lesson 1 · Your First Day as an SME"
          },
          "href": "../sme/#firstday-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ④ SME의 하루",
            "en": "Codex one-pager ④ An SME's day"
          },
          "href": "../codex/#daily-sme"
        }
      },
      {
        "id": "m2",
        "text": {
          "ko": "동료였던 선임이 승인 없이 처리하려 한다",
          "en": "A senior agent who was your peer wants to go ahead without approval"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 4 · 동료였던 선임 서포트",
            "en": "SME First Steps lesson 4 · Supporting Senior Agents Who Were Your Peers"
          },
          "href": "../sme/#peer-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 에스컬레이션 승인",
            "en": "SME SOP · Escalation Approval"
          },
          "href": "../sme-sop/#approval-0"
        }
      }
    ]
  },
  {
    "id": "new",
    "chip": {
      "ko": "신입·교육생",
      "en": "New hires"
    },
    "heading": {
      "ko": "신입과 교육 중인 상담사",
      "en": "New hires and agents in training"
    },
    "situations": [
      {
        "id": "m3",
        "text": {
          "ko": "다음 주 OJT 교육생이 플로어에 나온다",
          "en": "Trainees start OJT on the floor next week"
        },
        "first": {
          "title": {
            "ko": "SME 서포트 라이프사이클 레슨 1 · 교육 중인 상담사 지원",
            "en": "SME Support Lifecycle lesson 1 · Supporting Agents in Training"
          },
          "href": "../sme-lifecycle/#trainee-0"
        },
        "then": {
          "title": {
            "ko": "TL SOP · 신규 입사자 온보딩",
            "en": "TL SOP · New Hire Onboarding"
          },
          "href": "../sop-library/#onboarding-0"
        }
      },
      {
        "id": "m4",
        "text": {
          "ko": "네스팅 중인 신입이 같은 유형에서 계속 막힌다",
          "en": "A new hire in nesting keeps getting stuck on the same contact type"
        },
        "first": {
          "title": {
            "ko": "SME 서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원",
            "en": "SME Support Lifecycle lesson 2 · Supporting Agents Just Out of Training"
          },
          "href": "../sme-lifecycle/#graduate-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트",
            "en": "SME First Steps lesson 2 · Supporting Agents in Training or Just Trained"
          },
          "href": "../sme/#newcomer-0"
        }
      },
      {
        "id": "m5",
        "text": {
          "ko": "신입이 하루 종일 질문을 하지 않는다",
          "en": "A new hire hasn't asked a single question all day"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트",
            "en": "SME First Steps lesson 2 · Supporting Agents in Training or Just Trained"
          },
          "href": "../sme/#newcomer-0"
        },
        "then": {
          "title": {
            "ko": "SME 서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원",
            "en": "SME Support Lifecycle lesson 2 · Supporting Agents Just Out of Training"
          },
          "href": "../sme-lifecycle/#graduate-0"
        }
      }
    ]
  },
  {
    "id": "agents",
    "chip": {
      "ko": "기존·선임",
      "en": "Existing and senior agents"
    },
    "heading": {
      "ko": "기존 상담사와 선임",
      "en": "Existing and senior agents"
    },
    "situations": [
      {
        "id": "m6",
        "text": {
          "ko": "상담사가 권한 밖 보상 승인을 요청한다",
          "en": "An agent asks you to approve compensation they aren't authorized to give"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 에스컬레이션 승인",
            "en": "SME SOP · Escalation Approval"
          },
          "href": "../sme-sop/#approval-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 3 · 기존 상담사 서포트",
            "en": "SME First Steps lesson 3 · Supporting Existing Agents"
          },
          "href": "../sme/#escalation-0"
        }
      },
      {
        "id": "m7",
        "text": {
          "ko": "정식 상담사의 품질이 갑자기 떨어졌다",
          "en": "A regular agent's quality has suddenly dropped"
        },
        "first": {
          "title": {
            "ko": "SME 서포트 라이프사이클 레슨 3 · 정식 상담사 지원",
            "en": "SME Support Lifecycle lesson 3 · Supporting Regular Agents"
          },
          "href": "../sme-lifecycle/#regular-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 상담 트렌드 요약 보고",
            "en": "SME SOP · Contact Trend Summary Report"
          },
          "href": "../sme-sop/#trend-0"
        }
      },
      {
        "id": "m8",
        "text": {
          "ko": "선임이 SME나 팀장이 되고 싶어 한다",
          "en": "A senior agent wants to become an SME or team leader"
        },
        "first": {
          "title": {
            "ko": "SME 서포트 라이프사이클 레슨 4 · 선임 상담사 지원",
            "en": "SME Support Lifecycle lesson 4 · Supporting Senior Agents"
          },
          "href": "../sme-lifecycle/#senior-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ③ 커리어 매트릭스",
            "en": "Codex one-pager ③ Career Matrix"
          },
          "href": "../codex/#career"
        }
      }
    ]
  },
  {
    "id": "rush",
    "chip": {
      "ko": "요청이 몰릴 때",
      "en": "Request rush"
    },
    "heading": {
      "ko": "요청이 한꺼번에 몰릴 때",
      "en": "When requests pile up at once"
    },
    "situations": [
      {
        "id": "m9",
        "text": {
          "ko": "플로어와 메신저 요청이 한꺼번에 몰린다",
          "en": "Floor and messenger requests pile up at once"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 6 · 요청이 동시에 몰릴 때",
            "en": "SME First Steps lesson 6 · When Requests Pile Up at Once"
          },
          "href": "../sme/#priority-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 에스컬레이션 승인",
            "en": "SME SOP · Escalation Approval"
          },
          "href": "../sme-sop/#approval-0"
        }
      },
      {
        "id": "m10",
        "text": {
          "ko": "같은 질문이 여러 상담사에게서 계속 온다",
          "en": "Several agents keep asking the same question"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 지식 베이스 업데이트 요청",
            "en": "SME SOP · Knowledge Base Update Requests"
          },
          "href": "../sme-sop/#kbrequest-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 7 · 팀에 지식 돌려주기",
            "en": "SME First Steps lesson 7 · Giving Knowledge Back to the Team"
          },
          "href": "../sme/#knowledge-0"
        }
      }
    ]
  },
  {
    "id": "lead",
    "chip": {
      "ko": "팀장·품질",
      "en": "Team leader and quality"
    },
    "heading": {
      "ko": "팀장 지원과 품질",
      "en": "Team leader support and quality"
    },
    "situations": [
      {
        "id": "m11",
        "text": {
          "ko": "팀장이 자리를 비워 출석을 대신 봐야 한다",
          "en": "The team leader is away and you have to cover attendance"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 출석 관리 대행",
            "en": "SME SOP · Covering Attendance"
          },
          "href": "../sme-sop/#attendance-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 5 · 팀장 서포트",
            "en": "SME First Steps lesson 5 · Supporting the Team Leader"
          },
          "href": "../sme/#lead-0"
        }
      },
      {
        "id": "m12",
        "text": {
          "ko": "팀장에게 주간 코칭 요약을 보내야 한다",
          "en": "You need to send the team leader the weekly coaching summary"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 상담 트렌드 요약 보고",
            "en": "SME SOP · Contact Trend Summary Report"
          },
          "href": "../sme-sop/#trend-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 스크러빙",
            "en": "SME SOP · Scrubbing"
          },
          "href": "../sme-sop/#scrubbing-0"
        }
      },
      {
        "id": "m13",
        "text": {
          "ko": "팀장이 팀원별 현황을 물어본다",
          "en": "The team leader asks where each team member stands"
        },
        "first": {
          "title": {
            "ko": "SME 서포트 라이프사이클 레슨 5 · 팀장 지원",
            "en": "SME Support Lifecycle lesson 5 · Supporting the Team Leader"
          },
          "href": "../sme-lifecycle/#leadsupport-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 상담 트렌드 요약 보고",
            "en": "SME SOP · Contact Trend Summary Report"
          },
          "href": "../sme-sop/#trend-0"
        }
      },
      {
        "id": "m14",
        "text": {
          "ko": "고객사가 정책 변경을 보내왔다",
          "en": "The client has sent a policy change"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 고객사 업데이트 허들",
            "en": "SME SOP · Client Update Huddle"
          },
          "href": "../sme-sop/#huddle-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 지식 베이스 업데이트 요청",
            "en": "SME SOP · Knowledge Base Update Requests"
          },
          "href": "../sme-sop/#kbrequest-0"
        }
      },
      {
        "id": "m15",
        "text": {
          "ko": "캘리브레이션에 참석하게 됐다",
          "en": "You're joining a calibration session"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 캘리브레이션 참여와 기준 전달",
            "en": "SME SOP · Joining Calibration and Passing On Standards"
          },
          "href": "../sme-sop/#calibration-0"
        },
        "then": {
          "title": {
            "ko": "TL SOP · 캘리브레이션",
            "en": "TL SOP · Calibration"
          },
          "href": "../sop-library/#calibration-0"
        }
      },
      {
        "id": "m16",
        "text": {
          "ko": "같은 고객 불만이 계속 쌓인다",
          "en": "Complaints about the same issue keep piling up"
        },
        "first": {
          "title": {
            "ko": "SME SOP · VOC 리포팅",
            "en": "SME SOP · VOC Reporting"
          },
          "href": "../sme-sop/#voc-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 스크러빙",
            "en": "SME SOP · Scrubbing"
          },
          "href": "../sme-sop/#scrubbing-0"
        }
      }
    ]
  }
];
