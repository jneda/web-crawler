const { crawlPage, normalizeURL } = require("./crawl");

function main() {
  if (process.argv.length < 3) {
    console.log("No website provided.");
    process.exit(1);
  }

  if (process.argv.length > 3) {
    console.log("Too many command line arguments.");
    process.exit(1);
  }

  const urlString = process.argv[2];

  console.log(`Starting crawl of ${urlString}...`);

  let baseURL;
  try {
    baseURL = normalizeURL(urlString);
    if (baseURL) console.log(baseURL);
  } catch (e) {
    console.error(`[main]: ${e.message}.`);
    process.exit(1);
  }

  crawlPage(baseURL);
}

main();
