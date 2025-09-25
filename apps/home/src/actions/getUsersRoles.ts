"use server";

import { createAccessToken } from "@/actions/createAccessToken";
import { getSession } from "@/lib/authService";

type Role = {
  id: string;
  name: string;
  description: string;
};

// Get the roles for the current user in Auth0 Management API
export async function getUsersRoles(): Promise<Role[]> {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await createAccessToken();

  console.log("token take:", token);

  const response = await fetch(
    `${process.env.AUTH0_DOMAIN}/api/v2/users/${user.sub}/roles`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user roles");
  }

  const data: Role[] = await response.json();
  return data;
}