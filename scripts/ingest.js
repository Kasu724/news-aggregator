require('dotenv').config({ path: './.env.local' })
const fetch = require('node-fetch').default
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function ingest() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${process.env.NEWSAPI_KEY}`
  )
  const json = await res.json()

  if (!json.articles) throw new Error('No articles returned from NewsAPI')

  for (const item of json.articles) {
    const { title, description, url, urlToImage, publishedAt, category } = item
    await supabase
      .from('articles')
      .upsert(
        {
          title,
          description,
          url,
          image_url: urlToImage,
          published_at: publishedAt,
          category
        },
        { onConflict: 'url' }
      )
  }

  console.log('Ingestion complete!')
}

ingest().catch(err => {
  console.error('Error during ingestion:', err.message)
  process.exit(1)
})