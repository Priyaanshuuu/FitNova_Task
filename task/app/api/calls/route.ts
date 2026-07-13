import { connectDB } from "@/lib/database/mongodb";
import { ApiResponse } from "@/lib/utils/response";
import { Logger } from "@/lib/utils/logger";
import { CallService } from "@/services/call.service";

export async function GET() {
  try {
    await connectDB();

    Logger.info("Fetching all calls...");

    const calls = await CallService.findAll();

    return ApiResponse.success(
      calls,
      "Calls fetched successfully."
    );
  } catch (error) {
    Logger.error(
      "Failed to fetch calls.",
      error
    );

    return ApiResponse.error(
      "Failed to fetch calls.",
      500
    );
  }
}