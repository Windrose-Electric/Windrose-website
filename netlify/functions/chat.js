// Windrose AI chat proxy — forwards requests to Anthropic API
// Env var required: ANTHROPIC_API_KEY

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: 'Method Not Allowed' };
  }

  const apiKey = process.env.Anthropic_API_key || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[chat] Anthropic API key env var not set');
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: { message: 'Server configuration error' } }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: { message: 'Invalid JSON' } }) };
  }

  const { model, max_tokens, system, messages } = payload;
  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: { message: 'Missing messages array' } }) };
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'claude-haiku-4-5-20251001',
        max_tokens: max_tokens || 300,
        // Cache the system prompt — saves cost on large prompts reused across requests
        system: system ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }] : '',
        messages,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[chat] Anthropic API error:', res.status, JSON.stringify(data));
      return { statusCode: res.status, headers: cors(), body: JSON.stringify(data) };
    }

    return { statusCode: 200, headers: cors(), body: JSON.stringify(data) };

  } catch (err) {
    console.error('[chat] Fetch error:', err.message);
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ error: { message: err.message } }),
    };
  }
};

function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}
