# app.py
# FastAPI Backend for Age Predictor
# Loads a scikit-learn model to predict age as of 31 March 2026

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import joblib
import os
import subprocess
import numpy as np

# Initialize FastAPI
app = FastAPI(title="Age Predictor API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model check and load
MODEL_PATH = "model.pkl"

def load_model():
    if not os.path.exists(MODEL_PATH):
        print("Model not found. Running model_train.py...")
        subprocess.run(["python3", "model_train.py"])
    return joblib.load(MODEL_PATH)

model = load_model()

# Request body schema
class PredictRequest(BaseModel):
    birth_year: int
    birth_month: int
    birth_day: int

@app.post("/predict")
async def predict(data: PredictRequest):
    try:
        # Prepare input for model
        features = np.array([[data.birth_year, data.birth_month, data.birth_day]])
        
        # Predict age
        prediction = model.predict(features)[0]
        
        # Simple confidence metric based on feature ranges (dummy implementation)
        confidence = 0.98 if 1950 <= data.birth_year <= 2026 else 0.85
        
        return {
            "prediction": f"{prediction:.1f} years",
            "confidence": float(confidence)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

# Serve React frontend if available
if os.path.exists("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)
