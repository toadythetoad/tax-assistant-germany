declare module 'tesseract.js' {
  export function createWorker(
    lang?: string, options?: any, config?: { logger?: (m: any) => void }
  ): Promise<{
    recognize: (data: any) => Promise<{ data: { text: string; confidence: number } }>;
    terminate: () => Promise<void>;
  }>;
}
declare module 'electron-log' {
  const log: { info: (...args: any[]) => void; warn: (...args: any[]) => void; error: (...args: any[]) => void; debug: (...args: any[]) => void; verbose: (...args: any[]) => void; initialize: () => void };
  export default log;
}
