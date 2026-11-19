// Generated from docs/superpowers/specs/2026-11-19-codex-one-pagers-copy-ko.md
// (confirmed Korean) with English added. Edit both together; agent-lifecycle/tests/codex.test.js
// checks the Korean against the copy file.
export const PRINCIPLES = {
  "intro": {
    "ko": "우리의 BPO 운영을 단순한 반복이 아닌, 끊임없이 진화하는 코드로 최적화합니다.",
    "en": "We optimize our BPO operations not as simple repetition but as code that keeps evolving."
  },
  "note": {
    "ko": "Codex는 운영을 코드에 빗대어, 반복되는 문제를 '버그'로 보고 그것을 고치는 방법을 '최적화'로 설명합니다.",
    "en": "The Codex compares operations to code: a recurring problem is a 'bug', and the way to fix it is an 'optimization'."
  },
  "items": [
    {
      "id": "p1",
      "title": {
        "ko": "'하드코딩' 줄이기 → Master SOP 구축",
        "en": "Less 'hard-coding' → build a Master SOP"
      },
      "problem": {
        "ko": "비슷한 문제가 발생할 때마다 각기 다른 임시방편으로 해결하여 비효율과 혼란이 누적됩니다.",
        "en": "Each time a similar problem comes up, it is solved with a different stopgap, so inefficiency and confusion pile up."
      },
      "fix": {
        "ko": "자주 발생하는 문제 해결 절차를 표준운영절차(SOP)라는 하나의 '함수'로 만들어 누구나 동일한 방식으로 해결하게 합니다.",
        "en": "Turn the procedure for a frequent problem into a single 'function' called a standard operating procedure (SOP), so everyone solves it the same way."
      },
      "example": {
        "ko": "여러 프로젝트에서 'Total Quality Management SOP'나 '내부 케이스 관리 가이드라인'을 구축하는 것이 바로 이 작업에 해당합니다. 이를 전사적으로 확장하여 Master SOP 라이브러리를 만드는 것이 목표입니다.",
        "en": "Building a 'Total Quality Management SOP' or 'internal case management guidelines' across projects is exactly this work. The goal is to extend it company-wide into a Master SOP library."
      }
    },
    {
      "id": "p2",
      "title": {
        "ko": "'데이터 호출' 줄이기 → 정보의 중앙화",
        "en": "Fewer 'data calls' → centralize information"
      },
      "problem": {
        "ko": "정보가 여러 단계를 거쳐 전달되면서 병목 현상이 발생하고 의사결정이 느려집니다.",
        "en": "Information passes through several layers, which creates bottlenecks and slows decisions."
      },
      "fix": {
        "ko": "모든 핵심 성과 지표(FTE, SLA, 품질, CSAT 등)가 실시간으로 업데이트되는 통합 대시보드를 구축합니다.",
        "en": "Build one integrated dashboard where every key performance indicator (FTE, SLA, quality, CSAT and more) updates in real time."
      },
      "example": {
        "ko": "모든 이해관계자가 동일한 대시보드를 본다면, 불필요한 보고나 회의가 획기적으로 줄어듭니다. 클라이언트에게 정기적으로 비즈니스 리뷰를 보고했던 경험을 내부 시스템으로 가져오는 것과 같습니다.",
        "en": "When every stakeholder looks at the same dashboard, unnecessary reports and meetings drop sharply. It is like bringing the experience of regular business reviews with clients into the internal system."
      }
    },
    {
      "id": "p3",
      "title": {
        "ko": "'예외 처리' 추가 → 조기 경보 시스템 강화",
        "en": "Add 'exception handling' → strengthen early warning"
      },
      "problem": {
        "ko": "상담사의 갑작스러운 퇴사나 고객 불만 폭주 같은 예기치 못한 문제는 시스템 전체를 마비시킬 수 있습니다.",
        "en": "Unexpected problems, such as an agent leaving suddenly or a surge in customer complaints, can bring the whole system to a halt."
      },
      "fix": {
        "ko": "문제가 터지기 전에 미리 감지하는 '조기 경보 시스템(Early Warning System)'을 구축합니다.",
        "en": "Build an 'Early Warning System' that detects problems before they break out."
      },
      "example": {
        "ko": "특정 상담사의 평균 처리 시간(AHT)이 급증하거나 특정 제품 문의량이 급증하는 데이터를 실시간으로 분석하여, 문제가 커지기 전에 관리자에게 자동으로 경고를 보내는 시스템을 구축하는 것입니다.",
        "en": "For example, a system that analyzes in real time when an agent's average handle time (AHT) or the volume for one product jumps, and automatically alerts a manager before the problem grows."
      }
    },
    {
      "id": "p4",
      "title": {
        "ko": "'캐싱' 활용 → 지식 관리 시스템 고도화",
        "en": "Use 'caching' → upgrade knowledge management"
      },
      "problem": {
        "ko": "똑같은 고객 질문에 대해 여러 상담사가 각자 답변을 찾는 것은 엄청난 자원 낭비입니다.",
        "en": "Several agents each searching for the answer to the same customer question is a huge waste of resources."
      },
      "fix": {
        "ko": "자주 찾는 정보나 성공적인 답변 스크립트를 즉시 꺼내 쓸 수 있는 동적 지식 베이스(Knowledge Base)를 만듭니다.",
        "en": "Build a dynamic knowledge base where frequently needed information and proven answer scripts can be pulled out instantly."
      },
      "example": {
        "ko": "단순한 FAQ를 넘어, LLM 기반 검색 기능을 도입하여 상담사가 자연어로 질문해도 가장 적절한 답변과 관련 사례를 즉시 찾아주는 시스템을 구축하는 것입니다.",
        "en": "Going beyond a simple FAQ: a system with LLM-based search that instantly finds the best answer and related cases, even when an agent asks in plain language."
      }
    }
  ]
};
