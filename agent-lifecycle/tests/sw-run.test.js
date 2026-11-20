// Runs the real sw.js against a stand-in browser: install, activate, offline visits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SRC = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');
const SCOPE = 'https://x.test/kb/';

function boot({ fetchImpl, existing = [] } = {}) {
  const stores = new Map(existing.map((k) => [k, new Map()]));
  const deleted = [];
  const fetched = [];
  const cacheFor = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const m = stores.get(name);
    const key = (r) => new URL(typeof r === 'string' ? r : r.url, SCOPE).href;
    return {
      put: async (r, res) => { m.set(key(r), res); },
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
  return { fire, stores, deleted, fetched };
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
