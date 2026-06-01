import { useState, useRef } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import { Button } from '../components/FormComponents';

const docTypes = ['payslip', 'bank_report', 'kap', 'rental', 'pension', 'so'];

interface Doc {
  id: string;
  name: string;
  type: string;
  size: number;
  date: string;
}

export default function Documents() {
  const { setApp } = useApp();
  const { t } = useLanguage();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docType, setDocType] = useState('payslip');
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
    }));
    setDocs((prev) => [...prev, ...newDocs]);
    if (inputRef.current) inputRef.current.value = '';
  }

  function remove(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.documents.title}</h1>
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
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
              <input ref={inputRef} type="file" multiple className="w-full text-sm" accept=".pdf,.jpg,.jpeg,.png,.tiff,.gif,.webp,.bmp" />
            </div>
            <Button onClick={handleUpload}>{t.documents.upload}</Button>
          </div>
        </div>

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
                    <td className="px-4 py-3">{d.name}</td>
                    <td className="px-4 py-3 text-gray-500">{formatSize(d.size)}</td>
                    <td className="px-4 py-3 text-gray-500">{d.date}</td>
                    <td className="px-4 py-3 text-right">
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
