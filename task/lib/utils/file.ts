import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export class FileStorage {
  static async saveAudio(file: File): Promise<string> {
    await mkdir(UPLOAD_DIR, {
      recursive: true,
    });

    const extension = file.name.split(".").pop();

    const fileName = `${randomUUID()}.${extension}`;

    const filePath = path.join(
      UPLOAD_DIR,
      fileName
    );

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    await writeFile(filePath, buffer);

    return `/uploads/${fileName}`;
  }
}