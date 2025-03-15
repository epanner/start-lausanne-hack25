// app/scan/actions.ts
"use server"

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

/**
 * Creates a receipt using provided items and people count.
 */
export async function createReceipt(items?: string[], peopleCount?: number) {
  const receiptId = Math.random().toString(36).substring(2, 10)
  if (items && items.length > 0) {
      // @ts-ignore
    global.receiptItems = global.receiptItems || {}
      // @ts-ignore
    global.receiptItems[receiptId] = {
      items,
      people: peopleCount || 2,
      createdAt: new Date(),
    }
  }
  return receiptId
}

/**
 * Generates a 3-day meal plan based on stored receipt/manual entry data using AWS Bedrock.
 */
export async function generateMealPlan(id: string, people = 2) {
  let ingredientsList: string[] = []

  // Use manually entered ingredients if available
    // @ts-ignore
  if (id.startsWith("manual-") && global.manualEntries && global.manualEntries[id]) {
      // @ts-ignore
    ingredientsList = global.manualEntries[id].items
      // @ts-ignore
    people = global.manualEntries[id].people
  }
  // Use stored receipt items if available 
  // @ts-ignore
  else if (global.receiptItems && global.receiptItems[id]) {
      // @ts-ignore
    ingredientsList = global.receiptItems[id].items
    // @ts-ignore
    people = global.receiptItems[id].people
  }
  // Fallback mock data for demonstration
  else {
    ingredientsList = [
      "Chicken breast 1lb",
      "Brown rice 2lb bag",
      "Broccoli 1 bunch",
      "Bell peppers 3ct",
      "Onions 3ct",
      "Eggs 12ct",
      "Milk 1 gallon",
      "Bread whole wheat",
      "Spinach 10oz bag",
      "Tomatoes 4ct",
      "Avocados 2ct",
      "Olive oil 16oz",
      "Garlic 1 bulb",
      "Lemons 2ct",
      "Greek yogurt 32oz",
      "Cheddar cheese 8oz",
      "Pasta 16oz",
      "Ground turkey 1lb",
    ]
  }

  // Build the prompt for AWS Bedrock
  const prompt = `
Create a multiple-day meal plan (breakfast, lunch, dinner) for ${people} people using ONLY the following ingredients:
${ingredientsList.join(", ")}

The meal plan should:
1. Start with the next meal based on the current time (${new Date().getHours()}:00)
2. Use ALL the ingredients efficiently with minimal waste
3. Include recipe names, ingredients with quantities, and elaborate instructions
4. Be formatted in a clear, organized way with days and meals clearly labeled
5. ONLY use doulbe quotation marks, never single ticks
6. Never use the same recipe on 3 consecutive days
7. Dynamically adjust the length (days) of the meal plan according to the amount of ingredients bought and the ones used for the meals (e.g. if the number of people entered is higher, the meal plan will be shorter).

Format the response as JSON with the following structure:
{
  "days": [
    {
      "day": "Day 1",
      "meals": [
        {
          "type": "Breakfast/Lunch/Dinner",
          "name": "Recipe Name",
          "ingredients": [
            {"name": "Ingredient", "amount": "Amount"}
          ],
          "instructions": "elaborate cooking instructions"
        }
      ]
    }
  ]
}

ONLY RETURN JSON! DO NOT GIVE ANY OTHER TEXT!!! DO NOT FORMAT OTHER THAN THAT!
`

  // Create AWS Bedrock client – use environment variables for credentials in production
  const bedrockClient = new BedrockRuntimeClient({
    region: "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY",
    },
  })

  // Prepare the request body for Bedrock
  const requestBody = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    top_k: 250,
    stop_sequences: [],
    temperature: 0.2,
    top_p: 0.9,
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
  }

  try {
    // Create and send the Bedrock command
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      body: JSON.stringify(requestBody),
    })
    const response = await bedrockClient.send(command)
    
    // Decode and parse the response
    const rawResponse = new TextDecoder().decode(response.body)
    const responseBody = JSON.parse(rawResponse)
    const text = responseBody.content[0].text
    if (!text) {
      throw new Error("No text returned from AWS Bedrock API")
    }
    
    // Remove any markdown formatting if present
    const cleanedText = text
      .replace(/^```(?:json)?\n/, "")
      .replace(/\n```$/, "")
      .trim()

    try {
      const mealPlan = JSON.parse(cleanedText)
      return mealPlan  
    } catch (error) {
      console.error({ error, text: cleanedText })
      throw new Error("Failed to parse meal plan JSON")
    }
  } catch (error) {
    console.error("Error calling AWS Bedrock API:", error)
    throw new Error("Failed to generate meal plan")
  }
}

import {
  TextractClient,
  DetectDocumentTextCommand
} from "@aws-sdk/client-textract";

/**
 * Extracts text from an image using AWS Textract and processes it with Claude to identify food ingredients
 * @param file File to process
 * @returns A list of food ingredients extracted from the image
 */
export async function extractIngredientsFromImage(file: File): Promise<string[]> {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY",
  };

  const textractClient = new TextractClient({
    region: "us-west-2",
    credentials
  });

  const arrayBuffer = await file.arrayBuffer();
  const documentBytes = new Uint8Array(arrayBuffer);

  const textractCommand = new DetectDocumentTextCommand({
    Document: { Bytes: documentBytes }
  });

  const textractResponse = await textractClient.send(textractCommand);

  let fullText = '';
  textractResponse.Blocks?.forEach((item) => {
    if (item.BlockType === "LINE" && item.Text) {
      fullText += item.Text + '\n';
    }
  });

  const bedrockClient = new BedrockRuntimeClient({
    region: "us-west-2",
    credentials
  });

  const prompt = "Get me all the ingredients of EDIBLE food items from a list of strings. If an item is not in english or abbreviated, give the full name in english. JUST RETURN THE ITEM NAME IN ENGLISH AND QUANTITIES IF APPLICABLE WITHOUT ANY ADDITIONAL INTERPRETATION. The list: " + fullText;

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
            text: prompt
          }
        ]
      }
    ]
  };

  const bedrockCommand = new InvokeModelCommand({
    modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    body: JSON.stringify(requestBody)
  });

  const claudeResponse = await bedrockClient.send(bedrockCommand);

  const responseBody = JSON.parse(new TextDecoder().decode(claudeResponse.body));
  const ingredientsList = responseBody.content[0].text;

  console.log(ingredientsList);

  return ingredientsList.split('\n').filter((line: string) => line.trim() !== '');
}