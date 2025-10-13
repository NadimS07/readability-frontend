"use client";
import { useState } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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

  // ✂️ Copy report to clipboard
  const copyReport = () => {
    if (!result) return;
    const report = `
📊 Readability Summary

🧠 Overall Readability: ${result.summary.overall_readability}
🎓 Education Level: ${result.summary.education_level}
✍️ Sentence Complexity: ${result.summary.sentence_complexity}
💬 Word Simplicity: ${result.summary.word_simplicity}

Raw Scores:
Flesch: ${result.raw_scores.flesch_reading_ease.toFixed(2)}
Fog: ${result.raw_scores.gunning_fog_index.toFixed(2)}
SMOG: ${result.raw_scores.smog_index.toFixed(2)}
ARI: ${result.raw_scores.automated_readability_index.toFixed(2)}
Dale–Chall: ${result.raw_scores.dale_chall_score.toFixed(2)}
    `;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 📄 Generate PDF
  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("📊 Readability Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`🧠 Overall Readability: ${result.summary.overall_readability}`, 20, 40);
    doc.text(`🎓 Education Level: ${result.summary.education_level}`, 20, 50);
    doc.text(`✍️ Sentence Complexity: ${result.summary.sentence_complexity}`, 20, 60);
    doc.text(`💬 Word Simplicity: ${result.summary.word_simplicity}`, 20, 70);

    doc.setFontSize(14);
    doc.text("Raw Scores:", 20, 90);
    doc.setFontSize(12);
    doc.text(`Flesch: ${result.raw_scores.flesch_reading_ease.toFixed(2)}`, 20, 100);
    doc.text(`Fog: ${result.raw_scores.gunning_fog_index.toFixed(2)}`, 20, 110);
    doc.text(`SMOG: ${result.raw_scores.smog_index.toFixed(2)}`, 20, 120);
    doc.text(`ARI: ${result.raw_scores.automated_readability_index.toFixed(2)}`, 20, 130);
    doc.text(`Dale–Chall: ${result.raw_scores.dale_chall_score.toFixed(2)}`, 20, 140);

    doc.save("readability_report.pdf");
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

          {/* Action buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={copyReport}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              {copied ? "✅ Report Copied!" : "📋 Copy Report"}
            </button>

            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}