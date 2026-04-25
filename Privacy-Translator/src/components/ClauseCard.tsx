import React, { useState, FC } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ChevronDown, ChevronUp, ShieldQuestion, Globe, MessageSquare, Trash2, Clock, MapPin } from "lucide-react";
import { PrivacyClause, Severity } from "../types";

interface ClauseCardProps {
  clause: PrivacyClause;
}

const getCategoryIcon = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes("share") || c.includes("third")) return <Globe className="w-4 h-4" />;
  if (c.includes("collect") || c.includes("data")) return <ShieldQuestion className="w-4 h-4" />;
  if (c.includes("retention") || c.includes("long")) return <Clock className="w-4 h-4" />;
  if (c.includes("delete") || c.includes("removal")) return <Trash2 className="w-4 h-4" />;
  if (c.includes("location")) return <MapPin className="w-4 h-4" />;
  return <MessageSquare className="w-4 h-4" />;
};

const getSeverityStyles = (severity: Severity) => {
  switch (severity) {
    case Severity.CRITICAL: return "bg-red-100 text-red-700 border-red-200";
    case Severity.HIGH: return "bg-orange-100 text-orange-700 border-orange-200";
    case Severity.MEDIUM: return "bg-amber-100 text-amber-700 border-amber-200";
    case Severity.LOW: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const ClauseCard: FC<ClauseCardProps> = ({ clause }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div 
        className="p-5 cursor-pointer flex items-start gap-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`mt-1 p-2 rounded-xl border ${getSeverityStyles(clause.severity)}`}>
          {getCategoryIcon(clause.category)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">{clause.category}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getSeverityStyles(clause.severity)}`}>
              {clause.severity}
            </span>
          </div>
          <h4 className="text-slate-900 font-bold leading-tight mb-1">{clause.plainEnglish}</h4>
          <p className="text-slate-500 text-sm italic">{clause.riskReason}</p>
        </div>

        <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-50 bg-slate-50/50"
          >
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
                <AlertCircle className="w-3 h-3" />
                LEGAL VERBIAGE (EVIDENCE)
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-600 text-sm leading-relaxed font-mono">
                "{clause.originalQuote}"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClauseCard;
