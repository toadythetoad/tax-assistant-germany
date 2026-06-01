import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import AnlageForm, { FieldDef } from '../components/AnlageForm';

const fields: FieldDef[] = [
  { key: 'statutoryPension', label: 'Gesetzliche Rente (Rentenbezugsmitteilung)', type: 'number', helpKey: 'forms.anlageR.statutoryPensionHelp', min: 0, step: 100 },
  { key: 'privatePension', label: 'Private Rentenversicherung (Leibrente)', type: 'number', helpKey: 'forms.anlageR.privatePensionHelp', min: 0, step: 100 },
  { key: 'companyPension', label: 'Betriebsrente / Werkspension', type: 'number', helpKey: 'forms.anlageR.companyPensionHelp', min: 0, step: 100 },
  { key: 'pensionFromEmployment', label: 'Versorgungsbezüge (früheres Dienstverhältnis)', type: 'number', helpKey: 'forms.anlageR.pensionFromEmploymentHelp', min: 0, step: 100 },
  { key: 'widowPension', label: 'Witwen-/Witwerrente (Hinterbliebenenbezüge)', type: 'number', helpKey: 'forms.anlageR.widowPensionHelp', min: 0, step: 100 },
  { key: 'orphanPension', label: 'Waisenrente', type: 'number', helpKey: 'forms.anlageR.orphanPensionHelp', min: 0, step: 100 },
  { key: 'pensionTaxRate', label: 'Besteuerungsanteil in % (z.B. 83% bei Rentenbeginn 2024)', type: 'number', helpKey: 'forms.anlageR.pensionTaxRateHelp', min: 0, max: 100, step: 1 },
  { key: 'pensionInsuranceContributions', label: 'Kranken-/Pflegeversicherung auf Rente', type: 'number', helpKey: 'forms.anlageR.pensionInsuranceContributionsHelp', min: 0, step: 50 },
  { key: 'hasLumpSettlement', label: 'Einmalige Kapitalauszahlung erhalten', type: 'checkbox', helpKey: 'forms.anlageR.lumpSettlementHelp' },
  { key: 'hasForeignPension', label: 'Ausländische Rentenbezüge', type: 'checkbox', helpKey: 'forms.anlageR.foreignPensionHelp' },
];

export default function AnlageR() {
  const { setApp, getForm, setForm, saveYearData } = useApp();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(getForm('anlageR') || {});

  function onChange(key: string, value: any) {
    setData((prev: any) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    setForm('anlageR', data);
    saveYearData();
    setApp({ page: 'formsOverview' });
  }

  return (
    <AnlageForm
      title={t.forms.anlageR.title}
      fields={fields}
      data={data}
      onChange={onChange}
      onSave={onSave}
      onBack={() => setApp({ page: 'formsOverview' })}
    />
  );
}
