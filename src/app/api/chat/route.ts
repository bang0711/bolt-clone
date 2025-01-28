import { chatSession } from "@/config/ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json();
  console.log(prompt);
  try {
    const res = await chatSession.sendMessage(prompt);

    const result = await res.response.text();

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ result: error });
  }
};
