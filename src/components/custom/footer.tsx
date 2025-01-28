"use client";

import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";

import React from "react";

import { Button } from "../ui/button";

import { useRouter } from "next/navigation";

import { Route } from "next";

type Option = {
  name: string;
  icon: React.FC;
  path?: Route;
};

function Footer() {
  const router = useRouter();

  const options: Option[] = [
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Help Center",
      icon: HelpCircle,
    },
    {
      name: "My Subscription",
      icon: Wallet,
      path: "/pricing",
    },
    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];

  const onOptionClick = (option: Option) => {
    if (option.path) {
      return router.push(option.path);
    }
  };

  return (
    <div className="mb-10 space-y-3 p-5">
      {options.map((option, i) => (
        <Button
          key={i}
          variant={"ghost"}
          className="flex w-full items-center justify-start"
          onClick={() => onOptionClick(option)}
        >
          <option.icon />
          {option.name}
        </Button>
      ))}
    </div>
  );
}

export default Footer;
