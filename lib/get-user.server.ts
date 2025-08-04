// server-side cookie read + JSON parse
import { cookies } from "next/headers"
import type { VivoUserSessionDetails } from "@/types"

/**
 * Reads the 'vivo_user' cookie on the server
 * and parses it into your session-details type.
 */
export async function getUserFromCookie(): Promise<VivoUserSessionDetails | null> {
  // cookies() returns a Promise<ReadonlyRequestCookies> in your Next version
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("vivo_user")
  if (!userCookie) {
    return null
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(userCookie.value))
    return parsed as VivoUserSessionDetails
  } catch {
    return null
  }
}