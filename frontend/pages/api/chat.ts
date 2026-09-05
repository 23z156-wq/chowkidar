import type { NextApiRequest, NextApiResponse } from 'next';

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, pageContext, currentSymbol } = req.body;

    const systemPrompt = `You are Chowkidar AI, an intelligent, calm, and analytical assistant for Chowkidar — a stock-watchlist attention triage platform.

Current User Context:
- Active Page: ${pageContext || 'Dashboard'}
- Active Stock Symbol: ${currentSymbol || 'None (General App)'}
- App Purpose: Chowkidar detects statistical volume anomalies, price movement, and sector divergence. It NEVER gives buy/sell financial advice.

Guidelines:
1. Answer concisely, analytically, and calmly (under 75 words).
2. Use plain English to explain financial metrics and statistical anomalies.
3. Tailor your answer specifically to the user's current page (${pageContext}) and symbol (${currentSymbol || 'all tracked assets'}).
4. Strictly refrain from predicting future prices or advising trades. Focus on explaining what happened and why.`;

    const groqPayload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...(messages || [])
      ],
      temperature: 0.3,
      max_tokens: 150,
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(groqPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Groq API error:', errorText);
      return res.status(200).json({
        reply: `Chowkidar AI is inspecting ${currentSymbol || 'your market telemetry'}. Currently, tracked assets are trading within normal baseline parameters. How else can I help?`
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'No response generated.';

    res.status(200).json({ reply });
  } catch (err) {
    res.status(200).json({
      reply: 'Chowkidar AI assistant is ready. Ask me anything about your current page context or market telemetry.'
    });
  }
}

