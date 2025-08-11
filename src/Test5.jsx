import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  const controlsRef = useRef();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = () => setDragging(true);
  const handlePointerUp = () => setDragging(false);

  const handlePointerMove = (event) => {
    if (dragging && event.buttons === 1) {
      const deltaX = event.movementX * 0.005;
      const deltaY = event.movementY * 0.005;
      setRotation((prev) => ({
        x: prev.x - deltaY,
        y: prev.y + deltaX,
      }));
    }
  };

  // Device orientation (when not dragging)
  useEffect(() => {
    const handleOrientation = (event) => {
      if (dragging) return;
      const beta = event.beta || 0; // front/back tilt
      const gamma = event.gamma || 0; // left/right tilt

      // Map device rotation to radians
      const xRot = (beta / 180) * Math.PI; // beta ranges roughly -180 to 180
      const yRot = (gamma / 180) * Math.PI;

      setRotation({ x: xRot, y: yRot });
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [dragging]);

  return (
    <div
      style={{ width: "100vw", height: "100vh", background: "#111" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Cube */}
        <mesh rotation={[rotation.x, rotation.y, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Keep orbit controls disabled for custom rotation */}
        <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
