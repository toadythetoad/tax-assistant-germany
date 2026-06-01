import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import AnlageForm, { FieldDef } from '../components/AnlageForm';

const fields: FieldDef[] = [
  { key: 'healthInsurance', label: 'Krankenversicherungsbeiträge (Basisabsicherung)', type: 'number', helpKey: 'forms.anlageVorsorge.healthInsuranceHelp', min: 0, step: 100 },
  { key: 'nursingInsurance', label: 'Pflegeversicherungsbeiträge', type: 'number', helpKey: 'forms.anlageVorsorge.nursingInsuranceHelp', min: 0, step: 50 },
  { key: 'statutoryPensionInsurance', label: 'Gesetzliche Rentenversicherungsbeiträge', type: 'number', helpKey: 'forms.anlageVorsorge.statutoryPensionInsuranceHelp', min: 0, step: 100 },
  { key: 'privatePensionInsurance', label: 'Private Altersvorsorge (Riester, Rürup)', type: 'number', helpKey: 'forms.anlageVorsorge.privatePensionInsuranceHelp', min: 0, step: 100 },
  { key: 'occupationalDisability', label: 'Berufsunfähigkeitsversicherung', type: 'number', helpKey: 'forms.anlageVorsorge.occupationalDisabilityHelp', min: 0, step: 100 },
  { key: 'liabilityInsurance', label: 'Haftpflichtversicherung', type: 'number', helpKey: 'forms.anlageVorsorge.liabilityInsuranceHelp', min: 0, step: 50 },
  { key: 'accidentInsurance', label: 'Unfallversicherung', type: 'number', helpKey: 'forms.anlageVorsorge.accidentInsuranceHelp', min: 0, step: 50 },
  { key: 'lifeInsurance', label: 'Kapitallebensversicherung (Altverträge)', type: 'number', helpKey: 'forms.anlageVorsorge.lifeInsuranceHelp', min: 0, step: 100 },
  { key: 'funeralInsurance', label: 'Sterbegeldversicherung / Bestattungsvorsorge', type: 'number', helpKey: 'forms.anlageVorsorge.funeralInsuranceHelp', min: 0, step: 50 },
  { key: 'hasEmployerSubsidy', label: 'Arbeitgeberzuschuss zur KV/PV erhalten', type: 'checkbox', helpKey: 'forms.anlageVorsorge.employerSubsidyHelp' },
];

export default function AnlageVorsorge() {
  const { setApp, getForm, setForm, saveYearData } = useApp();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(getForm('anlageVorsorge') || {});

  function onChange(key: string, value: any) {
    setData((prev: any) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    setForm('anlageVorsorge', data);
    saveYearData();
    setApp({ page: 'formsOverview' });
  }

  return (
    <AnlageForm
      title={t.forms.anlageVorsorge.title}
      fields={fields}
      data={data}
      onChange={onChange}
      onSave={onSave}
      onBack={() => setApp({ page: 'formsOverview' })}
    />
  );
}
