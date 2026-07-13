import { GeminiClient } from "@/lib/ai/gemini";
import type { ICallAnalysis } from "@/types/analysis";
import type { ITranscriptSegment } from "@/types/transcript";

export class AnalysisService {
  static async analyze(
    transcript: ITranscriptSegment[]
  ): Promise<ICallAnalysis> {
    const formattedTranscript = transcript
      .map(
        ({ speaker, text }) =>
          `${speaker}: ${text}`
      )
      .join("\n");

    return GeminiClient.analyze(formattedTranscript);
  }
}