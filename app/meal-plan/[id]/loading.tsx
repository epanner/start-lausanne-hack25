import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MealPlanSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((meal) => (
        <Card key={meal} className="overflow-hidden border-none shadow-md">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <CardContent className="grid gap-6 p-6">
            <div>
              <Skeleton className="h-5 w-24 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

