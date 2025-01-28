"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";

import Link from "next/link";

import { MessageCircleCodeIcon } from "lucide-react";

import WorkspaceHistory from "./workspace-history";
import Footer from "./footer";

type Props = {
  allChat: WorkSpace[];
  id: string;
};

function AppSidebar({ allChat, id }: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <Link href={"/"}>
          <h1 className="text-4xl font-bold">Bolt</h1>
        </Link>
        <Button className="mt-5">
          <MessageCircleCodeIcon /> Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <SidebarGroup>
          <WorkspaceHistory allChat={allChat} id={id} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
