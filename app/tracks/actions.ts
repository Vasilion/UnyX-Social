"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/lib/database.types"

// Get all tracks with details
export async function getTracks(difficulty?: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  try {
    let query = supabase.from("tracks_with_details").select("*").order("name", { ascending: true })

    if (difficulty && difficulty !== "all") {
      query = query.eq("difficulty", difficulty)
    }

    const { data, error } = await query

    if (error) throw error

    return { tracks: data }
  } catch (error) {
    console.error("Error fetching tracks:", error)
    return { error: "Failed to load tracks" }
  }
}

// Get a single track by ID
export async function getTrack(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  try {
    // Get the track with images and average rating
    const { data: track, error } = await supabase.from("tracks_with_details").select("*").eq("id", id).single()

    if (error) throw error

    // Get reviews for the track
    const { data: reviews, error: reviewsError } = await supabase
      .from("track_reviews_with_user")
      .select("*")
      .eq("track_id", id)
      .order("created_at", { ascending: false })

    if (reviewsError) throw reviewsError

    return { track, reviews }
  } catch (error) {
    console.error("Error fetching track:", error)
    return { error: "Failed to load track details" }
  }
}

// Create a new track
export async function createTrack(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to create a track" }
  }

  const userId = session.user.id

  // Parse form data
  const name = formData.get("name") as string
  const location = formData.get("location") as string
  const description = formData.get("description") as string
  const difficulty = formData.get("difficulty") as string
  const hours = formData.get("hours") as string
  const price = formData.get("price") as string
  const amenitiesString = formData.get("amenities") as string
  const amenities = amenitiesString ? amenitiesString.split(",").map((a) => a.trim()) : []

  // Validate required fields
  if (!name || !location || !description || !difficulty) {
    return { error: "All required fields must be filled" }
  }

  try {
    // Create a new track
    const trackId = uuidv4()
    const { error: trackError } = await supabase.from("tracks").insert({
      id: trackId,
      name,
      location,
      description,
      difficulty,
      hours,
      price,
      amenities,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (trackError) throw trackError

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[]

    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        if (file.size === 0) continue // Skip empty files

        const fileExt = file.name.split(".").pop()
        const fileName = `${trackId}/${uuidv4()}.${fileExt}`
        const filePath = `tracks/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage.from("tracks").upload(filePath, file)

        if (uploadError) throw uploadError

        // Create image record
        const { error: imageError } = await supabase.from("track_images").insert({
          track_id: trackId,
          storage_path: filePath,
          is_primary: i === 0, // First image is primary
          created_at: new Date().toISOString(),
        })

        if (imageError) throw imageError
      }
    }

    revalidatePath("/tracks")
    return { success: true, trackId }
  } catch (error) {
    console.error("Error creating track:", error)
    return { error: "Failed to create track. Please try again." }
  }
}

// Update a track
export async function updateTrack(id: string, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to update a track" }
  }

  try {
    // Check if user owns this track
    const { data: track, error: fetchError } = await supabase.from("tracks").select("created_by").eq("id", id).single()

    if (fetchError) throw fetchError

    if (track.created_by !== session.user.id) {
      return { error: "You can only edit tracks you created" }
    }

    // Parse form data
    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const difficulty = formData.get("difficulty") as string
    const hours = formData.get("hours") as string
    const price = formData.get("price") as string
    const amenitiesString = formData.get("amenities") as string
    const amenities = amenitiesString ? amenitiesString.split(",").map((a) => a.trim()) : []

    // Update the track
    const { error: updateError } = await supabase
      .from("tracks")
      .update({
        name,
        location,
        description,
        difficulty,
        hours,
        price,
        amenities,
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
        const filePath = `tracks/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage.from("tracks").upload(filePath, file)

        if (uploadError) throw uploadError

        // Create image record
        const { error: imageError } = await supabase.from("track_images").insert({
          track_id: id,
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
          .from("track_images")
          .select("storage_path")
          .eq("id", imageId)
          .single()

        if (getError) continue

        // Delete from storage
        await supabase.storage.from("tracks").remove([image.storage_path])

        // Delete the record
        await supabase.from("track_images").delete().eq("id", imageId)
      }
    }

    // Handle primary image
    const primaryImageId = formData.get("primary_image") as string
    if (primaryImageId) {
      // Reset all to non-primary
      await supabase.from("track_images").update({ is_primary: false }).eq("track_id", id)

      // Set the selected one as primary
      await supabase.from("track_images").update({ is_primary: true }).eq("id", primaryImageId)
    }

    revalidatePath(`/tracks/${id}`)
    revalidatePath("/tracks")
    return { success: true }
  } catch (error) {
    console.error("Error updating track:", error)
    return { error: "Failed to update track. Please try again." }
  }
}

// Delete a track
export async function deleteTrack(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to delete a track" }
  }

  try {
    // Check if user owns this track
    const { data: track, error: fetchError } = await supabase.from("tracks").select("created_by").eq("id", id).single()

    if (fetchError) throw fetchError

    if (track.created_by !== session.user.id) {
      return { error: "You can only delete tracks you created" }
    }

    // Get all images to delete from storage
    const { data: images, error: imagesError } = await supabase
      .from("track_images")
      .select("storage_path")
      .eq("track_id", id)

    if (imagesError) throw imagesError

    // Delete images from storage
    if (images && images.length > 0) {
      const paths = images.map((img) => img.storage_path)
      await supabase.storage.from("tracks").remove(paths)
    }

    // Delete image records
    await supabase.from("track_images").delete().eq("track_id", id)

    // Delete reviews
    await supabase.from("track_reviews").delete().eq("track_id", id)

    // Delete user track records
    await supabase.from("user_tracks").delete().eq("track_id", id)

    // Delete the track
    const { error: deleteError } = await supabase.from("tracks").delete().eq("id", id)

    if (deleteError) throw deleteError

    revalidatePath("/tracks")
    return { success: true }
  } catch (error) {
    console.error("Error deleting track:", error)
    return { error: "Failed to delete track. Please try again." }
  }
}

