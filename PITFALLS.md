# Project Pitfalls

## 2026-07-06 - Keep Resume Data Local In MVP

- Symptom: A resume matcher can accidentally imply external AI processing.
- Root cause: Portfolio AI tools often call APIs by default.
- Fix: First version uses fully local heuristic analysis and states this clearly in the UI/README.
- Prevention: Do not add network calls without explicit server-side API handling and privacy notes.
- Related files: `index.html`, `README.md`
