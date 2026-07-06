const resumeInput = document.querySelector("#resumeInput");
const jobInput = document.querySelector("#jobInput");
const analyzeButton = document.querySelector("#analyzeButton");
const loadSample = document.querySelector("#loadSample");
const copyReport = document.querySelector("#copyReport");
const downloadReport = document.querySelector("#downloadReport");

const hardSkills = [
  "javascript", "typescript", "react", "next.js", "vue", "node.js", "python", "sql",
  "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws", "gcp", "azure",
  "html", "css", "tailwind", "graphql", "rest api", "testing", "jest", "playwright",
  "ci/cd", "git", "supabase", "prisma", "figma", "analytics", "accessibility"
];

const softSkills = [
  "communication", "collaboration", "ownership", "leadership", "mentoring",
  "stakeholder", "problem solving", "prioritization", "documentation", "cross-functional"
];

const roleSignals = [
  "dashboard", "workflow", "automation", "authentication", "authorization", "responsive",
  "performance", "scalability", "security", "data visualization", "real-time", "api",
  "user research", "product", "metrics", "deployment", "monitoring", "error handling"
];

const sampleResume = `Frontend developer with 3 years of experience building React and TypeScript dashboards for B2B SaaS teams. Built reusable UI components, REST API integrations, responsive layouts, and analytics views. Improved page load performance by 38% through bundle splitting and caching. Worked with designers in Figma and backend engineers using PostgreSQL, Node.js, Git, and CI/CD. Owned documentation, QA checklists, and stakeholder demos.`;

const sampleJob = `We are hiring a product-minded full-stack engineer to build workflow automation and data visualization tools. Requirements include React, TypeScript, Next.js, Node.js, PostgreSQL, REST APIs, authentication, testing with Playwright or Jest, responsive design, accessibility, performance optimization, and strong collaboration with cross-functional stakeholders. Experience with Supabase, Prisma, real-time updates, deployment, monitoring, and security is a plus.`;

let latestReport = "";

loadSample.addEventListener("click", () => {
  resumeInput.value = sampleResume;
  jobInput.value = sampleJob;
  analyze();
});

analyzeButton.addEventListener("click", analyze);
copyReport.addEventListener("click", copyLatestReport);
downloadReport.addEventListener("click", downloadLatestReport);

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesTerm(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i").test(text);
}

function compareTerms(resumeText, jobText, terms) {
  const required = terms.filter((term) => includesTerm(jobText, term));
  const matched = required.filter((term) => includesTerm(resumeText, term));
  const missing = required.filter((term) => !matched.includes(term));
  const coverage = required.length ? Math.round((matched.length / required.length) * 100) : 100;
  return { required, matched, missing, coverage };
}

