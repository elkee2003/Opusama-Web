export async function handler(event, context) {
  const userAgent = event.headers['user-agent'] || '';
  const botRegex = /(googlebot|bingbot|yahoo|baiduspider|facebookexternalhit|twitterbot|slackbot|linkedinbot)/i;

  console.log("UA:", userAgent);

  if (botRegex.test(userAgent)) {
    const prerenderUrl = `https://service.prerender.io/${event.rawUrl}`;
    console.log("Fetching from Prerender:", prerenderUrl);

    const resp = await fetch(prerenderUrl, {
      headers: {
        'X-Prerender-Token': 'RsYVN1D3ptOI6hVVJ6tx'
      }
    });

    console.log("Prerender status:", resp.status);

    const body = await resp.text();
    return {
      statusCode: resp.status,
      headers: { "Content-Type": "text/html" },
      body,
    };
  }

  // Normal SPA
  const resp = await fetch(`${process.env.URL || 'https://opusama.com'}/index.html`);
  const body = await resp.text();
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body,
  };
}

// this file is not in use