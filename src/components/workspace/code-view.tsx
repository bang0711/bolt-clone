"use client";

import { useState } from "react";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackFiles,
} from "@codesandbox/sandpack-react";

import { autocompletion } from "@codemirror/autocomplete";

import { DEPENDENCY } from "@/data/lookup";

import { Loader2Icon } from "lucide-react";

type Props = {
  files: unknown;
  isLoading: boolean;
};

function CodeView({ files, isLoading }: Props) {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     const role = messages[messages.length - 1].role;
  //     if (role === "user") {
  //       generateAICode();
  //     }
  //   }
  // }, [messages]);

  return (
    <div className="relative w-full">
      <div className="w-full border bg-[#181818] p-2">
        <div className="flex max-w-40 shrink-0 flex-wrap items-center justify-center gap-3 rounded-full bg-black p-1">
          <h2
            onClick={() => setActiveTab("code")}
            className={`w-16 cursor-pointer p-1 px-2 text-center text-sm transition ${activeTab === "code" && "rounded-full bg-blue-500 bg-opacity-25 text-blue-500"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`w-16 cursor-pointer p-1 px-2 text-center text-sm transition ${activeTab === "preview" && "rounded-full bg-blue-500 bg-opacity-25 text-blue-500"}`}
          >
            Preview
          </h2>
        </div>
      </div>

      <SandpackProvider
        customSetup={{
          dependencies: DEPENDENCY,
        }}
        files={files as SandpackFiles}
        template="react"
        theme={"dark"}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer
                style={{
                  height: "80vh",
                }}
              />
              <SandpackCodeEditor
                style={{
                  height: "80vh",
                }}
                showTabs
                showInlineErrors
                wrapContent
                closableTabs
                extensions={[autocompletion()]}
              />
            </>
          ) : (
            <SandpackPreview
              className="w-full"
              showNavigator
              style={{
                height: "80vh",
              }}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {isLoading && (
        <div className="absolute top-0 flex h-full w-full items-center justify-center gap-2 rounded-lg bg-gray-900/65 p-10 backdrop-blur-sm backdrop-filter">
          <Loader2Icon className="size-8 animate-spin text-white" />
          <h2 className="text-white">Generating your files...</h2>
        </div>
      )}
    </div>
  );
}

export default CodeView;
