import { NextRequest } from "next/server";

import { connectDB } from "@/lib/database/mongodb";
import { ApiResponse } from "@/lib/utils/response";
import { FileStorage } from "@/lib/utils/file";
import { Logger } from "@/lib/utils/logger";
import { uploadSchema } from "@/lib/utils/validator";
import { UploadService } from "@/services/upload.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    const advisorId = formData.get("advisorId");
    const teamId = formData.get("teamId");
    const duration = formData.get("duration");
    const audio = formData.get("audio");

    if (
      typeof advisorId !== "string" ||
      typeof teamId !== "string" ||
      !(audio instanceof File)
    ) {
      return ApiResponse.error(
        "Invalid request payload.",
        400
      );
    }

    const parsed = uploadSchema.safeParse({
      advisorId,
      teamId,
      duration:
        typeof duration === "string"
          ? Number(duration)
          : undefined,
    });

    if (!parsed.success) {
      return ApiResponse.error(
        parsed.error.issues[0].message,
        400
      );
    }

    Logger.info("Saving uploaded audio...");

    const audioUrl = await FileStorage.saveAudio(audio);

    Logger.info("Starting AI processing pipeline...");

    const call = await UploadService.process({
      advisorId: parsed.data.advisorId,
      teamId: parsed.data.teamId,
      duration: parsed.data.duration,
      audio,
      audioUrl,
    });

    Logger.info(`Call processed successfully: ${call.id}`);

    return ApiResponse.success(
      call,
      "Call processed successfully.",
      201
    );
  } catch (error) {
    Logger.error(
      "Failed to process uploaded call.",
      error
    );

    return ApiResponse.error(
      "Failed to process uploaded call.",
      500
    );
  }
}