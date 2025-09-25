// src/lib/authService.ts
import { auth0 } from "./auth0";
import type { SessionData } from "@auth0/nextjs-auth0/types";

export async function getSession(): Promise<SessionData | null> {
  return await auth0.getSession();
}

export async function requireSession(redirectTo = "/auth/login"): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Response(null, {
      status: 302,
      headers: { Location: redirectTo },
    });
  }
  return session;
}

export async function getAccessToken(scope?: string) {
  return await auth0.getAccessToken();
}