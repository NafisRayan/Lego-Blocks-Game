"use server"

import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import type { Brick } from "@/components/v0-blocks/events"
import type { SavedCreation } from "../types"

// Save the current blocks to Redis
export async function saveCreation(name: string, bricks: Brick[]) {
  try {
    const id = nanoid(10)
    const timestamp = Date.now()

    const creation: SavedCreation = {
      id,
      name,
      bricks,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    // Save to Redis
    await kv.set(`creation:${id}`, JSON.stringify(creation))

    // Add to list of creations
    await kv.zadd("creations", { score: timestamp, member: id })

    revalidatePath("/")
    return { success: true, id, message: "Creation saved successfully!" }
  } catch (error) {
    console.error("Error saving creation:", error)
    return { success: false, message: "Failed to save creation." }
  }
}
