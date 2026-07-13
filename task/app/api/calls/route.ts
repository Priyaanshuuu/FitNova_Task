import { NextResponse } from "next/server";

import { connectDB } from "@/lib/database/mongodb";
import { CallService } from "@/services/call.service";

export async function GET() {
  try {
    await connectDB();

    const calls = await CallService.findAll();

    return NextResponse.json(
      {
        success: true,
        data: calls,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch calls.",
      },
      {
        status: 500,
      }
    );
  }
}