import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"

import UserMenu from "@/components/UserMenu"
import SearchBar from '@/components/SearchBar'
import LoadingBar from '@/components/LoadingBar'
import "./globals.css"


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "News Aggregator",
  description: "Personalized feed app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen`}>
        <LoadingBar />
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <Link href="/" className="text-2xl font-bold">News Aggregator</Link>
          <SearchBar />
          <UserMenu />
        </header>
        <main className="p-6 flex">
          {/* Left Sidebar */}
          <aside className="w-40 pr-5">
            <div className="sticky top-6">
              <Link 
                href="/" 
                className="text-lg/5.5 font-medium block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Recent
              </Link>
            </div>
          </aside>
          {/* Main Content */}
          <div className="flex-grow">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}