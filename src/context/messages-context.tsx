import { createContext, Dispatch, SetStateAction } from "react";

type MessagesContextType = {
  messages: Message[]; // Allow messages to be an object or null initially
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

export const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined,
);
