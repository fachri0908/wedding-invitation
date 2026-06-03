import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Float,
  Sparkles,
  ContactShadows,
  MeshDistortMaterial,
} from '@react-three/drei';
import * as THREE from 'three';

function Crystal() {
  const ref = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.35;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.6;
      inner.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={ref} castShadow>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshPhysicalMaterial
          color="#E3F3F0"
          transmission={1}
          thickness={1.4}
          roughness={0.04}
          ior={1.55}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor="#1BB7A6"
          attenuationDistance={2.4}
          envMapIntensity={1.8}
          specularIntensity={1}
          metalness={0}
        />
      </mesh>

      <mesh ref={inner} scale={0.55}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#5FDDCB"
          emissive="#1BB7A6"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.6}
          distort={0.25}
          speed={1.6}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[1.6, 1.68, 64]} />
        <meshBasicMaterial
          color="#5FDDCB"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.85, 1.9, 64]} />
        <meshBasicMaterial
          color="#1BB7A6"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[2.05, 2.08, 64]} />
        <meshBasicMaterial
          color="#A6F0E6"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function OrbitingShards() {
  const group = useRef<THREE.Group>(null);
  const shards = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const radius = 2.4 + Math.random() * 0.6;
        const y = (Math.random() - 0.5) * 1.6;
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          y,
          scale: 0.06 + Math.random() * 0.1,
          speed: 0.3 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
        };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <Float
          key={i}
          speed={s.speed * 2}
          rotationIntensity={2}
          floatIntensity={1.2}
        >
          <mesh position={[s.x, s.y, s.z]} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color="#E3F3F0"
              transmission={0.9}
              thickness={0.6}
              roughness={0.1}
              ior={1.5}
              metalness={0.1}
              emissive="#1BB7A6"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Snow() {
  const ref = useRef<THREE.Points>(null);
  const count = 220;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const geom = ref.current.geometry as THREE.BufferGeometry;
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= delta * 0.35;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 2 + i) * delta * 0.08;
      if (arr[i * 3 + 1] < -3) arr[i * 3 + 1] = 3;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function CrystalScene({ height = 320 }: { height?: number }) {
  return (
    <div style={{ width: '100%', height }}>
      <Canvas
        camera={{ position: [0, 0.4, 5], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={1.4}
          color="#ffffff"
        />
        <pointLight position={[-3, 2, 2]} intensity={1.6} color="#1BB7A6" />
        <pointLight position={[2, -2, 3]} intensity={1.2} color="#5FDDCB" />
        <pointLight position={[0, 3, -2]} intensity={0.9} color="#A6F0E6" />

        <Suspense fallback={null}>
          <Environment preset="city" />
          <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
            <Crystal />
          </Float>
          <OrbitingShards />
          <Snow />
          <Sparkles
            count={60}
            scale={[5, 4, 4]}
            size={3}
            speed={0.4}
            color="#ffffff"
          />
          <ContactShadows
            position={[0, -1.7, 0]}
            opacity={0.35}
            scale={6}
            blur={2.4}
            far={3}
            color="#062A3B"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
