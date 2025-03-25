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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-3xl font-bold mb-6">{mode === 'login' ? 'Login' : 'Create Account'}</h1>

      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 ${mode === 'login' ? 'font-bold border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 ${mode === 'signup' ? 'font-bold border-b-2 border-black' : 'text-gray-500'}`}
          onClick={() => setMode('signup')}
        >
          Create Account
        </button>
      </div>

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-4 py-2 mb-4 w-full max-w-sm"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border rounded px-4 py-2 mb-6 w-full max-w-sm"
      />

      <button
        onClick={handleEmailAuth}
        className="w-full max-w-sm px-4 py-2 bg-black text-white rounded mb-4"
      >
        {mode === 'login' ? 'Login' : 'Create Account'}
      </button>

      <div className="text-sm text-gray-500 mb-4">or</div>

      <button
        onClick={handleGoogleAuth}
        className="w-full max-w-sm px-4 py-2 border rounded flex justify-center items-center"
      >
        Continue with Google
      </button>
    </div>
  )
}