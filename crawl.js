const { JSDOM } = require("jsdom");

async function crawlPage(baseURL) {
  if (!validateURL(baseURL)) {
    return console.log("[crawlPage] Invalid URL.");
  }

  const response = await fetch(baseURL);
  if (!response) {
    return console.log("[crawlPage] Could not fetch URL.");
  }

  const html = await response.text();
  const urls = getURLsFromHTML(html, baseURL)
  console.table(urls);
}

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
    const url = validateURL(urlString);
    if (url) {
      urls.push(url);
    }
  }
  return urls;
}

function validateURL(urlString) {
  try {
    const url = new URL(urlString);
    if (!url.hostname.includes(".")) {
      throw new Error("No top level domain in hostname.");
    }
    let validated = url.href;
    if (validated.endsWith("/")) validated = validated.slice(0, -1);
    // console.log(`[validateURL] parsed URL: "${validated}"`);
    return `${validated}`;
  } catch (e) {
    // console.log(`[validateURL] ignoring invalid URL: "${urlString}"`);
    return false;
  }
}

function normalizeURL(urlString) {
  const { hostname, pathname } = new URL(urlString);
  let normalized = `${hostname}${pathname}`;
  if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
  return normalized;
}

module.exports = { crawlPage, getURLsFromHTML, validateURL, normalizeURL };
