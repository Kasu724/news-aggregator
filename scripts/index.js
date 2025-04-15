import dotenv from 'dotenv';
dotenv.config(); // AWS Lambda will use the Environment Variables from its settings instead of a file in production.

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * getCategoryForText - Calls your classifier service to get a category.
 * (This could be either your Python classifier service endpoint or
 * a direct method using the Hugging Face Inference API if you have credits.)
 */
async function getCategoryForText(text) {
  try {
    const response = await fetch('http://localhost:8000/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error("Classifier service error: " + response.statusText);
    }
    const result = await response.json();
    return result.category || "General";
  } catch (error) {
    console.error("Error calling classifier service:", error.message);
    return "General";
  }
}

/**
 * ingest - The main ingestion function that:
 * 1. Fetches articles from NewsAPI.
 * 2. Calls the classifier to determine the category.
 * 3. Upserts each article to Supabase.
 */
async function ingest() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${process.env.NEWSAPI_KEY}`
  );
  const json = await res.json();

  if (!json.articles) throw new Error('No articles returned from NewsAPI');

  for (const item of json.articles) {
    const { title, description, url, urlToImage, publishedAt } = item;
    // Combine title and description for classification
    const fullText = title + (description ? ' ' + description : '');
    const category = await getCategoryForText(fullText);
    const { error } = await supabase
      .from('articles')
      .upsert({
        title,
        description,
        url,
        image_url: urlToImage,
        published_at: publishedAt,
        category,
      }, { onConflict: 'url' });
    if (error) {
      console.error(`Upsert error for "${title}":`, error.message);
    } else {
      console.log(`Upserted "${title}" as category: ${category}`);
    }
  }

  console.log('Ingestion complete!');
}

/**
 * Lambda handler function: This is what AWS Lambda will invoke.
 */
export async function handler(event, context) {
  try {
    await ingest();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Ingestion complete!' })
    };
  } catch (error) {
    console.error('Error during ingestion:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ingestion failed: ' + error.message })
    };
  }
}