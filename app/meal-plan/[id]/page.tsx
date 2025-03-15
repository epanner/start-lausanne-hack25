import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, Users, Utensils } from "lucide-react"
import { generateMealPlan } from "@/app/scan/actions"
import MealPlanSkeleton from "./loading"

export default async function MealPlanPage(props: { params: { id: string } }) {
  // Await the params before destructuring
  const params = await props.params
  const { id } = params

  const mealPlan = await generateMealPlan(id)
  if (!mealPlan || !mealPlan.days) {
    notFound()
  }

  const isManualEntry = id.startsWith("manual-")
  let peopleCount = 2
  // @ts-ignore
  if (isManualEntry && global.manualEntries && global.manualEntries[id]) {
      // @ts-ignore
    peopleCount = global.manualEntries[id].people
      // @ts-ignore
  } else if (global.receiptItems && global.receiptItems[id]) {
      // @ts-ignore
    peopleCount = global.receiptItems[id].people
  }

  const getOffsetDate = (offset: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    now.setDate(now.getDate() + offset);  // Apply the offset

    const dayName = days[now.getDay()];
    const day = String(now.getDate()).padStart(2, '0');  // Two-digit format
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Two-digit month

    return `${dayName}, ${day}.${month}.`
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Your Meal Plan</h1>
            <p className="text-muted-foreground">
              Based on your {isManualEntry ? "manually entered ingredients" : "grocery receipt"} from{" "}
              {getOffsetDate(0)}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none bg-background/80 shadow-md backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">People</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">{peopleCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-background/80 shadow-md backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">{mealPlan.days.length} days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-background/80 shadow-md backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">
                    {mealPlan.days.reduce((total: number, day: any) => total + day.meals.length, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none bg-background/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Daily Meal Plans</CardTitle>
              <CardDescription>Browse through your personalized meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={mealPlan.days[0].day.toLowerCase().replace(" ", "-")}>
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                    {mealPlan.days.map((day: any, index: number) => {
                      const date = new Date();
                      date.setDate(date.getDate() + index);
                      return (
                        <TabsTrigger
                          key={day.day}
                          value={day.day.toLowerCase().replace(" ", "-")}
                          className="min-w-[80px]"
                        >
                          {getOffsetDate(index)}
                        </TabsTrigger>
                      );
                    })}
                </TabsList>

                <Suspense fallback={<MealPlanSkeleton />}>
                  {mealPlan.days.map((day: any) => (
                    <TabsContent key={day.day} value={day.day.toLowerCase().replace(" ", "-")} className="space-y-6">
                      {day.meals.map((meal: any, index: number) => (
                        <Card key={index} className="overflow-hidden border-none shadow-md">
                          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
                            <div className="text-sm font-medium text-primary">{meal.type}</div>
                            <h3 className="text-xl font-bold">{meal.name}</h3>
                          </div>
                          <CardContent className="grid gap-6 p-6">
                            <div>
                              <h4 className="mb-3 font-medium">Ingredients</h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {meal.ingredients.map((ingredient: any, i: number) => (
                                  <li key={i} className="flex items-center text-sm">
                                    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
                                    <span className="w-full">
                                      {ingredient.amount} {ingredient.name}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="mb-3 font-medium">Instructions</h4>
                              <p className="text-sm text-muted-foreground">{meal.instructions}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ))}
                </Suspense>
              </Tabs>
            </CardContent>
          </Card>

          {mealPlan.unusedIngredients && mealPlan.unusedIngredients.length > 0 && (
            <Card className="border-none bg-background/80 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Unused Ingredients</CardTitle>
                <CardDescription>These items weren't used in your meal plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {mealPlan.unusedIngredients.map((item: string, i: number) => (
                    <li key={i} className="flex items-center text-sm">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-muted-foreground"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}