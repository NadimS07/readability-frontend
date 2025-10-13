"use client";
import React, { useState } from "react";

const backendURL = "https://readability-backend-production.up.railway.app"; // your backend

async function analyzeText(text) {
  const response = await fetch(`${backendURL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  const data = await response.json();
  return data;
}

export default function Page() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    const data = await analyzeText(input);
    setResult(data);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Readability Analyzer</h1>
      <textarea
        style={{ width: "100%", height: "120px", marginTop: "1rem" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        style={{
          marginTop: "1rem",
          padding: "0.6rem 1.2rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleAnalyze}
      >
        Analyze Text
      </button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
