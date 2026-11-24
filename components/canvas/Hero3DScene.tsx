"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useIsTouchDevice,
  usePrefersReducedMotion,
} from "@/components/ui/useReducedMotion";

interface ShardSpec {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  phase: number;
}

const SHARDS: ShardSpec[] = [
  { position: [3.35, -1.65, 0.7], scale: [0.34, 0.56, 0.28], rotation: [0.4, 0.5, 0.2], speed: 0.45, phase: 0.2 },
  { position: [2.75, -2.05, 1.1], scale: [0.24, 0.4, 0.22], rotation: [1.1, 0.3, 0.7], speed: 0.62, phase: 1.4 },
  { position: [3.9, -0.45, 0.35], scale: [0.22, 0.36, 0.2], rotation: [0.2, 1.2, 0.4], speed: 0.52, phase: 2.3 },
  { position: [3.65, 1.35, 0.2], scale: [0.26, 0.42, 0.22], rotation: [0.8, 0.9, 0.1], speed: 0.4, phase: 3.1 },
  { position: [-0.25, 1.6, -0.4], scale: [0.18, 0.32, 0.18], rotation: [0.6, 0.2, 1.0], speed: 0.55, phase: 4.0 },
  { position: [0.1, -1.75, 0.45], scale: [0.22, 0.34, 0.2], rotation: [0.3, 1.4, 0.5], speed: 0.48, phase: 5.2 },
  { position: [4.15, -1.25, -0.3], scale: [0.3, 0.48, 0.25], rotation: [1.2, 0.6, 0.3], speed: 0.36, phase: 2.8 },
];

function ObsidianShardsAndEmbers({
  pointerRef,
}: {
  pointerRef: React.RefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shardsRef = useRef<(THREE.Group | null)[]>([]);
  const particlesRef = useRef<THREE.Points>(null);

  const shardGeometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const shardEdges = useMemo(
    () => new THREE.EdgesGeometry(shardGeometry),
    [shardGeometry]
  );

  const particlePositions = useMemo(() => {
    const count = 110;
    const arr = new Float32Array(count * 3);
    const pseudo = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      arr[i * 3] = -1.2 + pseudo(i * 3 + 1) * 6.2;
      arr[i * 3 + 1] = -2.8 + pseudo(i * 3 + 2) * 5.6;
      arr[i * 3 + 2] = -1.5 + pseudo(i * 3 + 3) * 3.0;
    }
    return arr;
  }, []);

  useEffect(() => {
    return () => {
      shardGeometry.dispose();
      shardEdges.dispose();
    };
  }, [shardGeometry, shardEdges]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const px = pointerRef.current?.x ?? 0;
    const py = pointerRef.current?.y ?? 0;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        px * 0.14,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -py * 0.1,
        0.05
      );
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        px * 0.22,
        0.04
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        py * 0.15,
        0.04
      );
    }

    shardsRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const spec = SHARDS[idx];
      mesh.rotation.y += delta * spec.speed * 0.45;
      mesh.rotation.x += delta * spec.speed * 0.25;
      mesh.position.y =
        spec.position[1] + Math.sin(t * spec.speed + spec.phase) * 0.18;
    });

    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i) + delta * (0.12 + (i % 5) * 0.035);
        if (y > 3.0) y = -3.0;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.28} />
      <pointLight
        position={[1.8, 0.8, 2.5]}
        intensity={14}
        color="#ff5500"
        distance={12}
      />
      <pointLight
        position={[3.4, -1.4, 2.2]}
        intensity={8}
        color="#ffa23a"
        distance={10}
      />

      {/* Orbiting Faceted Obsidian Shards with Ember Rim Wireframe */}
      {SHARDS.map((shard, index) => (
        <group
          key={index}
          ref={(el) => {
            shardsRef.current[index] = el;
          }}
          position={shard.position}
          scale={shard.scale}
          rotation={shard.rotation}
        >
          <mesh geometry={shardGeometry}>
            <meshStandardMaterial
              color="#120c0a"
              metalness={0.85}
              roughness={0.22}
              emissive="#3b1200"
              emissiveIntensity={0.45}
            />
          </mesh>
          <lineSegments geometry={shardEdges}>
            <lineBasicMaterial
              color={index % 2 === 0 ? "#ff5a00" : "#ffa23a"}
              transparent
              opacity={0.72}
            />
          </lineSegments>
        </group>
      ))}

      {/* Rising Ember Micro-Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#ffa23a"
          transparent
          opacity={0.72}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export function Hero3DScene({ paused = false }: { paused?: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      pointerRef.current.y = -(
        (e.clientY / Math.max(window.innerHeight, 1)) * 2 -
        1
      );
    };
    const onVisibility = () => setTabVisible(!document.hidden);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion || webglError || isTouch || paused) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView && tabVisible ? "always" : "never"}
        camera={{ position: [0, 0, 5.4], fov: 44 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setWebglError(true);
          });
        }}
      >
        <ObsidianShardsAndEmbers pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
}
