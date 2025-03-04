"use client";

import { setCookie } from "@/lib/auth";

import { useGoogleLogin } from "@react-oauth/google";

import axios from "axios";

import uuid4 from "uuid4";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Button } from "../ui/button";
import { createCustomer } from "@/lib/payment";
import { useMemo } from "react";

function LoginButton() {
  const createUser = useMutation(api.users.createUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );

      const user = userInfo.data;

      const customerId = await createCustomer(user.email, user.name);

      const res = await createUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        id: uuid4(),
        customerId,
      });

      const { _id, email, id } = res;

      const cookieString = JSON.stringify({ _id, email, id });
      await setCookie(cookieString);
    },
    onError: (errorResponse) => console.error(errorResponse),
  });

  return useMemo(
    () => <Button onClick={() => googleLogin()}>Get Started</Button>,
    [googleLogin],
  );
}

export default LoginButton;
