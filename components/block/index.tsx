"use client"

import type React from "react"
import { useRef, useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Instances, Instance, useTexture } from "@react-three/drei"
import { BRICK_HEIGHT, LAYER_GAP, STUD_HEIGHT, STUD_RADIUS, STUD_SEGMENTS, TEXTURES } from "@/lib/constants"
import type { BlockProps } from "./types"

export const Block: React.FC<BlockProps> = ({
  color,
  position,
  width,
  height,
  isPlacing = false,
  opacity = 1,
  onClick,
}) => {
  const depth = height
  const blockGeometry = useMemo(() => new THREE.BoxGeometry(width, BRICK_HEIGHT - LAYER_GAP, depth), [width, depth])
  const studGeometry = useMemo(
    () => new THREE.CylinderGeometry(STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, STUD_SEGMENTS),
    [],
  )

  const studPositions = useMemo(() => {
    const positions = []
    for (let x = -width / 2 + 0.5; x < width / 2; x++) {
      for (let z = -depth / 2 + 0.5; z < depth / 2; z++) {
        positions.push([x, BRICK_HEIGHT / 2 - LAYER_GAP / 2 + STUD_HEIGHT / 2, z])
      }
    }
    return positions
  }, [width, depth])

  const textures = useTexture(TEXTURES)

  const brickRef = useRef<THREE.Mesh>(null)
  const studRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Determine if this is an erase highlight
  const isEraseHighlight = isPlacing && onClick !== undefined

  useFrame((state) => {
    if (isPlacing && brickRef.current && studRef.current) {
      // Use different colors for build mode (yellow) vs erase mode (red)
      const glowColor = isEraseHighlight ? new THREE.Color(1, 0, 0) : new THREE.Color(1, 1, 0)
      const glowIntensity = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 0.9

      brickRef.current.material.emissive.copy(glowColor)
      brickRef.current.material.emissiveIntensity = glowIntensity
      studRef.current.material.emissive.copy(glowColor)
      studRef.current.material.emissiveIntensity = glowIntensity
    }
  })

  const instanceLimit = useMemo(() => Math.max(width * depth, 100), [width, depth])

  // Convert color to darker version for better shadow definition
  const darkenedColor = useMemo(() => {
    if (isEraseHighlight) return "#ff0000" // Red for erase mode
    if (isPlacing) return "#ffff00" // Yellow for build mode

    // Convert hex to RGB
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    // Darken by 10%
    const darkenFactor = 0.9
    const newR = Math.floor(r * darkenFactor)
    const newG = Math.floor(g * darkenFactor)
    const newB = Math.floor(b * darkenFactor)

    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`
  }, [color, isPlacing, isEraseHighlight])

  // Handle click with stopPropagation to ensure the correct block is deleted
  const handleClick = (e: THREE.ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (onClick) onClick()
  }

  // Check if we're on mobile
  const isMobile = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768
    }
    return false
  }, [])

  // Only use onPointerDown for erase mode on mobile
  // For build mode, we need to use the regular click handler
  const isEraseMode = isEraseHighlight && isMobile

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerDown={(e) => {
        // For mobile erase mode only, trigger click on pointer down
        if (isEraseMode && onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
    >
      <mesh ref={brickRef} geometry={blockGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={darkenedColor}
          roughnessMap={textures.roughness}
          normalMap={textures.normal}
          map={textures.color}
          roughness={0.7}
          metalness={0.1}
          emissive={isPlacing ? (isEraseHighlight ? "#ff0000" : "#ffff00") : "#000000"}
          emissiveIntensity={isPlacing ? 1 : 0}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      <Instances ref={studRef} geometry={studGeometry} limit={instanceLimit}>
        <meshStandardMaterial
          color={darkenedColor}
          roughnessMap={textures.roughness}
          normalMap={textures.normal}
          map={textures.color}
          roughness={0.7}
          metalness={0.1}
          emissive={isPlacing ? (isEraseHighlight ? "#ff0000" : "#ffff00") : "#000000"}
          emissiveIntensity={isPlacing ? 1 : 0}
          transparent={opacity < 1}
          opacity={opacity}
        />
        {studPositions.map((pos, index) => (
          <Instance key={index} position={pos} castShadow receiveShadow />
        ))}
      </Instances>
    </group>
  )
}
