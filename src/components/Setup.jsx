import { Mesh, PlaneGeometry, Group, Vector3, MathUtils,BoxGeometry,MeshBasicMaterial,AxesHelper   } from 'three'
import { memo, useRef, useState, useLayoutEffect } from 'react'
import { Canvas, createRoot, events, extend, useFrame } from '@react-three/fiber'
import { Box, DeviceOrientationControls, OrbitControls } from "@react-three/drei";

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
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'block',
      }}
        gl={{antialias:false}}
        orthographic
        //colorManagement
        //shadowMap
        camera={{ zoom: 5, position: [0, 0, 200], far: 300, near: 50 }}
        //pixelRatio={window.devicePixelRatio}
      >
        {children}
        {controls && <OrbitControls />}
      </Canvas>
    );
  }


  export const get_data = ()=> {
    let deltaBeta = 0;
    let deltaGamma = 0;
    
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function (e) {
        const beta = (e.beta != null) ? Math.round(e.beta) : 0;
        const gamma = (e.gamma != null) ? Math.round(e.gamma) : 0;
    
        deltaBeta = Math.abs(beta - deltaBeta);
        deltaGamma = Math.abs(gamma - deltaGamma);
    
        $("#beta").html("Beta: " + beta);
        $("#gamma").html("Gamma: " + gamma);
        
        if (Math.abs(deltaBeta) > Math.abs(Number($("#deltaBeta").html()))) {
          $("#deltaBeta").html(deltaBeta);
          if (Number($("#deltaBeta").html()) >= 30) {
            $("#deltaBeta").removeAttr("class", "blue").addClass("red");
          }
        }
        if (Math.abs(deltaGamma) > Math.abs(Number($("#deltaGamma").html()))) {
          $("#deltaGamma").html(deltaGamma);
          if (Number($("#deltaGamma").html()) >= 30) {
            $("#deltaGamma").removeAttr("class", "blue").addClass("red");
          }
        }
      }, true);
    
    } else {
      $("#gamma").html("deviceorientation not supported");
    }
  }