import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import MarketplaceItemDetail from "./marketplace-item-detail"
import type { Database } from "@/lib/database.types"

interface MarketplaceItemPageProps {
  params: {
    id: string
  }
}

// Server-side data fetching function
async function getItemDetails(id: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    const { data: item, error } = await supabase.from("marketplace_items_with_images").select("*").eq("id", id).single()

    return { item, error: error?.message }
  } catch (error: any) {
    console.error("Error fetching marketplace item:", error)
    return { item: null, error: "Failed to load item details" }
  }
}

export default async function MarketplaceItemPage({ params }: MarketplaceItemPageProps) {
  const { item, error } = await getItemDetails(params.id)

  return (
    <div className="container py-8 px-4">
      <div className="mb-6">
        <Link href="/marketplace" className="inline-flex items-center text-[#B65FCF] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-10">Loading item details...</div>}>
        {error ? (
          <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>
        ) : item ? (
          <MarketplaceItemDetail item={item} />
        ) : (
          <div className="text-center p-10 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Item not found</p>
          </div>
        )}
      </Suspense>

      {item && (
        <>
          <Separator className="my-8" />

          <div className="mb-8">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Description</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Safety Tips</h2>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B65FCF]"></div>
                  Meet in a public place and inspect the item before purchasing
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B65FCF]"></div>
                  Never send money in advance or share personal financial information
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B65FCF]"></div>
                  Check for damage, wear, and proper functionality before completing the purchase
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#B65FCF]"></div>
                  For high-value items, consider meeting at a local police station's safe exchange zone
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Similar Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be dynamically populated with similar items */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

