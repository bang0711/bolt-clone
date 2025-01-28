import { generateAICode } from "@/config/ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { filesPrompt } = await req.json();

  try {
    const res = await generateAICode.sendMessage(filesPrompt);
    const result = res.response.text();

    return NextResponse.json({ result: JSON.parse(result) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: error });
  }
};