function extractJobKeywords(resumeText, jobText) {
  const stopWords = new Set([
    "and", "the", "with", "for", "you", "our", "are", "this", "that", "will", "from",
    "have", "has", "using", "into", "your", "role", "team", "work", "build", "tools"
  ]);
  const words = jobText.match(/[a-z][a-z0-9+#.]{2,}/g) || [];
  const counts = words.reduce((acc, word) => {
    if (!stopWords.has(word)) acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .filter((word) => !includesTerm(resumeText, word))
    .slice(0, 8);
}

function analyze() {
  const resumeText = normalize(resumeInput.value);
  const jobText = normalize(jobInput.value);

  if (!resumeText || !jobText) {
    renderEmpty("Paste both a resume and a job description to analyze the match.");
    return;
  }

  const hard = compareTerms(resumeText, jobText, hardSkills);
  const soft = compareTerms(resumeText, jobText, softSkills);
  const role = compareTerms(resumeText, jobText, roleSignals);
  const keywordGaps = extractJobKeywords(resumeText, jobText);

  const score = calculateScore(hard, soft, role);
  const strengths = buildStrengths(hard, soft, role);
  const gaps = buildGaps(hard, soft, role, keywordGaps);
  const suggestions = buildSuggestions(hard, soft, role, keywordGaps);

  latestReport = buildReport(score, hard, soft, role, strengths, gaps, suggestions);
  renderResults(score, hard, soft, role, strengths, gaps, suggestions);
}

function buildStrengths(hard, soft, role) {
  const items = [];
  if (hard.matched.length) items.push(`Technical overlap: ${hard.matched.slice(0, 8).join(", ")}.`);
  if (role.matched.length) items.push(`Role signals already visible: ${role.matched.slice(0, 6).join(", ")}.`);
  if (soft.matched.length) items.push(`Collaboration language matches: ${soft.matched.slice(0, 5).join(", ")}.`);
  if (!items.length) items.push("No strong keyword overlap yet. Add concrete technologies, outcomes, and role-specific terms from the job description.");
  return items;
}

function buildGaps(hard, soft, role, keywordGaps) {
  const items = [];
  if (hard.missing.length) items.push(`Add evidence for technical requirements: ${hard.missing.slice(0, 8).join(", ")}.`);
  if (role.missing.length) items.push(`Show role experience around: ${role.missing.slice(0, 6).join(", ")}.`);
  if (soft.missing.length) items.push(`Mirror soft-skill language where honest: ${soft.missing.slice(0, 5).join(", ")}.`);
  if (keywordGaps.length) items.push(`Repeated JD keywords missing from resume: ${keywordGaps.join(", ")}.`);
  if (!items.length) items.push("The resume covers the visible requirements well. Focus on measurable impact and concise wording.");
  return items;
}

function buildSuggestions(hard, soft, role, keywordGaps) {
  const topTech = hard.missing.slice(0, 3).join(", ") || hard.matched.slice(0, 3).join(", ") || "the required stack";
  const topRole = role.missing.slice(0, 2).join(" and ") || role.matched.slice(0, 2).join(" and ") || "the target workflow";
  const topKeyword = keywordGaps.slice(0, 3).join(", ") || "business impact";

  return [
    `Add one bullet that ties ${topTech} to a shipped outcome, including a metric such as time saved, conversion lift, latency reduction, or adoption.`,
    `Rewrite a project bullet to mention ${topRole} so the resume mirrors the job's day-to-day responsibilities.`,
    `Include a short summary line that names the target role and the strongest matching skills instead of using a generic objective.`,
    `If accurate, add keywords such as ${topKeyword} in natural project context rather than as a standalone keyword list.`,
    "Move the most relevant project or experience to the top third of the resume so the match is visible in a fast screen."
  ];
}

function calculateScore(hard, soft, role) {
  const categories = [
    { result: hard, weight: 0.48 },
    { result: soft, weight: 0.2 },
    { result: role, weight: 0.32 }
  ].filter((category) => category.result.required.length > 0);

  if (!categories.length) return 0;

  const totalWeight = categories.reduce((sum, category) => sum + category.weight, 0);
  const weightedScore = categories.reduce((sum, category) => {
    return sum + (category.result.coverage * category.weight);
  }, 0);

  return Math.round(weightedScore / totalWeight);
}

function renderResults(score, hard, soft, role, strengths, gaps, suggestions) {
  document.querySelector("#scoreValue").textContent = `${score}%`;
  document.querySelector("#scoreRing").style.background = `conic-gradient(${scoreColor(score)} ${score * 3.6}deg, #dce6eb 0deg)`;
  document.querySelector("#scoreSummary").textContent = scoreSummary(score);

  setMeter("hard", hard.coverage);
  setMeter("soft", soft.coverage);
  setMeter("role", role.coverage);
  renderList("#strengthList", strengths, "is-hit");
  renderList("#gapList", gaps, "is-gap");
  renderList("#suggestionList", suggestions);
}

function renderEmpty(message) {
  document.querySelector("#scoreValue").textContent = "--";
  document.querySelector("#scoreRing").style.background = "conic-gradient(var(--accent) 0deg, #dce6eb 0deg)";
  document.querySelector("#scoreSummary").textContent = message;
  setMeter("hard", 0);
  setMeter("soft", 0);
  setMeter("role", 0);
  renderList("#strengthList", ["Waiting for both inputs."]);
  renderList("#gapList", ["No gaps calculated yet."]);
  renderList("#suggestionList", ["Run an analysis to generate rewrite suggestions."]);
  latestReport = "";
}

function setMeter(id, value) {
  document.querySelector(`#${id}Meter`).style.width = `${value}%`;
  document.querySelector(`#${id}Value`).textContent = `${value}%`;
}

function renderList(selector, items, className = "") {
  const list = document.querySelector(selector);
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    if (className) li.classList.add(className);
    list.appendChild(li);
  });
}

function scoreColor(score) {
  if (score >= 78) return "#15803d";
  if (score >= 55) return "#0f766e";
  if (score >= 35) return "#b45309";
  return "#b91c1c";
}

function scoreSummary(score) {
  if (score >= 78) return "Strong match. Tighten the story with impact metrics and exact role language.";
  if (score >= 55) return "Promising match. Address the priority gaps before applying.";
  if (score >= 35) return "Partial match. Reframe experience around the job's core requirements.";
  return "Low keyword alignment. Add relevant evidence or target a closer-fitting role.";
}

function buildReport(score, hard, soft, role, strengths, gaps, suggestions) {
  return [
    "AI Resume Matcher Report",
    `Match score: ${score}%`,
    "",
    `Hard skills coverage: ${hard.coverage}%`,
    `Soft skills coverage: ${soft.coverage}%`,
    `Role signals coverage: ${role.coverage}%`,
    "",
    "Matched strengths:",
    ...strengths.map((item) => `- ${item}`),
    "",
    "Priority gaps:",
    ...gaps.map((item) => `- ${item}`),
    "",
    "Rewrite suggestions:",
    ...suggestions.map((item, index) => `${index + 1}. ${item}`)
  ].join("\n");
}

async function copyLatestReport() {
  if (!latestReport) analyze();
  if (!latestReport) return;
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(latestReport);
  } else {
    const helper = document.createElement("textarea");
    helper.value = latestReport;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  copyReport.textContent = "Copied";
  setTimeout(() => {
    copyReport.textContent = "Copy";
  }, 1300);
}

function downloadLatestReport() {
  if (!latestReport) analyze();
  if (!latestReport) return;
  const blob = new Blob([latestReport], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "resume-match-report.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

renderEmpty("Paste both documents and run an analysis.");
