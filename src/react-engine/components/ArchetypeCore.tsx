// =============================================================================
// ArchetypeCore v2 — Dramatic visual transformations.
// References: Pentagram, Studio Dumbar, DesignStudio.
// Big geometry, bold noise, visible glow, halo particles.
// =============================================================================

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useArchetypeEngine } from "../useArchetypeEngine";
import { qualityManager } from "./QualityManager";

// ---- Simplex 3D Noise GLSL (compact) ----
const NOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERT = /* glsl */ `
uniform float uTime, uFreq, uAmp, uSoft, uVibrant, uComplex, uPulse;
varying vec3 vNormal, vWorld;
varying float vDisp;
${NOISE}
void main(){
  vec3 p=position;
  // Cloud layer (Caregiver/Innocent: soft=1)
  float w1=snoise(p*uFreq*0.5+uTime*0.25)*uAmp*uSoft*1.5;
  // Fluid layer (Magician/Creator: vibrant=1)
  float w2=snoise(p*uFreq*1.8+uTime*0.6)*uAmp*uVibrant*1.3;
  float w2b=snoise(p*uFreq*2.5-uTime*0.4)*uAmp*uVibrant*0.7;
  // Jagged layer (Outlaw/Hero: soft=0)
  float j1=snoise(p*uFreq*4.5+uTime*1.0)*uAmp*(1.0-uSoft)*1.4;
  float j2=snoise(p*uFreq*7.0-uTime*0.8)*uAmp*(1.0-uSoft)*0.9;
  // Complex patterns (Creator/Magician: complex=1)
  float cx=snoise(p*uFreq*2.5+vec3(uTime*0.5,uTime*0.7,0.0))*uAmp*uComplex*1.2;
  float disp=w1+w2+w2b+j1+j2+cx;
  disp+=uPulse*0.4*snoise(p*2.0+uTime*4.0);
  vec3 np=position+normal*disp;
  vNormal=normalize(normalMatrix*normal);
  vDisp=disp;
  vec4 wp=modelMatrix*vec4(np,1.0);
  vWorld=wp.xyz;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(np,1.0);
}
`;

const FRAG = /* glsl */ `
uniform float uTime, uGlowIntensity, uSoft, uVibrant;
uniform vec3 uGlowColor, uCameraPos;
varying vec3 vNormal, vWorld;
varying float vDisp;
void main(){
  vec3 viewDir=normalize(uCameraPos-vWorld);
  float fresnel=pow(1.0-abs(dot(viewDir,vNormal)),3.0);
  float glowMask=smoothstep(0.0,0.35,abs(vDisp));
  float innerGlow=glowMask*(0.4+uGlowIntensity*0.6);
  vec3 glowContrib=uGlowColor*(innerGlow+fresnel*0.55*uGlowIntensity);
  vec3 base=mix(vec3(0.94,0.96,0.98),uGlowColor,uGlowIntensity*0.25+fresnel*0.15);
  float alpha=0.5+uGlowIntensity*0.25-glowMask*0.12;
  alpha=clamp(alpha,0.3,0.85);
  float spec=pow(max(0.0,dot(viewDir,vNormal)),40.0)*0.35;
  vec3 col=base+glowContrib+spec*vec3(1.0);
  col+=fresnel*uGlowColor*0.18;
  gl_FragColor=vec4(col,alpha);
}
`;

// ---- Archetype glow colors (saturated) ----
const GLOW_RGB: Record<string, [number, number, number]> = {
  ruler: [0.95, 0.84, 0.55],
  creator: [1.0, 0.7, 0.75],
  sage: [0.65, 0.7, 0.95],
  innocent: [0.7, 0.95, 0.8],
  explorer: [0.5, 0.9, 0.85],
  hero: [1.0, 0.75, 0.4],
  magician: [0.65, 0.5, 0.95],
  outlaw: [0.85, 0.35, 0.2],
  jester: [1.0, 0.55, 0.7],
  lover: [0.95, 0.35, 0.55],
  caregiver: [0.45, 0.85, 0.6],
  everyman: [0.7, 0.65, 0.5],
};

