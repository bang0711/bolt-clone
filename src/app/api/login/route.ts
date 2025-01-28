import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { _id, email, id } = body;

  const cookiesStore = await cookies();
  const cookie = JSON.stringify({ _id, email, id });
  const expiredTime = 7 * 24 * 60 * 60 * 1000;
  await cookiesStore.set("user", cookie, {
    expires: expiredTime,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return NextResponse.json({ success: true });
};
