const json = (body, init = {}) =>
  new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {})
    }
  });

const securityHeaders = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin"
};

export async function onRequest(context) {
  const response = await context.next();
  const nextHeaders = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([key, value]) => nextHeaders.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers: nextHeaders });
}

export { json };
