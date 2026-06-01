import log from 'electron-log';
import path from 'path';
import fs from 'fs';

let service: any = null;
let initialized = false;

export async function getPaddleService() {
  if (initialized && service) return service;

  const { PaddleOcrService } = require('ppu-paddle-ocr');
  service = new PaddleOcrService({
    debugging: { verbose: false, debug: false },
    detection: {
      maxSideLength: 960,
      minimumAreaThreshold: 30,
    },
    recognition: {
      strategy: 'per-line',
    },
    session: {
      executionProviders: ['cpu'],
    },
  });

  log.info('Initializing PaddleOCR (model download on first run)...');
  await service.initialize();
  initialized = true;
  log.info('PaddleOCR ready');
  return service;
}

export async function ocrImagePaddle(imagePath: string): Promise<{ text: string; confidence: number }> {
  const svc = await getPaddleService();
  const buffer = fs.readFileSync(imagePath);
  const result = await svc.recognize(buffer, { flatten: true });
  return { text: result.text, confidence: result.confidence };
}

export async function ocrBufferPaddle(buffer: Buffer): Promise<{ text: string; confidence: number }> {
  const svc = await getPaddleService();
  const result = await svc.recognize(buffer, { flatten: true });
  return { text: result.text, confidence: result.confidence };
}

export async function resetPaddleService() {
  if (service) {
    try { await service.destroy(); } catch {}
  }
  service = null;
  initialized = false;
}
