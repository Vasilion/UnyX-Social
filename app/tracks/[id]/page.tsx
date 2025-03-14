import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin, DollarSign, Wifi, ShowerHead, Coffee } from "lucide-react"
import ReviewCard from "@/components/review-card"

interface TrackDetailsPageProps {
  params: {
    id: string
  }
}

export default function TrackDetailsPage({ params }: TrackDetailsPageProps) {
  // This would normally be fetched from an API
  const track = {
    id: params.id,
    name: "Rattlesnake MX",
    rating: 4.8,
    reviewCount: 124,
    location: "Phoenix, AZ",
    difficulty: "Intermediate",
    hours: "8:00 AM - 6:00 PM",
    price: "$25 day pass",
    amenities: ["Wifi", "Showers", "Cafe"],
    description:
      "Killer jumps, all levels welcome. Great for beginners and pros alike with multiple track options. The main track features professional-grade jumps and berms, while the beginner track offers a more forgiving layout for those just starting out.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  }

  const reviews = [
    {
      username: "MotoRider42",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      date: "March 2, 2025",
      text: "Absolutely love this track! The jumps are perfectly built and the staff is super friendly. Will definitely be back soon.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      username: "DirtDevil",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4,
      date: "February 15, 2025",
      text: "Great track overall. The main section is challenging but fun. Only giving 4 stars because the parking area gets pretty muddy after rain.",
    },
    {
      username: "AirTime99",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      date: "January 28, 2025",
      text: "Best track in the area by far! The tabletops are perfect for practicing whips and the rhythm section is super technical. Love it!",
    },
  ]

  return (
    <div className="container py-8 px-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">{track.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center text-[#B65FCF]">
              <Star className="h-5 w-5 fill-current" />
              <span className="ml-1 font-medium">{track.rating}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">({track.reviewCount} reviews)</span>
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{track.location}</span>
          </div>
        </div>
        <Button className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white dark:text-black">Write a Review</Button>
      </div>

      {/* Gallery */}
      <div className="mb-8 overflow-hidden rounded-lg">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <div className="flex gap-2 overflow-x-auto snap-x">
            {track.images.map((image, index) => (
              <div key={index} className="min-w-full snap-center">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${track.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Info Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">About this Track</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{track.description}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B65FCF]/10 text-[#B65FCF]">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-black dark:text-white">Difficulty</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{track.difficulty}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B65FCF]/10 text-[#B65FCF]">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-black dark:text-white">Hours</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{track.hours}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B65FCF]/10 text-[#B65FCF]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-black dark:text-white">Location</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{track.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B65FCF]/10 text-[#B65FCF]">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-black dark:text-white">Price</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{track.price}</div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-black dark:text-white mt-6 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
              <Wifi className="h-3 w-3" />
              <span>Wifi</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
              <ShowerHead className="h-3 w-3" />
              <span>Showers</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
              <Coffee className="h-3 w-3" />
              <span>Cafe</span>
            </div>
          </div>

          {/* Reviews Section */}
          <h2 className="text-xl font-bold text-black dark:text-white mt-8 mb-4">Reviews</h2>
          <div className="space-y-1">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
          <div className="mt-6">
            <Link href={`/tracks/${params.id}/reviews`}>
              <Button
                variant="outline"
                className="w-full border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
              >
                See All Reviews
              </Button>
            </Link>
          </div>

          {/* Comment Box */}
          <div className="mt-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
            <h3 className="text-lg font-bold text-black dark:text-white mb-3">Leave a Review</h3>
            <textarea
              className="w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-3 text-black dark:text-white min-h-[100px] mb-3"
              placeholder="Share your experience..."
              disabled
            ></textarea>
            <Button
              className="bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              disabled
            >
              Login to Post Review
            </Button>
          </div>
        </div>

        {/* Map and Info Card */}
        <div>
          <div className="sticky top-20 space-y-6">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] overflow-hidden">
              <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <MapPin className="h-8 w-8" />
                  <span className="sr-only">Map</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-black dark:text-white mb-2">Location</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">123 Dirt Road, Phoenix, AZ 85001</p>
                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-4">
              <h3 className="font-bold text-black dark:text-white mb-2">Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Phone: (555) 123-4567</p>
                <p className="text-gray-500 dark:text-gray-400">Email: info@rattlesnakemx.com</p>
                <p className="text-gray-500 dark:text-gray-400">Website: rattlesnakemx.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

