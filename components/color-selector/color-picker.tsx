"use client"

import type React from "react"
import { useState } from "react"
import { Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SimpleTooltip } from "../simple-tooltip"
import { MaybeTooltip } from "./maybe-tooltip"
import { lightenColor } from "@/lib/utils/lighten-color"
import type { ColorTheme } from "./types"
import { COLOR_THEMES } from "./types"

interface ColorPickerProps {
  colors: string[]
  selectedColor: string
  onSelectColor: (color: string) => void
  currentTheme: ColorTheme
  onThemeChange: (theme: ColorTheme) => void
  isMobile: boolean
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  currentTheme,
  onThemeChange,
  isMobile,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Color names for tooltips based on theme
  const colorNames = {
    default: ["Red", "Orange", "Yellow", "Green", "Light Blue", "Dark Blue", "Purple", "Black"],
    muted: [
      "Muted Red",
      "Muted Orange",
      "Muted Yellow",
      "Muted Green",
      "Muted Cyan",
      "Muted Blue",
      "Muted Purple",
      "Dark Gray",
    ],
    monochrome: [
      "White",
      "Light Gray 1",
      "Light Gray 2",
      "Mid Gray 1",
      "Mid Gray 2",
      "Dark Gray 1",
      "Dark Gray 2",
      "Near Black",
    ],
  }

  const ColorButton = ({ color, isSelected, onClick, index }) => (
    <MaybeTooltip text={`${colorNames[currentTheme][index]} (${index + 1})`} isMobile={isMobile}>
      <button
        className={`w-8 h-8 rounded-full transition-all ${isSelected ? "ring-2 ring-white ring-offset-1 ring-offset-gray-800" : ""}`}
        style={{
          background: `linear-gradient(135deg, ${lightenColor(color, 50)}, ${color})`,
        }}
        onClick={onClick}
      />
    </MaybeTooltip>
  )

  const ThemeSelector = () => (
    <DropdownMenu>
      <SimpleTooltip text="Color Palette (c)" position="top">
        <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors overflow-hidden">
          <div className="w-full h-full relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  #FF3333,
                  #FF9933,
                  #FFCC33,
                  #33CC66,
                  #33CCFF,
                  #3366CC,
                  #9933CC,
                  #FF3333
                )`,
              }}
            />
            <div className="absolute inset-1 rounded-full bg-gray-700 opacity-0 hover:opacity-10 transition-opacity" />
          </div>
        </DropdownMenuTrigger>
      </SimpleTooltip>
      <DropdownMenuContent side="top" align="center">
        <DropdownMenuItem onSelect={() => onThemeChange("default")} className="flex justify-between items-center">
          Default
          {currentTheme === "default" && <Check className="w-4 h-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onThemeChange("muted")} className="flex justify-between items-center">
          Muted
          {currentTheme === "muted" && <Check className="w-4 h-4 ml-2" />}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onThemeChange("monochrome")} className="flex justify-between items-center">
          Monochrome
          {currentTheme === "monochrome" && <Check className="w-4 h-4 ml-2" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const handleColorSelect = (color: string, theme?: ColorTheme) => {
    onSelectColor(color)
    if (theme) {
      onThemeChange(theme)
    }
    // Close the popover when a color is selected on mobile
    if (isMobile) {
      setIsPopoverOpen(false)
    }
  }

  return (
    <div className="flex gap-1.5">
      <div className="hidden md:flex gap-1.5 relative">
        {colors.map((color, index) => (
          <ColorButton
            key={color}
            color={color}
            isSelected={color === selectedColor}
            onClick={() => onSelectColor(color)}
            index={index}
          />
        ))}
        <div className="w-px h-6 bg-gray-600 mx-1 self-center" />
        {!isMobile && <ThemeSelector />}
        {isMobile && (
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors overflow-hidden"
            onClick={() => {
              const themes = ["default", "muted", "monochrome"]
              const currentIndex = themes.indexOf(currentTheme)
              const nextIndex = (currentIndex + 1) % themes.length
              onThemeChange(themes[nextIndex])
            }}
          >
            <div className="w-full h-full relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    #FF3333,
                    #FF9933,
                    #FFCC33,
                    #33CC66,
                    #33CCFF,
                    #3366CC,
                    #9933CC,
                    #FF3333
                  )`,
                }}
              />
              <div className="absolute inset-1 rounded-full bg-gray-700 opacity-0 hover:opacity-10 transition-opacity" />
            </div>
          </button>
        )}
      </div>
      <div className="md:hidden flex items-center gap-1.5">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-8 h-8 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${lightenColor(selectedColor, 50)}, ${selectedColor})`,
              }}
              aria-label="Select color"
            />
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-3" align="center" side="top">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Default</h3>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_THEMES.default.map((color, index) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === selectedColor ? "ring-2 ring-black ring-offset-1" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${lightenColor(color, 50)}, ${color})`,
                    }}
                    onClick={() => handleColorSelect(color, "default")}
                    title={colorNames.default[index]}
                  />
                ))}
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Muted</h3>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_THEMES.muted.map((color, index) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === selectedColor ? "ring-2 ring-black ring-offset-1" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${lightenColor(color, 50)}, ${color})`,
                    }}
                    onClick={() => handleColorSelect(color, "muted")}
                    title={colorNames.muted[index]}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Monochrome</h3>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_THEMES.monochrome.map((color, index) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-all ${
                      color === selectedColor ? "ring-2 ring-black ring-offset-1" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${lightenColor(color, 50)}, ${color})`,
                    }}
                    onClick={() => handleColorSelect(color, "monochrome")}
                    title={colorNames.monochrome[index]}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
