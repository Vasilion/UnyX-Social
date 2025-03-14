"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Bell, LogOut, Menu, MessageSquare, Settings, User, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Get Supabase client
  const supabase = createClient()

  // Get user session on component mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)

        if (session?.user) {
          // Get user profile
          const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          setProfile(data)
        }
      } catch (error) {
        console.error("Error getting user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        // Get user profile
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(data)
      } else {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Tracks", href: "/tracks" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Community", href: "/community" },
    { name: "UnyX Club", href: "/club" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-extrabold tracking-tighter text-[#B65FCF] font-display">UnyX</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#B65FCF]",
                  pathname === link.href ? "text-[#B65FCF]" : "text-black dark:text-white",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <ThemeToggle />

          {isLoading ? (
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B65FCF] text-[10px] text-white">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-medium">Notifications</span>
                    <Button variant="ghost" size="sm" className="text-xs text-[#B65FCF]">
                      Mark all as read
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <p className="text-sm font-medium">New message from DirtDevil</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        "Hey, are you interested in my Fox helmet?"
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <p className="text-sm font-medium">MotoRider42 liked your review</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your review of Rattlesnake MX received a like
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <p className="text-sm font-medium">New Pro Rider Workshop event</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Exclusive UnyX Club event on March 15</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B65FCF] text-[10px] text-white">
                      2
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-4 py-2">
                    <span className="text-sm font-medium">Messages</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/marketplace/messages")}>
                    View all messages
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || "User"} />
                      <AvatarFallback>
                        {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.username || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              variant="default"
              className="bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white dark:text-black"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          {!isLoading && user && (
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || "User"} />
                <AvatarFallback>
                  {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-black dark:text-white">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#1A1A1A] md:hidden">
          <div className="container flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-extrabold tracking-tighter text-[#B65FCF] font-display">UnyX</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-black dark:text-white">
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center text-lg font-medium text-black dark:text-white hover:text-[#B65FCF]"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center text-lg font-medium text-black dark:text-white hover:text-[#B65FCF]"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center text-lg font-medium text-black dark:text-white hover:text-[#B65FCF]"
                  onClick={toggleMenu}
                >
                  Settings
                </Link>
                <Button
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button
                className="mt-4 w-full bg-[#B65FCF] hover:bg-[#B65FCF]/80 text-white dark:text-black"
                onClick={() => {
                  router.push("/auth/login")
                  toggleMenu()
                }}
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

