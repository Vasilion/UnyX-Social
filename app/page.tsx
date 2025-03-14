import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TrackCard from "@/components/track-card"

export default function Home() {
  const featuredTracks = [
    {
      id: "1",
      name: "Rattlesnake MX",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.8,
      reviewCount: 124,
      location: "Phoenix, AZ",
    },
    {
      id: "2",
      name: "Thunderbolt Valley",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.5,
      reviewCount: 89,
      location: "Denver, CO",
    },
    {
      id: "3",
      name: "Mudslinger's Paradise",
      image: "/placeholder.svg?height=300&width=500",
      rating: 4.7,
      reviewCount: 103,
      location: "Austin, TX",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Motocross rider in action"
          fill
          className="object-cover"
          priority
        />
        <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-4 font-display">
            Unite. Ride. <span className="text-[#B65FCF]">Save.</span>
          </h1>
          <p className="max-w-md text-lg text-gray-200 mb-8">
            Join the ultimate motocross community to discover epic tracks, share your experiences, and unlock exclusive
            gear discounts.
          </p>
          <Button size="lg" className="rounded-full bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white px-8">
            <Link href="/club">Join UnyX Club</Link>
          </Button>
        </div>
      </section>

      {/* Featured Tracks */}
      <section className="py-12 md:py-16">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white mb-8">
            Featured Tracks
          </h2>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
              {featuredTracks.map((track) => (
                <div key={track.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                  <TrackCard {...track} compact />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-[#2A2A2A]">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white mb-4">
                Join the <span className="text-[#B65FCF]">UnyX</span> Community
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connect with fellow riders, share your experiences, and discover the best tracks in your area. UnyX
                brings the motocross community together like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white">Sign Up Now</Button>
                <Button
                  variant="outline"
                  className="border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Motocross community"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* UnyX Club Teaser */}
      <section className="py-12 md:py-16 bg-[#B65FCF]/10">
        <div className="container px-4 text-center">
          <div className="inline-block mb-4 rounded-full bg-[#B65FCF]/20 px-4 py-1.5">
            <span className="text-sm font-medium text-[#B65FCF]">Premium Membership</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white mb-4">
            Unlock Exclusive Gear Discounts
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 mb-8">
            Join UnyX Club to access exclusive discounts from top motocross gear brands. Save on everything from helmets
            to boots, and keep your ride looking fresh.
          </p>
          <Button size="lg" className="rounded-full bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white px-8">
            <Link href="/club">Join UnyX Club</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

