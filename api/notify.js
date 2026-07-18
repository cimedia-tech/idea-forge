// POST { message: string }
// Sends to the configured Telegram bot

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Telegram credentials not configured' });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram error:', error);
    return res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
}
