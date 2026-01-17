import React, { useState } from "react";
import "./App.css";

function App() {
  const initialForm = {
    radius_mean: "",
    texture_mean: "",
    smoothness_mean: "",
    compactness_mean: "",
    concavity_mean: "",
    symmetry_mean: "",
    fractal_dimension_mean: "",
    area_mean: "",
    perimeter_mean: "",
    concave_points_mean: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData(initialForm);
    setResult("");
    setAlgorithm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setAlgorithm("");

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setAlgorithm(data.best_algorithm || "Algorithm Info Not Available");
      setResult(data.prediction);
    } catch (err) {
      console.error(err);
      setResult("⚠️ Error: Could not fetch prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>🩺 Mammo Assit</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          {Object.keys(formData).map((key) => (
            <div key={key} className="form-group">
              <label>{key.replace(/_/g, " ")}</label>
              <input
                type="number"
                step="any"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="btn-group">
            <button type="submit" className="btn predict">Predict</button>
            <button type="button" onClick={handleClear} className="btn clear">Clear</button>
          </div>
        </form>

        {loading && <div className="loading">⏳ Predicting...</div>}

        {!loading && result && (
          <div className="result-card">
            
            <p
              className={`prediction ${
                result.includes("Benign") ? "benign" : "malignant"
              }`}
            >
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;