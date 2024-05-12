export class Logger {
  constructor(private context: string) {}

  log(message: string) {
    console.log(`[INFO] [${this.context}] ${message}`);
  }

  debug(message: string) {
    console.debug(`[DEBUG] [${this.context}] ${message}`);
  }

  error(message: string) {
    console.error(`[ERROR] [${this.context}] ${message}`);
  }
}
