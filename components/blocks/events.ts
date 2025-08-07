import type { Dispatch, SetStateAction } from "react"

// Define types for our brick and history
export type Brick = {
  color: string
  position: [number, number, number]
  width: number
  height: number
}

export type BrickHistory = Brick[][]

// Event handlers
export const handleAddBrick = (
  brick: Brick,
  bricks: Brick[],
  setBricks: Dispatch<SetStateAction<Brick[]>>,
  history: BrickHistory,
  historyIndex: number,
  setHistory: Dispatch<SetStateAction<BrickHistory>>,
  setHistoryIndex: Dispatch<SetStateAction<number>>,
) => {
  const newBricks = [...bricks, brick]
  setBricks(newBricks)
  const newHistory = history.slice(0, historyIndex + 1)
  newHistory.push(newBricks)
  setHistory(newHistory)
  setHistoryIndex(historyIndex + 1)
}

export const handleDeleteBrick = (
  index: number,
  bricks: Brick[],
  setBricks: Dispatch<SetStateAction<Brick[]>>,
  history: BrickHistory,
  historyIndex: number,
  setHistory: Dispatch<SetStateAction<BrickHistory>>,
  setHistoryIndex: Dispatch<SetStateAction<number>>,
) => {
  const newBricks = bricks.filter((_, i) => i !== index)
  setBricks(newBricks)
  const newHistory = history.slice(0, historyIndex + 1)
  newHistory.push(newBricks)
  setHistory(newHistory)
  setHistoryIndex(historyIndex + 1)
}

export const handleUpdateBrick = (
  index: number,
  newPosition: [number, number, number],
  bricks: Brick[],
  setBricks: Dispatch<SetStateAction<Brick[]>>,
  history: BrickHistory,
  historyIndex: number,
  setHistory: Dispatch<SetStateAction<BrickHistory>>,
  setHistoryIndex: Dispatch<SetStateAction<number>>,
) => {
  const newBricks = bricks.map((brick, i) => (i === index ? { ...brick, position: newPosition } : brick))
  setBricks(newBricks)
  const newHistory = history.slice(0, historyIndex + 1)
  newHistory.push(newBricks)
  setHistory(newHistory)
  setHistoryIndex(historyIndex + 1)
}

export const handleUndo = (
  historyIndex: number,
  setHistoryIndex: Dispatch<SetStateAction<number>>,
  history: BrickHistory,
  setBricks: Dispatch<SetStateAction<Brick[]>>,
) => {
  if (historyIndex > 0) {
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setBricks(history[newIndex])
  }
}

export const handleRedo = (
  historyIndex: number,
  setHistoryIndex: Dispatch<SetStateAction<number>>,
  history: BrickHistory,
  setBricks: Dispatch<SetStateAction<Brick[]>>,
) => {
  if (historyIndex < history.length - 1) {
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setBricks(history[newIndex])
  }
}

export const handleClearSet = (
  setBricks: Dispatch<SetStateAction<Brick[]>>,
  setHistory: Dispatch<SetStateAction<BrickHistory>>,
  setHistoryIndex: Dispatch<SetStateAction<number>>,
) => {
  setBricks([])
  setHistory([[]])
  setHistoryIndex(0)
}

export const handlePlayToggle = (isPlaying: boolean, setIsPlaying: Dispatch<SetStateAction<boolean>>) => {
  setIsPlaying(!isPlaying)
}
