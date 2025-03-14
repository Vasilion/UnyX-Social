"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface DiscountCardProps {
  vendor: string
  logo: string
  offer: string
  code: string
}

export default function DiscountCard({ vendor, logo, offer, code }: DiscountCardProps) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
          <Image src={logo || "/placeholder.svg"} alt={vendor} fill className="object-contain p-1" />
        </div>
        <h3 className="font-bold text-black dark:text-white">{vendor}</h3>
      </div>
      <p className="text-lg font-medium text-[#B65FCF] mb-3">{offer}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-2 font-mono text-sm">{code}</div>
        <Button size="sm" className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white" onClick={copyCode}>
          {copied ? "Copied!" : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

