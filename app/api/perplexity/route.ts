// app/api/perplexity/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Read the question or any input data from the request body
  const body = await request.json();
  const question = body.question || "How many stars are there in our galaxy?";

  // Construct the payload for Perplexity API
  const perplexityPayload = {
    model: "sonar",
    messages: [
      { role: "system", content: "Be precise and concise." },
      { role: "user", content: question }
    ],
    max_tokens: 123,
    temperature: 0.2,
    top_p: 0.9,
    search_domain_filter: null,
    return_images: false,
    return_related_questions: false,
    search_recency_filter: "",
    top_k: 0,
    stream: false,
    presence_penalty: 0,
    frequency_penalty: 1,
    response_format: null
  };

  // Read your API token from environment variables
  const token = process.env.PERPLEXITY_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing API token" }, { status: 500 });
  }

  const options = {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(perplexityPayload)
  };

  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", options);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Perplexity API error:", error);
    return NextResponse.json({ error: "Error calling Perplexity API" }, { status: 500 });
  }
}