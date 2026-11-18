// A minimal valid lesson (Korean only). Tests clone it and break one thing.
export function makeLesson(overrides = {}) {
  const step = (caption, show, highlight, persona) => ({ caption: { ko: caption }, show, highlight, persona });
  return {
    id: 'hiring',
    order: 1,
    title: { ko: '채용 및 선발' },
    subtitle: { ko: '맞는 사람을 뽑는 단계' },
    diagram: {
      nodes: [
        { id: 'a', label: { ko: '지원' }, x: 60, y: 120 },
        { id: 'b', label: { ko: '면접' }, x: 180, y: 120 },
        { id: 'c', label: { ko: '입사' }, x: 300, y: 120 },
      ],
      edges: [{ id: 'ab', from: 'a', to: 'b' }, { id: 'bc', from: 'b', to: 'c' }],
    },
    steps: [
      step('지민이 지원서를 냅니다.', ['a'], ['a'], 'a'),
      step('서류를 봅니다.', ['a'], [], 'a'),
      step('면접으로 갑니다.', ['a', 'ab', 'b'], ['b'], 'b'),
      step('모의 상담을 합니다.', ['a', 'ab', 'b'], ['b'], 'b'),
      step('합격을 알립니다.', ['a', 'ab', 'b', 'bc', 'c'], ['c'], 'c'),
      step('입사합니다.', ['a', 'ab', 'b', 'bc', 'c'], ['c'], 'c'),
    ],
    checkpoint: [{
      id: 'q1',
      prompt: { ko: '무엇을 먼저 할까요?' },
      options: [{ id: 'x', text: { ko: '솔직하게 안내한다' } }, { id: 'y', text: { ko: '좋은 점만 말한다' } }],
      answer: 'x',
      explanation: { ko: '솔직한 안내가 조기 퇴사를 줄입니다.' },
    }],
    connection: { to: 'onboarding', text: { ko: '채용에서 한 약속이 교육으로 이어집니다.' } },
    ...overrides,
  };
}

// Same lesson with English filled in everywhere.
export function makeBilingualLesson() {
  const l = makeLesson();
  const en = (o, s) => { o.en = s; };
  en(l.title, 'Hiring'); en(l.subtitle, 'Picking the right person');
  l.diagram.nodes.forEach((n, i) => en(n.label, ['Apply', 'Interview', 'Join'][i]));
  ['Jimin applies.', 'We screen.', 'She interviews.', 'She role-plays a call.', 'We make an offer.', 'She joins.']
    .forEach((s, i) => en(l.steps[i].caption, s));
  const q = l.checkpoint[0];
  en(q.prompt, 'What comes first?');
  en(q.options[0].text, 'Be honest'); en(q.options[1].text, 'Only the good parts');
  en(q.explanation, 'Honest previews reduce early attrition.');
  en(l.connection.text, 'Promises made in hiring carry into training.');
  return l;
}
