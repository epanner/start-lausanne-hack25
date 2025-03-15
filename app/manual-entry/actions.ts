"use server";

import { Pool } from "pg";

/**
 * Stores the manual entry ingredients into the database and returns the ID.
 * @param items List of ingredients to store
 * @param people Number of people
 * @returns The ID of the stored ingredients
 */
export async function createManualEntry(
  items: string[],
  people: number
): Promise<string> {
  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const client = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO public.mealplan (ingredients, type, people) VALUES ($1, $2, $3) RETURNING mealplanid",
      [JSON.stringify(items), "manual", people]
    );
    return result.rows[0].mealplanid;
  } finally {
    client.release();
  }
}
