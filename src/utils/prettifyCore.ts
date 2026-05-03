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

/**
 * Formatter used inside the Prettier web worker (blob origin).
 * Keep WASM-heavy paths (e.g. Ruff) out of here — they belong in `prettify` on the main thread.
 */
export async function prettifyCore(language: string, value: string) {
  const lang = (language || "").toLowerCase();

  if (lang === "json") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch (e) {
      throw new Error(
        `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  if (lang === "toml") {
    return value;
  }

  if (lang === "sql") {
    try {
      return format(value, { language: language as any });
    } catch (e) {
      throw new Error(
        `SQL format failed: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  if (lang === "go") {
    const out = gofmt(value);
    return typeof out === "string" ? out : value;
  }

  const parser = resolvePrettierParser(language);
  if (!parser) {
    return value;
  }

  try {
    return await prettier.format(value, {
      parser,
      plugins: PLUGINS,
      semi: false,
    });
  } catch (e) {
    throw new Error(
      `Prettier (${parser}): ${e instanceof Error ? e.message : String(e)}`
    );
  }
}
