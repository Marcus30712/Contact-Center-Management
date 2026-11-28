// "새로 받기" in Settings (2026-11-28): get the newest page files without
// touching learning records (they live in localStorage, not in the caches) and
// without ever throwing away the offline copy. Everything the browser provides
// is passed in, so tests can use fakes.

export const CACHE_PREFIX = 'cckb-';

// Resolves with the promise's value, or rejects after `ms`.
function within(promise, ms) {
  let timer;
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), ms); }),
  ]).finally(() => clearTimeout(timer));
}

// Resolves when the worker is activated, gone, or after `wait` ms.
function settled(worker, wait) {
  if (worker.state === 'activated' || worker.state === 'redundant') return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, wait);
    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated' || worker.state === 'redundant') { clearTimeout(timer); resolve(); }
    });
  });
}

// Fetch every stored file again past the browser's short-term copy; a file
// that fails keeps the copy it had.
async function refreshStored(caches, fetchFn) {
  const names = ((await caches.keys()) ?? []).filter((n) => n.startsWith(CACHE_PREFIX));
  await Promise.allSettled(names.map(async (name) => {
    const cache = await caches.open(name);
    const requests = await cache.keys();
    await Promise.allSettled(requests.map(async (req) => {
      const response = await fetchFn(req.url, { cache: 'reload' });
      if (response && response.ok && response.status !== 206) await cache.put(req, response);
    }));
  }));
}

// online: navigator.onLine; caches: CacheStorage; container: navigator.serviceWorker;
// fetch: window.fetch; reload: () => location.reload().
// Returns 'offline' or 'unreachable' (nothing done) or 'reloading'.
export async function refreshApp({ online, caches, container, fetch: fetchFn, reload, checkWait = 10000, wait = 60000 }) {
  if (online === false) return 'offline';
  let reg = null;
  try { reg = await container?.getRegistration?.(); } catch { reg = null; }
  if (!reg) { reload(); return 'reloading'; }
  try {
    await within(reg.update(), checkWait);
  } catch {
    return 'unreachable';
  }
  const worker = reg.installing || reg.waiting;
  if (worker) {
    // A new version stores its files fresh and replaces the old copy itself.
    await settled(worker, wait);
  } else {
    try { await refreshStored(caches, fetchFn); } catch { /* blocked storage: reload anyway */ }
  }
  reload();
  return 'reloading';
}
