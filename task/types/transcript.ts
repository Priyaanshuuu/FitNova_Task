export enum Speaker {
  ADVISOR = "Advisor",
  CUSTOMER = "Customer",
  UNKNOWN = "Unknown",
}

export interface ITranscriptSegment {
  speaker: Speaker;

  text: string;

  startTime: number;

  endTime: number;
}