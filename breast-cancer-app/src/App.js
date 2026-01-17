import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    radius_mean: "",
    texture_mean: "",
    smoothness_mean: "",
    compactness_mean: "",
    concavity_mean: "",
    symmetry_mean: "",
    fractal_dimension_mean: "",
    area_mean: "",
    perimeter_mean: "",
    concave_points_mean: ""
  });
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    // Simulate loading for 2.5 seconds
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    Object.keys(formData).forEach(key => data[key] = parseFloat(formData[key]));
    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    setPrediction(result.prediction);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #000000, #001f7a)",
        color: "#00f0ff",
        fontFamily: "Arial, sans-serif"
      }}>
        <h1 style={{ marginBottom: "20px", fontSize: "2.5rem" }}>Mammo Assist</h1>
        <div style={{
          border: "6px solid #00f0ff",
          borderTop: "6px solid transparent",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          animation: "spin 1s linear infinite"
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", background: "#0b0b0b", minHeight: "100vh", color: "#00f0ff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Breast Cancer Prediction</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ margin: "12px 0" }}>
            <input
              type="number"
              step="any"
              name={key}
              placeholder={key}
              value={formData[key]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "2px solid #00f0ff",
                background: "#111",
                color: "#00f0ff",
                fontSize: "1rem"
              }}
            />
          </div>
        ))}
        <button type="submit" style={{
          width: "100%",
          padding: "12px",
          marginTop: "15px",
          background: "linear-gradient(135deg, #001f7a, #00f0ff)",
          color: "#fff",
          fontSize: "1.1rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onMouseOver={e => e.currentTarget.style.opacity = 0.8}
        onMouseOut={e => e.currentTarget.style.opacity = 1}
        >Predict</button>
      </form>
      {prediction && <h3 style={{ textAlign: "center", marginTop: "25px" }}>Prediction: {prediction}</h3>}
    </div>
  );
}

export default App;





