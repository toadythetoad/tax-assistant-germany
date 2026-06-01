// Main-process OCR implementation – supports ALL document types
import { createWorker } from 'tesseract.js';
import log from 'electron-log';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { ocrBufferPaddle } from './ocrPaddle';

export const IMAGE_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.bmp': 'image/bmp',
};

export interface OCRResult {
  text: string;
  confidence: number;
  lines: string[];
  extractedData: {
    capitalGains?: number;
    withholdingTax?: number;
    solidaritySurcharge?: number;
    churchTax?: number;
    interestIncome?: number;
    dividendIncome?: number;
    foreignTaxes?: number;
    employerName?: string;
    grossSalary?: number;
    netSalary?: number;
    pensionContributions?: number;
    insurancePremiums?: number;
  };
  source: 'pdf' | 'ocr' | 'docx' | 'text';
  needsPageRendering?: boolean;
  pageCount?: number;
}

function extractGermanCurrency(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1].replace(',', '.').replace(/\./g, ''));
      if (!isNaN(value)) return value;
    }
  }
  return undefined;
}

function analyzeDocument(text: string): OCRResult['extractedData'] {
  const data: OCRResult['extractedData'] = {};

  data.capitalGains = extractGermanCurrency(text, [
    /Kapitalerträge?[:\s]*([\d.,]+)/i,
    /Gesamtbetrag\s+der\s+Erträge[:\s]*([\d.,]+)/i,
    /Erträge?[:\s]*([\d.,]+)/i,
    /Wertpapiererträge?[:\s]*([\d.,]+)/i,
  ]);

  data.withholdingTax = extractGermanCurrency(text, [
    /Quellensteuer[:\s]*([\d.,]+)/i,
    /Kapitalertragsteuer[:\s]*([\d.,]+)/i,
    /Abgeltungsteuer[:\s]*([\d.,]+)/i,
    /einbehaltene\s+Steuer[:\s]*([\d.,]+)/i,
  ]);

  data.solidaritySurcharge = extractGermanCurrency(text, [
    /Solidaritätszuschlag[:\s]*([\d.,]+)/i,
    /Soli[:\s]*([\d.,]+)/i,
  ]);

  data.churchTax = extractGermanCurrency(text, [/Kirchensteuer[:\s]*([\d.,]+)/i]);

  data.interestIncome = extractGermanCurrency(text, [
    /Zinserträge?[:\s]*([\d.,]+)/i,
    /Zinsen[:\s]*([\d.,]+)/i,
  ]);

  data.dividendIncome = extractGermanCurrency(text, [
    /Dividenden[:\s]*([\d.,]+)/i,
    /Ausschüttung[:\s]*([\d.,]+)/i,
  ]);

  for (const pattern of [
    /Arbeitgeber[:\s]*([A-Za-zÄÖÜäöüß\s]+?)(?:,|\n|$)/i,
    /Name\s+des\s+Arbeitgebers[:\s]*([A-Za-zÄÖÜäöüß\s]+?)(?:,|\n|$)/i,
  ]) {
    const match = text.match(pattern);
    if (match) {
      data.employerName = match[1].trim();
      break;
    }
  }

  data.grossSalary = extractGermanCurrency(text, [
    /Brutto(?:lohn|bezüge)?[:\s]*([\d.,]+)/i,
    /Gesamtbezüge?[:\s]*([\d.,]+)/i,
    /Bruttoarbeitslohn[:\s]*([\d.,]+)/i,
    /Jahresbrutto[:\s]*([\d.,]+)/i,
    /(?:Brutto|brutto)[\s\S]{0,50}?([\d]+[.,]\d{2})/i,
  ]);

  data.netSalary = extractGermanCurrency(text, [
    /Netto(?:lohn|bezüge)?[:\s]*([\d.,]+)/i,
    /Auszahlung[:\s]*([\d.,]+)/i,
    /Nettolohn[:\s]*([\d.,]+)/i,
    /(?:Netto|netto)[\s\S]{0,50}?([\d]+[.,]\d{2})/i,
  ]);

  data.pensionContributions = extractGermanCurrency(text, [
    /Rentenversicherung[:\s]*([\d.,]+)/i,
    /RV[:\s]*([\d.,]+)/i,
  ]);

  data.insurancePremiums = extractGermanCurrency(text, [
    /Krankenversicherung[:\s]*([\d.,]+)/i,
    /Pflegeversicherung[:\s]*([\d.,]+)/i,
    /Versicherungsbeiträge?[:\s]*([\d.,]+)/i,
  ]);

  return data;
}

