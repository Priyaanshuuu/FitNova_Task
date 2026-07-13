import { Types } from "mongoose";

import { Appeal } from "@/models/Appeal";
import { Advisor } from "@/models/Advisor";
import { Call } from "@/models/Call";

interface CreateAppealInput {
  callId: string;
  advisorId: string;
  issue: string;
  reason: string;
}

export class AppealService {
  static async createAppeal({
    callId,
    advisorId,
    issue,
    reason,
  }: CreateAppealInput) {
    const call = await Call.findById(callId);

    if (!call) {
      throw new Error("Call not found.");
    }

    const advisor = await Advisor.findById(advisorId);

    if (!advisor) {
      throw new Error("Advisor not found.");
    }

    return Appeal.create({
      callId: new Types.ObjectId(callId),
      advisorId: new Types.ObjectId(advisorId),
      issue,
      reason,
    });
  }

  static async findAll() {
    return Appeal.find()
      .populate({
        path: "advisorId",
        select: "name email",
      })
      .populate({
        path: "callId",
      })
      .sort({
        createdAt: -1,
      })
      .lean();
  }
}