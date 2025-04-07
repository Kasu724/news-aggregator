import { InferenceClient } from "@huggingface/inference";
import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });


const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const inference = new InferenceClient(API_TOKEN);
const MODEL = 'classla/multilingual-IPTC-news-topic-classifier'

export async function getCategory(TEXT) {
  try {
      const result = await inference.textClassification({
        model: MODEL,
        inputs: TEXT,
        options: { wait_for_model: true },
      });
      // console.log("Classification result:", result[0].label, result[0].score);
      return result[0].label;
    } catch (error) {
      console.error("Error during inference:", error);
      return "General"; // Fallback category if classification fails
    }
}