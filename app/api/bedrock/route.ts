// app/api/bedrock/route.ts
import { NextResponse } from "next/server";
import getClaudeResponse from "@/lib/getClaudeResponse";

export async function POST(request: Request) {
  // Read the question (or prompt) from the request body
  const body = await request.json();
  const question = body.question || "How many stars are there in our galaxy?";

  try {
    // Get the response from AWS Bedrock
    const answer = await getClaudeResponse(question);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AWS Bedrock API error:", error);
    return NextResponse.json({ error: "Error calling AWS Bedrock API" }, { status: 500 });
  }
}