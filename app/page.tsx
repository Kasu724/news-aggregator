import Link from 'next/link'

type Article = {
  id: number
  title: string
  description: string | null
  image_url: string | null
  url: string
}

export default async function HomePage({ searchParams }: { searchParams: { q?: string } }) {
  const params = await searchParams
  const qParam = params.q ?? ''
  const queryString = qParam ? `?q=${encodeURIComponent(qParam)}` : ''

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/articles${queryString}`)
  const { articles }: { articles: Article[] } = await res.json()

  return (
    <section className="min-h-screen grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4 bg-gray-50">
      {articles.length === 0 ? (
        <p className="text-gray-600">No articles found.</p>
      ) : (
        articles.map(article => (
          <Link key={article.id} href={article.url} target="_blank" className="max-w-sm border rounded overflow-hidden shadow-sm hover:shadow-md">
            {article.image_url && (
              <img src={article.image_url} alt={article.title} className="w-full aspect-square object-cover" />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold line-clamp-3" title={article.title}>
                {article.title}
              </h2>
            </div>
          </Link>
        ))
      )}
    </section>
  )
}