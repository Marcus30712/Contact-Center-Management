import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCourse } from '../js/engine/lessonSchema.js';
import { lessonText } from './helpers.js';
import { SOP_LESSONS } from '../../sop-library/lessons/index.js';
import { SOP_UI, SOP_PROGRESS_KEY, SOP_FIGURE } from '../../sop-library/ui.js';

const byId = (id) => SOP_LESSONS.find((l) => l.id === id);
const label = (lesson, nodeId) => lesson.diagram.nodes.find((n) => n.id === nodeId).label.ko;

// The Korean copy files (the first confirmed by the owner, the second awaiting
// their review). The lessons must match them exactly.
const COPY_FILES = ['2026-11-19-sop-library-copy-ko.md', '2026-11-19-sop-library-2-copy-ko.md'];
const parseCopy = () => COPY_FILES.flatMap(parseCopyFile);
function parseCopyFile(name) {
  const md = readFileSync(new URL(`../../docs/superpowers/specs/${name}`, import.meta.url), 'utf8');
  return md.split(/^## 레슨 \d+\. /m).slice(1).map((section) => {
    const lines = section.split('\n');
    const lesson = { title: lines[0].trim(), steps: [], questions: [] };
    for (const raw of lines.slice(1)) {
      const line = raw.trim();
      let m;
      if (line === '---') break;
      if ((m = line.match(/^- 부제: (.+)$/))) lesson.subtitle = m[1];
      else if ((m = line.match(/^- 누가: (.+)$/))) lesson.roles = m[1];
      else if ((m = line.match(/^\d+\. \*\*\[(.+?)\]\*\* (.+)$/))) lesson.steps.push({ tag: m[1], caption: m[2].replaceAll('🟦 ', '') });
      else if ((m = line.match(/^\*\*확인 문제 \d+\.\*\* (.+)$/))) lesson.questions.push({ prompt: m[1], options: [] });
      else if ((m = line.match(/^- ([a-c])\. (.+?)( ✅)?$/))) {
        const q = lesson.questions.at(-1);
        q.options.push({ id: m[1], text: m[2] });
        if (m[3]) q.answer = m[1];
      } else if ((m = line.match(/^- 해설: (.+)$/))) lesson.questions.at(-1).explanation = m[1].replaceAll('🟦 ', '');
      else if ((m = line.match(/^\*\*다음으로:\*\* (.+)$/))) lesson.connection = m[1].replaceAll('🟦 ', '');
    }
    return lesson;
  });
}
const COPY = parseCopy();

const PROCEDURES = {
  escalation: ['불만 접수', '1차 해결 시도', '에스컬레이션 안내', '즉시 알림', '기록 및 인계'],
  coaching: ['데이터 준비', '분위기 조성', '원인 분석', '해결책 수립', '마무리 및 격려'],
  pip: ['데이터 기반 면담', '공동 목표 설정', '지원 약속 및 주간 점검', '결과 평가'],
  calibration: ['사전 준비', '독립 평가', '교정 세션', '합의 및 결정', '후속 조치 및 공유'],
  onboarding: ['계약 및 서류 처리', '장비 지급 및 계정 생성', '비전·문화 교육', '버디 지정 및 팀 소개',
    '제품·서비스 심화 교육', '시스템 실습 교육', '실전 투입 스케줄 배정', '첫 주 1:1 미팅'],
  incident: ['감지 및 상황 공유', '원인 분석 및 자원 계획', '실행 및 모니터링', '결과 보고 및 후속 조치'],
  launch: ['계획 및 설계', '인력 확보 및 교육', '시스템 및 환경 구축', '론칭 및 안정화'],
};
const EXTRAS = {
  escalation: ['종결'],
  coaching: ['목표', '현실', '대안', '실행 의지'],
  pip: ['PIP 종료', '추가 계획'],
  calibration: ['추가 교육·공지'],
  onboarding: ['1주차', '2주차'],
  incident: ['SOP 업데이트'],
  launch: ['첫 비즈니스 리뷰'],
};

test('the SOP course passes the course rules in both languages', () => {
  assert.deepEqual(validateCourse(SOP_LESSONS, { requireEnglish: true, lessonCount: 7, loop: false, figure: SOP_FIGURE }), []);
});

test('seven lessons in order, common to every team type', () => {
  assert.deepEqual(SOP_LESSONS.map((l) => l.id), ['escalation', 'coaching', 'pip', 'calibration', 'onboarding', 'incident', 'launch']);
  assert.deepEqual(SOP_LESSONS.map((l) => l.steps.length), [10, 11, 11, 11, 11, 11, 10]);
  assert.deepEqual(SOP_LESSONS.map((l) => l.group), ['leader', 'leader', 'leader', 'leader', 'cross', 'cross', 'cross']);
  for (const l of SOP_LESSONS) {
    assert.equal(l.checkpoint.length, 2, l.id);
    assert.ok([...l.steps, ...l.checkpoint].every((x) => x.track === undefined), l.id);
    assert.ok(l.roles.ko && l.roles.en, l.id);
  }
  assert.equal(SOP_LESSONS.at(-1).connection.to, 'home');
});

