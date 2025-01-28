"use server";

import { cookies } from "next/headers";

import { api } from "../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export const setCookie = async (cookieString: string) => {
  (await cookies()).set("user", cookieString, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
};

export const deleteCookie = async () => {
  (await cookies()).delete("user");
};

export const getCurrentUser = async () => {
  const user = (await cookies()).get("user");

  const userCookie = (user?.value && JSON.parse(user.value)) || null;
  let currentUser = undefined;

  if (userCookie) {
    currentUser = await fetchQuery(api.users.getUser, {
      email: userCookie.email,
    });
  }
  return currentUser;
};
