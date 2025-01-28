import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  SIGNIN_AGREEMENT_TEXT,
  SIGNIN_HEADING,
  SIGNIN_SUBHEADING,
} from "@/data/lookup";

import { Dispatch, SetStateAction } from "react";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import uuid4 from "uuid4";

import { setCookie } from "@/lib/auth";

type Props = {
  open: boolean;
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
};

function SignInDialog({ open, setIsOpenDialog }: Props) {
  const createUser = useMutation(api.users.createUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      );

      const user = userInfo.data;

      const res = await createUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        id: uuid4(),
      });

      const { _id, email, id } = res;

      const cookieString = JSON.stringify({ _id, email, id });
      await setCookie(cookieString);

      setIsOpenDialog(false);
    },
    onError: (errorResponse) => console.error(errorResponse),
  });

  return (
    <Dialog open={open} onOpenChange={setIsOpenDialog}>
      <DialogContent className="space-y-3">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{SIGNIN_HEADING}</span>
            <span className="mt-2">{SIGNIN_SUBHEADING}</span>
          </DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          onClick={() => googleLogin()}
          className="mx-auto w-fit bg-blue-500 text-white hover:bg-blue-400"
        >
          Continue with Google
        </Button>

        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription className="flex flex-col items-center justify-center">
            <span>{SIGNIN_AGREEMENT_TEXT}</span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
