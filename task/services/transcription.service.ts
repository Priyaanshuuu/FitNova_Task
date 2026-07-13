import { GroqClient } from "@/lib/ai/groq";

export class TranscriptionService {
  static async transcribe(audio: Blob): Promise<string> {
    return GroqClient.transcribe(audio);
  }
}