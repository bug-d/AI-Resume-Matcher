# AI Resume Matcher

A privacy-friendly resume and job description analyzer built as a portfolio-ready static web app.

## What It Does

- Compares pasted resume text with a target job description.
- Scores role fit across skills, experience signals, and job-specific keywords.
- Highlights matched strengths and missing keywords.
- Generates practical resume rewrite suggestions.
- Exports a plain-text report for quick review.

## Why This Project Exists

This project is designed as a compact interview portfolio piece. It demonstrates product thinking, front-end implementation, local data processing, responsive UI, and a clear upgrade path toward a full AI-assisted career tool.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- No backend and no package dependencies

## Privacy

The MVP runs entirely in the browser. It does not upload resume content, call an external API, or store user data on a server.

## Run Locally

Open `index.html` directly, or run a small static server:

```powershell
python -m http.server 4173
```

Then visit:

```text
http://localhost:4173
```

## Deploy To GitHub Pages

1. Push this folder to a GitHub repository.
2. In repository settings, enable GitHub Pages.
3. Choose the branch and root folder as the Pages source.
4. Open the generated Pages URL.

## Roadmap

- Add PDF/DOCX text extraction.
- Add optional OpenAI-powered rewrite mode through a server-side API route.
- Save comparison history locally.
- Add shareable anonymized reports.
- Add unit tests for scoring rules.
