import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import AnlageForm, { FieldDef } from '../components/AnlageForm';

const fields: FieldDef[] = [
  { key: 'employerName', label: 'Name des Arbeitgebers', helpKey: 'forms.anlageN.employerNameHelp' },
  { key: 'grossSalary', label: 'Bruttoarbeitslohn (Jahresbrutto)', type: 'number', helpKey: 'forms.anlageN.grossSalaryHelp', min: 0, step: 100 },
  { key: 'netSalary', label: 'Nettolohn (Auszahlungsbetrag)', type: 'number', helpKey: 'forms.anlageN.netSalaryHelp', min: 0, step: 100 },
  { key: 'taxWithheld', label: 'Einbehaltene Lohnsteuer', type: 'number', helpKey: 'forms.anlageN.taxWithheldHelp', min: 0, step: 100 },
  { key: 'solidaritySurcharge', label: 'Solidaritätszuschlag', type: 'number', helpKey: 'forms.anlageN.solidarityHelp', min: 0, step: 10 },
  { key: 'churchTax', label: 'Kirchensteuer', type: 'number', helpKey: 'forms.anlageN.churchTaxHelp', min: 0, step: 10 },
  { key: 'pensionContribution', label: 'Rentenversicherungsbeiträge', type: 'number', helpKey: 'forms.anlageN.pensionHelp', min: 0, step: 100 },
  { key: 'healthInsurance', label: 'Krankenversicherungsbeiträge', type: 'number', helpKey: 'forms.anlageN.healthInsuranceHelp', min: 0, step: 100 },
  { key: 'nursingInsurance', label: 'Pflegeversicherungsbeiträge', type: 'number', helpKey: 'forms.anlageN.nursingInsuranceHelp', min: 0, step: 100 },
  { key: 'advertisingCosts', label: 'Werbungskosten (z.B. Fahrtkosten, Arbeitsmittel)', type: 'number', helpKey: 'interview.expensesAdvertisingHelp', min: 0, max: 2000, step: 50 },
  { key: 'hasMultipleEmployers', label: 'Mehrere Dienstverhältnisse gleichzeitig', type: 'checkbox', helpKey: 'forms.anlageN.multipleEmployersHelp' },
  { key: 'hasSeverance', label: 'Entschädigung / Abfindung erhalten', type: 'checkbox', helpKey: 'forms.anlageN.severanceHelp' },
];

export default function AnlageN() {
  const { setApp, getForm, setForm, saveYearData } = useApp();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(getForm('anlageN') || {});

  function onChange(key: string, value: any) {
    setData((prev: any) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    setForm('anlageN', data);
    saveYearData();
    setApp({ page: 'formsOverview' });
  }

  return (
    <AnlageForm
      title={t.forms.anlageN.title}
      fields={fields}
      data={data}
      onChange={onChange}
      onSave={onSave}
      onBack={() => setApp({ page: 'formsOverview' })}
    />
  );
}
