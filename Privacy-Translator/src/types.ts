export enum Severity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export interface PrivacyClause {
  category: string;
  severity: Severity;
  originalQuote: string;
  plainEnglish: string;
  riskReason: string;
}

export interface RiskCategory {
  name: string;
  score: number; // 0-100
  description: string;
  color: string;
}

export interface AnalysisResult {
  overallScore: number; // 0-100
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  summary: string;
  categories: RiskCategory[];
  clauses: PrivacyClause[];
  topWorries: string[];
}

export interface ParseResponse {
  text: string;
}
