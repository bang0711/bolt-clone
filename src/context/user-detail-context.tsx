import { createContext, Dispatch, SetStateAction } from "react";

type UserContextType = {
  userDetail: User | null;
  setUserDetail: Dispatch<SetStateAction<User | null>>;
};

export const UserDetailContext = createContext<UserContextType | undefined>(
  undefined,
);
