import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface ReviewCardProps {
  username: string
  avatar: string
  rating: number
  date: string
  text: string
  image?: string
  compact?: boolean
}

export default function ReviewCard({ username, avatar, rating, date, text, image, compact = false }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 py-4 last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-black dark:text-white">{username}</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? "text-[#B65FCF] fill-[#B65FCF]" : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className={`mt-2 text-gray-600 dark:text-gray-300 ${compact ? "line-clamp-2" : ""}`}>{text}</p>

          {image && !compact && (
            <div className="mt-3 relative h-24 w-24 overflow-hidden rounded-md">
              <img src={image || "/placeholder.svg"} alt="Review" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

