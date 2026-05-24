# LunaJoy Smart Clinician Matching Engine

A full-stack clinician matching system that connects patients to the most relevant mental health professionals using a weighted scoring algorithm.

Built as part of the LunaJoy Technical Challenge.

---

## Live Demo

https://lunajoy-matching-engine.vercel.app

---

## GitHub Repository

https://github.com/Shraddha2194/lunajoy-matching-engine

---

## Product Thinking

This matching engine was designed with three core PM principles:

1. Explainability over black-box matching
Every match comes with a human-readable explanation and a list of matched attributes. Patients understand why a clinician was recommended — building trust in the platform.

2. Operational fairness through load balancing
The engine rewards clinicians with available capacity, distributing patient load evenly. This prevents burnout and ensures sustainable clinician utilisation.

3. Hard filters before soft scoring
State licensing is a hard filter — a clinician not licensed in the patient's state is immediately excluded, regardless of other attributes. This reflects real-world compliance constraints.

---

## Architecture Overview

Patient Intake Form (Next.js)
POST /api/match
Matching Engine (matchingEngine.ts)
Weighted Scoring Against Clinician Data
Ranked Results Returned to Frontend

Tech Stack:
- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Data: Mock JSON (clinicians.json)
- Deployment: Vercel

---

## Matching and Scoring Logic

The engine uses a weighted multi-factor scoring system:

- State match: 30 points (hard filter — excluded if no match)
- Insurance match: 25 points
- Language match: 15 points
- Specialty overlap: up to 15 points
- Gender preference: 10 points
- Availability windows: 10 points
- Urgency and availability: up to 10 points
- Load balancing: up to 5 points

Appointment type is also a hard filter — clinicians not offering the requested type are excluded.

Clinical needs are hidden when appointment type is medication — as per product requirements.

---

## API Endpoints

GET /api/clinicians
Returns the full list of mock clinicians.

POST /api/match
Accepts patient preferences and returns ranked clinician matches.

Request body fields:
- state
- language
- gender_preference
- insurance_provider
- appointment_type
- clinical_needs
- preferred_time_slots
- urgency_level

---

## Project Structure

src/app/page.tsx — Patient intake form and results
src/app/api/match/route.ts — POST /match endpoint
src/app/api/clinicians/route.ts — GET /clinicians endpoint
src/data/clinicians.json — Mock clinician database
src/lib/matchingEngine.ts — Core scoring and matching logic
docs/architecture.md — System architecture notes
docs/matching-logic.md — Scoring formula explanation

---

## Local Setup

git clone https://github.com/Shraddha2194/lunajoy-matching-engine.git
cd lunajoy-matching-engine
npm install
npm run dev

Open http://localhost:3000

---

## Future Enhancements

- Real database: Replace mock JSON with PostgreSQL or Supabase
- Auth layer: Secure patient data with authentication
- ML-based scoring: Learn from outcomes to improve match quality
- Clinician availability API: Real-time calendar integration
- Re-matching flow: Post-session feedback triggers intelligent re-matching
- Multi-state licensing: Support clinicians licensed in multiple states

---

## Author

Built by Shraddha Mishra
Product Manager — Technical PM Challenge Submission