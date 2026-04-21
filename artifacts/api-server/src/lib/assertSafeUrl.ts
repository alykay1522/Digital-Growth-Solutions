const BLOCKED_HOSTS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^169\.254\./, // link-local
  /^::1$/,
  /^fc[0-9a-f][0-9a-f]:/i, // fc00::/7 ULA
  /^fd[0-9a-f]{2}:/i,
  /^metadata\.google\.internal$/i,
  /^169\.254\.169\.254$/, // AWS/GCP metadata
];

export function assertSafeUrl(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`Protocol not allowed: ${parsed.protocol}`);
  }

  const host = parsed.hostname.toLowerCase();
  for (const pattern of BLOCKED_HOSTS) {
    if (pattern.test(host)) {
      throw new Error(`Requests to private or internal addresses are not allowed`);
    }
  }

  return parsed;
}
