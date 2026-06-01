import { useState, useRef } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';
import DocumentPreview from '../components/DocumentPreview';

const docTypes = ['payslip', 'bank_report', 'kap', 'rental', 'pension', 'so'];

interface Doc {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
  file: File;
}

export default function Documents() {
  const { setApp } = useApp();
  const { t } = useLanguage();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docType, setDocType] = useState('payslip');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUpload() {
    const files = inputRef.current?.files;
    if (!files?.length) return;
    const newDocs: Doc[] = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      type: docType,
      size: f.size,
      date: new Date().toISOString().slice(0, 10),
      file: f,
    }));
    setDocs((prev) => [...prev, ...newDocs]);
    if (inputRef.current) inputRef.current.value = '';
  }

  function remove(id: string) {
    setDocs((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (previewFile && !next.find((d) => d.file === previewFile)) {
        setPreviewFile(null);
      }
      return next;
    });
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.documents.title}</h1>
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.documents.selectType}</label>
              <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {docTypes.map((dt) => (
                  <option key={dt} value={dt}>{(t.documents.types as any)[dt]}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.documents.selectFiles}</label>
              <input ref={inputRef} type="file" multiple className="w-full text-sm" accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png,.tiff,.tif,.gif,.webp,.bmp" />
            </div>
            <Button onClick={handleUpload}>{t.documents.upload}</Button>
          </div>
        </div>

        {previewFile && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-900">Vorschau: {previewFile.name}</h2>
              <Button variant="ghost" onClick={() => setPreviewFile(null)}>Schließen</Button>
            </div>
            <DocumentPreview file={previewFile} />
          </div>
        )}

        {docs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-400">{t.documents.noDocuments}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Typ</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Größe</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Datum</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-3">{(t.documents.types as any)[d.type]}</td>
                    <td className="px-4 py-3">
                      <button
                        className="text-blue-600 hover:underline text-left"
                        onClick={() => setPreviewFile(d.file)}
                      >
                        {d.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatSize(d.size)}</td>
                    <td className="px-4 py-3 text-gray-500">{d.date}</td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      <Button variant="secondary" onClick={() => setPreviewFile(d.file)}>Anzeigen</Button>
                      <Button variant="danger" onClick={() => remove(d.id)}>{t.documents.delete}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