// ── OCR image buffer (base64 data URL → text) ──────────────────────────────

export async function ocrImageBuffer(base64DataUrl: string): Promise<{ text: string; confidence: number }> {
  const worker = await createWorker('deu', undefined, {
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        log.info('Buffer OCR Progress:', Math.round(m.progress * 100) + '%');
      }
    },
  });
  const result = await worker.recognize(base64DataUrl);
  await worker.terminate();

  const confidence = result.data.confidence;
  const text = result.data.text;

  if (confidence < 0.5 || (text.trim().length > 0 && text.trim().length < 30)) {
    log.info('Tesseract insufficient on buffer, trying PaddleOCR fallback...');
    try {
      const base64Data = base64DataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const paddleResult = await ocrBufferPaddle(buffer);
      if (paddleResult.text.trim().length > text.trim().length) {
        return paddleResult;
      }
    } catch (e) {
      log.error('PaddleOCR buffer fallback failed:', e);
    }
  }

  return { text, confidence };
}

// ── DOCX extraction via mammoth ──────────────────────────────────────────────

async function extractTextFromDOCX(filePath: string): Promise<string> {
  log.info('Extracting text from DOCX:', filePath);
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// ── TXT / plain text ─────────────────────────────────────────────────────────

async function extractTextFromTXT(filePath: string): Promise<string> {
  log.info('Reading text file:', filePath);
  return fs.readFileSync(filePath, 'utf-8');
}

// ── Image OCR (jpg, png, tiff, gif, webp, bmp) ──────────────────────────────

async function processImage(filePath: string): Promise<OCRResult> {
  log.info('Starting image OCR for:', filePath);

  let imageBuffer: Buffer;
  try {
    imageBuffer = fs.readFileSync(filePath);
    log.info('File read successfully, size:', imageBuffer.length);
  } catch (err) {
    log.error('Failed to read file:', err);
    throw new Error(`Could not read file: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  let mimeType: string;
  const imageExts: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.bmp': 'image/bmp',
  };
  mimeType = imageExts[ext] || 'image/png';

  const base64 = imageBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const worker = await createWorker('deu', undefined, {
    logger: (m: any) => {
      if (m.status === 'recognizing text') {
        log.info('OCR Progress:', Math.round(m.progress * 100) + '%');
      }
    },
  });

  const result = await worker.recognize(dataUrl);
  await worker.terminate();

  const text = result.data.text;
  const lines = text.split('\n').filter((line: string) => line.trim().length > 0);
  const extractedData = analyzeDocument(text);
  const confidence = result.data.confidence;

  log.info('Tesseract OCR completed, confidence:', confidence, 'text length:', text.length);

  // Try PaddleOCR as fallback when Tesseract confidence is low or text is too sparse
  if (confidence < 0.5 || (text.trim().length > 0 && text.trim().length < 30)) {
    log.info('Tesseract quality insufficient, falling back to PaddleOCR...');
    try {
      const paddleResult = await ocrBufferPaddle(imageBuffer);
      const paddleText = paddleResult.text;
      const paddleLines = paddleText.split('\n').filter((l: string) => l.trim().length > 0);
      const paddleExtracted = analyzeDocument(paddleText);

      const tesseractHasData = Object.values(extractedData).some(v => v !== undefined && v !== 0);
      const paddleHasData = Object.values(paddleExtracted).some(v => v !== undefined && v !== 0);

      log.info('PaddleOCR confidence:', paddleResult.confidence, 'text length:', paddleText.length,
        'Tesseract had data:', tesseractHasData, 'Paddle has data:', paddleHasData);

      // Use PaddleOCR result if it found more data or has better coverage
      if (paddleHasData || paddleResult.confidence > confidence) {
        return {
          text: paddleText,
          confidence: paddleResult.confidence,
          lines: paddleLines,
          extractedData: paddleExtracted,
          source: 'ocr',
        };
      }
    } catch (paddleError) {
      log.error('PaddleOCR fallback failed:', paddleError);
    }
  }

  return {
    text,
    confidence,
    lines,
    extractedData,
    source: 'ocr',
  };
}

// ── Main dispatcher ──────────────────────────────────────────────────────────

export async function processFile(filePath: string): Promise<OCRResult> {
  const ext = path.extname(filePath).toLowerCase();

  // ── PDF ──────────────────────────────────────────────────────────────────
  if (ext === '.pdf') {
    let pdfText = '';
    let pageCount = 0;

    try {
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
      const fileBuffer = fs.readFileSync(filePath);
      const data = new Uint8Array(fileBuffer);
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      pageCount = pdf.numPages;

      let pagesWithText = 0;
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .filter((s: string) => s && s.trim().length > 0)
          .join(' ');
        if (pageText.trim().length > 0) {
          pagesWithText++;
          pdfText += pageText + '\n';
        }
      }
      log.info('PDF: extracted', pdfText.length, 'chars from', pagesWithText, '/', pageCount, 'pages');
    } catch (pdfError) {
      log.error('PDF processing failed:', pdfError);
    }

    const extractedFromPdf = analyzeDocument(pdfText);
    const hasData = Object.values(extractedFromPdf).some(v => v !== undefined && v !== 0);
    const hasText = pdfText.trim().length > 50;

    if (hasData || hasText) {
      const lines = pdfText.split('\n').filter(l => l.trim().length > 0);
      return {
        text: pdfText,
        confidence: 0.95,
        lines,
        extractedData: extractedFromPdf,
        source: 'pdf',
      };
    }

    // No extractable text → signal renderer to render pages
    log.info('PDF has no text layer (' + pageCount + ' pages), requesting renderer-side page rendering');
    return {
      text: '',
      confidence: 0,
      lines: [],
      extractedData: {},
      source: 'pdf',
      needsPageRendering: true,
      pageCount,
    };
  }

  // ── DOCX ─────────────────────────────────────────────────────────────────
  if (ext === '.docx' || ext === '.doc') {
    try {
      const text = await extractTextFromDOCX(filePath);
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const extractedData = analyzeDocument(text);
      return {
        text,
        confidence: 0.9,
        lines,
        extractedData,
        source: 'docx',
      };
    } catch (docxError) {
      log.error('DOCX extraction failed:', docxError);
      throw new Error('Konnte die DOCX-Datei nicht lesen. Bitte als PDF oder Bild exportieren.');
    }
  }

  // ── TXT ──────────────────────────────────────────────────────────────────
  if (ext === '.txt') {
    try {
      const text = await extractTextFromTXT(filePath);
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const extractedData = analyzeDocument(text);
      return {
        text,
        confidence: 1.0,
        lines,
        extractedData,
        source: 'text',
      };
    } catch (txtError) {
      log.error('TXT reading failed:', txtError);
      throw new Error('Konnte die Textdatei nicht lesen.');
    }
  }

  // ── Images (jpg, jpeg, png, tif, tiff, gif, webp, bmp) ───────────────────
  const imageExts = ['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.webp', '.bmp'];
  if (imageExts.includes(ext)) {
    return await processImage(filePath);
  }

  throw new Error(
    `Nicht unterstütztes Dateiformat: ${ext}. ` +
    `Erlaubt: PDF, DOCX, TXT sowie Bilder (JPG, PNG, TIFF, GIF, WebP, BMP).`
  );
}
