"use client"

import type React from "react"
import { ArrowLeftRight, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SimpleTooltip } from "../simple-tooltip"

interface DimensionControlsProps {
  width: number
  height: number
  onWidthChange: (width: number) => void
  onHeightChange: (height: number) => void
  isMobile: boolean
}

export const DimensionControls: React.FC<DimensionControlsProps> = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
  isMobile,
}) => {
  // Create an array of options for the dropdowns (1-20)
  const dimensionOptions = Array.from({ length: 20 }, (_, i) => i + 1)

  // Function to swap width and height
  const handleSwapDimensions = () => {
    onWidthChange(height)
    onHeightChange(width)
  }

  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white font-medium text-sm min-w-[40px]">
            <span>{width}</span>
            <ChevronDown className="w-3 h-3 ml-1 text-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-[200px] overflow-y-auto"
            side="top"
            align="start"
            alignOffset={-5}
            sideOffset={5}
          >
            {dimensionOptions.map((option) => (
              <DropdownMenuItem key={option} onSelect={() => onWidthChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={handleSwapDimensions}
          className="text-gray-300 hover:text-white transition-colors"
          aria-label="Swap dimensions"
        >
          <ArrowLeftRight className="w-4 h-4 stroke-[1.5]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white font-medium text-sm min-w-[40px]">
            <span>{height}</span>
            <ChevronDown className="w-3 h-3 ml-1 text-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-[200px] overflow-y-auto"
            side="top"
            align="start"
            alignOffset={-5}
            sideOffset={5}
          >
            {dimensionOptions.map((option) => (
              <DropdownMenuItem key={option} onSelect={() => onHeightChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <SimpleTooltip text="Width ([ smaller, ] bigger)" position="top">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white font-medium text-sm min-w-[40px]">
            <span>{width}</span>
            <ChevronDown className="w-3 h-3 ml-1 text-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-[200px] overflow-y-auto"
            side="top"
            align="start"
            alignOffset={-5}
            sideOffset={5}
          >
            {dimensionOptions.map((option) => (
              <DropdownMenuItem key={option} onSelect={() => onWidthChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SimpleTooltip>

      <SimpleTooltip text="Swap (s)" position="top">
        <button
          onClick={handleSwapDimensions}
          className="text-gray-300 hover:text-white transition-colors"
          aria-label="Swap dimensions"
        >
          <ArrowLeftRight className="w-4 h-4 stroke-[1.5]" />
        </button>
      </SimpleTooltip>

      <SimpleTooltip text="Depth (; smaller, ' bigger)" position="top">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-white font-medium text-sm min-w-[40px]">
            <span>{height}</span>
            <ChevronDown className="w-3 h-3 ml-1 text-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-h-[200px] overflow-y-auto"
            side="top"
            align="start"
            alignOffset={-5}
            sideOffset={5}
          >
            {dimensionOptions.map((option) => (
              <DropdownMenuItem key={option} onSelect={() => onHeightChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SimpleTooltip>
    </div>
  )
}
