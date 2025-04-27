"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface PopoverProps {
  isOpen: boolean
  onClose: () => void
  anchor: React.RefObject<HTMLElement>
  children: React.ReactNode
  position?: "top" | "bottom"
}

export const Popover: React.FC<PopoverProps> = ({ isOpen, onClose, anchor, children, position = "bottom" }) => {
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const popoverRef = useRef<HTMLDivElement>(null)

  // Calculate and set position whenever the popover opens or the anchor changes
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && anchor.current && popoverRef.current) {
        const rect = anchor.current.getBoundingClientRect()
        const popoverRect = popoverRef.current.getBoundingClientRect()

        let top: number
        if (position === "top") {
          // Position above the anchor element
          top = rect.top - popoverRect.height - 8
        } else {
          // Position below the anchor element
          top = rect.bottom + 8
        }

        // Center horizontally relative to the anchor
        let left = rect.left + rect.width / 2 - popoverRect.width / 2

        // Adjust position if it goes off-screen
        if (left < 10) {
          left = 10
        } else if (left + popoverRect.width > window.innerWidth - 10) {
          left = window.innerWidth - popoverRect.width - 10
        }

        setPopoverPosition({ top, left })
      }
    }

    // Initial position calculation
    if (isOpen) {
      // Use requestAnimationFrame to ensure the popover is rendered before measuring
      requestAnimationFrame(() => {
        updatePosition()
      })
    }

    // Update position on resize
    window.addEventListener("resize", updatePosition)
    return () => {
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen, anchor, position])

  // Handle clicks outside the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchor.current &&
        !anchor.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      // Delay adding the event listener to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timer)
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen, onClose, anchor])

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className="fixed z-[100] bg-white rounded-lg shadow-lg p-2"
      style={{ top: `${popoverPosition.top}px`, left: `${popoverPosition.left}px` }}
    >
      {children}
    </div>
  )
}
