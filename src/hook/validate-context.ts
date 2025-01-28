// hooks/useValidatedContext.ts
import { useContext } from "react";
import { MessagesContext, UserDetailContext } from "@/context";

export const useValidatedContexts = () => {
  const messagesContext = useContext(MessagesContext);
  const userContext = useContext(UserDetailContext);

  if (!messagesContext || !userContext) {
    throw new Error("Contexts must be used within their respective Providers");
  }

  return { messagesContext, userContext };
};
