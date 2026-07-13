import { ProcessingStatus } from "@/types/call";

import { CallService } from "./call.service";
import { AnalysisService } from "./analysis.service";
import { DiarizationService } from "./diarization.service";
import { TranscriptionService } from "./transcription.service";

interface ProcessUploadInput {
  advisorId: string;
  teamId: string;
  audio: File;
  audioUrl: string;
  duration?: number;
}

export class UploadService {
  static async process({
    advisorId,
    teamId,
    audio,
    audioUrl,
    duration,
  }: ProcessUploadInput) {
    const call = await CallService.create({
      advisorId,
      teamId,
      audioUrl,
      duration,
    });

    try {
      await CallService.updateStatus(
        call.id,
        ProcessingStatus.TRANSCRIBING
      );

      const transcript =
        await TranscriptionService.transcribe(audio);

      await CallService.saveTranscript(
        call.id,
        transcript
      );

      await CallService.updateStatus(
        call.id,
        ProcessingStatus.DIARIZING
      );

      const diarizedTranscript =
        await DiarizationService.diarize(
          transcript
        );

      await CallService.saveDiarizedTranscript(
        call.id,
        diarizedTranscript
      );

      await CallService.updateStatus(
        call.id,
        ProcessingStatus.ANALYZING
      );

      const analysis =
        await AnalysisService.analyze(
          diarizedTranscript
        );

      const completedCall =
        await CallService.saveAnalysis(
          call.id,
          analysis
        );

      return completedCall;
    } catch (error) {
      await CallService.markFailed(call.id);

      throw error;
    }
  }
}