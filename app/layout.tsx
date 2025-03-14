import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UnyX - Motocross Community",
  description: "Unite. Ride. Save. The ultimate motocross community app.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-white dark:bg-[#1A1A1A] relative">
            <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0">
              <div className="h-full w-full bg-[url('/tire-marks-light.svg')] dark:bg-[url('/tire-marks-dark.svg')] bg-repeat-y bg-contain"></div>
            </div>
            <Header />
            <main className="flex-1 z-10">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'