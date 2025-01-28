"use client";

import { deleteCookie } from "@/lib/auth";

import { Button } from "../ui/button";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await deleteCookie();
    router.refresh();
  };
  return (
    <Button variant={"secondary"} onClick={logout}>
      <LogOut /> Logout
    </Button>
  );
}

export default LogoutButton;
