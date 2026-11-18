import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANG_KEY, loadLang, saveLang, t } from '../js/engine/i18n.js';
import { UI } from '../js/i18n/ui.js';
import { fakeStorage, throwingStorage } from './helpers.js';

test('loadLang prefers a valid saved language', () => {
  assert.equal(loadLang(fakeStorage({ [LANG_KEY]: 'en' }), 'ko-KR'), 'en');
});

test('loadLang falls back to the browser language', () => {
  assert.equal(loadLang(fakeStorage(), 'ko-KR'), 'ko');
  assert.equal(loadLang(fakeStorage(), 'en-US'), 'en');
  assert.equal(loadLang(fakeStorage({ [LANG_KEY]: 'fr' }), 'en-US'), 'en');
  assert.equal(loadLang(throwingStorage, 'en-US'), 'en');
  assert.equal(loadLang(null, 'ko'), 'ko');
});

test('saveLang stores the choice and never throws', () => {
  const s = fakeStorage();
  saveLang(s, 'en');
  assert.equal(loadLang(s, 'ko-KR'), 'en');
  assert.doesNotThrow(() => saveLang(throwingStorage, 'en'));
  assert.doesNotThrow(() => saveLang(null, 'en'));
});

test('t returns the requested language', () => {
  assert.deepEqual(t({ ko: '가', en: 'A' }, 'en'), { text: 'A', fallback: false });
  assert.deepEqual(t({ ko: '가', en: 'A' }, 'ko'), { text: '가', fallback: false });
});

test('t falls back to Korean when English is missing', () => {
  assert.deepEqual(t({ ko: '가' }, 'en'), { text: '가', fallback: true });
  assert.deepEqual(t({ ko: '가', en: '' }, 'en'), { text: '가', fallback: true });
});

test('UI strings exist in both languages', () => {
  const keys = ['prev', 'next', 'home', 'stepCounter', 'checkpoint', 'nextLesson', 'done', 'translationComing', 'langKo', 'langEn'];
  for (const k of keys) {
    assert.ok(UI[k]?.ko?.trim(), `${k}.ko`);
    assert.ok(UI[k]?.en?.trim(), `${k}.en`);
  }
  assert.equal(UI.translationComing.en, 'Translation coming soon');
});
