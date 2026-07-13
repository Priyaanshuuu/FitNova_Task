export enum Severity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface IScoreBreakdown {
  needsDiscovery: number;
  productKnowledge: number;
  objectionHandling: number;
  compliance: number;
  trialBooking: number;
}

export interface IIssueFlag {
  issue: string;

  severity: Severity;

  timestamp: string;

  quote: string;

  reason: string;
}

export interface ICallAnalysis {
  summary: string;

  overallScore: number;

  scores: IScoreBreakdown;

  flags: IIssueFlag[];

  coachingSuggestions: string[];
}