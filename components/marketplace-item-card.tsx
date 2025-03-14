import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import type { MarketplaceItemWithImages } from "@/lib/database.types"

interface MarketplaceItemCardProps {
  item: MarketplaceItemWithImages
}

export default function MarketplaceItemCard({ item }: MarketplaceItemCardProps) {
  // Map condition to color
  const conditionColor =
    {
      New: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Like New": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Good: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Fair: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }[item.condition] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"

  // Get primary image or first image
  const images = (item.images as any[]) || []
  const primaryImage = images.find((img) => img.is_primary) || images[0] || null
  const imageUrl = primaryImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${primaryImage.storage_path}`
    : "/placeholder.svg?height=400&width=400"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className={conditionColor}>
            {item.condition}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="font-normal">
            {item.category}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </span>
        </div>
        <h3 className="line-clamp-1 text-lg font-bold text-black dark:text-white">{item.title}</h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-bold text-[#B65FCF]">${item.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{item.location}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={item.avatar_url || "/placeholder.svg?height=32&width=32"}
                alt={item.username}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{item.username}</span>
          </div>
          <Link href={`/marketplace/${item.id}`}>
            <Button size="sm" className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white">
              View
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

