"use client"

import type React from "react"
import { SimpleTooltip } from "../simple-tooltip"

interface MaybeTooltipProps {
  text: string
  children: React.ReactNode
  isMobile: boolean
}

export const MaybeTooltip: React.FC<MaybeTooltipProps> = ({ text, children, isMobile }) => {
  if (isMobile) {
    return children
  }

  return (
    <SimpleTooltip text={text} position="top">
      {children}
    </SimpleTooltip>
  )
}
