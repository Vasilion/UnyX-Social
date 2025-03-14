"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, MapIcon, List } from "lucide-react"
import TrackCard from "@/components/track-card"

export default function TracksPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  const tracks = [
    {
      id: "1",
      name: "Rattlesnake MX",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.8,
      reviewCount: 124,
      location: "Phoenix, AZ",
      description: "Killer jumps, all levels welcome. Great for beginners and pros alike.",
    },
    {
      id: "2",
      name: "Thunderbolt Valley",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.5,
      reviewCount: 89,
      location: "Denver, CO",
      description: "Technical track with challenging obstacles and beautiful mountain views.",
    },
    {
      id: "3",
      name: "Mudslinger's Paradise",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.7,
      reviewCount: 103,
      location: "Austin, TX",
      description: "Get dirty in the best mud track in Texas. Bring your waterproof gear!",
    },
    {
      id: "4",
      name: "Desert Dunes MX",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.3,
      reviewCount: 76,
      location: "Las Vegas, NV",
      description: "Sand track with massive jumps and fast straights. Not for the faint of heart.",
    },
    {
      id: "5",
      name: "Green Valley Circuit",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.6,
      reviewCount: 112,
      location: "Portland, OR",
      description: "Lush forest surroundings with a mix of technical sections and flow.",
    },
    {
      id: "6",
      name: "Rockstar Arena",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.9,
      reviewCount: 145,
      location: "Los Angeles, CA",
      description: "Pro-level supercross track where the champions train. Spectators welcome.",
    },
  ]

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-8">Discover Tracks</h1>

      {/* Search and Filters */}
      <div className="mb-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input placeholder="Search tracks..." className="pl-9 bg-transparent" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="any">Any Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing tracks near <strong>Current Location</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white" : ""}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
              className={viewMode === "map" ? "bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white" : ""}
            >
              <MapIcon className="h-4 w-4 mr-1" />
              Map
            </Button>
          </div>
        </div>
      </div>

      {/* Track List */}
      {viewMode === "list" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => (
            <TrackCard key={track.id} {...track} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 h-[600px] flex items-center justify-center">
          <div className="text-center">
            <MapIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Map View</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Map view is coming soon. Stay tuned!</p>
          </div>
        </div>
      )}
    </div>
  )
}

