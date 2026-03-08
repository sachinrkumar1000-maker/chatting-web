const BACKEND = 'http://paid2.daki.cc:4156';

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  try {
    const path = event.path.replace('/.netlify/functions/register', '') || '/';

    if (event.httpMethod === 'GET' && (path === '/' || path === '')) {
      const res = await fetch(`${BACKEND}/state`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path.startsWith('/my-registrations/')) {
      const discordId = path.replace('/my-registrations/', '');
      const res = await fetch(`${BACKEND}/my-registrations/${discordId}`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path.startsWith('/history/')) {
      const discordId = path.replace('/history/', '');
      const res = await fetch(`${BACKEND}/history/${discordId}`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path === '/leaderboard') {
      const res = await fetch(`${BACKEND}/leaderboard`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'POST') {
      const res = await fetch(`${BACKEND}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: event.body,
      });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
