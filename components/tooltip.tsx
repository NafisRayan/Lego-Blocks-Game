"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface TooltipProps {
  text: string
  position?: "top" | "right" | "bottom" | "left"
  children: React.ReactNode
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({ text, position = "top", children, delay = 400 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const childRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const showTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      if (!childRef.current) return

      const rect = childRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (position) {
        case "top":
          top = rect.top - 30 // Position above with enough space for the tooltip
          left = rect.left + rect.width / 2
          break
        case "right":
          top = rect.top + rect.height / 2
          left = rect.right + 8
          break
        case "bottom":
          top = rect.bottom + 8
          left = rect.left + rect.width / 2
          break
        case "left":
          top = rect.top + rect.height / 2
          left = rect.left - 8
          break
      }

      setTooltipPosition({ top, left })
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Determine tooltip class based on position
  const getTooltipClass = () => {
    const baseClass =
      "fixed z-50 px-2 py-1 text-xs font-medium text-white bg-black/80 rounded-md shadow-lg whitespace-nowrap transform"

    switch (position) {
      case "top":
        return `${baseClass} -translate-x-1/2 -translate-y-full`
      case "right":
        return `${baseClass} translate-y-[-50%]`
      case "bottom":
        return `${baseClass} -translate-x-1/2`
      case "left":
        return `${baseClass} -translate-x-full translate-y-[-50%]`
      default:
        return baseClass
    }
  }

  return (
    <div
      className="relative inline-flex"
      ref={childRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {mounted &&
        isVisible &&
        createPortal(
          <div
            className={getTooltipClass()}
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {text}
          </div>,
          document.body,
        )}
    </div>
  )
}
