import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TERMS } from '../../glossary/terms.js';
import { EXCEL_ADVANCED } from '../../excel/advanced.js';

const README = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');

test('the README counts the glossary terms there are', () => {
  assert.ok(README.includes(`운영 용어 ${TERMS.length}개`), `expected 운영 용어 ${TERMS.length}개`);
});

test('the README names the advanced Excel lessons', () => {
  const row = README.split('\n').find((l) => l.includes('(excel/)'));
  assert.ok(row.includes(`심화 ${EXCEL_ADVANCED.length}개`), row);
});

test('the README counts the guide situations there are', async () => {
  const { GROUPS } = await import('../../guide/data.js');
  const n = GROUPS.reduce((sum, g) => sum + g.situations.length, 0);
  assert.ok(README.includes(`상황 ${n}개`), `expected 상황 ${n}개`);
});

// ---------- 2026-11-23: an English README alongside the Korean one ----------
const readEn = () => readFileSync(new URL('../../README.en.md', import.meta.url), 'utf8');

test('the two READMEs link to each other', () => {
  assert.ok(README.includes('[English](README.en.md)'), 'Korean README links to English');
  assert.ok(readEn().includes('[한국어](README.md)'), 'English README links to Korean');
});

test('the English README carries the same counts as the app', async () => {
  const en = readEn();
  const { GROUPS } = await import('../../guide/data.js');
  const n = GROUPS.reduce((sum, g) => sum + g.situations.length, 0);
  assert.ok(en.includes(`${TERMS.length} operations terms`), `expected ${TERMS.length} operations terms`);
  assert.ok(en.includes(`one of ${n} situations`), `expected one of ${n} situations`);
  const row = en.split('\n').find((l) => l.includes('(excel/)'));
  assert.ok(row.includes(`${EXCEL_ADVANCED.length} advanced lessons`), row);
});

test('both READMEs list the same folders', () => {
  const folders = (text) => [...text.matchAll(/\]\(([a-z-]+\/)\)/g)].map((m) => m[1]);
  assert.deepEqual(folders(readEn()), folders(README));
});
