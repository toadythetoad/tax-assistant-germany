interface ExtractedData {
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
}

interface OCRResult {
  text: string;
  confidence: number;
  lines: string[];
  extractedData: ExtractedData;
  source: string;
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

function analyzeDocument(text: string): ExtractedData {
  const data: ExtractedData = {};
  data.capitalGains = extractGermanCurrency(text, [/Kapitalerträge?[:\s]*([\d.,]+)/i, /Gesamtbetrag\s+der\s+Erträge[:\s]*([\d.,]+)/i, /Erträge?[:\s]*([\d.,]+)/i, /Wertpapiererträge?[:\s]*([\d.,]+)/i]);
  data.withholdingTax = extractGermanCurrency(text, [/Quellensteuer[:\s]*([\d.,]+)/i, /Kapitalertragsteuer[:\s]*([\d.,]+)/i, /Abgeltungsteuer[:\s]*([\d.,]+)/i, /einbehaltene\s+Steuer[:\s]*([\d.,]+)/i]);
  data.solidaritySurcharge = extractGermanCurrency(text, [/Solidaritätszuschlag[:\s]*([\d.,]+)/i, /Soli[:\s]*([\d.,]+)/i]);
  data.churchTax = extractGermanCurrency(text, [/Kirchensteuer[:\s]*([\d.,]+)/i]);
  data.interestIncome = extractGermanCurrency(text, [/Zinserträge?[:\s]*([\d.,]+)/i, /Zinsen[:\s]*([\d.,]+)/i]);
  data.dividendIncome = extractGermanCurrency(text, [/Dividenden[:\s]*([\d.,]+)/i, /Ausschüttung[:\s]*([\d.,]+)/i]);
  for (const pattern of [/Arbeitgeber[:\s]*([A-Za-zÄÖÜäöüß\s]+?)(?:,|\n|$)/i, /Name\s+des\s+Arbeitgebers[:\s]*([A-Za-zÄÖÜäöüß\s]+?)(?:,|\n|$)/i]) {
    const match = text.match(pattern);
    if (match) { data.employerName = match[1].trim(); break; }
  }
  data.grossSalary = extractGermanCurrency(text, [/Brutto(?:lohn|bezüge)?[:\s]*([\d.,]+)/i, /Gesamtbezüge?[:\s]*([\d.,]+)/i, /Bruttoarbeitslohn[:\s]*([\d.,]+)/i, /Jahresbrutto[:\s]*([\d.,]+)/i, /(?:Brutto|brutto)[\s\S]{0,50}?([\d]+[.,]\d{2})/i]);
  data.netSalary = extractGermanCurrency(text, [/Netto(?:lohn|bezüge)?[:\s]*([\d.,]+)/i, /Auszahlung[:\s]*([\d.,]+)/i, /Nettolohn[:\s]*([\d.,]+)/i, /(?:Netto|netto)[\s\S]{0,50}?([\d]+[.,]\d{2})/i]);
  data.pensionContributions = extractGermanCurrency(text, [/Rentenversicherung[:\s]*([\d.,]+)/i, /RV[:\s]*([\d.,]+)/i]);
  data.insurancePremiums = extractGermanCurrency(text, [/Krankenversicherung[:\s]*([\d.,]+)/i, /Pflegeversicherung[:\s]*([\d.,]+)/i, /Versicherungsbeiträge?[:\s]*([\d.,]+)/i]);
  return data;
}

async function renderPDFPages(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const result = await (window as any).electronAPI.ocr.ocrImageBuffer(dataUrl);
    if (result.error) throw new Error(result.error);
    fullText += result.text + '\n';
  }

  return fullText;
}

export async function processFile(file: File): Promise<OCRResult> {
  const filePath = (file as any).path;
  if (!filePath) {
    return { text: '', confidence: 0, lines: [], extractedData: {}, source: 'unknown' };
  }

  const ext = filePath.toLowerCase().slice(filePath.lastIndexOf('.'));
  const imageExts = ['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.webp', '.bmp'];

  if (ext === '.pdf') {
    const result = await (window as any).electronAPI.ocr.processFile(filePath);
    if (result.error) throw new Error(result.error);

    if (result.needsPageRendering) {
      const text = await renderPDFPages(file);
      const lines = text.split('\n').filter((l: string) => l.trim().length > 0);
      const extractedData = analyzeDocument(text);
      return { text, confidence: 0.7, lines, extractedData, source: 'ocr' };
    }

    return result as OCRResult;
  }

  if (ext === '.docx' || ext === '.doc' || ext === '.txt' || imageExts.includes(ext)) {
    const result = await (window as any).electronAPI.ocr.processFile(filePath);
    if (result.error) throw new Error(result.error);
    return result as OCRResult;
  }

  throw new Error(`Nicht unterstütztes Format: ${ext}. Erlaubt: PDF, DOCX, TXT, JPG, PNG, TIFF, GIF, WebP, BMP.`);
}
