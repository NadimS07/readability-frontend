"use client";

import { useState } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("readability");

  // ✅ Automatically switch between local and Railway backend
  const backendURL =
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://readability-backend-production.up.railway.app";

  // ---------- Analyze API ----------
  const analyzeText = async () => {
    if (!text.trim()) {
      alert("Please enter some text first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const endpoint =
      mode === "readability"
        ? "/analyze_readability"
        : mode === "tone"
        ? "/analyze_tone"
        : "/check_plagiarism";

    try {
      const res = await fetch(`${backendURL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Backend fetch failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("⚠️ Could not reach backend. Please ensure FastAPI is running or Railway is live.");
      console.error("❌ Backend connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Copy Report ----------
  const copyReport = () => {
    if (!result) return;
    let report = `AI Readability, Tone & Plagiarism Report\n\n`;

    if (mode === "readability" && result.summary) {
      report += `Overall Readability: ${result.summary.overall_readability}\n`;
      report += `Education Level: ${result.summary.education_level}\n`;
      report += `Sentence Complexity: ${result.summary.sentence_complexity}\n`;
      report += `Word Simplicity: ${result.summary.word_simplicity}\n`;
      report += `Insight: ${result.summary.insight}\n`;
      report += `Suggestion: ${result.summary.suggestion}`;
    } else if (mode === "tone" && result.summary) {
      report += `Dominant Tone: ${result.summary.dominant_tone}\n`;
      report += `Confidence: ${result.summary.confidence}\n`;
      report += `Feedback: ${result.summary.feedback}`;
    } else if (mode === "plagiarism" && result.summary) {
      report += `Plagiarism Score: ${result.summary.plagiarism_score}\n`;
      report += `Feedback: ${result.summary.feedback}`;
    }

    navigator.clipboard.writeText(report);
    alert("✅ Report copied to clipboard!");
  };

  // ---------- Download as PDF ----------
  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("AI Readability, Tone & Plagiarism Report", 15, 20);

    let y = 35;
    Object.entries(result.summary).forEach(([key, value]) => {
      doc.text(`${key.replace(/_/g, " ")}: ${value}`, 15, y);
      y += 10;
    });

    doc.save("AI_Report.pdf");
  };

  // ---------- Card Component ----------
  const Card = ({ title, value, color }) => (
    <div
      className={`p-5 rounded-2xl border-l-4 ${color} bg-[#0f172a] text-gray-100 shadow-md hover:shadow-lg transition-all`}
    >
      <h3 className="text-lg font-bold text-black">{title}</h3>
      <p className="text-gray-300 mt-1">{value}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#0e1a34] to-[#0f172a] flex flex-col items-center px-6 py-10 text-white">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-3">
        AI Readability, Tone & Plagiarism Analyzer
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-2xl">
        Analyze your text’s clarity, tone, and originality — all in one place.
      </p>

      {/* Mode Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["readability", "tone", "plagiarism"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              mode === m
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md"
                : "bg-[#1e293b] text-gray-300 hover:bg-[#2b3b4f]"
            }`}
          >
            {m === "readability" && "📘 Readability"}
            {m === "tone" && "💬 Tone"}
            {m === "plagiarism" && "🔍 Plagiarism"}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <textarea
        placeholder="Type or paste your text here..."
        className="w-full md:w-2/3 h-44 p-4 bg-[#0f172a] border border-[#334155] rounded-2xl text-black shadow-inner focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={analyzeText}
        className="mt-6 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all shadow-md"
      >
        {loading ? "Analyzing..." : `Analyze ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
      </button>

      {/* Results */}
      {result && (
        <div className="w-full md:w-2/3 mt-10 bg-[#0b1120] rounded-2xl shadow-xl p-6 space-y-6 border border-[#1e293b]">
          {mode === "readability" && result.summary && (
            <>
              <h2 className="text-2xl font-semibold text-blue-300 mb-4">
                📘 Readability Summary
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card title="Overall Readability" value={result.summary.overall_readability} color="border-blue-500" />
                <Card title="Education Level" value={result.summary.education_level} color="border-green-500" />
                <Card title="Sentence Complexity" value={result.summary.sentence_complexity} color="border-yellow-400" />
                <Card title="Word Simplicity" value={result.summary.word_simplicity} color="border-purple-400" />
              </div>
              <Card title="Insight" value={result.summary.insight} color="border-cyan-400" />
              <Card title="Suggestion" value={result.summary.suggestion} color="border-gray-500" />
            </>
          )}

          {mode === "tone" && result.summary && (
            <>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">💬 Tone Analysis</h2>
              <Card title="Dominant Tone" value={result.summary.dominant_tone} color="border-blue-500" />
              <Card title="Confidence" value={result.summary.confidence} color="border-green-400" />
              <Card title="Feedback" value={result.summary.feedback} color="border-yellow-500" />
            </>
          )}

          {mode === "plagiarism" && result.summary && (
            <>
              <h2 className="text-2xl font-semibold text-red-300 mb-4">🔍 Plagiarism Report</h2>
              <Card title="Plagiarism Score" value={result.summary.plagiarism_score} color="border-red-500" />
              <Card title="Feedback" value={result.summary.feedback} color="border-gray-500" />
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={copyReport}
              className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-[#1e293b] transition-all"
            >
              Copy Report
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-lg hover:from-green-600 hover:to-emerald-500 transition-all shadow-md"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
