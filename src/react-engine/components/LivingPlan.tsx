// =============================================================================
// LivingPlan — Interactive force-directed node graph.
// "Brand Constellation": website project nodes float in zero-gravity,
// reacting to archetype scores from useArchetypeEngine.
//
// Physics: custom spring-based force simulation (no external dependencies).
//  - Repulsion between all nodes (Coulomb-like)
//  - Attraction along defined edges (Hooke-like)
//  - Centering force toward viewport middle
//  - Mass = node importance (heavier nodes move slower)
// =============================================================================

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useArchetypeEngine } from "../useArchetypeEngine";
import type { ArchetypeId, ProjectPlanNode } from "../useArchetypeEngine";
import { Node, type PlanNodeData } from "./Node";
import { soundEngine } from "./SoundEngine";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Pastel palette — maps archetype IDs to node colors */
const NODE_COLORS: Record<string, string> = {
  ruler: "#F5E6C8",
  creator: "#FFE4E1",
  sage: "#E6E6FA",
  innocent: "#F0F8FF",
  explorer: "#CFFFE5",
  hero: "#FFFACD",
  magician: "#E0FFFF",
  outlaw: "#F5F5F5",
  jester: "#FFF0F5",
  lover: "#FFC0CB",
  caregiver: "#F5FFFA",
  everyman: "#FAFAD2",
};

/** Glow accent colors — slightly more saturated */
const GLOW_COLORS: Record<string, string> = {
  ruler: "#E8D5A3",
  creator: "#FFD0CC",
  sage: "#D0D0F0",
  innocent: "#E0F0FF",
  explorer: "#A0F0D0",
  hero: "#FFF0B0",
  magician: "#C0F8F8",
  outlaw: "#E8E8E8",
  jester: "#FFE0EC",
  lover: "#FFB0C0",
  caregiver: "#E0FFE8",
  everyman: "#F0E8C0",
};

/** Node labels with descriptions */
const NODE_META: Record<string, { label: string; description: string }> = {
  hero_section: {
    label: "Hero Section",
    description:
      "The first impression. The visual anchor that captures attention and sets the emotional tone.",
  },
  about_section: {
    label: "About",
    description:
      "The brand's origin story. Builds trust through transparency, heritage, and purpose.",
  },
  services_section: {
    label: "Services",
    description:
      "What you offer, structured for clarity. The bridge between brand promise and user need.",
  },
  portfolio_section: {
    label: "Portfolio",
    description:
      "Proof of mastery. Curated work that demonstrates capability and aesthetic judgment.",
  },
  interactive_section: {
    label: "Interactive Map",
    description:
      "Exploratory space. Users chart their own path — discovery over instruction.",
  },
  testimonials_section: {
    label: "Testimonials",
    description:
      "Social proof. Voices of real people that transform claims into trusted experience.",
  },
  cta_section: {
    label: "Call to Action",
    description:
      "The decisive moment. Conversion logic distilled into a single, irresistible invitation.",
  },
  contact_section: {
    label: "Contact",
    description:
      "Open door. Low-friction entry point for collaboration, inquiry, and relationship.",
  },
};

/** Edge definitions — which nodes connect */
const EDGES: [string, string][] = [
  ["hero_section", "about_section"],
  ["hero_section", "services_section"],
  ["about_section", "portfolio_section"],
  ["about_section", "testimonials_section"],
  ["services_section", "portfolio_section"],
  ["services_section", "interactive_section"],
  ["portfolio_section", "interactive_section"],
  ["portfolio_section", "testimonials_section"],
  ["testimonials_section", "cta_section"],
  ["interactive_section", "cta_section"],
  ["cta_section", "contact_section"],
  ["hero_section", "cta_section"], // direct conversion path
];

// =============================================================================
// FORCE SIMULATION ENGINE
// =============================================================================

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  importance: number;
  fixed: boolean; // fixed nodes don't move (e.g., after click "activation")
}

interface SimState {
  nodes: SimNode[];
  edges: [string, string][];
  width: number;
  height: number;
}

