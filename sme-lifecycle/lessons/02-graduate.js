import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// SME 서포트 라이프사이클, lesson 2. Approved copy: docs/superpowers/specs/2026-11-25-sme-lifecycle-copy-ko.md (2026-11-25).
// Four stages run down one column, like the SME First Steps lessons.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["intake", "interval", "taper", "review"];
const flow = ["intake", "interval", "taper", "review", "intake-interval", "interval-taper", "taper-review"];

export default {
  id: "graduate",
  order: 2,
  title: tx("네스팅 중인 상담사 지원", "Supporting Agents in Nesting"),
  short: tx("네스팅", "Nesting"),
  subtitle: tx("가까이 붙었다가, 정해 둔 기준에 따라 조금씩 떨어집니다.", "Start close, then step back type by type, by an agreed rule."),
  personaName: tx("서준", "Seojun"),
  procedure,
  diagram: {
    nodes: [
      wide(node("intake", "인계받기", 180, 36, "Take the handover")),
      wide(node("interval", "지원 간격 정하기", 180, 92, "Set check-ins")),
      wide(node("taper", "지원 줄여 가기", 180, 148, "Ease off")),
      wide(node("review", "수료 점검", 180, 204, "Graduation review")),
    ],
    edges: [edge("intake", "interval"), edge("interval", "taper"), edge("taper", "review")],
  },
  steps: [
    step(tx("이 레슨의 목적은 네스팅 기간에 지원을 얼마나 가까이 시작해 언제 줄일지, 그리고 수료해 정식 팀으로 넘기는 기준을 아는 것입니다. 옆에서 돕는 방법은 직무전문가 첫걸음 레슨 2에서 다뤘습니다.", "This lesson is about how close to start support in nesting, when to step back, and the rule for graduating to a regular team. How to help from beside the agent was covered in SME First Steps lesson 2."), flow, procedure, null),
    step(tx("서준이 OJT를 마쳤습니다. 수료 전 마지막 단계로, 앞으로 2주(예시) 동안 네스팅 그룹에서 실제 문의를 받습니다.", "Seojun has finished OJT. As the last stage before graduation, he takes real contacts in the nesting group for the next two weeks (Example)."), flow, [], null),
    step(tx("첫 단계는 인계받기입니다. 트레이너에게 OJT 관찰 기록을 받고, 서준이 아직 혼자 받아 보지 않은 문의 유형을 확인합니다. 네스팅 동안 그 유형들을 고루 경험하게 합니다.", "The first stage is taking the handover. Get the OJT observation record from the trainer, and check which contact types Seojun has not yet handled alone. Make sure he meets each of those types during nesting."), flow, ["intake"], null),
    step(tx("둘째 단계는 지원 간격 정하기입니다. 첫 주(예시)에는 정해진 간격으로 먼저 다가가고, 어려운 유형은 보내기 전에 함께 봅니다. 간격과 함께 볼 유형은 수진 팀장과 미리 맞춥니다.", "The second stage is setting check-ins. In the first week (Example), go to him at set intervals, and go over hard contacts with him before he sends his reply. Agree on the interval and the types with Sujin, the team leader, beforehand."), flow, ["interval"], null),
    step(tx("매일 끝에 세 가지를 짧게 적습니다. 혼자 끝낸 유형, 도움을 받은 유형, 에스컬레이션한 건입니다.", "At the end of each day, write down three things briefly. The types he finished alone, the types he needed help with, and the cases he escalated."), flow, ["interval"], null),
    step(tx("셋째 단계는 지원 줄여 가기입니다. 한 유형을 며칠 연속(예시) 혼자 끝내면, 그 유형은 먼저 확인하지 않고 요청이 올 때만 봅니다.", "The third stage is easing off. Once he finishes a type alone several days in a row (Example), stop checking that type first and look at it only when he asks."), flow, ["taper"], null),
    step(tx("지원은 한꺼번에 끊지 않고 유형별로 줄입니다. 옆에서 직접 돕는 대신 채팅으로 필요한 정책 문서 링크를 보내, 서준이 스스로 찾아 처리하게 합니다. 갑자기 혼자 남으면 신입은 묻기를 더 망설입니다.", "Step back type by type, not all at once. Instead of helping directly, send links to the policy articles he needs in chat, so he finds and handles it himself. Left alone suddenly, new hires hesitate even more to ask."), flow, ["taper"], null),
    step(tx("무엇이 바뀌는지 서준에게 미리 말합니다. \"이제 배송 문의는 혼자 해도 돼요. 막히면 언제든 불러요.\"라고 하면 떨어지는 것이 버려지는 것이 아니라 인정받는 것으로 들립니다.", "Tell Seojun ahead of time what is changing. Say \"You can handle shipping contacts on your own now. Call me any time you get stuck,\" and stepping back sounds like recognition, not being left alone."), flow, ["taper"], null),
    step(tx("넷째 단계는 수료 점검입니다. 네스팅이 끝나기 전에 기록을 트레이너, 수진 팀장과 함께 보고 의견을 전합니다. 수료해 정식 팀으로 보낼지 네스팅을 늘릴지는 트레이너와 팀장이 정합니다.", "The fourth stage is the graduation review. Before nesting ends, go through the record with the trainer and Sujin and give your view. The trainer and the team leader decide whether he graduates to a regular team or stays longer in nesting."), flow, ["review"], null),
    step(tx("정식 팀으로 넘어갈 때는 아직 자주 막히는 유형을 함께 넘깁니다. 다른 팀으로 가면 그 팀의 직무전문가와 팀장에게, 같은 팀에 남으면 내 기록에 표시해 둡니다.", "When he moves to a regular team, pass on the types where he still often gets stuck. If he goes to another team, tell its SME and team leader; if he stays, mark them in your own record."), flow, ["review"], null),
  ],
  checkpoint: [
    {
      id: "graduate-q1",
      prompt: tx("서준이 배송 문의를 사흘 연속(예시) 혼자 끝냈습니다. 알맞은 것은 무엇일까요?", "Seojun has handled shipping contacts alone three days in a row (Example). What fits best?"),
      options: [
        option("a", tx("배송을 혼자 해냈으니 오늘부터 모든 문의 지원을 멈추고 혼자 맡긴다.", "He handled shipping alone, so stop all support from today and let him work on his own."), tx("한 유형이 익숙해졌다고 다른 유형까지 준비된 것은 아닙니다. 지원은 유형별로 줄입니다.", "Being comfortable with one type doesn't mean he is ready for others. Step back type by type.")),
        option("b", tx("배송 문의는 요청할 때만 보기로 하고, 바뀐 점을 서준에게 알린다.", "Look at shipping contacts only when he asks, and tell Seojun about the change.")),
        option("c", tx("아직 네스팅 기간이니 배송 문의까지 포함해 모든 문의를 계속 먼저 확인한다.", "It's still nesting, so keep checking every contact first, shipping included."), tx("혼자 할 수 있는 것까지 계속 확인하면 서준은 스스로 판단할 기회를 잃고, 다른 신입을 도울 시간도 줄어듭니다.", "Checking even what he can do alone takes away his chance to judge for himself, and leaves less time for other new hires.")),
      ],
      answer: "b",
      explanation: tx("기준에 닿은 유형부터 하나씩 지원을 줄이고, 바뀌는 것을 미리 말합니다.", "Step back one type at a time, starting with types that meet the rule, and say what is changing ahead of time."),
    },
    {
      id: "graduate-q2",
      prompt: tx("네스팅 마지막 주인데 서준이 환불 문의에서 계속 막힙니다. 어떻게 할까요?", "It's the last week of nesting, and Seojun keeps getting stuck on refund contacts. What do you do?"),
      options: [
        option("a", tx("기간이 끝났으니 예정대로 정식 팀으로 보내고, 환불 문의는 그 팀에서 익히게 한다.", "The period is over, so send him to a regular team as planned and let him learn refunds there."), tx("막히는 유형을 그대로 두고 넘기면 정식 팀에서 고객과 서준이 함께 힘들어집니다.", "Moving him with that type unresolved makes things hard for both the customer and Seojun on the regular team.")),
        option("b", tx("기록을 트레이너, 수진 팀장과 함께 보고, 네스팅 연장이나 추가 교육을 상의한다.", "Review the record with the trainer and Sujin, and discuss extending nesting or more training.")),
        option("c", tx("서준이 지치지 않게, 앞으로 환불 문의는 직무전문가가 대신 처리하겠다고 한다.", "So Seojun doesn't burn out, say the SME will handle refund contacts for him from now on."), tx("대신 처리해 주면 서준은 그 유형을 끝내 배우지 못하고, 직무전문가의 하루도 막힙니다.", "If you handle them for him, Seojun never learns that type, and your own day gets blocked.")),
      ],
      answer: "b",
      explanation: tx("수료할지 네스팅을 늘릴지는 트레이너와 팀장이 정합니다. 직무전문가는 막히는 유형을 기록으로 보여 줍니다.", "The trainer and the team leader decide whether he graduates or nesting is extended. The SME shows the stuck types through the record."),
    },
  ],
  connection: { to: "regular", text: tx("서준이 수료하고 정식 팀에 합류했습니다. 이제 직무전문가가 먼저 다가가는 대신, 서준이 필요할 때 찾아오는 관계로 바뀝니다.", "Seojun has graduated and joined a regular team. Now, instead of the SME going to him first, he comes to the SME when he needs to.") },
};
