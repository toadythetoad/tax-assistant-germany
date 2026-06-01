import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import DropZone from '../components/DropZone';
import { Input, Button } from '../components/FormComponents';
import { processFile as doOCR } from '../utils/ocrClient';
import DocumentPreview from '../components/DocumentPreview';

export default function PayslipUpload() {
  const { app, setApp } = useApp();
  const { t } = useLanguage();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    setUploadedFile(file);
    setProcessing(true);
    setError(null);
    setOcrResult(null);
    setResult(null);
    try {
      const ocr = await doOCR(file);
      setOcrResult(ocr);
      setResult({
        grossIncome: ocr.extractedData.grossSalary || 0,
        netSalary: ocr.extractedData.netSalary || 0,
        employer: ocr.extractedData.employerName || '',
        capitalGains: ocr.extractedData.capitalGains || 0,
        withholdingTax: ocr.extractedData.withholdingTax || 0,
        solidaritySurcharge: ocr.extractedData.solidaritySurcharge || 0,
        churchTax: ocr.extractedData.churchTax || 0,
        pensionContributions: ocr.extractedData.pensionContributions || 0,
        insurancePremiums: ocr.extractedData.insurancePremiums || 0,
      });
    } catch (e) {
      setError(String(e));
    } finally {
      setProcessing(false);
    }
  }

  function apply() {
    setApp({ taxReturn: { ...app.taxReturn, ...result } });
    setApp({ page: 'interview' });
  }

  function formatCurrency(v?: number) {
    if (!v) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(v);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.payslipUpload.title}</h1>
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-gray-600 mb-4">{t.payslipUpload.description}</p>
          <DropZone onFiles={handleFiles} accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png,.tiff,.tif,.gif,.webp,.bmp" disabled={processing} />
          {processing && (
            <div className="mt-4 flex items-center gap-3 text-blue-600">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>{t.payslipUpload.processing}</span>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{t.payslipUpload.error}: {error}</p>
            </div>
          )}
        </div>

        {uploadedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <DocumentPreview file={uploadedFile} />
            </div>
            <div>
              {result ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="font-semibold text-green-700 mb-3">{t.payslipUpload.success}</h2>
                  <p className="text-sm text-gray-500 mb-4">{t.payslipUpload.confirmData}</p>

                  {ocrResult && (
                    <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
                      <span className="font-medium">Erkennung:</span> {Math.round(ocrResult.confidence * 100)}%
                      ({ocrResult.source === 'ocr' ? 'Bild-OCR' : ocrResult.source === 'pdf' ? 'PDF-Text' : ocrResult.source === 'docx' ? 'DOCX' : 'Text'})
                    </div>
                  )}

                  <div className="space-y-4">
                    {result.employer && (
                      <div className="flex justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Arbeitgeber</span>
                        <span className="font-medium">{result.employer}</span>
                      </div>
                    )}
                    <Input label="Bruttojahreseinkommen" type="number" value={result.grossIncome || ''}
                      onChange={(e) => setResult({ ...result, grossIncome: parseFloat(e.target.value) || 0 })} />
                    <Input label="Nettogehalt" type="number" value={result.netSalary || ''}
                      onChange={(e) => setResult({ ...result, netSalary: parseFloat(e.target.value) || 0 })} />
                    {result.capitalGains > 0 && (
                      <Input label="Kapitalerträge" type="number" value={result.capitalGains || ''}
                        onChange={(e) => setResult({ ...result, capitalGains: parseFloat(e.target.value) || 0 })} />
                    )}
                    {result.pensionContributions > 0 && (
                      <Input label="Rentenversicherung" type="number" value={result.pensionContributions || ''}
                        onChange={(e) => setResult({ ...result, pensionContributions: parseFloat(e.target.value) || 0 })} />
                    )}
                    {result.insurancePremiums > 0 && (
                      <Input label="Kranken-/Pflegeversicherung" type="number" value={result.insurancePremiums || ''}
                        onChange={(e) => setResult({ ...result, insurancePremiums: parseFloat(e.target.value) || 0 })} />
                    )}
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button variant="secondary" onClick={() => { setResult(null); setOcrResult(null); setUploadedFile(null); }}>
                      {t.payslipUpload.discard}
                    </Button>
                    <Button onClick={apply}>{t.payslipUpload.applyData}</Button>
                  </div>
                </div>
              ) : processing ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center h-64">
                  <div className="text-gray-500">OCR wird ausgeführt...</div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
