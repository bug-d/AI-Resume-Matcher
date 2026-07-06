# Requirements

## User Goals

- Create a simple but credible portfolio project for GitHub.
- Demonstrate product sense, front-end polish, data handling, and explainable AI-style analysis.

## Functional Requirements

- Let users paste resume text and job description text.
- Analyze overlap across hard skills, soft skills, role keywords, and experience signals.
- Display a match score, strengths, gaps, and actionable rewrite suggestions.
- Generate improved resume bullet suggestions based on the target role.
- Allow copying or downloading a report.

## Non-Functional Requirements

- Must run without backend services or package installation.
- Must be responsive on desktop and mobile.
- Must avoid sending user resume content to any external service in the MVP.
- Must be easy to publish on GitHub Pages.

## Constraints

- Network access may require approval in this Codex workspace, so first implementation avoids external dependencies.
- No secrets or API keys in repository files.

## Acceptance Criteria

- Opening `index.html` shows a complete usable app.
- Demo sample button fills realistic input.
- Analysis updates from user input and produces non-empty results.
- README explains purpose, features, local usage, and roadmap.
