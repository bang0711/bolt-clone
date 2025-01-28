import { WorkspaceView } from "@/components/workspace";

import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/ui/sidebar";

import AppSidebar from "@/components/custom/app-sidebar";
import { getCurrentUser } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

async function WorkspacePage({ params }: Props) {
  const user = (await cookies()).get("user");

  const isAuthenticated = user !== undefined;

  if (!isAuthenticated) {
    redirect("/");
  }

  const userCookie = JSON.parse(user.value) as User;

  const { id } = await params;

  const [allChat, currentUser] = await Promise.all([
    fetchQuery(api.workspace.getAllWorkspace, {
      userId: userCookie._id as Id<"users">,
    }),
    getCurrentUser(),
  ]);

  const chat = allChat.find((chat) => chat._id === id);

  if (!chat || !currentUser) {
    redirect("/");
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar id={id} allChat={allChat} />

      <WorkspaceView chat={chat} user={currentUser} />
    </SidebarProvider>
  );
}

export default WorkspacePage;
