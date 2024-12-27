import { OrbitControls } from "@react-three/drei";
import { Mesh, PlaneGeometry, Group, Vector3, MathUtils,BoxGeometry,MeshBasicMaterial,AxesHelper   } from 'three'
import { memo, useRef, useState, useLayoutEffect } from 'react'
import { Canvas, createRoot, events, extend, useFrame } from '@react-three/fiber'

export function Canvas1({ children }) {
    extend({ Mesh, PlaneGeometry, Group,BoxGeometry,MeshBasicMaterial ,AxesHelper  })
    const canvas = useRef(null)
    const root = useRef(null)
    useLayoutEffect(() => {
      if (!root.current) {
        root.current = createRoot(canvas.current).configure({
          events,
          orthographic: true,
          gl: { antialias: false },
          camera: { zoom: 5, position: [0, 0, 200], far: 300, near: 50 },
          onCreated: (state) => {
            state.events.connect(document.getElementById('root'))
            state.setEvents({
              compute: (event, state) => {
                state.pointer.set(
                  (event.clientX / state.size.width) * 2 - 1,
                  -(event.clientY / state.size.height) * 2 + 1,
                )
                state.raycaster.setFromCamera(state.pointer, state.camera)
              },
            })
          },
        })
      }
      const resize = () =>
        root.current.configure({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      window.addEventListener('resize', resize)
      root.current.render(children)
      return () => window.removeEventListener('resize', resize)
    }, [children])
  
    return (
      <canvas
        ref={canvas}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'block',
        }}
      />
    )
  }
  

export function Setup({ children, cameraPosition = [-5, 5, 5], controls = true }) {
    return (
      <Canvas
        gl={{antialias:false}}
        orthographic
        //colorManagement
        //shadowMap
        camera={{ zoom: 5, position: [0, 0, 200], far: 300, near: 50 }}
        //pixelRatio={window.devicePixelRatio}
      >
        {children}
        {controls && <OrbitControls enabled={true} />}
      </Canvas>
    );
  }