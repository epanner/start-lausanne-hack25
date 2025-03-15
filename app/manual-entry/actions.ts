"use server"

// In a real app, this would be a database call
export async function createManualEntry(items: string[], people: number) {
  // Generate a random ID for demo purposes
  const entryId = `manual-${Math.random().toString(36).substring(2, 10)}`

  // In a real app, we would:
  // 1. Store the items and people count in a database
  // 2. Associate them with the entryId

  // For demo purposes, we'll store the data in a global variable or cache
  // This is just a placeholder - in a real app you'd use a database
  global.manualEntries = global.manualEntries || {}
  global.manualEntries[entryId] = {
    items,
    people,
    createdAt: new Date(),
  }

  return entryId
}

