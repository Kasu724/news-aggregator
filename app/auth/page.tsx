'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')

  const signInWithEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Check your inbox for the login link!')
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Login / Sign Up</h1>
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-3 py-2 mb-4 w-full max-w-sm"
      />
      <button onClick={signInWithEmail} className="mb-2 px-4 py-2 bg-blue-600 text-white rounded">
        Sign in via Magic Link
      </button>
      <button onClick={signInWithGoogle} className="px-4 py-2 bg-red-600 text-white rounded">
        Sign in with Google
      </button>
    </div>
  )
}