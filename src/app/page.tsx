'use client';

import { useState } from 'react';

const STATES = ['CA', 'TX', 'NY', 'FL'];
const LANGUAGES = ['English', 'Spanish', 'Hindi', 'Mandarin', 'Korean', 'Gujarati'];
const GENDERS = ['no preference', 'female', 'male'];
const INSURANCE = ['Aetna', 'BlueCross', 'Cigna', 'United', 'Medicaid'];
const APPOINTMENT_TYPES = ['therapy', 'medication'];
const CLINICAL_NEEDS = ['anxiety', 'depression', 'trauma', 'PTSD', 'grief', 'OCD', 'perinatal', 'postpartum', 'couples therapy', 'LGBTQ+', 'cultural adjustment'];
const TIME_SLOTS = ['mornings', 'afternoons', 'evenings', 'weekends'];
const URGENCY = ['immediate', 'flexible'];

export default function Home() {
  const [form, setForm] = useState({
    state: '',
    language: 'English',
    gender_preference: 'no preference',
    insurance_provider: '',
    appointment_type: 'therapy',
    clinical_needs: [] as string[],
    preferred_time_slots: [] as string[],
    urgency_level: 'flexible',
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleItem = (field: 'clinical_needs' | 'preferred_time_slots', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async () => {
    if (!form.state || !form.insurance_provider) {
      setError('Please select your state and insurance provider.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResults(data.matches || []);
      setSubmitted(true);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">L</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">LunaJoy</h1>
            <p className="text-xs text-gray-500">Smart Clinician Matching</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {!submitted ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find your ideal clinician</h2>
              <p className="text-gray-500">Tell us about your preferences and we'll match you with the best-fit mental health professionals.</p>
            </div>

            <div className="space-y-6">
              {/* State */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your State *</label>
                <div className="flex flex-wrap gap-2">
                  {STATES.map(s => (
                    <button key={s} onClick={() => setForm(p => ({ ...p, state: s }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${form.state === s ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointment Type */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Appointment Type *</label>
                <div className="flex gap-3">
                  {APPOINTMENT_TYPES.map(t => (
                    <button key={t} onClick={() => setForm(p => ({ ...p, appointment_type: t, clinical_needs: [] }))}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all capitalize ${form.appointment_type === t ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Needs — hidden for medication */}
              {form.appointment_type !== 'medication' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Clinical Needs</label>
                  <div className="flex flex-wrap gap-2">
                    {CLINICAL_NEEDS.map(need => (
                      <button key={need} onClick={() => toggleItem('clinical_needs', need)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${form.clinical_needs.includes(need) ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}>
                        {need}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Insurance */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Insurance Provider *</label>
                <div className="flex flex-wrap gap-2">
                  {INSURANCE.map(ins => (
                    <button key={ins} onClick={() => setForm(p => ({ ...p, insurance_provider: ins }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${form.insurance_provider === ins ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                      {ins}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Language</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button key={lang} onClick={() => setForm(p => ({ ...p, language: lang }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${form.language === lang ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Clinician Gender Preference</label>
                <div className="flex gap-2">
                  {GENDERS.map(g => (
                    <button key={g} onClick={() => setForm(p => ({ ...p, gender_preference: g }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${form.gender_preference === g ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Time Slots</label>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} onClick={() => toggleItem('preferred_time_slots', slot)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize ${form.preferred_time_slots.includes(slot) ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">How soon do you need to be seen?</label>
                <div className="flex gap-3">
                  {URGENCY.map(u => (
                    <button key={u} onClick={() => setForm(p => ({ ...p, urgency_level: u }))}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all capitalize ${form.urgency_level === u ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                      {u === 'immediate' ? '⚡ Immediate' : '🗓 Flexible'}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl transition-all shadow-md disabled:opacity-50">
                {loading ? 'Finding your matches...' : 'Find My Clinician →'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Matches</h2>
                <p className="text-gray-500">{results.length} clinicians matched your preferences</p>
              </div>
              <button onClick={() => setSubmitted(false)}
                className="px-4 py-2 text-sm text-violet-600 border border-violet-200 rounded-full hover:bg-violet-50 transition-all">
                ← Start Over
              </button>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">No clinicians found for your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your state or insurance provider.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((match, index) => (
                  <div key={match.clinician.id}
                    className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${index === 0 ? 'border-violet-200 ring-1 ring-violet-100' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-violet-600' : 'bg-gray-400'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{match.clinician.name}</h3>
                          <p className="text-sm text-gray-500">{match.clinician.state} · ⭐ {match.clinician.rating}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${index === 0 ? 'text-violet-600' : 'text-gray-600'}`}>
                          {match.score}pts
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${match.availability ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {match.availability ? '● Available' : '○ Limited'}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 italic">"{match.explanation}"</p>

                    <div className="flex flex-wrap gap-2">
                      {match.matched_attributes.map((attr: string) => (
                        <span key={attr} className="text-xs px-3 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                          ✓ {attr}
                        </span>
                      ))}
                    </div>

                    {index === 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-all">
                          Book Appointment
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}