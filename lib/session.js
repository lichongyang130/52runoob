import { cookies } from "next/headers";
import { COOKIE_NAME, getUserByToken } from "./auth";

export const SESSION_COOKIE = COOKIE_NAME;

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return getUserByToken(token);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}
