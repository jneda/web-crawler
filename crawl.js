const prompt = require("prompt-sync")({ sigint: true });
const { JSDOM } = require("jsdom");

async function crawlPage(currentURL, baseURL, pagesMap) {
  if (!validateURL(currentURL)) {
    console.log(`Skipping invalid URL: "${currentURL}".`);
    return pagesMap;
  }

  const currentURLObject = new URL(currentURL);
  const baseURLObject = new URL(baseURL);

  if (currentURLObject.hostname !== baseURLObject.hostname) {
    console.log(`Skipping external URL: "${currentURL}".`);
    return pagesMap;
  }

  const normalizedURL = normalizeURL(currentURL);
  if (pagesMap[normalizedURL] > 0) {
    console.log(`Skipping already visited URL: "${currentURL}".`);
    pagesMap[normalizedURL]++;
    return pagesMap;
  }

  console.log(`Actively crawling on: "${currentURL}"...`);
  pagesMap[normalizedURL] = 1;

  try {
    const response = await fetch(currentURL);

    console.debug(">>", response.headers.get("Content-Type"));
    if (!response.headers.get("Content-Type").match(/html/)) {
      console.log(`Skipping non HTML content at URL: "${currentURL}".`);
      return pagesMap;
    }

    const html = await response.text();

    const links = getURLsFromHTML(html, baseURL);

    for (const nextLink of links) {
      const foundPages = await crawlPage(nextLink, baseURL, pagesMap);
      pagesMap = { ...pagesMap, ...foundPages };
    }
  } catch (e) {
    console.error(e.message);
  }

  return pagesMap;
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
  try {
    const { hostname, pathname } = new URL(urlString);
    let normalized = `${hostname}${pathname}`;
    if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
    return normalized;
  } catch (e) {
    console.log(`[normalizeURL]: ${e.message}.`);
    return null;
  }
}

module.exports = { crawlPage, getURLsFromHTML, validateURL, normalizeURL };
