import { NextRequest } from "next/server";

import { connectDB } from "@/lib/database/mongodb";
import { ApiResponse } from "@/lib/utils/response";
import { Logger } from "@/lib/utils/logger";
import { appealSchema } from "@/lib/utils/validator";
import { AppealService } from "@/services/appeal.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const parsed = appealSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponse.error(
        parsed.error.issues[0].message,
        400
      );
    }

    Logger.info(
      `Creating appeal for call ${parsed.data.callId}`
    );

    const appeal = await AppealService.createAppeal(
      parsed.data
    );

    return ApiResponse.success(
      appeal,
      "Appeal submitted successfully.",
      201
    );
  } catch (error) {
    Logger.error(
      "Failed to create appeal.",
      error
    );

    if (
      error instanceof Error &&
      (error.message === "Call not found." ||
        error.message === "Advisor not found.")
    ) {
      return ApiResponse.error(error.message, 404);
    }

    return ApiResponse.error(
      "Failed to create appeal.",
      500
    );
  }
}