test('each procedure has the Codex steps in the Codex order', () => {
  for (const l of SOP_LESSONS) {
    assert.deepEqual(l.procedure.map((id) => label(l, id)), PROCEDURES[l.id], l.id);
    const edgeIds = l.diagram.edges.map((e) => e.id);
    // A lesson laid out in columns lists where a new column starts; no arrow runs between columns.
    l.procedure.slice(1).forEach((id, i) => {
      if (!(l.columnStarts ?? []).includes(id)) assert.ok(edgeIds.includes(`${l.procedure[i]}-${id}`), `${l.id}: ${id}`);
    });
    const extras = l.diagram.nodes.filter((n) => !l.procedure.includes(n.id)).map((n) => n.label.ko);
    assert.deepEqual(extras, EXTRAS[l.id], l.id);
  }
});

test('the Korean wording is the confirmed copy, word for word', () => {
  assert.equal(COPY.length, 7);
  SOP_LESSONS.forEach((l, i) => {
    const c = COPY[i];
    assert.equal(l.title.ko, c.title, l.id);
    assert.equal(l.subtitle.ko, c.subtitle, l.id);
    assert.equal(l.roles.ko, c.roles, l.id);
    assert.deepEqual(l.steps.map((s) => s.caption.ko), c.steps.map((s) => s.caption), l.id);
    assert.deepEqual(l.checkpoint.map((q) => q.prompt.ko), c.questions.map((q) => q.prompt), l.id);
    assert.deepEqual(l.checkpoint.map((q) => q.options.map((o) => [o.id, o.text.ko])), c.questions.map((q) => q.options.map((o) => [o.id, o.text])), l.id);
    assert.deepEqual(l.checkpoint.map((q) => q.answer), c.questions.map((q) => q.answer), l.id);
    assert.deepEqual(l.checkpoint.map((q) => q.explanation.ko), c.questions.map((q) => q.explanation), l.id);
    assert.equal(l.connection.text.ko, c.connection, l.id);
  });
});

test('each step lights up the stage it talks about', () => {
  SOP_LESSONS.forEach((l, i) => {
    const idOf = (name) => l.diagram.nodes.find((n) => n.label.ko === name)?.id;
    assert.ok(l.procedure.every((id) => l.steps[0].show.includes(id)), `${l.id}: first step shows the whole procedure`);
    COPY[i].steps.forEach((c, n) => {
      const step = l.steps[n];
      const [main] = c.tag.split(/ → | · /);
      if (main === '전체') return;
      assert.ok(step.highlight.includes(idOf(main)), `${l.id} step ${n + 1}: ${main}`);
      // The badge marks where the named person acts; it may be absent on other teams' steps.
      assert.ok(step.persona === null || step.persona === idOf(main), `${l.id} step ${n + 1} persona`);
      if (i < 4) assert.equal(step.persona, idOf(main), `${l.id} step ${n + 1} persona`);
      if (/ → | · /.test(c.tag)) {
        assert.ok(step.highlight.some((id) => l.diagram.nodes.some((x) => x.id === id) && !l.procedure.includes(id)), `${l.id} step ${n + 1}: branch`);
      }
    });
    // Nothing disappears once it has been shown.
    l.steps.slice(1).forEach((step, n) => assert.ok(l.steps[n].show.every((id) => step.show.includes(id)), `${l.id} step ${n + 2}`));
  });
});

test('every box sits inside the picture and none overlap', () => {
  for (const l of SOP_LESSONS) {
    const boxes = l.diagram.nodes.map((n) => ({ id: n.id, l: n.x - (n.hw ?? 54), r: n.x + (n.hw ?? 54), t: n.y - 17, b: n.y + 17 }));
    for (const b of boxes) assert.ok(b.l >= 2 && b.r <= 358 && b.t >= 2 && b.b <= 238, `${l.id}: ${b.id}`);
    boxes.forEach((a, i) => boxes.slice(i + 1).forEach((b) => {
      const apart = a.r + 6 <= b.l || b.r + 6 <= a.l || a.b + 6 <= b.t || b.b + 6 <= a.t;
      assert.ok(apart, `${l.id}: ${a.id} overlaps ${b.id}`);
    }));
    for (const id of l.procedure) assert.equal(l.diagram.nodes.find((n) => n.id === id).hw, 76, `${l.id}: ${id}`);
    // No arrow runs through a box it does not belong to.
    const at = (id) => l.diagram.nodes.find((n) => n.id === id);
    for (const e of l.diagram.edges) {
      const [a, b] = [at(e.from), at(e.to)];
      for (const box of boxes.filter((x) => x.id !== e.from && x.id !== e.to)) {
        for (let k = 0; k <= 40; k += 1) {
          const x = a.x + ((b.x - a.x) * k) / 40;
          const y = a.y + ((b.y - a.y) * k) / 40;
          assert.ok(!(x > box.l && x < box.r && y > box.t && y < box.b), `${l.id}: ${e.id} crosses ${box.id}`);
        }
      }
    }
  }
});

