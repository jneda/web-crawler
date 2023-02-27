const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
  if (!currentURL) {
    console.log(`[crawlPage] Invalid URL provided, aborting.`);
    return;
  }

  console.log(`[crawlPage] Starting crawl of ${currentURL}...`);

  try {
    const response = await fetch(`https://${currentURL}`);

    if (response.status !== 200) {
      console.log(
        `[crawlPage] fetch failed with status code ${response.status} on page: ${currentURL}.`
      );
      return;
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType.match(/html/)) {
      console.log(
        `[crawlPage] Fetched content is not HTML but instead of type: "${contentType}" on page: "${currentURL}".`
      );
      return;
    }

    const html = await response.text();
    // console.log(`[crawlPage] Response body:\n${html}`);
  } catch (e) {
    console.log(`[crawlPage] error: ${e.message} on page: ${currentURL}.`);
  }
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
  try {
    const { hostname, pathname } = new URL(urlString);
    let normalized = `${hostname}${pathname}`;
    if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
    return normalized;
  } catch (e) {
    console.log(`[nomralizeURL]: ${e.message}.`);
    return null;
  }
}

module.exports = { crawlPage, getURLsFromHTML, normalizeURL };
