import Link from "next/link";

import { useSidebar } from "../ui/sidebar";

type Props = {
  allChat: WorkSpace[];
  id: string;
};

function WorkspaceHistory({ allChat, id }: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <div>
      <h2 className="text-lg font-medium">Your Chats</h2>
      <div>
        {allChat.map((c) => (
          <Link key={c._id} href={`/workspace/${c._id}`}>
            <h2
              onClick={toggleSidebar}
              className={`mt-2 line-clamp-1 cursor-pointer text-sm font-light transition ${c._id === id ? "text-primary" : "text-primary/50 hover:text-primary"}`}
            >
              {c?.messages[0].content}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WorkspaceHistory;
