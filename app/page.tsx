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
    <section className="min-h-screen grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-y-8 bg-gray-50">
      {articles.length === 0 ? (
        <p className="text-gray-600">No articles found.</p>
      ) : (
        articles.map(article => {
          // Extract publisher from URL
          const publisher = new URL(article.url).hostname.replace(/^www\./, '');
          
          // Trim the trailing " - Publisher" from the title, if it exists.
          let trimmedTitle = article.title;
          const dashIndex = trimmedTitle.lastIndexOf(' - ');
          if (dashIndex !== -1) {
            const possiblePublisher = trimmedTitle.slice(dashIndex + 3).trim();
            // Compare ignoring case
            if (possiblePublisher.toLowerCase() === publisher.toLowerCase()) {
              trimmedTitle = trimmedTitle.slice(0, dashIndex).trim();
            }
          }

          return (
            <Link
              key={article.id}
              href={article.url}
              target="_blank"
              className="w-90 h-80 rounded-lg overflow-hidden transform hover:scale-105 hover:bg-gray-200 hover:shadow-2xl transition duration-100 flex flex-col"
            >
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-50 rounded-lg object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg/5.5 font-semibold line-clamp-3" title={article.title}>
                  {trimmedTitle}
                </h2>
                <p className="text-s text-gray-700 mt-1">{publisher}</p>
              </div>
            </Link>
          );
        })
      )}
    </section>
  )
}