import type { Brick } from "@/components/blocks/events"

// Type for saved creation
export type SavedCreation = {
  id: string
  name: string
  bricks: Brick[]
  createdAt: number
  updatedAt: number
}
