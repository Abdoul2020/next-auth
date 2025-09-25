"use server";

import { getUsersRoles } from "@/actions/getUsersRoles";

// Check if the current user is an admin
export async function isUserAdmin(): Promise<boolean> {
  try {
    const roles = await getUsersRoles();

    console.log("ROLES", roles);//check the role here
    return roles.some((role) => role.name.toLowerCase() === "admin");
  } catch (error) {
  console.error("Error checking admin status:", error);
    return false;
  }
}