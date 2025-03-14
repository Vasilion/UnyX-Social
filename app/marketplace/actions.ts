"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/lib/database.types"

// Type for the form data when creating or updating a marketplace item
type MarketplaceItemFormData = {
  title: string
  price: number
  condition: string
  category: string
  location: string
  description: string
  features: string[]
  contactMethod: string
  contactInfo: string
}

// Create a new marketplace item
export async function createMarketplaceItem(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to create a listing" }
  }

  const userId = session.user.id

  // Parse form data
  const title = formData.get("title") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const condition = formData.get("condition") as string
  const category = formData.get("category") as string
  const location = formData.get("location") as string
  const description = formData.get("description") as string
  const featuresString = formData.get("features") as string
  const features = featuresString ? featuresString.split(",").map((f) => f.trim()) : []

  // Validate required fields
  if (!title || !price || !condition || !category || !location || !description) {
    return { error: "All required fields must be filled" }
  }

  try {
    // Create a new item
    const itemId = uuidv4()
    const { error: itemError } = await supabase.from("marketplace_items").insert({
      id: itemId,
      title,
      price,
      condition,
      category,
      location,
      description,
      features,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (itemError) throw itemError

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[]

    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        if (file.size === 0) continue // Skip empty files

        const fileExt = file.name.split(".").pop()
        const fileName = `${itemId}/${uuidv4()}.${fileExt}`
        const filePath = `marketplace/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage.from("marketplace").upload(filePath, file)

        if (uploadError) throw uploadError

        // Create image record
        const { error: imageError } = await supabase.from("marketplace_images").insert({
          item_id: itemId,
          storage_path: filePath,
          is_primary: i === 0, // First image is primary
          created_at: new Date().toISOString(),
        })

        if (imageError) throw imageError
      }
    }

    revalidatePath("/marketplace")
    return { success: true, itemId }
  } catch (error) {
    console.error("Error creating marketplace item:", error)
    return { error: "Failed to create listing. Please try again." }
  }
}

// Get all marketplace items
export async function getMarketplaceItems(category?: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  try {
    let query = supabase.from("marketplace_items_with_images").select("*").order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) throw error

    return { items: data }
  } catch (error) {
    console.error("Error fetching marketplace items:", error)
    return { error: "Failed to load marketplace items" }
  }
}

// Get a single marketplace item by ID
export async function getMarketplaceItem(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  try {
    // Get the item with seller info and images
    const { data: item, error } = await supabase.from("marketplace_items_with_images").select("*").eq("id", id).single()

    if (error) throw error

    return { item }
  } catch (error) {
    console.error("Error fetching marketplace item:", error)
    return { error: "Failed to load item details" }
  }
}

// Update a marketplace item
export async function updateMarketplaceItem(id: string, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to update a listing" }
  }

  try {
    // Check if user owns this item
    const { data: item, error: fetchError } = await supabase
      .from("marketplace_items")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    if (item.user_id !== session.user.id) {
      return { error: "You can only edit your own listings" }
    }

    // Parse form data
    const title = formData.get("title") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const condition = formData.get("condition") as string
    const category = formData.get("category") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const featuresString = formData.get("features") as string
    const features = featuresString ? featuresString.split(",").map((f) => f.trim()) : []

    // Update the item
    const { error: updateError } = await supabase
      .from("marketplace_items")
      .update({
        title,
        price,
        condition,
        category,
        location,
        description,
        features,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) throw updateError

    // Handle new image uploads
    const imageFiles = formData.getAll("new_images") as File[]

    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        if (file.size === 0) continue // Skip empty files

        const fileExt = file.name.split(".").pop()
        const fileName = `${id}/${uuidv4()}.${fileExt}`
        const filePath = `marketplace/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage.from("marketplace").upload(filePath, file)

        if (uploadError) throw uploadError

        // Create image record
        const { error: imageError } = await supabase.from("marketplace_images").insert({
          item_id: id,
          storage_path: filePath,
          is_primary: false, // New uploads are not primary by default
          created_at: new Date().toISOString(),
        })

        if (imageError) throw imageError
      }
    }

    // Handle deleted images
    const deletedImageIds = formData.get("deleted_images") as string
    if (deletedImageIds) {
      const ids = deletedImageIds.split(",")

      for (const imageId of ids) {
        // Get the storage path first
        const { data: image, error: getError } = await supabase
          .from("marketplace_images")
          .select("storage_path")
          .eq("id", imageId)
          .single()

        if (getError) continue

        // Delete from storage
        await supabase.storage.from("marketplace").remove([image.storage_path])

        // Delete the record
        await supabase.from("marketplace_images").delete().eq("id", imageId)
      }
    }

    // Handle primary image
    const primaryImageId = formData.get("primary_image") as string
    if (primaryImageId) {
      // Reset all to non-primary
      await supabase.from("marketplace_images").update({ is_primary: false }).eq("item_id", id)

      // Set the selected one as primary
      await supabase.from("marketplace_images").update({ is_primary: true }).eq("id", primaryImageId)
    }

    revalidatePath(`/marketplace/${id}`)
    revalidatePath("/marketplace")
    return { success: true }
  } catch (error) {
    console.error("Error updating marketplace item:", error)
    return { error: "Failed to update listing. Please try again." }
  }
}

