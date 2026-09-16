// POST { idea: { title, techStack, problemStatement, solution, targetMarket, revenueModel, complexity, buildTime, tags, id, createdAt } }
// Generates a markdown plan document and uploads it to the IdeaForge Drive inbox.
// Credentials are supplied only through Vercel environment variables.
// Returns { driveLink, fileId, fileName, planDoc }

import { google } from 'googleapis';
import { Readable } from 'node:stream';

const DEFAULT_FOLDER_ID = '19xBQ2fY7xsVhgcAEkxZ1VH1zG_oqMugm';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

function getDriveClient() {
  const serviceAccountJson = process.env.GDRIVE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const credentials = JSON.parse(serviceAccountJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [DRIVE_SCOPE]
    });
    return google.drive({ version: 'v3', auth });
  }

  const { GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN } = process.env;
  if (GDRIVE_CLIENT_ID && GDRIVE_CLIENT_SECRET && GDRIVE_REFRESH_TOKEN) {
    const auth = new google.auth.OAuth2(GDRIVE_CLIENT_ID, GDRIVE_CLIENT_SECRET);
    auth.setCredentials({ refresh_token: GDRIVE_REFRESH_TOKEN });
    return google.drive({ version: 'v3', auth });
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { idea } = body || {};
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

  try {
    const drive = getDriveClient();
    if (!drive) {
      return res.status(503).json({
        error: 'Google Drive is not configured for this deployment',
        code: 'DRIVE_NOT_CONFIGURED'
      });
    }

    const folderId = process.env.GDRIVE_FOLDER_ID || DEFAULT_FOLDER_ID;
    const media = {
      mimeType: 'text/markdown',
      body: Readable.from([planDoc])
    };
    const fileResponse = idea.driveFileId
      ? await drive.files.update({
          fileId: idea.driveFileId,
          requestBody: { name: fileName },
          media,
          fields: 'id,name,webViewLink',
          supportsAllDrives: true
        })
      : await drive.files.create({
          requestBody: {
            name: fileName,
            parents: [folderId],
            mimeType: 'text/markdown'
          },
          media,
          fields: 'id,name,webViewLink',
          supportsAllDrives: true
        });

    const fileId = fileResponse.data.id;
    const verifiedFile = await drive.files.get({
      fileId,
      fields: 'id,name,webViewLink,parents',
      supportsAllDrives: true
    });
    const driveLink = verifiedFile.data.webViewLink || `https://drive.google.com/file/d/${verifiedFile.data.id}/view`;

    return res.status(200).json({ 
      success: true, 
      synced: true,
      fileId,
      fileName,
      planDoc,
      driveLink,
      message: 'Plan synced to Google Drive.'
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    return res.status(500).json({ error: 'Failed to generate plan', details: error.message });
  }
}
