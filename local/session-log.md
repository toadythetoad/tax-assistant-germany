# Steuer Assistent 2.0 — Entwicklungschronik

## Projektstruktur
- `src/pages/` — React-Seiten (Dashboard, Interview, PayslipUpload, Calculation, AnlageN/KAP/V/R/SO/Vorsorge, etc.)
- `src/components/` — Wiederverwendbare UI (DropZone, DocumentPreview, LanguageToggle, FormComponents)
- `src/store/AppContext.tsx` — Globaler State (AppContext + LanguageContext)
- `electron/` — Main-Process Code (main.ts, preload.ts, ocr.ts, ocrPaddle.ts, database.ts)
- `public/help/` — Enthält anleitung.pdf
- `src/utils/taxCalculator.ts` — Steuerberechnung nach §32a EStG

## Kern-Features (implementiert)

### OCR-Pipeline
- **3 OCR-Engines**: PDF-Text (pdfjs-dist) → Tesseract.js → PaddleOCR (ppu-paddle-ocr + onnxruntime)
- **Fallback-Logik**: Tesseract für Bilder, PaddleOCR primär für gescannte PDF-Seiten
- **Dateiformate**: PDF (Text + gescannt), DOCX/DOC (mammoth), TXT, JPG, PNG, TIFF, GIF, WebP, BMP
- **Gescannte PDFs**: Renderer rendert Seiten per Canvas → PaddleOCR (primär) → Tesseract (Fallback)

### Dokumenten-Vorschau (DocumentPreview)
- PDF mit Seitennavigation, Bilder, DOCX (HTML-Konvertierung), TXT
- Split-Layout in PayslipUpload: links Vorschau, rechts OCR-Ergebnisse
- Vorschau auch in Documents-Seite (Klick auf Dateinamen)

### Steuerberechnung
- **§32a EStG Tarif 2024**: Grundfreibetrag (11.604€), 2 Progressionszonen, Spitzen-/Reichensteuer
- **Splittingtabelle** für Verheiratete
- **Solidaritätszuschlag** 5,5% (Freigrenze 18.000€/36.000€)
- **Kirchensteuer** 8% (BY/BW) / 9% (restliche Bundesländer)
- **Kinderfreibetrag** (9.540€/Kind) vs. Kindergeld (250€/Monat)
- **Nachzahlung/Rückzahlung**: Steuerschuld − bereits gezahlte Steuern (Lohnsteuer, Soli, KiSt, Kapitalertragsteuer)
- **Farbcodierung**: Grün = Erstattung, Rot = Nachzahlung

### Multi-Jahr-Speicherung
- Jahresumschalter im Dashboard
- `saveYearData` / `loadYearData` / `importFromPreviousYear`
- Auto-Save beim Speichern von Formular-Seiten

### Weitere Features
- 16 Bundesländer mit Kirchensteuersätzen
- DE/EN i18n mit LanguageToggle (bottom-right fixiert)
- ELSTER-XML-Export
- Hilfe-Seite mit ELSTER-Links + anleitung.pdf
- SQLite-Datenbank (Profildaten)
- Dark-Mode-fähiges CSS (Tailwind)

## Session-Logs

### 2026-05-19
- OCR erweitert: mammoth (DOCX), TXT-Reader, Dateityp-Prüfung
- PDF-Rendering im Renderer statt node-canvas (kein Visual Studio nötig)
- DocumentPreview-Komponente + Split-Layout in PayslipUpload
- LanguageToggle global fixiert (bottom-right)

### 2026-05-22
- PaddleOCR als Fallback via ppu-paddle-ocr + onnxruntime
- PaddleOCR primär für gescannte PDF-Seiten (ocrImageBuffer)
- Steuerberechnung: §32a Tarif 2024, Splitting, Nachzahlung/Rückzahlung
- Interview: Schritt "Bereits gezahlte Steuern"
- Documents: Datei-Vorschau mit DocumentPreview
- LanguageToggle: bottom-right (kein Overlap)
- anleitung.pdf: PDFkit-generiertes Handbuch
- log.md erstellt

## Build & Deploy
- Build: `npm run build` (Vite + TSC)
- Packaging: `npm run package` → `release/Steuer Assistent 2.0.exe`
- Git: `main`-Branch, Push zu GitHub
