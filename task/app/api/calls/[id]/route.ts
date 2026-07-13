import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/database/mongodb";
import { CallService } from "@/services/call.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    const call = await CallService.findById(id);

    if (!call) {
      return NextResponse.json(
        {
          success: false,
          message: "Call not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: call,
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
        message: "Failed to fetch call.",
      },
      {
        status: 500,
      }
    );
  }
}