const FORCE_CONFIG = {
  repel: 2800,         // repulsion strength
  attract: 0.06,       // edge attraction strength
  restLength: 120,      // ideal edge length
  center: 0.008,       // centering force
  damping: 0.82,       // velocity decay per tick
  maxVelocity: 4,      // speed cap
  minEnergy: 0.08,     // threshold to stop simulation
  alpha: 1,            // initial simulation heat
  alphaDecay: 0.002,   // cooling rate
};

function initSimNodes(
  plan: ProjectPlanNode[],
  width: number,
  height: number,
): SimNode[] {
  const cx = width / 2;
  const cy = height / 2;
  const spread = Math.min(width, height) * 0.35;

  return plan.map((p, i) => {
    // Distribute nodes in a rough circle initially
    const angle = (i / Math.max(plan.length, 1)) * Math.PI * 2;
    const radius = spread * (0.5 + p.currentImportance * 0.5);
    return {
      id: p.id,
      x: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
      y: cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
      vx: 0,
      vy: 0,
      mass: 0.4 + p.currentImportance * 1.2,
      importance: p.currentImportance,
      fixed: false,
    };
  });
}

function tickSimulation(state: SimState): { stable: boolean } {
  const { nodes, edges, width, height } = state;
  const cx = width / 2;
  const cy = height / 2;

  // Update alpha (cooling)
  FORCE_CONFIG.alpha = Math.max(0.001, FORCE_CONFIG.alpha - FORCE_CONFIG.alphaDecay);

  let totalEnergy = 0;

  // ---- Repulsion: every node repels every other ----
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      // Avoid division by zero and extreme forces at close range
      const minDist = 30;
      if (dist < minDist) dist = minDist;

      const force = FORCE_CONFIG.repel / (dist * dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (!a.fixed) {
        a.vx -= fx / a.mass;
        a.vy -= fy / a.mass;
      }
      if (!b.fixed) {
        b.vx += fx / b.mass;
        b.vy += fy / b.mass;
      }
    }
  }

  // ---- Attraction: edges pull connected nodes together ----
  for (const [srcId, tgtId] of edges) {
    const a = nodes.find((n) => n.id === srcId);
    const b = nodes.find((n) => n.id === tgtId);
    if (!a || !b) continue;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const displacement = dist - FORCE_CONFIG.restLength;
    const force = FORCE_CONFIG.attract * displacement;

    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    if (!a.fixed) {
      a.vx += fx / a.mass;
      a.vy += fy / a.mass;
    }
    if (!b.fixed) {
      b.vx -= fx / (b.mass * 0.8); // slightly asymmetric for visual interest
      b.vy -= fy / (b.mass * 0.8);
    }
  }

  // ---- Centering: gentle pull toward center ----
  for (const node of nodes) {
    if (node.fixed) continue;
    const dx = cx - node.x;
    const dy = cy - node.y;
    node.vx += dx * FORCE_CONFIG.center;
    node.vy += dy * FORCE_CONFIG.center;
  }

  // ---- Integrate: apply velocity, damping, clamping ----
  for (const node of nodes) {
    if (node.fixed) continue;

    // Damping
    node.vx *= FORCE_CONFIG.damping;
    node.vy *= FORCE_CONFIG.damping;

    // Clamp velocity
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > FORCE_CONFIG.maxVelocity) {
      const scale = FORCE_CONFIG.maxVelocity / speed;
      node.vx *= scale;
      node.vy *= scale;
    }

    // Boundary: soft edge constraint
    const margin = 60;
    if (node.x < margin) node.vx += (margin - node.x) * 0.02;
    if (node.x > width - margin) node.vx -= (node.x - (width - margin)) * 0.02;
    if (node.y < margin) node.vy += (margin - node.y) * 0.02;
    if (node.y > height - margin) node.vy -= (node.y - (height - margin)) * 0.02;

    // Integrate position
    node.x += node.vx;
    node.y += node.vy;

    totalEnergy += Math.abs(node.vx) + Math.abs(node.vy);
  }

  const avgEnergy = totalEnergy / nodes.length;
  return { stable: avgEnergy < FORCE_CONFIG.minEnergy && FORCE_CONFIG.alpha < 0.01 };
}

