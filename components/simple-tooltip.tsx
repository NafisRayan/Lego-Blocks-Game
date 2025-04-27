"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface SimpleTooltipProps {
  text: string
  position?: "top" | "right" | "bottom" | "left"
  children: React.ReactNode
}

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ text, position = "top", children }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <div
          className={`
            absolute z-50 px-2 py-1 text-xs font-medium text-white bg-black/80 rounded-md shadow-lg whitespace-nowrap
            ${position === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : ""}
            ${position === "right" ? "left-full ml-2 top-1/2 -translate-y-1/2" : ""}
            ${position === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" : ""}
            ${position === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" : ""}
          `}
        >
          {text}
        </div>
      )}
    </div>
  )
}
