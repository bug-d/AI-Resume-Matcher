# 开发日志

用日期条目记录有意义的工作、决策、命令和验证结果。

## 2026-07-06 - 静态 MVP 启动

- 请求：从前面建议的作品集方向中开始实际构建一个 GitHub 项目。
- 变更：创建项目记忆文件，并完成无依赖静态版 `AI 简历匹配器`。功能包括简历/JD 输入、示例数据、匹配评分、能力覆盖进度条、优势、缺口、改写建议、复制报告和下载报告。
- 命令：`node --check script.js`；`python -m http.server 4173`；`Invoke-WebRequest -UseBasicParsing http://localhost:4173/index.html`；`Invoke-WebRequest -UseBasicParsing http://localhost:4173/styles.css`；`Invoke-WebRequest -UseBasicParsing http://localhost:4173/script.js`。
- 验证：JavaScript 语法检查通过。HTML、CSS 和 JS 在本地静态服务下均返回 HTTP 200。已初始化 Git 并创建首个提交。
- 后续：补截图、发布到 GitHub Pages，并在静态 MVP 稳定后考虑可选 AI 分析能力。

## 2026-07-06 - 中文化

- 请求：把文件改为中文。
- 变更：中文化应用界面、示例输入、分析结果、报告文案、README 和项目记忆文档；扩展中英双语关键词库和中文高频词提取。
- 命令：`node --check script.js`；`Invoke-WebRequest -UseBasicParsing http://localhost:4173/index.html`；`Invoke-WebRequest -UseBasicParsing http://localhost:4173/script.js`；`Select-String` 检查常见英文 UI 残留。
- 验证：JavaScript 语法检查通过。HTML 和 JS 在本地静态服务下均返回 HTTP 200。常见英文 UI 文案已替换，保留代码变量名和技术名词。
- 后续：提交中文化改动后继续准备 GitHub 发布。
