from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import os

# Load environment variables if needed
from dotenv import load_dotenv
load_dotenv('./.env.local')

app = FastAPI(title="Classifier Service")

# Load the model using the Hugging Face Transformers pipeline.
# Setting device=-1 forces CPU usage (change to 0 if you have a GPU).
classifier = pipeline(
    "text-classification",
    model="classla/multilingual-IPTC-news-topic-classifier",
    device=-1,       # Change to 0 if you have a GPU available
    max_length=512,
    truncation=True
)

# Define a Pydantic model for the input
class TextInput(BaseModel):
    text: str

@app.post("/classify")
async def classify_text(input: TextInput):
    """
    Given input text, returns the predicted category label.
    """
    try:
        # Run text classification on the input text
        result = classifier(input.text)
        # Expecting a list of predictions; return the first one if available
        if result and isinstance(result, list) and "label" in result[0]:
            return {"category": result[0]["label"]}
        return {"category": "General"}
    except Exception as e:
        return {"error": str(e)}

# Root endpoint to check that service is working
@app.get("/")
async def root():
    return {"message": "Classifier service is running!"}