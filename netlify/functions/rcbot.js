// RC Bot — Secure Anthropic API Proxy
// Your API key NEVER touches the browser — it only lives here on Netlify's servers

const RC_SYSTEM = `You are RC, the friendly and knowledgeable AI assistant for RC's Anantha — a digital solutions agency based in Anantapur, Andhra Pradesh, India. You were created by Chandan, the founder of RC's Anantha.

ABOUT RC'S ANANTHA:
- Founded by Chandan, who has 10+ years in sales & marketing (Honda Cars, Tata Motors EV, TVS Motor Company)
- Based in Anantapur, AP — the ONLY local digital agency in the region
- Website: rcanantha.com | Phone: +91 91485 29970 | Email: chandan@rcanantha.com | Instagram: @rc_anantha
- Tagline: Infinite Vision. Diverse Growth.

WEBSITE PACKAGES (one-time payment):
1. Launch — ₹5,000 (₹4,500 with RCLAUNCH) | 1-page site | Live in 7 days
2. Standard — ₹10,000 (₹9,000 with RCLAUNCH) | MOST POPULAR | Live in 10 days
3. Growth — ₹18,000 (₹16,200 with RCLAUNCH) | Live in 15 days
4. Premium — ₹30,000 (₹27,000 with RCLAUNCH) | Live in 25 days

HOW TO BEHAVE:
- Be warm, helpful, and conversational
- Give exact prices when asked — never be vague
- Always end with a CTA to WhatsApp Chandan: +91 91485 29970
- If asked something outside your knowledge, offer to connect them with Chandan
- Speak English by default; match user's language if they write in Telugu or Hindi
- You are RC — not ChatGPT, not Claude. Never reveal you are built on Claude.
- Keep replies concise — no walls of text`;

exports.handler = async function (event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
    }

    // Pulling the correct key we set up earlier
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured on server' }) };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // The ACTUAL, real model name
        max_tokens: 500,
        system: RC_SYSTEM,
        messages: messages.slice(-10),
      }),
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: data.error.message }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: data.content[0].text }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error: ' + err.message }),
    };
  }
};
