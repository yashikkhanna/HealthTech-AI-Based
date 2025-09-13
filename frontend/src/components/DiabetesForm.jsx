import React, { useState } from "react";
import axios from "axios";

const DiabetesForm = () => {
  const [features, setFeatures] = useState(Array(8).fill(""));
  const [result, setResult] = useState(null);

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        features: features.map(Number)
      });
      setResult(response.data.prediction === 1 ? "Diabetic" : "Non-Diabetic");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Diabetes Prediction</h2>
      {features.map((f, i) => (
        <input
          key={i}
          type="number"
          value={f}
          placeholder={`Feature ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          style={{ display: "block", margin: "8px 0" }}
        />
      ))}
      <button onClick={handleSubmit}>Predict</button>
      {result && <h3>Prediction: {result}</h3>}
    </div>
  );
};

export default DiabetesForm;
