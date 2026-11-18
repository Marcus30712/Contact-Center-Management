import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFERENCES_TEXT, PYWORKFORCE_URL, CODEX_PDF } from '../../references/text.js';

const all = (lang) => Object.values(REFERENCES_TEXT).map((v) => v[lang]).join('\n');

test('every reference string exists in both languages', () => {
  for (const [key, v] of Object.entries(REFERENCES_TEXT)) {
    assert.ok(v.ko?.trim(), `${key}.ko`);
    assert.ok(v.en?.trim(), `${key}.en`);
  }
});

test('the Codex line is the approved wording and names the author', () => {
  assert.equal(REFERENCES_TEXT.codex.ko,
    'BPO Contact Center Operation Codex 2.0 — BPO 고객센터 운영의 원칙, 관리 프로토콜, 성장 로드맵, 팀별 청사진, 표준 운영 절차(SOP)를 정리한 운영 지침서. 작성: Marcus Shim.');
  assert.ok(REFERENCES_TEXT.codex.en.includes('Marcus Shim'));
  assert.equal(CODEX_PDF, './BPO_Contact_Center_Operation_Codex_2.0.pdf');
});

test('pyworkforce is credited with its licence and link', () => {
  assert.ok(REFERENCES_TEXT.pyworkforce.ko.includes('pyworkforce') && REFERENCES_TEXT.pyworkforce.ko.includes('MIT'));
  assert.ok(REFERENCES_TEXT.pyworkforce.en.includes('pyworkforce') && REFERENCES_TEXT.pyworkforce.en.includes('MIT license'));
  assert.ok(!/licence|organisation/.test(all('en')));
  assert.equal(PYWORKFORCE_URL, 'https://github.com/rodrigo-arenas/pyworkforce');
});

test('the country note is present and no specific law is named', () => {
  assert.ok(REFERENCES_TEXT.countryNote.ko.includes('국가마다'));
  assert.ok(REFERENCES_TEXT.countryNote.en.includes('country'));
  for (const lang of ['ko', 'en']) assert.ok(!/산업안전보건법|PDPA|제\d+조/.test(all(lang)));
});

test('no excluded standards and no contact details', () => {
  for (const lang of ['ko', 'en']) {
    const text = all(lang);
    for (const banned of ['ISO', 'COPC', 'HDI', 'ICMI', '@']) assert.ok(!text.includes(banned), banned);
    assert.ok(!/\+?\d[\d\s-]{8,}\d/.test(text));
  }
});