// Create a track review
export async function createTrackReview(trackId: string, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to leave a review" }
  }

  const userId = session.user.id

  // Parse form data
  const rating = Number.parseInt(formData.get("rating") as string)
  const text = formData.get("text") as string

  // Validate required fields
  if (!rating || !text) {
    return { error: "Rating and review text are required" }
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5" }
  }

  try {
    // Check if user already reviewed this track
    const { data: existingReview, error: checkError } = await supabase
      .from("track_reviews")
      .select("id")
      .eq("track_id", trackId)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingReview) {
      return { error: "You have already reviewed this track" }
    }

    // Handle image upload if provided
    let imageUrl = null
    const imageFile = formData.get("image") as File

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${trackId}/${userId}/${uuidv4()}.${fileExt}`
      const filePath = `reviews/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("reviews").upload(filePath, imageFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrl } = supabase.storage.from("reviews").getPublicUrl(filePath)

      imageUrl = publicUrl.publicUrl
    }

    // Create the review
    const { error: reviewError } = await supabase.from("track_reviews").insert({
      track_id: trackId,
      user_id: userId,
      rating,
      text,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (reviewError) throw reviewError

    // Mark track as visited
    await supabase.from("user_tracks").upsert(
      {
        user_id: userId,
        track_id: trackId,
        visited_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,track_id",
      },
    )

    revalidatePath(`/tracks/${trackId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating review:", error)
    return { error: "Failed to submit review. Please try again." }
  }
}

// Delete a track review
export async function deleteTrackReview(reviewId: string, trackId: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to delete a review" }
  }

  try {
    // Check if user owns this review
    const { data: review, error: fetchError } = await supabase
      .from("track_reviews")
      .select("user_id, image_url")
      .eq("id", reviewId)
      .single()

    if (fetchError) throw fetchError

    if (review.user_id !== session.user.id) {
      return { error: "You can only delete your own reviews" }
    }

    // Delete image from storage if exists
    if (review.image_url) {
      const path = review.image_url.split("/").slice(-2).join("/")
      await supabase.storage.from("reviews").remove([path])
    }

    // Delete the review
    const { error: deleteError } = await supabase.from("track_reviews").delete().eq("id", reviewId)

    if (deleteError) throw deleteError

    revalidatePath(`/tracks/${trackId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting review:", error)
    return { error: "Failed to delete review. Please try again." }
  }
}

// Toggle track favorite status
export async function toggleTrackFavorite(trackId: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "You must be logged in to favorite tracks" }
  }

  const userId = session.user.id

  try {
    // Check if user already has this track in their list
    const { data: userTrack, error: checkError } = await supabase
      .from("user_tracks")
      .select("id, is_favorite")
      .eq("track_id", trackId)
      .eq("user_id", userId)
      .maybeSingle()

    if (checkError) throw checkError

    if (userTrack) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("user_tracks")
        .update({
          is_favorite: !userTrack.is_favorite,
        })
        .eq("id", userTrack.id)

      if (updateError) throw updateError

      return { success: true, isFavorite: !userTrack.is_favorite }
    } else {
      // Create new record
      const { error: insertError } = await supabase.from("user_tracks").insert({
        user_id: userId,
        track_id: trackId,
        is_favorite: true,
        created_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      return { success: true, isFavorite: true }
    }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { error: "Failed to update favorite status. Please try again." }
  }
}

// Check if a track is favorited by the current user
export async function isTrackFavorited(trackId: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { isFavorite: false }
  }

  try {
    const { data, error } = await supabase
      .from("user_tracks")
      .select("is_favorite")
      .eq("track_id", trackId)
      .eq("user_id", session.user.id)
      .maybeSingle()

    if (error) throw error

    return { isFavorite: data?.is_favorite || false }
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return { isFavorite: false }
  }
}

