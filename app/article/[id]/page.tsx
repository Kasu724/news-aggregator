import Link from 'next/link'
import { notFound } from 'next/navigation'

type Article = {
  id: number
  title: string
  description: string | null
  image_url: string | null
  url: string
  published_at?: string
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  // Await the params object before destructuring
  const { id } = await params

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  // Fetch the single article by ID from your API route
  const res = await fetch(`${base}/api/article?id=${id}`, { cache: 'no-store' })
  if (!res.ok) {
    return notFound()
  }

  const article: Article | null = await res.json()
  if (!article) {
    return notFound()
  }

  // Optional: Trim the trailing " - Publisher" from the title
  let publisher = ''
  let trimmedTitle = article.title
  const dashIndex = trimmedTitle.lastIndexOf(' - ')
  if (dashIndex !== -1) {
    publisher = trimmedTitle.substring(dashIndex + 2).trim()
    trimmedTitle = trimmedTitle.substring(0, dashIndex).trim()
  }

  return (
    <section className="min-h-screen p-6 bg-gray-50">
      {/* Top Row: Back button, Headline & Publisher */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          &lt; Back
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-1">{trimmedTitle}</h1>
          <p className="text-sm text-gray-500">{publisher}</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Image with Full Article Button */}
      <div className="relative w-full max-w-4xl mx-auto mb-4">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={trimmedTitle}
            className="w-full h-96 object-cover rounded"
          />
        ) : (
          <div className="w-full h-96 bg-gray-300 rounded" />
        )}
        <div className="absolute top-2 right-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            View Full Article
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto">
        {article.description ? (
          <p className="text-gray-800">{article.description}</p>
        ) : (
          <p className="text-gray-500 italic">No description available.</p>
        )}
      </div>
    </section>
  )
}