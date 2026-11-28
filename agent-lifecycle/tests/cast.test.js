// 등장인물 줄 · 본문 직급 표시 (2026-11-28): shared/cast.js turns names into role pills.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CAST, castOf, segments } from '../../shared/cast.js';

const tx = (ko, en = ko) => ({ ko, en });
const lesson = (...texts) => ({ steps: texts.map((t) => ({ caption: typeof t === 'string' ? tx(t) : t })), checkpoint: [] });
// Segments flattened for easy reading: pills become [label].
const show = (text, lang, cast) => segments(text, lang, cast).map((s) => (typeof s === 'string' ? s : `[${s.label}]`)).join('');

test('the people table is the approved one', () => {
  const rows = CAST.map((p) => [p.name.ko, p.name.en, p.role.ko, p.role.en, p.roleKey]);
  assert.deepEqual(rows, [
    ['지민', 'Jimin', '상담사', 'Agent', 'agent'],
    ['서준', 'Seojun', '상담사', 'Agent', 'agent'],
    ['준호', 'Junho', '선임 상담사', 'Senior agent', 'agent'],
    ['하린', 'Harin', '직무전문가', 'SME', 'sme'],
    ['도현', 'Dohyun', '품질전문가', 'QA', 'qa'],
    ['유나', 'Yuna', '트레이너', 'Trainer', 'qa'],
    ['수진', 'Sujin', '팀장', 'TL', 'tl'],
    ['유키', 'Yuki', '팀장', 'TL', 'tl'],
    ['태오', 'Taeo', '팀장', 'TL', 'tl'],
    ['민석', 'Minseok', '부매니저', 'AM', 'am'],
    ['정은', 'Jeongeun', '매니저', 'Manager', 'mgr'],
  ]);
});

test('the cast row lists the people a lesson mentions, in role order, without false matches', () => {
  const l = lesson('수진 팀장에게 알립니다.', '지민은 하린에게 묻습니다.', '그 결정은 미소가 했어요.');
  assert.deepEqual(castOf(l).map((p) => p.name.ko), ['지민', '하린', '수진']);
  assert.deepEqual(castOf(lesson('결정은 빨리 합니다.')), []);
  // Checkpoint and connection count too; a name only inside quotes still counts as a person.
  const withQ = { steps: [], checkpoint: [{ prompt: tx('민석이 묻습니다.'), options: [{ text: tx('"정은 매니저님께 여쭤볼게요."') }], explanation: tx('') }], connection: { text: tx('도현과 함께 봅니다.') } };
  assert.deepEqual(castOf(withQ).map((p) => p.name.ko), ['도현', '민석', '정은']);
});

test('Korean particles follow the role, not the name', () => {
  const cast = castOf(lesson('하린 민석 수진 유키'));
  const cases = [
    ['하린은 승인합니다.', '[직무전문가]는 승인합니다.'],
    ['하린이 승인합니다.', '[직무전문가]가 승인합니다.'],
    ['하린을 부릅니다.', '[직무전문가]를 부릅니다.'],
    ['하린과 함께', '[직무전문가]와 함께'],
    ['하린으로 바꿉니다.', '[직무전문가]로 바꿉니다.'],
    ['하린이나 팀장에게', '[직무전문가]나 팀장에게'],
    ['하린에게 묻습니다.', '[직무전문가]에게 묻습니다.'],
    ['하린의 답', '[직무전문가]의 답'],
    ['민석이 대행합니다.', '[부매니저]가 대행합니다.'],
    ['유키가 맡습니다.', '[유키 팀장]이 맡습니다.'],
    ['유키는 압니다.', '[유키 팀장]은 압니다.'],
    ['유키를 돕습니다.', '[유키 팀장]을 돕습니다.'],
    ['유키와 함께', '[유키 팀장]과 함께'],
    ['유키로 정합니다.', '[유키 팀장]으로 정합니다.'],
  ];
  for (const [from, to] of cases) assert.equal(show(from, 'ko', cast), to, from);
});

