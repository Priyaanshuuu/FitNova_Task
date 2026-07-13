import { Types } from "mongoose";

import { Call } from "@/models/Call";
import { ProcessingStatus, type ICall } from "@/types/call";
import type { ICallAnalysis } from "@/types/analysis";
import type { ITranscriptSegment } from "@/types/transcript";

export class CallService {
  static async create(data: {
    advisorId: string;
    teamId: string;
    audioUrl: string;
    duration?: number;
  }) {
    return Call.create({
      advisorId: new Types.ObjectId(data.advisorId),
      teamId: new Types.ObjectId(data.teamId),
      audioUrl: data.audioUrl,
      duration: data.duration ?? 0,
      processingStatus: ProcessingStatus.UPLOADED,
    });
  }

  private static async update(
    callId: string,
    update: Partial<ICall>
  ) {
    return Call.findByIdAndUpdate(callId, update, {
      new: true,
      runValidators: true,
    });
  }
  static async updateStatus(
    callId: string,
    status: ProcessingStatus
  ) {
    return this.update(callId, {
      processingStatus: status,
    });
  }

  static async saveTranscript(
    callId: string,
    transcript: string
  ) {
    return this.update(callId, {
      transcript,
    });
  }

  static async saveDiarizedTranscript(
    callId: string,
    diarizedTranscript: ITranscriptSegment[]
  ) {
    return this.update(callId, {
      diarizedTranscript,
    });
  }

  static async saveAnalysis(
    callId: string,
    analysis: ICallAnalysis
  ) {
    return this.update(callId, {
      analysis,
      processingStatus: ProcessingStatus.COMPLETED,
    });
  }

  static async markFailed(callId: string) {
    return this.update(callId, {
      processingStatus: ProcessingStatus.FAILED,
    });
  }

static async findAll() {
  return Call.find()
    .populate({
      path: "advisorId",
      select: "name email",
    })
    .populate({
      path: "teamId",
      select: "name",
    })
    .sort({
      createdAt: -1,
    })
    .lean();
}


 static async findById(callId: string) {
  return Call.findById(callId)
    .populate({
      path: "advisorId",
      select: "name email",
    })
    .populate({
      path: "teamId",
      select: "name",
    })
    .lean();
}
}