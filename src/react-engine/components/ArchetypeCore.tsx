// =============================================================================
// ArchetypeCore — Generative 3D Soul
// Central frosted-glass icosahedron that morphs based on archetype scores.
// Uses react-three-fiber + custom vertex/fragment shaders with simplex noise.
//
// Deformation families:
//   Sage/Ruler    → perfect geometric solid, low noise, high symmetry
//   Magician/Creator → fluid mercury drop, complex wave patterns
//   Outlaw/Hero   → jagged, sharp, high-frequency displacement
//   Innocent/Caregiver → soft breathing cloud-blob, slow pulsations
// =============================================================================

import React, { useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useArchetypeEngine } from "../useArchetypeEngine";
import { qualityManager } from "./QualityManager";

// =============================================================================
// GLSL — Simplex 3D Noise (Ashima Arts / Stefan Gustavson)
// =============================================================================

const NOISE_GLSL = /* glsl */ `
  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// =============================================================================
// VERTEX SHADER — Archetype-driven displacement
// =============================================================================

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uNoiseFreq;      // noise frequency: low (Sage) → high (Outlaw)
  uniform float uNoiseAmp;       // noise amplitude: 0 (Ruler) → 0.6 (Magician)
  uniform float uSoftness;       // 0 = sharp/jagged, 1 = soft/cloud-like
  uniform float uVibrancy;       // 0 = still, 1 = energetic/mercury
  uniform float uComplexity;     // 0 = simple icosahedron, 1 = complex waves
  uniform float uPulse;          // instantaneous pulse on interaction (0→1→0)

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  varying vec3 vWorldPos;

  ${NOISE_GLSL}

  void main() {
    // ---- Multi-octave noise for rich deformation ----
    vec3 pos = position;

    // Layer 1: large slow waves (cloud/blob → Caregiver/Innocent)
    float wave1 = snoise(pos * uNoiseFreq * 0.6 + uTime * 0.3) * uNoiseAmp * uSoftness * 1.2;

    // Layer 2: medium fluid waves (mercury → Magician/Creator)
    float wave2 = snoise(pos * uNoiseFreq * 1.5 + uTime * 0.7) * uNoiseAmp * uVibrancy * 0.9;
    float wave2b = snoise(pos * uNoiseFreq * 2.1 - uTime * 0.5) * uNoiseAmp * uVibrancy * 0.5;

    // Layer 3: high-frequency jagged detail (sharp → Outlaw/Hero)
    float jagged = snoise(pos * uNoiseFreq * 3.5 + uTime * 1.2) * uNoiseAmp * (1.0 - uSoftness) * 1.0;
    float jagged2 = snoise(pos * uNoiseFreq * 5.0 - uTime * 0.9) * uNoiseAmp * (1.0 - uSoftness) * 0.6;

    // Layer 4: complex evolving patterns (high complexity)
    float complex = snoise(pos * uNoiseFreq * 2.0 + vec3(uTime * 0.4, uTime * 0.6, 0.0))
      * uNoiseAmp * uComplexity * 0.8;

    // Combine layers
    float displacement = wave1 + wave2 + wave2b + jagged + jagged2 + complex;

    // Pulse: flash of expansion on interaction
    displacement += uPulse * 0.3 * snoise(pos * 2.0 + uTime * 3.0);

    // Apply displacement along normal
    vec3 newPosition = position + normal * displacement;

    vNormal = normalize(normalMatrix * normal);
    vPosition = newPosition;
    vDisplacement = displacement;
    vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
    vWorldPos = worldPos.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// =============================================================================
// FRAGMENT SHADER — Frosted glass with inner glow
// =============================================================================

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec3 uGlowColor;       // dominant archetype accent
  uniform float uGlowIntensity;  // 0.2 (quiet) → 0.8 (vibrant)
  uniform float uSoftness;
  uniform float uVibrancy;
  uniform vec3 uCameraPos;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;
  varying vec3 vWorldPos;

  void main() {
    // ---- Fresnel effect (edges glow more) ----
    vec3 viewDir = normalize(uCameraPos - vWorldPos);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, 2.5);

    // ---- Inner glow — strongest at displacement peaks ----
    float glowMask = smoothstep(0.0, 0.4, abs(vDisplacement));
    float innerGlow = glowMask * (0.3 + uGlowIntensity * 0.7);

    // Glow color shifts with fresnel — edges get the accent color
    vec3 glowContrib = uGlowColor * (innerGlow + fresnel * 0.4 * uGlowIntensity);

    // ---- Base glass color: soft white-pastel with slight tint ----
    vec3 baseColor = mix(
      vec3(0.96, 0.97, 0.98),  // cool white
      uGlowColor,
      uGlowIntensity * 0.15 + fresnel * 0.1
    );

    // ---- Opacity: transparent with displacement-driven density ----
    float alpha = 0.55 + uGlowIntensity * 0.2 - glowMask * 0.15;
    alpha = clamp(alpha, 0.35, 0.8);

    // ---- Specular-like highlight ----
    float specular = pow(max(0.0, dot(viewDir, vNormal)), 32.0) * 0.3;

    vec3 finalColor = baseColor + glowContrib + specular * vec3(1.0);

    // Add subtle colour fringe at edges (chromatic-like)
    finalColor += fresnel * uGlowColor * 0.12;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// =============================================================================
// COMPONENT
// =============================================================================

export const ArchetypeCore: React.FC<{ className?: string }> = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pulseRef = useRef<number>(0);
  const { uiTheme, dominantArchetype } = useArchetypeEngine();
  const { camera } = useThree();

  // ---- Archetype → glow color mapping ----
  const glowColor = useMemo(() => {
    const colors: Record<string, [number, number, number]> = {
      ruler: [0.96, 0.90, 0.78],
      creator: [1.0, 0.89, 0.88],
      sage: [0.90, 0.90, 0.98],
      innocent: [0.94, 0.97, 1.0],
      explorer: [0.81, 1.0, 0.90],
      hero: [1.0, 0.98, 0.80],
      magician: [0.88, 1.0, 1.0],
      outlaw: [0.96, 0.96, 0.96],
      jester: [1.0, 0.94, 0.96],
      lover: [1.0, 0.75, 0.80],
      caregiver: [0.90, 1.0, 0.91],
      everyman: [0.98, 0.95, 0.85],
    };
    const rgb = colors[dominantArchetype ?? "everyman"] ?? [0.81, 1.0, 0.90];
    return new THREE.Vector3(rgb[0], rgb[1], rgb[2]);
  }, [dominantArchetype]);

  // ---- Shader uniforms ----
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uNoiseFreq: { value: 1.0 },
      uNoiseAmp: { value: 0.25 },
      uSoftness: { value: 0.5 },
      uVibrancy: { value: 0.5 },
      uComplexity: { value: 0.5 },
      uPulse: { value: 0 },
      uGlowColor: { value: glowColor },
      uGlowIntensity: { value: 0.5 },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [],
  );

  // ---- Update glow color when archetype changes ----
  useEffect(() => {
    uniforms.uGlowColor.value = glowColor;
  }, [glowColor, uniforms]);

  // ---- Geometry detail from QualityManager ----
  const detail = useMemo(() => {
    const q = qualityManager.state;
    return q.threejsSegments;
  }, []);

  // Re-subscribe to quality changes
  useEffect(() => {
    const unsub = qualityManager.onChange((q) => {
      if (meshRef.current) {
        // Rebuild geometry at new detail level
        const geo = new THREE.IcosahedronGeometry(1.5, Math.max(2, Math.round(q.threejsSegments / 8)));
        meshRef.current.geometry.dispose();
        meshRef.current.geometry = geo;
      }
    });
    return unsub;
  }, []);

  // ---- Listen for Pulse events (from slider/dial interactions) ----
  useEffect(() => {
    const onPulse = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.uiTheme) {
        pulseRef.current = 1.0;
        // Decay pulse over 600ms
        const start = performance.now();
        const decay = () => {
          const elapsed = performance.now() - start;
          pulseRef.current = Math.max(0, 1.0 - elapsed / 600);
          if (pulseRef.current > 0) {
            requestAnimationFrame(decay);
          }
        };
        requestAnimationFrame(decay);
      }
    };
    window.addEventListener("archetypeos:pulse", onPulse);
    return () => window.removeEventListener("archetypeos:pulse", onPulse);
  }, []);

  // ---- Animation loop ----
  useFrame((state) => {
    if (!materialRef.current) return;

    const mat = materialRef.current;
    const t = state.clock.getElapsedTime();

    // Time
    mat.uniforms.uTime.value = t;

    // Map UI theme → shader parameters
    // softness=1 (Caregiver/Innocent) → low freq, high amp, smooth
    // softness=0 (Outlaw/Hero) → high freq, jagged amp
    // vibrancy=1 (Magician/Jester) → fluid mercury waves
    // complexity=1 (Creator/Magician) → multi-layer patterns
    const s = uiTheme.softness;
    const v = uiTheme.vibrancy;
    const c = uiTheme.complexity;

    mat.uniforms.uSoftness.value = s;
    mat.uniforms.uVibrancy.value = v;
    mat.uniforms.uComplexity.value = c;

    // Noise frequency: low when ordered, high when chaotic
    // Sage/Ruler (s~0.2, v~0.2) → freq ~0.6 → stable geometric
    // Outlaw (s~0.1, v~0.9) → freq ~3.2 → jagged
    mat.uniforms.uNoiseFreq.value = 0.5 + v * 3.0 + (1.0 - s) * 1.5;

    // Noise amplitude: grows with vibrancy and complexity
    // Ruler (v~0.2, c~0.3) → amp ~0.08 → barely displaced
    // Magician (v~0.8, c~0.9) → amp ~0.55 → dramatic mercury waves
    mat.uniforms.uNoiseAmp.value = 0.05 + v * 0.45 + c * 0.3;

    // Glow intensity
    mat.uniforms.uGlowIntensity.value = 0.2 + v * 0.6;

    // Pulse
    mat.uniforms.uPulse.value = pulseRef.current;

    // Camera position for fresnel
    mat.uniforms.uCameraPos.value.copy(state.camera.position);

    // ---- Subtle base rotation ----
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015 * (0.3 + v * 0.7);
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15 * (1.0 - s);
      meshRef.current.rotation.z = Math.cos(t * 0.25) * 0.1 * v;
    }
  });

  return (
    <>
      {/* Subtle environment for glass reflections */}
      <Environment preset="studio" environmentIntensity={0.3} />

      {/* Soft ambient + point lights */}
      <ambientLight intensity={0.5} color="#f8f9fa" />
      <pointLight
        position={[3, 2, 4]}
        intensity={0.6}
        color={new THREE.Color(glowColor.x, glowColor.y, glowColor.z)}
      />
      <pointLight position={[-3, -1, -2]} intensity={0.3} color="#e0e8ff" />

      {/* The core mesh */}
      <mesh ref={meshRef} scale={1}>
        <icosahedronGeometry args={[1.5, Math.max(2, Math.round(detail / 8))]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Inner glow sphere — a smaller, fully transparent core */}
      <mesh scale={0.7}>
        <icosahedronGeometry args={[1.2, 4]} />
        <meshBasicMaterial
          color={new THREE.Color(glowColor.x, glowColor.y, glowColor.z)}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle orbit controls for gentle parallax */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={0.3}
        zoomSpeed={0.6}
        minDistance={3}
        maxDistance={8}
        autoRotate={true}
        autoRotateSpeed={0.15}
      />
    </>
  );
};

// =============================================================================
// EXPORT: Full 3D canvas setup for easy drop-in
// =============================================================================

/**
 * Usage in App:
 *   import { Canvas } from "@react-three/fiber";
 *   import { ArchetypeCore } from "./react-engine/components/ArchetypeCore";
 *
 *   <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
 *     <ArchetypeCore />
 *   </Canvas>
 */
