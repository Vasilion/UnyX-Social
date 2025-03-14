"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search } from "lucide-react"
import MarketplaceItemCard from "@/components/marketplace-item-card"
import { createClient } from "@/lib/supabase/client"
import type { MarketplaceItemWithImages } from "@/lib/database.types"

interface MarketplaceListProps {
  initialItems: MarketplaceItemWithImages[]
  initialError?: string
}

export default function MarketplaceList({ initialItems, initialError }: MarketplaceListProps) {
  const [items, setItems] = useState<MarketplaceItemWithImages[]>(initialItems)
  const [error, setError] = useState<string | undefined>(initialError)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter items based on search query
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle category change - using client-side Supabase instead of server actions
  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category)
    setIsLoading(true)

    try {
      const supabase = createClient()

      let query = supabase.from("marketplace_items_with_images").select("*").order("created_at", { ascending: false })

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (data) {
        setItems(data)
      }
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError("Failed to load items")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search for gear, bikes, parts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-[#B65FCF]/10 text-[#B65FCF]" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Gear">Gear</SelectItem>
                <SelectItem value="Bikes">Bikes</SelectItem>
                <SelectItem value="Parts">Parts</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Condition</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Like New">Like New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-100">$0 - $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000+">$5,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={handleCategoryChange}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Gear">Gear</TabsTrigger>
          <TabsTrigger value="Bikes">Bikes</TabsTrigger>
          <TabsTrigger value="Parts">Parts</TabsTrigger>
          <TabsTrigger value="Accessories">Accessories</TabsTrigger>
        </TabsList>

        {error ? (
          <div className="mt-6 text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>
        ) : isLoading ? (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mt-6 text-center p-10 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No items found. Try adjusting your search.</p>
          </div>
        ) : (
          <TabsContent value={activeCategory} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MarketplaceItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </>
  )
}

