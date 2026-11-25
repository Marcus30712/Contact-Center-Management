// Korean text names roles in Korean (2026-11-26): 직무전문가, 팀장, 부매니저, 매니저.
// Design: docs/superpowers/specs/2026-11-26-korean-role-names-design.md
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROLE_NAMES, ROLE_SHORT } from '../../shared/role-data.js';

const ROOT = new URL('../../', import.meta.url);
const SKIP = new Set(['node_modules', 'agent-lifecycle/tests', 'agent-lifecycle/scripts', 'tools', 'docs', '.git', '.superpowers', 'sw.js']);

function walk(dir, out = []) {
  for (const name of readdirSync(new URL(dir, ROOT))) {
    const rel = dir + name;
    if (SKIP.has(rel) || SKIP.has(name)) continue;
    if (statSync(new URL(rel, ROOT)).isDirectory()) walk(`${rel}/`, out);
    else if (/\.(js|html)$/.test(name)) out.push(rel);
  }
  return out;
}

// Korean pieces of a file: string literals (JS) or " · "-separated text (HTML) that hold Hangul.
function koreanPieces(rel) {
  const src = readFileSync(new URL(rel, ROOT), 'utf8');
  const pieces = rel.endsWith('.html')
    ? src.split(/[<>"\n]| · |(?<=[.?!]) /)
    : src.match(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g) ?? [];
  return pieces.filter((p) => /[가-힣]/.test(p));
}

// The two places a Korean line may still show the short form: a role's full
// name ("직무전문가 / SME") and a short form in brackets after the Korean name.
const ALLOWED = /(상담사|직무전문가|팀장|부매니저|매니저) \/ (SME|TL|AM|OM|Agent)(?!\s*[가-힣])|\((SME|TL|AM|OM)\)/g;
const SHORT = /(?<![A-Za-z_])(SME|TL|AM|OM)(?![A-Za-z_])/;

test('the role names read Korean / short form, and English on English pages', () => {
  assert.deepEqual(Object.fromEntries(Object.entries(ROLE_NAMES).map(([k, v]) => [k, [v.ko, v.en]])), {
    agent: ['상담사 / Agent', 'Agent'],
    sme: ['직무전문가 / SME', 'Subject Matter Expert / SME'],
    tl: ['팀장 / TL', 'Team Lead / TL'],
    am: ['부매니저 / AM', 'Assistant Manager / AM'],
    om: ['매니저 / OM', 'Operation Manager / OM'],
  });
  assert.deepEqual(Object.values(ROLE_SHORT).map((v) => v.ko), ['상담사', '직무전문가', '팀장', '부매니저', '매니저']);
});

test('no Korean text calls a role by its English short form', () => {
  const hits = [];
  for (const rel of walk('')) {
    for (const p of koreanPieces(rel)) {
      if (SHORT.test(p.replace(ALLOWED, ''))) hits.push(`${rel}: ${p.slice(0, 80)}`);
    }
  }
  assert.deepEqual(hits, []);
});

// Korean values with no Hangul at all ("ko: 'SME'", "tx('OM · TA', …)") are Korean text too.
test('no Korean value is a bare English short form', () => {
  const KO = /\btx\(\s*(['"`])((?:(?!\1).)*)\1|\bko:\s*(['"`])((?:(?!\3).)*)\3|"ko":\s*"([^"]*)"/g;
  const hits = [];
  for (const rel of walk('')) {
    if (!rel.endsWith('.js')) continue;
    for (const m of readFileSync(new URL(rel, ROOT), 'utf8').matchAll(KO)) {
      const v = m[2] ?? m[4] ?? m[5];
      if (SHORT.test(v.replace(ALLOWED, ''))) hits.push(`${rel}: ${v.slice(0, 80)}`);
    }
  }
  assert.deepEqual(hits, []);
});

test('the Korean particles fit the new names', () => {
  const bad = /(부?매니저)(이나|이|은|을|과)(?![가-힣])/;
  const hits = [];
  for (const rel of walk('')) for (const p of koreanPieces(rel)) if (bad.test(p)) hits.push(`${rel}: ${p.slice(0, 80)}`);
  assert.deepEqual(hits, []);
});
