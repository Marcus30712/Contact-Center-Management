// 등장인물 줄 · 본문 직급 표시 on the lesson screen (2026-11-28).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, click } from './dom.js';
import { renderLesson } from '../js/render/lesson.js';
import { AMS_LESSONS } from '../../am-sop/lessons/index.js';
import { AMS_UI } from '../../am-sop/ui.js';
import { AS_LESSONS } from '../../agent-sop/lessons/index.js';
import { AS_UI } from '../../agent-sop/ui.js';

function open(lessons, ui, id, step = 0, lang = 'ko') {
  const { root } = setupDom();
  renderLesson(root, lessons.find((l) => l.id === id), step, lang, { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: lessons.length, text: ui });
  return root;
}
const chips = (root) => [...root.querySelectorAll('[data-cast] [data-cast-person]')].map((c) => [c.textContent, c.getAttribute('data-role')]);

test('the cast row sits under the subtitle with "name (role)" chips', () => {
  const root = open(AMS_LESSONS, AMS_UI, 'backup', 2);
  const row = root.querySelector('.lesson-head [data-cast]');
  assert.ok(row, 'cast row in the header');
  assert.equal(row.previousElementSibling.className.includes('subtitle') || row.previousElementSibling.hasAttribute('data-translation-note'), true);
  assert.equal(row.querySelector('[data-cast-label]').textContent, '등장인물');
  assert.deepEqual(chips(root), [['하린 (직무전문가)', 'sme'], ['수진 (팀장)', 'tl'], ['유키 (팀장)', 'tl'], ['태오 (팀장)', 'tl'], ['민석 (부매니저)', 'am']]);
  const en = open(AMS_LESSONS, AMS_UI, 'backup', 2, 'en');
  assert.equal(en.querySelector('[data-cast-label]').textContent, 'People');
  assert.deepEqual(chips(en).map(([t]) => t), ['Harin (SME)', 'Sujin (TL)', 'Yuki (TL)', 'Taeo (TL)', 'Minseok (AM)']);
});

test('the caption shows role pills with the particle kept beside them', () => {
  const root = open(AMS_LESSONS, AMS_UI, 'backup', 2);
  const cap = root.querySelector('[data-caption]');
  const pills = [...cap.querySelectorAll('[data-role-pill]')].map((p) => [p.textContent, p.getAttribute('data-role')]);
  assert.deepEqual(pills, [['수진 팀장', 'tl'], ['직무전문가', 'sme'], ['부매니저', 'am']]);
  assert.equal(cap.querySelector('[data-role-pill]').parentElement.getAttribute('data-pill-wrap') !== null, true);
  assert.equal(cap.querySelector('[data-role-pill][data-role="am"]').parentElement.textContent, '부매니저가');
});

test('checkpoint prompts, options and explanations use pills too; quotes keep names', () => {
  const root = open(AS_LESSONS, AS_UI, 'request');
  click(root.querySelector('[data-next]'));
  const q = root.querySelector('[data-question]');
  assert.ok(q.querySelector('[data-prompt] [data-role-pill]'), 'prompt has a pill');
  const quoted = [...root.querySelectorAll('[data-option]')].find((b) => b.textContent.includes('"'));
  if (quoted) assert.ok(!/직무전문가/.test(quoted.textContent.match(/"[^"]*"/)[0]) || quoted.textContent.includes('하린'));
  click(q.querySelector('[data-option]'));
  assert.ok(q.querySelector('[data-explanation]').textContent.length > 0);
});

test('a lesson with no people shows no cast row', () => {
  const lesson = { ...AS_LESSONS[0], steps: AS_LESSONS[0].steps.map((s) => ({ ...s, caption: { ko: '사람 없음', en: 'No one' } })), checkpoint: [], connection: { ...AS_LESSONS[0].connection, text: { ko: '다음', en: 'Next' } } };
  const { root } = setupDom();
  renderLesson(root, lesson, 0, 'ko', { onNavigate() {}, onComplete() {}, track: 'general', lessonCount: 8, text: AS_UI });
  assert.equal(root.querySelector('[data-cast]'), null);
});
