'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { NanoFishData } from '@/app/page';
import { Color, Euler, Group, MathUtils, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type FiberExports = typeof import('@react-three/fiber');
type DreiExports = typeof import('@react-three/drei');

const PerspectiveLights: FC = () => (
  <>
    <ambientLight intensity={0.45} />
    <directionalLight
      position={[30, 35, 25]}
      intensity={1.4}
      color="#b2e4ff"
      castShadow
    />
    <pointLight position={[-40, -20, -15]} intensity={0.6} color="#6bd3ff" />
    <spotLight
      position={[0, 15, 50]}
      intensity={0.8}
      angle={0.6}
      penumbra={0.5}
      color="#7fe0ff"
    />
  </>
);

const WaterCaustics: FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -30, 0]} receiveShadow>
    <planeGeometry args={[200, 200]} />
    <meshStandardMaterial color="#0d1b2a" roughness={0.85} metalness={0.05} />
  </mesh>
);

const OceanScene: FC<{ data: NanoFishData }> = ({ data }) => {
  const [fiber, setFiber] = useState<FiberExports | null>(null);
  const [drei, setDrei] = useState<DreiExports | null>(null);
  const background = useMemo(() => new Color('#051726'), []);

  useEffect(() => {
    let mounted = true;
    Promise.all([import('@react-three/fiber'), import('@react-three/drei')])
      .then(([fiberModule, dreiModule]) => {
        if (mounted) {
          setFiber(fiberModule);
          setDrei(dreiModule);
        }
      })
      .catch((error) => {
        console.error('Failed to load 3D runtime', error);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!fiber || !drei) {
    return <div className="absolute inset-0" aria-hidden />;
  }

  const { Canvas, useFrame, useLoader } = fiber;
  const { Environment, OrbitControls, PerspectiveCamera } = drei;

  const FishModel: FC<{
    position: { x: number; y: number; z: number };
    orientation: { yaw: number; pitch: number; roll: number };
  }> = ({ position, orientation }) => {
    const gltf = useLoader(
      GLTFLoader,
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF/BarramundiFish.gltf'
    );
    const groupRef = useRef<Group | null>(null);

    const targetPosition = useMemo(
      () => new Vector3(position.x * 0.25, position.y * 0.25, position.z * 0.25),
      [position.x, position.y, position.z]
    );

    const targetQuaternion = useMemo(() => {
      const yaw = MathUtils.degToRad(orientation.yaw);
      const pitch = MathUtils.degToRad(orientation.pitch);
      const roll = MathUtils.degToRad(orientation.roll);
      const euler = new Euler(pitch, yaw, roll, 'YXZ');
      const quaternion = new Quaternion();
      quaternion.setFromEuler(euler);
      return quaternion;
    }, [orientation.pitch, orientation.roll, orientation.yaw]);

    useFrame((_, delta) => {
      const group = groupRef.current;
      if (!group) return;

      const lerpFactor = 1 - Math.exp(-6 * delta);
      group.position.lerp(targetPosition, lerpFactor);
      group.quaternion.slerp(targetQuaternion, lerpFactor);
    });

    return (
      <group ref={groupRef} dispose={null} scale={0.3} position={[0, 0, 0]}>
        <primitive object={gltf.scene} />
      </group>
    );
  };

  return (
    <Canvas className="absolute inset-0" shadows>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 15, 120]} />
      <PerspectiveCamera makeDefault position={[0, 8, 55]} fov={55} />
      <PerspectiveLights />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      <FishModel position={data.fishPosition} orientation={data.fishOrientation} />
      <WaterCaustics />
      <Environment preset="sunset" />
    </Canvas>
  );
};

export default OceanScene;
