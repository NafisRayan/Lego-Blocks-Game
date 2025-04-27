export interface ColorSelectorProps {
  colors: string[]
  selectedColor: string
  onSelectColor: (color: string) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  width: number
  depth: number
  onWidthChange: (width: number) => void
  onDepthChange: (depth: number) => void
  onClearSet: () => void
  onPlayToggle: () => void
  isPlaying: boolean
  onSave: () => void
  onLoad: () => void
  currentCreationId?: string
  currentCreationName?: string
  currentTheme: ColorTheme
  onThemeChange: (theme: ColorTheme) => void
  bricksCount: number
}

export type ColorTheme = "default" | "muted" | "monochrome"

export const COLOR_THEMES: Record<ColorTheme, string[]> = {
  default: [
    "#FF3333", // Red
    "#FF9933", // Orange
    "#FFCC33", // Yellow
    "#33CC66", // Green
    "#33CCFF", // Light Blue
    "#3366CC", // Dark Blue
    "#9933CC", // Purple
    "#222222", // Black
  ],
  muted: [
    "#CC6666", // Muted Red
    "#CC9966", // Muted Orange
    "#CCCC66", // Muted Yellow
    "#66CC99", // Muted Green
    "#66CCCC", // Muted Light Blue
    "#6699CC", // Muted Dark Blue
    "#9966CC", // Muted Purple
    "#444444", // Dark Gray
  ],
  monochrome: [
    "#FFFFFF", // White
    "#DDDDDD", // Light Gray 1
    "#BBBBBB", // Light Gray 2
    "#999999", // Mid Gray 1
    "#777777", // Mid Gray 2
    "#555555", // Dark Gray 1
    "#333333", // Dark Gray 2
    "#111111", // Near Black
  ],
}
