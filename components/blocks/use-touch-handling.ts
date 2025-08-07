"use client"

import { useEffect } from "react"

export function useTouchHandling() {
  // Prevent text selection on mobile, but allow button clicks
  useEffect(() => {
    const preventDefaultTouchAction = (e: TouchEvent) => {
      // Don't prevent default for buttons and interactive elements
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest(".bg-white") || // Allow interaction with the control panel
        target.closest("[data-radix-popper-content-wrapper]") // Allow interaction with popover content

      if (!isInteractive) {
        e.preventDefault()
      }
    }

    // Prevent scrolling on document body
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    // Prevent pull-to-refresh and other browser gestures
    document.addEventListener("gesturestart", preventDefaultTouchAction, { passive: false })
    document.addEventListener("gesturechange", preventDefaultTouchAction, { passive: false })
    document.addEventListener("gestureend", preventDefaultTouchAction, { passive: false })

    // Add event listeners to prevent default touch actions
    document.addEventListener("touchstart", preventDefaultTouchAction, { passive: false })
    document.addEventListener("touchmove", preventDefaultTouchAction, { passive: false })
    document.addEventListener("touchend", preventDefaultTouchAction, { passive: false })

    return () => {
      // Clean up event listeners
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""

      document.removeEventListener("gesturestart", preventDefaultTouchAction)
      document.removeEventListener("gesturechange", preventDefaultTouchAction)
      document.removeEventListener("gestureend", preventDefaultTouchAction)

      document.removeEventListener("touchstart", preventDefaultTouchAction)
      document.removeEventListener("touchmove", preventDefaultTouchAction)
      document.removeEventListener("touchend", preventDefaultTouchAction)
    }
  }, [])
}
