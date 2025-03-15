// lib/getClaudeResponse.ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

/**
 * Sends a prompt to Claude 3.5 Sonnet via AWS Bedrock and returns the response
 * @param prompt The text prompt to send to Claude
 * @returns The text response from Claude
 */
async function getClaudeResponse(prompt: string): Promise<string> {
  // Create AWS Bedrock client – consider moving credentials to env variables
  const bedrockClient = new BedrockRuntimeClient({
    region: "us-west-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY",
      },
  });

  // Prepare the request body
  const requestBody = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 5000,
    top_k: 250,
    stop_sequences: [],
    temperature: 1,
    top_p: 0.999,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    // Create and send the API request
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      body: JSON.stringify(requestBody),
    });
    const response = await bedrockClient.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  } catch (error) {
    console.error("Error calling Claude via Bedrock:", error);
    throw error;
  }
}

export default getClaudeResponse;