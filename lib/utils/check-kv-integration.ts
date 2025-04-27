"use server"

/**
 * Checks if the required KV environment variables are set
 * @returns boolean indicating if KV is properly configured
 */
export async function isKvConfigured(): Promise<boolean> {
  try {
    const hasKvUrl = !!process.env.KV_REST_API_URL
    const hasKvToken = !!process.env.KV_REST_API_TOKEN

    // If both environment variables are present, try to make a simple KV request
    // to verify the connection works
    if (hasKvUrl && hasKvToken) {
      const { kv } = await import("@vercel/kv")

      // Try to ping the KV database
      await kv.ping()
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking KV configuration:", error)
    return false
  }
}
