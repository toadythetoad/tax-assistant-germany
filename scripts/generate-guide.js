const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, '..', 'public', 'help', 'anleitung.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 50, right: 50 },
  info: { Title: 'Steuer Assistent 2.0 – Bedienungsanleitung' },
});

doc.pipe(fs.createWriteStream(outPath));

function h1(text) {
  doc.fontSize(18).font('Helvetica-Bold').fillColor('#163E64').text(text, { underline: true });
  doc.moveDown(0.5);
}

function h2(text) {
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#163E64').text(text);
  doc.moveDown(0.3);
}

function p(text) {
  doc.fontSize(10).font('Helvetica').fillColor('#333').text(text, { align: 'justify' });
  doc.moveDown(0.3);
}

function bullet(text) {
  doc.fontSize(10).font('Helvetica').fillColor('#333').text('• ' + text, { indent: 15 });
  doc.moveDown(0.15);
}

function spacer() { doc.moveDown(0.5); }

// ── Titel ──
doc.fontSize(24).font('Helvetica-Bold').fillColor('#163E64').text('Steuer Assistent 2.0', { align: 'center' });
doc.fontSize(14).font('Helvetica').fillColor('#666').text('Bedienungsanleitung', { align: 'center' });
doc.moveDown(1.5);

// ── 1. Einleitung ──
h1('1. Einleitung');
p('Der Steuer Assistent 2.0 hilft Ihnen, Ihre Einkommensteuererklärung schnell und unkompliziert zu erstellen. Die App läuft als Desktop-Anwendung unter Windows und speichert alle Daten lokal auf Ihrem Rechner.');
p('Folgende Funktionen stehen zur Verfügung:');
bullet('Erfassung aller Einkunftsarten und Ausgaben im Interview-Modus');
bullet('OCR-Erkennung von Lohnsteuerbescheiden und anderen Dokumenten');
bullet('Ausfüllen der amtlichen Anlagen (N, KAP, V, R, SO, Vorsorge)');
bullet('Automatische Steuerberechnung nach §32a EStG 2024');
bullet('Export als ELSTER-XML für die elektronische Übermittlung');

// ── 2. Erste Schritte ──
h1('2. Erste Schritte');
h2('2.1 Profil anlegen');
p('Klicken Sie im Dashboard auf "Profil" und geben Sie Ihre persönlichen Daten ein:');
bullet('Name, Adresse, Steuer-ID und Steuernummer');
bullet('Bundesland (wichtig für Kirchensteuersatz)');
bullet('Familienstand (Ledig/Verheiratet – beeinflusst Splittingtabelle)');
bullet('Religionszugehörigkeit (für Kirchensteuer)');
bullet('Anzahl der Kinder (für Kinderfreibetrag)');

h2('2.2 Steuerjahr wählen');
p('Im Dashboard können Sie oben das gewünschte Steuerjahr auswählen (2020–2026). Die Daten werden jahresweise getrennt gespeichert. Beim ersten Wechsel in ein neues Jahr können Sie die Daten aus dem Vorjahr übernehmen.');

// ── 3. Einkünfte erfassen ──
h1('3. Einkünfte und Ausgaben erfassen');
p('Klicken Sie im Dashboard auf "Interview starten". Der Assistent führt Sie Schritt für Schritt durch alle relevanten Kategorien:');
bullet('Persönliche Angaben (Kinder)');
bullet('Einkünfte (Gehalt, Selbstständigkeit, Kapital, Vermietung, Rente, Sonstige)');
bullet('Werbungskosten, Sonderausgaben, Haushaltsnahe Dienstleistungen');
bullet('Außergewöhnliche Belastungen, Spenden, Versicherungsbeiträge');
bullet('Bereits gezahlte Steuern (Lohnsteuer, Solidaritätszuschlag, Kirchensteuer, Kapitalertragsteuer)');

// ── 4. OCR-Dokumentenerkennung ──
h1('4. Dokumenten-Upload & OCR');
h2('4.1 Unterstützte Formate');
p('Sie können folgende Dateitypen hochladen:');
bullet('PDF (mit Textschicht oder als gescanntes Bild)');
bullet('DOCX / DOC (Word-Dokumente)');
bullet('TXT (reine Textdateien)');
bullet('Bilder: JPG, PNG, TIFF, GIF, WebP, BMP');

h2('4.2 OCR-Erkennung');
p('Die App verwendet drei Verfahren zur Texterkennung:');
bullet('PDF-Text: Direkte Extraktion bei PDFs mit Textschicht');
bullet('PaddleOCR: Neuronales Netz (ONNX) – primär für gescannte Dokumente und Lohnsteuerbescheide');
bullet('Tesseract.js: Fallback für Bilddateien mit niedriger Qualität');
p('Nach dem Upload wird das Dokument im linken Bereich angezeigt. Rechts sehen Sie die erkannten Daten, die Sie vor der Übernahme korrigieren können.');

