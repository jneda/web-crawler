const { crawlPage, validateURL } = require("./crawl");

function main() {
  const args = process.argv;
  if (args.length !== 3) {
    let message;
    if (args.length < 3) {
      message = "Too few";
    } else {
      message = "Too many";
    }
    return console.log(`${message} arguments.`);
  }

  const urlString = args[2];
  if (!validateURL(urlString)) {
    return console.log("Invalid URL.");
  }

  console.log(`Crawling on ${urlString}...`);
  crawlPage(urlString);
}

main();
