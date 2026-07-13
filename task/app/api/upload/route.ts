import { NextRequest, NextResponse } from "next/server";
import { FileStorage } from "@/lib/utils/file";
import { connectDB } from "@/lib/database/mongodb";
import { UploadService } from "@/services/upload.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();

    const advisorId = formData.get("advisorId");
    const teamId = formData.get("teamId");
    const audio = formData.get("audio");
    const duration = formData.get("duration");

    if (
      typeof advisorId !== "string" ||
      typeof teamId !== "string" ||
      !(audio instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request payload.",
        },
        {
          status: 400,
        }
      );
    }

    const audioUrl = await FileStorage.saveAudio(audio);

    const call = await UploadService.process({
      advisorId,
      teamId,
      audio,
      audioUrl,
      duration:
        typeof duration === "string"
          ? Number(duration)
          : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Call processed successfully.",
        data: call,
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
        message: "Failed to process call.",
      },
      {
        status: 500,
      }
    );
  }
}