test('a name with its role word becomes one pill; a shared role keeps the name', () => {
  const one = castOf(lesson('수진 하린 정은'));
  assert.equal(show('수진 팀장에게 넘깁니다.', 'ko', one), '[팀장]에게 넘깁니다.');
  assert.equal(show('하린 직무전문가가 맡습니다.', 'ko', one), '[직무전문가]가 맡습니다.');
  assert.equal(show('직무전문가 하린은 압니다.', 'ko', one), '[직무전문가]는 압니다.');
  assert.equal(show('정은 매니저의 확인', 'ko', one), '[매니저]의 확인');
  const three = castOf(lesson('수진 유키 태오'));
  assert.equal(show('태오 팀장이 휴가를 가면 유키 팀장이 봅니다.', 'ko', three), '[태오 팀장]이 휴가를 가면 [유키 팀장]이 봅니다.');
  assert.equal(show('QA 도현은 봅니다.', 'ko', castOf(lesson('도현'))), '[품질전문가]는 봅니다.');
});

test('names inside quotes stay as they are', () => {
  const cast = castOf(lesson('하린 수진'));
  assert.equal(show('"하린 님, 확인 부탁드려요." 하고 수진에게 전합니다.', 'ko', cast), '"하린 님, 확인 부탁드려요." 하고 [팀장]에게 전합니다.');
  assert.equal(show('He says “Ask Harin.” Then Sujin decides.', 'en', cast), 'He says “Ask Harin.” Then the [TL] decides.');
});

test('English: the role takes an article, sentence starts are capitalised, role words fold in', () => {
  const cast = castOf(lesson('하린 수진 민석 지민'));
  const cases = [
    ['Give Harin the document name.', 'Give the [SME] the document name.'],
    ['Harin approves it.', 'The [SME] approves it.'],
    ['It goes to Sujin. Sujin decides.', 'It goes to the [TL]. The [TL] decides.'],
    ["Harin's answer", "The [SME]'s answer"],
    ['Harin the SME covers the floor.', 'The [SME] covers the floor.'],
    ['Ask Harin, the SME, first.', 'Ask the [SME] first.'],
    ['Tell team leader Sujin and Team Leader Sujin.', 'Tell the [TL] and the [TL].'],
    ['Report to TL Sujin.', 'Report to the [TL].'],
    ['What does Jimin do?', 'What does the [Agent] do?'],
    ['your Harin', 'your [SME]'],
  ];
  for (const [from, to] of cases) assert.equal(show(from, 'en', cast), to, from);
  const three = castOf(lesson('수진 유키 태오'));
  assert.equal(show('When new team leader Taeo goes on leave, Yuki helps.', 'en', three), 'When new [TL Taeo] goes on leave, [TL Yuki] helps.');
});

test('pills carry the role key for colour and the person', () => {
  const [pill] = segments('하린', 'ko', castOf(lesson('하린'))).filter((s) => typeof s !== 'string');
  assert.equal(pill.roleKey, 'sme');
  assert.equal(pill.person.name.en, 'Harin');
});

test('sentences that introduce people keep their names', () => {
  const cast = castOf(lesson('지민 준호 서준 수진 하린 유나 도현'));
  for (const s of ['준호는 팀의 선임 상담사입니다. 서준이 실무 체험을 할 때 버디로 옆에서 도왔습니다.', "Junho is the team's senior agent. When Seojun was in Nesting, Junho helped him."]) {
    assert.deepEqual(segments(s, /[가-힣]/.test(s) ? 'ko' : 'en', cast), [s]);
  }
});

// Final review (2026-11-29)
test('a lesson can give a person another role (Jimin in QA, Jimin as an applicant)', () => {
  const calibration = { title: { ko: '캘리브레이션', en: 'Calibration' }, ...lesson('지민과 하린이 봅니다.') };
  assert.deepEqual(castOf(calibration).map((p) => [p.name.ko, p.role.ko, p.role.en, p.roleKey]), [['지민', '품질전문가', 'QA', 'qa'], ['하린', '직무전문가', 'SME', 'sme']]);
  assert.equal(show('지민이 진행합니다.', 'ko', castOf(calibration)), '[품질전문가]가 진행합니다.');
  const hiring = { title: { ko: '채용 및 선발', en: 'Recruitment and Hiring' }, ...lesson('지민이 지원합니다.') };
  assert.equal(show('지민이 지원합니다.', 'ko', castOf(hiring)), '[지원자]가 지원합니다.');
});

test('a trailing comma that belongs to the sentence stays', () => {
  const cast = castOf(lesson('하린 도현 유나'));
  assert.equal(show('Harin the SME, Dohyun from QA and Yuna the trainer, who know them, help.', 'en', cast), 'The [SME], the [QA] and the [Trainer], who know them, help.');
  assert.equal(show('From Harin, get the trends.', 'en', cast), 'From the [SME], get the trends.');
});

