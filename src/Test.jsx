import { Box, DeviceOrientationControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { get_data } from "./components/Setup";


function Setup({ children, controls = true }) {
    get_data();
  return (
    <Canvas
      colorManagement
      shadowMap
      orthographic
        gl={{ antialias: false }}
      camera={{ zoom: 5, position: [0, 0, 200], far: 300, near: 50 }}
    // camera={{ near: 1, far: 1100, fov: 75 }}
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
      {/* <DeviceOrientationControls /> */}
      <Box args={[100, 100, 100, 4, 4, 4]}>
        <meshBasicMaterial attach="material" wireframe />
        <axesHelper args={[100]} />
      </Box>
      <Scene/>
    </Setup>
  );
}
