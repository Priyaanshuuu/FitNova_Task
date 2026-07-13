export class Logger {
  static info(message: string) {
    console.log(`[INFO] ${message}`);
  }

  static warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }

  static error(message: string, error?: unknown) {
    console.error(`[ERROR] ${message}`);

    if (error) {
      console.error(error);
    }
  }
}