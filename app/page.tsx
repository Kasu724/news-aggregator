// Run with "npm run dev"

import Link from 'next/link'

type Article = {
  id: number
  title: string
  description: string | null
  image_url: string | null
  url: string
  category: string
}

export default async function HomePage({ searchParams }: { searchParams: { q?: string } }) {
  const params = await searchParams
  const qParam = params.q ?? ''
  const queryString = qParam ? `?q=${encodeURIComponent(qParam)}` : ''

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/articles${queryString}`)
  const { articles }: { articles: Article[] } = await res.json()

  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-x-5 gap-y-8 bg-gray-50">
      {articles.length === 0 ? (
        <p className="text-gray-600">No articles found.</p>
      ) : (
        articles.map(article => {
          let publisher = ""
          let trimmedTitle = article.title
          const dashIndex = trimmedTitle.lastIndexOf(' - ')
          if (dashIndex !== -1) {
            publisher = trimmedTitle.substring(dashIndex + 2).trim()
            trimmedTitle = trimmedTitle.substring(0, dashIndex).trim()
          }

          return (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="rounded-lg overflow-hidden transform hover:scale-105 hover:bg-gray-300 hover:shadow-2xl transition duration-100 flex flex-col"
            >
              <div className="w-full overflow-hidden rounded-lg aspect-[16/9] bg-gray-400 flex items-center justify-center">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/icons/photo.png"
                    alt="No image available"
                    className="w-1/4 h-auto object-cover"
                  />
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-lg/5.5 font-semibold line-clamp-3" title={trimmedTitle}>
                  {trimmedTitle}
                </h2>
                <p className="text-s text-gray-700 mt-1">{publisher}</p>
                <p className="text-s text-gray-700 mt-1"><strong>Category:</strong> {article.category}</p>
              </div>
            </Link>
          )
        })
      )}
    </section>
  )
}