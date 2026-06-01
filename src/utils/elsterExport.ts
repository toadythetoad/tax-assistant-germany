export interface TaxData {
  year: number;
  state: string;
  profile: Record<string, any>;
  forms: Record<string, any>;
}

export function generateElsterXml(data: TaxData): string {
  const { year, state, profile, forms } = data;

  const anlageN = forms.anlageN || {};
  const anlageKAP = forms.anlageKAP || {};
  const anlageV = forms.anlageV || {};
  const anlageR = forms.anlageR || {};
  const anlageSO = forms.anlageSO || {};
  const anlageVorsorge = forms.anlageVorsorge || {};

  const totalIncome =
    (anlageN.grossSalary || 0) +
    (anlageKAP.capitalGains || 0) +
    (anlageV.rentalIncome || 0) +
    (anlageR.statutoryPension || 0) +
    (anlageR.privatePension || 0) +
    (anlageSO.selfEmploymentIncome || 0) +
    (anlageSO.otherIncome || 0);

  const totalDeductions =
    (anlageN.advertisingCosts || 0) +
    (anlageV.advertisingCosts || 0) +
    (anlageV.interestExpenses || 0) +
    (anlageV.maintenanceCosts || 0) +
    (anlageN.pensionContribution || 0) +
    (anlageN.healthInsurance || 0) +
    (anlageN.nursingInsurance || 0) +
    (anlageSO.donations || 0) +
    (anlageSO.childcareCosts || 0) +
    (anlageSO.medicalExpenses || 0) +
    (anlageSO.householdServices || 0) +
    (anlageSO.craftsmanServices || 0) +
    (anlageVorsorge.healthInsurance || 0) +
    (anlageVorsorge.statutoryPensionInsurance || 0);

  const taxableIncome = Math.max(0, totalIncome - totalDeductions);

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<ElsterExport Version="1.0" ErstellDatum="${new Date().toISOString().slice(0, 10)}">`,
    `  <Kopf>`,
    `    <Programm>Steuer Assistent 2.0</Programm>`,
    `    <Version>2.0.0</Version>`,
    `    <Veranlagungsjahr>${year}</Veranlagungsjahr>`,
    `    <Bundesland>${state}</Bundesland>`,
    `  </Kopf>`,
    `  <Steuerpflichtiger>`,
    `    <Name>${escapeXml(profile.lastName || '')}</Name>`,
    `    <Vorname>${escapeXml(profile.firstName || '')}</Vorname>`,
    `    <Strasse>${escapeXml(profile.street || '')}</Strasse>`,
    `    <Hausnummer>${escapeXml(profile.houseNumber || '')}</Hausnummer>`,
    `    <PLZ>${escapeXml(profile.postalCode || '')}</PLZ>`,
    `    <Ort>${escapeXml(profile.city || '')}</Ort>`,
    `    <SteuerID>${escapeXml(profile.taxId || '')}</SteuerID>`,
    `    <Steuernummer>${escapeXml(profile.taxNumber || '')}</Steuernummer>`,
    `    <Geburtsdatum>${escapeXml(profile.dateOfBirth || '')}</Geburtsdatum>`,
    `    <Familienstand>${escapeXml(profile.maritalStatus || 'single')}</Familienstand>`,
    `    <Religion>${escapeXml(profile.religion || 'none')}</Religion>`,
    `    <Kinder>${profile.children || 0}</Kinder>`,
    `  </Steuerpflichtiger>`,
    `  <Einkuenfte>`,
    `    <AnlageN>`,
    `      <Bruttoarbeitslohn>${anlageN.grossSalary || 0}</Bruttoarbeitslohn>`,
    `      <Nettolohn>${anlageN.netSalary || 0}</Nettolohn>`,
    `      <Lohnsteuer>${anlageN.taxWithheld || 0}</Lohnsteuer>`,
    `      <Solidaritaetszuschlag>${anlageN.solidaritySurcharge || 0}</Solidaritaetszuschlag>`,
    `      <Kirchensteuer>${anlageN.churchTax || 0}</Kirchensteuer>`,
    `      <Werbungskosten>${anlageN.advertisingCosts || 0}</Werbungskosten>`,
    `    </AnlageN>`,
    `    <AnlageKAP>`,
    `      <Kapitalertraege>${anlageKAP.capitalGains || 0}</Kapitalertraege>`,
    `      <Kapitalertragsteuer>${anlageKAP.capitalGainsTax || 0}</Kapitalertragsteuer>`,
    `      <Zinsertraege>${anlageKAP.interestIncome || 0}</Zinsertraege>`,
    `      <Dividenden>${anlageKAP.dividendIncome || 0}</Dividenden>`,
    `      <AuslaendischeSteuer>${anlageKAP.foreignTaxes || 0}</AuslaendischeSteuer>`,
    `    </AnlageKAP>`,
    `    <AnlageV>`,
    `      <Einnahmen>${anlageV.rentalIncome || 0}</Einnahmen>`,
    `      <Werbungskosten>${anlageV.advertisingCosts || 0}</Werbungskosten>`,
    `      <Schuldzinsen>${anlageV.interestExpenses || 0}</Schuldzinsen>`,
    `      <AfA>${anlageV.depreciation || 0}</AfA>`,
    `    </AnlageV>`,
    `    <AnlageR>`,
    `      <GesetzlicheRente>${anlageR.statutoryPension || 0}</GesetzlicheRente>`,
    `      <PrivateRente>${anlageR.privatePension || 0}</PrivateRente>`,
    `      <Betriebsrente>${anlageR.companyPension || 0}</Betriebsrente>`,
    `      <Besteuerungsanteil>${anlageR.pensionTaxRate || 83}</Besteuerungsanteil>`,
    `    </AnlageR>`,
    `    <AnlageSO>`,
    `      <SelbstaendigeArbeit>${anlageSO.selfEmploymentIncome || 0}</SelbstaendigeArbeit>`,
    `      <SonstigeEinkuenfte>${anlageSO.otherIncome || 0}</SonstigeEinkuenfte>`,
    `      <Spenden>${anlageSO.donations || 0}</Spenden>`,
    `      <Kinderbetreuung>${anlageSO.childcareCosts || 0}</Kinderbetreuung>`,
    `      <AussergewoehnlicheBelastungen>${anlageSO.medicalExpenses || 0}</AussergewoehnlicheBelastungen>`,
    `    </AnlageSO>`,
    `    <Vorsorge>`,
    `      <Krankenversicherung>${anlageVorsorge.healthInsurance || 0}</Krankenversicherung>`,
    `      <Pflegeversicherung>${anlageVorsorge.nursingInsurance || 0}</Pflegeversicherung>`,
    `      <Rentenversicherung>${anlageVorsorge.statutoryPensionInsurance || 0}</Rentenversicherung>`,
    `    </Vorsorge>`,
    `  </Einkuenfte>`,
    `  <Berechnung>`,
    `    <Gesamteinkuenfte>${totalIncome}</Gesamteinkuenfte>`,
    `    <Gesamtabzuege>${totalDeductions}</Gesamtabzuege>`,
    `    <ZuVersteuern>${taxableIncome}</ZuVersteuern>`,
    `  </Berechnung>`,
    `</ElsterExport>`,
  ];

  return lines.join('\n');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
