"use client";

import { useState } from "react";

import ChatView from "./chat-view";
import CodeView from "./code-view";

import { CODE_GEN_PROMPT } from "@/data/prompt";
import { DEFAULT_FILE } from "@/data/lookup";

import { instance } from "@/config/instance";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { countToken } from "@/lib/utils";

type Props = {
  chat: WorkSpace;
  user: User;
};

function WorkspaceView({ chat, user }: Props) {
  const [isGeneratingFiles, setIsGeneratingFiles] = useState(false);

  const [messages, setMessages] = useState<Message[]>(chat.messages);

  const [files, setFiles] = useState(chat.fileData);

  const updateFiles = useMutation(api.workspace.updateFiles);
  const updateToken = useMutation(api.users.updateToken);

  const generateAICode = async () => {
    const prompt = JSON.stringify(messages) + " " + CODE_GEN_PROMPT;
    try {
      setIsGeneratingFiles(true);
      const res = await instance.post(`/api/code-generate`, {
        filesPrompt: prompt,
      });

      const AIResponse = res.data.result;

      const mergedFiles = {
        ...DEFAULT_FILE,
        ...AIResponse?.files,
      };
      setFiles(mergedFiles);

      const token = countToken(JSON.stringify(AIResponse.files));
      const tokenLeft = user.token - token;

      updateToken({
        userId: user._id as Id<"users">,
        token: tokenLeft,
        plan: user.plan,
      });
      updateFiles({
        workspaceId: chat._id as Id<"workspace">,
        files: AIResponse?.files,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingFiles(false);
    }
  };

  return (
    <div className="mt-3 p-3 pr-5">
      <div className="grid grid-cols-1 gap-7 md:grid-cols-4">
        <div className="col-span-1">
          <ChatView
            generateFiles={generateAICode}
            messages={messages}
            setMessages={setMessages}
            chat={chat}
            user={user}
          />
        </div>

        <div className="col-span-3">
          <CodeView files={files} isLoading={isGeneratingFiles} />
        </div>
      </div>
    </div>
  );
}

export default WorkspaceView;
