// SME Situation Guide (2026-11-25): situations and where they lead. The Korean is
// the approved table in docs/superpowers/specs/2026-11-25-sme-guide-design.md §5;
// agent-lifecycle/tests/sme-guide.test.js keeps the two identical. The screen's
// other words are the team-lead guide's.
import { GUIDE_UI } from '../guide/data.js';

export const SME_GUIDE_UI = { ...GUIDE_UI, ...{
  "title": {
    "ko": "SME 상황별 길잡이"
  },
  "intro": {
    "ko": "지금 어떤 상황인가요? 누르면 먼저 볼 곳과 이어서 볼 곳을 알려 드립니다."
  }
} };

export const SME_GROUPS = [
  {
    "id": "week",
    "chip": {
      "ko": "SME 첫 주"
    },
    "heading": {
      "ko": "SME가 된 첫 주"
    },
    "situations": [
      {
        "id": "m1",
        "text": {
          "ko": "SME가 된 첫날이다"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 1 · SME가 된 첫날"
          },
          "href": "../sme/#firstday-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ④ SME의 하루"
          },
          "href": "../codex/#daily-sme"
        }
      },
      {
        "id": "m2",
        "text": {
          "ko": "동료였던 선임이 승인 없이 처리하려 한다"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 4 · 동료였던 선임 서포트"
          },
          "href": "../sme/#peer-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 에스컬레이션 승인"
          },
          "href": "../sme-sop/#approval-0"
        }
      }
    ]
  },
  {
    "id": "new",
    "chip": {
      "ko": "신입·교육생"
    },
    "heading": {
      "ko": "신입과 교육 중인 상담사"
    },
    "situations": [
      {
        "id": "m3",
        "text": {
          "ko": "다음 주 OJT 교육생이 플로어에 나온다"
        },
        "first": {
          "title": {
            "ko": "서포트 라이프사이클 레슨 1 · 교육 중인 상담사 지원"
          },
          "href": "../sme-lifecycle/#trainee-0"
        },
        "then": {
          "title": {
            "ko": "SOP · 신규 입사자 온보딩"
          },
          "href": "../sop-library/#onboarding-0"
        }
      },
      {
        "id": "m4",
        "text": {
          "ko": "네스팅 중인 신입이 같은 유형에서 계속 막힌다"
        },
        "first": {
          "title": {
            "ko": "서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원"
          },
          "href": "../sme-lifecycle/#graduate-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트"
          },
          "href": "../sme/#newcomer-0"
        }
      },
      {
        "id": "m5",
        "text": {
          "ko": "신입이 하루 종일 질문을 하지 않는다"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 2 · 교육 중·막 교육을 마친 상담사 서포트"
          },
          "href": "../sme/#newcomer-0"
        },
        "then": {
          "title": {
            "ko": "서포트 라이프사이클 레슨 2 · 교육을 마친 상담사 지원"
          },
          "href": "../sme-lifecycle/#graduate-0"
        }
      }
    ]
  },
  {
    "id": "agents",
    "chip": {
      "ko": "기존·선임"
    },
    "heading": {
      "ko": "기존 상담사와 선임"
    },
    "situations": [
      {
        "id": "m6",
        "text": {
          "ko": "상담사가 권한 밖 보상 승인을 요청한다"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 에스컬레이션 승인"
          },
          "href": "../sme-sop/#approval-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 3 · 기존 상담사 서포트"
          },
          "href": "../sme/#escalation-0"
        }
      },
      {
        "id": "m7",
        "text": {
          "ko": "정식 상담사의 품질이 갑자기 떨어졌다"
        },
        "first": {
          "title": {
            "ko": "서포트 라이프사이클 레슨 3 · 정식 상담사 지원"
          },
          "href": "../sme-lifecycle/#regular-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 상담 트렌드 요약 보고"
          },
          "href": "../sme-sop/#trend-0"
        }
      },
      {
        "id": "m8",
        "text": {
          "ko": "선임이 SME나 팀장이 되고 싶어 한다"
        },
        "first": {
          "title": {
            "ko": "서포트 라이프사이클 레슨 4 · 선임 상담사 지원"
          },
          "href": "../sme-lifecycle/#senior-0"
        },
        "then": {
          "title": {
            "ko": "Codex 원페이저 ③ 커리어 매트릭스"
          },
          "href": "../codex/#career"
        }
      }
    ]
  },
  {
    "id": "rush",
    "chip": {
      "ko": "요청이 몰릴 때"
    },
    "heading": {
      "ko": "요청이 한꺼번에 몰릴 때"
    },
    "situations": [
      {
        "id": "m9",
        "text": {
          "ko": "플로어와 메신저 요청이 한꺼번에 몰린다"
        },
        "first": {
          "title": {
            "ko": "SME 첫걸음 레슨 6 · 요청이 동시에 몰릴 때"
          },
          "href": "../sme/#priority-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 에스컬레이션 승인"
          },
          "href": "../sme-sop/#approval-0"
        }
      },
      {
        "id": "m10",
        "text": {
          "ko": "같은 질문이 여러 상담사에게서 계속 온다"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 지식 베이스 업데이트 요청"
          },
          "href": "../sme-sop/#kbrequest-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 7 · 팀에 지식 돌려주기"
          },
          "href": "../sme/#knowledge-0"
        }
      }
    ]
  },
  {
    "id": "lead",
    "chip": {
      "ko": "팀장·품질"
    },
    "heading": {
      "ko": "팀장 지원과 품질"
    },
    "situations": [
      {
        "id": "m11",
        "text": {
          "ko": "팀장이 자리를 비워 출석을 대신 봐야 한다"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 출석 관리 대행"
          },
          "href": "../sme-sop/#attendance-0"
        },
        "then": {
          "title": {
            "ko": "SME 첫걸음 레슨 5 · 팀장 서포트"
          },
          "href": "../sme/#lead-0"
        }
      },
      {
        "id": "m12",
        "text": {
          "ko": "팀장에게 주간 코칭 요약을 보내야 한다"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 상담 트렌드 요약 보고"
          },
          "href": "../sme-sop/#trend-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 스크러빙"
          },
          "href": "../sme-sop/#scrubbing-0"
        }
      },
      {
        "id": "m13",
        "text": {
          "ko": "팀장이 팀원별 현황을 물어본다"
        },
        "first": {
          "title": {
            "ko": "서포트 라이프사이클 레슨 5 · 팀장 지원"
          },
          "href": "../sme-lifecycle/#leadsupport-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 상담 트렌드 요약 보고"
          },
          "href": "../sme-sop/#trend-0"
        }
      },
      {
        "id": "m14",
        "text": {
          "ko": "고객사가 정책 변경을 보내왔다"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 고객사 업데이트 허들"
          },
          "href": "../sme-sop/#huddle-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 지식 베이스 업데이트 요청"
          },
          "href": "../sme-sop/#kbrequest-0"
        }
      },
      {
        "id": "m15",
        "text": {
          "ko": "캘리브레이션에 참석하게 됐다"
        },
        "first": {
          "title": {
            "ko": "SME SOP · 캘리브레이션 참여와 기준 전달"
          },
          "href": "../sme-sop/#calibration-0"
        },
        "then": {
          "title": {
            "ko": "SOP · 캘리브레이션"
          },
          "href": "../sop-library/#calibration-0"
        }
      },
      {
        "id": "m16",
        "text": {
          "ko": "같은 고객 불만이 계속 쌓인다"
        },
        "first": {
          "title": {
            "ko": "SME SOP · VOC 리포팅"
          },
          "href": "../sme-sop/#voc-0"
        },
        "then": {
          "title": {
            "ko": "SME SOP · 스크러빙"
          },
          "href": "../sme-sop/#scrubbing-0"
        }
      }
    ]
  }
];
