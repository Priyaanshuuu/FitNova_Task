import type { Types } from "mongoose";
import type { ICallAnalysis } from "./analysis";
import type { ITranscriptSegment } from "./transcript";

export enum ProcessingStatus {
  UPLOADED = "UPLOADED",
  TRANSCRIBING = "TRANSCRIBING",
  DIARIZING = "DIARIZING",
  ANALYZING = "ANALYZING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface ICall {
  _id?: string;

  advisorId: Types.ObjectId;
  teamId: Types.ObjectId;

  audioUrl: string;
  duration?: number;

  processingStatus: ProcessingStatus;

  transcript?: string;

  diarizedTranscript?: ITranscriptSegment[];

  analysis?: ICallAnalysis;

  createdAt?: Date;
  updatedAt?: Date;
}