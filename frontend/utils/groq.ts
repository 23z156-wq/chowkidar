const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export async function generateAnomalyExplanation(
  symbol: string,
  price: number,
  changePercent: number,
  volumeRatio: number,
  score: number
): Promise<string> {
  try {
    const prompt = `You are the transparent explanation engine for Chowkidar (a market attention-triage layer).
Stock: ${symbol}
Current Price: $${price.toFixed(2)}
24h Delta: ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%
Volume vs Baseline: ${volumeRatio.toFixed(1)}x
Attention Score: ${score}/100

In exactly 1 to 2 crisp, analytical sentences (under 35 words), explain what statistical anomaly occurred and why it demands investor attention. Strictly no buy/sell advice. Focus purely on price anomaly and volume velocity.`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 80,
      }),
    });

    if (!res.ok) {
      return `Volume surged ${volumeRatio.toFixed(1)}x beyond the 20-snapshot rolling average with an abnormal ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% price delta.`;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ||
      `Abnormal ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}% price move accompanied by ${volumeRatio.toFixed(1)}x baseline volume surge.`;
  } catch (err) {
    return `Statistical volatility threshold breached with ${volumeRatio.toFixed(1)}x volume velocity.`;
  }
}

