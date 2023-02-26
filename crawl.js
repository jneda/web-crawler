function normalizeURL(urlString) {
  const { hostname, pathname } = new URL(urlString);
  let normalized = `${hostname}${pathname}`;
  if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
  return normalized;
}

module.exports = { normalizeURL };
