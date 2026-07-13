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

  advisorId: string;
  teamId: string;

  audioUrl: string;
  duration?: number;

  processingStatus: ProcessingStatus;

  transcript?: string;

  diarizedTranscript?: string;

  analysis?: string;

  createdAt?: Date;
  updatedAt?: Date;
}