// Main-process OCR implementation
import { createWorker } from 'tesseract.js';
import log from 'electron-log';
import fs from 'fs';
import path from 'path';

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
  source: 'pdf' | 'ocr';
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

async function extractTextFromPDF(filePath: string): Promise<string> {
  log.info('Extracting text from PDF:', filePath);

  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
  const fileBuffer = fs.readFileSync(filePath);
  const data = new Uint8Array(fileBuffer);
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = '';
  let pagesWithText = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .filter((s: string) => s && s.trim().length > 0)
      .join(' ');

    if (pageText.trim().length > 0) {
      pagesWithText++;
      fullText += pageText + '\n';
    }
  }

  log.info('Extracted', fullText.length, 'characters from', pagesWithText, '/', pdf.numPages, 'pages');
  return fullText;
}

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
  let mimeType = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
  else if (ext === '.gif') mimeType = 'image/gif';
  else if (ext === '.webp') mimeType = 'image/webp';
  else if (ext === '.tif' || ext === '.tiff') mimeType = 'image/tiff';

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

  log.info('OCR completed, confidence:', result.data.confidence, 'text length:', text.length);

  return {
    text,
    confidence: result.data.confidence,
    lines,
    extractedData,
    source: 'ocr',
  };
}

export async function processFile(filePath: string): Promise<OCRResult> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    let pdfText = '';

    try {
      pdfText = await extractTextFromPDF(filePath);
      log.info('PDF text extraction completed, chars:', pdfText.length);
    } catch (pdfError) {
      log.error('PDF text extraction failed:', pdfError);
      pdfText = '';
    }

    const extractedFromPdf = analyzeDocument(pdfText);
    const hasMinimalData = Object.values(extractedFromPdf).some(v => v !== undefined && v !== 0);

    if (hasMinimalData) {
      const lines = pdfText.split('\n').filter(line => line.trim().length > 0);
      return {
        text: pdfText,
        confidence: 0.95,
        lines,
        extractedData: extractedFromPdf,
        source: 'pdf',
      };
    }

    log.info('PDF extraction produced minimal data, falling back to image OCR');

    try {
      const ocrResult = await processImage(filePath);
      return {
        text: ocrResult.text + '\n\n[Original PDF text: ' + pdfText + ']',
        confidence: ocrResult.confidence,
        lines: ocrResult.lines,
        extractedData: { ...extractedFromPdf, ...ocrResult.extractedData },
        source: 'ocr',
      };
    } catch (ocrError) {
      log.error('OCR also failed:', ocrError);
      throw new Error('Could not extract data from this PDF. Please ensure the file is a valid document or try uploading as an image.');
    }
  } else {
    return await processImage(filePath);
  }
}
