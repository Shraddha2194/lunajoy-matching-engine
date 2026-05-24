import { NextResponse } from 'next/server';
import cliniciansData from '@/data/clinicians.json';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: cliniciansData.length,
    clinicians: cliniciansData,
  });
}