// Delete a marketplace item
export async function deleteMarketplaceItem(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to delete a listing" }
  }

  try {
    // Check if user owns this item
    const { data: item, error: fetchError } = await supabase
      .from("marketplace_items")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    if (item.user_id !== session.user.id) {
      return { error: "You can only delete your own listings" }
    }

    // Get all images to delete from storage
    const { data: images, error: imagesError } = await supabase
      .from("marketplace_images")
      .select("storage_path")
      .eq("item_id", id)

    if (imagesError) throw imagesError

    // Delete images from storage
    if (images && images.length > 0) {
      const paths = images.map((img) => img.storage_path)
      await supabase.storage.from("marketplace").remove(paths)
    }

    // Delete image records
    await supabase.from("marketplace_images").delete().eq("item_id", id)

    // Delete messages
    await supabase.from("marketplace_messages").delete().eq("item_id", id)

    // Delete the item
    const { error: deleteError } = await supabase.from("marketplace_items").delete().eq("id", id)

    if (deleteError) throw deleteError

    revalidatePath("/marketplace")
    return { success: true }
  } catch (error) {
    console.error("Error deleting marketplace item:", error)
    return { error: "Failed to delete listing. Please try again." }
  }
}

// Send a message to a seller
export async function sendMessage(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to send messages" }
  }

  const senderId = session.user.id
  const itemId = formData.get("item_id") as string
  const receiverId = formData.get("receiver_id") as string
  const message = formData.get("message") as string

  if (!itemId || !receiverId || !message) {
    return { error: "Missing required fields" }
  }

  try {
    const { error } = await supabase.from("marketplace_messages").insert({
      item_id: itemId,
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      created_at: new Date().toISOString(),
      read: false,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error sending message:", error)
    return { error: "Failed to send message. Please try again." }
  }
}

// Get messages for a specific item between two users
export async function getMessages(itemId: string, otherUserId: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to view messages" }
  }

  const userId = session.user.id

  try {
    // Get messages where current user is either sender or receiver
    const { data, error } = await supabase
      .from("marketplace_messages")
      .select(`
        *,
        sender:sender_id(username, avatar_url),
        receiver:receiver_id(username, avatar_url)
      `)
      .eq("item_id", itemId)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order("created_at", { ascending: true })

    if (error) throw error

    // Mark messages as read if current user is the receiver
    const unreadMessages = data.filter((msg) => msg.receiver_id === userId && !msg.read).map((msg) => msg.id)

    if (unreadMessages.length > 0) {
      await supabase.from("marketplace_messages").update({ read: true }).in("id", unreadMessages)
    }

    return { messages: data }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return { error: "Failed to load messages" }
  }
}

// Get all conversations for the current user
export async function getConversations() {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to view conversations" }
  }

  const userId = session.user.id

  try {
    // This is a complex query to get the latest message from each conversation
    // along with the item details and other user's info
    const { data, error } = await supabase.rpc("get_user_conversations", { user_id: userId })

    if (error) throw error

    return { conversations: data }
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return { error: "Failed to load conversations" }
  }
}

