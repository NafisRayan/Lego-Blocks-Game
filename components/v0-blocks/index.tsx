"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Pause } from "lucide-react"
import { AudioPlayer } from "../audio-player"
import { Scene } from "../scene"
import { ColorSelector } from "../color-selector"
import { ActionToolbar } from "../action-toolbar"
import { SaveModal } from "../save-modal"
import { LoadModal } from "../load-modal"
import { ClearConfirmationModal } from "./clear-confirmation-modal"
import { useKeyboardShortcuts } from "./use-keyboard-shortcuts"
import { useColorTheme } from "./use-color-theme"
import { useTouchHandling } from "./use-touch-handling"
import { useLocalStorage } from "./use-local-storage"
import { clearLocalStorage } from "@/lib/utils/local-storage"
import type { SavedCreation } from "@/lib/types"
import {
  type Brick,
  handleAddBrick,
  handleDeleteBrick,
  handleUpdateBrick,
  handleUndo,
  handleRedo,
  handleClearSet,
  handlePlayToggle,
} from "./events"
import { IntegrationCheckDialog } from "../integration-check-dialog"
import { isKvConfigured } from "@/lib/utils/check-kv-integration"

export default function V0Blocks() {
  // Theme and colors
  const { currentTheme, currentColors, selectedColor, setSelectedColor, handleSelectColor, handleThemeChange } =
    useColorTheme()

  // State
  const [bricks, setBricks] = useState<Brick[]>([])
  const [history, setHistory] = useState<Brick[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [width, setWidth] = useState(2)
  const [depth, setDepth] = useState(2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [interactionMode, setInteractionMode] = useState<"build" | "move" | "erase">("build")
  const orbitControlsRef = useRef()

  // Modal state
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [currentCreationId, setCurrentCreationId] = useState<string | undefined>()
  const [currentCreationName, setCurrentCreationName] = useState<string | undefined>()

  // Add these state variables in the V0Blocks component after the other modal states
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false)
  const [integrationDialogType, setIntegrationDialogType] = useState<"save" | "load">("save")
  const [isKvAvailable, setIsKvAvailable] = useState(true)

  // Add this effect to check KV availability when the component mounts
  useEffect(() => {
    const checkKvAvailability = async () => {
      try {
        const available = await isKvConfigured()
        setIsKvAvailable(available)
      } catch (error) {
        console.error("Error checking KV availability:", error)
        setIsKvAvailable(false)
      }
    }

    checkKvAvailability()
  }, [])

  // Set up touch handling
  useTouchHandling()

  // Set up localStorage persistence
  useLocalStorage({
    bricks,
    width,
    depth,
    selectedColor,
    currentTheme,
    currentCreationId,
    currentCreationName,
    setBricks,
    setWidth,
    setDepth,
    setSelectedColor,
    handleThemeChange,
    setCurrentCreationId,
    setCurrentCreationName,
    setHistory,
    setHistoryIndex,
  })

  // Wrapper functions that call the imported event handlers with the current state
  const onAddBrick = useCallback(
    (brick: Brick) => {
      handleAddBrick(brick, bricks, setBricks, history, historyIndex, setHistory, setHistoryIndex)
    },
    [bricks, history, historyIndex],
  )

  const onDeleteBrick = useCallback(
    (index: number) => {
      handleDeleteBrick(index, bricks, setBricks, history, historyIndex, setHistory, setHistoryIndex)
    },
    [bricks, history, historyIndex],
  )

  const onUpdateBrick = useCallback(
    (index: number, newPosition: [number, number, number]) => {
      handleUpdateBrick(index, newPosition, bricks, setBricks, history, historyIndex, setHistory, setHistoryIndex)
    },
    [bricks, history, historyIndex],
  )

  const onUndo = useCallback(() => {
    console.log("Undo triggered")
    handleUndo(historyIndex, setHistoryIndex, history, setBricks)
  }, [history, historyIndex])

  const onRedo = useCallback(() => {
    console.log("Redo triggered")
    handleRedo(historyIndex, setHistoryIndex, history, setBricks)
  }, [history, historyIndex])

  const onClearSet = useCallback(() => {
    console.log("Clear set triggered")
    handleClearSet(setBricks, setHistory, setHistoryIndex)
    // Clear current creation info when clearing the set
    setCurrentCreationId(undefined)
    setCurrentCreationName(undefined)
    // Clear localStorage
    clearLocalStorage()
    // Close the modal
    setShowClearModal(false)
  }, [])

  const handleClearWithConfirmation = useCallback(() => {
    if (bricks.length > 0) {
      setShowClearModal(true)
    }
  }, [bricks.length])

  const onPlayToggle = useCallback(() => {
    console.log("Play toggle triggered")
    handlePlayToggle(isPlaying, setIsPlaying)
  }, [isPlaying])

  const handleModeChange = useCallback((mode: "build" | "move" | "erase") => {
    setInteractionMode(mode)
  }, [])

  // Save/Load handlers
  const handleSave = useCallback(() => {
    if (!isKvAvailable) {
      setIntegrationDialogType("save")
      setShowIntegrationDialog(true)
    } else {
      setShowSaveModal(true)
    }
  }, [isKvAvailable])

  // Replace the handleLoad function with this
  const handleLoad = useCallback(() => {
    if (!isKvAvailable) {
      setIntegrationDialogType("load")
      setShowIntegrationDialog(true)
    } else {
      setShowLoadModal(true)
    }
  }, [isKvAvailable])

  const handleLoadCreation = useCallback((creation: SavedCreation) => {
    // Load the creation
    setBricks(creation.bricks)

    // Update history
    const newHistory = [[...creation.bricks]]
    setHistory(newHistory)
    setHistoryIndex(0)

    // Update current creation info
    setCurrentCreationId(creation.id)
    setCurrentCreationName(creation.name)

    // Close the modal
    setShowLoadModal(false)
  }, [])

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    isPlaying,
    width,
    depth,
    currentColors,
    setWidth,
    setDepth,
    setSelectedColor,
    setInteractionMode,
    onUndo,
    onRedo,
    onPlayToggle,
    handleClearWithConfirmation,
    handleSave,
    handleLoad,
    currentTheme,
    handleThemeChange,
  })

  return (
    <div
      className="fixed inset-0 w-full h-full bg-purple-950 font-sans overflow-hidden"
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
    >
      <Canvas shadows camera={{ position: [0, 15, 15], fov: 50 }}>
        <Scene
          bricks={bricks}
          selectedColor={selectedColor}
          width={width}
          depth={depth}
          onAddBrick={onAddBrick}
          onDeleteBrick={onDeleteBrick}
          onUndo={onUndo}
          onRedo={onRedo}
          isPlaying={isPlaying}
          interactionMode={interactionMode}
        />
        <OrbitControls
          ref={orbitControlsRef}
          target={[0, 0, 0]}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minDistance={10} // Minimum zoom distance
          maxDistance={40} // Maximum zoom distance
          autoRotate={isPlaying}
          autoRotateSpeed={1}
          enableZoom={!isPlaying && interactionMode === "move"}
          enablePan={!isPlaying && interactionMode === "move"}
          enableRotate={!isPlaying && interactionMode === "move"}
        />
      </Canvas>
      {!isPlaying && (
        <>
          <ActionToolbar onModeChange={handleModeChange} currentMode={interactionMode} />
          <ColorSelector
            colors={currentColors}
            selectedColor={selectedColor}
            onSelectColor={handleSelectColor}
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            width={width}
            depth={depth}
            onWidthChange={setWidth}
            onDepthChange={setDepth}
            onClearSet={handleClearWithConfirmation}
            onPlayToggle={onPlayToggle}
            isPlaying={isPlaying}
            onSave={handleSave}
            onLoad={handleLoad}
            currentCreationId={currentCreationId}
            currentCreationName={currentCreationName}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
            bricksCount={bricks.length}
          />
          <AudioPlayer />
        </>
      )}
      {isPlaying && (
        <button
          onClick={onPlayToggle}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-gray-300 transition-colors"
          aria-label="Stop"
        >
          <Pause className="w-8 h-8 stroke-[1.5]" />
        </button>
      )}

      {/* Modals */}
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        bricks={bricks}
        currentId={currentCreationId}
        currentName={currentCreationName}
      />

      <LoadModal isOpen={showLoadModal} onClose={() => setShowLoadModal(false)} onLoad={handleLoadCreation} />

      <ClearConfirmationModal isOpen={showClearModal} onClose={() => setShowClearModal(false)} onClear={onClearSet} />
      <IntegrationCheckDialog
        isOpen={showIntegrationDialog}
        onClose={() => setShowIntegrationDialog(false)}
        actionType={integrationDialogType}
      />
    </div>
  )
}
