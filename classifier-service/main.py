# Run with "cd classifier-service; . .\venv\Scripts\Activate.ps1; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from dotenv import load_dotenv
import os

load_dotenv('./.env.local')
app = FastAPI(title="Classifier Service")

# Load  classifier model
classifier = pipeline(
    "text-classification",
    model="classla/multilingual-IPTC-news-topic-classifier",
    device=-1,  # Use CPU (set to 0 for GPU)
    max_length=512,
    truncation=True
)

# Define the payload model
class TextInput(BaseModel):
    text: str

@app.post("/classify")
async def classify_text(input: TextInput):
    try:
        result = classifier(input.text)
        if result and isinstance(result, list) and "label" in result[0]:
            return {"category": result[0]["label"]}
        return {"category": "General"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Classifier service is running!"}