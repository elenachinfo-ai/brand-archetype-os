import React, { Suspense, lazy, Component } from "react";
import { DashboardShell } from "./react-engine/components/DashboardShell";

// Error boundary to catch runtime errors
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0b10",
            fontFamily: "Inter, sans-serif",
            color: "#94a3b8",
          }}
        >
          <div
            style={{
              maxWidth: 500,
              padding: 32,
              textAlign: "center",
            }}
          >
            <h2 style={{ fontWeight: 300, color: "#e2e8f0", marginBottom: 8 }}>
              Loading error
            </h2>
            <pre
              style={{
                fontSize: 11,
                color: "#64748b",
                textAlign: "left",
                background: "#1e293b",
                padding: 16,
                borderRadius: 12,
                overflow: "auto",
                maxHeight: 200,
              }}
            >
              {this.state.error.message}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-load the 3D core — Three.js is heavy, don't block first paint
const ArchetypeCore = lazy(() =>
  import("./react-engine/components/ArchetypeCore").then((m) => ({
    default: m.ArchetypeCore,
  })),
);

// Lazy-load the R3F Canvas — only when needed
const Canvas = lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas })),
);

/** Fallback while 3D module loads — pulsing placeholder */
function CoreFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-br from-[#CFFFE5] to-[#E6E6FA] animate-pulse opacity-40" />
        <p className="text-xs text-slate-400 font-light tracking-wide">
          Loading 3D Core…
        </p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <DashboardShell>
        <Suspense fallback={<CoreFallback />}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            dpr={[1, 1.5]}
            performance={{ min: 0.3 }}
          >
            <Suspense fallback={null}>
              <ArchetypeCore />
            </Suspense>
          </Canvas>
        </Suspense>
      </DashboardShell>
    </ErrorBoundary>
  );
}
