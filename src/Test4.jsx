import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function App3() {
  const controlsRef = useRef();
  const [angle, setAngle] = useState(0);

  // Handle mouse/touch drag for 45° increments
  const handlePointerUp = () => {
    // Snap to nearest 45 degrees
    const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    setAngle(snapped);
  };

  const handlePointerMove = (event) => {
    if (event.buttons === 1) {
      // Drag horizontally to change angle
      const delta = event.movementX * 0.005;
      setAngle((prev) => prev + delta);
    }
  };

  // Device orientation listener
  useEffect(() => {
    const handleOrientation = (event) => {
      // gamma: left/right tilt, beta: front/back tilt
      const gamma = event.gamma || 0;
      setAngle((gamma / 90) * Math.PI); // map -90 to +90 to -π to +π
    };
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh", background: "#111" }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Cube */}
        <mesh rotation={[0, angle, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Optional orbit controls for testing */}
        <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
