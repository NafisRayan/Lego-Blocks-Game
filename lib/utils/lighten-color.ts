/**
 * Lightens a hex color by a specified percentage
 * @param color Hex color string (e.g. "#FF0000")
 * @param percent Percentage to lighten (0-100)
 * @returns Lightened hex color string
 */
export function lightenColor(color: string, percent: number): string {
  // Convert hex to RGB
  const hex = color.replace("#", "")
  let r = Number.parseInt(hex.substring(0, 2), 16)
  let g = Number.parseInt(hex.substring(2, 4), 16)
  let b = Number.parseInt(hex.substring(4, 6), 16)

  // Lighten the color
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}
