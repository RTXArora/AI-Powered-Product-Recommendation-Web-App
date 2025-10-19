# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

# --- INITIALIZATION ---
load_dotenv()
app = FastAPI()

# --- CORS MIDDLEWARE ---
origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# --- LOAD MODELS AND DATA ---
print("Loading sentence transformer model...")
model = SentenceTransformer('clip-ViT-B-32')
print("Model loaded.")

print("Initializing Pinecone connection...")
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("products")
print("Pinecone connection successful.")

print("Loading product dataset...")
try:
    products_df = pd.read_csv('intern_data_ikarus.csv')
    products_df.set_index('uniq_id', inplace=True)
    print("Product dataset loaded.")
except FileNotFoundError:
    print("❌ ERROR: Product dataset CSV not found.")
    products_df = None

# --- PYDANTIC MODEL AND ENDPOINTS ---
class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

@app.post("/recommend")
def get_recommendations(request: QueryRequest):
    if products_df is None: return {"error": "Dataset not loaded."}

    query_embedding = model.encode(request.query).tolist()
    result = index.query(vector=query_embedding, top_k=request.top_k)
    matching_ids = [match['id'] for match in result['matches']]

    results_df = products_df.loc[matching_ids]
    results_df = results_df.where(pd.notnull(results_df), None)
    results_data = results_df.reset_index().to_dict(orient='records')

    # ⭐️ Using a stable placeholder for the GenAI description ⭐️
    for item in results_data:
        item['genai_description'] = f"This is a creative, AI-generated description for the product titled '{item['title']}'."

    return {"products": results_data}

@app.get("/analytics")
def get_analytics():
    if products_df is None:
        return {"error": "Dataset not loaded."}

    # --- Top Brands (no change) ---
    top_brands = products_df['brand'].value_counts().nlargest(10).reset_index()
    top_brands.columns = ['brand', 'count']

    # --- Popular Categories (UPDATED LOGIC) ---
    # Create a temporary copy to avoid changing the original DataFrame
    temp_df = products_df.copy()
    # Clean up the categories column - take only the first category
    temp_df['main_category'] = temp_df['categories'].apply(
        lambda x: x.strip("[]'").split("', '")[0] if pd.notnull(x) else 'Uncategorized'
    )
    category_counts = temp_df['main_category'].value_counts()
    popular_categories = category_counts[category_counts > 5].reset_index()
    popular_categories.columns = ['category', 'count']

    # Prepare data for JSON response
    analytics_data = {
        "top_brands": top_brands.to_dict(orient='records'),
        "popular_categories": popular_categories.to_dict(orient='records')
    }

    return analytics_data