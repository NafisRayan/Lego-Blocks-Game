import type React from "react"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import { MARBLE_TEXTURES } from "@/lib/constants"

export const LargePlane: React.FC = () => {
  const marbleTextures = useTexture(MARBLE_TEXTURES, (loadedTextures) => {
    Object.values(loadedTextures).forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1000, 1000)
    })
  })

  return (
    <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10000, 10000]} />
      <meshStandardMaterial
        color="#ffffff"
        roughnessMap={marbleTextures.roughness}
        normalMap={marbleTextures.normal}
        map={marbleTextures.color}
      />
    </mesh>
  )
}
