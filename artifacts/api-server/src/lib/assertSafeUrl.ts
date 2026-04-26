import dns from "dns/promises";
import ipaddr from "ipaddr.js";

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^metadata\.google\.internal$/i,
];

/**
 * CIDR ranges that are blocked for outbound requests.
 * Covers loopback, private (RFC1918), link-local, CGNAT, unique-local (ULA),
 * IPv4-mapped IPv6, documentation, and cloud metadata ranges.
 */
const BLOCKED_CIDRS = [
  // IPv4
  "0.0.0.0/8",        // "This" network
  "10.0.0.0/8",       // RFC1918 private
  "100.64.0.0/10",    // CGNAT (RFC6598)
  "127.0.0.0/8",      // Loopback
  "169.254.0.0/16",   // Link-local / AWS+GCP metadata (169.254.169.254)
  "172.16.0.0/12",    // RFC1918 private
  "192.0.0.0/24",     // IETF protocol assignments
  "192.168.0.0/16",   // RFC1918 private
  "198.18.0.0/15",    // Benchmark testing
  "198.51.100.0/24",  // Documentation (TEST-NET-2)
  "203.0.113.0/24",   // Documentation (TEST-NET-3)
  "224.0.0.0/4",      // Multicast
  "240.0.0.0/4",      // Reserved
  "255.255.255.255/32",

  // IPv6
  "::1/128",           // Loopback
  "fc00::/7",          // Unique-local (ULA)
  "fe80::/10",         // Link-local
  "ff00::/8",          // Multicast
  "64:ff9b::/96",      // IPv4/IPv6 translation
  "::ffff:0:0/96",     // IPv4-mapped IPv6 (covers ::ffff:127.x, ::ffff:10.x, etc.)
  "2001:db8::/32",     // Documentation
  "100::/64",          // Discard
] as const;

const parsedBlockedCidrs = BLOCKED_CIDRS.map((cidr) => ipaddr.parseCIDR(cidr));

function isBlockedAddress(address: string): boolean {
  let parsed: ipaddr.IPv4 | ipaddr.IPv6;
  try {
    parsed = ipaddr.parse(address);
  } catch {
    return true;
  }

  // Unwrap IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1) before checking IPv4 ranges
  const normalized =
    parsed.kind() === "ipv6" && (parsed as ipaddr.IPv6).isIPv4MappedAddress()
      ? (parsed as ipaddr.IPv6).toIPv4Address()
      : parsed;

  for (const [cidrAddr, prefixLen] of parsedBlockedCidrs) {
    if (normalized.kind() !== cidrAddr.kind()) continue;
    if (normalized.match(cidrAddr, prefixLen)) return true;
  }

  return false;
}

/**
 * Validates a URL at connection time by intercepting Node's DNS resolution.
 * Pass this as the `lookup` option to http.request / http.get calls to close
 * the TOCTOU window between pre-flight assertSafeUrl() and actual connection.
 */
export function secureLookup(
  hostname: string,
  options: Record<string, unknown>,
  callback: (err: Error | null, address: string, family: number) => void
): void {
  dns
    .lookup(hostname, { all: true })
    .then((results) => {
      if (results.length === 0) {
        callback(new Error(`Unable to resolve hostname: ${hostname}`), "", 4);
        return;
      }
      for (const { address } of results) {
        if (isBlockedAddress(address)) {
          callback(
            new Error(`Requests to private or internal addresses are not allowed`),
            "",
            4
          );
          return;
        }
      }
      const { address, family } = results[0];
      callback(null, address, family as 4 | 6);
    })
    .catch((err: Error) => callback(err, "", 4));
}

/**
 * Pre-flight URL safety check. Validates the URL format, protocol, hostname
 * string, and all resolved IP addresses before allowing a request.
 *
 * NOTE: Always pair outbound requests with `lookup: secureLookup` to close the
 * TOCTOU window between this check and the actual TCP connection.
 */
export async function assertSafeUrl(rawUrl: string): Promise<URL> {
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

  for (const pattern of BLOCKED_HOST_PATTERNS) {
    if (pattern.test(host)) {
      throw new Error(`Requests to private or internal addresses are not allowed`);
    }
  }

  // Reject bare IP addresses that are blocked (no DNS needed)
  if (ipaddr.isValid(host)) {
    if (isBlockedAddress(host)) {
      throw new Error(`Requests to private or internal addresses are not allowed`);
    }
    return parsed;
  }

  let results: { address: string; family: number }[];
  try {
    results = await dns.lookup(host, { all: true });
  } catch {
    throw new Error(`Unable to resolve hostname: ${host}`);
  }

  if (results.length === 0) {
    throw new Error(`Unable to resolve hostname: ${host}`);
  }

  for (const { address } of results) {
    if (isBlockedAddress(address)) {
      throw new Error(`Requests to private or internal addresses are not allowed`);
    }
  }

  return parsed;
}
