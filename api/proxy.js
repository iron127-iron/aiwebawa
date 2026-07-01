const AI_SERVER = 'http://chung-cht1.taiwanfrp.me:11434';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const path = req.query.path || '/';
  const target = AI_SERVER + path;

  try {
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (req.method === 'POST') {
      // Vercel may or may not parse body; handle both cases
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      if (body && typeof body === 'object') {
        options.body = JSON.stringify(body);
      }
    }

    const resp = await fetch(target, options);
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { response: text }; }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'AI server unreachable', detail: e.message });
  }
};
