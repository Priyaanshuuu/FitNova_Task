import { DiarizationClient } from "@/lib/ai/diarization";
import type { ITranscriptSegment } from "@/types/transcript";

export class DiarizationService {
  static async diarize(
    transcript: string
  ): Promise<ITranscriptSegment[]> {
    return DiarizationClient.diarize(transcript);
  }
}