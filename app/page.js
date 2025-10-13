"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendURL = "https://readability-backend-production.up.railway.app";

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-10 bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-700">
        🧠 Readability Analyzer
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Paste any paragraph below to check how easy or complex it is to read.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-2xl p-4 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows="6"
        placeholder="Enter your text here..."
      />

      <button
        onClick={analyzeText}
        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Text"}
      </button>

      {error && (
        <p className="text-red-600 mt-4 font-medium">{error}</p>
      )}

      {result && (
        <div className="mt-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 transition-all">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            📊 Readability Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <h3 className="text-blue-700 font-semibold text-lg">🧠 Overall Readability</h3>
              <p className="text-gray-700 text-md mt-1">
                {result.summary.overall_readability}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <h3 className="text-green-700 font-semibold text-lg">🎓 Education Level</h3>
              <p className="text-gray-700 text-md mt-1">
                {result.summary.education_level}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
              <h3 className="text-yellow-700 font-semibold text-lg">✍️ Sentence Complexity</h3>
              <p className="text-gray-700 text-md mt-1">
                {result.summary.sentence_complexity}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <h3 className="text-purple-700 font-semibold text-lg">💬 Word Simplicity</h3>
              <p className="text-gray-700 text-md mt-1">
                {result.summary.word_simplicity}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 text-sm text-gray-600">
            <p>
              🧾 <b>Flesch:</b> {result.raw_scores.flesch_reading_ease.toFixed(2)} | 
              <b> Fog:</b> {result.raw_scores.gunning_fog_index.toFixed(2)} | 
              <b> SMOG:</b> {result.raw_scores.smog_index.toFixed(2)} | 
              <b> ARI:</b> {result.raw_scores.automated_readability_index.toFixed(2)} | 
              <b> Dale–Chall:</b> {result.raw_scores.dale_chall_score.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-gray-600 text-sm">
        Built with ❤️ by{" "}
        <a
          href="https://github.com/NadimS07"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          Nadim Sheikh
        </a>{" "}
        | Powered by FastAPI + Next.js ⚡
      </footer>
    </main>
  );
}