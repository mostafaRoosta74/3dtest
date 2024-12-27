import { Box, DeviceOrientationControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


function Setup({ children, cameraPosition = [-5, 5, 5], controls = true }) {
  return (
    <Canvas
      colorManagement
      shadowMap
      camera={{ position: cameraPosition }}
      pixelRatio={window.devicePixelRatio}
    >
      {children}
      {/* <ambientLight intensity={0.8} /> */}
      {/* <pointLight intensity={1} position={[0, 6, 0]} /> */}
      {controls && <OrbitControls />}
    </Canvas>
  );
}

export default function Test() {
  return (
    <Setup camera={{ near: 1, far: 1100, fov: 75 }} controls={false}>
      <DeviceOrientationControls />
      <Box args={[100, 100, 100, 4, 4, 4]}>
        <meshBasicMaterial attach="material" wireframe />
        <axesHelper args={[100]} />
      </Box>
    </Setup>
  );
}
