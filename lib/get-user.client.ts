// client-only cookie read + JSON parse
import type { VivoUserSessionDetails } from "@/types"
import Cookies from "js-cookie"

export function getUserFromClient(): VivoUserSessionDetails | null {
  const serialized = Cookies.get("vivoUser")
  if (!serialized) {
    return null
  }

  try {
    // single-line cast + local var so "as" is parsed correctly
    const parsed = JSON.parse(decodeURIComponent(serialized))
    return parsed as VivoUserSessionDetails
  } catch {
    return null
  }
}