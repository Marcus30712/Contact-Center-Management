import { tx, node, edge, step, option } from '../../agent-lifecycle/js/lessons/build.js';

// 부매니저 SOP 라이브러리, procedure 4. Approved copy: docs/superpowers/specs/2026-11-28-am-sop-copy-ko.md (2026-11-28).
// The steps run down one column, like the SOP Library.
const wide = (n) => ({ ...n, hw: 76 });

const procedure = ["find", "rate", "owner", "update"];
const flow = ["find", "rate", "owner", "update", "find-rate", "rate-owner", "owner-update"];

export default {
  id: "risk",
  order: 4,
  title: tx("리스크 관리 대장", "The Risk Register"),
  short: tx("리스크 대장", "Risk register"),
  subtitle: tx("아직 터지지 않은 위험을 적고, 담당과 대응을 정해 매주 갱신합니다.", "Write down risks that haven't happened yet, assign owners and responses, and update it every week."),
  roles: tx("팀장 → 부매니저 → 매니저", "Team leader → AM → Manager"),
  personaName: tx("민석", "Minseok"),
  procedure,
  diagram: {
    nodes: [
      wide(node("find", "찾기", 180, 36, "Find")),
      wide(node("rate", "등급 매기기", 180, 92, "Rate")),
      wide(node("owner", "담당 정하기", 180, 148, "Assign an owner")),
      wide(node("update", "매주 갱신", 180, 204, "Update weekly")),
    ],
    edges: [edge("find", "rate"), edge("rate", "owner"), edge("owner", "update")],
  },
  steps: [
    step(tx("이 절차의 목적은 아직 문제가 되지 않은 위험을 미리 적어 두고, 담당과 대응을 정해 매니저가 판단할 수 있게 하는 것입니다.", "This procedure exists to write down risks before they become problems and to assign owners and responses, so the manager can make the call."), flow, procedure, null),
    step(tx("첫 단계는 찾기입니다. 주간 미팅, 에스컬레이션 기록, 근태와 퇴사 예정, 고객사의 변경 예고에서 위험을 찾습니다. 유키 팀장이 다음 달 일본 마켓 상담사 2명(예시)의 퇴사 예정을 알려 왔습니다.", "The first step is finding them. Look for risks in the weekly meeting, the escalation record, attendance and planned resignations, and the client's announced changes. Yuki reports that 2 Japanese market agents (Example) plan to leave next month."), flow, ["find"], null),
    step(tx("둘째 단계는 등급 매기기입니다. 일어날 가능성과 일어났을 때의 영향을 각각 높음·중간·낮음으로 적습니다. 둘 다 높으면 매니저에게 바로 알릴 건입니다.", "The second step is rating them. Write the likelihood and the impact if it happens, each as high, medium or low. If both are high, tell the manager right away."), flow, ["rate"], null),
    step(tx("셋째 단계는 담당 정하기입니다. 위험마다 담당자, 줄이는 방법, 확인할 날짜를 적습니다. 일본 마켓 건은 유키 팀장이 담당하고, 채용 요청과 다른 마켓 지원 가능 인원을 확인합니다.", "The third step is assigning an owner. For each risk, write the owner, how to reduce it and the date to check. Yuki owns the Japan case and checks the hiring request and how many people other markets could lend."), flow, ["owner"], null),
    step(tx("평소 채용이나 비용이 걸린 대응은 민석이 정하지 않습니다. 선택지와 숫자를 정리해 정은 매니저에게 올리고, 매니저가 정합니다.", "Day to day, Minseok doesn't decide responses that involve hiring or cost. He lays out the options and numbers for Jeongeun, and the manager decides."), flow, ["owner"], null),
    step(tx("넷째 단계는 매주 갱신입니다. 주간 미팅 뒤 대장을 열어 새 위험을 더하고, 끝난 위험은 닫고, 등급이 바뀐 위험은 고칩니다.", "The fourth step is updating it weekly. After the weekly meeting, open the register, add new risks, close finished ones and change any whose rating has moved."), flow, ["update"], null),
    step(tx("대장은 정은 매니저와 매주 1:1(예시)에서 함께 봅니다. 높은 등급 위험은 비즈니스 리뷰 전에 고객사에 미리 알릴지 매니저가 판단합니다.", "Minseok goes through the register with Jeongeun in their weekly 1:1 (Example). For high-rated risks, the manager decides whether to tell the client before the business review."), flow, ["update"], null),
    step(tx("미소의 한마디: 퇴사 예정을 알고도 적어 두지 않았다가, 한 달 뒤 응대율이 무너지고 나서야 보고한 적이 있어요. 적어 두는 것만으로도 매니저가 미리 움직일 수 있었어요.", "A word from Miso: I once knew about planned resignations and didn't write them down, and reported only after the answer rate collapsed a month later. Just writing it down would have let the manager move early."), flow, ["update"], null),
  ],
  checkpoint: [
    {
      id: "risk-q1",
      prompt: tx("유키 팀장이 다음 달 일본 마켓 상담사 2명(예시)이 퇴사할 예정이라고 알려 왔습니다. 어떻게 할까요?", "Yuki reports that 2 Japanese market agents (Example) plan to leave next month. What do you do?"),
      options: [
        option("a", tx("아직 퇴사 전이므로 실제로 응대율이 떨어지면 그때 보고한다.", "They haven't left yet, so report it once the answer rate actually drops."), tx("일이 터진 뒤에 보고하면 채용과 지원을 준비할 시간이 없습니다.", "Report after it happens, and there's no time to prepare hiring and support.")),
        option("b", tx("대장에 등급과 담당, 대응을 적고, 인력이 걸린 판단은 매니저에게 올린다.", "Log it with a rating, owner and response, and raise the staffing call to the manager.")),
        option("c", tx("민석이 다른 마켓 상담사를 다음 달부터 일본 마켓으로 옮기기로 정한다.", "Minseok decides to move agents from another market to Japan starting next month."), tx("평소 인력 이동은 매니저가 정할 일입니다. 선택지와 숫자를 정리해 올립니다.", "Day to day, moving people is the manager's call. Lay out the options and numbers and raise them.")),
      ],
      answer: "b",
      explanation: tx("위험은 미리 적고 담당을 정하되, 평소 인력과 비용의 판단은 매니저에게 올립니다.", "Write risks down early and assign owners, but day to day, raise staffing and cost calls to the manager."),
    },
    {
      id: "risk-q2",
      prompt: tx("리스크 관리 대장은 언제 다시 보는 것이 좋을까요?", "When is the best time to look at the risk register again?"),
      options: [
        option("a", tx("분기마다 비즈니스 리뷰를 준비할 때 한 번에 정리한다.", "Tidy it all at once every quarter while preparing the business review."), tx("분기에 한 번이면 그사이 생긴 위험을 놓칩니다.", "Once a quarter misses the risks that appear in between.")),
        option("b", tx("새 위험이 생겨 매니저가 물어볼 때마다 연다.", "Open it whenever a new risk comes up and the manager asks."), tx("물어볼 때만 열면 대장이 늘 지난 상태로 남습니다.", "Open it only when asked, and it's always out of date.")),
        option("c", tx("매주 주간 미팅 뒤에 열어 더하고, 닫고, 고친다.", "Open it after every weekly meeting to add, close and update.")),
      ],
      answer: "c",
      explanation: tx("대장은 매주 갱신해야 매니저가 지금의 위험을 보고 판단할 수 있습니다.", "A register updated every week lets the manager judge today's risks."),
    },
  ],
  connection: { to: "review", text: tx("대장과 기록은 고객사 앞에서 쓰는 숫자가 됩니다. 다음은 비즈니스 리뷰 자료 준비 절차입니다.", "The register and records become the numbers used in front of the client. Next is the procedure for preparing business review materials.") },
};
