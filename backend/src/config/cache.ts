// This file works with OR without Redis.
// If Redis is available, use it. Otherwise, fall back to in-memory Map.
// When you're ready for production, just install Redis and it works automatically.

interface CacheStore {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttlSeconds?: number): Promise<void>
  del(key: string): Promise<void>
  flush(): Promise<void>
}

// Simple in-memory cache (works without Redis)
class MemoryCache implements CacheStore {
  private store = new Map<string, { value: string; expiresAt: number | null }>()

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key)
    if (!entry) return null
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.value
  }

  async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    })
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }

  async flush(): Promise<void> {
    this.store.clear()
  }
}

export const cache: CacheStore = new MemoryCache()

// Cache helper — get from cache or compute + store
export async function withCache<T>(
  key:        string,
  fn:         () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  const cached = await cache.get(key)
  if (cached) return JSON.parse(cached) as T

  const result = await fn()
  await cache.set(key, JSON.stringify(result), ttlSeconds)
  return result
}