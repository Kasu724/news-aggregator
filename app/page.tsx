import Link from 'next/link'

type Article = {
  id: number
  title: string
  description: string | null
  image_url: string | null
  url: string
}

export default async function HomePage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(new URL('/api/articles', base).toString())
  const { articles }: { articles: Article[] } = await res.json()

  return (
    <section className="min-h-screen grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-6 bg-gray-50">
      {articles.length === 0 ? (
        <p className="text-gray-600">No articles to display yet.</p>
      ) : (
        articles.map(article => (
          <Link
            key={article.id}
            href={article.url}
            target="_blank"
            className="max-w-sm border rounded overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full aspect-square object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{article.title}</h2>
              {article.description && (
                <p className="text-sm mt-2">{article.description}</p>
              )}
            </div>
          </Link>
        ))
      )}
    </section>
  )
}