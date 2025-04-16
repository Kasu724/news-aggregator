from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from dotenv import load_dotenv
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "" 

# Load environment variables (for local testing; in Lambda, use Lambda's environment settings)
load_dotenv('./.env.local')

app = FastAPI(title="Classifier Service")

# Load the classifier model. Adjust device if you have a GPU.
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

# Use Mangum to adapt our FastAPI app for AWS Lambda
from mangum import Mangum
handler = Mangum(app)