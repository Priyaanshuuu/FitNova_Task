import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/database/mongodb";
import { AppealService } from "@/services/appeal.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const appeal =
      await AppealService.createAppeal(body);

    return NextResponse.json(
      {
        success: true,
        data: appeal,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit appeal.",
      },
      {
        status: 500,
      }
    );
  }
}