"use client"

import type React from "react"
import { Pencil, Camera } from "lucide-react"

interface MobileToolbarProps {
  onModeChange: (mode: "draw" | "camera") => void
  currentMode: "draw" | "camera"
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({ onModeChange, currentMode }) => {
  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-3 md:hidden z-20">
      <button
        onClick={() => onModeChange("draw")}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          currentMode === "draw" ? "bg-black text-white" : "bg-black/30 text-white hover:bg-black/50"
        }`}
        aria-label="Draw Mode"
        aria-pressed={currentMode === "draw"}
      >
        <Pencil className="w-5 h-5" />
      </button>

      <button
        onClick={() => onModeChange("camera")}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          currentMode === "camera" ? "bg-black text-white" : "bg-black/30 text-white hover:bg-black/50"
        }`}
        aria-label="Camera Mode"
        aria-pressed={currentMode === "camera"}
      >
        <Camera className="w-5 h-5" />
      </button>
    </div>
  )
}
