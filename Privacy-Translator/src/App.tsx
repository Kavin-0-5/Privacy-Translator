import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, ChevronRight, Github, Mail, Shield, Zap, Info, ArrowLeft } from "lucide-react";
import { Logo } from "./components/Logo";
import FileUploader from "./components/FileUploader";
import AnalysisDashboard from "./components/AnalysisDashboard";
import { analyzePrivacyPolicy } from "./services/geminiService";
import { AnalysisResult } from "./types";

type View = "home" | "how-it-works" | "privacy" | "contact";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParsedText = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    setCurrentView("home");
    try {
      const result = await analyzePrivacyPolicy(text);
      setAnalysisData(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navItems: { label: string; view: View }[] = [
    { label: "How it works", view: "how-it-works" },
    { label: "Privacy", view: "privacy" },
    { label: "Contact", view: "contact" },
  ];

  const renderHome = () => (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-20"
    >
      <div className="text-center mb-16 space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black tracking-[0.2em] mb-4"
        >
          <Lock className="w-3 h-3" />
          AI-POWERED PRIVACY ANALYSIS
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.9] tracking-tighter max-w-4xl mx-auto">
          Translate Privacy Policies Into <span className="text-brand-gradient">Plain English.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Stop scrolling past 50 pages of legal jargon. Upload any policy and instantly know exactly what's being done with your data.
        </p>
      </div>

      <FileUploader 
        onParsed={handleParsedText} 
        isLoading={isAnalyzing} 
      />

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mt-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3"
        >
          <div className="p-1 bg-red-100 rounded-lg text-red-600 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-900">Analysis Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Risk Scoring", desc: "Instantly see an overall score from 0-100 based on policy transparency and risks." },
          { title: "Data Extraction", desc: "We identify exactly what data is collected, shared, and how long it's kept." },
          { title: "Plain English", desc: "No more lawyer-speak. Every risky clause is translated into a simple sentence." }
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
              {feature.title}
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderHowItWorks = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <button onClick={() => setCurrentView("home")} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-display font-black tracking-tight">How PrivacyTranslator Works</h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            We use advanced AI to dismantle dense legal documents and rebuild them into something you can actually use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: <Zap className="w-6 h-6" />, title: "Instant Extraction", text: "Our parsing engine handles PDF, DOCX, and text inputs, extracting the signal from the noise in seconds." },
            { icon: <Shield className="w-6 h-6" />, title: "Risk Assessment", text: "We analyze clauses against global privacy standards (GDPR, CCPA) to identify data traps and vague language." },
            { icon: <Info className="w-6 h-6" />, title: "Plain English Translation", text: "Legal jargon is mapped to simple, direct statements like 'They can sell your email address'." },
            { icon: <Lock className="w-6 h-6" />, title: "Privacy First", text: "Your documents are processed and analyzed using Gemini AI. We don't store your sensitive policy files." }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderPrivacy = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 py-20"
    >
      <button onClick={() => setCurrentView("home")} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>
      <div className="space-y-8 bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-display font-black tracking-tight">Our Privacy Commitment</h2>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>
            It would be ironic if a privacy tool disrespected your privacy. Here's how we handle your data:
          </p>
          <ul className="space-y-4 list-disc pl-5 text-sm">
            <li><strong>No Account Required:</strong> You don't need to sign up to use the basic features of this tool.</li>
            <li><strong>Transient Processing:</strong> We extract text from your uploaded files on our secure server. The original files are not stored indefinitely.</li>
            <li><strong>AI Analysis:</strong> We send the extracted text to Google Gemini for analysis. This data is governed by standard enterprise-grade privacy protections.</li>
            <li><strong>No Data Selling:</strong> We never sell your personal information or the policies you analyze to third parties.</li>
          </ul>
          <p className="text-xs text-slate-400 mt-8 pt-8 border-t border-slate-100">
            Last updated: April 25, 2026. This is a demo application.
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderContact = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-4 py-20 text-center"
    >
      <button onClick={() => setCurrentView("home")} className="mb-8 inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>
      <div className="space-y-6">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-display font-black tracking-tight">Get in Touch</h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
          Have questions about the analysis or want to report a bug? We'd love to hear from you.
        </p>
        <a href="mailto:support@privacytranslator.example" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
          Email Support
        </a>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => { setCurrentView("home"); setAnalysisData(null); }} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Logo className="w-10 h-10" />
            <h1 className="font-display text-2xl font-black tracking-tight text-slate-900">PrivacyTranslator</h1>
          </button>
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`text-sm font-medium transition-colors ${
                  currentView === item.view ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <button className="bg-brand-gradient text-white text-xs font-bold px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-xl shadow-indigo-100">
              Go Pro
            </button>
          </div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {currentView === "home" ? (
            !analysisData ? renderHome() : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <AnalysisDashboard data={analysisData} onReset={() => setAnalysisData(null)} />
              </motion.div>
            )
          ) : currentView === "how-it-works" ? renderHowItWorks() : 
              currentView === "privacy" ? renderPrivacy() : renderContact()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" onClick={() => setCurrentView("home")}>
            <Logo className="w-8 h-8" />
            <span className="font-display font-black tracking-tight">PrivacyTranslator</span>
          </div>
          
          <div className="flex gap-6 text-xs font-medium text-slate-400">
            <button onClick={() => setCurrentView("how-it-works")} className="hover:text-slate-900 transition-colors">Documentation</button>
            <button onClick={() => setCurrentView("privacy")} className="hover:text-slate-900 transition-colors">Privacy Policy</button>
            <button onClick={() => setCurrentView("contact")} className="hover:text-slate-900 transition-colors">Support</button>
          </div>
          
          <p className="text-slate-400 text-xs">
            © 2026 PrivacyTranslator AI. Built for the future of web privacy.
          </p>

          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
