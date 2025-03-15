"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Loader2, ArrowLeft, Plus, X, Check } from "lucide-react"
import { createReceipt } from "./actions"
import { motion, AnimatePresence } from "framer-motion"

// Mock data to simulate OCR results
const mockOcrResults = [
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
]

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [items, setItems] = useState<string[]>([])
  const [currentItem, setCurrentItem] = useState("")
  const [people, setPeople] = useState(2)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleCapture = () => {
    fileInputRef.current?.click()
  }

  const handleProcessReceipt = async () => {
    if (!file) return

    setIsLoading(true)
    try {
      // In a real app, we would upload the file and process it with OCR
      // For demo purposes, we'll simulate this with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set mock OCR results
      setItems(mockOcrResults)
      setIsReviewing(true)
    } catch (error) {
      console.error("Error processing receipt:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
      // Create a receipt with the items and redirect to meal plan
      const receiptId = await createReceipt(items, people)
      router.push(`/meal-plan/${receiptId}`)
    } catch (error) {
      console.error("Error creating meal plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (isReviewing) {
      setIsReviewing(false)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isReviewing ? "Back to Scan" : "Back to Home"}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          <AnimatePresence mode="wait">
            {!isReviewing ? (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
              >
                <Card className="border-none bg-background/80 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl">Scan Receipt</CardTitle>
                    <CardDescription>Take a photo of your grocery receipt or upload an image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {preview ? (
                        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt="Receipt preview"
                            className="h-full w-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute bottom-2 right-2"
                            onClick={handleCapture}
                          >
                            Retake
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex aspect-[4/5] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 p-4 text-center cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={handleCapture}
                        >
                          <div className="mb-4 rounded-full bg-primary/10 p-4">
                            <Camera className="h-8 w-8 text-primary" />
                          </div>
                          <div className="text-lg font-medium">Click to take a photo</div>
                          <div className="text-sm text-muted-foreground mt-1">or drag and drop an image</div>
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
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary/90 py-6 text-lg"
                      onClick={handleProcessReceipt}
                      disabled={!file || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process Receipt"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
              >
                <Card className="border-none bg-background/80 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Review Ingredients</CardTitle>
                        <CardDescription>
                          We found these items on your receipt. Add or remove as needed.
                        </CardDescription>
                      </div>
                      <div className="rounded-full bg-primary/10 p-2">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
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
                        <Label htmlFor="review-people">Number of people</Label>
                        <Input
                          id="review-people"
                          type="number"
                          min="1"
                          value={people}
                          onChange={(e) => setPeople(Number.parseInt(e.target.value) || 1)}
                          className="bg-background"
                        />
                      </div>
                    </div>
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

