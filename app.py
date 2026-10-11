from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
from pathlib import Path

# 1️⃣ Create FastAPI app instance first
app = FastAPI()

# 2️⃣ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://127.0.0.1:3000",
                   "http://localhost:5173",
                   "http://127.0.0.1:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "best_model.pkl"

with MODEL_PATH.open("rb") as f:
    saved = pickle.load(f)

model = saved["model"]
scaler = saved["scaler"]

# 4️⃣ Define input data structure
class InputData(BaseModel):
    radius_mean: float
    texture_mean: float
    smoothness_mean: float
    compactness_mean: float
    concavity_mean: float
    symmetry_mean: float
    fractal_dimension_mean: float
    area_mean: float
    perimeter_mean: float
    concave_points_mean: float

# 5️⃣ Define prediction endpoint
@app.post("/predict")
def predict(data: InputData):
    features = np.array([[
        data.radius_mean,
        data.texture_mean,
        data.smoothness_mean,
        data.compactness_mean,
        data.concavity_mean,
        data.symmetry_mean,
        data.fractal_dimension_mean,
        data.area_mean,
        data.perimeter_mean,
        data.concave_points_mean
    ]])
    features = scaler.transform(features)
    prediction = model.predict(features)[0]
    result = "Malignant (Cancer)" if prediction == 1 else "Benign (No Cancer)"
    return {"prediction": result}


@app.get("/")
def root():
    return {"message": "Backend is running 🚀. Go to /docs to test /predict"}