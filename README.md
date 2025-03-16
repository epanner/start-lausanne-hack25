
# MealMatch 🍽️

## START LAUSANNE Hackathon 2025
**AI for Sustainability 🌿** – A Next.js application that provides a dynamic meal planning feature by scanned grocery receipts in order to reduce food waste. Built with AWS Bedrock, Amazon Textract, Next.js, Tailwind CSS, and more.

<img width="1119" alt="image" src="https://github.com/user-attachments/assets/07048227-a143-4592-945c-d3e511c2b3c4" />


## Overview

This project aims to promote sustainability through AI-assisted meal planning and grocery receipt scanning. By integrating AWS Bedrock for text generation (Claude 3.5 Sonnet model), Amazon Textract (OCR), and a Next.js 13 application, users can:

1. Scan grocery receipts or manually input grocery items.
2. Generate meal plans with minimal waste (based on these inputs).

## Features

1. **Meal Plan Generation**  
   - Uses AWS Bedrock to generate multiple day meal plans.
   - Customizable based on available ingredients and number of people.
   - Stores mealplan in a relational database.

2. **Receipt/Manual Entry**  
   - Allows scanning of grocery receipts (or manual entries) for item extraction.
   - Stores data ingredient list in relation database.


## Tech Stack

- **Next.js 13**
- **TypeScript**  
- **Tailwind CSS**
- **Neon** (Serverless PostgreSQL)
- **AWS Bedrock** (Claude 3.5 Sonnet)
- **Amazon Textract** (for OCR)  
- **pnpm** (recommended package manager)  
- **Vercel** (for deployment)


## How to Run

### Option 1: Online
Visit https://mealmatch-hack.vercel.app.

### Option 2: Locally

1. **Fork and clone the repository**.

2. **Install dependencies**.
   ```bash
   pnpm install
   ```
   Or use `npm install` if you prefer npm.

3. **Set Environment Variables**.

   Create a `.env.local` file in the root of your project (ignored by Git) and add the following: 
    ```bash
    # AWS credentials
    AWS_ACCESS_KEY_ID=your-access-key-id
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    AWS_REGION=us-west-2

    # DB connection string
    DATABASE_URL=database URL
    ```

4. **Create Tables in Database**

    Recommended to use PostgreSQL for JSON support:
    ```sql
    CREATE TABLE mealplan (
      mealplanID SERIAL PRIMARY KEY,
        people INT NOT NULL DEFAULT 2,
          ingredients JSON NOT NULL DEFAULT '[]'::json,
              mealplan JSON NOT NULL DEFAULT '{}'::json,
                  type TEXT NOT NULL DEFAULT 'manual' CHECK (type IN ('scan', 'manual'))
                )
    ```
    
5. **Run in Development**.
   ```bash
   pnpm dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

6. **Deployment**.

   Run `pnpm build` then `pnpm start` to serve the production build locally.


## Useful commands

| Command         | Description                                                    |
|-----------------|----------------------------------------------------------------|
| `pnpm dev`      | Start the development server on [http://localhost:3000](http://localhost:3000). |
| `pnpm build`    | Create an optimized production build.                          |
| `pnpm start`    | Run the production build.                                      |
| `pnpm lint`     | Lint your code using ESLint.                                   |
| `pnpm typecheck`| Run TypeScript type checking.                                  |

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use it as you see fit.
