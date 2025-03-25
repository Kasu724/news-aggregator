'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function UserMenu() {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  if (!user) {
    return <Link href="/auth" className="text-blue-600 hover:underline">Login / Sign Up</Link>
  }

  return (
    <div className="relative">
      <img
        src={user.user_metadata?.avatar_url ?? '/default-avatar.png'}
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
          <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}