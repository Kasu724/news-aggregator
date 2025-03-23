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
  console.log('Using base URL:', base)

  const res = await fetch(new URL('/api/articles', base).toString())
  const { articles }: { articles: Article[] } = await res.json()

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News Aggregator</h1>
        <Link href="/auth" className="text-blue-600 hover:underline">
          Login / Sign Up
        </Link>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {articles.length === 0 ? (
          <p className="text-gray-600">No articles to display yet.</p>
        ) : (
          articles.map(article => (
            <Link key={article.id} href={article.url} target="_blank" className="border rounded overflow-hidden shadow-sm hover:shadow-md">
              {article.image_url && <img src={article.image_url} alt={article.title} className="w-full aspect-square object-cover" />}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{article.title}</h2>
                {article.description && <p className="text-sm mt-2">{article.description}</p>}
              </div>
            </Link>
          ))
        )}
      </section>
    </main>
  )
}