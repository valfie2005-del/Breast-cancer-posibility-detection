
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
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({ ...initialForm });
    setResult("");
    setAlgorithm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setAlgorithm("");

    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          Number(value),
        ])
      );

      const API_URL = process.env.REACT_APP_API_URL;

      if (!API_URL) {
        throw new Error(
          "Backend URL is missing. Set REACT_APP_API_URL in Vercel."
        );
      }

      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      let data;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        throw new Error(
          `Backend returned non-JSON data (HTTP ${res.status}). ` +
          "Check the backend URL and Vercel logs."
        );
      }

      if (!res.ok) {
        throw new Error(
          data?.detail ||
          data?.error ||
          `Request failed: HTTP ${res.status}`
        );
      }

      if (!data || !data.prediction) {
        throw new Error(
          "Backend response is missing the prediction field."
        );
      }

      setResult(data.prediction);
      setAlgorithm(data.best_algorithm || "");
    } catch (err) {
      console.error("Prediction error:", err);
      setResult(
        `Error: ${err.message || "Could not fetch prediction"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>🩺 Mammo Assist</h1>

        <form onSubmit={handleSubmit} className="form-grid">
          {Object.keys(formData).map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>
                {key.replace(/_/g, " ")}
              </label>

              <input
                id={key}
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
            <button
              type="submit"
              className="btn predict"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="btn clear"
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading">
            ⏳ Predicting...
          </div>
        )}

        {!loading && result && (
          <div className="result-card">
            <p
              className={`prediction ${
                result.includes("Benign")
                  ? "benign"
                  : result.includes("Malignant")
                    ? "malignant"
                    : "error"
              }`}
            >
              {result}
            </p>

            {algorithm && (
              <p className="algorithm">
                Algorithm: {algorithm}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
