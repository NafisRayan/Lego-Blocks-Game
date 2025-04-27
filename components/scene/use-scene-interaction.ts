"use client"

import { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { GRID_SIZE, BRICK_HEIGHT, LAYER_GAP, GROUND_HEIGHT } from "@/lib/constants"
import type { Brick } from "@/components/v0-blocks/events"

interface UseSceneInteractionProps {
  bricks: Brick[]
  width: number
  depth: number
  selectedColor: string
  onAddBrick: (brick: Brick) => void
  onDeleteBrick?: (index: number) => void
  isPlaying: boolean
  interactionMode: "build" | "move" | "erase"
}

export function useSceneInteraction({
  bricks,
  width,
  depth,
  selectedColor,
  onAddBrick,
  onDeleteBrick,
  isPlaying,
  interactionMode,
}: UseSceneInteractionProps) {
  const [currentBrickPosition, setCurrentBrickPosition] = useState<[number, number, number]>([
    0,
    GROUND_HEIGHT / 2 + BRICK_HEIGHT / 2,
    0,
  ])
  const [isPlacing, setIsPlacing] = useState(true)
  const [isValid, setIsValid] = useState(true)
  const [showNewBrick, setShowNewBrick] = useState(true)
  const [hoveredBrickIndex, setHoveredBrickIndex] = useState<number | null>(null)
  const [touchedBrickIndex, setTouchedBrickIndex] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Touch interaction tracking
  const [touchStartPosition, setTouchStartPosition] = useState<{ x: number; y: number } | null>(null)
  const [hasMoved, setHasMoved] = useState(false)
  const touchMoveThreshold = 10 // pixels

  const { camera, raycaster, mouse } = useThree()
  const planeRef = useRef<THREE.Mesh>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Reset hovered brick index when bricks array changes (after deletion)
  useEffect(() => {
    if (isDeleting) {
      setHoveredBrickIndex(null)
      setTouchedBrickIndex(null)
      setIsDeleting(false)
    }
  }, [bricks, isDeleting])

  // Reset hovered brick index when interaction mode changes
  useEffect(() => {
    setHoveredBrickIndex(null)
    setTouchedBrickIndex(null)

    // Reset the plane's raycast behavior when switching modes
    if (planeRef.current) {
      if (interactionMode === "build") {
        // Restore the original raycast function for build mode
        if ((planeRef.current as any)._originalRaycast) {
          planeRef.current.raycast = (planeRef.current as any)._originalRaycast
          ;(planeRef.current as any)._originalRaycast = null
        }
      } else {
        // Store the original raycast function if not already stored
        if (!(planeRef.current as any)._originalRaycast) {
          const originalRaycast = planeRef.current.raycast
          ;(planeRef.current as any)._originalRaycast = originalRaycast

          // Set a dummy raycast function that does nothing for non-build modes
          planeRef.current.raycast = () => {}
        }
      }
    }
  }, [interactionMode])

  const snapToGrid = (value: number, size: number) => {
    const isOdd = size % 2 !== 0
    const snappedValue = Math.round(value)
    return isOdd ? snappedValue - 0.5 : snappedValue
  }

  const isValidPlacement = (position: [number, number, number], width: number, depth: number) => {
    const [x, y, z] = position
    const left = Math.floor(x - width / 2)
    const right = Math.ceil(x + width / 2)
    const top = Math.floor(z - depth / 2)
    const bottom = Math.ceil(z + depth / 2)

    if (left < -GRID_SIZE / 2 || right > GRID_SIZE / 2 || top < -GRID_SIZE / 2 || bottom > GRID_SIZE / 2) {
      return false
    }

    return !bricks.some((brick) => {
      const brickLeft = Math.floor(brick.position[0] - brick.width / 2)
      const brickRight = Math.ceil(brick.position[0] + brick.width / 2)
      const brickTop = Math.floor(brick.position[2] - brick.height / 2)
      const brickBottom = Math.ceil(brick.position[2] + brick.height / 2)

      const horizontalOverlap = left < brickRight && right > brickLeft
      const verticalOverlap = top < brickBottom && bottom > brickTop
      const sameLayer = Math.abs(y - brick.position[1]) < 0.1

      return horizontalOverlap && verticalOverlap && sameLayer
    })
  }

  const findHighestBrick = (x: number, z: number, width: number, depth: number) => {
    const relevantBricks = bricks.filter((brick) => {
      const horizontalOverlap = Math.abs(brick.position[0] - x) < (width + brick.width) / 2
      const verticalOverlap = Math.abs(brick.position[2] - z) < (depth + brick.height) / 2
      return horizontalOverlap && verticalOverlap
    })

    if (relevantBricks.length === 0) return GROUND_HEIGHT / 2 + BRICK_HEIGHT / 2

    return Math.max(...relevantBricks.map((brick) => brick.position[1])) + BRICK_HEIGHT + LAYER_GAP
  }

  // Find the brick at the current pointer position
  const findBrickAtPointer = () => {
    // Create a temporary array to store distances to each brick
    const intersectedBricks: { index: number; distance: number }[] = []

    // Check for intersections with each brick
    bricks.forEach((brick, index) => {
      // Create a box that represents the brick for intersection testing
      const brickBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(brick.position[0], brick.position[1], brick.position[2]),
        new THREE.Vector3(brick.width, BRICK_HEIGHT, brick.height),
      )

      // Check if the ray intersects the brick box
      const intersectionPoint = new THREE.Vector3()
      if (raycaster.ray.intersectBox(brickBox, intersectionPoint)) {
        // Calculate distance from camera to intersection point
        const distance = raycaster.ray.origin.distanceTo(intersectionPoint)
        intersectedBricks.push({ index, distance })
      }
    })

    // Sort by distance and return the closest brick (not the furthest)
    if (intersectedBricks.length > 0) {
      intersectedBricks.sort((a, b) => a.distance - b.distance)
      return intersectedBricks[0].index
    }

    return null
  }

  useFrame(() => {
    // Skip raycaster calculations when in play mode or when deleting
    if (isPlaying || isDeleting) return

    // Set up raycaster
    raycaster.setFromCamera(mouse, camera)

    // Handle build mode
    if (interactionMode === "build" && isPlacing && planeRef.current) {
      const intersects = raycaster.intersectObject(planeRef.current)

      if (intersects.length > 0) {
        const { x, z } = intersects[0].point
        const snappedX = snapToGrid(x, width)
        const snappedZ = snapToGrid(z, depth)
        const highestPoint = findHighestBrick(snappedX, snappedZ, width, depth)
        const newPosition: [number, number, number] = [snappedX, highestPoint, snappedZ]

        setCurrentBrickPosition(newPosition)
        setIsValid(isValidPlacement(newPosition, width, depth))
      }
    }

    // Handle erase mode - check for brick intersections
    // Only highlight bricks on desktop, not on mobile
    if (interactionMode === "erase" && !isDeleting && !touchedBrickIndex && !isMobile) {
      // Reset hovered brick index
      setHoveredBrickIndex(null)

      // Find brick at pointer
      const brickIndex = findBrickAtPointer()
      if (brickIndex !== null) {
        setHoveredBrickIndex(brickIndex)
      }
    }
  })

  const handleClick = (event: THREE.MouseEvent) => {
    // Prevent default behavior to avoid unintended actions
    event.stopPropagation()

    if (isPlaying) return

    if (interactionMode === "build" && isPlacing && isValid && showNewBrick) {
      onAddBrick({ color: selectedColor, position: currentBrickPosition, width, height: depth })
    }
  }

  // Touch handlers for mobile
  const handleTouchStart = (event: THREE.ThreeEvent<PointerEvent>) => {
    if (isPlaying) return

    // Record the starting position for all modes
    setTouchStartPosition({ x: event.clientX, y: event.clientY })
    setHasMoved(false)

    if (interactionMode === "erase" && isMobile) {
      // For erase mode on mobile, we'll check for brick deletion in handleTouchEnd
      // to avoid accidental deletions when trying to rotate the camera
      raycaster.setFromCamera(mouse, camera)
      const brickIndex = findBrickAtPointer()
      if (brickIndex !== null) {
        setTouchedBrickIndex(brickIndex)
      }
    } else if (interactionMode === "erase" && !isMobile) {
      // For erase mode on desktop, find and highlight the brick on touch start
      raycaster.setFromCamera(mouse, camera)
      const brickIndex = findBrickAtPointer()
      if (brickIndex !== null) {
        setTouchedBrickIndex(brickIndex)
      }
    }
  }

  const handleTouchMove = (event: THREE.ThreeEvent<PointerEvent>) => {
    if (isPlaying) return

    if (touchStartPosition) {
      // Calculate distance moved
      const dx = event.clientX - touchStartPosition.x
      const dy = event.clientY - touchStartPosition.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If moved more than threshold, mark as moved
      if (distance > touchMoveThreshold) {
        setHasMoved(true)
      }
    }

    if (interactionMode === "erase" && !isMobile) {
      // For erase mode on desktop, update the highlighted brick if the pointer moves
      raycaster.setFromCamera(mouse, camera)
      const brickIndex = findBrickAtPointer()

      // Only update if we're not already touching a brick or if we've moved to a different brick
      if (touchedBrickIndex === null || brickIndex !== touchedBrickIndex) {
        setTouchedBrickIndex(brickIndex)
      }
    }
  }

  const handleTouchEnd = (event: THREE.ThreeEvent<PointerEvent>) => {
    if (isPlaying) return

    if (interactionMode === "build") {
      // If didn't move (or moved very little), consider it a tap to place a brick
      if (touchStartPosition && !hasMoved && isValid && showNewBrick) {
        onAddBrick({ color: selectedColor, position: currentBrickPosition, width, height: depth })
      }
    } else if (interactionMode === "erase" && touchedBrickIndex !== null) {
      // For erase mode, delete the brick on touch end if we didn't move much
      if (!hasMoved && onDeleteBrick) {
        setIsDeleting(true)
        onDeleteBrick(touchedBrickIndex)
      }
    }

    // Reset touch tracking
    setTouchStartPosition(null)
    setHasMoved(false)
    setTouchedBrickIndex(null)
  }

  const handleBrickClick = (index: number) => {
    if (isPlaying || isDeleting) return

    if (interactionMode === "erase" && onDeleteBrick) {
      // Set deleting flag to prevent hover effects during deletion
      setIsDeleting(true)
      // Clear the hovered brick index immediately
      setHoveredBrickIndex(null)
      // Delete the brick
      onDeleteBrick(index)
    }
  }

  // Update the plane's raycast behavior when isPlaying changes
  useEffect(() => {
    if (planeRef.current) {
      if (isPlaying) {
        // Store the original raycast function
        const originalRaycast = planeRef.current.raycast
        ;(planeRef.current as any)._originalRaycast = originalRaycast

        // Set a dummy raycast function that does nothing
        planeRef.current.raycast = () => {}
      } else if ((planeRef.current as any)._originalRaycast && interactionMode === "build") {
        // Only restore for build mode and when not playing
        planeRef.current.raycast = (planeRef.current as any)._originalRaycast
        ;(planeRef.current as any)._originalRaycast = null
      }
    }
  }, [isPlaying, interactionMode])

  // Add keyboard shortcut for toggling brick visibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isPlaying) return // Disable keyboard controls when playing

      if (event.key === "h" || event.key === "H") {
        setShowNewBrick((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying])

  return {
    currentBrickPosition,
    isValid,
    showNewBrick,
    hoveredBrickIndex: isMobile ? null : hoveredBrickIndex, // Never show hover effect on mobile
    touchedBrickIndex,
    handleClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleBrickClick,
    planeRef,
  }
}
