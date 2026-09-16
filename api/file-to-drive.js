// POST { idea: { title, techStack, problemStatement, solution, targetMarket, revenueModel, complexity, buildTime, tags, id, createdAt } }
// Generates a markdown plan document for download.
// Google Drive OAuth is intentionally not claimed by this route.
// Returns { driveLink: null, fileName, planDoc }

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

  try {
    return res.status(200).json({ 
      success: true, 
      fileName,
      planDoc,
      driveLink: null,
      message: 'Plan document generated for download. Google Drive sync is not configured.'
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    return res.status(500).json({ error: 'Failed to generate plan', details: error.message });
  }
}
