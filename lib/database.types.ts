export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          created_at: string
          updated_at: string
          is_club_member: boolean
          club_expires_at: string | null
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
          is_club_member?: boolean
          club_expires_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
          is_club_member?: boolean
          club_expires_at?: string | null
        }
      }
      tracks: {
        Row: {
          id: string
          name: string
          location: string
          description: string
          difficulty: string
          hours: string | null
          price: string | null
          amenities: string[] | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          location: string
          description: string
          difficulty: string
          hours?: string | null
          price?: string | null
          amenities?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          location?: string
          description?: string
          difficulty?: string
          hours?: string | null
          price?: string | null
          amenities?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      track_images: {
        Row: {
          id: string
          track_id: string
          storage_path: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          track_id: string
          storage_path: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          track_id?: string
          storage_path?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      track_reviews: {
        Row: {
          id: string
          track_id: string
          user_id: string
          rating: number
          text: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          track_id: string
          user_id: string
          rating: number
          text: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          track_id?: string
          user_id?: string
          rating?: number
          text?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      discounts: {
        Row: {
          id: string
          vendor: string
          logo_url: string | null
          offer: string
          code: string
          description: string | null
          terms: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor: string
          logo_url?: string | null
          offer: string
          code: string
          description?: string | null
          terms?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor?: string
          logo_url?: string | null
          offer?: string
          code?: string
          description?: string | null
          terms?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_discounts: {
        Row: {
          id: string
          user_id: string
          discount_id: string
          used_at: string
        }
        Insert: {
          id?: string
          user_id: string
          discount_id: string
          used_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          discount_id?: string
          used_at?: string
        }
      }
      club_subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          starts_at: string
          expires_at: string
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          starts_at: string
          expires_at: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          starts_at?: string
          expires_at?: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          starts_at: string
          ends_at: string
          image_url: string | null
          max_participants: number | null
          club_members_only: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          location: string
          starts_at: string
          ends_at: string
          image_url?: string | null
          max_participants?: number | null
          club_members_only?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          starts_at?: string
          ends_at?: string
          image_url?: string | null
          max_participants?: number | null
          club_members_only?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          registered_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          registered_at?: string
        }
      }
      marketplace_items: {
        Row: {
          id: string
          title: string
          price: number
          condition: string
          category: string
          location: string
          description: string
          features: string[] | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          price: number
          condition: string
          category: string
          location: string
          description: string
          features?: string[] | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          price?: number
          condition?: string
          category?: string
          location?: string
          description?: string
          features?: string[] | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      marketplace_images: {
        Row: {
          id: string
          item_id: string
          storage_path: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          storage_path: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          storage_path?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      marketplace_messages: {
        Row: {
          id: string
          item_id: string
          sender_id: string
          receiver_id: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          sender_id: string
          receiver_id: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      user_tracks: {
        Row: {
          id: string
          user_id: string
          track_id: string
          is_favorite: boolean
          visited_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          track_id: string
          is_favorite?: boolean
          visited_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          track_id?: string
          is_favorite?: boolean
          visited_at?: string | null
          created_at?: string
        }
      }
      user_follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_name: string
          badge_description: string
          badge_icon: string
          awarded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_name: string
          badge_description: string
          badge_icon: string
          awarded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_name?: string
          badge_description?: string
          badge_icon?: string
          awarded_at?: string
        }
      }
      user_photos: {
        Row: {
          id: string
          user_id: string
          storage_path: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          storage_path: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          storage_path?: string
          caption?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      tracks_with_details: {
        Row: {
          id: string
          name: string
          location: string
          description: string
          difficulty: string
          hours: string | null
          price: string | null
          amenities: string[] | null
          created_at: string
          updated_at: string
          created_by: string | null
          images: Json[] | null
          avg_rating: number | null
          review_count: number | null
        }
      }
      marketplace_items_with_images: {
        Row: {
          id: string
          title: string
          price: number
          condition: string
          category: string
          location: string
          description: string
          features: string[] | null
          created_at: string
          updated_at: string
          user_id: string
          username: string
          avatar_url: string | null
          images: Json[] | null
        }
      }
      posts_with_details: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          image_url: string | null
          created_at: string
          updated_at: string
          username: string
          avatar_url: string | null
          comment_count: number | null
        }
      }
      track_reviews_with_user: {
        Row: {
          id: string
          track_id: string
          user_id: string
          rating: number
          text: string
          image_url: string | null
          created_at: string
          updated_at: string
          username: string
          avatar_url: string | null
        }
      }
    }
    Functions: {
      get_user_conversations: {
        Args: {
          user_id: string
        }
        Returns: {
          conversation_id: string
          item_id: string
          item_title: string
          other_user_id: string
          other_username: string
          other_avatar_url: string | null
          last_message: string
          last_message_time: string
          unread_count: number
        }[]
      }
      is_club_member: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
  }
}

// Define types for easier use in the application
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Track = Database["public"]["Tables"]["tracks"]["Row"]
export type TrackImage = Database["public"]["Tables"]["track_images"]["Row"]
export type TrackReview = Database["public"]["Tables"]["track_reviews"]["Row"]
export type Post = Database["public"]["Tables"]["posts"]["Row"]
export type Comment = Database["public"]["Tables"]["comments"]["Row"]
export type Discount = Database["public"]["Tables"]["discounts"]["Row"]
export type UserDiscount = Database["public"]["Tables"]["user_discounts"]["Row"]
export type ClubSubscription = Database["public"]["Tables"]["club_subscriptions"]["Row"]
export type Event = Database["public"]["Tables"]["events"]["Row"]
export type EventParticipant = Database["public"]["Tables"]["event_participants"]["Row"]
export type MarketplaceItem = Database["public"]["Tables"]["marketplace_items"]["Row"]
export type MarketplaceImage = Database["public"]["Tables"]["marketplace_images"]["Row"]
export type MarketplaceMessage = Database["public"]["Tables"]["marketplace_messages"]["Row"]
export type UserTrack = Database["public"]["Tables"]["user_tracks"]["Row"]
export type UserFollow = Database["public"]["Tables"]["user_follows"]["Row"]
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"]
export type UserPhoto = Database["public"]["Tables"]["user_photos"]["Row"]

// Define view types
export type TrackWithDetails = Database["public"]["Views"]["tracks_with_details"]["Row"]
export type MarketplaceItemWithImages = Database["public"]["Views"]["marketplace_items_with_images"]["Row"]
export type PostWithDetails = Database["public"]["Views"]["posts_with_details"]["Row"]
export type TrackReviewWithUser = Database["public"]["Views"]["track_reviews_with_user"]["Row"]

// Define function return types
export type UserConversation = Database["public"]["Functions"]["get_user_conversations"]["Returns"][0]

