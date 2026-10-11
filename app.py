from pathlib import Path
import pickle

import numpy as np
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://breast-cancer-posibility-detection.vercel.app",
    ],
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


router = APIRouter()


@router.post("/predict")
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
        data.concave_points_mean,
    ]])
    features = scaler.transform(features)
    prediction = model.predict(features)[0]
    result = "Malignant (Cancer)" if prediction == 1 else "Benign (No Cancer)"
    return {"prediction": result}


@router.get("/")
def root():
    return {"message": "Backend is running 🚀. Go to /docs to test /predict"}


# Works whether Vercel keeps or strips the /api prefix
app.include_router(router)
app.include_router(router, prefix="/api")