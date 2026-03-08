const BACKEND = process.env.BACKEND_URL;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const path = event.path.replace('/.netlify/functions/register', '') || '/';

    // GET /state
    if (event.httpMethod === 'GET' && (path === '/' || path === '')) {
      const res = await fetch(`${BACKEND}/state`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    // GET /my-registrations/:id
    if (event.httpMethod === 'GET' && path.startsWith('/my-registrations/')) {
      const id  = path.replace('/my-registrations/', '');
      const res = await fetch(`${BACKEND}/my-registrations/${id}`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    // GET /history/:id
    if (event.httpMethod === 'GET' && path.startsWith('/history/')) {
      const id  = path.replace('/history/', '');
      const res = await fetch(`${BACKEND}/history/${id}`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    // GET /leaderboard
    if (event.httpMethod === 'GET' && path === '/leaderboard') {
      const res = await fetch(`${BACKEND}/leaderboard`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    // POST /admin  (all admin actions)
    if (event.httpMethod === 'POST' && path === '/admin') {
      const res = await fetch(`${BACKEND}/admin`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    event.body,
      });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    // POST /  (register / cancel)
    if (event.httpMethod === 'POST') {
      const res = await fetch(`${BACKEND}/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    event.body,
      });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
