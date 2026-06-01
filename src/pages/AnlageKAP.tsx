import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import AnlageForm, { FieldDef } from '../components/AnlageForm';

const fields: FieldDef[] = [
  { key: 'capitalGains', label: 'Gesamtbetrag der Kapitalerträge', type: 'number', helpKey: 'forms.anlageKAP.capitalGainsHelp', min: 0, step: 100 },
  { key: 'capitalGainsTax', label: 'Kapitalertragsteuer (Abgeltungsteuer)', type: 'number', helpKey: 'forms.anlageKAP.capitalGainsTaxHelp', min: 0, step: 10 },
  { key: 'solidaritySurcharge', label: 'Solidaritätszuschlag auf Kapitalerträge', type: 'number', helpKey: 'forms.anlageKAP.solidarityHelp', min: 0, step: 10 },
  { key: 'churchTax', label: 'Kirchensteuer auf Kapitalerträge', type: 'number', helpKey: 'forms.anlageKAP.churchTaxHelp', min: 0, step: 10 },
  { key: 'interestIncome', label: 'Zinserträge', type: 'number', helpKey: 'forms.anlageKAP.interestHelp', min: 0, step: 100 },
  { key: 'dividendIncome', label: 'Dividendenerträge', type: 'number', helpKey: 'forms.anlageKAP.dividendHelp', min: 0, step: 100 },
  { key: 'foreignTaxes', label: 'Ausländische Quellensteuer', type: 'number', helpKey: 'forms.anlageKAP.foreignTaxHelp', min: 0, step: 10 },
  { key: 'hasSavingsAllowance', label: 'Sparer-Pauschbetrag (1.000 € / 2.000 €) nutzen', type: 'checkbox', helpKey: 'forms.anlageKAP.savingsAllowanceHelp' },
  { key: 'hasGainsTransactions', label: 'Veräußerungsgeschäfte (Wertpapiere, Fonds)', type: 'checkbox', helpKey: 'forms.anlageKAP.gainsTransactionsHelp' },
  { key: 'hasLosses', label: 'Verlustvortrag aus Aktienveräußerungen', type: 'checkbox', helpKey: 'forms.anlageKAP.lossesHelp' },
];

export default function AnlageKAP() {
  const { setApp, getForm, setForm } = useApp();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(getForm('anlageKAP') || {});

  function onChange(key: string, value: any) {
    setData((prev: any) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    setForm('anlageKAP', data);
    setApp({ page: 'formsOverview' });
  }

  return (
    <AnlageForm
      title={t.forms.anlageKAP.title}
      fields={fields}
      data={data}
      onChange={onChange}
      onSave={onSave}
      onBack={() => setApp({ page: 'formsOverview' })}
    />
  );
}
