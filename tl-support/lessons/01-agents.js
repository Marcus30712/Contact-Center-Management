import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// TL 서포트 라이프사이클, lesson 1. Copy: docs/superpowers/specs/2026-11-25-tl-support-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME courses.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["handover", "getback", "help", "stepin"];
const flow = ["handover", "getback", "help", "stepin", "handover-getback", "getback-help", "help-stepin"];

export default {
  id: "agents",
  order: 1,
  title: tx("상담사 지원", "Supporting Agents"),
  short: tx("상담사", "Agents"),
  subtitle: tx("기대를 분명히 하고, 정기적으로 듣고, 막힐 때 개입합니다.", "Make expectations clear, listen regularly, and step in when they're stuck."),
  procedure,
  diagram: {
    nodes: [
      wide(node("handover", "맡기기", 180, 36, "Hand over")),
      wide(node("getback", "받기", 180, 92, "Get back")),
      wide(node("help", "돕기", 180, 148, "Help")),
      wide(node("stepin", "개입하기", 180, 204, "Step in")),
    ],
    edges: [edge("handover", "getback"), edge("getback", "help"), edge("help", "stepin")],
  },
  steps: [
    step(tx("이 레슨의 목적은 팀장이 상담사를 지원하는 절차를 맡기기, 받기, 돕기, 개입하기 네 단계로 보는 것입니다. 상담사 한 사람의 성장 과정은 상담사 라이프사이클이 다루고, 여기서는 매주 반복되는 지원을 봅니다.", "This lesson looks at how a team leader supports agents in four stages: handing over, getting back, helping and stepping in. One agent's growth over time is covered by The Agent Lifecycle, so this lesson is about the support you give every week."), flow, procedure, null),
    step(tx("첫 단계는 맡기기입니다. 지민에게 기대하는 목표와 역할을 분명히 말합니다. 무엇이 잘한 것인지 모르면 상담사는 스스로 방향을 잡을 수 없습니다.", "The first stage is handing over. Tell Jimin clearly what goals and role you expect of her. Without knowing what good looks like, an agent can't find their own way."), flow, ["handover"], null),
    step(tx("둘째 단계는 받기입니다. 상담사에게서 받는 것은 숫자만이 아닙니다. 고객이 자주 묻는 것, 일하기 불편한 점 같은 현장의 이야기를 정기적인 1:1(예시: 2주에 한 번)로 듣습니다.", "The second stage is getting back. What you get from agents isn't only numbers. Hear the floor's stories, such as what customers often ask and what makes work awkward, in regular one-on-ones (Example: every two weeks)."), flow, ["getback"], null),
    step(tx("셋째 단계는 돕기입니다. 코칭, 칭찬, 필요한 도구와 자료를 줍니다. 서준처럼 합류한 지 얼마 안 된 사람에게는 직무전문가와 함께 더 가까이 붙습니다.", "The third stage is helping. Give coaching, praise, and the tools and materials they need. For someone new like Seojun, stay closer together with the SME."), flow, ["help"], null),
    step(tx("잘하는 사람도 지원이 필요합니다. 지민처럼 오래 일한 사람에게는 새 업무나 버디 역할로 성장할 기회를 줍니다.", "Strong performers need support too. Give long-serving people like Jimin chances to grow, such as new work or a buddy role."), flow, ["help"], null),
    step(tx("넷째 단계는 개입하기입니다. 같은 문제가 반복되거나 근태나 행동에 문제가 있으면 팀장이 직접 나섭니다. 코칭으로 풀리지 않으면 성과 개선 계획(PIP) 절차를 따릅니다.", "The fourth stage is stepping in. When the same problem keeps coming back, or there is an attendance or conduct issue, the team leader steps in directly. If coaching doesn't solve it, follow the performance improvement plan (PIP) procedure."), flow, ["stepin"], null),
    step(tx("개입은 빠를수록 작게 끝납니다. 몇 주 미루면 작은 습관이 큰 문제가 됩니다.", "The sooner you step in, the smaller it stays. Put it off for a few weeks and a small habit becomes a big problem."), flow, ["stepin"], null),
    step(tx("모든 상담사를 같은 방식으로 돕지 않습니다. 팀장 첫걸음에서 만든 개인 메모가 누구에게 무엇이 필요한지 알려 줍니다.", "You don't help every agent the same way. The personal notes you made in TL First Steps tell you who needs what."), flow, ["stepin"], null),
  ],
  checkpoint: [
    {
      id: "agents-q1",
      prompt: tx("서준이 이번 주 처리 목표를 몰랐다고 말합니다. 어느 단계가 빠졌을까요?", "Seojun says he didn't know this week's target. Which stage was missed?"),
      options: [
        option("a", tx("돕기: 코칭이 부족했다.", "Helping: there wasn't enough coaching."), tx("코칭 전에, 무엇을 기대하는지부터 전해졌어야 합니다.", "Before coaching, what you expect should have been made clear.")),
        option("b", tx("맡기기: 기대하는 목표를 분명히 전하지 않았다.", "Handing over: the expected goal wasn't made clear.")),
        option("c", tx("개입하기: 더 일찍 지적했어야 했다.", "Stepping in: you should have pointed it out sooner."), tx("목표를 모르는 사람에게 지적은 소용이 없습니다. 먼저 목표를 알려야 합니다.", "Pointing things out does nothing for someone who doesn't know the goal. Share the goal first.")),
      ],
      answer: "b",
      explanation: tx("지원은 기대를 분명히 하는 데서 시작합니다.", "Support starts with making expectations clear."),
    },
    {
      id: "agents-q2",
      prompt: tx("지민의 같은 실수가 코칭 뒤에도 몇 주째 반복됩니다. 알맞은 것은 무엇일까요?", "Jimin keeps making the same mistake for weeks, even after coaching. What fits?"),
      options: [
        option("a", tx("지민이 스스로 고치기를 더 기다린다.", "Wait longer for Jimin to fix it herself."), tx("미룰수록 작은 습관이 큰 문제가 되고, 개입은 더 어려워집니다.", "The longer you wait, the bigger a small habit grows, and the harder it is to step in.")),
        option("b", tx("직접 개입해 원인을 함께 보고, 계속되면 PIP 절차를 검토한다.", "Step in directly, look at the cause together, and consider the PIP procedure if it continues.")),
        option("c", tx("직무전문가에게 지민의 실수를 맡긴다.", "Hand Jimin's mistake over to the SME."), tx("반복되는 성과 문제의 관리는 팀장의 몫입니다. 직무전문가는 업무를 돕지만 평가하거나 조치하지 않습니다.", "Managing repeated performance problems is the team leader's job. The SME helps with the work but doesn't evaluate or take action.")),
      ],
      answer: "b",
      explanation: tx("코칭으로 풀리지 않는 반복 문제는 팀장이 직접 개입합니다.", "When coaching doesn't fix a repeated problem, the team leader steps in directly."),
    },
  ],
  connection: { to: "sme", text: tx("상담사를 가장 가까이에서 돕는 사람은 직무전문가입니다. 다음은 팀장이 직무전문가를 지원하는 법입니다.", "The person who helps agents most closely is the SME. Next is how a team leader supports the SME.") },
};
