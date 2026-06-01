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
}

export async function processFile(file: File): Promise<OCRResult> {
  const filePath = (file as any).path;
  if (!filePath) {
    return {
      text: '',
      confidence: 0,
      lines: [],
      extractedData: {},
      source: 'unknown',
    };
  }
  const result = await window.electronAPI.ocr.processFile(filePath);
  if (result.error) throw new Error(result.error);
  return result as OCRResult;
}
