# System Architecture

## Overview

The LunaJoy Matching Engine is a full-stack Next.js application that accepts patient intake data and returns a ranked list of clinicians using a weighted scoring algorithm.

## Components

1. Frontend (src/app/page.tsx)
- Patient intake form built in React
- Collects state, insurance, language, appointment type, clinical needs, time slots, urgency
- Clinical needs field is hidden when appointment type is medication
- Displays ranked clinician results with scores and explanations

2. API Layer (src/app/api/)
- POST /api/match — receives patient preferences, runs matching engine, returns ranked results
- GET /api/clinicians — returns full clinician list

3. Matching Engine (src/lib/matchingEngine.ts)
- Core scoring logic
- Applies hard filters first (state, appointment type)
- Then applies weighted scoring across remaining criteria
- Returns sorted results by score descending

4. Data Layer (src/data/clinicians.json)
- Mock dataset of 10 clinicians
- Each clinician has: state, languages, gender, insurance, specialties, appointment types, availability windows, load metrics

## Data Flow

Patient fills form
→ Frontend sends POST /api/match
→ API passes preferences to matchingEngine
→ Engine filters and scores all clinicians
→ Sorted results returned to frontend
→ Patient sees ranked clinician cards

## Deployment

- Hosted on Vercel
- Continuous deployment from GitHub main branch
- Zero-config Next.js deployment