// ---- Halo particle geometry ----
function HaloParticles({
  color,
  count = 400,
}: {
  color: THREE.Color;
  count: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 1.3;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.12;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ArchetypeCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pulseRef = useRef(0);
  const { uiTheme, dominantArchetype } = useArchetypeEngine();
  const { camera } = useThree();

  const glowColor = useMemo(() => {
    const rgb = GLOW_RGB[dominantArchetype ?? "everyman"] ?? [0.5, 0.9, 0.85];
    return new THREE.Color(rgb[0], rgb[1], rgb[2]);
  }, [dominantArchetype]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFreq: { value: 1.0 },
      uAmp: { value: 0.4 },
      uSoft: { value: 0.5 },
      uVibrant: { value: 0.5 },
      uComplex: { value: 0.5 },
      uPulse: { value: 0 },
      uGlowColor: { value: new THREE.Vector3(0.5, 0.9, 0.85) },
      uGlowIntensity: { value: 0.5 },
      uCameraPos: { value: new THREE.Vector3() },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uGlowColor.value.set(glowColor.r, glowColor.g, glowColor.b);
  }, [glowColor, uniforms]);

  // Quality-aware geometry detail
  const geoDetail = useMemo(() => {
    const q = qualityManager.state;
    return Math.max(3, Math.round(q.threejsSegments / 6));
  }, []);

  useEffect(() => {
    return qualityManager.onChange((q) => {
      if (meshRef.current) {
        const d = Math.max(3, Math.round(q.threejsSegments / 6));
        meshRef.current.geometry.dispose();
        meshRef.current.geometry = new THREE.IcosahedronGeometry(2.0, d);
      }
    });
  }, []);

  // Pulse on interaction
  useEffect(() => {
    const onPulse = () => {
      pulseRef.current = 1.0;
      const start = performance.now();
      const decay = () => {
        const e = performance.now() - start;
        pulseRef.current = Math.max(0, 1.0 - e / 500);
        if (pulseRef.current > 0) requestAnimationFrame(decay);
      };
      requestAnimationFrame(decay);
    };
    window.addEventListener("archetypeos:pulse", onPulse);
    return () => window.removeEventListener("archetypeos:pulse", onPulse);
  }, []);

  // ---- Animation loop: dramatic deformation ----
  useFrame((state) => {
    if (!matRef.current) return;
    const mat = matRef.current;
    const t = state.clock.getElapsedTime();
    const s = uiTheme.softness;
    const v = uiTheme.vibrancy;
    const c = uiTheme.complexity;

    mat.uniforms.uTime.value = t;
    mat.uniforms.uSoft.value = s;
    mat.uniforms.uVibrant.value = v;
    mat.uniforms.uComplex.value = c;

    // DRAMATIC ranges:
    // Ruler (s≈0.2, v≈0.2, c≈0.3) → freq 0.5, amp 0.05 → nearly perfect sphere
    // Magician (s≈0.5, v≈0.8, c≈0.9) → freq 3.5, amp 1.0 → wild fluid
    // Outlaw (s≈0.1, v≈0.9, c≈0.5) → freq 5.0, amp 1.2 → razor sharp
    // Caregiver (s≈0.9, v≈0.3, c≈0.4) → freq 1.2, amp 0.7 → soft cloud
    mat.uniforms.uFreq.value = 0.4 + v * 5.0 + (1.0 - s) * 2.5;
    mat.uniforms.uAmp.value = 0.04 + v * 0.9 + c * 0.5 + (1.0 - s) * 0.4;
    mat.uniforms.uGlowIntensity.value = 0.3 + v * 0.7;
    mat.uniforms.uPulse.value = pulseRef.current;
    mat.uniforms.uCameraPos.value.copy(state.camera.position);

    if (meshRef.current) {
      // Fast dramatic rotation when vibrant, slow when calm
      meshRef.current.rotation.y += 0.003 * (0.3 + v * 1.5);
      meshRef.current.rotation.x =
        Math.sin(t * 0.3) * 0.2 * (1.0 - s + v * 0.5);
      meshRef.current.rotation.z = Math.cos(t * 0.35) * 0.15 * v;
      // Pulse scale effect
      const ps = 1.0 + pulseRef.current * 0.08;
      meshRef.current.scale.setScalar(ps);
    }
  });

  return (
    <>
      <Environment preset="studio" environmentIntensity={0.25} />
      <ambientLight intensity={0.6} color="#fafbfc" />
      <pointLight position={[4, 2, 5]} intensity={0.8} color={glowColor} />
      <pointLight position={[-4, -1, -3]} intensity={0.4} color="#d0d8ff" />
      <pointLight position={[0, -3, 2]} intensity={0.3} color={glowColor} />

      {/* Main core — big geometry (radius 2.0) */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.0, geoDetail]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Inner glow — visible saturated core */}
      <mesh scale={0.55}>
        <icosahedronGeometry args={[1.8, 4]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.12 + uiTheme.vibrancy * 0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Halo particles — orbit the core */}
      <HaloParticles
        color={glowColor}
        count={qualityManager.state.tier === "low" ? 150 : 400}
      />

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={0.25}
        zoomSpeed={0.5}
        minDistance={3.5}
        maxDistance={9}
        autoRotate={true}
        autoRotateSpeed={0.2}
      />
    </>
  );
};
