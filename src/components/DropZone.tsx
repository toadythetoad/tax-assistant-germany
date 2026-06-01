import { useState, useRef, DragEvent } from 'react';
import { useLanguage } from '../store/AppContext';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export default function DropZone({ onFiles, accept, multiple, disabled }: DropZoneProps) {
  const { t } = useLanguage();
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setActive(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }

  function handleChange() {
    const files = inputRef.current?.files;
    if (files?.length) onFiles(Array.from(files));
  }

  return (
    <div
      className={`dropzone ${active ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setActive(true); }}
      onDragLeave={() => setActive(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="text-gray-600">{t.payslipUpload?.dropzone || 'Dateien hier ablegen'}</p>
      <p className="text-xs text-gray-400 mt-2">{t.payslipUpload?.supportedFormats || ''}</p>
    </div>
  );
}
