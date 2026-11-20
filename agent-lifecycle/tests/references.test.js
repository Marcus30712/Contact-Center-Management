import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REFERENCES_TEXT, PYWORKFORCE_URL } from '../../references/text.js';
import * as TEXT from '../../references/text.js';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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

test('pyworkforce is tied to the staffing lab', () => {
  assert.equal(REFERENCES_TEXT.pyworkforce.ko,
    'pyworkforce — 인력 산정과 스케줄링을 위한 오픈소스 도구(MIT 라이선스). 인력 산정 실험실의 계산 방식을 여기서 참고했고 결과를 대조했습니다.');
  assert.ok(REFERENCES_TEXT.pyworkforce.en.includes('Staffing Lab'));
  assert.equal(REFERENCES_TEXT.labLink.ko, '인력 산정 실험실 열기');
  assert.equal(REFERENCES_TEXT.labLink.en, 'Open the Staffing Lab');
});

test('the Miso image credit is the approved wording and is drawn under the note', async () => {
  assert.equal(REFERENCES_TEXT.misoCredit.ko, '캐릭터 김미소 이미지: Marcus Shim이 Google Gemini로 생성. CC BY-NC-ND 4.0을 따릅니다.');
  assert.ok(REFERENCES_TEXT.misoCredit.en.includes('Google Gemini') && REFERENCES_TEXT.misoCredit.en.includes('Marcus Shim'));
  const src = (await import('node:fs')).readFileSync(new URL('../../references/references.js', import.meta.url), 'utf8');
  assert.ok(src.includes('T.misoCredit'));
});

test('the Learning-SQL approach is credited, ideas only', async () => {
  assert.equal(REFERENCES_TEXT.learningSqlNote.ko, '미소의 엑셀 연습의 레슨 흐름과 카드 조립 방식은 Fullcharge13/Learning-SQL을 참고했습니다. 글, 그림, 이름은 가져오지 않았습니다.');
  assert.ok(!/[가-힣]/.test(REFERENCES_TEXT.learningSqlNote.en));
  const src = (await import('node:fs')).readFileSync(new URL('../../references/references.js', import.meta.url), 'utf8');
  assert.ok(src.includes('T.learningSqlNote'));
});

test('the Codex is described but no PDF is published anywhere in the service', () => {
  assert.equal(TEXT.CODEX_PDF, undefined);
  assert.equal(REFERENCES_TEXT.codexLink, undefined);
  assert.ok(!/pdf/i.test(readFileSync(new URL('../../references/references.js', import.meta.url), 'utf8')));
  assert.ok(!existsSync(new URL('../../references/BPO_Contact_Center_Operation_Codex_2.0.pdf', import.meta.url)));
  const root = new URL('../../', import.meta.url).pathname;
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n');
  assert.deepEqual(tracked.filter((f) => /\.pdf$/i.test(f)), []);
});
