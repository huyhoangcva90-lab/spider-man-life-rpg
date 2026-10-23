// Cache only connection status, never credentials or personal records.
export function createSessionReader(fetcher = fetch, clock = Date.now) {
  let cached, checkedAt = -Infinity, pending;
  return async function read({ force = false } = {}) {
    if (pending) return pending;
    if (!force && clock() - checkedAt < 30000) return cached;
    pending = (async () => {
      try {
        const response = await fetcher('/api/notion-session', { cache: 'no-store' });
        if (!response.ok) throw new Error('Connection unavailable');
        cached = await response.json();
        checkedAt = clock();
        return cached;
      } catch (error) { cached = undefined; checkedAt = -Infinity; throw error; }
      finally { pending = null; }
    })();
    return pending;
  };
}
