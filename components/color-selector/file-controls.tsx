"use client"

import type React from "react"
import { Save, FolderOpen } from "lucide-react"
import { MaybeTooltip } from "./maybe-tooltip"

interface FileControlsProps {
  onSave: () => void
  onLoad: () => void
  isMobile: boolean
}

export const FileControls: React.FC<FileControlsProps> = ({ onSave, onLoad, isMobile }) => {
  return (
    <div className="flex gap-3 items-center">
      <MaybeTooltip text="Load" isMobile={isMobile}>
        <button
          onClick={onLoad}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Load Creation"
        >
          <FolderOpen className="w-5 h-5 stroke-[1.5]" />
        </button>
      </MaybeTooltip>
      <MaybeTooltip text="Save" isMobile={isMobile}>
        <button
          onClick={onSave}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Save Creation"
        >
          <Save className="w-5 h-5 stroke-[1.5]" />
        </button>
      </MaybeTooltip>
    </div>
  )
}
