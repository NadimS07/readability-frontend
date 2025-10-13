"use client";
import { useState } from "react";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://readability-backend-production.up.railway.app";

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeText() {
    if (!text.trim()) return alert("Please enter some text.");
    setLoading(true);
    setResult(null);
    setSummary("");

    try {
      const res = await fetch(`${backendURL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
      setSummary(generateSummary(data));
    } catch (err) {
      console.error("Error analyzing text:", err);
      setSummary("⚠️ Failed to fetch data from backend.");
    } finally {
      setLoading(false);
    }
  }

  function generateSummary(data) {
    const ease = data.flesch_reading_ease;
    let level = "";
    let message = "";

    if (ease > 80) level = "Very Easy (Grade 5 or below)";
    else if (ease > 60) level = "Fairly Easy (Middle School)";
    else if (ease > 40) level = "Moderate (High School)";
    else if (ease > 20) level = "Difficult (College)";
    else level = "Very Difficult (Advanced/Professional)";

    if (ease > 60) {
      message = "Your text is easy to read and suits a general audience.";
    } else if (ease > 40) {
      message = "Your text is moderately complex — good for educated readers.";
    } else if (ease > 20) {
      message =
        "Your text is quite challenging. It fits academic or professional readers.";
    } else {
      message =
        "Your text is very hard to read. Try shorter sentences and simpler words.";
    }

    return `🧠 Readability Level: ${level}. ${message}`;
  }

  return (
    <main className="min-h-screen p-8 flex flex-col items-center bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        📖 Readability Analyzer
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="6"
        placeholder="Paste your text here..."
        className="w-full max-w-2xl border rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={analyzeText}
        disabled={loading}
        className="mt-4 bg-blue-500 text-white font-medium py-2 px-6 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Analyze Text"}
      </button>

      {result && (
        <div className="mt-6 w-full max-w-2xl bg-white border rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            📊 Readability Results
          </h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>

          {summary && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-gray-800">
              {summary}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
