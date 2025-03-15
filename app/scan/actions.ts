// app/scan/actions.ts
"use server"

export async function createReceipt(items?: string[], peopleCount?: number) {
  const receiptId = Math.random().toString(36).substring(2, 10)
  if (items && items.length > 0) {
    global.receiptItems = global.receiptItems || {}
    global.receiptItems[receiptId] = {
      items,
      people: peopleCount || 2,
      createdAt: new Date(),
    }
  }
  return receiptId
}

export async function generateMealPlan(id: string, people = 2) {
  let ingredientsList: string[] = []

  if (id.startsWith("manual-") && global.manualEntries && global.manualEntries[id]) {
    ingredientsList = global.manualEntries[id].items
    people = global.manualEntries[id].people
  } else if (global.receiptItems && global.receiptItems[id]) {
    ingredientsList = global.receiptItems[id].items
    people = global.receiptItems[id].people
  } else {
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

  const prompt = `
  Create a 3-day meal plan (breakfast, lunch, dinner) for ${people} people using ONLY the following ingredients:
  ${ingredientsList.join(", ")}
  
  The meal plan should:
  1. Start with the next meal based on the current time (${new Date().getHours()}:00)
  2. Use ALL the ingredients efficiently with minimal waste
  3. Include recipe names, ingredients with quantities, and brief instructions
  4. Be formatted in a clear, organized way with days and meals clearly labeled
  
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
            "instructions": "Brief cooking instructions"
          }
        ]
      }
    ],
    "unusedIngredients": []
  }
  
  ONLY RETURN JSON! DO NOT GIVE ANY OTHER TEXT!!! DO NOT FORMAT OTHER THAN THAT!
  `
  
    const perplexityPayload = {
      model: "sonar",
      messages: [
        { role: "system", content: "Be precise and concise." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1024, // Increased token limit
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
    }
  
    const token = process.env.PERPLEXITY_API_TOKEN
    if (!token) {
      throw new Error("Missing Perplexity API token")
    }
  
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(perplexityPayload)
    })
  
    if (!response.ok) {
      console.error("Perplexity API error:", response.statusText)
      throw new Error("Failed to generate meal plan")
    }
  
    const data = await response.json()
    const rawText = data.choices[0].message.content
    if (!rawText) {
      throw new Error("No text returned from Perplexity API")
    }
  
    const cleanedText = rawText
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
}