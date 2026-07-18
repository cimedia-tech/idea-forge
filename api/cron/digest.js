// Vercel Cron — runs daily at 11 PM UTC (7 PM ET)
// Sends IdeaForge daily digest via Telegram

export default async function handler(req, res) {
  // Verify cron auth (Vercel sets this header)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://idea-forge.vercel.app';

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Telegram credentials not configured' });
  }

  // Since ideas are stored client-side in IndexedDB, the cron just sends a reminder
  // In v2 with Supabase, this would query actual stats
  const message = `🧠 <b>IdeaForge — Daily Reminder</b>
━━━━━━━━━━━━━━━━━━━

💡 Time to review your ideas!

Open IdeaForge to:
✨ Refine any draft ideas with AI
🔒 Vault your best concepts
📁 File refined plans to Google Drive
📊 Review your idea pipeline

🔗 <a href="${appUrl}">Open IdeaForge</a>`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      }
    );

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);
    
    return res.status(200).json({ success: true, message: 'Daily digest sent' });
  } catch (error) {
    console.error('Digest cron error:', error);
    return res.status(500).json({ error: 'Failed to send digest', details: error.message });
  }
}
