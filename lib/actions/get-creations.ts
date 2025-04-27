"use server"

import { kv } from "@vercel/kv"
import type { SavedCreation } from "../types"

// Get all creations (with pagination)
export async function getCreations(limit = 10, offset = 0) {
  try {
    // Get IDs from sorted set (newest first)
    const ids = await kv.zrange("creations", offset, offset + limit - 1, { rev: true })

    if (!ids || ids.length === 0) {
      return { success: true, creations: [] }
    }

    // Get all creations in parallel
    const creationsPromises = ids.map((id) => kv.get(`creation:${id}`))
    const creationsData = await Promise.all(creationsPromises)

    // Parse JSON data safely
    const creations = creationsData
      .filter((data) => data !== null)
      .map((data) => {
        // Handle both string and object formats
        if (typeof data === "string") {
          try {
            return JSON.parse(data) as SavedCreation
          } catch (e) {
            console.error("Error parsing creation data:", e)
            return null
          }
        } else {
          return data as SavedCreation
        }
      })
      .filter(Boolean) as SavedCreation[]

    return { success: true, creations }
  } catch (error) {
    console.error("Error getting creations:", error)
    return { success: false, message: `Failed to get creations: ${error.message}` }
  }
}
