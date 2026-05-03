import React, { Suspense, lazy, Component } from "react";
import { DashboardShell } from "./react-engine/components/DashboardShell";

// Error boundary
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
          <div style={{ maxWidth: 500, padding: 32, textAlign: "center" }}>
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

// Lazy-load 3D
const ArchetypeCore = lazy(() =>
  import("./react-engine/components/ArchetypeCore").then((m) => ({
    default: m.ArchetypeCore,
  })),
);
const Canvas = lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas })),
);

export function App() {
  return (
    <ErrorBoundary>
      <div style={{ background: "#0a0b10", minHeight: "100vh" }}>
        <DashboardShell>
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 5.5], fov: 45 }}
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
      </div>
    </ErrorBoundary>
  );
}
