import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 상담사 커리어 라이프사이클, lesson 3. Approved copy: docs/superpowers/specs/2026-11-26-agent-career-copy-ko.md (2026-11-26).
// Stages run down one column.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["attitude", "record", "people", "coaching", "backup"];
const flow = ["attitude", "record", "people", "coaching", "backup", "attitude-record", "record-people", "people-coaching", "coaching-backup"];

export default {
  id: "tlprep",
  order: 3,
  title: tx("팀장 준비", "Getting Ready to Be a Team Leader"),
  short: tx("팀장 준비", "Ready for TL"),
  subtitle: tx("직무전문가에서 팀장으로 갈 때 보는 다섯 가지가 있습니다.", "Five things are checked when an SME moves up to team leader."),
  personaName: tx("지민", "Jimin"),
  procedure,
  diagram: {
    nodes: [
      wide(node("attitude", "근태·태도", 180, 36, "Attendance and attitude")),
      wide(node("record", "깨끗한 기록", 180, 80, "Clean record")),
      wide(node("people", "피플 매니지먼트", 180, 124, "People management")),
      wide(node("coaching", "코칭", 180, 168, "Coaching")),
      wide(node("backup", "백업 지표", 180, 212, "Backup metrics")),
    ],
    edges: [edge("attitude", "record"), edge("record", "people"), edge("people", "coaching"), edge("coaching", "backup")],
  },
  steps: [
    step(tx("이 레슨의 목적은 직무전문가에서 팀장으로 갈 때 보는 다섯 가지를 아는 것입니다. 기준은 센터마다 다르지만, 순서는 대개 이렇습니다.", "This lesson is about knowing the five things checked when an SME moves up to team leader. The criteria differ by center, but this is the usual order."), flow, procedure, null),
    step(tx("하린은 요즘 수진 팀장이 자리를 비울 때 팀장 백업을 맡습니다. 지민은 하린이 팀장 모집에 지원하려고 무엇을 준비하는지 물었습니다.", "These days Harin covers for Sujin as team leader backup when Sujin is away. Jimin asked how Harin is getting ready to apply for a team leader opening."), flow, [], null),
    step(tx("첫 단계는 근태와 태도입니다. 팀장은 팀원의 근태를 챙기는 사람이라, 내 근태와 태도가 먼저 본보기가 되어야 합니다.", "The first stage is attendance and attitude. A team leader looks after the team's attendance, so your own attendance and attitude must set the example first."), flow, ["attitude"], null),
    step(tx("둘째 단계는 깨끗한 기록입니다. 최근 6개월(예시) 동안 고객이나 고객사의 에스컬레이션, 사내 내규 위반으로 받은 징계 기록이 없는지 봅니다.", "The second stage is a clean record. They check that you've had no escalations from customers or the client, and no disciplinary action for breaking company rules, in the last 6 months (Example)."), flow, ["record"], null),
    step(tx("셋째 단계는 피플 매니지먼트입니다. 팀원 사이의 관계 갈등, 일에 대한 불만족, 퇴사 고민 같은 문제를 어떤 절차로 풀어야 하는지 알고 있어야 합니다.", "The third stage is people management. You need to know the process for problems like conflict between team members, dissatisfaction with the work, and thoughts of quitting."), flow, ["people"], null),
    step(tx("괴롭힘처럼 무거운 문제는 혼자 해결하려 하지 않고, 당사자의 이야기를 사실대로 기록해 회사 절차대로 팀장과 인사 담당에게 넘깁니다. 지금의 절차에서 고칠 점을 제안할 수 있으면 더 좋습니다.", "Serious problems like harassment aren't handled alone: write down exactly what the person told you and pass it to the team leader and HR, following the company process. It's even better if you can suggest improvements to the current process."), flow, ["people"], null),
    step(tx("넷째 단계는 코칭입니다. 팀원 코칭을 어떻게 준비하는지, 코칭이 어떤 순서로 이어지는지 알고, 더 나은 방법을 제안할 수 있어야 합니다.", "The fourth stage is coaching. You need to know how to prepare for coaching a team member and what steps it follows, and be able to suggest better ways."), flow, ["coaching"], null),
    step(tx("하린은 상담사를 도울 때마다 무엇이 막혔고 어떻게 말했는지 짧게 적어 둡니다. 이 기록이 팀장이 되었을 때 코칭을 준비하는 연습이 됩니다.", "Each time Harin helps an agent, she writes a short note on what was stuck and what she said. These notes become practice for preparing coaching once she is a team leader."), flow, ["coaching"], null),
    step(tx("다섯째 단계는 팀장 백업 때의 팀 지표입니다. 팀장이 없는 날에도 팀의 지표를 지켰는지가 가장 눈에 보이는 근거가 됩니다.", "The fifth stage is the team's metrics during team leader backup. Whether you kept the team's metrics on track on days without the team leader is the most visible evidence."), flow, ["backup"], null),
    step(tx("미소의 한마디: 저는 팀장 백업을 맡은 날을 그냥 버티는 날로 생각했어요. 그날의 지표와 내가 한 일을 적어 뒀다면, 팀장 면접에서 가장 좋은 근거가 됐을 거예요.", "A word from Miso: I treated my team leader backup days as days to just get through. If I'd written down that day's metrics and what I did, it would have been my best evidence in the team leader interview."), flow, ["backup"], null),
  ],
  checkpoint: [
    {
      id: "tlprep-q1",
      prompt: tx("직무전문가에서 팀장으로 갈 때 가장 먼저 보는 것은 무엇일까요?", "When an SME moves up to team leader, what do they look at first?"),
      options: [
        option("a", tx("팀장 백업 횟수", "Times covering as team leader backup"), tx("백업 때의 지표도 보지만, 그보다 먼저 근태와 태도를 봅니다.", "Backup metrics count too, but attendance and attitude come first.")),
        option("b", tx("근태와 업무 태도", "Attendance and work attitude")),
        option("c", tx("직무전문가 경력 기간", "Length of time as an SME"), tx("기간보다 근태와 태도, 최근 기록, 사람을 이끄는 준비를 먼저 봅니다.", "Attendance and attitude, the recent record and readiness to lead people come before time in the role.")),
      ],
      answer: "b",
      explanation: tx("팀장은 팀원의 근태를 챙기는 사람입니다. 그래서 내 근태와 태도가 가장 먼저 기준이 됩니다.", "A team leader looks after the team's attendance. So your own attendance and attitude are the first criterion."),
    },
    {
      id: "tlprep-q2",
      prompt: tx("팀원 한 명이 동료에게 괴롭힘을 당하고 있다고 하린에게 털어놓았습니다. 팀장 백업 중인 하린에게 알맞은 행동은 무엇일까요?", "A team member tells Harin she is being harassed by a colleague. What fits best for Harin, who is covering as team leader backup?"),
      options: [
        option("a", tx("둘을 함께 불러, 서로 오해를 풀게 한다.", "Call the two in together so they clear up the misunderstanding."), tx("괴롭힘은 당사자를 한자리에 부르면 더 다칠 수 있습니다. 회사 절차를 따릅니다.", "With harassment, bringing the two together can hurt the person more. Follow the company process.")),
        option("b", tx("일이 커지지 않게, 당분간 둘의 근무 시간을 떨어뜨려 둔다.", "To keep it from growing, keep their shifts apart for a while."), tx("혼자 정해 덮으면 문제가 남습니다. 기록해서 절차대로 넘겨야 합니다.", "Deciding alone and covering it up leaves the problem in place. Record it and pass it on through the process.")),
        option("c", tx("들은 내용을 기록해, 절차대로 팀장과 인사 담당에게 넘긴다.", "Write down exactly what she told you and pass it to the team leader and HR, following the company process.")),
      ],
      answer: "c",
      explanation: tx("무거운 문제는 혼자 해결하지 않습니다. 사실을 기록하고 절차대로 넘기는 것이 팀원을 지키는 길입니다.", "Serious problems aren't handled alone. Recording the facts and passing them on through the process is how you protect the team member."),
    },
  ],
  connection: { to: "tl", text: tx("준비할 것을 알았으니, 이제 팀장이 실제로 하는 일을 봅니다. 다음은 수진 팀장을 만납니다.", "Now that you know what to prepare, see what a team leader actually does. Next, meet Sujin.") },
};
