"use client"

import { useState, useEffect, useCallback } from "react"
import { COLOR_THEMES } from "../color-selector/types"
import type { ColorTheme } from "../color-selector/types"

export function useColorTheme() {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>("default")
  const [currentColors, setCurrentColors] = useState(COLOR_THEMES[currentTheme])
  const [selectedColor, setSelectedColor] = useState(currentColors[0])

  // Update currentColors when theme changes
  useEffect(() => {
    const newColors = COLOR_THEMES[currentTheme]
    setCurrentColors(newColors)

    // Find the closest color in the new theme to the currently selected color
    const oldColorIndex = COLOR_THEMES["default"].indexOf(selectedColor)
    const mutedColorIndex = COLOR_THEMES["muted"].indexOf(selectedColor)
    const monoColorIndex = COLOR_THEMES["monochrome"].indexOf(selectedColor)

    // If the color exists in any theme, use its index to select the corresponding color in the new theme
    if (oldColorIndex !== -1) {
      setSelectedColor(newColors[oldColorIndex])
    } else if (mutedColorIndex !== -1) {
      setSelectedColor(newColors[mutedColorIndex])
    } else if (monoColorIndex !== -1) {
      setSelectedColor(newColors[monoColorIndex])
    } else {
      // If not found in any theme, default to the first color in the new theme
      setSelectedColor(newColors[0])
    }
  }, [currentTheme, selectedColor])

  // Handle color selection with updated theme colors
  const handleSelectColor = useCallback((color: string) => {
    setSelectedColor(color)
  }, [])

  // Handle theme change
  const handleThemeChange = useCallback((theme: ColorTheme) => {
    setCurrentTheme(theme)
  }, [])

  return {
    currentTheme,
    currentColors,
    selectedColor,
    setSelectedColor,
    handleSelectColor,
    handleThemeChange,
  }
}