test('an apposition naming the role folds into the pill', () => {
  const cast = castOf(lesson('수진 민석'));
  assert.equal(show('Sujin, her TL, says no.', 'en', cast), 'The [TL] says no.');
  assert.equal(show('tell Sujin, your TL, now', 'en', cast), 'tell the [TL] now');
  assert.equal(show('Minseok, your assistant manager, asks.', 'en', cast), 'The [AM] asks.');
  assert.equal(show('With Sujin, the TL, Minseok writes.', 'en', cast), 'With the [TL], the [AM] writes.');
  assert.equal(show('Ask Sujin and Minseok, the experienced TLs, now.', 'en', cast), 'Ask the [TL] and the [AM], the experienced TLs, now.');
  assert.equal(show('플로어의 선임 준호처럼', 'ko', castOf(lesson('준호'))), '플로어의 [선임 상담사]처럼');
});

test('after a closing quote the sentence goes on in lower case', () => {
  const cast = castOf(lesson('하린'));
  assert.equal(show('If you only say "The doc is weird," Harin has to look.', 'en', cast), 'If you only say "The doc is weird," the [SME] has to look.');
});

test('more particle forms follow the role', () => {
  const cast = castOf(lesson('하린 민석'));
  assert.equal(show('하린과의 대화', 'ko', cast), '[직무전문가]와의 대화');
  assert.equal(show('하린으로서 일합니다', 'ko', cast), '[직무전문가]로서 일합니다');
  assert.equal(show('민석이랑 갑니다', 'ko', cast), '[부매니저]랑 갑니다');
});

test('every kept sentence still exists in the lessons', async () => {
  const { COURSE_INFO } = await import('../../shared/courses.js');
  const { KEEP_NAMES, bodyTexts } = await import('../../shared/cast.js');
  const all = Object.values(COURSE_INFO).flatMap((c) => c.lessons.flatMap((l) => bodyTexts(l).flatMap((t) => [t.ko, t.en])));
  for (const k of KEEP_NAMES) assert.ok(all.some((t) => t.includes(k)), k);
});

// QA as a person or team, without a name (2026-11-29): a pill; QA as a score stays text.
test('QA meaning people becomes a pill; QA scores, definitions and quotes stay text', () => {
  const cast = castOf(lesson('지민'));
  const ko = [
    ['QA에게 바로 따지지 않고', '[품질전문가]에게 바로 따지지 않고'],
    ['정해진 절차로 QA에 다시 검토를 요청합니다.', '정해진 절차로 [품질전문가]에 다시 검토를 요청합니다.'],
    ['직무전문가·QA·트레이너에게', '직무전문가·[품질전문가]·트레이너에게'],
    ['QA와 팀장이 봅니다.', '[품질전문가]와 팀장이 봅니다.'],
    ['FCR과 QA 정확도는 높습니다.', 'FCR과 QA 정확도는 높습니다.'],
    ['서준이 QA 점수가 부족합니다.', '[상담사]가 QA 점수가 부족합니다.'],
    ['첫째는 QA(품질 보증)입니다.', '첫째는 QA(품질 보증)입니다.'],
    ['팀장 서포트의 QA 지원이 이 다음 부분입니다.', '팀장 서포트의 QA 지원이 이 다음 부분입니다.'],
    ['"저는 QA가 아니라서" 하고 말합니다.', '"저는 QA가 아니라서" 하고 말합니다.'],
  ];
  for (const [from, to] of ko) assert.equal(show(from, 'ko', cast), to, from);
  const en = [
    ["Don't argue with QA directly.", "Don't argue with [QA] directly."],
    ['It asks QA for a re-review.', 'It asks [QA] for a re-review.'],
    ["Quality is QA's job.", "Quality is [QA]'s job."],
    ['The SME, QA and the trainer meet.', 'The SME, [QA] and the trainer meet.'],
    ['FCR and QA accuracy are high.', 'FCR and QA accuracy are high.'],
    ["The TL's QA support is what comes next.", "The TL's QA support is what comes next."],
    ['The first is QA (quality assurance).', 'The first is QA (quality assurance).'],
    ['"I\'m not QA, so" he says.', '"I\'m not QA, so" he says.'],
  ];
  for (const [from, to] of en) assert.equal(show(from, 'en', cast), to, from);
  const [pill] = segments('QA에게', 'ko', cast).filter((s) => typeof s !== 'string');
  assert.equal(pill.roleKey, 'qa');
});
