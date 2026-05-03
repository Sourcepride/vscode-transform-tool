import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as flowPaser from "prettier/plugins/flow";
import * as graphqlParser from "prettier/plugins/graphql";
import * as htmlParser from "prettier/plugins/html";
import * as markdownParser from "prettier/plugins/markdown";
import * as postcssParser from "prettier/plugins/postcss";
import * as typescriptParser from "prettier/plugins/typescript";
import * as yamlParser from "prettier/plugins/yaml";
import prettier from "prettier/standalone";
import { format } from "sql-formatter";
import gofmt from "gofmt.js";
import javaPlugin from "prettier-plugin-java";
import initRuff, { format as formatPython } from "@wasm-fmt/ruff_fmt/vite";
import { prettierParsers } from "./prettier";

const PLUGINS = [
  prettierPluginBabel,
  prettierPluginEstree as any,
  typescriptParser,
  yamlParser,
  flowPaser,
  markdownParser,
  postcssParser,
  htmlParser,
  graphqlParser,
  javaPlugin,
];

let ruffInit: Promise<void> | null = null;

function ensureRuffInit(): Promise<void> {
  if (!ruffInit) {
    ruffInit = initRuff().then(() => undefined);
  }
  return ruffInit;
}

/**
 * Map Monaco / UI language ids to a Prettier parser that exists in our standalone
 * `plugins` list. Anything else skips Prettier (avoids "Couldn't resolve parser").
 */
function resolvePrettierParser(language: string): string | undefined {
  const key = language.toLowerCase();
  const fromMap = prettierParsers[key as keyof typeof prettierParsers];
  if (fromMap) {
    return fromMap;
  }
  const monacoToParser: Record<string, string> = {
    typescript: "typescript",
    javascript: "babel",
    jsx: "babel",
    yaml: "yaml",
    graphql: "graphql",
    css: "postcss",
    scss: "postcss",
    less: "postcss",
    html: "html",
    markdown: "markdown",
    flow: "flow",
    java: "java",
  };
  return monacoToParser[key];
}

export async function prettify(language: string, value: string) {
  if (language === "json") {
    return JSON.stringify(JSON.parse(value), null, 2);
  }

  const lang = (language || "").toLowerCase();
  if (lang === "toml") {
    return value;
  }
  if (lang === "sql") {
    return format(value, { language: language as any });
  }

  if (lang === "go") {
    const out = gofmt(value);
    return typeof out === "string" ? out : value;
  }

  if (lang === "python") {
    await ensureRuffInit();
    return formatPython(value, "snippet.py", {
      indent_style: "space",
      indent_width: 4,
      line_width: 88,
      quote_style: "double",
      magic_trailing_comma: "respect",
    });
  }

  const parser = resolvePrettierParser(language);
  if (!parser) {
    return value;
  }

  return prettier.format(value, {
    parser,
    plugins: PLUGINS,
    semi: false,
  });
}
