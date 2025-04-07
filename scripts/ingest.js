import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import { InferenceClient } from '@huggingface/inference';

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Initialize the Hugging Face Inference client with your API token
const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const inference = new InferenceClient(API_TOKEN);
const MODEL = 'classla/multilingual-IPTC-news-topic-classifier';

/**
 * classifyText - Given a text input, uses the Hugging Face Inference API
 * to classify the text and returns the predicted category label.
 *
 * @param {string} text - The text to classify.
 * @returns {Promise<string>} - The predicted category label.
 */
async function classifyText(text) {
  try {
    const result = await inference.textClassification({
      model: MODEL,
      inputs: text,
      options: { wait_for_model: true },
    });
    // Assuming result is an array with at least one object containing 'label'
    return result[0].label;
  } catch (error) {
    console.error("Error during inference:", error);
    return "General"; // Fallback category if classification fails
  }
}

async function ingest() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${process.env.NEWSAPI_KEY}`
  );
  const json = await res.json();

  if (!json.articles) throw new Error('No articles returned from NewsAPI');

  for (const item of json.articles) {
    const { title, description, url, urlToImage, publishedAt } = item;
    // Combine title and description for better context
    const fullText = title + (description ? ' ' + description : '');
    const category = await classifyText(fullText);
    
    const { error } = await supabase
      .from('articles')
      .upsert(
        {
          title,
          description,
          url,
          image_url: urlToImage,
          published_at: publishedAt,
          category,
        },
        { onConflict: 'url' }
      );
    if (error) {
      console.error(`Upsert error for "${title}":`, error.message);
    } else {
      console.log(`Upserted "${title}" as category: ${category}`);
    }
  }

  console.log('Ingestion complete!');
}

ingest().catch(err => {
  console.error('Error during ingestion:', err.message);
  process.exit(1);
});