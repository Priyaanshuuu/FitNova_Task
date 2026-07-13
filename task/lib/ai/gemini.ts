import { GoogleGenAI } from "@google/genai";

import { ICallAnalysis } from "@/types/analysis";
import {
  ANALYSIS_SYSTEM_PROMPT,
  ANALYSIS_JSON_SCHEMA,
} from "../../constants/prompt";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const gemini = new GoogleGenAI({
  apiKey,
});

export class GeminiClient {
  static async analyze(
    transcript: string
  ): Promise<ICallAnalysis> {
    try {
      const prompt = `
${ANALYSIS_SYSTEM_PROMPT}

${ANALYSIS_JSON_SCHEMA}

TRANSCRIPT

${transcript}
`;

      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned) as ICallAnalysis;
    } catch (error) {
      console.error("Gemini analysis failed:", error);

      throw new Error("Failed to analyze transcript.");
    }
  }
}