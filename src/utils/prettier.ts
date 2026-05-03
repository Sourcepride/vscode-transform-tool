export const prettierParsers = {
  css: "postcss",
  javascript: "babel",
  jsx: "babel",
  svg: "html",
  xml: "html",
  typescript: "typescript",
  java: "java",
};

export const supportedLanguages = [
  "json",
  "babylon",
  "html",
  "postcss",
  "graphql",
  "markdown",
  "yaml",
  "typescript",
  "flow",
  "python",
  "go",
  ...Object.keys(prettierParsers),
];
