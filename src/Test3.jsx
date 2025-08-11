import React, { useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, DeviceOrientationControls } from "@react-three/drei";
import * as THREE from "three";

function Cube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function BlendedControls({ gyroEnabled }) {
  const { camera, gl } = useThree();
  const orbitRef = useRef();
  const deviceRef = useRef();
  const pivotRef = useRef(new THREE.Object3D()); // pivot around object

  useFrame(() => {
    if (gyroEnabled && deviceRef.current) {
      deviceRef.current.update();
    }
    if (orbitRef.current && !gyroEnabled) {
      orbitRef.current.update();
    }
  });

  return (
    <>
      <group ref={pivotRef} position={[0, 0, 0]}>
        <primitive object={camera} position={[0, 0, 5]} /> {/* camera orbiting center */}
      </group>
      <OrbitControls
        ref={orbitRef}
        args={[camera, gl.domElement]}
        enablePan={false}
        enableZoom={true}
        enabled={!gyroEnabled}
      />
      {gyroEnabled && (
        <DeviceOrientationControls ref={deviceRef} args={[camera]} />
      )}
    </>
  );
}

export default function App2() {
  const [gyroEnabled, setGyroEnabled] = useState(false);

  const toggleGyro = async () => {
    if (
      !gyroEnabled &&
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== "granted") {
          alert("Motion permission denied.");
          return;
        }
      } catch (err) {
        console.error(err);
        return;
      }
    }
    setGyroEnabled((prev) => !prev);
  };

  return (
    <>
      <button
        style={{
          position: "absolute",
          zIndex: 1,
          top: 20,
          left: 20,
          padding: "8px 12px",
          background: gyroEnabled ? "#4CAF50" : "#f44336",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px"
        }}
        onClick={toggleGyro}
      >
        {gyroEnabled ? "Disable Gyro" : "Enable Gyro"}
      </button>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Cube />
        <BlendedControls gyroEnabled={gyroEnabled} />
      </Canvas>
    </>
  );
}
