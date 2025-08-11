import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function App4() {
  const controlsRef = useRef();
  const [angleY, setAngleY] = useState(0); // horizontal rotation from dragging
  const [angleX, setAngleX] = useState(0); // vertical rotation from device
  const [dragging, setDragging] = useState(false);

  // --- Dragging logic ---
  const handlePointerDown = () => setDragging(true);

  const handlePointerUp = () => {
    setDragging(false);
    // Snap horizontal rotation to nearest 45 degrees
    setAngleY((prev) => Math.round(prev / (Math.PI / 4)) * (Math.PI / 4));
  };

  const handlePointerMove = (event) => {
    if (dragging && event.buttons === 1) {
      // Only change Y rotation on drag
      const delta = event.movementX * 0.005;
      setAngleY((prev) => prev + delta);
    }
  };

  // --- Device orientation logic (controls vertical) ---
  useEffect(() => {
    const handleOrientation = (event) => {
      if (dragging) return; // ignore if dragging
      const beta = event.beta || 0; // front/back tilt
      const clamped = Math.max(-45, Math.min(45, beta)); // limit to avoid extreme tilt
      setAngleX((clamped / 90) * Math.PI); // map -45..45° to about -π/2..π/2
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
        <mesh rotation={[angleX, angleY, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Keep orbit controls disabled for user rotation */}
        <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
