import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box } from '@react-three/drei'

function MovingCamera() {
  const { camera } = useThree()
  const [positionX, setPositionX] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)
  const [touchOffsetX, setTouchOffsetX] = useState(0)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // Handle device orientation (for non-touch devices)
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

  // Handle touch input (for touch devices)
  useEffect(() => {
    if (!isTouchDevice) return // Skip if it's not a touch device

    const handleTouchStart = (e) => {
      setTouchStartX(e.touches[0].clientX)
    }

    const handleTouchMove = (e) => {
      if (touchStartX !== null) {
        const deltaX = e.touches[0].clientX - touchStartX
        setTouchOffsetX(deltaX * 0.01) // Scale down the movement
      }
    }

    const handleTouchEnd = () => {
      setTouchStartX(null)
      setTouchOffsetX(0)
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isTouchDevice, touchStartX])

  // Update camera position
  useFrame(() => {
    if (isTouchDevice) {
      // Move camera based on touch input
      camera.position.x = touchOffsetX
    } else {
      // Move camera based on device orientation
      camera.position.x = positionX
    }
    camera.lookAt(0, 0, 0) // Keep looking at center
  })

  return null
}

function Test2() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <MovingCamera />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Box position={[0, 0, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
    </Canvas>
  )
}

export default Test2