// The service is called CX 2회차 in Korean and CX Replay in English
// (2026-11-26, was Queuecraft), and its licences are split: code MIT,
// content CC BY-NC-ND 4.0. Design: docs/superpowers/specs/2026-11-26-cx-replay-rename-design.md
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { HOME_UI, BROWSE } from '../../home/data.js';
import { REFERENCES_TEXT as R } from '../../references/text.js';
import { BRAND } from '../../shared/brand.js';
import { START_UI } from '../../home/start-data.js';

const file = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const PAGES = ['', 'agent-lifecycle/', 'sop-library/', 'codex/', 'staffing-calculator/', 'glossary/', 'references/', 'guide/', 'practice/', 'excel/', 'privacy/', 'settings/'];

// Since 2026-11-26 the top-left "Queuecraft" word is a role picker, so the
// name lives in the home page's tab title and heading (HOME_UI.brand).
test('home names CX 2회차 and no page says Knowledge Base or Contact Center KB', () => {
  for (const p of PAGES) {
    const html = file(`${p}index.html`);
    assert.ok(!html.includes('Knowledge Base') && !html.includes('Contact Center KB'), p || 'home');
  }
  assert.ok(file('index.html').includes('<title>CX 2회차</title>'));
});

test('the old service name is gone from every page, script and the licence', () => {
  for (const p of PAGES) assert.ok(!/Miso Academy|미소 아카데미/.test(file(`${p}index.html`)), p || 'home');
  for (const p of ['home/data.js', 'references/text.js', 'references/references.js', 'glossary/render.js', 'staffing-calculator/text.js', 'guide/render.js', 'manifest.webmanifest', 'README.md', 'LICENSE-CONTENT']) {
    assert.ok(!/Miso Academy|미소 아카데미/.test(file(p)), p);
  }
  assert.ok(file('LICENSE-CONTENT').includes('"Marcus Shim, CX 2회차 (CX Replay)"'));
});

test('the character Miso Kim stays', () => {
  assert.ok(HOME_UI.greeting.ko.includes('김미소'));
  assert.ok(R.misoCredit.ko.includes('김미소'));
});

test('the app name, home title and back links', () => {
  const m = JSON.parse(file('manifest.webmanifest'));
  assert.equal(m.name, 'CX 2회차 · CX Replay');
  assert.equal(m.short_name, 'CX 2회차');
  assert.deepEqual(BRAND, { ko: 'CX 2회차', en: 'CX Replay' });
  assert.deepEqual(HOME_UI.brand, BRAND);
  assert.deepEqual(HOME_UI.title, BRAND);
  assert.deepEqual(R.back, BRAND);
  assert.deepEqual(START_UI.logo, BRAND);
  for (const p of ['glossary/render.js', 'staffing-calculator/text.js', 'home/data.js', 'references/text.js']) {
    assert.ok(!file(p).includes('Knowledge Base'), p);
  }
});

test('sentences use the new name', () => {
  assert.equal(R.intro.ko, 'CX 2회차가 무엇을 바탕으로 만들어졌는지 밝힙니다.');
  assert.equal(R.intro.en, 'What CX Replay is built on.');
  assert.ok(R.countryNote.ko.includes('CX 2회차의 내용은 일반적인 운영 원칙이며'));
  assert.ok(R.countryNote.en.includes('CX Replay describes general operating principles'));
  const card = BROWSE.find((c) => c.href === './references/');
  assert.deepEqual(card.text, { ko: 'CX 2회차의 바탕 자료와 참고한 공개 자료.', en: 'What CX Replay is built on.' });
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
  assert.ok(readme.startsWith('# CX 2회차 (CX Replay)'));
  assert.ok(readme.includes('LICENSE-CONTENT') && readme.includes('2026년 11월 20일 이전에 MIT로 공개된 판은 그대로 MIT'));
  assert.ok(!readme.includes('저장소의 MIT 라이선스를 따릅니다'));
});

// The concept: what I wish I'd known back then (2026-11-26).
test('the home and start screen taglines carry the replay idea', () => {
  assert.deepEqual(HOME_UI.tagline, {
    ko: '그때 알았더라면 좋았을 컨택센터 이야기를, 상담사부터 매니저까지 자리별로 모았습니다.',
    en: "The contact center lessons I wish I'd known back then, gathered role by role from agent to manager.",
  });
  assert.deepEqual(START_UI.tagline, { ko: '상담사부터 매니저까지, 그때 알았더라면 좋았을 것들', en: "From agent to manager: what I wish I'd known back then" });
  assert.deepEqual(START_UI.dialog, { ko: 'CX 2회차 시작 화면', en: 'CX Replay start screen' });
});

// Only the shown name changes: stored keys and backup files keep the old id,
// so nobody loses their progress or an old backup.
test('no page, script or app file shows the old name; stored names stay', async () => {
  const { readdirSync, statSync } = await import('node:fs');
  const root = new URL('../../', import.meta.url);
  const skip = new Set(['node_modules', '.git', '.superpowers', 'docs', 'tools', 'tests', 'scripts']);
  const walk = (dir, out = []) => {
    for (const n of readdirSync(new URL(dir, root))) {
      if (skip.has(n) || n === 'LOG.md') continue;
      const rel = dir + n;
      if (statSync(new URL(rel, root)).isDirectory()) walk(`${rel}/`, out);
      else if (/\.(js|html|webmanifest)$/.test(n) || /^(README(\.en)?\.md|LICENSE-CONTENT)$/.test(n)) out.push(rel);
    }
    return out;
  };
  const hits = walk('').filter((f) => /Queuecraft|큐크래프트/.test(file(f)));
  assert.deepEqual(hits, []);
  const { ROLE_KEY } = await import('../../shared/role.js');
  assert.equal(ROLE_KEY, 'queuecraft:role');
  assert.match(file('settings/engine.js'), /app: 'queuecraft'/);
});

// Course pages hard-code their way home; the menu script names it in the page's language.
test('the way home on course pages follows the page language', async () => {
  const { setupDom } = await import('./dom.js');
  const { nameHomeLinks } = await import('../../shared/appbar.js');
  const { document } = setupDom();
  document.body.innerHTML = '<a class="kb-link" data-kb-link href="../" aria-label="CX 2회차" title="CX 2회차"><span aria-hidden="true">←</span><span class="kb-text"> CX 2회차</span></a>';
  nameHomeLinks(document, 'en');
  const a = document.querySelector('[data-kb-link]');
  assert.deepEqual([a.getAttribute('aria-label'), a.title, a.querySelector('.kb-text').textContent], ['CX Replay', 'CX Replay', ' CX Replay']);
  nameHomeLinks(document, 'ko');
  assert.equal(a.querySelector('.kb-text').textContent, ' CX 2회차');
});
