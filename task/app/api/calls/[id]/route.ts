import { NextRequest } from "next/server";

import { connectDB } from "@/lib/database/mongodb";
import { ApiResponse } from "@/lib/utils/response";
import { Logger } from "@/lib/utils/logger";
import { CallService } from "@/services/call.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    Logger.info(`Fetching call: ${id}`);

    const call = await CallService.findById(id);

    if (!call) {
      return ApiResponse.error(
        "Call not found.",
        404
      );
    }

    return ApiResponse.success(
      call,
      "Call fetched successfully."
    );
  } catch (error) {
    Logger.error(
      "Failed to fetch call.",
      error
    );

    return ApiResponse.error(
      "Failed to fetch call.",
      500
    );
  }
}