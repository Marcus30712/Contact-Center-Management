// 최신 버전 받기 (2026-11-28): refreshApp gets the newest files without touching
// learning records, and never throws away the offline copy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { refreshApp, CACHE_PREFIX } from '../../settings/update.js';

// A cache store whose caches remember url → body, and a network that answers each url.
function fakeCaches(store) {
  const deleted = [];
  return {
    store, deleted,
    keys: async () => Object.keys(store),
    delete: async (n) => { deleted.push(n); delete store[n]; },
    open: async (n) => ({
      keys: async () => Object.keys(store[n] ?? {}).map((url) => ({ url })),
      put: async (req, res) => { store[n][typeof req === 'string' ? req : req.url] = res.body; },
    }),
  };
}
const network = (body, calls = []) => async (url, init) => { calls.push([url, init?.cache]); return { ok: true, body }; };
function fakeWorker(state = 'installing') {
  const w = { state, listeners: [], addEventListener: (type, fn) => w.listeners.push(fn) };
  w.become = (s) => { w.state = s; for (const fn of w.listeners) fn(); };
  return w;
}
const tick = () => new Promise((r) => setTimeout(r, 0));

test('the offline store prefix is the one sw.js uses', async () => {
  const { readFileSync } = await import('node:fs');
  const sw = readFileSync(new URL('../../sw.js', import.meta.url), 'utf8');
  assert.match(sw, new RegExp(`const PREFIX = '${CACHE_PREFIX}';`));
});

test('offline: nothing is touched and the page is not reloaded', async () => {
  const caches = fakeCaches({ 'cckb-a': { 'x.js': 'old' } });
  let reloads = 0;
  assert.equal(await refreshApp({ online: false, caches, container: null, fetch: network('new'), reload: () => { reloads += 1; } }), 'offline');
  assert.deepEqual(caches.store, { 'cckb-a': { 'x.js': 'old' } });
  assert.equal(reloads, 0);
});

test('the update check fails or hangs: nothing is touched, no reload, the page says the server could not be reached', async () => {
  for (const update of [async () => { throw new Error('net'); }, () => new Promise(() => {})]) {
    const caches = fakeCaches({ 'cckb-a': { 'x.js': 'old' } });
    let reloads = 0;
    const reg = { installing: null, waiting: null, update };
    assert.equal(await refreshApp({ online: true, caches, container: { getRegistration: async () => reg }, fetch: network('new'), reload: () => { reloads += 1; }, checkWait: 10 }), 'unreachable');
    assert.deepEqual(caches.store, { 'cckb-a': { 'x.js': 'old' } });
    assert.deepEqual(caches.deleted, []);
    assert.equal(reloads, 0);
  }
});

test('no new version: the stored files are refreshed in place from the network, never deleted, then the page reloads', async () => {
  const caches = fakeCaches({ 'cckb-a': { 'x.js': 'old', 'y.js': 'old' }, 'other-site': { 'z.js': 'keep' } });
  const calls = [];
  let reloads = 0;
  const reg = { installing: null, waiting: null, update: async () => {} };
  assert.equal(await refreshApp({ online: true, caches, container: { getRegistration: async () => reg }, fetch: network('new', calls), reload: () => { reloads += 1; } }), 'reloading');
  assert.deepEqual(caches.store, { 'cckb-a': { 'x.js': 'new', 'y.js': 'new' }, 'other-site': { 'z.js': 'keep' } });
  assert.deepEqual(caches.deleted, []);
  assert.ok(calls.every(([, mode]) => mode === 'reload'), 'skips the browser\'s short-term copy');
  assert.equal(reloads, 1);
});

test('a file that fails to download keeps its stored copy', async () => {
  const caches = fakeCaches({ 'cckb-a': { 'x.js': 'old' } });
  const reg = { installing: null, waiting: null, update: async () => {} };
  await refreshApp({ online: true, caches, container: { getRegistration: async () => reg }, fetch: async () => { throw new Error('net'); }, reload: () => {} });
  assert.deepEqual(caches.store, { 'cckb-a': { 'x.js': 'old' } });
});

test('a new version: wait for it to take over, keep its files, then reload', async () => {
  const caches = fakeCaches({ 'cckb-new': { 'x.js': 'fresh' } });
  const worker = fakeWorker();
  let reloads = 0;
  const reg = { installing: null, waiting: null, update: async () => { reg.installing = worker; } };
  const done = refreshApp({ online: true, caches, container: { getRegistration: async () => reg }, fetch: network('net'), reload: () => { reloads += 1; } });
  await tick();
  assert.equal(reloads, 0);
  worker.become('activated');
  assert.equal(await done, 'reloading');
  assert.deepEqual(caches.store, { 'cckb-new': { 'x.js': 'fresh' } });
  assert.equal(reloads, 1);
});

test('a new version that is slow or gone still reloads, and nothing is deleted', async () => {
  for (const worker of [fakeWorker(), fakeWorker('redundant')]) {
    const caches = fakeCaches({ 'cckb-new': { 'x.js': 'part' } });
    let reloads = 0;
    const reg = { installing: worker, waiting: null, update: async () => {} };
    assert.equal(await refreshApp({ online: true, caches, container: { getRegistration: async () => reg }, fetch: network('net'), reload: () => { reloads += 1; }, wait: 10 }), 'reloading');
    assert.deepEqual(caches.deleted, []);
    assert.equal(reloads, 1);
  }
});

test('no offline worker: just reload', async () => {
  for (const container of [{ getRegistration: async () => undefined }, null]) {
    let reloads = 0;
    assert.equal(await refreshApp({ online: true, caches: fakeCaches({}), container, fetch: network('x'), reload: () => { reloads += 1; } }), 'reloading');
    assert.equal(reloads, 1);
  }
});
