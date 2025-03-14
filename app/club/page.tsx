"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, ChevronRight, Crown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import DiscountCard from "@/components/discount-card"

export default function ClubPage() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  const toggleSubscription = () => {
    setIsSubscribed(!isSubscribed)
  }

  const discounts = [
    {
      vendor: "MotoSport.com",
      logo: "/placeholder.svg?height=100&width=100",
      offer: "10% off + Free Shipping",
      code: "UNYX10",
    },
    {
      vendor: "Fox Racing",
      logo: "/placeholder.svg?height=100&width=100",
      offer: "15% off Helmets",
      code: "UNYXFOX15",
    },
    {
      vendor: "Dirt Bike Supply",
      logo: "/placeholder.svg?height=100&width=100",
      offer: "20% off First Order",
      code: "UNYX20",
    },
  ]

  const benefits = [
    "Exclusive discounts from top gear brands",
    "Early access to new track listings",
    "Premium badge on your profile",
    "Monthly gear giveaways",
    "Access to members-only events",
  ]

  return (
    <div className="container py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-2">UnyX Club</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Join our premium membership to unlock exclusive discounts, early access to new tracks, and more.
      </p>

      {!isSubscribed ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B65FCF]">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-black dark:text-white">UnyX Club Benefits</h2>
              </div>
              <ul className="space-y-3 mb-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#FF6200] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Subscription</div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    $9.99<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white"
                  onClick={toggleSubscription}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-black dark:text-white mb-1">Can I cancel my subscription anytime?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Yes, you can cancel your subscription at any time. Your benefits will remain active until the end of
                    your billing period.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-black dark:text-white mb-1">How do I use the discount codes?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Simply copy the code and paste it at checkout on the partner website. The discount will be applied
                    automatically.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-black dark:text-white mb-1">Are there any commitments?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    No long-term commitments. UnyX Club is a month-to-month subscription that you can cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-6 mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">Preview Discounts</h2>
              <div className="space-y-4">
                {discounts.slice(0, 1).map((discount, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={discount.logo || "/placeholder.svg"}
                          alt={discount.vendor}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <h3 className="font-medium text-black dark:text-white">{discount.vendor}</h3>
                    </div>
                    <p className="text-[#FF6200] font-medium mb-2">{discount.offer}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-2 font-mono text-sm text-gray-400">
                        ••••••••
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white"
                        disabled
                      >
                        <Crown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 text-center">
                      <Button variant="link" className="text-[#B65FCF]" onClick={toggleSubscription}>
                        Subscribe to Unlock <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Plus {discounts.length - 1} more exclusive discounts!
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#B65FCF] bg-[#B65FCF]/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B65FCF]">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-black dark:text-white">Member Testimonials</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg bg-white dark:bg-[#2A2A2A] p-4">
                  <p className="text-gray-600 dark:text-gray-300 italic mb-2">
                    "I saved over $200 on new gear in my first month of membership. UnyX Club pays for itself!"
                  </p>
                  <div className="text-sm font-medium text-black dark:text-white">- Mike R., UnyX Club Member</div>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#2A2A2A] p-4">
                  <p className="text-gray-600 dark:text-gray-300 italic mb-2">
                    "The member events are awesome! I've met so many fellow riders and learned a ton of new techniques."
                  </p>
                  <div className="text-sm font-medium text-black dark:text-white">- Sarah T., UnyX Club Member</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Alert className="mb-6 border-[#B65FCF] bg-[#B65FCF]/10">
            <CheckCircle2 className="h-4 w-4 text-[#B65FCF]" />
            <AlertTitle className="text-[#B65FCF]">Subscription Active</AlertTitle>
            <AlertDescription>Welcome to UnyX Club! Your premium membership is now active.</AlertDescription>
          </Alert>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B65FCF]">
                <Crown className="h-5 w-5 text-white dark:text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black dark:text-white">Welcome to UnyX Club</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Next billing: April 8, 2025</p>
              </div>
              <Button variant="link" className="ml-auto text-[#B65FCF]">
                Manage Subscription
              </Button>
            </div>

            <Alert className="mb-6 border-[#B65FCF] bg-[#B65FCF]/10">
              <AlertCircle className="h-4 w-4 text-[#B65FCF]" />
              <AlertTitle className="text-[#B65FCF]">Flash Sale Alert!</AlertTitle>
              <AlertDescription>20% off Fox Racing ends in 48 hours! Use code UNYXFOX20 at checkout.</AlertDescription>
            </Alert>

            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Your Exclusive Discounts</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {discounts.map((discount, index) => (
                <DiscountCard key={index} {...discount} />
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Upcoming Member Events</h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
                  <div className="text-sm text-[#B65FCF] mb-1">March 15, 2025</div>
                  <h4 className="font-medium text-black dark:text-white mb-1">Pro Rider Workshop</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Learn advanced techniques from professional riders at Rattlesnake MX.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
                  >
                    RSVP Now
                  </Button>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
                  <div className="text-sm text-[#B65FCF] mb-1">April 2, 2025</div>
                  <h4 className="font-medium text-black dark:text-white mb-1">Night Ride Meetup</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Join fellow UnyX members for an exclusive night riding session.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
                  >
                    RSVP Now
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2A2A2A] p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Monthly Gear Giveaway</h3>
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                <Image src="/placeholder.svg?height=300&width=500" alt="Gear giveaway" fill className="object-cover" />
              </div>
              <h4 className="font-medium text-black dark:text-white mb-2">Win a Fox Racing Helmet!</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                This month we're giving away a brand new Fox Racing V3 RS helmet to one lucky UnyX Club member.
              </p>
              <Button className="w-full bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white dark:text-black">
                Enter Giveaway
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="border-[#B65FCF] text-[#B65FCF] hover:bg-[#B65FCF] hover:text-white dark:hover:text-black"
              onClick={toggleSubscription}
            >
              Preview Non-Member View
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