test('Doyun is the person in the PIP lesson and Jimin everywhere else', () => {
  assert.deepEqual(byId('pip').personaName, { ko: '도윤', en: 'Doyun' });
  assert.ok(!lessonText(byId('pip'), 'ko').includes('지민'));
  assert.ok(!lessonText(byId('pip'), 'en').includes('Jimin'));
  for (const id of ['escalation', 'coaching', 'calibration', 'incident', 'launch']) assert.equal(byId(id).personaName, undefined, id);
  assert.deepEqual(byId('onboarding').personaName, { ko: '서아', en: 'Seoa' });
  assert.ok(!lessonText(byId('onboarding'), 'ko').includes('지민'));
});

test('the English is complete and uses the agreed terms', () => {
  for (const l of SOP_LESSONS) assert.ok(!/[가-힣]/.test(lessonText(l, 'en')), l.id);
  const pip = lessonText(byId('pip'), 'en');
  assert.equal(pip.split('Performance Improvement Plan').length - 1, 2); // title and first step
  const coaching = byId('coaching');
  assert.deepEqual(['goal', 'reality', 'options', 'will'].map((id) => coaching.diagram.nodes.find((n) => n.id === id).label.en), ['Goal', 'Reality', 'Options', 'Will']);
  for (const l of SOP_LESSONS) assert.ok(!/licence|organis|behaviour/.test(lessonText(l, 'en')), l.id);
});

test('the course strings are in both languages', () => {
  for (const key of ['courseTitle', 'courseTagline', 'listNote', 'home', 'checkpoint', 'connection', 'nextLesson', 'toList', 'done', 'rolesLabel', 'groupLeader', 'groupCross']) {
    assert.ok(SOP_UI[key]?.ko?.trim() && SOP_UI[key]?.en?.trim(), key);
    assert.ok(!/[가-힣]/.test(SOP_UI[key].en), key);
  }
  assert.equal(SOP_UI.courseTitle.ko, 'SOP 라이브러리');
  assert.equal(SOP_UI.courseTagline.ko, '팀장이 알아야 할 절차를 순서대로.');
  assert.equal(SOP_UI.groupLeader.ko, '팀장이 직접 하는 절차');
  assert.equal(SOP_UI.groupCross.ko, '여러 팀이 함께 하는 절차');
  assert.equal(SOP_UI.listNote.ko, 'Codex의 표준 운영 절차(SOP)를 한 단계씩 따라가 봅니다. 숫자가 붙은 시간과 건수는 예시이며, 실제 값은 센터마다 정합니다.');
  assert.equal(SOP_PROGRESS_KEY, 'sop-library:v1');
  assert.ok(SOP_FIGURE.test('10점') && SOP_FIGURE.test('5 points') && SOP_FIGURE.test('5분') && !SOP_FIGURE.test('4주'));
});

// --- screens ---
import { setupDom } from './dom.js';
import { parseRoute } from '../js/engine/router.js';
import { renderLesson } from '../js/render/lesson.js';
import { renderSopHome } from '../../sop-library/home.js';

const IDS = SOP_LESSONS.map((l) => l.id);
function openLesson(id, stepIndex = 0, lang = 'ko') {
  const { root } = setupDom();
  renderLesson(root, byId(id), stepIndex, lang, { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: SOP_LESSONS.length, text: SOP_UI });
  return root;
}

