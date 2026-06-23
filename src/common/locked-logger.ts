import * as fs from 'fs';
import * as path from 'path';

class Mutex {
  private locked = false;
  private queue: (() => void)[] = [];

  async acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.locked) {
        this.locked = true;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    } else {
      this.locked = false;
    }
  }
}

export class LockedLogger {
  private static readonly mutex = new Mutex();
  private static readonly logDir = path.join(__dirname, '..', '..', 'logs');
  private static readonly logFilePath = path.join(LockedLogger.logDir, 'app-locked.log');

  static async log(message: string): Promise<void> {
    await LockedLogger.mutex.acquire();

    try {
      if (!fs.existsSync(LockedLogger.logDir)) {
        fs.mkdirSync(LockedLogger.logDir, { recursive: true });
      }

      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] [LOCK-LOGGER] ${message}\n`;

      await new Promise((resolve) => setTimeout(resolve, 50));

      await fs.promises.appendFile(LockedLogger.logFilePath, formattedMessage, 'utf8');
      
      console.log(`[LOCK-LOGGER-CONSOLE] ${message}`);
    } catch (error) {
      console.error('Erro ao escrever log com lock:', error);
    } finally {
      LockedLogger.mutex.release();
    }
  }
}
