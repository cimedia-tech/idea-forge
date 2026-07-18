// POST { idea: { title, techStack, problemStatement, solution, targetMarket, revenueModel, complexity, buildTime, tags, id, createdAt } }
// Generates markdown plan doc
// Uploads to Google Drive folder 05_IdeaForge_Vault/00_Inbox/
// Returns { driveLink, fileName }

import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { idea } = req.body;
  if (!idea?.title) return res.status(400).json({ error: 'Idea with title is required' });

  // Generate plan document markdown
  const date = new Date().toISOString().split('T')[0];
  const slug = idea.title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+$/, '');
  const fileName = `${date}_${slug}.md`;
  
  const planDoc = `# ${idea.title}

| Field | Value |
|---|---|
| **Status** | 📥 Inbox |
| **Filed** | ${date} |
| **Complexity** | ${idea.complexity || 'TBD'} |
| **Est. Build Time** | ${idea.buildTime || 'TBD'} |
| **IdeaForge ID** | ${idea.id || 'N/A'} |

## Tech Stack
| Layer | Technology |
|---|---|
| Stack | ${(idea.techStack || []).join(', ')} |

## Problem Statement
${idea.problemStatement || 'Not yet defined.'}

## Solution
${idea.solution || 'Not yet defined.'}

## Target Market
${idea.targetMarket || 'Not yet defined.'}

## Revenue Model
${idea.revenueModel || 'Not yet defined.'}

## Tags
${(idea.tags || []).map(t => '\`' + t + '\`').join(' ')}

---
*Filed by IdeaForge on ${date}*
`;

  // For now, return the generated doc without actual Drive upload
  // (Drive upload requires OAuth token which should be configured per deployment)
  // In production, this would use the googleapis library to upload
  
  try {
    // If GDRIVE credentials are available, upload
    const credentials = process.env.GDRIVE_CREDENTIALS;
    if (credentials) {
      // TODO: Implement actual Google Drive upload using googleapis
      // For now, return success with the generated document
    }
    
    return res.status(200).json({ 
      success: true, 
      fileName,
      planDoc,
      driveLink: null, // Will be populated when Drive is configured
      message: 'Plan document generated. Drive upload will be available once GDRIVE_CREDENTIALS is configured.'
    });
  } catch (error) {
    console.error('File to Drive error:', error);
    return res.status(500).json({ error: 'Failed to file to Drive', details: error.message });
  }
}
