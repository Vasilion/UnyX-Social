import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] py-6 z-10">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} UnyX. All rights reserved.
          </span>
        </div>
        <nav className="flex gap-6">
          <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#FF6200] transition-colors">
            About
          </Link>
          <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#FF6200] transition-colors">
            Contact
          </Link>
          <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#FF6200] transition-colors">
            Terms
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#FF6200]">
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#FF6200]">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-[#FF6200]">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

