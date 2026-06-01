import { useState } from 'react';
import { useApp, useLanguage } from '../store/AppContext';
import { Input, Select, Button } from '../components/FormComponents';

const maritalOptions = [
  { value: 'single', key: 'maritalSingle' },
  { value: 'married', key: 'maritalMarried' },
  { value: 'divorced', key: 'maritalDivorced' },
  { value: 'widowed', key: 'maritalWidowed' },
  { value: 'registered', key: 'maritalRegistered' },
];

const religionOptions = [
  { value: 'none', key: 'religionNone' },
  { value: 'catholic', key: 'religionCatholic' },
  { value: 'protestant', key: 'religionProtestant' },
  { value: 'muslim', key: 'religionMuslim' },
  { value: 'jewish', key: 'religionJewish' },
  { value: 'other', key: 'religionOther' },
];

const employmentOptions = [
  { value: 'employed', key: 'employed' },
  { value: 'selfEmployed', key: 'selfEmployed' },
  { value: 'civilServant', key: 'civilServant' },
  { value: 'retired', key: 'retired' },
  { value: 'student', key: 'student' },
  { value: 'other', key: 'other' },
];

const states = [
  { code: 'BW', de: 'Baden-Württemberg', en: 'Baden-Württemberg' },
  { code: 'BY', de: 'Bayern', en: 'Bavaria' },
  { code: 'BE', de: 'Berlin', en: 'Berlin' },
  { code: 'BB', de: 'Brandenburg', en: 'Brandenburg' },
  { code: 'HB', de: 'Bremen', en: 'Bremen' },
  { code: 'HH', de: 'Hamburg', en: 'Hamburg' },
  { code: 'HE', de: 'Hessen', en: 'Hesse' },
  { code: 'MV', de: 'Mecklenburg-Vorpommern', en: 'Mecklenburg-Western Pomerania' },
  { code: 'NI', de: 'Niedersachsen', en: 'Lower Saxony' },
  { code: 'NW', de: 'Nordrhein-Westfalen', en: 'North Rhine-Westphalia' },
  { code: 'RP', de: 'Rheinland-Pfalz', en: 'Rhineland-Palatinate' },
  { code: 'SL', de: 'Saarland', en: 'Saarland' },
  { code: 'SN', de: 'Sachsen', en: 'Saxony' },
  { code: 'ST', de: 'Sachsen-Anhalt', en: 'Saxony-Anhalt' },
  { code: 'SH', de: 'Schleswig-Holstein', en: 'Schleswig-Holstein' },
  { code: 'TH', de: 'Thüringen', en: 'Thuringia' },
];

export default function Profile() {
  const { app, setApp } = useApp();
  const { t, language } = useLanguage();
  const [form, setForm] = useState<any>(app.profile || {});
  const [saved, setSaved] = useState(false);

  function save() {
    setApp({ profile: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function set(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">{t.profile.title}</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
            <Button onClick={save}>{t.common.save}</Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {t.profile.saveSuccess}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t.profile.firstName}
              value={form.firstName || ''}
              onChange={(e) => set('firstName', e.target.value)}
              required
            />
            <Input
              label={t.profile.lastName}
              value={form.lastName || ''}
              onChange={(e) => set('lastName', e.target.value)}
              required
            />
            <Input
              label={t.profile.street}
              value={form.street || ''}
              onChange={(e) => set('street', e.target.value)}
            />
            <Input
              label={t.profile.houseNumber}
              value={form.houseNumber || ''}
              onChange={(e) => set('houseNumber', e.target.value)}
            />
            <Input
              label={t.profile.postalCode}
              value={form.postalCode || ''}
              onChange={(e) => set('postalCode', e.target.value)}
            />
            <Input
              label={t.profile.city}
              value={form.city || ''}
              onChange={(e) => set('city', e.target.value)}
            />
          </div>

          <Select
            label={t.profile.state}
            helpKey="profile.stateHelp"
            value={form.state || app.state}
            onChange={(e) => set('state', e.target.value)}
          >
            {states.map((s) => (
              <option key={s.code} value={s.code}>{language === 'de' ? s.de : s.en}</option>
            ))}
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Input
              label={t.profile.taxId}
              helpKey="profile.taxIdHelp"
              value={form.taxId || ''}
              onChange={(e) => set('taxId', e.target.value)}
              maxLength={11}
            />
            <Input
              label={t.profile.taxNumber}
              helpKey="profile.taxNumberHelp"
              value={form.taxNumber || ''}
              onChange={(e) => set('taxNumber', e.target.value)}
            />
            <Input
              label={t.profile.dateOfBirth}
              type="date"
              value={form.dateOfBirth || ''}
              onChange={(e) => set('dateOfBirth', e.target.value)}
            />
            <Input
              label={t.profile.children}
              helpKey="profile.childrenHelp"
              type="number"
              min={0}
              value={form.children || 0}
              onChange={(e) => set('children', parseInt(e.target.value) || 0)}
            />
          </div>

          <Select
            label={t.profile.maritalStatus}
            helpKey="profile.maritalStatusHelp"
            value={form.maritalStatus || 'single'}
            onChange={(e) => set('maritalStatus', e.target.value)}
          >
            {maritalOptions.map((o) => (
              <option key={o.value} value={o.value}>{(t.profile as any)[o.key]}</option>
            ))}
          </Select>

          <Select
            label={t.profile.religion}
            helpKey="profile.religionHelp"
            value={form.religion || 'none'}
            onChange={(e) => set('religion', e.target.value)}
          >
            {religionOptions.map((o) => (
              <option key={o.value} value={o.value}>{(t.profile as any)[o.key]}</option>
            ))}
          </Select>

          <Select
            label={t.profile.employment}
            value={form.employment || 'employed'}
            onChange={(e) => set('employment', e.target.value)}
          >
            {employmentOptions.map((o) => (
              <option key={o.value} value={o.value}>{(t.profile as any)[o.key]}</option>
            ))}
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t.profile.employer}
              helpKey="profile.employerInfo"
              value={form.employer || ''}
              onChange={(e) => set('employer', e.target.value)}
            />
            <Input
              label={t.profile.position}
              value={form.position || ''}
              onChange={(e) => set('position', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => setApp({ page: 'dashboard' })}>{t.common.back}</Button>
          <Button onClick={save}>{t.common.save}</Button>
        </div>
      </div>
    </div>
  );
}
