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
    <form
      onSubmit={handleSubmit}
      className="flex w-1/3 mx-auto"
    >
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow border rounded-l-3xl px-3 py-2"
      />
      <button 
        type="submit"
        className="bg-gray-400 border px-4 rounded-r-3xl cursor-pointer">
          <img
            src="/icons/search.png"
            alt="Search Icon"
            className="h-6 w-auto mr-2 inline-block"
          />
      </button>
    </form>
  )
}