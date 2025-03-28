import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"
import UserMenu from "@/components/UserMenu"
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
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <Link href="/" className="text-2xl font-bold">News Aggregator</Link>
          <form action="/" method="get" className="flex w-1/3">
            <input
              name="q"
              type="text"
              placeholder="Search articles..."
              className="flex-grow border rounded-l px-3 py-2"
            />
            <button type="submit" className="bg-black text-white px-4 rounded-r">Search</button>
          </form>
          <UserMenu />
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}