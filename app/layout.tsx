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
        <header className="relative px-6 py-4 sticky top-0 bg-white z-10">
          <div className="absolute left-6 top-1/2 -translate-y-1/2">
            <Link href="/" className="text-2xl font-bold">
              <img
                src="/icons/mainIcon.png"
                alt="myNews Icon"
                className="h-12 w-auto mr-2 inline-block"
              />
              <img
                src="/icons/logo.png"
                alt="myNews logo"
                className="h-10 w-auto mr-2 inline-block mt-1"
              />
            </Link>
          </div>
          
          <div className="flex justify-center">
            <SearchBar />
          </div>
          
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <UserMenu />
          </div>
        </header>
        
        <main className="px-6 py-1 flex">
          {/* Left Sidebar */}
          <aside className="w-40 pr-5 shrink-0">
            <div className="sticky top-20">
              <Link 
                href="/" 
                className="text-lg font-medium block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Popular
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