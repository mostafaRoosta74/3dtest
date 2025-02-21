import React, { useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, DeviceOrientationControls, OrbitControls } from '@react-three/drei'

function MovingCamera() {
  const { camera } = useThree()
  const [positionX, setPositionX] = useState(0)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Detect if the user is on a touch device
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(isTouch)
  }, [])

  // Listen to device orientation events (only for non-touch devices)
  useEffect(() => {
    if (isTouchDevice) return // Skip if it's a touch device

    const handleOrientation = (e) => {
      if (e.gamma !== null) {
        // Gamma ranges from -90 to 90, convert to -2 to 2 range
        setPositionX(e.gamma / 45)
      }
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [isTouchDevice])

  // Update camera position (only for non-touch devices)
  useFrame(() => {
    if (!isTouchDevice) {
      camera.position.x = positionX
      camera.lookAt(0, 0, 0) // Keep looking at center
    }
  })

  return null
}

function Text2() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      {/* Enable device orientation controls (for mobile permission prompt) */}
      <DeviceOrientationControls />

      {/* Enable OrbitControls for touch devices */}
      <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />

      <MovingCamera />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Box position={[0, 0, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
    </Canvas>
  )
}

export default Text2