# Matching Logic & Scoring Formula

## Overview

The matching engine uses a weighted multi-factor scoring system to rank clinicians against patient preferences. The highest scoring clinician is ranked first.

## Step 1 — Hard Filters (Exclusion Rules)

These filters immediately exclude a clinician if not met:

- State match: Clinician must be licensed in the patient's state
- Appointment type: Clinician must offer the requested appointment type

If either filter fails, the clinician is excluded from results entirely.

## Step 2 — Weighted Scoring

Remaining clinicians are scored across these factors:

- State match: 30 points
- Insurance match: 25 points
- Language match: 15 points
- Specialty overlap: 5 points per matching specialty, up to 15 points
- Gender preference match: 10 points
- Availability window overlap: 10 points
- Urgency + availability: 10 points if immediate and available within 24hrs
- Load balancing: 5 points if under 50% capacity, 2 points if under 80%

## Step 3 — Sorting

All scored clinicians are sorted by total score in descending order. The top result is highlighted as the primary recommendation.

## Step 4 — Explanation Generation

Each result includes:
- A numeric score
- A natural language explanation (top 3 matched attributes joined)
- A full list of all matched attributes
- An availability flag (true if next available within 72 hours)

## Design Decisions

1. State as hard filter: Licensing compliance is non-negotiable. A clinician cannot legally see a patient outside their licensed state.

2. Insurance weighted heavily: Insurance compatibility directly impacts whether a patient can afford care. Second only to state in priority.

3. Load balancing included: Prevents patient funneling to the same top-rated clinicians, reduces burnout, and improves platform sustainability.

4. Explainability built in: Every match explains itself. This builds patient trust and supports clinical transparency.

## Future Improvements

- Outcome-based scoring: Weight clinicians higher if they have good patient outcomes for similar needs
- Availability API: Replace static next_available_hours with real calendar data
- Feedback loop: Use post-session ratings to adjust clinician scores over time