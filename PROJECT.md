# Project: ai-resume-matcher

## Overview

- Purpose: Portfolio-ready web app that compares a resume against a job description and produces a practical interview/job-application improvement report.
- Current status: Static MVP in progress.
- Owner/user context: User wants small vibecoding projects published to GitHub as interview portfolio pieces.
- Important links: Local project folder only for now.

## Scope

- In scope: Client-side resume/JD text analysis, match score, skill gaps, suggested resume bullets, exportable report, polished README.
- Out of scope: Storing secrets, paid API calls, user accounts, uploaded file parsing in the first MVP.

## Key Decisions

- Build first version as dependency-free static HTML/CSS/JS so it can run locally and deploy to GitHub Pages without network setup.
- Keep analysis transparent and heuristic-based; later versions can add OpenAI API integration behind an optional backend.

## Open Questions

- Whether the final GitHub repository should be public under the user's main GitHub account or an organization.
