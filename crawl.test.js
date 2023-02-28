const { getURLsFromHTML, validateURL, normalizeURL } = require("./crawl");

test("normalizeURL strip https protocol", () => {
  const input = "https://blog.boot.dev/hello";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/hello";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip http protocol", () => {
  const input = "http://blog.boot.dev/hello";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/hello";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://blog.boot.dev/hello/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/hello";
  expect(actual).toEqual(expected);
});

test("normalizeURL to lowercase", () => {
  const input = "https://BLOG.boot.dev/hello";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/hello";
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML get absolute URL", () => {
  const htmlBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/">Boot.dev Blog</a>
      </body>
    </html>
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = ["https://blog.boot.dev"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML get none", () => {
  const htmlBody = `
    <html>
      <body>
        <h1>Bonjour tout le monde !</h1>
      </body>
    </html>
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML get relative URL", () => {
  const htmlBody = `
    <html>
      <body>
        <a href="/posts/">Boot.dev Blog</a>
      </body>
    </html>
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = ["https://blog.boot.dev/posts"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML get both absolute and relative URL", () => {
  const htmlBody = `
    <html>
      <body>
        <a href="https://blog.boot.dev/posts/1">Boot.dev Blog</a>
        <a href="/posts/2">Boot.dev Blog</a>
      </body>
    </html>
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = [
    "https://blog.boot.dev/posts/1",
    "https://blog.boot.dev/posts/2",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML don't get invalid URL", () => {
  const htmlBody = `
    <html>
      <body>
        <a href="invalid">Invalid URL</a>
      </body>
    </html>
  `;
  const baseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});

test("validateURL returns valid URL string", () => {
  const urlString = "https://blog.boot.dev";
  const actual = validateURL(urlString);
  const expected = "https://blog.boot.dev";
  expect(actual).toEqual(expected);
});

test("validateURL returns false when given invalid URL string", () => {
  const urlString = "https://caca";
  const actual = validateURL(urlString);
  const expected = false;
  expect(actual).toEqual(expected);
});
