import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import AnlageForm, { FieldDef } from '../components/AnlageForm';

const fields: FieldDef[] = [
  { key: 'selfEmploymentIncome', label: 'Einkünfte aus selbständiger Arbeit', type: 'number', helpKey: 'forms.anlageSO.selfEmploymentIncomeHelp', min: 0, step: 100 },
  { key: 'otherIncome', label: 'Sonstige Einkünfte (z.B. Unterhalt, Vermittlung)', type: 'number', helpKey: 'forms.anlageSO.otherIncomeHelp', min: 0, step: 100 },
  { key: 'alimonyReceived', label: 'Unterhaltsleistungen (erhalten)', type: 'number', helpKey: 'forms.anlageSO.alimonyReceivedHelp', min: 0, step: 100 },
  { key: 'alimonyPaid', label: 'Unterhaltsleistungen (gezahlt / Realsplitting)', type: 'number', helpKey: 'forms.anlageSO.alimonyPaidHelp', min: 0, step: 100 },
  { key: 'donations', label: 'Spenden und Mitgliedsbeiträge', type: 'number', helpKey: 'forms.anlageSO.donationsHelp', min: 0, step: 50 },
  { key: 'childcareCosts', label: 'Kinderbetreuungskosten', type: 'number', helpKey: 'forms.anlageSO.childcareCostsHelp', min: 0, step: 100 },
  { key: 'medicalExpenses', label: 'Außergewöhnliche Belastungen (Krankheitskosten)', type: 'number', helpKey: 'forms.anlageSO.medicalExpensesHelp', min: 0, step: 100 },
  { key: 'householdServices', label: 'Haushaltsnahe Dienstleistungen (Putzhilfe, etc.)', type: 'number', helpKey: 'forms.anlageSO.householdServicesHelp', min: 0, step: 100 },
  { key: 'craftsmanServices', label: 'Handwerkerleistungen (Renovierung, Reparatur)', type: 'number', helpKey: 'forms.anlageSO.craftsmanServicesHelp', min: 0, step: 100 },
  { key: 'hasTradeIncome', label: 'Einkünfte aus Gewerbebetrieb', type: 'checkbox', helpKey: 'forms.anlageSO.tradeIncomeHelp' },
  { key: 'hasAgriculture', label: 'Einkünfte aus Land- und Forstwirtschaft', type: 'checkbox', helpKey: 'forms.anlageSO.agricultureHelp' },
  { key: 'hasForeignIncome', label: 'Ausländische Einkünfte (Wohnsitz im Ausland)', type: 'checkbox', helpKey: 'forms.anlageSO.foreignIncomeHelp' },
];

export default function AnlageSO() {
  const { setApp, getForm, setForm } = useApp();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(getForm('anlageSO') || {});

  function onChange(key: string, value: any) {
    setData((prev: any) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    setForm('anlageSO', data);
    setApp({ page: 'formsOverview' });
  }

  return (
    <AnlageForm
      title={t.forms.anlageSO.title}
      fields={fields}
      data={data}
      onChange={onChange}
      onSave={onSave}
      onBack={() => setApp({ page: 'formsOverview' })}
    />
  );
}
