import { NextResponse } from 'next/server';
import cliniciansData from '@/data/clinicians.json';

export async function GET() {
  const clinicians = cliniciansData as unknown as any[];
  return NextResponse.json({
    success: true,
    count: clinicians.length,
    clinicians: clinicians,
  });
}