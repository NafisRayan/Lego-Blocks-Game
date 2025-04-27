"use client"

import type React from "react"
import { Undo2, Redo2 } from "lucide-react"
import { MaybeTooltip } from "./maybe-tooltip"

interface HistoryControlsProps {
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  isMobile: boolean
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({ onUndo, onRedo, canUndo, canRedo, isMobile }) => {
  return (
    <div className="flex gap-3">
      <MaybeTooltip text="Undo (⌘+z)" isMobile={isMobile}>
        <button
          onClick={onUndo}
          className={`text-white hover:text-gray-300 transition-colors ${
            !canUndo ? "opacity-30 cursor-not-allowed" : ""
          }`}
          disabled={!canUndo}
          aria-label="Undo"
        >
          <Undo2 className="w-5 h-5 stroke-[1.5]" />
        </button>
      </MaybeTooltip>
      <MaybeTooltip text="Redo (⌘+Shift+z)" isMobile={isMobile}>
        <button
          onClick={onRedo}
          className={`text-white hover:text-gray-300 transition-colors ${
            !canRedo ? "opacity-30 cursor-not-allowed" : ""
          }`}
          disabled={!canRedo}
          aria-label="Redo"
        >
          <Redo2 className="w-5 h-5 stroke-[1.5]" />
        </button>
      </MaybeTooltip>
    </div>
  )
}
