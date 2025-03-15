"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, X, ArrowLeft, ShoppingCart } from "lucide-react"
import { createManualEntry } from "./actions"
import { motion } from "framer-motion"

export default function ManualEntryPage() {
  const [items, setItems] = useState<string[]>([])
  const [currentItem, setCurrentItem] = useState("")
  const [people, setPeople] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setItems([...items, currentItem.trim()])
      setCurrentItem("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddItem()
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleBulkAdd = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (!text.trim()) return

    // Split by new lines and commas, then filter empty items
    const newItems = text
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    setItems([...items, ...newItems])
    e.target.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsLoading(true)
    try {
      // Create a manual entry and redirect to meal plan
      const entryId = await createManualEntry(items, people)
      router.push(`/meal-plan/${entryId}`)
    } catch (error) {
      console.error("Error processing ingredients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Card className="border-none bg-background/80 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Enter Your Ingredients</CardTitle>
                    <CardDescription>List the ingredients you have available</CardDescription>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an ingredient (e.g., Chicken breast 1lb)"
                      value={currentItem}
                      onChange={(e) => setCurrentItem(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-background"
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleAddItem}
                      disabled={!currentItem.trim()}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Or paste multiple ingredients</Label>
                    <Textarea
                      placeholder="Paste multiple ingredients separated by commas or new lines"
                      onChange={handleBulkAdd}
                      className="min-h-[100px] bg-background"
                    />
                  </div>

                  {items.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Your ingredients ({items.length})</Label>
                        <span className="text-xs text-muted-foreground">Tap an item to remove it</span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto rounded-md border border-border p-2 bg-background">
                        <ul className="space-y-2">
                          {items.map((item, index) => (
                            <motion.li
                              key={index}
                              className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm hover:bg-muted/80 transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <span>{item}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="people">Number of people</Label>
                    <Input
                      id="people"
                      type="number"
                      min="1"
                      value={people}
                      onChange={(e) => setPeople(Number.parseInt(e.target.value) || 1)}
                      className="bg-background"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/90 py-6 text-lg"
                  onClick={handleSubmit}
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Meal Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

