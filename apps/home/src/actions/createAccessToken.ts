"use server";

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// Create an access token for the Auth0 management API, this is used to fetch user roles
export async function createAccessToken(): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.AUTH0_CLIENT_ID ?? "",
          client_secret: process.env.AUTH0_CLIENT_SECRET ?? "",
          audience: `${process.env.AUTH0_DOMAIN}/api/v2/`,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Auth0 token request failed: ${response.status}`);
    }

    const data = (await response.json()) as AccessTokenResponse;
    if (!data.access_token) {
      throw new Error("Auth0 token response missing access_token");
    }
    return data.access_token;
  } catch (error) {
    throw new Error("Failed to get Auth0 management token");
  }
}