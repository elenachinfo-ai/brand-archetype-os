import React, { Suspense, lazy } from "react";
import { DashboardShell } from "./react-engine/components/DashboardShell";

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
  );
}
