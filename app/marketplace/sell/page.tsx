"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ImagePlus, Loader2, Upload } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { createMarketplaceItem } from "../actions"

export default function SellItemPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get Supabase client
  const supabase = createClient()

  // Get user session on component mount
  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)

      // Redirect if not logged in
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to sell items",
          variant: "destructive",
        })
        router.push("/login?redirect=/marketplace/sell")
      }
    }

    getUser()
  }, [])

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Check file size and type
      const validFiles = newFiles.filter((file) => {
        const isValidType = file.type.startsWith("image/")
        const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: "Only image files are allowed",
            variant: "destructive",
          })
        }

        if (!isValidSize) {
          toast({
            title: "File too large",
            description: "Images must be less than 5MB",
            variant: "destructive",
          })
        }

        return isValidType && isValidSize
      })

      // Check total number of images
      if (images.length + validFiles.length > 5) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 5 images",
          variant: "destructive",
        })

        // Only add files up to the limit
        const remainingSlots = 5 - images.length
        validFiles.splice(remainingSlots)
      }

      // Create preview URLs
      const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))

      setImages([...images, ...validFiles])
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls])
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images]
    const newPreviewUrls = [...imagePreviewUrls]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index])

    newImages.splice(index, 1)
    newPreviewUrls.splice(index, 1)

    setImages(newImages)
    setImagePreviewUrls(newPreviewUrls)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your item",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Add images to form data
    images.forEach((image) => {
      formData.append("images", image)
    })

    const { success, error, itemId } = await createMarketplaceItem(formData)

    setIsSubmitting(false)

    if (success && itemId) {
      toast({
        title: "Listing created",
        description: "Your item has been successfully listed",
      })
      router.push(`/marketplace/${itemId}`)
    } else {
      toast({
        title: "Failed to create listing",
        description: error || "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-6">
        <Link href="/marketplace" className="inline-flex items-center text-[#B65FCF] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-6">Sell Your Gear</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>Provide accurate information about the item you're selling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Fox Racing V3 RS Helmet - Size L" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gear">Gear</SelectItem>
                        <SelectItem value="Bikes">Bikes</SelectItem>
                        <SelectItem value="Parts">Parts</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select name="condition" required>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" name="price" type="number" placeholder="0.00" min="0" step="0.01" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g., Phoenix, AZ" required />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your item in detail, including any features, defects, or other important information"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="features">Features (comma separated)</Label>
                  <Input
                    id="features"
                    name="features"
                    placeholder="e.g., Size: Large, Color: Black/Red, MIPS Technology"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enter features separated by commas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Add clear photos of your item from multiple angles (max 5)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="images" className="cursor-pointer">
                    <div className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
                      <div className="text-sm text-gray-500 dark:text-gray-400">Click to upload images (max 5)</div>
                    </div>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={images.length >= 5}
                    />
                  </Label>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                      >
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Uploaded image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                          onClick={() => removeImage(index)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How potential buyers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                  <Select name="contactMethod" required>
                    <SelectTrigger id="contactMethod">
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="app-message">UnyX Messages</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contactInfo">Contact Details</Label>
                  <Input id="contactInfo" name="contactInfo" placeholder="e.g., your email or phone number" required />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This will only be shared with interested buyers
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/marketplace")}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white"
                disabled={isSubmitting || images.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    List Item
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

