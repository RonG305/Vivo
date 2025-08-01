// lib/get-user.ts

import { VivoUserSessionDetails } from "@/types";
import { cookies } from "next/headers";

export async function getUserData(): Promise<VivoUserSessionDetails | null> {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("vivoUser");
  if (!userCookie) {
    return null;
  }

  try {
    // JSON might include extra props; we trust it matches VivoUserSessionDetails
    const user: VivoUserSessionDetails = JSON.parse(
      decodeURIComponent(userCookie.value)
    );
    return user;
  } catch (err) {
    console.error("Invalid cookie format", err);
    return null;
  }
}