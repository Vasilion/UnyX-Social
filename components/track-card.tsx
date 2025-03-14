import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface TrackCardProps {
  id: string
  name: string
  image: string
  rating: number
  reviewCount: number
  location: string
  description?: string
  compact?: boolean
}

export default function TrackCard({
  id,
  name,
  image,
  rating,
  reviewCount,
  location,
  description,
  compact = false,
}: TrackCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-black dark:text-white">{name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex items-center text-[#B65FCF]">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{location}</span>
        </div>

        {!compact && description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
        )}

        <div className="mt-3">
          {compact ? (
            <Link href={`/tracks/${id}`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
              >
                View Details
              </Button>
            </Link>
          ) : (
            <Link href={`/tracks/${id}/reviews`}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
              >
                Read Reviews
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

