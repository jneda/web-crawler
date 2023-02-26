const { normalizeURL } = require("./crawl");

test("normalizeURL strip hhtps protocol", () => {
  const input = "https://blog.boot.dev/hello";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/hello";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip hhtp protocol", () => {
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