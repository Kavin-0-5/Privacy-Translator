import React from "react";
import { motion } from "motion/react";
import { Download, Share2, FileJson, Table, Info, AlertTriangle } from "lucide-react";
import { AnalysisResult } from "../types";
import RiskMeter from "./RiskMeter";
import ClauseCard from "./ClauseCard";
import jsPDF from "jspdf";
import Papa from "papaparse";

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

export default function AnalysisDashboard({ data, onReset }: DashboardProps) {
  const exportCSV = () => {
    const csvData = data.clauses.map(c => ({
      Category: c.category,
      Severity: c.severity,
      "What it says": c.plainEnglish,
      "Why it matters": c.riskReason,
      "Original text": c.originalQuote
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `privacy_report_${new Date().getTime()}.csv`);
    link.click();
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `privacy_report_${new Date().getTime()}.json`);
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Privacy Policy Analysis Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Score: ${data.overallScore}/100 (${data.riskLevel} Risk)`, 20, 30);
    doc.text(`Summary: ${data.summary}`, 20, 40, { maxWidth: 170 });
    
    let y = 60;
    doc.setFontSize(16);
    doc.text("Top Worries:", 20, y);
    y += 10;
    doc.setFontSize(10);
    data.topWorries.forEach(w => {
      doc.text(`• ${w}`, 25, y);
      y += 7;
    });

    y += 10;
    doc.setFontSize(16);
    doc.text("Detail Analysis:", 20, y);
    y += 10;
    doc.setFontSize(10);
    data.clauses.forEach(c => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.text(`[${c.severity}] ${c.category}: ${c.plainEnglish}`, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Risk: ${c.riskReason}`, 20, y, { maxWidth: 170 });
      y += 10;
    });

    doc.save(`privacy_report_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <RiskMeter score={data.overallScore} level={data.riskLevel} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-indigo-600 mb-2">
              <Info className="w-3 h-3" />
              EXECUTIVE SUMMARY
            </div>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">{data.summary}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.categories.map((cat, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cat.name}</span>
                  <span className={`text-sm font-black`}>{cat.score}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    className={`h-full bg-slate-900`}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">{cat.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Deep Analysis
              <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-full">
                {data.clauses.length} FOUND
              </span>
            </h3>
          </div>
          
          <div className="space-y-4">
            {data.clauses.map((clause, idx) => (
              <ClauseCard key={idx} clause={clause} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Critical Concerns
            </h3>
            <div className="space-y-4">
              {data.topWorries.map((worry, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-indigo-100 leading-relaxed font-medium">{worry}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-4">Export Analysis</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={exportPDF}
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
              <button 
                onClick={exportCSV}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                <Table className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={exportJSON}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                <FileJson className="w-4 h-4" /> JSON
              </button>
              <button 
                onClick={() => {}} // Placeholder for future share feature
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Link
              </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
            <p className="text-[11px] text-amber-800 leading-relaxed italic">
              <strong>Disclaimer:</strong> This tool provides informational AI-generated analysis, not legal advice. The findings may require professional review for absolute certainty.
            </p>
          </div>

          <button 
            onClick={onReset}
            className="w-full py-4 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
          >
            Analyze another policy
          </button>
        </div>
      </div>
    </div>
  );
}
