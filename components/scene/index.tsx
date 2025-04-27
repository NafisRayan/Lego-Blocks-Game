"use client"

import type React from "react"
import { Environment, SoftShadows } from "@react-three/drei"
import type { SceneProps } from "./types"
import { LargePlane } from "../large-plane"
import { Platform } from "../platform"
import { BuildMode } from "./build-mode"
import { EraseMode } from "./erase-mode"
import { LightingSetup } from "./lighting-setup"
import { useSceneInteraction } from "./use-scene-interaction"
import { Block } from "../block"
import { GRID_SIZE } from "@/constants"

export const Scene: React.FC<SceneProps> = ({
  bricks,
  selectedColor,
  width,
  depth,
  onAddBrick,
  onDeleteBrick,
  onUndo,
  onRedo,
  isPlaying,
  interactionMode = "build",
}) => {
  const {
    currentBrickPosition,
    isValid,
    showNewBrick,
    hoveredBrickIndex,
    handleClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleBrickClick,
    planeRef,
  } = useSceneInteraction({
    bricks,
    width,
    depth,
    selectedColor,
    onAddBrick,
    onDeleteBrick,
    isPlaying,
    interactionMode,
  })

  return (
    <>
      <SoftShadows size={25} samples={16} focus={0.5} />
      <LargePlane />
      <Platform />

      {/* Render all bricks */}
      {bricks.map((brick, index) => (
        <Block
          key={index}
          color={brick.color}
          position={brick.position}
          width={brick.width}
          height={brick.height}
          isPlacing={hoveredBrickIndex === index && interactionMode === "erase"}
          onClick={() => handleBrickClick(index)}
        />
      ))}

      {/* Render appropriate mode components */}
      {interactionMode === "build" && !isPlaying && (
        <BuildMode
          showNewBrick={showNewBrick}
          isValid={isValid}
          currentBrickPosition={currentBrickPosition}
          selectedColor={selectedColor}
          width={width}
          depth={depth}
        />
      )}

      {interactionMode === "erase" && !isPlaying && <EraseMode />}

      {/* The plane is always present but only interactive when not playing and in build mode */}
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerDown={handleTouchStart}
        onPointerMove={handleTouchMove}
        onPointerUp={handleTouchEnd}
        onPointerLeave={handleTouchEnd}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <LightingSetup />
      <Environment
        files="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-image-gradient-2.jpg-iFrfRqWi6BT95fkorMRZnQMfIdMrlT.jpeg"
        background
      />
    </>
  )
}
