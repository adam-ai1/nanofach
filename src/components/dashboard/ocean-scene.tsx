'use client';

import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { NanoFishData } from '@/app/page';
 codex/check-for-errors-in-project-ivrcrk
import {
  BoxGeometry,

 codex/check-for-errors-in-project-0pm7nw
import {
  BoxGeometry,
 main
  Color,
  ConeGeometry,
  Euler,
  Group,
  MathUtils,
 codex/check-for-errors-in-project-ivrcrk
  MeshBasicMaterial,

 main
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
 codex/check-for-errors-in-project-ivrcrk


import { Color, Euler, Group, MathUtils, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
 main
 main

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

  const { Canvas, useFrame } = fiber;
  const { Environment, OrbitControls, PerspectiveCamera } = drei;

  const FishModel: FC<{
    position: { x: number; y: number; z: number };
    orientation: { yaw: number; pitch: number; roll: number };
  }> = ({ position, orientation }) => {
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

    const bodyMaterial = useMemo(
      () =>
        new MeshPhysicalMaterial({
 codex/check-for-errors-in-project-ivrcrk
          color: '#5a4bb3',
          roughness: 0.4,
          metalness: 0.08,
          clearcoat: 0.55,
          clearcoatRoughness: 0.35,
          sheen: 0.35,
          sheenColor: new Color('#5f8cff'),

          color: '#d86c29',
          roughness: 0.35,
          metalness: 0.05,
          clearcoat: 0.35,
          clearcoatRoughness: 0.6,
 main
        }),
      []
    );

    const finMaterial = useMemo(
      () =>
        new MeshStandardMaterial({
 codex/check-for-errors-in-project-ivrcrk
          color: '#f7c948',
          transparent: true,
          opacity: 0.9,
          roughness: 0.5,
          metalness: 0.1,

          color: '#f1c59a',
          transparent: true,
          opacity: 0.92,
          roughness: 0.6,
          metalness: 0.05,
 main
        }),
      []
    );

    const accentMaterial = useMemo(
      () =>
        new MeshStandardMaterial({
 codex/check-for-errors-in-project-ivrcrk
          color: '#111116',
          metalness: 0.75,
          roughness: 0.22,
        }),
      []
    );

    const decalMaterial = useMemo(
      () =>
        new MeshBasicMaterial({
          color: '#2be4ff',
          transparent: true,
          opacity: 0.8,
        }),
      []
    );

    const eyeMaterial = useMemo(
      () =>
        new MeshStandardMaterial({
          color: '#0a0a0a',
          metalness: 0.15,
          roughness: 0.4,

          color: '#1f1f1f',
          metalness: 0.7,
          roughness: 0.2,
 main
        }),
      []
    );

    const bodyGeometry = useMemo(() => new SphereGeometry(7, 42, 42), []);
 codex/check-for-errors-in-project-ivrcrk
    const tailGeometry = useMemo(() => new ConeGeometry(2.6, 6.8, 24), []);
    const dorsalFinGeometry = useMemo(() => new ConeGeometry(2.2, 5.8, 18), []);
    const ventralFinGeometry = useMemo(() => new ConeGeometry(1.6, 4.4, 18), []);
    const eyeGeometry = useMemo(() => new SphereGeometry(0.8, 16, 16), []);
    const decalGeometry = useMemo(() => new CircleGeometry(2.2, 32), []);
    const deviceBodyGeometry = useMemo(() => new BoxGeometry(1.9, 0.9, 2.2), []);
    const deviceWingGeometry = useMemo(() => new BoxGeometry(1.2, 0.6, 2.8), []);

    const tailGeometry = useMemo(() => new ConeGeometry(3, 7, 24), []);
    const dorsalFinGeometry = useMemo(() => new ConeGeometry(2.3, 5, 18), []);
    const ventralFinGeometry = useMemo(() => new ConeGeometry(1.8, 4, 18), []);
    const deviceBodyGeometry = useMemo(() => new BoxGeometry(1.8, 0.8, 2.2), []);
    const deviceWingGeometry = useMemo(() => new BoxGeometry(1.1, 0.6, 2.8), []);
 main

    useEffect(
      () => () => {
        bodyMaterial.dispose();
        finMaterial.dispose();
        accentMaterial.dispose();
 codex/check-for-errors-in-project-ivrcrk
        decalMaterial.dispose();
        eyeMaterial.dispose();

 main
        bodyGeometry.dispose();
        tailGeometry.dispose();
        dorsalFinGeometry.dispose();
        ventralFinGeometry.dispose();
 codex/check-for-errors-in-project-ivrcrk
        eyeGeometry.dispose();
        decalGeometry.dispose();

 main
        deviceBodyGeometry.dispose();
        deviceWingGeometry.dispose();
      },
      [
        accentMaterial,
        bodyGeometry,
        bodyMaterial,
 codex/check-for-errors-in-project-ivrcrk
        decalGeometry,
        decalMaterial,
        deviceBodyGeometry,
        deviceWingGeometry,
        dorsalFinGeometry,
        eyeGeometry,
        eyeMaterial,

        deviceBodyGeometry,
        deviceWingGeometry,
        dorsalFinGeometry,
 main
        finMaterial,
        tailGeometry,
        ventralFinGeometry,
      ]
    );

    useFrame((_, delta) => {
      const group = groupRef.current;
      if (!group) return;

      const lerpFactor = 1 - Math.exp(-6 * delta);
      group.position.lerp(targetPosition, lerpFactor);
      group.quaternion.slerp(targetQuaternion, lerpFactor);
    });

    return (
      <group ref={groupRef} dispose={null} scale={0.22} position={[0, 0, 0]}>
 codex/check-for-errors-in-project-ivrcrk
        <mesh geometry={bodyGeometry} material={bodyMaterial} scale={[1.35, 0.96, 0.62]} />
        <mesh
          geometry={tailGeometry}
          material={finMaterial}
          position={[-8.4, 0.5, 0]}
          rotation={[0, 0, MathUtils.degToRad(14)]}
          scale={[1.05, 1.25, 1]}

        <mesh geometry={bodyGeometry} material={bodyMaterial} scale={[1.2, 0.95, 0.7]} />
        <mesh
          geometry={tailGeometry}
          material={finMaterial}
          position={[-7.8, 0.4, 0]}
          rotation={[0, 0, MathUtils.degToRad(12)]}
          scale={[1.1, 1.2, 1]}
 main
        />
        <mesh
          geometry={dorsalFinGeometry}
          material={finMaterial}
 codex/check-for-errors-in-project-ivrcrk
          position={[0.4, 2.1, -0.2]}
          rotation={[MathUtils.degToRad(80), 0, 0]}
          scale={[0.85, 0.9, 0.9]}

          position={[0.8, 1.8, 0]}
          rotation={[MathUtils.degToRad(82), 0, 0]}
          scale={[0.8, 0.8, 0.8]}
 main
        />
        <mesh
          geometry={ventralFinGeometry}
          material={finMaterial}
 codex/check-for-errors-in-project-ivrcrk
          position={[1.2, -2.1, 0]}
          rotation={[MathUtils.degToRad(-78), 0, 0]}
          scale={[0.95, 0.95, 0.95]}
        />
        <mesh geometry={eyeGeometry} material={eyeMaterial} position={[5.6, 1, 1.2]} />
        <mesh geometry={eyeGeometry} material={eyeMaterial} position={[5.6, 1, -1.2]} />
        <mesh
          geometry={decalGeometry}
          material={decalMaterial}
          position={[2.4, 0.4, 1.8]}
          rotation={[0, 0, MathUtils.degToRad(8)]}
          scale={[1.15, 1.15, 1]}
        />
        <mesh geometry={deviceBodyGeometry} material={accentMaterial} position={[-3.6, -0.6, -0.7]} />
        <mesh geometry={deviceWingGeometry} material={accentMaterial} position={[-4.7, -0.5, 0.9]} />

          position={[1.4, -1.8, 0]}
          rotation={[MathUtils.degToRad(-75), 0, 0]}
          scale={[0.9, 0.9, 0.9]}
        />
        <mesh geometry={deviceBodyGeometry} material={accentMaterial} position={[-3.8, -0.5, -0.7]} />
        <mesh geometry={deviceWingGeometry} material={accentMaterial} position={[-4.8, -0.4, 0.8]} />
 main
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
