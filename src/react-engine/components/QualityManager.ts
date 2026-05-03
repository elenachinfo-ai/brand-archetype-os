// =============================================================================
// ArchetypeOS — QualityManager
// Detects device performance and scales rendering complexity to maintain
// a target frame rate. Reduces Three.js segments and particle counts if
// the frame rate drops below 50fps.
// =============================================================================

export type QualityTier = "ultra" | "high" | "medium" | "low";

export interface QualityState {
  tier: QualityTier;
  fps: number;
  threejsSegments: number;  // geometry detail multiplier
  particleCount: number;    // max particles
  blurPrecision: number;    // backdrop-filter blur quality
  animationComplexity: number; // 0..1 — Framer Motion animation scale
}

const TIER_CONFIG: Record<QualityTier, Omit<QualityState, "tier" | "fps">> = {
  ultra: {
    threejsSegments: 64,
    particleCount: 2000,
    blurPrecision: 1,
    animationComplexity: 1,
  },
  high: {
    threejsSegments: 32,
    particleCount: 1200,
    blurPrecision: 1,
    animationComplexity: 0.9,
  },
  medium: {
    threejsSegments: 16,
    particleCount: 600,
    blurPrecision: 0.5,
    animationComplexity: 0.6,
  },
  low: {
    threejsSegments: 8,
    particleCount: 200,
    blurPrecision: 0, // disable blur on ultra-low
    animationComplexity: 0.3,
  },
};

export class QualityManager {
  private _currentTier: QualityTier = "high";
  private _fpsHistory: number[] = [];
  private _frameCount = 0;
  private _lastCheck = performance.now();
  private _checkInterval = 2000; // re-evaluate every 2s
  private _rafId: number | null = null;
  private _onChangeCallbacks: Array<(state: QualityState) => void> = [];

  /** Detect initial tier from hardware */
  detect(): QualityTier {
    // Check for mobile / low-power devices
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const memory = (navigator as any).deviceMemory as number | undefined; // GB
    const cores = navigator.hardwareConcurrency || 4;

    if (isMobile && cores <= 4 && (memory ?? 4) <= 4) {
      return "low";
    }
    if (isMobile || cores <= 4) {
      return "medium";
    }
    if (cores >= 8 && (memory ?? 8) >= 8) {
      return "ultra";
    }
    return "high";
  }

  /** Start monitoring frame rate */
  start(): void {
    this._currentTier = this.detect();
    this._lastCheck = performance.now();
    this._frameCount = 0;

    const tick = () => {
      this._frameCount++;
      const now = performance.now();
      if (now - this._lastCheck >= this._checkInterval) {
        const elapsed = (now - this._lastCheck) / 1000;
        const fps = this._frameCount / elapsed;
        this._fpsHistory.push(fps);
        if (this._fpsHistory.length > 5) this._fpsHistory.shift();

        // Re-evaluate tier
        this._evaluate(fps);

        this._frameCount = 0;
        this._lastCheck = now;
      }
      this._rafId = requestAnimationFrame(tick);
    };

    this._rafId = requestAnimationFrame(tick);
  }

  /** Stop monitoring */
  stop(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /** Subscribe to quality changes */
  onChange(cb: (state: QualityState) => void): () => void {
    this._onChangeCallbacks.push(cb);
    return () => {
      this._onChangeCallbacks = this._onChangeCallbacks.filter((c) => c !== cb);
    };
  }

  /** Current quality state */
  get state(): QualityState {
    const avgFps =
      this._fpsHistory.length > 0
        ? this._fpsHistory.reduce((s, v) => s + v, 0) / this._fpsHistory.length
        : 60;

    return {
      tier: this._currentTier,
      fps: Math.round(avgFps),
      ...TIER_CONFIG[this._currentTier],
    };
  }

  /** Re-evaluate tier based on current FPS */
  private _evaluate(fps: number): void {
    const prevTier = this._currentTier;

    if (fps < 35 && this._currentTier !== "low") {
      // Downgrade one level
      const tiers: QualityTier[] = ["ultra", "high", "medium", "low"];
      const idx = tiers.indexOf(this._currentTier);
      this._currentTier = tiers[Math.min(idx + 1, 3)];
    } else if (fps > 55 && this._currentTier !== "ultra") {
      // Try upgrading
      const tiers: QualityTier[] = ["ultra", "high", "medium", "low"];
      const idx = tiers.indexOf(this._currentTier);
      this._currentTier = tiers[Math.max(idx - 1, 0)];
    }

    if (this._currentTier !== prevTier) {
      console.log(
        `[QualityManager] Tier changed: ${prevTier} → ${this._currentTier} (${Math.round(fps)} fps)`,
      );
      this._onChangeCallbacks.forEach((cb) => cb(this.state));
    }
  }
}

// Singleton
export const qualityManager = new QualityManager();
