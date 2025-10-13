"use client";
import { useState } from "react";
import jsPDF from "jspdf";

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

      if (!res.ok) throw new Error("Failed to analyze text");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    if (!result) return;
    const summary = result.summary;
    const report = `
Readability Summary
---------------------
Overall Readability: ${summary.overall_readability}
Education Level: ${summary.education_level}
Sentence Complexity: ${summary.sentence_complexity}
Word Simplicity: ${summary.word_simplicity}

Insight:
${summary.insight}

Suggestion:
${summary.suggestion}
`;
    navigator.clipboard.writeText(report);
    alert("Report copied to clipboard!");
  };

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const summary = result.summary;
    const scores = result.raw_scores;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Readability Analysis Report", 14, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Summary", 14, 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const summaryLines = [
      `Overall Readability: ${summary.overall_readability}`,
      `Education Level: ${summary.education_level}`,
      `Sentence Complexity: ${summary.sentence_complexity}`,
      `Word Simplicity: ${summary.word_simplicity}`,
    ];
    doc.text(summaryLines, 14, 45);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Insight", 14, 75);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(summary.insight, 180), 14, 85);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Suggestion", 14, 110);
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(summary.suggestion, 180), 14, 120);

    doc.save("Readability_Report.pdf");
  };

  const getScoreColor = (value, metric) => {
    if (metric === "flesch_reading_ease") {
      if (value > 80) return "bg-green-100 text-green-900";
      if (value > 50) return "bg-yellow-100 text-yellow-900";
      return "bg-red-100 text-red-900";
    } else {
      if (value < 8) return "bg-green-100 text-green-900";
      if (value < 12) return "bg-yellow-100 text-yellow-900";
      return "bg-red-100 text-red-900";
    }
  };

  const getBarWidth = (value, metric) => {
    if (metric === "flesch_reading_ease") return `${Math.min(value, 100)}%`;
    return `${Math.min((20 - value) * 5, 100)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-indigo-50 to-gray-200 flex flex-col items-center py-10 px-4">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-3 drop-shadow-sm">
          Readability Analyzer
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Instantly measure the clarity, complexity, and readability of your
          text with AI-powered analysis.
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-4xl backdrop-blur-xl bg-white/70 border border-gray-200 shadow-lg rounded-2xl p-6">
        <textarea
          className="w-full h-52 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white resize-none"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <div className="flex justify-center mt-6">
          <button
            onClick={analyzeText}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Results Section */}
      {result && (
        <div className="mt-12 w-full max-w-5xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
            Readability Summary
          </h2>

          {/* Summary Flash Cards */}
          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-gray-50 shadow-md rounded-xl p-4 hover:shadow-lg transition-all">
              <h3 className="font-bold text-black text-lg">
                Overall Readability
              </h3>
              <p className="text-gray-700 text-base mt-1">
                {result.summary.overall_readability}
              </p>
            </div>

            <div className="bg-gray-50 shadow-md rounded-xl p-4 hover:shadow-lg transition-all">
              <h3 className="font-bold text-black text-lg">Education Level</h3>
              <p className="text-gray-700 text-base mt-1">
                {result.summary.education_level}
              </p>
            </div>

            <div className="bg-gray-50 shadow-md rounded-xl p-4 hover:shadow-lg transition-all">
              <h3 className="font-bold text-black text-lg">
                Sentence Complexity
              </h3>
              <p className="text-gray-700 text-base mt-1">
                {result.summary.sentence_complexity}
              </p>
            </div>

            <div className="bg-gray-50 shadow-md rounded-xl p-4 hover:shadow-lg transition-all">
              <h3 className="font-bold text-black text-lg">Word Simplicity</h3>
              <p className="text-gray-700 text-base mt-1">
                {result.summary.word_simplicity}
              </p>
            </div>
          </div>

          {/* Insight and Suggestion */}
          <div className="bg-indigo-50 rounded-xl p-5 mb-6 shadow-inner">
            <h3 className="text-lg font-bold text-black mb-1">Insight</h3>
            <p className="text-gray-700 italic">{result.summary.insight}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-5 shadow-inner">
            <h3 className="text-lg font-bold text-black mb-1">Suggestion</h3>
            <p className="text-gray-700 italic">{result.summary.suggestion}</p>
          </div>

          {/* Metric Cards */}
          <h3 className="text-2xl font-bold mt-10 mb-4 text-center text-gray-900">
            Key Readability Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(result.raw_scores).map(([key, value]) => (
              <div
                key={key}
                className={`rounded-xl p-4 shadow-md ${getScoreColor(
                  value,
                  key
                )} transition-transform transform hover:scale-105`}
              >
                <p className="font-bold text-sm uppercase tracking-wide mb-2 text-center">
                  {key.replace(/_/g, " ")}
                </p>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute top-0 left-0 h-full bg-indigo-600 transition-all"
                    style={{ width: getBarWidth(value, key) }}
                  ></div>
                </div>
                <p className="text-center text-lg font-semibold">
                  {value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              onClick={copyReport}
              className="px-5 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 transition-all"
            >
              Copy Report
            </button>
            <button
              onClick={downloadPDF}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}