test('the list shows the seven SOPs in order with who runs each', () => {
  const { root } = setupDom();
  renderSopHome(root, SOP_LESSONS, { completed: ['pip'] }, 'ko');
  assert.equal(root.querySelector('h1').textContent, 'SOP 라이브러리');
  assert.equal(root.querySelector('[data-list-note]').textContent, SOP_UI.listNote.ko);
  const links = [...root.querySelectorAll('ol[data-sop-list] a[data-sop]')];
  assert.deepEqual([...root.querySelectorAll('[data-group]')].map((x) => x.textContent), ['팀장이 직접 하는 절차', '여러 팀이 함께 하는 절차']);
  assert.deepEqual([...root.querySelectorAll('ol[data-sop-list]')].map((ol) => [ol.getAttribute('start'), ol.querySelectorAll('a[data-sop]').length]), [['1', 4], ['5', 3]]);
  assert.deepEqual(links.map((a) => a.querySelector('.stage-card-num').textContent), ['1', '2', '3', '4', '5', '6', '7']);
  assert.deepEqual(links.map((a) => a.getAttribute('href')), IDS.map((id) => `#${id}-0`));
  links.forEach((a, i) => {
    const l = SOP_LESSONS[i];
    assert.ok(a.textContent.includes(l.title.ko) && a.textContent.includes(l.subtitle.ko), l.id);
    assert.equal(a.querySelector('[data-roles]').textContent, `누가: ${l.roles.ko}`);
    assert.equal(a.querySelector('[data-done]').textContent, l.id === 'pip' ? '✓ 완료' : '');
    assert.equal(a.classList.contains('is-done'), l.id === 'pip');
  });
});

test('the English list has no Korean left in it', () => {
  const { root } = setupDom();
  renderSopHome(root, SOP_LESSONS, { completed: [] }, 'en');
  assert.equal(root.querySelector('h1').textContent, 'SOP Library');
  assert.ok(!/[가-힣]/.test(root.textContent));
});

test('an SOP lesson counts out of seven and the last one leads back to the list', () => {
  const first = openLesson('escalation');
  assert.equal(first.querySelector('.eyebrow').textContent, '1 / 7');
  assert.equal(first.querySelector('[data-home]').textContent, '← 목록');
  assert.equal(first.querySelector('[data-next-lesson]').getAttribute('href'), '#coaching-0');
  assert.equal(first.querySelector('[data-next-lesson]').textContent, '다음 SOP →');
  assert.equal(openLesson('calibration').querySelector('[data-next-lesson]').getAttribute('href'), '#onboarding-0');
  const last = openLesson('launch');
  assert.equal(last.querySelector('[data-next-lesson]').getAttribute('href'), '#home');
  assert.equal(last.querySelector('[data-next-lesson]').textContent, '목록으로 →');
  assert.equal(openLesson('launch', 0, 'en').querySelector('[data-next-lesson]').textContent, 'Back to the list →');
  assert.equal(openLesson('onboarding', 2).querySelector('[data-persona] text').textContent, '서아');
});

test('the badge in the PIP lesson reads Doyun', () => {
  const root = openLesson('pip', 3);
  assert.equal(root.querySelector('[data-persona] text').textContent, '도윤');
  assert.ok(!root.querySelector('[data-persona]').classList.contains('is-hidden'));
  assert.equal(openLesson('escalation', 1).querySelector('[data-persona] text').textContent, '지민');
});

test('stale or foreign addresses open the list, and an overshoot opens the last step', () => {
  assert.deepEqual(parseRoute('#hiring-0', IDS), { view: 'home' });
  assert.deepEqual(parseRoute('#nope', IDS), { view: 'home' });
  const route = parseRoute('#coaching-99', IDS);
  assert.equal(route.id, 'coaching');
  assert.equal(openLesson('coaching', route.step).querySelector('[data-counter]').textContent, '11 / 11');
});

// --- review findings ---
test('the English never runs to more sentences than the Korean it translates', () => {
  // Counts sentence ends inside quotations too, which the course rule skips.
  const count = (s) => (s.match(/[.?!](?=["'”’)]*(\s|$))/g) || []).length;
  for (const l of SOP_LESSONS) {
    l.steps.forEach((s, i) => assert.ok(count(s.caption.en) <= count(s.caption.ko), `${l.id} step ${i + 1}`));
  }
});

test('the English reads as US English and keeps the Korean meaning', () => {
  const all = SOP_LESSONS.map((l) => lessonText(l, 'en')).join(' ');
  assert.ok(!/by messenger|full marks|straight away|watching and helping/.test(all));
  assert.ok(byId('coaching').connection.text.en.includes('(PIP)'));
  assert.ok(byId('escalation').steps[7].caption.en.includes('by chat or verbally'));
});

test('when Doyun meets the goal only the closing branch lights up', () => {
  const step = byId('pip').steps[9];
  assert.ok(step.highlight.includes('end') && step.highlight.includes('evaluate-end'));
  assert.ok(!step.highlight.includes('more') && !step.highlight.includes('evaluate-more'));
  assert.ok(step.show.includes('more') && step.show.includes('evaluate-more'));
});

test('the new English keeps the Korean meaning', () => {
  const launch = lessonText(byId('launch'), 'en');
  assert.ok(!/intensive-care|refresher training|start it steadily|4 weeks from launch day/.test(launch));
  assert.ok(byId('onboarding').checkpoint[0].options[0].text.en.includes('what was hard'));
});
