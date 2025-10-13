"use client";
import { useState } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const backendURL = "https://readability-backend-production.up.railway.app";

  const analyzeText = async () => {
    if (!text.trim()) return alert("Please enter some text first!");
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
      console.error("Error analyzing text:", err);
      alert("Failed to analyze text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    alert("Report copied to clipboard!");
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Readability Analysis Report", 10, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Overall Readability: ${result.summary.overall_readability}`, 10, 40);
    doc.text(`Insight: ${result.summary.insight}`, 10, 50);
    doc.text(`Suggestion: ${result.summary.suggestion}`, 10, 60);
    doc.text(`Education Level: ${result.summary.education_level}`, 10, 70);
    doc.text(`Sentence Complexity: ${result.summary.sentence_complexity}`, 10, 80);
    doc.text(`Word Simplicity: ${result.summary.word_simplicity}`, 10, 90);
    doc.save("readability-report.pdf");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center px-6 py-10">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          🧠 Readability Analyzer
        </h1>

        <textarea
          className="w-full h-40 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-center mt-4">
          <button
            onClick={analyzeText}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            {/* SUMMARY SECTION */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2 text-blue-700">
                📊 Readability Summary
              </h2>

              <p className="text-lg">
                <strong>🧠 Overall Readability:</strong>{" "}
                {result.summary.overall_readability}
              </p>

              <p className="text-gray-700 mt-1">
                💡 <strong>Insight:</strong> {result.summary.insight}
              </p>

              <p className="text-gray-700 mt-1">
                ✨ <strong>Suggestion:</strong> {result.summary.suggestion}
              </p>

              <div className="mt-4 text-gray-800">
                <p>🎓 <strong>Education Level:</strong> {result.summary.education_level}</p>
                <p>✍️ <strong>Sentence Complexity:</strong> {result.summary.sentence_complexity}</p>
                <p>💬 <strong>Word Simplicity:</strong> {result.summary.word_simplicity}</p>
              </div>
            </div>

            {/* RAW SCORES */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                📈 Detailed Metrics
              </h2>
              <ul className="space-y-2 text-gray-700">
                {Object.entries(result.raw_scores).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key.replace(/_/g, " ")}:</strong> {value.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={copyReport}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                📋 Copy Report
              </button>
              <button
                onClick={downloadPDF}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                📄 Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}