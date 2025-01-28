"use client";

import { COLORS } from "@/data/colors";

import {
  HERO_DESC,
  HERO_HEADING,
  INPUT_PLACEHOLDER,
  SUGGESTIONS,
} from "@/data/lookup";

import { ArrowRight, Link, Loader2Icon } from "lucide-react";

import { useState } from "react";

import SignInDialog from "./sign-in-dialog";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

import { useRouter } from "next/navigation";

import { instance } from "@/config/instance";

import { CHAT_PROMPT, CODE_GEN_PROMPT } from "@/data/prompt";

import { Button } from "../ui/button";
import { countToken } from "@/lib/utils";

type Props = {
  isAuthenticated: boolean;
  userCookie?: User;
};

function Hero({ isAuthenticated, userCookie }: Props) {
  const [userInput, setUserInput] = useState("");

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const createWorkspace = useMutation(api.workspace.createWorkspace);
  const updateFiles = useMutation(api.workspace.updateFiles);
  const updateToken = useMutation(api.users.updateToken);

  const [isGenerating, setIsGenerating] = useState(false);

  const router = useRouter();

  const onGenerate = async (input: string) => {
    if (!isAuthenticated) {
      return setIsOpenDialog(true);
    }
    setIsGenerating(true); // Start generating
    try {
      const message = {
        role: "user",
        content: input,
      };
      const prompt = JSON.stringify(message) + CHAT_PROMPT;
      const res = await instance.post(`/api/chat`, {
        prompt,
      });
      const AIResponse = {
        role: "ai",
        content: res.data.result,
      };
      const mergedMessages = [message, AIResponse];

      const filesPrompt =
        JSON.stringify(mergedMessages) + " " + CODE_GEN_PROMPT;

      const filesRes = await instance.post(`/api/code-generate`, {
        filesPrompt,
      });

      const AIFilesResponse = filesRes.data.result;

      const workspaceId = await createWorkspace({
        messages: mergedMessages,
        user: userCookie?._id as Id<"users">,
      });

      const token = countToken(
        JSON.stringify(AIResponse.content) +
          JSON.stringify(AIFilesResponse?.files),
      );
      const tokenLeft = (userCookie?.token ?? 0) - token;

      await Promise.all([
        updateToken({
          token: tokenLeft,
          userId: userCookie?._id as Id<"users">,
        }),
        updateFiles({
          workspaceId: workspaceId,
          files: AIFilesResponse?.files,
        }),
      ]);

      router.push(`/workspace/${workspaceId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-56 flex flex-col items-center gap-2 xl:mt-52">
      <h2 className="text-4xl font-bold">{HERO_HEADING}</h2>

      <p className="font-medium text-gray-400">{HERO_DESC}</p>

      <div
        className="mt-3 w-full max-w-xl rounded-xl border p-5"
        style={{ backgroundColor: COLORS.BACKGROUND }}
      >
        <div className="flex gap-2">
          <textarea
            placeholder={INPUT_PLACEHOLDER}
            className="h-32 max-h-56 w-full resize-none bg-transparent outline-none"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            disabled={isGenerating}
          />

          {userInput && (
            <Button
              className="cursor-pointer rounded-md"
              onClick={() => onGenerate(userInput)}
              disabled={isGenerating} // Disable button while generating
            >
              {isGenerating ? (
                <Loader2Icon className="size-8 animate-spin" /> // Show spinner while generating
              ) : (
                <ArrowRight className="size-8" />
              )}
            </Button>
          )}
        </div>

        <div>
          <Link className="size-5" />
        </div>
      </div>

      <div className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
        {SUGGESTIONS.map((s, i) => (
          <h2
            onClick={() => onGenerate(s)}
            key={i}
            className="cursor-pointer rounded-full border p-1 px-2 text-sm text-gray-400 transition hover:text-white"
          >
            {s}
          </h2>
        ))}
      </div>

      <SignInDialog open={isOpenDialog} setIsOpenDialog={setIsOpenDialog} />
    </div>
  );
}

export default Hero;
