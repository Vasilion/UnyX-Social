import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Edit, MapPin } from "lucide-react"
import ReviewCard from "@/components/review-card"

export default function ProfilePage() {
  // This would normally be fetched from an API
  const profile = {
    username: "DirtDevil",
    avatar: "/placeholder.svg?height=200&width=200",
    bio: "Chasing dust since '22",
    location: "Phoenix, AZ",
    stats: {
      tracksConquered: 15,
      reviews: 24,
      followers: 87,
      following: 42,
    },
    badges: [
      {
        name: "Trail Ripper",
        icon: "/placeholder.svg?height=50&width=50",
        description: "Completed 10+ different tracks",
      },
      {
        name: "Review Pro",
        icon: "/placeholder.svg?height=50&width=50",
        description: "Posted 20+ reviews",
      },
      {
        name: "Air Master",
        icon: "/placeholder.svg?height=50&width=50",
        description: "Shared 5+ jump photos",
      },
    ],
    reviews: [
      {
        username: "DirtDevil",
        avatar: "/placeholder.svg?height=100&width=100",
        rating: 4,
        date: "February 15, 2025",
        text: "Great track overall. The main section is challenging but fun. Only giving 4 stars because the parking area gets pretty muddy after rain.",
        trackName: "Rattlesnake MX",
      },
      {
        username: "DirtDevil",
        avatar: "/placeholder.svg?height=100&width=100",
        rating: 5,
        date: "January 10, 2025",
        text: "Absolutely perfect track! The jumps are well maintained and the staff is super friendly. Highly recommend to riders of all skill levels.",
        trackName: "Thunderbolt Valley",
      },
    ],
    photos: [
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
      "/placeholder.svg?height=300&width=300",
    ],
  }

  return (
    <div className="container py-8 px-4">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="relative">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#B65FCF]">
            <Image
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.username}
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">{profile.username}</h1>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{profile.bio}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
              <div className="text-2xl font-bold text-[#B65FCF]">{profile.stats.tracksConquered}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Tracks Conquered</div>
            </div>
            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
              <div className="text-2xl font-bold text-[#B65FCF]">{profile.stats.reviews}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Reviews</div>
            </div>
            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
              <div className="text-2xl font-bold text-[#B65FCF]">{profile.stats.followers}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
            </div>
            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
              <div className="text-2xl font-bold text-[#B65FCF]">{profile.stats.following}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {profile.badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B65FCF]/10">
                <Award className="h-6 w-6 text-[#B65FCF]" />
              </div>
              <div>
                <h3 className="font-medium text-black dark:text-white">{badge.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs for Reviews and Photos */}
      <Tabs defaultValue="reviews" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="space-y-6">
          {profile.reviews.map((review, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-4"
            >
              <div className="mb-2 text-sm font-medium text-[#B65FCF]">
                <Link href="#">{review.trackName}</Link>
              </div>
              <ReviewCard {...review} compact />
            </div>
          ))}
          <Button
            variant="outline"
            className="w-full border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
          >
            View All Reviews
          </Button>
        </TabsContent>
        <TabsContent value="photos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.photos.map((photo, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-6 border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
          >
            View All Photos
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}

