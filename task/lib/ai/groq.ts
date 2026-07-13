import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is not configured.");
}

const groq = new Groq({
  apiKey,
});

export class GroqClient {
  static async transcribe(audio: Blob): Promise<string> {
    try {
      const response = await groq.audio.transcriptions.create({
        file: audio,
        model: "whisper-large-v3-turbo",
        language: "en",
        temperature: 0,
        response_format: "verbose_json",
      });

      return response.text.trim();
    } catch (error) {
      console.error("Groq transcription failed:", error);

      throw new Error("Failed to transcribe audio.");
    }
  }
}