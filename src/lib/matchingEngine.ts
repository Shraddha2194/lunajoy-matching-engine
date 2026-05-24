import cliniciansData from '../data/clinicians.json';

export interface PatientPreferences {
  state: string;
  language: string;
  gender_preference: string;
  insurance_provider: string;
  appointment_type: string;
  clinical_needs: string[];
  preferred_time_slots: string[];
  urgency_level: string;
}

export interface Clinician {
  id: string;
  name: string;
  state: string;
  languages: string[];
  gender: string;
  insurance: string[];
  specialties: string[];
  appointment_types: string[];
  availability_windows: string[];
  next_available_hours: number;
  current_load: number;
  max_load: number;
  rating: number;
}

export interface MatchResult {
  clinician: Clinician;
  score: number;
  explanation: string;
  matched_attributes: string[];
  availability: boolean;
}

export function matchClinicians(preferences: PatientPreferences): MatchResult[] {
  const clinicians = cliniciansData as Clinician[];
  const results: MatchResult[] = [];

  for (const clinician of clinicians) {
    let score = 0;
    const matched_attributes: string[] = [];

    // State match — highest priority (30 points)
    if (clinician.state === preferences.state) {
      score += 30;
      matched_attributes.push('Licensed in your state');
    } else {
      continue; // Hard filter — skip clinicians not in patient's state
    }

    // Insurance match (25 points)
    if (clinician.insurance.includes(preferences.insurance_provider)) {
      score += 25;
      matched_attributes.push('Accepts your insurance');
    }

    // Language match (15 points)
    if (clinician.languages.includes(preferences.language)) {
      score += 15;
      matched_attributes.push('Speaks your preferred language');
    }

    // Appointment type match (hard filter)
    if (!clinician.appointment_types.includes(preferences.appointment_type)) {
      continue;
    }
    matched_attributes.push('Offers your appointment type');

    // Specialty match (15 points total)
    if (preferences.appointment_type !== 'medication') {
      const overlappingSpecialties = clinician.specialties.filter(s =>
        preferences.clinical_needs.includes(s)
      );
      if (overlappingSpecialties.length > 0) {
        score += Math.min(overlappingSpecialties.length * 5, 15);
        matched_attributes.push(`Specialises in: ${overlappingSpecialties.join(', ')}`);
      }
    }

    // Gender preference (10 points)
    if (
      preferences.gender_preference === 'no preference' ||
      clinician.gender === preferences.gender_preference
    ) {
      score += 10;
      matched_attributes.push('Matches gender preference');
    }

    // Availability windows (10 points)
    const overlappingSlots = clinician.availability_windows.filter(w =>
      preferences.preferred_time_slots.includes(w)
    );
    if (overlappingSlots.length > 0) {
      score += 10;
      matched_attributes.push(`Available during your preferred times`);
    }

    // Urgency + availability (10 points)
    const availability = clinician.next_available_hours <= 72;
    if (preferences.urgency_level === 'immediate' && clinician.next_available_hours <= 24) {
      score += 10;
      matched_attributes.push('Available within 24 hours');
    } else if (preferences.urgency_level === 'flexible') {
      score += 5;
    }

    // Load balancing (5 points) — reward clinicians with capacity
    const loadRatio = clinician.current_load / clinician.max_load;
    if (loadRatio < 0.5) {
      score += 5;
      matched_attributes.push('High availability capacity');
    } else if (loadRatio < 0.8) {
      score += 2;
    }

    // Build explanation
    const explanation = matched_attributes.slice(0, 3).join(' · ');

    results.push({
      clinician,
      score,
      explanation,
      matched_attributes,
      availability,
    });
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}