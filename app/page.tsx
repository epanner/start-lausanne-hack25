import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Camera, Utensils, Users, ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-10 text-center">
          <div className="space-y-4">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              Smart Meal Planning
            </div>
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Meal<span className="text-primary">Match</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Turn your grocery receipts into personalized meal plans. Reduce food waste and simplify your cooking.
            </p>
          </div>

          <div className="grid w-full max-w-md gap-6">
            <Card className="overflow-hidden border-none bg-background/60 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription>Choose how you want to create your meal plan</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-6">
                <Link href="/scan">
                  <Button
                    className="group w-full justify-between bg-gradient-to-r from-primary to-primary/90 py-6 text-lg"
                    size="lg"
                  >
                    <div className="flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 transition-all group-hover:bg-primary-foreground/30">
                        <Camera className="h-5 w-5" />
                      </div>
                      <span>Scan Receipt</span>
                    </div>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/manual-entry">
                  <Button className="group w-full justify-between py-6 text-lg" variant="outline" size="lg">
                    <div className="flex items-center">
                      <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-all group-hover:bg-muted/80">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <span>Enter Ingredients</span>
                    </div>
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
            <Card className="border-none bg-background/60 shadow-md backdrop-blur-sm transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                  <CardTitle>Scan Receipts</CardTitle>
                  <CardDescription>Quickly scan your grocery receipts with our OCR technology</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="border-none bg-background/60 shadow-md backdrop-blur-sm transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                  <CardTitle>Get Meal Plans</CardTitle>
                  <CardDescription>AI-generated meal plans based on your purchased ingredients</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="border-none bg-background/60 shadow-md backdrop-blur-sm transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                  <CardTitle>Customize</CardTitle>
                  <CardDescription>Adjust for number of people and meal preferences</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

