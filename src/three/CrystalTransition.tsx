import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const DURATION = 2600;
const SHARD_COUNT = 56;

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInCubic(t: number) {
  return t * t * t;
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type Phase = { tIn: number; tHold: number; tBurst: number; tFade: number };
const PHASE: Phase = { tIn: 0.22, tHold: 0.35, tBurst: 0.82, tFade: 1.0 };

function ShardField({ startedAt }: { startedAt: number }) {
  const group = useRef<THREE.Group>(null);
  const shardRefs = useRef<THREE.Mesh[]>([]);

  const shards = useMemo(() => {
    const arr: {
      dir: THREE.Vector3;
      basePos: THREE.Vector3;
      rotAxis: THREE.Vector3;
      rotSpeed: number;
      scale: number;
      delay: number;
      speed: number;
    }[] = [];
    for (let i = 0; i < SHARD_COUNT; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / SHARD_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi),
      );
      const r = 1.05;
      arr.push({
        dir,
        basePos: dir.clone().multiplyScalar(r),
        rotAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize(),
        rotSpeed: 2 + Math.random() * 4,
        scale: 0.13 + Math.random() * 0.12,
        delay: Math.random() * 0.18,
        speed: 6 + Math.random() * 4,
      });
    }
    return arr;
  }, []);

  useFrame(() => {
    const elapsed = (performance.now() - startedAt) / DURATION;
    const p = clamp01(elapsed);
    shards.forEach((s, i) => {
      const m = shardRefs.current[i];
      if (!m) return;
      const inT = clamp01(p / PHASE.tIn);
      const inE = easeOutCubic(inT);
      const burstT = clamp01(
        (p - PHASE.tHold - s.delay) / (PHASE.tBurst - PHASE.tHold),
      );
      const burstE = easeInCubic(burstT);
      const fadeT = clamp01((p - PHASE.tBurst) / (PHASE.tFade - PHASE.tBurst));

      const dist = inE * 1.0 + burstE * s.speed;
      m.position.set(
        s.dir.x * dist,
        s.dir.y * dist,
        s.dir.z * dist,
      );

      const scale =
        s.scale * (0.2 + inE * 0.8) * (1 - fadeT * 0.6);
      m.scale.setScalar(Math.max(0.0001, scale));

      m.rotation.x += 0.015 * s.rotSpeed * (1 + burstE * 3);
      m.rotation.y += 0.012 * s.rotSpeed * (1 + burstE * 3);
      m.rotation.z += 0.018 * s.rotSpeed * (1 + burstE * 3);

      const mat = m.material as THREE.MeshPhysicalMaterial;
      mat.opacity = 1 - fadeT;
      mat.emissiveIntensity =
        0.4 + Math.sin(p * 16) * 0.3 + burstE * 1.8;
    });
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) shardRefs.current[i] = el;
          }}
          position={s.basePos}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#E3F3F0"
            transmission={0.85}
            thickness={0.6}
            roughness={0.08}
            ior={1.55}
            clearcoat={1}
            clearcoatRoughness={0.05}
            metalness={0.1}
            emissive="#1BB7A6"
            emissiveIntensity={0.6}
            transparent
            attenuationColor="#5FDDCB"
            attenuationDistance={1.6}
            envMapIntensity={1.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function Core({ startedAt }: { startedAt: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const elapsed = (performance.now() - startedAt) / DURATION;
    const p = clamp01(elapsed);
    if (!ref.current) return;
    const inE = easeOutCubic(clamp01(p / PHASE.tIn));
    const pulseT = clamp01((p - PHASE.tIn) / (PHASE.tHold - PHASE.tIn));
    const pulse = 1 + Math.sin(pulseT * Math.PI) * 0.45;
    const burst = clamp01((p - PHASE.tHold) / (PHASE.tBurst - PHASE.tHold));
    const scale = inE * pulse * (1 + burst * 4);
    ref.current.scale.setScalar(scale);
    ref.current.rotation.y += 0.04;
    ref.current.rotation.x += 0.025;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    const fadeT = clamp01((p - PHASE.tBurst) / (PHASE.tFade - PHASE.tBurst));
    mat.opacity = (1 - fadeT) * (0.6 + burst * 0.4);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function CoreGlow({ startedAt }: { startedAt: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const elapsed = (performance.now() - startedAt) / DURATION;
    const p = clamp01(elapsed);
    if (!ref.current) return;
    const burst = clamp01((p - PHASE.tHold) / (PHASE.tBurst - PHASE.tHold));
    const burstE = easeInOutCubic(burst);
    const fadeT = clamp01((p - PHASE.tBurst) / (PHASE.tFade - PHASE.tBurst));
    const s = 0.4 + burstE * 6;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = burstE * (1 - fadeT) * 0.9;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial
        color="#E3F3F0"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function CameraDolly({ startedAt }: { startedAt: number }) {
  const { camera } = useThree();
  useFrame(() => {
    const elapsed = (performance.now() - startedAt) / DURATION;
    const p = clamp01(elapsed);
    const e = easeInOutCubic(p);
    camera.position.z = 5.2 - e * 3.4;
    camera.position.y = Math.sin(p * Math.PI * 0.6) * 0.18;
    camera.rotation.z = (p - 0.5) * 0.18;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function ScreenFlash({ startedAt }: { startedAt: number }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = clamp01((performance.now() - startedAt) / DURATION);
      let o = 0;
      if (p > PHASE.tHold && p < PHASE.tBurst) {
        const t = (p - PHASE.tHold) / (PHASE.tBurst - PHASE.tHold);
        o = Math.sin(t * Math.PI) * 0.55;
      } else if (p >= PHASE.tBurst) {
        const t = clamp01((p - PHASE.tBurst) / (PHASE.tFade - PHASE.tBurst));
        o = 0.55 * (1 - t);
      }
      setOpacity(o);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startedAt]);
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[110]"
      style={{
        background:
          'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(166,240,230,0.8) 35%, rgba(27,183,166,0.4) 70%, transparent 100%)',
        opacity,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export function CrystalTransition({ onDone }: { onDone: () => void }) {
  const startedAtRef = useRef<number>(performance.now());
  const doneRef = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, DURATION);
    return () => window.clearTimeout(id);
  }, [onDone]);

  const startedAt = startedAtRef.current;

  return (
    <>
      <div className="fixed inset-0 z-[105]">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={1.6} />
          <pointLight position={[-3, 2, 2]} intensity={2.2} color="#1BB7A6" />
          <pointLight position={[2, -2, 3]} intensity={1.8} color="#5FDDCB" />
          <pointLight position={[0, 3, -2]} intensity={1.2} color="#A6F0E6" />

          <Suspense fallback={null}>
            <Environment preset="city" />
            <ShardField startedAt={startedAt} />
            <Core startedAt={startedAt} />
            <CoreGlow startedAt={startedAt} />
            <Sparkles
              count={120}
              scale={[6, 5, 5]}
              size={4}
              speed={1.4}
              color="#ffffff"
            />
            <CameraDolly startedAt={startedAt} />
          </Suspense>
        </Canvas>
      </div>
      <ScreenFlash startedAt={startedAt} />
    </>
  );
}
