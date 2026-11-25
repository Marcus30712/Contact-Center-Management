// The service is called Queuecraft (큐크래프트), and its licences are
// split: code MIT, content CC BY-NC-ND 4.0.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { HOME_UI, BROWSE } from '../../home/data.js';
import { REFERENCES_TEXT as R } from '../../references/text.js';

const file = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const PAGES = ['', 'agent-lifecycle/', 'sop-library/', 'codex/', 'staffing-calculator/', 'glossary/', 'references/', 'guide/', 'practice/', 'excel/', 'privacy/', 'settings/'];

// Since 2026-11-26 the top-left "Queuecraft" word is a role picker, so the
// name lives in the home page's tab title and heading (HOME_UI.brand).
test('home names Queuecraft and no page says Knowledge Base or Contact Center KB', () => {
  for (const p of PAGES) {
    const html = file(`${p}index.html`);
    assert.ok(!html.includes('Knowledge Base') && !html.includes('Contact Center KB'), p || 'home');
  }
  assert.ok(file('index.html').includes('<title>Queuecraft</title>'));
});

test('the old service name is gone from every page, script and the licence', () => {
  for (const p of PAGES) assert.ok(!/Miso Academy|미소 아카데미/.test(file(`${p}index.html`)), p || 'home');
  for (const p of ['home/data.js', 'references/text.js', 'references/references.js', 'glossary/render.js', 'staffing-calculator/text.js', 'guide/render.js', 'manifest.webmanifest', 'README.md', 'LICENSE-CONTENT']) {
    assert.ok(!/Miso Academy|미소 아카데미/.test(file(p)), p);
  }
  assert.ok(file('LICENSE-CONTENT').includes('"Marcus Shim, Queuecraft"'));
});

test('the character Miso Kim stays', () => {
  assert.ok(HOME_UI.greeting.ko.includes('김미소'));
  assert.ok(R.misoCredit.ko.includes('김미소'));
});

test('the app name, home title and back links', () => {
  const m = JSON.parse(file('manifest.webmanifest'));
  assert.equal(m.name, 'Queuecraft');
  assert.equal(m.short_name, 'Queuecraft');
  assert.deepEqual(HOME_UI.brand, { ko: 'Queuecraft', en: 'Queuecraft' });
  assert.deepEqual(HOME_UI.title, { ko: '큐크래프트', en: 'Queuecraft' });
  assert.deepEqual(R.back, { ko: 'Queuecraft', en: 'Queuecraft' });
  for (const p of ['glossary/render.js', 'staffing-calculator/text.js', 'home/data.js', 'references/text.js']) {
    assert.ok(!file(p).includes('Knowledge Base'), p);
  }
});

test('sentences use the new name', () => {
  assert.equal(R.intro.ko, '큐크래프트가 무엇을 바탕으로 만들어졌는지 밝힙니다.');
  assert.equal(R.intro.en, 'What Queuecraft is built on.');
  assert.ok(R.countryNote.ko.includes('큐크래프트의 내용은 일반적인 운영 원칙이며'));
  assert.ok(R.countryNote.en.includes('Queuecraft describes general operating principles'));
  const card = BROWSE.find((c) => c.href === './references/');
  assert.deepEqual(card.text, { ko: '큐크래프트의 바탕 자료와 참고한 공개 자료.', en: 'What Queuecraft is built on.' });
});

test('licences: code MIT, content CC BY-NC-ND 4.0', () => {
  const mit = file('LICENSE');
  assert.ok(mit.startsWith('MIT License') && mit.includes('Copyright (c) 2026 Marcus Shim'));
  assert.ok(existsSync(new URL('../../LICENSE-CONTENT', import.meta.url)));
  const cc = file('LICENSE-CONTENT');
  assert.ok(cc.includes('CC BY-NC-ND 4.0') && cc.includes('Marcus Shim') && cc.includes('https://creativecommons.org/licenses/by-nc-nd/4.0/'));
  assert.equal(R.licenseNote.ko, '코드는 MIT 라이선스로, 강의 내용과 문안, 김미소 그림은 CC BY-NC-ND 4.0으로 공개합니다.');
  assert.equal(R.misoCredit.ko, '캐릭터 김미소 이미지: Marcus Shim이 Google Gemini로 생성. CC BY-NC-ND 4.0을 따릅니다.');
  for (const v of [R.licenseNote.en, R.misoCredit.en]) assert.ok(v.includes('CC BY-NC-ND 4.0') && !/[가-힣]/.test(v));
  const readme = file('README.md');
  assert.ok(readme.startsWith('# Queuecraft (큐크래프트)'));
  assert.ok(readme.includes('LICENSE-CONTENT') && readme.includes('2026년 11월 20일 이전에 MIT로 공개된 판은 그대로 MIT'));
  assert.ok(!readme.includes('저장소의 MIT 라이선스를 따릅니다'));
});
