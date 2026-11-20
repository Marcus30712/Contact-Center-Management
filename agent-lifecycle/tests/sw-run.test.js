// Runs the real sw.js against a stand-in browser: install, activate, offline visits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SRC = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');
const SCOPE = 'https://x.test/kb/';

function boot({ fetchImpl, existing = [] } = {}) {
  const stores = new Map(existing.map((k) => [k, new Map()]));
  let slowPut = false;
  const deleted = [];
  const fetched = [];
  const cacheFor = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name);
    const key = (r) => new URL(typeof r === 'string' ? r : r.url, SCOPE).href;
    return {
      put: (r, res) => (slowPut ? new Promise(() => {}) : Promise.resolve(m.set(key(r), res))),
      match: async (r) => m.get(key(r)),
      addAll: async () => { throw new Error('addAll must not be used'); },
    };
  };
  const listeners = {};
  const self = {
    location: new URL(`${SCOPE}sw.js`),
    registration: { scope: SCOPE },
    addEventListener: (type, fn) => { listeners[type] = fn; },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  };
  const ctx = {
    self,
    caches: {
      open: async (n) => cacheFor(n),
      keys: async () => [...stores.keys()],
      delete: async (n) => { deleted.push(n); return stores.delete(n); },
    },
    fetch: async (r) => { fetched.push(r); return fetchImpl(r); },
    Request, Response, URL, Promise, console,
  };
  vm.runInNewContext(SRC, ctx);
  const fire = async (type, extra = {}) => {
    const waits = [];
    let responded;
    listeners[type]({ ...extra, waitUntil: (p) => waits.push(p), respondWith: (p) => { responded = p; } });
    await Promise.all(waits);
    return responded && (await responded);
  };
  const fireRespond = async (type, extra = {}) => {
    let responded;
    listeners[type]({ ...extra, waitUntil: () => {}, respondWith: (p) => { responded = p; } });
    return responded;
  };
  return { fire, fireRespond, stores, deleted, fetched, slow: () => { slowPut = true; } };
}

const ok = (r) => new Response(`body of ${r.url}`, { status: 200 });

test('install fetches every file past the browser cache, so a new version never keeps old files', async () => {
  const w = boot({ fetchImpl: ok });
  await w.fire('install');
  assert.ok(w.fetched.length > 50);
  assert.ok(w.fetched.every((r) => r instanceof Request && r.cache === 'reload'), 'every install fetch uses cache: reload');
});

test('one missing file does not stop the rest from being kept offline', async () => {
  const w = boot({ fetchImpl: (r) => (r.url.endsWith('home/app.js') ? new Response('', { status: 404 }) : ok(r)) });
  await w.fire('install');
  const [store] = [...w.stores.values()];
  assert.ok(store.has(`${SCOPE}index.html`));
  assert.ok(!store.has(`${SCOPE}home/app.js`));
});

test('activate removes only this site\'s old copies, not other projects on the same address', async () => {
  const w = boot({ fetchImpl: ok, existing: ['cckb-old', 'kb-other-project', 'something-else'] });
  await w.fire('install');
  await w.fire('activate');
  assert.deepEqual(w.deleted, ['cckb-old']);
});

test('offline, an address never seen goes to the home page instead of a blank page', async () => {
  const w = boot({ fetchImpl: ok });
  await w.fire('install');
  const offline = boot({ fetchImpl: () => { throw new TypeError('offline'); }, existing: [] });
  // carry the installed cache over to the offline worker
  for (const [name, m] of w.stores) offline.stores.set(name, m);
  const res = await offline.fire('fetch', { request: { url: `${SCOPE}old-bookmark/`, method: 'GET', mode: 'navigate' } });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get('location'), SCOPE);
});

test('a partial (206) answer is not stored and does not break the page', async () => {
  const w = boot({ fetchImpl: (r) => (String(r.url ?? r).endsWith('.pdf') ? new Response('part', { status: 206 }) : ok(typeof r === 'string' ? { url: r } : r)) });
  await w.fire('install');
  const res = await w.fire('fetch', { request: { url: `${SCOPE}references/codex.pdf`, method: 'GET', mode: 'no-cors' } });
  assert.equal(res.status, 206);
  const [store] = [...w.stores.values()];
  assert.ok(!store.has(`${SCOPE}references/codex.pdf`));
});

test('offline with no saved home page: an error, never a redirect loop', async () => {
  const w = boot({ fetchImpl: () => { throw new TypeError('offline'); } });
  for (const url of [`${SCOPE}old/`, SCOPE]) {
    const res = await w.fire('fetch', { request: { url, method: 'GET', mode: 'navigate' } });
    assert.equal(res.type, 'error', url);
  }
});

test('a file not saved yet is handed over without waiting for it to be stored', async () => {
  const w = boot({ fetchImpl: ok });
  await w.fire('install');
  w.slow();
  // A cache whose put never finishes: the page must still get its answer.
  const res = await Promise.race([
    w.fireRespond('fetch', { request: { url: `${SCOPE}references/big.pdf`, method: 'GET', mode: 'no-cors' } }),
    new Promise((r) => setTimeout(() => r('timeout'), 300)),
  ]);
  assert.notEqual(res, 'timeout');
});
