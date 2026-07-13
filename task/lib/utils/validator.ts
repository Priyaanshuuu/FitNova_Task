import { z } from "zod";

export const uploadSchema = z.object({
  advisorId: z.string().min(1, "Advisor ID is required."),
  teamId: z.string().min(1, "Team ID is required."),
  duration: z.number().optional(),
});

export const appealSchema = z.object({
  callId: z.string().min(1),
  advisorId: z.string().min(1),
  issue: z.string().min(1),
  reason: z.string().min(10),
});