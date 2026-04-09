import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count, color, size, spread, opacity }: {
  count: number; color: string; size: number; spread: number; opacity: number;
}) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.75;
    }
    return arr;
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={opacity} sizeAttenuation />
    </points>
  );
};

const WireframeIcosahedron = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, pointer }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.x = t * 0.08 + pointer.y * 0.3;
      ref.current.rotation.y = t * 0.12 + pointer.x * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial color="#6b35ff" wireframe transparent opacity={0.06} />
    </mesh>
  );
};

const OrbitalRing = ({ radius, color, opacity, rotX, rotY }: {
  radius: number; color: string; opacity: number; rotX: number; rotY?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.05;
  });
  return (
    <mesh ref={ref} rotation={[rotX, rotY ?? 0, 0]}>
      <torusGeometry args={[radius, 0.006, 2, 120]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-pointer.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const ParticleBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <Canvas
      camera={{ position: [0, 0, 5], fov: 70 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <CameraController />
      <Particles count={1200} color="#b89cff" size={0.04} spread={20} opacity={0.5} />
      <Particles count={600} color="#ff9cf0" size={0.025} spread={25} opacity={0.3} />
      <WireframeIcosahedron />
      <OrbitalRing radius={2.8} color="#b89cff" opacity={0.15} rotX={Math.PI / 3} />
      <OrbitalRing radius={3.4} color="#ff9cf0" opacity={0.08} rotX={-Math.PI / 4} rotY={Math.PI / 6} />
    </Canvas>
  </div>
);

export default ParticleBackground;
