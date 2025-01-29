import chalk from 'chalk';
import { Worker } from 'worker_threads';

export class CircuitBreaker {
  constructor({ timeout = 30000, threshold = 3 } = {}) {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.timeout = timeout;
    this.threshold = threshold;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), this.timeout))
      ]);
      this.reset();
      return result;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= this.threshold) {
        this.trip();
      }
      throw err;
    }
  }

  trip() {
    this.state = 'OPEN';
    setTimeout(() => this.reset(), this.timeout);
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
  }
}

export function createWorker(task) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), {
      workerData: task
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

export const logger = {
  info: msg => console.log(chalk.blue(`[INFO] ${msg}`)),
  success: msg => console.log(chalk.green(`[✓] ${msg}`)),
  error: msg => console.log(chalk.red(`[✗] ${msg}`)),
  warn: msg => console.log(chalk.yellow(`[!] ${msg}`))
};
