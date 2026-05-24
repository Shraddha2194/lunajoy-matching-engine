import { NextResponse } from 'next/server';
import { matchClinicians, PatientPreferences } from '@/lib/matchingEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const preferences: PatientPreferences = {
      state: body.state || '',
      language: body.language || 'English',
      gender_preference: body.gender_preference || 'no preference',
      insurance_provider: body.insurance_provider || '',
      appointment_type: body.appointment_type || 'therapy',
      clinical_needs: body.clinical_needs || [],
      preferred_time_slots: body.preferred_time_slots || [],
      urgency_level: body.urgency_level || 'flexible',
    };

    const results = matchClinicians(preferences);

    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        explanation: 'No clinicians found. Try adjusting your state or insurance provider.',
      });
    }

    const top = results[0];
    const clinician = top.clinician;

    const explanation = `Your top match is ${clinician.name}, based in ${clinician.state} with a match score of ${top.score} points. Here is why they were recommended: ${top.matched_attributes.join(', ')}. They are ${top.availability ? 'currently available' : 'limited in availability'} and accept ${clinician.insurance.join(', ')} insurance. They specialise in ${clinician.specialties.join(', ')} and offer ${clinician.appointment_types.join(' and ')} appointments.`;

    return NextResponse.json({
      success: true,
      top_match: clinician.name,
      score: top.score,
      explanation,
      all_matches: results.length,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}