import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // Only select articles from the database
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