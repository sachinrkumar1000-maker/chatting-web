const BACKEND = process.env.BACKEND_URL;

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

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/register', '') || '/';
    const qs   = event.queryStringParameters || {};

    // ── GET ROUTES ────────────────────────────────────────────────────────────
    if (event.httpMethod === 'GET') {

      if (path === '/' || path === '') {
        const res = await fetch(`${BACKEND}/state`);
        return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
      }

      if (path.startsWith('/my-registrations/')) {
        const id = path.replace('/my-registrations/', '');
        if (!/^\d+$/.test(id)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
        const res = await fetch(`${BACKEND}/my-registrations/${id}`);
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path.startsWith('/history/')) {
        const id = path.replace('/history/', '');
        if (!/^\d+$/.test(id)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
        const res = await fetch(`${BACKEND}/history/${id}`);
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path === '/leaderboard') {
        const res = await fetch(`${BACKEND}/leaderboard`);
        return { statusCode: 200, headers, body: JSON.stringify(await res.json()) };
      }

      if (path.startsWith('/tickets/my/')) {
        const id = path.replace('/tickets/my/', '');
        if (!/^\d+$/.test(id)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
        const res = await fetch(`${BACKEND}/tickets/my/${id}`);
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path.startsWith('/tickets/')) {
        const tid = path.replace('/tickets/', '');
        const did = qs.discord_id || '';
        if (!/^\d+$/.test(did)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
        const res = await fetch(`${BACKEND}/tickets/${tid}?discord_id=${did}`);
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      // Ban check — called by frontend on page load
      if (path === '/check-ban') {
        const did = qs.discord_id || '';
        if (!/^\d+$/.test(did)) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid ID' }) };
        const res = await fetch(`${BACKEND}/check-ban?discord_id=${did}`);
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }
    }

    // ── POST ROUTES ───────────────────────────────────────────────────────────
    if (event.httpMethod === 'POST') {

      if (path === '/tickets/open') {
        const res = await fetch(`${BACKEND}/tickets/open`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path === '/tickets/message') {
        const res = await fetch(`${BACKEND}/tickets/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path === '/tickets/action') {
        const res = await fetch(`${BACKEND}/tickets/action`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path === '/tickets/all') {
        const res = await fetch(`${BACKEND}/tickets/all`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path === '/admin') {
        const res = await fetch(`${BACKEND}/admin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      // Ban management routes
      if (path === '/admin/ban') {
        const res = await fetch(`${BACKEND}/admin/ban`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path === '/admin/unban') {
        const res = await fetch(`${BACKEND}/admin/unban`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      if (path === '/admin/bans') {
        const res = await fetch(`${BACKEND}/admin/bans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
        return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
      }

      // Default — register/cancel
      const res = await fetch(`${BACKEND}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: event.body });
      return { statusCode: res.status, headers, body: JSON.stringify(await res.json()) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
