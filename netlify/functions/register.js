const BACKEND = process.env.BACKEND_URL;

// FIX #4: Only allow requests from our actual domain
const ALLOWED_ORIGINS = [
  'https://sovereignskingdom.xyz',
  'https://www.sovereignskingdom.xyz',
];

exports.handler = async (event) => {
  const origin = event.headers['origin'] || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/register', '') || '/';

    if (event.httpMethod === 'GET' && (path === '/' || path === '')) {
      const res = await fetch(`${BACKEND}/state`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path.startsWith('/my-registrations/')) {
      // FIX #2: only allow numeric discord IDs
      const id = path.replace('/my-registrations/', '');
      if (!/^\d+$/.test(id)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
      const res = await fetch(`${BACKEND}/my-registrations/${id}`);
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path.startsWith('/history/')) {
      const id = path.replace('/history/', '');
      if (!/^\d+$/.test(id)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
      const res = await fetch(`${BACKEND}/history/${id}`);
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path === '/leaderboard') {
      const res = await fetch(`${BACKEND}/leaderboard`);
      return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path.startsWith('/tickets/my/')) {
      const id = path.replace('/tickets/my/', '');
      if (!/^\d+$/.test(id)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
      const res = await fetch(`${BACKEND}/tickets/my/${id}`);
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'GET' && path.startsWith('/tickets/')) {
      const tid = path.replace('/tickets/', '');
      const qs  = event.queryStringParameters || {};
      const did = qs.discord_id || '';
      if (!/^\d+$/.test(did)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
      const res = await fetch(`${BACKEND}/tickets/${tid}?discord_id=${did}`);
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'POST' && path === '/tickets/open') {
      const res = await fetch(`${BACKEND}/tickets/open`, { method:'POST', headers:{'Content-Type':'application/json'}, body:event.body });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'POST' && path === '/tickets/message') {
      const res = await fetch(`${BACKEND}/tickets/message`, { method:'POST', headers:{'Content-Type':'application/json'}, body:event.body });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'POST' && path === '/tickets/action') {
      const res = await fetch(`${BACKEND}/tickets/action`, { method:'POST', headers:{'Content-Type':'application/json'}, body:event.body });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'POST' && path === '/tickets/all') {
      const res = await fetch(`${BACKEND}/tickets/all`, { method:'POST', headers:{'Content-Type':'application/json'}, body:event.body });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'POST' && path === '/admin') {
      const res = await fetch(`${BACKEND}/admin`, { method:'POST', headers:{'Content-Type':'application/json'}, body:event.body });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }
    if (event.httpMethod === 'POST') {
      const res = await fetch(`${BACKEND}/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body:event.body });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
