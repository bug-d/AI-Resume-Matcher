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
  "ci/cd", "git", "supabase", "prisma", "figma", "analytics", "accessibility",
  "前端", "后端", "全栈", "小程序", "数据分析", "数据可视化", "接口", "自动化",
  "测试", "单元测试", "端到端测试", "数据库", "云服务", "部署", "性能优化", "可访问性"
];

const softSkills = [
  "communication", "collaboration", "ownership", "leadership", "mentoring",
  "stakeholder", "problem solving", "prioritization", "documentation", "cross-functional",
  "沟通", "协作", "Owner 意识", "主人翁意识", "领导力", "辅导", "干系人", "问题解决",
  "优先级", "文档", "跨职能"
];

const roleSignals = [
  "dashboard", "workflow", "automation", "authentication", "authorization", "responsive",
  "performance", "scalability", "security", "data visualization", "real-time", "api",
  "user research", "product", "metrics", "deployment", "monitoring", "error handling",
  "看板", "工作流", "登录", "鉴权", "权限", "响应式", "可扩展", "安全", "实时",
  "用户研究", "产品", "指标", "监控", "错误处理", "业务流程"
];

const sampleResume = `前端开发工程师，3 年 B2B SaaS 产品经验，长期使用 React 和 TypeScript 构建业务看板。负责可复用 UI 组件、REST API 接入、响应式页面和数据分析视图。通过代码分包和缓存策略将页面加载性能提升 38%。与设计师使用 Figma 协作，也和后端工程师配合 PostgreSQL、Node.js、Git 和 CI/CD 流程。独立维护文档、QA 检查清单和干系人演示。`;

const sampleJob = `我们正在招聘一名有产品意识的全栈工程师，负责构建工作流自动化和数据可视化工具。岗位要求包括 React、TypeScript、Next.js、Node.js、PostgreSQL、REST API、登录鉴权、Playwright 或 Jest 测试、响应式设计、可访问性、性能优化，以及与跨职能干系人的高质量协作。有 Supabase、Prisma、实时更新、部署、监控和安全经验者优先。`;

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
    "have", "has", "using", "into", "your", "role", "team", "work", "build", "tools",
    "我们", "岗位", "要求", "负责", "包括", "以及", "优先", "经验", "能力", "相关"
  ]);
  const englishWords = jobText.match(/[a-z][a-z0-9+#.]{2,}/g) || [];
  const chineseWords = jobText.match(/[\u4e00-\u9fa5]{2,8}/g) || [];
  const words = [...englishWords, ...chineseWords];
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
    renderEmpty("请先粘贴简历和岗位描述，再开始分析匹配度。");
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
  if (hard.matched.length) items.push(`技术关键词已有重合：${hard.matched.slice(0, 8).join("、")}。`);
  if (role.matched.length) items.push(`岗位能力信号已经出现：${role.matched.slice(0, 6).join("、")}。`);
  if (soft.matched.length) items.push(`协作类表述匹配：${soft.matched.slice(0, 5).join("、")}。`);
  if (!items.length) items.push("目前还没有明显关键词重合。建议补充具体技术、业务结果和岗位描述中的核心词。");
  return items;
}

function buildGaps(hard, soft, role, keywordGaps) {
  const items = [];
  if (hard.missing.length) items.push(`补充这些技术要求的项目证据：${hard.missing.slice(0, 8).join("、")}。`);
  if (role.missing.length) items.push(`补充这些岗位经验信号：${role.missing.slice(0, 6).join("、")}。`);
  if (soft.missing.length) items.push(`在真实经历中体现这些软技能表述：${soft.missing.slice(0, 5).join("、")}。`);
  if (keywordGaps.length) items.push(`岗位描述中出现但简历缺少的高频词：${keywordGaps.join("、")}。`);
  if (!items.length) items.push("简历已经较好覆盖岗位要求。下一步重点是强化量化结果和表达精炼度。");
  return items;
}

function buildSuggestions(hard, soft, role, keywordGaps) {
  const topTech = hard.missing.slice(0, 3).join("、") || hard.matched.slice(0, 3).join("、") || "岗位要求的技术栈";
  const topRole = role.missing.slice(0, 2).join("和") || role.matched.slice(0, 2).join("和") || "目标岗位的核心工作流";
  const topKeyword = keywordGaps.slice(0, 3).join("、") || "业务影响";

  return [
    `增加一条项目 bullet，把 ${topTech} 和上线结果关联起来，并写出节省时间、转化提升、延迟降低或使用人数等量化指标。`,
    `改写一个项目经历，明确提到 ${topRole}，让简历更贴近岗位日常职责。`,
    "把简历开头的简介改成目标岗位导向，突出最匹配的 3-4 个技能，而不是泛泛的求职目标。",
    `如果经历真实相关，把 ${topKeyword} 等词自然放进项目语境中，不要单独堆关键词。`,
    "把最相关的项目或经历移动到简历前三分之一，让筛选者快速看到匹配点。"
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
  renderList("#strengthList", ["等待输入两段文本。"]);
  renderList("#gapList", ["尚未计算缺口。"]);
  renderList("#suggestionList", ["运行分析后会生成改写建议。"]);
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
  if (score >= 78) return "匹配度较强。建议继续补充量化结果和更贴近岗位的表达。";
  if (score >= 55) return "有明显匹配基础。投递前优先补齐关键缺口。";
  if (score >= 35) return "部分匹配。建议围绕岗位核心要求重新组织经历。";
  return "关键词对齐较弱。需要补充相关证据，或选择更匹配的岗位。";
}

function buildReport(score, hard, soft, role, strengths, gaps, suggestions) {
  return [
    "AI 简历匹配器报告",
    `匹配分数：${score}%`,
    "",
    `硬技能覆盖：${hard.coverage}%`,
    `软技能覆盖：${soft.coverage}%`,
    `岗位信号覆盖：${role.coverage}%`,
    "",
    "匹配优势：",
    ...strengths.map((item) => `- ${item}`),
    "",
    "优先补齐项：",
    ...gaps.map((item) => `- ${item}`),
    "",
    "改写建议：",
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
  copyReport.textContent = "已复制";
  setTimeout(() => {
    copyReport.textContent = "复制";
  }, 1300);
}

function downloadLatestReport() {
  if (!latestReport) analyze();
  if (!latestReport) return;
  const blob = new Blob([latestReport], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "简历匹配报告.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

renderEmpty("粘贴两段文本后运行分析。");
