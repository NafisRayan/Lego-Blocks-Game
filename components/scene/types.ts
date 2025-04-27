import type { Brick } from "@/components/v0-blocks/events"

export interface SceneProps {
  bricks: Brick[]
  selectedColor: string
  width: number
  depth: number
  onAddBrick: (brick: Brick) => void
  onDeleteBrick?: (index: number) => void
  onUndo: () => void
  onRedo: () => void
  isPlaying: boolean
  interactionMode?: "build" | "move" | "erase"
}
