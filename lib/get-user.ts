import { VivoUserSessionDetails } from "@/types";
import { cookies } from "next/headers";

export async function getUserData(): Promise<VivoUserSessionDetails | null> {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("vivoUser");
  if (!userCookie) {
    return null;
  }
  let user;
  try {
    user = JSON.parse(decodeURIComponent(userCookie.value));
  } catch (err) {
    console.error("Invalid cookie format", err);
    return null;
  }
  return user;
}
