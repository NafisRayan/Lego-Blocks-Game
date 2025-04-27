import type React from "react"
import * as THREE from "three"

interface HighlightSquareProps {
  position: [number, number, number]
  isValid: boolean
  width: number
  height: number
}

export const HighlightSquare: React.FC<HighlightSquareProps> = ({ position, isValid, width, height }) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={isValid ? "#00ff00" : "#ff0000"} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  )
}