// =============================================================================
// COMPONENT
// =============================================================================

export const LivingPlan: React.FC<{ className?: string }> = ({ className = "" }) => {
  const {
    projectPlan,
    dominantArchetype,
    normalizedScores,
    uiTheme,
    t,
    direction,
  } = useArchetypeEngine();

  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<SimState | null>(null);
  const rafRef = useRef<number>(0);
  const [nodePositions, setNodePositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [rippleNode, setRippleNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });

  const isRTL = direction === "rtl";

  // ---- Resize observer ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.max(width, 300), height: Math.max(height, 300) });
      }
    });
    observer.observe(container);

    // Initial size
    const rect = container.getBoundingClientRect();
    setDimensions({ width: Math.max(rect.width, 300), height: Math.max(rect.height, 300) });

    return () => observer.disconnect();
  }, []);

  // ---- Initialize / re-initialize simulation when projectPlan changes ----
  useEffect(() => {
    const simNodes = initSimNodes(projectPlan, dimensions.width, dimensions.height);
    simulationRef.current = {
      nodes: simNodes,
      edges: EDGES,
      width: dimensions.width,
      height: dimensions.height,
    };
    FORCE_CONFIG.alpha = 1;

    // Immediately set initial positions
    const positions: Record<string, { x: number; y: number }> = {};
    simNodes.forEach((n) => {
      positions[n.id] = { x: n.x, y: n.y };
    });
    setNodePositions(positions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectPlan, dimensions.width, dimensions.height]);

  // ---- Update node masses when importance changes ----
  useEffect(() => {
    const sim = simulationRef.current;
    if (!sim) return;

    for (const node of sim.nodes) {
      const planNode = projectPlan.find((p) => p.id === node.id);
      if (planNode) {
        node.importance = planNode.currentImportance;
        node.mass = 0.4 + planNode.currentImportance * 1.2;
      }
    }
  }, [projectPlan]);

  // ---- Simulation tick loop ----
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;
      const sim = simulationRef.current;
      if (!sim) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Update dimensions
      sim.width = dimensions.width;
      sim.height = dimensions.height;

      // Run several physics steps per frame for smoothness
      let stable = false;
      for (let i = 0; i < 3; i++) {
        stable = tickSimulation(sim).stable;
      }

      // Update React state with new positions
      const positions: Record<string, { x: number; y: number }> = {};
      sim.nodes.forEach((n) => {
        positions[n.id] = { x: n.x, y: n.y };
      });
      setNodePositions(positions);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dimensions.width, dimensions.height]);

  // ---- Map project plan to visual node data ----
  const visualNodes: PlanNodeData[] = useMemo(() => {
    if (!dominantArchetype) return [];

    const glowColor = GLOW_COLORS[dominantArchetype] ?? "#CFFFE5";

    return projectPlan.map((planNode) => {
      const meta = NODE_META[planNode.id] ?? {
        label: t(planNode.labelKey),
        description: "",
      };

      // Derive color from archetype scores: weighted blend of top archetypes
      const topArchetypes = (Object.entries(normalizedScores) as [string, number][])
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      // Blend colors of top archetypes
      let r = 0, g = 0, b = 0, totalWeight = 0;
      for (const [archId, score] of topArchetypes) {
        const hex = NODE_COLORS[archId] ?? "#FAFAD2";
        const weight = score / 100;
        r += parseInt(hex.slice(1, 3), 16) * weight;
        g += parseInt(hex.slice(3, 5), 16) * weight;
        b += parseInt(hex.slice(5, 7), 16) * weight;
        totalWeight += weight;
      }
      const blendedColor = `#${Math.round(r / totalWeight).toString(16).padStart(2, "0")}${Math.round(g / totalWeight).toString(16).padStart(2, "0")}${Math.round(b / totalWeight).toString(16).padStart(2, "0")}`;

      // Affinity: how strongly the dominant archetype boosts this node
      const affinity = (planNode as any).archetypeAffinity?.[dominantArchetype] ?? 1.0;

      const pos = nodePositions[planNode.id] ?? { x: dimensions.width / 2, y: dimensions.height / 2 };

      return {
        id: planNode.id,
        label: meta.label,
        description: meta.description,
        importance: planNode.currentImportance,
        affinity,
        color: blendedColor,
        glowColor,
        x: pos.x,
        y: pos.y,
        isHighlighted: highlightedNode === planNode.id,
      };
    });
  }, [projectPlan, dominantArchetype, normalizedScores, nodePositions, highlightedNode, dimensions, t]);

  // ---- Node click handler ----
  const handleNodeClick = useCallback(
    (id: string) => {
      setHighlightedNode((prev) => (prev === id ? null : id));

      // Ripple effect
      setRippleNode(id);
      setTimeout(() => setRippleNode(null), 600);

      // Sound
      soundEngine.play("water-drop", 0.5);

      // Fix the clicked node briefly
      const sim = simulationRef.current;
      if (sim) {
        const node = sim.nodes.find((n) => n.id === id);
        if (node) {
          node.fixed = true;
          // "Camera zoom": pull the node toward center gently
          const cx = dimensions.width / 2;
          const cy = dimensions.height / 2;
          node.vx += (cx - node.x) * 0.1;
          node.vy += (cy - node.y) * 0.1;
          // Release after 2 seconds
          setTimeout(() => {
            node.fixed = false;
          }, 2000);
        }
      }
    },
    [dimensions.width, dimensions.height],
  );

  // ---- Determine which edges to highlight ----
  const activeEdges = useMemo(() => {
    if (!highlightedNode) return EDGES;
    return EDGES.filter(([a, b]) => a === highlightedNode || b === highlightedNode);
  }, [highlightedNode]);

  const glowColor = dominantArchetype ? GLOW_COLORS[dominantArchetype] ?? "#CFFFE5" : "#CFFFE5";

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="overflow-visible"
      >
        {/* Defs: filters and gradients */}
        <defs>
          {/* Glow filter for highlighted edges */}
          <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ripple radial gradient */}
          <radialGradient id="ripple-grad">
            <stop offset="0%" stopColor={glowColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={glowColor} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* ---- Edges ---- */}
        {EDGES.map(([srcId, tgtId]) => {
          const src = nodePositions[srcId];
          const tgt = nodePositions[tgtId];
          if (!src || !tgt) return null;

          const isActive = activeEdges.some(
            ([a, b]) => a === srcId && b === tgtId,
          );
          const isHighlightedEdge =
            highlightedNode &&
            (highlightedNode === srcId || highlightedNode === tgtId);

          return (
            <motion.line
              key={`${srcId}-${tgtId}`}
              x1={src.x}
              y1={src.y}
              x2={tgt.x}
              y2={tgt.y}
              stroke={isHighlightedEdge ? glowColor : "rgba(255,255,255,0.2)"}
              strokeWidth={isHighlightedEdge ? 1 : 0.5}
              strokeDasharray={isHighlightedEdge ? "none" : "4 4"}
              filter={isHighlightedEdge ? "url(#edge-glow)" : undefined}
              animate={{
                x1: src.x,
                y1: src.y,
                x2: tgt.x,
                y2: tgt.y,
                opacity: isActive ? 1 : 0.2,
              }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 22,
              }}
            />
          );
        })}

        {/* ---- Ripple effect on click ---- */}
        {rippleNode &&
          nodePositions[rippleNode] &&
          (() => {
            const pos = nodePositions[rippleNode];
            return (
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={10}
                fill="url(#ripple-grad)"
                initial={{ r: 10, opacity: 0.8 }}
                animate={{ r: Math.min(dimensions.width, dimensions.height) * 0.5, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            );
          })()}

        {/* ---- Nodes ---- */}
        {visualNodes.map((nodeData) => (
          <Node
            key={nodeData.id}
            data={nodeData}
            onClick={handleNodeClick}
            isRTL={isRTL}
          />
        ))}
      </svg>

      {/* ---- Ambient label ---- */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-light tracking-wider uppercase pointer-events-none">
        {dominantArchetype
          ? `Constellation · ${t(`archetypes.${dominantArchetype}`)}`
          : "Constellation · Awaiting input"}
      </div>
    </div>
  );
};
