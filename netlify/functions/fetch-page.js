exports.handler = async (event) => {
  const jsonHeaders = { 'Content-Type': 'application/json' };

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let url;
  try {
    ({ url } = JSON.parse(event.body || '{}'));
  } catch (e) {
    return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'Malformed request body' }) };
  }

  // Validate URL format
  if (!url || !/^https?:\/\//.test(url)) {
    return { statusCode: 400, headers: jsonHeaders, body: JSON.stringify({ error: 'Invalid URL format' }) };
  }

  try {
    // Fetch the page with a timeout (kept comfortably under Netlify's platform-level
    // function timeout so we always return valid JSON rather than a gateway error)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const response = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { statusCode: response.status, headers: jsonHeaders, body: JSON.stringify({ error: `HTTP ${response.status}` }) };
    }

    const html = await response.text();
    
    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ html }) };
  } catch (error) {
    console.error('Fetch error:', error);
    const isTimeout = error.name === 'AbortError';
    return { 
      statusCode: 500, 
      headers: jsonHeaders,
      body: JSON.stringify({ 
        error: isTimeout 
          ? 'Page took too long to respond (timed out after 6 seconds).' 
          : (error.message || 'Failed to fetch page') 
      }) 
    };
  }
};
