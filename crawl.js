const { JSDOM } = require("jsdom");

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];

  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const linkElement of linkElements) {
    let urlString = linkElement.href;

    // make relative URLs absolute
    const isRelativeURL = urlString.startsWith("/");
    if (isRelativeURL) {
      urlString = `${baseURL}${urlString}`;
    }

    // check if URL is valid
    try {
      const url = new URL(urlString);
      urls.push(url.href);
    } catch (e) {
      console.log(`[getURLsFromHTML] ignoring invalid URL "${urlString}"`);
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const { hostname, pathname } = new URL(urlString);
  let normalized = `${hostname}${pathname}`;
  if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
  return normalized;
}

module.exports = { getURLsFromHTML, normalizeURL };
