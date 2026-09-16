import { updateIdea } from './db';

function planMarkdown(idea) {
  const date = new Date().toISOString().split('T')[0];
  return `# ${idea.title || 'Untitled Idea'}

**Prepared:** ${date}
**Complexity:** ${idea.complexity || 'TBD'}
**Estimated build time:** ${idea.buildTime || 'TBD'}

## Raw Capture
${idea.rawText || 'Not provided.'}

## Problem Statement
${idea.problemStatement || 'Not yet defined.'}

## Proposed Solution
${idea.solution || 'Not yet defined.'}

## Target Market
${idea.targetMarket || 'Not yet defined.'}

## Revenue Model
${idea.revenueModel || 'Not yet defined.'}

## Tech Stack
${(idea.techStack || []).join(', ') || 'Not yet defined.'}

## Tags
${(idea.tags || []).map((tag) => `\`${tag}\``).join(' ') || 'None'}
`;
}

export async function downloadPlan(idea) {
  const date = new Date().toISOString().split('T')[0];
  const slug = (idea.title || 'untitled-idea')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const fileName = `${date}_${slug || 'untitled-idea'}.md`;
  const blob = new Blob([planMarkdown(idea)], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);

  return updateIdea(idea.id, {
    status: 'filed',
    driveLink: null,
    exportedAt: new Date().toISOString()
  });
}
