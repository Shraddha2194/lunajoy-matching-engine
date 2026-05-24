import { matchClinicians } from '../lib/matchingEngine';

describe('LunaJoy Matching Engine', () => {

  const basePreferences = {
    state: 'CA',
    language: 'English',
    gender_preference: 'no preference',
    insurance_provider: 'Aetna',
    appointment_type: 'therapy',
    clinical_needs: ['anxiety'],
    preferred_time_slots: ['mornings'],
    urgency_level: 'flexible',
  };

  test('returns clinicians for valid CA + Aetna preferences', () => {
    const results = matchClinicians(basePreferences);
    expect(results.length).toBeGreaterThan(0);
  });

  test('top result has highest score', () => {
    const results = matchClinicians(basePreferences);
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
  });

  test('all results are licensed in CA', () => {
    const results = matchClinicians(basePreferences);
    results.forEach(result => {
      expect(result.clinician.state).toBe('CA');
    });
  });

  test('returns empty array for unsupported state', () => {
    const results = matchClinicians({ ...basePreferences, state: 'ZZ' });
    expect(results.length).toBe(0);
  });

  test('medication type excludes therapy-only clinicians', () => {
    const results = matchClinicians({
      ...basePreferences,
      appointment_type: 'medication',
    });
    results.forEach(result => {
      expect(result.clinician.appointment_types).toContain('medication');
    });
  });

  test('each result includes explanation and matched attributes', () => {
    const results = matchClinicians(basePreferences);
    results.forEach(result => {
      expect(result.explanation).toBeTruthy();
      expect(result.matched_attributes.length).toBeGreaterThan(0);
    });
  });

  test('TX clinicians not returned for CA patient', () => {
    const results = matchClinicians(basePreferences);
    results.forEach(result => {
      expect(result.clinician.state).not.toBe('TX');
    });
  });

});