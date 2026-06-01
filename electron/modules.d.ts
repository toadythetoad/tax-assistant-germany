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
declare module 'pdfkit' {
  class PDFDocument {
    constructor(options?: { size?: string; margin?: number; info?: Record<string, string> });
    fontSize(size: number): this;
    font(name: string): this;
    fillColor(color: string): this;
    text(text: string, options?: { align?: string; width?: number }): this;
    text(text: string, x?: number, y?: number, options?: { align?: string; width?: number }): this;
    moveDown(lines?: number): this;
    rect(x: number, y: number, width: number, height: number): this;
    fillAndStroke(fillColor: string, strokeColor: string): this;
    pipe(stream: any): this;
    end(): void;
    addPage(): this;
    page: { width: number; height: number };
    y: number;
    switchToPage(index: number): void;
    bufferedPageRange(): { total: number };
  }
  export default PDFDocument;
}
