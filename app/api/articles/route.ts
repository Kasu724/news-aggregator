import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

const NEWSAPI_KEY = process.env.NEWSAPI_KEY

async function fetchNews() {
  const resp = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${NEWSAPI_KEY}`
  )
  const json = await resp.json()
  return json.articles || []
}

export async function GET() {
  // 1️⃣ Fetch latest from NewsAPI
  const articlesFromAPI = await fetchNews()

  // 2️⃣ Upsert into Supabase
  for (const { title, description, url, urlToImage, publishedAt } of articlesFromAPI) {
    const { error } = await supabase
      .from('articles')
      .upsert(
        { title, description, url, image_url: urlToImage, published_at: publishedAt },
        { onConflict: 'url' }
      )
    if (error) console.error('Upsert error:', error.message)
  }

  // 3️⃣ Query Supabase for the most recent 50 articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, description, image_url, url, published_at')
    .order('published_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ articles })
}