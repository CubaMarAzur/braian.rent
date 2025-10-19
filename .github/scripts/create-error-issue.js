#!/usr/bin/env node

/**
 * Script to create GitHub Issues for pipeline failures
 * Automatically extracts error details and creates structured issue
 */

import fs from 'fs';
import path from 'path';

// Get environment variables from GitHub Actions
const {
  GITHUB_REPOSITORY,
  GITHUB_SHA,
  GITHUB_REF,
  GITHUB_WORKFLOW,
  GITHUB_RUN_ID,
  GITHUB_ACTOR,
  GITHUB_EVENT_NAME,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GITHUB_HEAD_REF,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GITHUB_BASE_REF,
} = process.env;

// Get error details from command line arguments
const failedJob = process.argv[2] || 'Unknown Job';
const errorMessage = process.argv[3] || 'No error message provided';
const errorLogs = process.argv[4] || 'No logs available';

// Create issue title
const shortSha = GITHUB_SHA ? GITHUB_SHA.substring(0, 7) : 'unknown';
const issueTitle = `🚨 Pipeline Failed: ${failedJob} (${shortSha})`;

// Create issue body
const issueBody = `## 🚨 Pipeline Failure Report

### 📋 Basic Information
- **Repository**: ${GITHUB_REPOSITORY}
- **Commit**: \`${GITHUB_SHA}\`
- **Branch**: \`${GITHUB_REF}\`
- **Workflow**: ${GITHUB_WORKFLOW}
- **Run ID**: ${GITHUB_RUN_ID}
- **Triggered by**: ${GITHUB_ACTOR}
- **Event**: ${GITHUB_EVENT_NAME}
- **Failed Job**: \`${failedJob}\`

### 🔗 Links
- **GitHub Actions Run**: [View Run #${GITHUB_RUN_ID}](https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID})
- **Commit**: [${shortSha}](https://github.com/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA})

### ❌ Error Details
\`\`\`
${errorMessage}
\`\`\`

### 📝 Full Logs
<details>
<summary>Click to expand full error logs</summary>

\`\`\`
${errorLogs}
\`\`\`

</details>

### 🏷️ Labels
- \`bug\`
- \`pipeline-failure\`
- \`${failedJob.toLowerCase().replace(/\s+/g, '-')}\`

### 📝 Notes
- [ ] Error analyzed
- [ ] Root cause identified  
- [ ] Fix implemented
- [ ] Pipeline passing

---
*This issue was automatically created by GitHub Actions on pipeline failure.*
`;

// Create error log entry for docs/pipeline-errors.md
const timestamp = new Date().toISOString();
const errorLogEntry = `
## ${timestamp}

**Commit**: \`${GITHUB_SHA}\`  
**Job**: \`${failedJob}\`  
**Error**: ${errorMessage}  
**GitHub Run**: [Run #${GITHUB_RUN_ID}](https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID})  
**Issue**: TBD (will be updated after issue creation)

<details>
<summary>Full Error Logs</summary>

\`\`\`
${errorLogs}
\`\`\`

</details>

---`;

// Write to pipeline-errors.md
const errorLogPath = path.join(__dirname, '../../docs/pipeline-errors.md');
try {
  const currentContent = fs.readFileSync(errorLogPath, 'utf8');
  const newContent = currentContent.replace(
    '<!-- Błędy będą automatycznie dodawane tutaj przez GitHub Actions -->',
    errorLogEntry +
      '\n\n<!-- Błędy będą automatycznie dodawane tutaj przez GitHub Actions -->'
  );
  fs.writeFileSync(errorLogPath, newContent);
  console.log('✅ Error log updated in docs/pipeline-errors.md');
} catch (error) {
  console.error('❌ Failed to update error log:', error.message);
}

// Output issue data for GitHub Actions
console.log('ISSUE_TITLE=' + issueTitle);
console.log('ISSUE_BODY=' + issueBody.replace(/\n/g, '\\n'));
console.log('ERROR_LOG_ENTRY=' + errorLogEntry.replace(/\n/g, '\\n'));
