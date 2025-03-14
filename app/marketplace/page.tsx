import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import MarketplaceList from "./marketplace-list"
import type { Database } from "@/lib/database.types"

// Server-side data fetching function
async function getInitialItems() {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    const { data, error } = await supabase
      .from("marketplace_items_with_images")
      .select("*")
      .order("created_at", { ascending: false })

    return { items: data || [], error: error?.message }
  } catch (error: any) {
    console.error("Error fetching marketplace items:", error)
    return { items: [], error: "Failed to load marketplace items" }
  }
}

export default async function MarketplacePage() {
  // Fetch initial data server-side
  const { items, error } = await getInitialItems()

  return (
    <div className="container py-8 px-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Rider Marketplace</h1>
        <Link href="/marketplace/sell">
          <Button className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Sell Item
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-10">Loading marketplace items...</div>}>
        <MarketplaceList initialItems={items} initialError={error} />
      </Suspense>
    </div>
  )
}

