"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { ColorSelectorProps } from "./types"
import { HistoryControls } from "./history-controls"
import { ColorPicker } from "./color-picker"
import { DimensionControls } from "./dimension-controls"
import { FileControls } from "./file-controls"
import { ActionControls } from "./action-controls"
import { MobileMenu } from "./mobile-menu"

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  width,
  depth,
  onWidthChange,
  onDepthChange,
  onClearSet,
  onPlayToggle,
  isPlaying,
  onSave,
  onLoad,
  currentCreationId,
  currentCreationName,
  currentTheme,
  onThemeChange,
  bricksCount,
}) => {
  const [isMobile, setIsMobile] = useState(false)

  // Handle client-side mounting and detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col gap-4 z-10">
      {/* Main Controls Panel - Very rounded with smaller padding */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-md px-6 py-3 rounded-[28px] shadow-lg border border-gray-700 text-white">
        <div className="flex items-center gap-3">
          {/* History Controls */}
          <HistoryControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} isMobile={isMobile} />

          <div className="w-px h-6 bg-gray-600" />

          {/* Color Selector */}
          <ColorPicker
            colors={colors}
            selectedColor={selectedColor}
            onSelectColor={onSelectColor}
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
            isMobile={isMobile}
          />

          <div className="w-px h-6 bg-gray-600" />

          {/* Dimension Controls */}
          <DimensionControls
            width={width}
            height={depth}
            onWidthChange={onWidthChange}
            onHeightChange={onDepthChange}
            isMobile={isMobile}
          />

          <div className="w-px h-6 bg-gray-600" />

          {/* Desktop: Save/Load Controls */}
          {!isMobile && (
            <>
              <FileControls onSave={onSave} onLoad={onLoad} isMobile={isMobile} />
              <div className="w-px h-6 bg-gray-600" />
            </>
          )}

          {/* Desktop: Action Buttons */}
          {!isMobile && (
            <ActionControls
              onPlayToggle={onPlayToggle}
              isPlaying={isPlaying}
              onClearSet={onClearSet}
              isMobile={isMobile}
              hasBricks={bricksCount > 0}
            />
          )}

          {/* Mobile: Menu Button */}
          {isMobile && (
            <MobileMenu
              onPlayToggle={onPlayToggle}
              isPlaying={isPlaying}
              onSave={onSave}
              onLoad={onLoad}
              onClearSet={onClearSet}
              hasBricks={bricksCount > 0}
            />
          )}
        </div>
      </div>
    </div>
  )
}
