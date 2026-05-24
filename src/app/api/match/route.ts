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

    return NextResponse.json({
      success: true,
      total_matches: results.length,
      matches: results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'LunaJoy Matching Engine is live',
    usage: 'Send a POST request with patient preferences to receive ranked clinician matches',
  });
}