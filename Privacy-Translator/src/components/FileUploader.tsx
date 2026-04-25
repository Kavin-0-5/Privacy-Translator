import React, { useState, useRef } from "react";
import { Upload, FileText, Clipboard, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

interface FileUploaderProps {
  onParsed: (text: string) => void;
  isLoading: boolean;
}

export default function FileUploader({ onParsed, isLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [status, setStatus] = useState<{ type: 'info' | 'error' | 'success', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    setStatus({ type: 'info', message: `Extracting text from ${file.name}...` });
    try {
      const response = await axios.post("/api/parse", formData);
      if (response.data.text) {
        setStatus({ type: 'success', message: "File parsed successfully! Analyzing content..." });
        setTimeout(() => {
          onParsed(response.data.text);
          setStatus(null);
        }, 1000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      let errorMsg = "Failed to parse file.";
      let suggestion = "Please try again or use a different file format.";
      
      if (err.code === 'ERR_NETWORK') {
        errorMsg = "Connection error.";
        suggestion = "The server might still be starting up. Please wait a moment and try again.";
      } else if (err.response?.data) {
        const { error, details } = err.response.data;
        errorMsg = error || errorMsg;
        suggestion = details || suggestion;
      }

      setStatus({ 
        type: 'error', 
        message: `${errorMsg} ${suggestion}` 
      });
      setTimeout(() => setStatus(null), 10000);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handlePasteSubmit = () => {
    if (pasteText.trim()) {
      setStatus({ type: 'success', message: "Text received! Analyzing content..." });
      setTimeout(() => {
        onParsed(pasteText);
        setStatus(null);
      }, 800);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {!showPaste ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer transition-all duration-300
              border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center gap-4
              ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
              ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileSelect} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />
            <div className={`
              w-20 h-20 rounded-3xl flex items-center justify-center mb-2 transition-all duration-500
              ${status?.type === 'success' ? 'bg-emerald-100 text-emerald-600 rotate-[360deg]' : 'bg-indigo-100 text-indigo-600'}
              ${status?.type === 'error' ? 'bg-red-100 text-red-600' : ''}
            `}>
              {isLoading || (status?.type === 'info') ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : status?.type === 'success' ? (
                <CheckCircle className="w-10 h-10" />
              ) : status?.type === 'error' ? (
                <AlertCircle className="w-10 h-10" />
              ) : (
                <Upload className="w-10 h-10" />
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">Upload Privacy Policy</h3>
              <p className="text-slate-500 mt-1">PDF, DOCX, or TXT (Max 50MB)</p>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-400">
              <div className="h-px w-12 bg-slate-200"></div>
              <span>OR</span>
              <div className="h-px w-12 bg-slate-200"></div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setShowPaste(true); }}
              className="mt-4 px-6 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-400 transition-colors flex items-center gap-2"
            >
              <Clipboard className="w-4 h-4" />
              Paste Policy Text
            </button>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`
                  absolute -bottom-16 left-0 right-0 p-4 rounded-2xl text-sm font-medium shadow-xl border
                  flex items-center gap-3 z-20 mx-4
                  ${status.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : ''}
                  ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : ''}
                  ${status.type === 'info' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : ''}
                `}
              >
                {status.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                {status.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                {status.type === 'info' && <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />}
                <span>{status.message}</span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border-2 border-slate-200 rounded-3xl p-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Paste Policy Text
              </h3>
              <button 
                onClick={() => setShowPaste(false)} 
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste the full privacy policy text here..."
              className="w-full h-64 p-4 border rounded-2xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 leading-relaxed"
            />
            <button
              disabled={!pasteText.trim() || isLoading}
              onClick={handlePasteSubmit}
              className={`
                w-full mt-6 py-4 rounded-2xl font-bold text-white transition-all
                ${!pasteText.trim() || isLoading ? 'bg-slate-300' : 'bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200'}
                flex items-center justify-center gap-2
              `}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Analyze Now'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
