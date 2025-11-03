// In-memory cache with TTL for API responses
// This provides fast response times for frequently requested data

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly cleanupInterval = 5 * 60 * 1000; // 5 minutes
  private cleanupTimer?: ReturnType<typeof setInterval>;

  constructor() {
    // Start periodic cleanup
    this.startCleanup();
  }

  set<T>(key: string, data: T, ttlMs: number = 60 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Get cache statistics
  getStats(): {
    entries: number;
    keys: string[];
    oldestEntry?: string;
    newestEntry?: string;
  } {
    const entries = Array.from(this.cache.entries());
    const keys = entries.map(([key]) => key);

    if (entries.length === 0) {
      return { entries: 0, keys: [] };
    }

    const sorted = entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);

    return {
      entries: entries.length,
      keys,
      oldestEntry: sorted[0]?.[0],
      newestEntry: sorted[sorted.length - 1]?.[0],
    };
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, this.cleanupInterval);
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Rate limiting utility
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(maxRequests: number = 60, windowMs: number = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    return entry?.resetTime || Date.now();
  }

  clear(identifier?: string): void {
    if (identifier) {
      this.limits.delete(identifier);
    } else {
      this.limits.clear();
    }
  }
}

// Enhanced fetch utility with retries and exponential backoff
interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    ...fetchOptions
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Don't retry for client errors (4xx), only server errors (5xx) and network issues
      // Special case: 429 (rate limit) should be returned immediately without retry
      if (response.ok || response.status < 500) {
        return response;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on abort (timeout) for final attempt
      if (
        attempt === retries ||
        (error instanceof DOMException && error.name === "AbortError")
      ) {
        break;
      }

      // Exponential backoff with jitter
      const delay = retryDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Singleton instances
export const frameworkCache = new APICache();
export const rateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute

// Cache key generators
// Cache version - increment this to invalidate all caches when data structure changes
const CACHE_VERSION = "v2";

export function getCacheKey(type: string, ...params: string[]): string {
  return `${CACHE_VERSION}:${type}:${params.join(":")}`;
}

export function getGitHubCacheKey(
  owner: string,
  repo: string,
  endpoint: string,
): string {
  return getCacheKey("github", owner, repo, endpoint);
}

export function getNPMCacheKey(packageName: string, endpoint: string): string {
  return getCacheKey("npm", packageName, endpoint);
}

export function getBundleCacheKey(packageName: string): string {
  return getCacheKey("bundle", packageName);
}

export function getSecurityCacheKey(packageName: string): string {
  return getCacheKey("security", packageName);
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  GITHUB_REPO: 6 * 60 * 60 * 1000, // 6 hours
  GITHUB_ACTIVITY: 6 * 60 * 60 * 1000, // 6 hours
  GITHUB_RELEASES: 6 * 60 * 60 * 1000, // 6 hours
  NPM_PACKAGE: 6 * 60 * 60 * 1000, // 6 hours
  NPM_DOWNLOADS: 6 * 60 * 60 * 1000, // 6 hours
  BUNDLE_SIZE: 30 * 24 * 60 * 60 * 1000, // 30 days - bundle sizes rarely change
  SECURITY_AUDIT: 6 * 60 * 60 * 1000, // 6 hours
  FRAMEWORK_STATS: 6 * 60 * 60 * 1000, // 6 hours for complete response
} as const;

// HTTP Cache-Control header values (in seconds)
export const CACHE_CONTROL = {
  API_RESPONSE: 21600, // 6 hours for API endpoints
  PAGE_RESPONSE: 86400, // 24 hours for server-rendered pages
  STATIC_ASSETS: 31536000, // 1 year for immutable assets
} as const;

// Health check for external APIs
export async function checkAPIHealth(): Promise<{
  github: boolean;
  npm: boolean;
  bundlephobia: boolean;
  osv: boolean;
}> {
  const checks = await Promise.allSettled([
    fetch("https://api.github.com/rate_limit", { method: "HEAD" }),
    fetch("https://registry.npmjs.org/react/latest", { method: "HEAD" }),
    fetch("https://bundlephobia.com/api/size?package=react", {
      method: "HEAD",
    }),
    fetch("https://api.osv.dev/v1/query", { method: "POST", body: "{}" }),
  ]);

  return {
    github: checks[0].status === "fulfilled" && checks[0].value.ok,
    npm: checks[1].status === "fulfilled" && checks[1].value.ok,
    bundlephobia: checks[2].status === "fulfilled" && checks[2].value.ok,
    osv: checks[3].status === "fulfilled",
  };
}

// Graceful shutdown
process.on("SIGTERM", () => {
  frameworkCache.destroy();
});

process.on("SIGINT", () => {
  frameworkCache.destroy();
});
