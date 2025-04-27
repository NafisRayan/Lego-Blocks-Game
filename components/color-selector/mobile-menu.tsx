"use client"

import type React from "react"
import { Play, Trash2, Save, FolderOpen, Menu } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MobileMenuProps {
  onPlayToggle: () => void
  isPlaying: boolean
  onSave: () => void
  onLoad: () => void
  onClearSet: () => void
  hasBricks: boolean
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  onPlayToggle,
  isPlaying,
  onSave,
  onLoad,
  onClearSet,
  hasBricks,
}) => {
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-white hover:text-gray-300 transition-colors" aria-label="Menu">
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0" align="center" side="top">
          <div className="py-2">
            <button
              onClick={onPlayToggle}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
            >
              <Play className="w-4 h-4 stroke-[1.5]" />
              <span>{isPlaying ? "Stop" : "Play"}</span>
            </button>

            <div className="my-1 border-t border-gray-200"></div>

            <button onClick={onLoad} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100">
              <FolderOpen className="w-4 h-4 stroke-[1.5]" />
              <span>Open</span>
            </button>

            <button onClick={onSave} className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100">
              <Save className="w-4 h-4 stroke-[1.5]" />
              <span>Save</span>
            </button>

            <div className="my-1 border-t border-gray-200"></div>

            <button
              onClick={onClearSet}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left ${
                hasBricks ? "text-red-600 hover:bg-red-50" : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={!hasBricks}
            >
              <Trash2 className={`w-4 h-4 stroke-[1.5] ${hasBricks ? "text-red-600" : "text-gray-400"}`} />
              <span>Clear</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
