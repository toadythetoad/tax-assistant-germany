import { useState, useEffect, useRef } from 'react';

interface Props {
  file: File;
}

type PreviewState = 'loading' | 'ready' | 'error';

export default function DocumentPreview({ file }: Props) {
  const [state, setState] = useState<PreviewState>('loading');
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [docxHtml, setDocxHtml] = useState('');
  const [textContent, setTextContent] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

  useEffect(() => {
    loadPreview();
  }, [file]);

  async function loadPreview() {
    setState('loading');
    setError('');

    try {
      if (ext === '.pdf') {
        await loadPDF();
      } else if (['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.webp', '.bmp'].includes(ext)) {
        await loadImage();
      } else if (ext === '.txt') {
        await loadText();
      } else if (ext === '.docx') {
        await loadDocx();
      } else {
        throw new Error('Vorschau nicht verfügbar für dieses Format');
      }
      setState('ready');
    } catch (e) {
      setError(String(e));
      setState('error');
    }
  }

  async function loadPDF() {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url,
    ).toString();

    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const renderedPages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      renderedPages.push(canvas.toDataURL('image/jpeg', 0.9));
    }

    setPages(renderedPages);
  }

  async function loadImage() {
    const dataUrl = await readAsDataURL(file);
    setPreviewUrl(dataUrl);
  }

  async function loadText() {
    const text = await readAsText(file);
    setTextContent(text);
  }

  async function loadDocx() {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await import('mammoth');
    const result = await mammoth.convertToHtml({ arrayBuffer });
    setDocxHtml(result.value);
  }

  function readAsDataURL(f: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    });
  }

  function readAsText(f: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsText(f);
    });
  }

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl border">
        <div className="text-gray-500">Lade Vorschau...</div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl border text-red-500 p-4 text-sm text-center">
        {error}
      </div>
    );
  }

  // PDF pages
  if (pages.length > 0) {
    return (
      <div className="bg-gray-100 rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-white border-b text-sm text-gray-600">
          <span>{file.name}</span>
          {pages.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40 text-xs"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                ←
              </button>
              <span>{currentPage + 1} / {pages.length}</span>
              <button
                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40 text-xs"
                disabled={currentPage === pages.length - 1}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                →
              </button>
            </div>
          )}
        </div>
        <div className="overflow-auto max-h-[70vh] flex justify-center p-2">
          <img src={pages[currentPage]} alt={`Seite ${currentPage + 1}`} className="shadow-md max-w-full" />
        </div>
      </div>
    );
  }

  // Image
  if (previewUrl) {
    return (
      <div className="bg-gray-100 rounded-xl border overflow-hidden">
        <div className="px-3 py-2 bg-white border-b text-sm text-gray-600">{file.name}</div>
        <div className="overflow-auto max-h-[70vh] flex justify-center p-2">
          <img src={previewUrl} alt="Vorschau" className="shadow-md max-w-full" />
        </div>
      </div>
    );
  }

  // DOCX
  if (docxHtml) {
    return (
      <div className="bg-gray-100 rounded-xl border overflow-hidden">
        <div className="px-3 py-2 bg-white border-b text-sm text-gray-600">{file.name}</div>
        <div className="overflow-auto max-h-[70vh] p-4 bg-white text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: docxHtml }} />
      </div>
    );
  }

  // TXT
  if (textContent) {
    return (
      <div className="bg-gray-100 rounded-xl border overflow-hidden">
        <div className="px-3 py-2 bg-white border-b text-sm text-gray-600">{file.name}</div>
        <pre className="overflow-auto max-h-[70vh] p-4 bg-white text-xs font-mono whitespace-pre-wrap">
          {textContent}
        </pre>
      </div>
    );
  }

  return null;
}
