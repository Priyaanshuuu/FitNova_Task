import { Appeal } from "@/models/Appeal";

interface CreateAppealInput {
  callId: string;
  advisorId: string;
  issue: string;
  reason: string;
}

export class AppealService {
  static async createAppeal(
    data: CreateAppealInput
  ) {
    return Appeal.create(data);
  }

  static async getAppeals() {
    return Appeal.find()
      .populate("advisorId", "name")
      .populate("callId");
  }
}