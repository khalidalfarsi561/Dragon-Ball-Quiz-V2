// A unified interface for Key-Value storage.
// In production, implement Redis/Vercel KV here.
// For this demo, we use a simple in-memory cache to prevent basic replay attacks.

const memoryCache = new Map<string, { value: any, expiresAt: number }>();

function cleanup() {
  const now = Date.now();
  for (const [key, item] of memoryCache.entries()) {
    if (item.expiresAt < now) {
      memoryCache.delete(key);
    }
  }
}

export const kv = {
  async set(key: string, value: any, ttlSeconds: number) {
    cleanup();
    memoryCache.set(key, { value, expiresAt: Date.now() + (ttlSeconds * 1000) });
  },
  
  async get(key: string) {
    cleanup();
    const item = memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt < Date.now()) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  },

  async del(key: string) {
    memoryCache.delete(key);
  }
};
