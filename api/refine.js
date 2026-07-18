// Vercel serverless function
// POST { rawText: string }
// Returns structured JSON with:
//   title, problemStatement, solution, techStack (array),
//   targetMarket, revenueModel, complexity (Low|Medium|High),
//   buildTime, tags (array)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { rawText } = req.body;
  if (!rawText) return res.status(400).json({ error: 'rawText is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  const prompt = `You are a senior business strategist and technical architect. Analyze this raw business idea and expand it into a structured service plan.

Raw Idea: "${rawText}"

Return a JSON object with EXACTLY these fields:
{
  "title": "A compelling project name (3-5 words)",
  "problemStatement": "What client/market pain does this solve? (2-3 sentences)",
  "solution": "Expanded concept description (3-5 sentences)",
  "techStack": ["Array", "of", "recommended", "technologies"],
  "targetMarket": "Who benefits from this? (1-2 sentences)",
  "revenueModel": "How could this generate income? (1-2 sentences)",
  "complexity": "Low|Medium|High",
  "buildTime": "Estimated build time (e.g., '2-3 weeks')",
  "tags": ["auto", "generated", "category", "tags"]
}

Return ONLY valid JSON, no markdown fences or explanation.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini');
    
    const refined = JSON.parse(text);
    return res.status(200).json(refined);
  } catch (error) {
    console.error('Refine error:', error);
    return res.status(500).json({ error: 'Failed to refine idea', details: error.message });
  }
}
