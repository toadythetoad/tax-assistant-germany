import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import AnlageForm, { FieldDef } from '../components/AnlageForm';

const fields: FieldDef[] = [
  { key: 'rentalIncome', label: 'Einnahmen aus Vermietung (jährlich)', type: 'number', helpKey: 'forms.anlageV.rentalIncomeHelp', min: 0, step: 100 },
  { key: 'hasMultipleProperties', label: 'Mehrere Objekte (Mehrfamilienhaus, Gewerbe)', type: 'checkbox', helpKey: 'forms.anlageV.multiplePropertiesHelp' },
  { key: 'advertisingCosts', label: 'Werbungskosten (Zinsen, AfA, Instandhaltung)', type: 'number', helpKey: 'forms.anlageV.advertisingCostsHelp', min: 0, step: 100 },
  { key: 'interestExpenses', label: 'Schuldzinsen (Darlehen für Immobilie)', type: 'number', helpKey: 'forms.anlageV.interestExpensesHelp', min: 0, step: 100 },
  { key: 'depreciation', label: 'Abschreibung (AfA)', type: 'number', helpKey: 'forms.anlageV.depreciationHelp', min: 0, step: 100 },
  { key: 'maintenanceCosts', label: 'Erhaltungsaufwendungen (Renovierung, Reparatur)', type: 'number', helpKey: 'forms.anlageV.maintenanceCostsHelp', min: 0, step: 100 },
  { key: 'propertyTax', label: 'Grundsteuer', type: 'number', helpKey: 'forms.anlageV.propertyTaxHelp', min: 0, step: 50 },
  { key: 'insuranceCosts', label: 'Versicherungsbeiträge (Gebäude-, Haftpflicht)', type: 'number', helpKey: 'forms.anlageV.insuranceCostsHelp', min: 0, step: 50 },
  { key: 'managementCosts', label: 'Verwaltungskosten (Hausverwaltung)', type: 'number', helpKey: 'forms.anlageV.managementCostsHelp', min: 0, step: 50 },
  { key: 'isEmpty', label: 'Wohnung stand leer (keine Einnahmen)', type: 'checkbox', helpKey: 'forms.anlageV.emptyHelp' },
  { key: 'isSelfUsed', label: 'Selbstgenutzte Wohnung (keine Vermietung)', type: 'checkbox', helpKey: 'forms.anlageV.selfUsedHelp' },
];

export default function AnlageV() {
  const { setApp, getForm, setForm, saveYearData } = useApp();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(getForm('anlageV') || {});

  function onChange(key: string, value: any) {
    setData((prev: any) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    setForm('anlageV', data);
    saveYearData();
    setApp({ page: 'formsOverview' });
  }

  return (
    <AnlageForm
      title={t.forms.anlageV.title}
      fields={fields}
      data={data}
      onChange={onChange}
      onSave={onSave}
      onBack={() => setApp({ page: 'formsOverview' })}
    />
  );
}
