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
