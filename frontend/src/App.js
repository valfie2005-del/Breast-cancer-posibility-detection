import React, { useState } from "react";
import "./App.css";

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

function App() {
  const [formData, setFormData] = useState({ ...initialForm });
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
      // Configure REACT_APP_API_URL in Vercel.
      // Example: https://your-backend.vercel.app
      const configuredUrl = process.env.REACT_APP_API_URL?.trim();

      if (
        process.env.NODE_ENV === "production" &&
        !configuredUrl
      ) {
        throw new Error(
          "Backend API URL is missing. Configure REACT_APP_API_URL in Vercel."
        );
      }

      const API_URL = (
        configuredUrl || "http://127.0.0.1:8000"
      ).replace(/\/+$/, "");

      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          Number(value),
        ])
      );

      // Ensure all values are valid numbers.
      if (
        Object.values(formData).some(
          (value) => value.trim() === "" || !Number.isFinite(Number(value))
        )
      ) {
        throw new Error("Please enter valid numbers in every field.");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      let response;

      try {
        response = await fetch(`${API_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const responseText = await response.text();
      let data;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        throw new Error(
          `The backend returned an invalid response (HTTP ${response.status}). Check your backend URL and deployment logs.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.error ||
            `Request failed with HTTP ${response.status}.`
        );
      }

      if (!data || typeof data.prediction !== "string") {
        throw new Error(
          "The backend response does not contain a valid prediction."
        );
      }

      setResult(data.prediction);
      setAlgorithm(data.best_algorithm || "");
    } catch (err) {
      console.error("Prediction error:", err);

      let message = err.message || "Could not fetch prediction.";

      if (err.name === "AbortError") {
        message = "The request timed out. Please try again.";
      } else if (err instanceof TypeError) {
        message =
          "Failed to fetch. Check the backend URL, backend availability, and CORS settings.";
      }

      setResult(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>🩺 Mammo Assist</h1>

        <p>
          Enter the required measurements to obtain a model prediction.
        </p>

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
                disabled={loading}
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
          <div className="loading" role="status">
            ⏳ Predicting...
          </div>
        )}

        {!loading && result && (
          <div className="result-card" aria-live="polite">
            <p
              className={`prediction ${
                result.startsWith("Error:")
                  ? "error"
                  : result.includes("Benign")
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

        <p className="disclaimer">
          This tool provides a machine-learning prediction for
          educational purposes only. It is not a medical diagnosis
          and must not replace assessment by a qualified healthcare
          professional.
        </p>
      </div>
    </div>
  );
}

export default App;