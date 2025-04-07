import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getCategory } from '@/utils/categorizer.mjs';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  const url = new URL('https://newsapi.org/v2/top-headlines');
  url.searchParams.set('apiKey', NEWSAPI_KEY);
  url.searchParams.set('pageSize', '50');
  url.searchParams.set('country', 'us');
  if (query) {
    url.searchParams.set('q', query);
  }

  const resp = await fetch(url.toString());
  const json = await resp.json();
  const articlesFromAPI = json.articles || [];

  for (const { title, description, url: link, urlToImage, publishedAt } of articlesFromAPI) {
    // Combine title and description for classification context
    let category = await getCategory(title);

    const { error } = await supabase
      .from('articles')
      .upsert(
        { title, description, url: link, image_url: urlToImage, published_at: publishedAt, category },
        { onConflict: 'url' }
      );
  }

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, description, image_url, url, published_at, category')
    .ilike('title', `%${query}%`)
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ articles });
}