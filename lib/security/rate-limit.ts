import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Fallback in-memory rate limiter for development when Upstash env is missing
class InMemoryRateLimiter {
  private hits: Map<string, { count: number; expiresAt: number }> = new Map();

  constructor(private limitCount: number, private windowMs: number) {}

  async limit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now();
    const entry = this.hits.get(identifier);

    if (!entry || entry.expiresAt <= now) {
      this.hits.set(identifier, {
        count: 1,
        expiresAt: now + this.windowMs,
      });
      return {
        success: true,
        limit: this.limitCount,
        remaining: this.limitCount - 1,
        reset: now + this.windowMs,
      };
    }

    if (entry.count >= this.limitCount) {
      return {
        success: false,
        limit: this.limitCount,
        remaining: 0,
        reset: entry.expiresAt,
      };
    }

    entry.count += 1;
    return {
      success: true,
      limit: this.limitCount,
      remaining: this.limitCount - entry.count,
      reset: entry.expiresAt,
    };
  }
}

const hasUpstashConfig = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

function createLimiter(limit: number, duration: `${number} ${'s' | 'm' | 'h' | 'd'}`) {
  if (hasUpstashConfig) {
    try {
      const redis = Redis.fromEnv();
      return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, duration),
      });
    } catch {
      // Fall through to memory limiter if initialization fails
    }
  }

  // Parse duration for memory limiter
  const parts = duration.split(' ');
  const val = parseInt(parts[0], 10);
  const unit = parts[1];
  const ms =
    unit === 's'
      ? val * 1000
      : unit === 'm'
      ? val * 60 * 1000
      : unit === 'h'
      ? val * 60 * 60 * 1000
      : val * 24 * 60 * 60 * 1000;

  return new InMemoryRateLimiter(limit, ms);
}

// 1. Search: 30 calls per minute per IP (Blueprint item 15)
export const searchLimit = createLimiter(30, '1 m');

// 2. Report button: 5 per hour per user (Blueprint item 15)
export const reportLimit = createLimiter(5, '1 h');

// 3. Admin upload: 20 per hour (Blueprint item 15)
export const uploadLimit = createLimiter(20, '1 h');

// 4. NEBULA: 10 per minute per user (Blueprint item 15)
export const nebulaLimit = createLimiter(10, '1 m');
