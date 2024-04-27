export class Logger {
  constructor(private context: string) {}

  log(message: string) {
    console.log(`[${this.context}] ${message}`);
  }

  debug(message: string) {
    console.debug(`[${this.context}] ${message}`);
  }

  error(message: string) {
    console.error(`[${this.context}] ${message}`);
  }
}
