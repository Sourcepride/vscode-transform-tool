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
];

export async function prettify(language: string, value: string) {
  let result;

  // TODO:  better formater
  /*
     printWidth: 80,
      tabWidth: 2,
      singleQuote: true,
      semi: true,
      useTabs: false,
  */

  if (language === "json") {
    result = JSON.stringify(JSON.parse(value), null, 2);
  } else {
    result = prettier.format(value, {
      parser:
        prettierParsers[language as unknown as keyof typeof prettierParsers] ||
        language,
      plugins: PLUGINS,
      semi: false,
    });
  }

  return result;
}
