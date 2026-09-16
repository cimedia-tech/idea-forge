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

export async function syncPlanToDrive(idea) {
  try {
    const response = await fetch('/api/file-to-drive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea })
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const updated = await downloadPlan(idea);
      return {
        idea: updated,
        synced: false,
        message: 'Drive sync is available after deployment, so a Markdown plan was downloaded instead.'
      };
    }
    const payload = await response.json();

    if (payload.code === 'DRIVE_NOT_CONFIGURED') {
      const updated = await downloadPlan(idea);
      return {
        idea: updated,
        synced: false,
        message: 'Drive is not configured yet, so a Markdown plan was downloaded instead.'
      };
    }

    if (!response.ok || !payload.driveLink) {
      throw new Error(payload.error || 'Google Drive sync failed');
    }

    const updated = await updateIdea(idea.id, {
      status: 'filed',
      driveLink: payload.driveLink,
      driveFileId: payload.fileId,
      driveSyncedAt: new Date().toISOString()
    });
    return { idea: updated, synced: true, message: payload.message || 'Plan synced to Google Drive.' };
  } catch (error) {
    if (error instanceof TypeError || error.message.includes('Unexpected token')) {
      const updated = await downloadPlan(idea);
      return {
        idea: updated,
        synced: false,
        message: 'Drive sync is available after deployment, so a Markdown plan was downloaded instead.'
      };
    }
    throw error;
  }
}