h2('4.3 OCR-Ergebnisse prüfen');
p('Die erkannten Werte werden in Eingabefeldern angezeigt. Prüfen Sie die Daten mit dem Dokument in der Vorschau und korrigieren Sie sie bei Bedarf manuell. Klicken Sie dann auf "Daten übernehmen".');

// ── 5. Steuerformulare ──
h1('5. Steuerformulare (Anlagen)');
p('Die App enthält folgende amtliche Formulare:');
bullet('Anlage N – Einkünfte aus nichtselbstständiger Arbeit');
bullet('Anlage KAP – Kapitaleinkünfte');
bullet('Anlage V – Vermietung und Verpachtung');
bullet('Anlage R – Renten und andere Leistungen');
bullet('Anlage SO – Sonstige Einkünfte');
bullet('Anlage Vorsorge – Vorsorgeaufwendungen');
p('Jedes Formular enthält kontextbezogene Hilfetexte zu jedem Feld. Füllen Sie die relevanten Formulare aus und speichern Sie sie.');

// ── 6. Steuerberechnung ──
h1('6. Steuerberechnung');
p('Die Steuerberechnung erfolgt nach dem amtlichen Tarif des §32a EStG 2024:');
bullet('Grundfreibetrag: 11.604 € (Single) / 23.208 € (Verheiratet)');
bullet('Progressionszone 1: 11.605–17.005 € mit Formelsteuer');
bullet('Progressionszone 2: 17.006–66.760 € mit Formelsteuer');
bullet('Spitzensteuersatz: 42 % (66.761–277.825 €)');
bullet('Reichensteuer: 45 % (ab 277.826 €)');
p('Die Berechnung zeigt Ihnen:');
bullet('Steuerschuld (Einkommensteuer + Soli + Kirchensteuer)');
bullet('Bereits gezahlte Steuern (aus dem OCR-Import)');
bullet('Erstattung (grün) oder Nachzahlung (rot)');

// ── 7. ELSTER-Export ──
h1('7. ELSTER-Export');
p('Nach der Berechnung können Sie Ihre Daten als ELSTER-XML exportieren:');
bullet('Klicken Sie im Dashboard auf "ELSTER-Export"');
bullet('Prüfen Sie die zusammengestellten Daten');
bullet('Klicken Sie auf "XML herunterladen"');
bullet('Laden Sie die XML-Datei in Ihr ELSTER-Konto hoch (www.elster.de)');
p('Hinweis: Der Export ersetzt nicht die Prüfung durch einen Steuerberater bei komplexen Sachverhalten.');

// ── 8. Sprache ──
h1('8. Sprache umschalten');
p('Die App unterstützt Deutsch und Englisch. Klicken Sie auf den DE/EN-Button unten rechts, um die Sprache zu wechseln. Die Einstellung bleibt für die gesamte Sitzung erhalten.');

// ── 9. Fehlerbehebung ──
h1('9. Fehlerbehebung');
h2('9.1 OCR erkennt keine Daten');
p('Stellen Sie sicher, dass das Dokument gut lesbar ist (ausreichende Auflösung, kein Text im Hintergrund). Bei gescannten PDFs wird PaddleOCR verwendet – die Erkennung kann bei sehr schlechter Qualität eingeschränkt sein.');

h2('9.2 Steuerberechnung stimmt nicht');
p('Prüfen Sie, ob alle Einkünfte und Ausgaben korrekt erfasst wurden. Stellen Sie sicher, dass der Familienstand und das Bundesland im Profil korrekt eingestellt sind.');

h2('9.3 XML-Export wird von ELSTER nicht akzeptiert');
p('Stellen Sie sicher, dass Sie das korrekte Steuerjahr ausgewählt haben. Prüfen Sie, ob alle Pflichtfelder ausgefüllt sind. Bei wiederholten Fehlern wenden Sie sich an das ELSTER-Hilfeportal.');

// ── 10. Datenschutz ──
h1('10. Datenschutz & Speicherung');
p('Alle Daten werden ausschließlich lokal auf Ihrem Rechner gespeichert. Es findet keine Übermittlung an externe Server statt. Die Datenbank (SQLite) befindet sich im Benutzerverzeichnis Ihrer Anwendung.');
p('Die OCR-Verarbeitung (PaddleOCR, Tesseract) läuft vollständig lokal – Ihre Dokumente verlassen nie Ihren Rechner.');

// ── Footer ──
doc.moveDown(2);
doc.fontSize(8).font('Helvetica').fillColor('#999').text('Stand: Mai 2026 | Steuer Assistent 2.0', { align: 'center' });

doc.end();

console.log('anleitung.pdf generated at', outPath);
