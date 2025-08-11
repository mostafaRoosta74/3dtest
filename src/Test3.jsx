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

function BlendedControls({ gyroEnabled, driftTarget, driftStrength }) {
  const { camera, gl } = useThree();
  const orbitRef = useRef();
  const deviceRef = useRef();
  const targetQuaternion = useRef(new THREE.Quaternion());

  useFrame(() => {
    // Get device orientation if gyro is enabled
    if (gyroEnabled && deviceRef.current) {
      deviceRef.current.update();
      targetQuaternion.current.copy(camera.quaternion);
    }

    // OrbitControls update
    if (orbitRef.current) {
      orbitRef.current.update();
    }

    // Smooth blending toward target orientation
    if (gyroEnabled) {
      camera.quaternion.slerp(targetQuaternion.current, 0.05);
    } else if (driftTarget && driftStrength > 0) {
      camera.quaternion.slerp(driftTarget, 0.02 * driftStrength);
    }
  });

  return (
    <>
      <OrbitControls
        ref={orbitRef}
        args={[camera, gl.domElement]}
        enablePan={false}
        enableZoom={true}
      />
      {gyroEnabled && (
        <DeviceOrientationControls ref={deviceRef} args={[camera]} />
      )}
    </>
  );
}

export default function App2() {
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [driftTarget, setDriftTarget] = useState(null);
  const [driftStrength, setDriftStrength] = useState(0);
  const cameraRef = useRef();

  const toggleGyro = async () => {
    if (
      !gyroEnabled &&
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== "granted") {
          alert("Motion permission denied. Cannot enable gyroscope.");
          return;
        }
      } catch (err) {
        console.error("Error requesting motion permission:", err);
        return;
      }
    }

    if (gyroEnabled && cameraRef.current) {
      const q = new THREE.Quaternion().copy(cameraRef.current.quaternion);
      setDriftTarget(q);
      setDriftStrength(1);

      // Gradually fade drift
      let fade = 1;
      const fadeInterval = setInterval(() => {
        fade -= 0.05;
        if (fade <= 0) {
          setDriftStrength(0);
          setDriftTarget(null);
          clearInterval(fadeInterval);
        } else {
          setDriftStrength(fade);
        }
      }, 100);
    } else {
      setDriftTarget(null);
      setDriftStrength(0);
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

      <Canvas
        camera={{ position: [3, 3, 3], fov: 60 }}
        onCreated={({ camera }) => (cameraRef.current = camera)}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Cube />
        <BlendedControls
          gyroEnabled={gyroEnabled}
          driftTarget={driftTarget}
          driftStrength={driftStrength}
        />
      </Canvas>
    </>
  );
}
