import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests = new Map<string, RateLimitRecord>();
  private readonly MAX_REQUESTS = 100; // 100 requests per window
  private readonly WINDOW_MS = 60000; // 1 minute
  private readonly CLEANUP_INTERVAL = 300000; // Clean up every 5 minutes

  constructor() {
    // Cleanup old records periodically
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const ip = this.getClientIp(req);
    const now = Date.now();
    const record = this.requests.get(ip);

    // Check if record exists and is still valid
    if (!record || now > record.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.WINDOW_MS });
      this.setRateLimitHeaders(res, 1, this.MAX_REQUESTS, this.WINDOW_MS);
      return next();
    }

    // Check if limit exceeded
    if (record.count >= this.MAX_REQUESTS) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'กรุณารอสักครู่ก่อนลองใหม่ (Rate limit exceeded)',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    // Increment count
    record.count++;
    this.setRateLimitHeaders(res, record.count, this.MAX_REQUESTS, Math.ceil((record.resetTime - now) / 1000));
    next();
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.ip ||
      req.connection.remoteAddress ||
      'unknown'
    );
  }

  private setRateLimitHeaders(
    res: Response,
    remaining: number,
    limit: number,
    reset: number,
  ) {
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - remaining).toString());
    res.setHeader('X-RateLimit-Reset', reset.toString());
  }

  private cleanup() {
    const now = Date.now();
    for (const [ip, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(ip);
      }
    }
  }
}

