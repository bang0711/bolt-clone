"use client";

import { COLORS } from "@/data/colors";
import { INPUT_PLACEHOLDER } from "@/data/lookup";
import { CHAT_PROMPT } from "@/data/prompt";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

import { ArrowRight, Link, Loader2Icon } from "lucide-react";

import Image from "next/image";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

import { useSidebar } from "../ui/sidebar";

import { instance } from "@/config/instance";
import { countToken } from "@/lib/utils";

type Props = {
  chat: WorkSpace;
  user: User;
  generateFiles: (messages: Message[]) => Promise<void>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

function ChatView({ chat, user, generateFiles, messages, setMessages }: Props) {
  console.log(user);
  const [userInput, setUserInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const updateMessages = useMutation(api.workspace.updateMessages);
  const updateToken = useMutation(api.users.updateToken);

  const { toggleSidebar } = useSidebar();

  // Use useEffect to trigger generateFiles after messages are updated
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      generateFiles(messages);
    }
  }, [messages]); // Run this effect whenever messages change

  const onGenerate = async (input: string) => {
    const userContent = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userContent]);

    setIsLoading(true);
    try {
      const prompt = JSON.stringify([...messages, userContent]) + CHAT_PROMPT;

      const res = await instance.post(`/api/chat`, {
        prompt,
      });

      const AIResponse = {
        role: "ai",
        content: res.data.result,
      };
      const token = countToken(JSON.stringify(AIResponse.content));
      const tokenLeft = user.token - token;

      updateToken({
        userId: user._id as Id<"users">,
        token: tokenLeft,
        plan: user.plan,
      });
      // Update messages with the AI response
      setMessages((prev) => [...prev, AIResponse]);

      const mergedMessages = [userContent, AIResponse];

      updateMessages({
        messages: [...messages, ...mergedMessages],
        workspaceId: chat._id as Id<"workspace">,
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong!" },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  return (
    <div className="relative flex h-[85vh] w-full flex-col">
      <div className="flex-1 overflow-y-scroll pl-5 scrollbar-hide">
        {messages.map((msg, i) => (
          <div
            className="mb-2 flex items-start gap-2 rounded-lg p-3 leading-7"
            key={i}
            style={{
              backgroundColor: COLORS.CHAT_BACKGROUND,
            }}
          >
            {msg.role === "user" && (
              <Image
                src={user.picture}
                alt={user.name}
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <ReactMarkdown className={"flex flex-col"}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}

        {isLoading && (
          <div
            style={{ backgroundColor: COLORS.CHAT_BACKGROUND }}
            className="mb-2 flex items-start gap-2 rounded-lg p-3"
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>
      {/* Input section */}
      <div className="flex items-end gap-2">
        <Image
          src={user.picture}
          alt={user.name}
          width={35}
          height={35}
          className="cursor-pointer rounded-full"
          onClick={toggleSidebar}
        />

        <div
          className="mt-3 w-full max-w-xl rounded-xl border p-5"
          style={{ backgroundColor: COLORS.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={INPUT_PLACEHOLDER}
              className="h-32 max-h-56 w-full resize-none bg-transparent outline-none"
              onChange={(e) => setUserInput(e.target.value)}
            />

            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="size-8 cursor-pointer rounded-md bg-blue-500 p-2 text-white"
              />
            )}
          </div>

          <div>
            <Link className="size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
