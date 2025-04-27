"use server"

import { kv } from "@vercel/kv"
import type { SavedCreation } from "../types"

// Get a specific creation by ID
export async function getCreation(id: string) {
  try {
    const creationData = await kv.get(`creation:${id}`)

    if (!creationData) {
      return { success: false, message: "Creation not found." }
    }

    const creation = typeof creationData === "string" ? JSON.parse(creationData) : (creationData as SavedCreation)

    return { success: true, creation }
  } catch (error) {
    console.error("Error getting creation:", error)
    return { success: false, message: "Failed to get creation." }
  }
}
