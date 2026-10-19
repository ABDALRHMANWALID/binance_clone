export class SlidingWindowLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  check(key: string): boolean {
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter(
      (t) => now - t < this.windowMs,
    );

    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }

    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}
