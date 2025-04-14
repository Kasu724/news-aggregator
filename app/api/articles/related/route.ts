import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  if (!category) {
    return NextResponse.json({ error: "Category not specified" }, { status: 400 });
  }

  // Fetch related articles in the given category
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, description, image_url, url, published_at, category')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles });
}