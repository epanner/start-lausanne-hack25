import { Loader2 } from "lucide-react"

export default function MealPlanSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
    <div className="flex max-w-md flex-col items-center rounded-xl bg-white p-8 shadow-md backdrop-blur-sm">
      <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      <h2 className="mt-6 text-center text-xl font-medium text-gray-800">
        Hold on, we are working on your customized meal plan!
      </h2>
    </div>
  </div>
  )
}

