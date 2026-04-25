import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "0-100 score, 100 being most risky" },
    riskLevel: { type: Type.STRING, description: "Low, Moderate, High, or Critical" },
    summary: { type: Type.STRING, description: "Concentrated human-friendly summary" },
    topWorries: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Top 5 critical concerns"
    },
    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.INTEGER },
          color: { type: Type.STRING, description: "Tailwind color name e.g., blue, amber, red" },
          description: { type: Type.STRING }
        },
        required: ["name", "score", "description"]
      }
    },
    clauses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          severity: { type: Type.STRING, enum: Object.values(Severity) },
          originalQuote: { type: Type.STRING },
          plainEnglish: { type: Type.STRING },
          riskReason: { type: Type.STRING }
        },
        required: ["category", "severity", "originalQuote", "plainEnglish", "riskReason"]
      }
    }
  },
  required: ["overallScore", "riskLevel", "summary", "categories", "clauses", "topWorries"]
};

export async function analyzePrivacyPolicy(text: string): Promise<AnalysisResult> {
  // Truncate text if it's too long for a single prompt, though Gemini 3/1.5 has large context
  // Policies can be 40+ pages, around 20k-40k tokens. Gemini can handle this.
  const prompt = `
    You are a Senior Privacy Expert and Legal Translator. 
    Analyze the following privacy policy text thoroughly.
    Your goal is to identify risks, hidden traps, and translate legal jargon into plain English for a non-lawyer.
    
    POLICY TEXT:
    ${text.substring(0, 50000)} 
    
    INSTRUCTIONS:
    1. Identify exact data collection points (Device ID, Location, PII, etc).
    2. Check for third-party sharing details.
    3. Find retention periods (how long data is kept).
    4. Highlight deletion rights or lack thereof.
    5. Detect unusual permissions or tracking behaviors.
    6. Assign a severity to each finding: Low, Medium, High, or Critical.
    7. Generate a plain-English translation for each significant clause.
    8. Calculate an overall Risk Score (0 = Perfect Privacy, 100 = Total Surveillance/Insecurity).
    
    BE HONEST: If the policy is vague about something, label it as "unclear" or "vague".
    NO HALLUCINATIONS: Do not invent clauses that don't exist.
    
    RESPONSE FORMAT: JSON strictly matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA as any
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("AI Analysis failed. The document might be too complex or the service is temporarily unavailable.");
  }
}
