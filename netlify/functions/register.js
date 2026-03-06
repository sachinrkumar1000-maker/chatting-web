// netlify/functions/register.js
const BACKEND = 'http://paid2.daki.cc:4156';

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  try {
    const path = event.path.replace('/.netlify/functions/register', '') || '/';

    // GET /state
    if (event.httpMethod === 'GET' && (path === '/' || path === '')) {
      const res = await fetch(`${BACKEND}/state`);
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // GET /history/:discord_id
    if (event.httpMethod === 'GET' && path.startsWith('/history/')) {
      const discordId = path.replace('/history/', '');
      const res = await fetch(`${BACKEND}/history/${discordId}`);
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // GET /leaderboard
    if (event.httpMethod === 'GET' && path === '/leaderboard') {
      const res = await fetch(`${BACKEND}/leaderboard`);
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // POST (register/cancel)
    if (event.httpMethod === 'POST') {
      const res = await fetch(`${BACKEND}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: event.body,
      });
      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
