# 🩺 Breast Cancer Risk Probability Detection

A full-stack machine learning web application that predicts whether a breast tumor is **malignant** or **benign** from numerical diagnostic measurements. The user enters tumor feature values in a React interface, a Python backend scales the input and runs it through a trained classifier, and the predicted result is shown back on screen.

> ⚠️ **Disclaimer:** This project is for educational and academic purposes only. It is **not** a medical device and must not be used for real diagnosis or treatment decisions. Always consult a qualified medical professional.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [What It Does](#-what-it-does)
3. [Tech Stack](#-tech-stack)
4. [Dataset](#-dataset)
5. [Project Structure](#-project-structure)
6. [How It Works](#-how-it-works)
7. [Input & Output](#-input--output)
8. [Installation & Setup](#-installation--setup)
9. [Environment Variables](#-environment-variables)
10. [Database](#-database)
11. [Authentication](#-authentication)
12. [Model Training & Evaluation](#-model-training--evaluation)
13. [Future Enhancements](#-future-enhancements)
14. [Author](#-author)
15. [License](#-license)

---

## 📌 Overview

Early detection of breast cancer greatly improves treatment outcomes. This project analyzes the well-known breast cancer diagnostic dataset, trains machine learning models to distinguish malignant from benign tumors, and exposes the best model through a web application so anyone can try predictions interactively.

The project has three parts:

- **Data analysis & model training** – EDA, preprocessing, feature scaling, model comparison.
- **Backend** – a Python API that loads the saved model and scaler and serves predictions.
- **Frontend** – a React app where the user enters values and sees the result.

---

## ✨ What It Does

- Accepts tumor measurements (radius, texture, perimeter, area, smoothness, etc.) from the user
- Scales the input with the same scaler used during training
- Predicts **Malignant** or **Benign** using the best-performing trained model
- Displays the result in a simple web UI
- Includes a training script so the model can be retrained on updated data

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | Python, JavaScript |
| ML / Data | NumPy, Pandas, Scikit-learn, Matplotlib, Seaborn |
| Backend | Python (`app.py`) with REST API |
| Frontend | React (Create React App) |
| Model storage | Pickle (`.pkl`) files |
| Environment | Google Colab (experiments), VS Code / PyCharm |
| Version control | Git & GitHub |

---

## 📂 Dataset

- **Source:** Kaggle – Breast Cancer (Wisconsin Diagnostic) Dataset
- **File:** `data.csv`
- **Type:** Structured medical data
- **Target variable:** `diagnosis` (M = Malignant, B = Benign)
- **Features:** 30 numeric features computed from digitized images of a fine needle aspirate (FNA) of a breast mass. For each of 10 base characteristics, the **mean**, **standard error**, and **worst** value are recorded:
  - Radius, texture, perimeter, area
  - Smoothness, compactness, concavity, concave points
  - Symmetry, fractal dimension

---

## 📁 Project Structure

```
Breast-cancer-possibility-detection/
│
├── app.py                  # Backend API – loads model + scaler and serves predictions
├── train_model.py          # Trains, evaluates and saves the models
├── data.csv                # Breast cancer dataset
├── model.pkl               # Trained model
├── best_model.pkl          # Best-performing model selected after evaluation
├── scaler.pkl              # Fitted scaler used to normalize inputs
│
├── frontend/               # React frontend (main UI)
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── ...
│   ├── src/
│   │   ├── App.js          # Main component (form + result display)
│   │   ├── App.css
│   │   ├── index.js
│   │   └── ...
│   └── package.json
│
├── package.json            # Root-level Node config
├── package-lock.json
├── .gitignore
└── README.md
```


---

## ⚙️ How It Works

```
┌──────────────┐   values    ┌──────────────┐  scale   ┌──────────────┐
│  React UI    │ ──────────► │  Backend     │ ───────► │ scaler.pkl   │
│ (user input) │             │  (app.py)    │          └──────┬───────┘
└──────▲───────┘             └──────────────┘                 │
       │                            │ scaled features         ▼
       │      prediction            ▼                  ┌──────────────┐
       └────────────────────  Malignant / Benign  ◄──── │ best_model   │
                                                        │   (.pkl)     │
                                                        └──────────────┘
```

1. The user fills in the tumor feature values in the React form.
2. The frontend sends the values to the backend as a JSON request.
3. The backend loads `scaler.pkl` and `best_model.pkl` and applies the same scaling used in training.
4. The model predicts the class (and probability, if enabled) and returns it as JSON.
5. The frontend shows the result: **Malignant** or **Benign**.

---

## 🔢 Input & Output

### Input

Numeric tumor measurements, in the same order as the training data. Example (subset shown):

| Feature | Example value |
|---|---|
| radius_mean | 17.99 |
| texture_mean | 10.38 |
| perimeter_mean | 122.8 |
| area_mean | 1001.0 |
| smoothness_mean | 0.1184 |
| compactness_mean | 0.2776 |
| concavity_mean | 0.3001 |
| ... | ... |

Example request body:

```json
{
  "features": [17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, "..."]
}
```

### Output

```json
{
  "prediction": "Malignant",
  "probability": 0.97
}
```

| Field | Meaning |
|---|---|
| `prediction` | `Malignant` or `Benign` |
| `probability` | Model confidence (if the chosen model supports probabilities) |

> 📝 Match the endpoint name, request keys and response keys above to what `app.py` actually uses (commonly `POST /predict`).

---

## 🚀 Installation & Setup

### Prerequisites

- Python 3.9+
- Node.js 18+ and npm
- Git

### 1. Backend setup

```bash
# create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# install dependencies
pip install numpy pandas scikit-learn matplotlib seaborn flask flask-cors joblib
```

> Tip: once everything works, run `pip freeze > requirements.txt` so others can install with `pip install -r requirements.txt`.

### 2. (Optional) Retrain the model

```bash
python train_model.py
```

This regenerates `model.pkl`, `best_model.pkl` and `scaler.pkl`.

### 3. Run the backend

```bash
python -m uvicorn app:app --reload
```

The API starts on `http://localhost:5000` (or the port set in `app.py`).

### 4. Run the frontend

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`.

---

## 🗄️ Database

**Currently: none.** The app is stateless. Each prediction is computed on the fly from the user's input and the saved `.pkl` files, and nothing is stored.

---

## 🔑 Authentication

**Current status:** No authentication. The prediction endpoint is open to anyone who can reach the server.

**Recommended improvements**

- [ ] User registration and login (JWT or session-based)
- [ ] Password hashing with bcrypt or Argon2
- [ ] Protect the `/predict` endpoint with token verification
- [ ] Role-based access (e.g., patient, doctor, admin)
- [ ] Rate limiting to prevent abuse
- [ ] Strict CORS configuration (allow only the frontend origin)
- [ ] Input validation and sanitization on the backend
- [ ] HTTPS in production
- [ ] Secrets stored in environment variables, never in code
- [ ] Audit logging and privacy handling, since this is medical-related data

---

## 📊 Model Training & Evaluation

**Workflow**

1. Data loading and inspection
2. Cleaning and preprocessing (drop unused columns, encode the target)
3. Exploratory data analysis (distributions, correlation heatmaps, malignant vs benign comparison)
4. Feature scaling (`scaler.pkl`)
5. Model building and comparison
6. Saving the best model (`best_model.pkl`)

**Models compared**

- Logistic Regression
- K-Nearest Neighbors (KNN)
- Decision Tree Classifier

**Metrics**

- Accuracy
- Precision
- Recall
- F1-score
- Confusion matrix

**Key insights**

- Radius, perimeter, area and concavity features strongly influence the diagnosis
- Malignant tumors show higher values and variance across several attributes
- Feature scaling noticeably improves performance for distance-based and margin-based models (KNN, SVM)

---

## 🔮 Future Enhancements

- Add Random Forest and XGBoost, plus hyperparameter tuning
- Cross-validation and a more thorough evaluation report
- Show feature importance or SHAP explanations for each prediction
- Add user authentication and prediction history
- Containerize with Docker
- Deploy the backend (Render / Railway) and frontend (Vercel / Netlify)
- Add automated tests and CI with GitHub Actions
- Consolidate to a single frontend folder

---

## 🧑‍💻 Author

**Alfithul Museliya S**
BSc Artificial Intelligence Student
Interested in Data Analytics, Machine Learning and MLOps

---

## 📜 License

This project is for educational and academic purposes only.
