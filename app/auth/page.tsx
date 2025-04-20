'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailAuth = async () => {
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) return alert(error.message)
      alert('Account created! Check your inbox to confirm.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return alert(error.message)
      alert('Logged in!')
    }
  }

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
  }

  return (
    <div className="flex flex-col items-start justify-start bg-white px-10 py-7">


      <h1 className="flex space-x-10 mb-10">
        <button
          className={`px-4 py-2 cursor-pointer text-5xl ${mode === 'login' ? 'font-bold border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 cursor-pointer text-5xl ${mode === 'signup' ? 'font-bold border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setMode('signup')}
        >
          Create Account
        </button>
      </h1>

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-4 py-4 mb-8 w-full max-w-xl text-xl"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border rounded px-4 py-4 mb-10 w-full max-w-xl text-xl"
      />

      <button
        onClick={handleEmailAuth}
        className="w-full max-w-xl px-4 py-4 bg-black text-white rounded mb-4 text-xl"
      >
        {mode === 'login' ? 'Login' : 'Create Account'}
      </button>

      <div className="w-full max-w-xl text-center text-xl text-gray-500 mb-4">
        or
      </div>

      <button
        onClick={handleGoogleAuth}
        className="w-full max-w-xl px-4 py-4 border rounded flex justify-center items-center text-xl"
      >
        Continue with Google
      </button>
    </div>
  )
}