import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * getCategoryForText - Calls the Python classifier service to classify the given text.
 *
 * @param {string} text - The text to classify.
 * @returns {Promise<string>} - The predicted category, or "General" if classification fails.
 */
async function getCategoryForText(text) {
  try {
    const response = await fetch('http://localhost:8000/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Classifier service error: ' + response.statusText);
    }
    const result = await response.json();
    return result.category || "General";
  } catch (error) {
    console.error("Error calling classifier service:", error.message);
    return "General";
  }
}

/**
 * ingest - Fetches articles from NewsAPI, categorizes them using the classifier service,
 * and inserts new articles into the Supabase database while ignoring duplicates.
 */
async function ingest() {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${process.env.NEWSAPI_KEY}`
    );
    const json = await res.json();

    if (!json.articles) throw new Error('No articles returned from NewsAPI');

    for (const item of json.articles) {
      const { title, description, url, urlToImage, publishedAt } = item;
      // Combine title and description for classification context
      const fullText = title + (description ? ' ' + description : '');
      const category = await getCategoryForText(fullText);

      // Insert the article into Supabase
      // Using ignoreDuplicates: true ensures that if an article with the same URL already exists,
      // it will be skipped.
      const { error } = await supabase
        .from('articles')
        .insert(
          {
            title,
            description,
            url,
            image_url: urlToImage,
            published_at: publishedAt,
            category,
          },
          { ignoreDuplicates: true }
        );
      if (error) {
        console.error(`Insert error for "${title}":`, error.message);
      } else {
        console.log(`Inserted "${title}" as category: ${category}`);
      }
    }

    console.log('Ingestion complete!');
  } catch (err) {
    console.error('Error during ingestion:', err.message);
  }
}

// Schedule the ingestion to run periodically.
// For testing, this example runs every minute. For production, adjust the cron expression as needed.
cron.schedule('* * * * *', () => {
  console.log("Running scheduled ingestion...");
  ingest();
});