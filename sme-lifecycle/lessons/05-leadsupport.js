import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 서포트 라이프사이클, lesson 5. Approved copy: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME First Steps lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["status", "scope", "handoff", "restart"];
const flow = ["status", "scope", "handoff", "restart", "status-scope", "scope-handoff", "handoff-restart"];

export default {
  id: "leadsupport",
  order: 5,
  title: tx("팀장 지원", "Supporting the Team Leader"),
  short: tx("팀장 지원", "Lead support"),
  subtitle: tx("단계마다 본 것을 팀장에게 모으고, 다시 처음으로 돌아갑니다.", "Bring what you saw at each stage to the team leader, then start again."),
  personaName: tx("서준", "Seojun"),
  procedure,
  diagram: {
    nodes: [
      wide(node("status", "단계 현황", 180, 36, "Stage status")),
      wide(node("scope", "대행 범위", 180, 92, "Delegated scope")),
      wide(node("handoff", "넘기는 기준", 180, 148, "Hand-off rules")),
      wide(node("restart", "다시 처음으로", 180, 204, "Back to the start")),
    ],
    edges: [edge("status", "scope"), edge("scope", "handoff"), edge("handoff", "restart")],
  },
  steps: [
    step(tx("이 레슨의 목적은 앞의 네 단계에서 본 것을 팀장에게 모아, 팀장이 사람마다 다음 단계를 정하도록 돕는 것입니다. 출석 관리, 트렌드 요약, 허들 같은 대행 업무는 SME 첫걸음 레슨 5에서 다뤘습니다.", "This lesson is about bringing what you saw in the first four stages to the team leader, so the team leader can decide each person's next stage. Delegated work such as attendance, trend summaries and huddles was covered in SME First Steps lesson 5."), flow, procedure, null),
    step(tx("수진 팀장은 매주 월요일(예시) 팀원마다 다음 단계를 정합니다. 누구를 네스팅에서 정식 팀으로 넘길지, 누구에게 버디를 맡길지 같은 결정입니다.", "Every Monday (Example), Sujin decides the next stage for each team member. These are decisions such as who moves from nesting to a regular team and who becomes a buddy."), flow, [], null),
    step(tx("첫 단계는 단계 현황 정리입니다. 팀원마다 지금 어느 단계인지, 지난주에 본 것, 다음 단계로 갈 신호가 있는지를 한 줄씩 적습니다.", "The first stage is putting together the stage status. For each team member, write one line: their current stage, what you saw last week, and any sign they are ready for the next stage."), flow, ["status"], null),
    step(tx("예를 들어 \"서준: 정식 석 달 차, 새 요금제 문의 안정, 다른 상담사 질문에 답하기 시작\"처럼 씁니다. 수진 팀장은 이 한 줄로 서준에게 다음 기수의 버디를 맡길지 정할 수 있습니다.", "For example, write \"Seojun: three months as a regular agent, steady on new-plan contacts, starting to answer other agents' questions.\" From that one line, Sujin can decide whether to make Seojun a buddy for the next class."), flow, ["status"], null),
    step(tx("둘째 단계는 대행 범위 맞추기입니다. SME가 대신 하는 일과 하지 않는 일을 분기마다(예시) 수진 팀장과 다시 확인합니다. 팀 인원이나 정책이 바뀌면 범위도 바뀝니다.", "The second stage is aligning the delegated scope. Each quarter (Example), check again with Sujin what the SME does on her behalf and what the SME doesn't do. When team size or policies change, the scope changes too."), flow, ["scope"], null),
    step(tx("셋째 단계는 넘기는 기준입니다. 근태, 성과 조치, 개인 사정, 정책 밖 승인은 단계와 상관없이 팀장에게 넘깁니다. 넘길 때는 있었던 일을 사실대로 적어 함께 보냅니다.", "The third stage is the hand-off rules. Attendance, performance actions, personal matters and approvals outside policy go to the team leader at any stage. When you hand something off, send a factual note of what happened with it."), flow, ["handoff"], null),
    step(tx("넘긴 건은 결과도 물어 기록해 둡니다. 같은 일이 다시 생기면 어떻게 할지 알게 됩니다.", "Ask how handed-off cases turned out, and record it. Next time the same thing happens, you will know what to do."), flow, ["handoff"], null),
    step(tx("넷째 단계는 다시 처음으로입니다. 새 교육 기수가 들어오면 SME의 지원은 다시 교육 중 단계에서 시작합니다. 지난 기수의 기록은 트레이너와 함께 보며 다음 기수를 준비하는 데 씁니다.", "The fourth stage is going back to the start. When a new training class arrives, the SME's support starts again at the in-training stage. Use the last class's records with the trainer to prepare for the next one."), flow, ["restart"], null),
    step(tx("한 바퀴를 돌 때마다 팀의 기록이 쌓이고, 같은 곳에서 막히는 사람이 줄어듭니다.", "Each time around, the team's records grow and fewer people get stuck in the same places."), flow, ["restart"], null),
  ],
  checkpoint: [
    {
      id: "leadsupport-q1",
      prompt: tx("수진 팀장이 월요일 회의 전에 팀원 현황을 부탁했습니다. 알맞은 것은 무엇일까요?", "Sujin asks for a team status before the Monday meeting. Which fits best?"),
      options: [
        option("a", tx("지난주에 문제가 있었던 팀원만 골라 보낸다.", "Send only the team members who had problems last week."), tx("잘하고 있는 팀원의 성장 신호가 빠지면, 팀장은 누구를 다음 단계로 키울지 정할 수 없습니다.", "Without the growth signs of those doing well, the team leader can't decide whom to move to the next stage.")),
        option("b", tx("팀원마다 지금 단계, 지난주에 본 것, 다음 단계 신호를 한 줄씩 적어 보낸다.", "Send one line per team member: current stage, what you saw last week, and signs for the next stage.")),
        option("c", tx("지난주 하루 일과를 시간대별로 길게 적어 보낸다.", "Send a long hour-by-hour log of last week."), tx("팀장이 결정에 필요한 것은 사람별 단계와 신호입니다. 긴 일지에서는 그것을 찾기 어렵습니다.", "What the team leader needs for decisions is each person's stage and signs. They are hard to find in a long log.")),
      ],
      answer: "b",
      explanation: tx("단계 현황은 사람마다 한 줄로, 다음 결정을 내릴 수 있게 씁니다.", "Write the stage status as one line per person, so the next decision can be made from it."),
    },
    {
      id: "leadsupport-q2",
      prompt: tx("정식 상담사 한 명의 결근이 늘고, 업무 요청도 갑자기 많아졌습니다. 어떻게 할까요?", "A regular agent is absent more often, and their work requests have suddenly risen too. What do you do?"),
      options: [
        option("a", tx("SME가 직접 이유를 묻고 근무 시간을 조정해 준다.", "Ask the reason yourself and adjust their work hours."), tx("근태와 개인 사정은 팀장이 맡습니다. SME가 조정하면 같은 상황의 다른 팀원과 기준이 달라집니다.", "Attendance and personal matters belong to the team leader. If the SME adjusts them, the rules differ from others in the same situation.")),
        option("b", tx("늘어난 업무 요청은 다시 가까이 지원하고, 결근과 변화는 사실대로 적어 팀장에게 넘긴다.", "Support the extra work requests closely again, and hand the absences and changes to the team leader as facts.")),
        option("c", tx("정식 상담사이니 지켜보기만 한다.", "They are a regular agent, so just watch."), tx("변화를 알고도 넘기지 않으면 팀장은 문제가 커진 뒤에야 알게 됩니다.", "If you know about a change and don't pass it on, the team leader finds out only after the problem has grown.")),
      ],
      answer: "b",
      explanation: tx("업무 지원은 SME가, 근태와 개인 사정은 팀장이 맡습니다. 둘을 나눠 처리합니다.", "The SME handles work support; the team leader handles attendance and personal matters. Deal with the two separately."),
    },
  ],
  connection: { to: "home", text: tx("서포트 라이프사이클을 마쳤습니다. 에스컬레이션 승인, 스크러빙 같은 절차는 SME SOP 라이브러리에서 하나씩 자세히 다룰 예정입니다.", "You have finished Support Lifecycle. Procedures such as escalation approval and scrubbing will be covered one by one in the SME SOP Library.") },
};
