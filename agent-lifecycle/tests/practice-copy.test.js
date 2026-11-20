import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PRACTICE_UI, BADGES } from '../../practice/data.js';
import { BADGE_IDS } from '../../practice/engine.js';

const DOC = readFileSync(new URL('../../docs/superpowers/specs/2026-11-20-daily-practice-design.md', import.meta.url), 'utf8');
const section = DOC.slice(DOC.indexOf('## 6.'), DOC.indexOf('## 7.'));
const rows = (header) => {
  const start = section.indexOf(header);
  const out = [];
  for (const line of section.slice(start).split('\n').slice(2)) {
    if (!line.startsWith('|')) break;
    out.push(line.slice(1, -1).split(' | ').map((c) => c.trim()));
  }
  return out;
};

test('practice wording is the confirmed table, in both languages', () => {
  const table = rows('| 키 | 한국어 | English |');
  assert.equal(table.length, 27);
  assert.deepEqual(Object.keys(PRACTICE_UI), table.map((r) => r[0]));
  for (const [key, ko, en] of table) assert.deepEqual(PRACTICE_UI[key], { ko, en }, key);
});

test('badges are the confirmed ones, in engine order', () => {
  const table = rows('| id | 이름 | Name | 조건 | Condition |');
  assert.deepEqual(BADGES.map((b) => b.id), BADGE_IDS);
  assert.deepEqual(BADGES.map((b) => [b.id, b.name.ko, b.name.en, b.rule.ko, b.rule.en]), table);
});

test('no Hangul in English and no banned words', () => {
  const all = [...Object.values(PRACTICE_UI), ...BADGES.flatMap((b) => [b.name, b.rule])];
  for (const v of all) {
    assert.ok(!/[가-힣]/.test(v.en), v.en);
    assert.ok(!v.ko.includes('진상'));
  }
});
