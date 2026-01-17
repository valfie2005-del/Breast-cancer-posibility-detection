import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
data = pd.read_csv("data.csv")  # make sure you have the dataset here

# Select features & target
X = data[[
    "radius_mean", 
    "texture_mean", 
    "smoothness_mean", 
    "compactness_mean",
    "concavity_mean", 
    "symmetry_mean", 
    "fractal_dimension_mean",
    "area_mean", 
    "perimeter_mean", 
    "concave_points_mean"   # <-- use space instead of underscore
]]

y = data["diagnosis"].map({"M": 1, "B": 0})  # Convert labels

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train models
models = {
    "KNN": KNeighborsClassifier(),
    "LogisticRegression": LogisticRegression(max_iter=1000),
    "RandomForest": RandomForestClassifier()
}

best_model = None
best_acc = 0

for name, clf in models.items():
    clf.fit(X_train, y_train)
    acc = clf.score(X_test, y_test)
    print(f"{name} Accuracy: {acc:.4f}")
    if acc > best_acc:
        best_model = clf
        best_acc = acc

print(f"\nBest Model: {best_model.__class__.__name__} with accuracy {best_acc:.4f}")

# Save the best model + scaler
with open("best_model.pkl", "wb") as f:
    pickle.dump({"model": best_model, "scaler": scaler}, f)

print("✅ Model saved as best_model.pkl")
