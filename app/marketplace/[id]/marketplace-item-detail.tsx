"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Calendar, MapPin, MessageCircle, Trash, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { MarketplaceItemWithImages } from "@/lib/database.types"

interface MarketplaceItemDetailProps {
  item: MarketplaceItemWithImages
}

export default function MarketplaceItemDetail({ item }: MarketplaceItemDetailProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Get Supabase client
  const supabase = createClient()

  // Get current user
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if current user is the seller
  const isOwner = user?.id === item.user_id

  // Get images
  const images = (item.images as any[]) || []
  const imageUrls = images.map(
    (img) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${img.storage_path}`,
  )

  // If no images, add a placeholder
  if (imageUrls.length === 0) {
    imageUrls.push("/placeholder.svg?height=600&width=600")
  }

  // Map condition to color
  const conditionColor =
    {
      New: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Like New": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Good: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Fair: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }[item.condition] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"

  // Get user session on component mount
  React.useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)

      // Set up auth state change listener
      const {
        data: { subscription },
      } = await supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    getUser()
  }, [])

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send messages",
        variant: "destructive",
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      // Use client-side Supabase to send message
      const { error } = await supabase.from("marketplace_messages").insert({
        item_id: item.id,
        sender_id: user.id,
        receiver_id: item.user_id,
        message: message,
        read: false,
        created_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Message sent",
        description: "Your message has been sent to the seller",
      })
      setMessage("")
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Handle deleting an item
  const handleDeleteItem = async () => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      // Delete images from storage
      if (images && images.length > 0) {
        for (const image of images) {
          await supabase.storage.from("marketplace").remove([image.storage_path])
        }
      }

      // Delete image records
      await supabase.from("marketplace_images").delete().eq("item_id", item.id)

      // Delete messages
      await supabase.from("marketplace_messages").delete().eq("item_id", item.id)

      // Delete the item
      const { error } = await supabase.from("marketplace_items").delete().eq("id", item.id)

      if (error) throw error

      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully deleted",
      })
      router.push("/marketplace")
    } catch (error: any) {
      setIsDeleting(false)
      toast({
        title: "Failed to delete listing",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Image Gallery */}
      <div className="md:col-span-2">
        <div className="mb-4 overflow-hidden rounded-lg">
          <div className="aspect-square relative">
            <Image
              src={imageUrls[selectedImageIndex] || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
        {imageUrls.length > 1 && (
          <div className="grid grid-cols-5 gap-4">
            {imageUrls.map((image, index) => (
              <div
                key={index}
                className={`aspect-square relative overflow-hidden rounded-lg cursor-pointer border-2 ${
                  selectedImageIndex === index ? "border-[#B65FCF]" : "border-transparent"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${item.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Details */}
      <div>
        <div className="sticky top-20 space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{item.category}</Badge>
              <Badge variant="secondary" className={conditionColor}>
                {item.condition}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white">{item.title}</h1>
            <div className="mt-2 text-3xl font-bold text-[#B65FCF]">${item.price.toFixed(2)}</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4" />
              <span>Listed {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-800">
                  <AvatarImage src={item.avatar_url || undefined} alt={item.username} />
                  <AvatarFallback>{item.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-black dark:text-white">{item.username}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Member since {new Date(item.created_at).getFullYear()}
                  </div>
                </div>
              </div>

              {isOwner ? (
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/marketplace/edit/${item.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Listing
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleDeleteItem} disabled={isDeleting}>
                    <Trash className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Write a message to the seller..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!user || isSending}
                    className="min-h-[100px]"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white"
                    disabled={!user || isSending}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {!user ? "Login to Contact Seller" : isSending ? "Sending..." : "Contact Seller"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {item.features && item.features.length > 0 && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-4">
              <h3 className="font-bold text-black dark:text-white mb-3">Item Features</h3>
              <ul className="space-y-2">
                {item.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#B65FCF]"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

