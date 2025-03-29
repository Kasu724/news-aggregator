'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    router.push(`/results?search_query=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-1/3">
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow border rounded-l px-3 py-2"
      />
      <button type="submit" className="bg-black text-white px-4 rounded-r">
        Search
      </button>
    </form>
  )
}