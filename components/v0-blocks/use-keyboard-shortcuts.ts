"use client"

import { useEffect } from "react"

// Helper function to check if we're currently focused on an input element
function isInputElement(): boolean {
  const activeElement = document.activeElement
  if (!activeElement) return false

  const tagName = activeElement.tagName.toLowerCase()
  const isEditable =
    activeElement.hasAttribute("contenteditable") && activeElement.getAttribute("contenteditable") !== "false"

  return tagName === "input" || tagName === "textarea" || tagName === "select" || isEditable
}

interface KeyboardShortcutsProps {
  isPlaying: boolean
  width: number
  depth: number
  currentColors: string[]
  setWidth: (width: number | ((prev: number) => number)) => void
  setDepth: (depth: number | ((prev: number) => number)) => void
  setSelectedColor: (color: string) => void
  setInteractionMode: (mode: "build" | "move" | "erase") => void
  onUndo: () => void
  onRedo: () => void
  onPlayToggle: () => void
  handleClearWithConfirmation: () => void
  handleSave: () => void
  handleLoad: () => void
  currentTheme: string
  handleThemeChange: (theme: string) => void
}

export function useKeyboardShortcuts({
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
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip keyboard shortcuts when playing
      if (isPlaying) return

      // Skip keyboard shortcuts when typing in an input field
      if (isInputElement()) return

      // Swap dimensions with S key
      if (event.key === "S" || event.key === "s") {
        setWidth((prevWidth) => depth)
        setDepth((prevDepth) => width)
      }

      // Switch to Build mode with B key
      if (event.key === "B" || event.key === "b") {
        setInteractionMode("build")
      }

      // Switch to Move mode with M key
      if (event.key === "M" || event.key === "m") {
        setInteractionMode("move")
      }

      // Switch to Erase mode with E key
      if (event.key === "E" || event.key === "e") {
        setInteractionMode("erase")
      }

      // Cycle through color themes with C key
      if (event.key === "C" || event.key === "c") {
        const themes = ["default", "muted", "monochrome"]
        const currentIndex = themes.indexOf(currentTheme)
        const nextIndex = (currentIndex + 1) % themes.length
        handleThemeChange(themes[nextIndex])
      }

      // Decrease width with [ key
      if (event.key === "[" && !event.shiftKey) {
        setWidth((prevWidth) => Math.max(1, prevWidth - 1))
      }

      // Increase width with ] key
      if (event.key === "]" && !event.shiftKey) {
        setWidth((prevWidth) => Math.min(20, prevWidth + 1))
      }

      // Decrease depth with ; key
      if (event.key === ";") {
        setDepth((prevDepth) => Math.max(1, prevDepth - 1))
      }

      // Increase depth with ' key
      if (event.key === "'") {
        setDepth((prevDepth) => Math.min(20, prevDepth + 1))
      }

      // Color selection with number keys 1-8
      if (event.key >= "1" && event.key <= "8") {
        const colorIndex = Number.parseInt(event.key) - 1
        if (colorIndex >= 0 && colorIndex < currentColors.length) {
          setSelectedColor(currentColors[colorIndex])
        }
      }

      // Undo: CMD+Z (Mac) or CTRL+Z (Windows)
      if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault()
        console.log("CMD+Z pressed")
        onUndo()
      }

      // Redo: CMD+SHIFT+Z (Mac) or CTRL+SHIFT+Z (Windows)
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault()
        console.log("CMD+SHIFT+Z pressed")
        onRedo()
      }

      // Keep CMD+Y as an alternative for redo for backward compatibility
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault()
        console.log("CMD+Y pressed")
        onRedo()
      }

      // Play: CMD+Enter
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault()
        console.log("CMD+Enter pressed")
        onPlayToggle()
      }

      // Clear: CMD+Delete or CMD+Backspace
      if ((event.metaKey || event.ctrlKey) && (event.key === "Delete" || event.key === "Backspace")) {
        event.preventDefault()
        console.log("CMD+Delete pressed")
        handleClearWithConfirmation()
      }

      // Save: CMD+S
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault()
        console.log("CMD+S pressed")
        handleSave()
      }

      // Load: CMD+O
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "o") {
        event.preventDefault()
        console.log("CMD+O pressed")
        handleLoad()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
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
  ])
}
