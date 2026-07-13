import { GoogleGenAI } from "@google/genai";

import { Speaker, type ITranscriptSegment } from "@/types/transcript";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const gemini = new GoogleGenAI({
  apiKey,
});

const DIARIZATION_PROMPT = `
You are given a transcript of a sales conversation.

Identify the speaker for every utterance.

Rules:

1. There are only two speakers:
   - Advisor
   - Customer

2. Never invent dialogue.

3. Preserve the order exactly.

4. If uncertain, use "Unknown".

5. Return ONLY valid JSON.

JSON Format:

[
    {
        "speaker":"Advisor",
        "text":"Hello sir.",
        "startTime":0,
        "endTime":0
    }
]

If timestamps are unavailable, set both values to 0.
`;

export class DiarizationClient {
  static async diarize(
    transcript: string
  ): Promise<ITranscriptSegment[]> {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${DIARIZATION_PROMPT}

TRANSCRIPT

${transcript}`,
      });

      const text = response.text;

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const segments = JSON.parse(cleaned) as ITranscriptSegment[];

      return segments.map((segment) => ({
        speaker:
          segment.speaker === Speaker.ADVISOR
            ? Speaker.ADVISOR
            : segment.speaker === Speaker.CUSTOMER
            ? Speaker.CUSTOMER
            : Speaker.UNKNOWN,

        text: segment.text.trim(),

        startTime: segment.startTime ?? 0,

        endTime: segment.endTime ?? 0,
      }));
    } catch (error) {
      console.error("Speaker diarization failed:", error);

      throw new Error("Failed to identify conversation speakers.");
    }
  }
}