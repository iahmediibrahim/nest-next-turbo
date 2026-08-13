"use server";

import { BACKEND_URL } from "./constants";
import { getSession } from "./session";

export const getProfile = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/auth/protected`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return await response.json();
};
