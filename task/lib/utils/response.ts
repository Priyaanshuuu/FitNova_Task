import { NextResponse } from "next/server";

export class ApiResponse {
  static success(data: unknown, message = "Success", status = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      {
        status,
      }
    );
  }

  static error(message: string, status = 500) {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status,
      }
    );
  }
}